import "server-only";

import { Prisma, type ProgressTaskStatus } from "@prisma/client";

import { sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

export const MAX_SUB_HOURS = 8;

export function clampHours(value: number | null | undefined): number | null {
  if (value == null || !Number.isFinite(value)) return null;
  return Math.min(MAX_SUB_HOURS, Math.max(0, Math.round(value)));
}

/** Round to 2 decimal places for weight/progress. */
export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/**
 * Distribute weights evenly:
 * - each parent gets 100 / parentCount
 * - each child under a parent gets parentWeight / childCount
 * - parent without children keeps full parent weight (leaf)
 */
export function distributeWeights(parentCount: number, childCounts: number[]) {
  if (parentCount <= 0) return { parentWeights: [] as number[], childWeights: [] as number[][] };
  const parentWeight = round2(100 / parentCount);
  const parentWeights = Array.from({ length: parentCount }, (_, i) =>
    i === parentCount - 1 ? round2(100 - parentWeight * (parentCount - 1)) : parentWeight
  );
  const childWeights = parentWeights.map((pw, i) => {
    const n = childCounts[i] ?? 0;
    if (n <= 0) return [] as number[];
    const each = round2(pw / n);
    return Array.from({ length: n }, (_, j) =>
      j === n - 1 ? round2(pw - each * (n - 1)) : each
    );
  });
  return { parentWeights, childWeights };
}

export async function recalculateOrderProgress(orderId: string) {
  const tasks = await prisma.orderProgressTask.findMany({
    where: { orderId },
    select: {
      id: true,
      parentId: true,
      status: true,
      weightPercent: true,
    },
  });

  const parentIds = new Set(tasks.filter((t) => !t.parentId).map((t) => t.id));
  const childrenByParent = new Map<string, typeof tasks>();
  for (const t of tasks) {
    if (!t.parentId) continue;
    const list = childrenByParent.get(t.parentId) ?? [];
    list.push(t);
    childrenByParent.set(t.parentId, list);
  }

  // Leaf = child tasks, OR parents with no children
  let completed = 0;
  for (const parentId of parentIds) {
    const children = childrenByParent.get(parentId) ?? [];
    if (children.length === 0) {
      const parent = tasks.find((t) => t.id === parentId);
      if (parent?.status === "COMPLETED") {
        completed += Number(parent.weightPercent);
      }
    } else {
      for (const child of children) {
        if (child.status === "COMPLETED") {
          completed += Number(child.weightPercent);
        }
      }
    }
  }

  const progressPercent = new Prisma.Decimal(round2(Math.min(100, Math.max(0, completed))));

  // Sync parent status from children
  for (const parentId of parentIds) {
    const children = childrenByParent.get(parentId) ?? [];
    if (children.length === 0) continue;
    const allDone = children.every((c) => c.status === "COMPLETED");
    const anyStarted = children.some(
      (c) => c.status === "IN_PROGRESS" || c.status === "COMPLETED"
    );
    const nextStatus: ProgressTaskStatus = allDone
      ? "COMPLETED"
      : anyStarted
        ? "IN_PROGRESS"
        : "NOT_STARTED";
    await prisma.orderProgressTask.update({
      where: { id: parentId },
      data: {
        status: nextStatus,
        completedAt: allDone ? new Date() : null,
        ...(!anyStarted ? { startedAt: null } : {}),
      },
    });
    if (anyStarted) {
      await prisma.orderProgressTask.updateMany({
        where: { id: parentId, startedAt: null },
        data: { startedAt: new Date() },
      });
    }
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { progressPercent },
  });

  return progressPercent;
}

export async function applyWbsTemplateToOrder(orderId: string, templateId: string) {
  const [order, template] = await Promise.all([
    prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, createdAt: true },
    }),
    prisma.wbsTemplate.findUnique({
      where: { id: templateId },
      include: {
        items: {
          where: { parentId: null },
          orderBy: { sortOrder: "asc" },
          include: {
            children: { orderBy: { sortOrder: "asc" } },
          },
        },
      },
    }),
  ]);

  if (!order) throw new Error("ORDER_NOT_FOUND");
  if (!template || !template.active) throw new Error("TEMPLATE_NOT_FOUND");
  if (template.items.length === 0) throw new Error("TEMPLATE_EMPTY");

  const existing = await prisma.orderProgressTask.count({ where: { orderId } });
  if (existing > 0) throw new Error("PROGRESS_ALREADY_EXISTS");

  const childCounts = template.items.map((p) => p.children.length);
  const { parentWeights, childWeights } = distributeWeights(
    template.items.length,
    childCounts
  );

  const daysPerParent = Math.max(1, Math.floor(template.estimatedDays / template.items.length));
  const endDate = new Date(order.createdAt);
  endDate.setDate(endDate.getDate() + template.estimatedDays);

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: {
        wbsTemplateId: template.id,
        estimatedDays: template.estimatedDays,
        estimatedEndDate: endDate,
        progressPercent: 0,
      },
    });

    for (let i = 0; i < template.items.length; i++) {
      const parentItem = template.items[i];
      const parent = await tx.orderProgressTask.create({
        data: {
          orderId,
          title: parentItem.title,
          sortOrder: parentItem.sortOrder,
          weightPercent: parentWeights[i] ?? 0,
          estimatedDays: daysPerParent,
          status: "NOT_STARTED",
        },
      });

      const kids = parentItem.children;
      const weights = childWeights[i] ?? [];
      for (let j = 0; j < kids.length; j++) {
        const child = kids[j];
        await tx.orderProgressTask.create({
          data: {
            orderId,
            parentId: parent.id,
            title: child.title,
            sortOrder: child.sortOrder,
            weightPercent: weights[j] ?? 0,
            estimatedHours: clampHours(child.estimatedHours ?? 8),
            status: "NOT_STARTED",
          },
        });
      }
    }
  });
}

export async function notifyProgressCompleted(opts: {
  orderId: string;
  orderNumber: string;
  userId: string | null;
  taskTitle: string;
  parentTitle?: string | null;
  progressPercent: number;
}) {
  if (!opts.userId) return;

  const user = await prisma.user.findUnique({
    where: { id: opts.userId },
    select: { email: true, name: true },
  });
  if (!user) return;

  const linkUrl = `/profile/orders/${opts.orderId}`;
  const detail = opts.parentTitle
    ? `${opts.parentTitle} → ${opts.taskTitle}`
    : opts.taskTitle;
  const title = `Progress PO ${opts.orderNumber} diperbarui`;
  const body = `${detail} selesai. Progress keseluruhan: ${opts.progressPercent}%.`;

  await prisma.userNotification.create({
    data: {
      userId: opts.userId,
      title,
      body,
      linkUrl,
      orderId: opts.orderId,
    },
  });

  await sendMail({
    to: user.email,
    subject: title,
    text: `Halo ${user.name},\n\n${body}\n\nLihat detail: ${process.env.NEXT_PUBLIC_APP_URL ?? ""}${linkUrl}`,
    html: `<p>Halo ${user.name},</p><p>${body}</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL ?? ""}${linkUrl}">Lihat progress pesanan</a></p>`,
  });
}

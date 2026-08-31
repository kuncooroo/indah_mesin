"use server";

import { revalidatePath } from "next/cache";
import type { ProgressTaskStatus } from "@prisma/client";

import { fail, ok, type ActionResult } from "@/lib/action-result";
import { getAdminSession, isAdminRole } from "@/lib/auth";
import {
  applyWbsTemplateToOrder,
  clampHours,
  MAX_SUB_HOURS,
  notifyProgressCompleted,
  recalculateOrderProgress,
} from "@/lib/order-progress";
import { prisma } from "@/lib/prisma";
import { runAdminAction } from "@/lib/prisma-errors";
import { requireTrimmed } from "@/lib/admin/validation";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session?.user || !isAdminRole(session.user.role)) {
    throw new Error("Unauthorized");
  }
  return session;
}

function revalidateOrderProgress(orderId: string) {
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}/progress`);
  revalidatePath("/admin/wbs-templates");
  revalidatePath("/profile/orders");
  revalidatePath(`/profile/orders/${orderId}`);
}

// ——— WBS Templates ———

export async function createWbsTemplate(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const name = requireTrimmed(formData.get("name"), "name", "Nama template", {
      min: 2,
      max: 120,
    });
    if (!name.ok) return name.result;
    const days = parseInt(String(formData.get("estimatedDays") ?? "30"), 10);
    const estimatedDays = Number.isFinite(days) && days > 0 ? days : 30;
    const description = String(formData.get("description") ?? "").trim() || null;

    await prisma.wbsTemplate.create({
      data: {
        name: name.value,
        description,
        estimatedDays,
        active: formData.get("active") === "on" || formData.get("active") === "true",
      },
    });
    revalidatePath("/admin/wbs-templates");
    return ok("Template WBS dibuat.");
  }, "Template WBS dibuat.");
}

export async function updateWbsTemplate(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return fail("ID tidak valid.");
    const name = requireTrimmed(formData.get("name"), "name", "Nama template", {
      min: 2,
      max: 120,
    });
    if (!name.ok) return name.result;
    const days = parseInt(String(formData.get("estimatedDays") ?? "30"), 10);
    const estimatedDays = Number.isFinite(days) && days > 0 ? days : 30;

    await prisma.wbsTemplate.update({
      where: { id },
      data: {
        name: name.value,
        description: String(formData.get("description") ?? "").trim() || null,
        estimatedDays,
        active: formData.get("active") === "on" || formData.get("active") === "true",
      },
    });
    revalidatePath("/admin/wbs-templates");
    revalidatePath(`/admin/wbs-templates/${id}`);
    return ok("Template diperbarui.");
  }, "Template diperbarui.");
}

export async function deleteWbsTemplate(id: string): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    await prisma.wbsTemplate.delete({ where: { id } });
    revalidatePath("/admin/wbs-templates");
    return ok("Template dihapus.");
  }, "Template dihapus.");
}

export async function createWbsTemplateItem(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const templateId = String(formData.get("templateId") ?? "");
    if (!templateId) return fail("Template tidak valid.");
    const title = requireTrimmed(formData.get("title"), "title", "Judul", {
      min: 2,
      max: 200,
    });
    if (!title.ok) return title.result;

    const parentId = String(formData.get("parentId") ?? "").trim() || null;
    const sortRaw = parseInt(String(formData.get("sortOrder") ?? "0"), 10);
    const sortOrder = Number.isFinite(sortRaw) ? sortRaw : 0;

    let estimatedHours: number | null = null;
    if (parentId) {
      const hours = parseInt(String(formData.get("estimatedHours") ?? "8"), 10);
      estimatedHours = clampHours(Number.isFinite(hours) ? hours : 8);
      if (estimatedHours != null && estimatedHours > MAX_SUB_HOURS) {
        return fail(`Jam kerja maksimal ${MAX_SUB_HOURS} jam.`);
      }
    }

    if (parentId) {
      const parent = await prisma.wbsTemplateItem.findFirst({
        where: { id: parentId, templateId, parentId: null },
      });
      if (!parent) return fail("Parent tidak ditemukan.");
    }

    await prisma.wbsTemplateItem.create({
      data: {
        templateId,
        parentId,
        title: title.value,
        sortOrder,
        estimatedHours,
      },
    });
    revalidatePath(`/admin/wbs-templates/${templateId}`);
    return ok(parentId ? "Sub-tugas ditambahkan." : "Fase parent ditambahkan.");
  }, "Item ditambahkan.");
}

export async function updateWbsTemplateItem(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return fail("ID tidak valid.");
    const title = requireTrimmed(formData.get("title"), "title", "Judul", {
      min: 2,
      max: 200,
    });
    if (!title.ok) return title.result;

    const existing = await prisma.wbsTemplateItem.findUnique({ where: { id } });
    if (!existing) return fail("Item tidak ditemukan.");

    const sortRaw = parseInt(String(formData.get("sortOrder") ?? String(existing.sortOrder)), 10);
    let estimatedHours = existing.estimatedHours;
    if (existing.parentId) {
      const hours = parseInt(String(formData.get("estimatedHours") ?? "8"), 10);
      estimatedHours = clampHours(Number.isFinite(hours) ? hours : 8);
    } else {
      estimatedHours = null;
    }

    await prisma.wbsTemplateItem.update({
      where: { id },
      data: {
        title: title.value,
        sortOrder: Number.isFinite(sortRaw) ? sortRaw : existing.sortOrder,
        estimatedHours,
      },
    });
    revalidatePath(`/admin/wbs-templates/${existing.templateId}`);
    return ok("Item diperbarui.");
  }, "Item diperbarui.");
}

export async function deleteWbsTemplateItem(id: string): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const existing = await prisma.wbsTemplateItem.findUnique({ where: { id } });
    if (!existing) return fail("Item tidak ditemukan.");
    await prisma.wbsTemplateItem.delete({ where: { id } });
    revalidatePath(`/admin/wbs-templates/${existing.templateId}`);
    return ok("Item dihapus.");
  }, "Item dihapus.");
}

// ——— Order progress ———

export async function applyTemplateToOrder(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const orderId = String(formData.get("orderId") ?? "");
    const templateId = String(formData.get("templateId") ?? "");
    if (!orderId || !templateId) return fail("Order atau template tidak valid.");

    try {
      await applyWbsTemplateToOrder(orderId, templateId);
    } catch (e) {
      const code = e instanceof Error ? e.message : "";
      if (code === "PROGRESS_ALREADY_EXISTS") {
        return fail("Order ini sudah punya progress. Hapus dulu jika ingin apply ulang.");
      }
      if (code === "TEMPLATE_EMPTY") return fail("Template belum punya item.");
      if (code === "TEMPLATE_NOT_FOUND") return fail("Template tidak ditemukan.");
      if (code === "ORDER_NOT_FOUND") return fail("Order tidak ditemukan.");
      throw e;
    }

    revalidateOrderProgress(orderId);
    return ok("Template WBS diterapkan ke order.");
  }, "Template diterapkan.");
}

export async function updateProgressTask(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return fail("ID tidak valid.");

    const task = await prisma.orderProgressTask.findUnique({
      where: { id },
      include: {
        parent: { select: { title: true } },
        children: { select: { id: true } },
        order: { select: { id: true, orderNumber: true, userId: true } },
      },
    });
    if (!task) return fail("Task tidak ditemukan.");

    // Parent with children: status is derived — only allow note/title edits
    const isParentWithChildren = !task.parentId && task.children.length > 0;
    const statusRaw = String(formData.get("status") ?? task.status) as ProgressTaskStatus;
    const allowed: ProgressTaskStatus[] = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"];
    const status = allowed.includes(statusRaw) ? statusRaw : task.status;

    let actualHours: number | null = task.actualHours;
    if (task.parentId) {
      const hours = parseInt(String(formData.get("actualHours") ?? ""), 10);
      if (Number.isFinite(hours)) {
        actualHours = clampHours(hours);
      }
      if (status === "COMPLETED" && (actualHours == null || actualHours <= 0)) {
        return fail(`Isi jam kerja aktual (1–${MAX_SUB_HOURS} jam) saat menyelesaikan sub-tugas.`);
      }
    }

    const photoUrl = String(formData.get("photoUrl") ?? "").trim();
    const photoCaption = String(formData.get("photoCaption") ?? "").trim() || null;
    const note = String(formData.get("note") ?? "").trim() || null;
    const prevStatus = task.status;

    if (isParentWithChildren && status !== task.status) {
      return fail("Status fase parent mengikuti sub-tugas. Update sub-tugas saja.");
    }

    await prisma.orderProgressTask.update({
      where: { id },
      data: {
        status: isParentWithChildren ? task.status : status,
        actualHours: task.parentId ? actualHours : null,
        note,
        startedAt:
          status === "IN_PROGRESS" || status === "COMPLETED"
            ? task.startedAt ?? new Date()
            : null,
        completedAt: status === "COMPLETED" ? new Date() : null,
      },
    });

    if (photoUrl && (task.parentId || !isParentWithChildren)) {
      await prisma.orderProgressPhoto.create({
        data: { taskId: id, url: photoUrl, caption: photoCaption },
      });
    }

    const progress = await recalculateOrderProgress(task.orderId);
    const progressNum = Number(progress);

    if (status === "COMPLETED" && prevStatus !== "COMPLETED" && task.parentId) {
      await notifyProgressCompleted({
        orderId: task.order.id,
        orderNumber: task.order.orderNumber,
        userId: task.order.userId,
        taskTitle: task.title,
        parentTitle: task.parent?.title,
        progressPercent: progressNum,
      });
    }

    revalidateOrderProgress(task.orderId);
    return ok("Progress diperbarui.");
  }, "Progress diperbarui.");
}

export async function addProgressPhoto(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const taskId = String(formData.get("taskId") ?? "");
    const url = String(formData.get("photoUrl") ?? "").trim();
    if (!taskId || !url) return fail("Task atau URL foto tidak valid.");

    const task = await prisma.orderProgressTask.findUnique({
      where: { id: taskId },
      select: { orderId: true },
    });
    if (!task) return fail("Task tidak ditemukan.");

    await prisma.orderProgressPhoto.create({
      data: {
        taskId,
        url,
        caption: String(formData.get("caption") ?? "").trim() || null,
      },
    });
    revalidateOrderProgress(task.orderId);
    return ok("Foto ditambahkan.");
  }, "Foto ditambahkan.");
}

export async function deleteProgressPhoto(id: string): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const photo = await prisma.orderProgressPhoto.findUnique({
      where: { id },
      include: { task: { select: { orderId: true } } },
    });
    if (!photo) return fail("Foto tidak ditemukan.");
    await prisma.orderProgressPhoto.delete({ where: { id } });
    revalidateOrderProgress(photo.task.orderId);
    return ok("Foto dihapus.");
  }, "Foto dihapus.");
}

export async function clearOrderProgress(orderId: string): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    await prisma.orderProgressTask.deleteMany({ where: { orderId } });
    await prisma.order.update({
      where: { id: orderId },
      data: {
        progressPercent: 0,
        wbsTemplateId: null,
        estimatedDays: null,
        estimatedEndDate: null,
      },
    });
    revalidateOrderProgress(orderId);
    return ok("Progress order dihapus.");
  }, "Progress dihapus.");
}

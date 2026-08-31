import { notFound, redirect } from "next/navigation";

import {
  OrderProgressClient,
  type OrderProgressPayload,
} from "@/components/storefront/profile/order-progress-client";
import { getStorefrontSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function ProfileOrderDetailPage({ params }: PageProps) {
  const session = await getStorefrontSession();
  if (!session?.user?.id) {
    redirect("/profile");
  }

  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
    include: {
      items: { include: { product: { select: { name: true } } } },
      progressTasks: {
        where: { parentId: null },
        orderBy: { sortOrder: "asc" },
        include: {
          children: {
            orderBy: { sortOrder: "asc" },
            include: {
              photos: { orderBy: { createdAt: "desc" } },
            },
          },
        },
      },
    },
  });

  if (!order) notFound();

  const idr = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  const payload: OrderProgressPayload = {
    id: order.id,
    poNumber: order.orderNumber,
    dateLabel: new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(order.createdAt),
    progressPercent: Number(order.progressPercent),
    estimatedDays: order.estimatedDays,
    estimatedEndLabel: order.estimatedEndDate
      ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(order.estimatedEndDate)
      : null,
    description:
      order.items.map((item) => item.product.name).join(", ") || "Purchase Order",
    amount: idr.format(Number(order.totalEstimatedPrice)),
    parents: order.progressTasks.map((parent) => ({
      id: parent.id,
      title: parent.title,
      status: parent.status,
      weightPercent: Number(parent.weightPercent),
      estimatedDays: parent.estimatedDays,
      children: parent.children.map((child) => ({
        id: child.id,
        title: child.title,
        status: child.status,
        weightPercent: Number(child.weightPercent),
        estimatedHours: child.estimatedHours,
        actualHours: child.actualHours,
        completedAt: child.completedAt?.toISOString() ?? null,
        note: child.note,
        photos: child.photos.map((p) => ({
          id: p.id,
          url: p.url,
          caption: p.caption,
        })),
      })),
    })),
  };

  return <OrderProgressClient order={payload} />;
}

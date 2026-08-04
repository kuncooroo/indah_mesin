import { NextResponse } from "next/server";
import { getStorefrontSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getStorefrontSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  const rows = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  const idr = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
  return NextResponse.json({
    orders: rows.map((row) => ({
      id: row.id,
      poNumber: row.orderNumber,
      dateLabel: new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(row.createdAt),
      status:
        row.status === "CANCELLED"
          ? "cancelled"
          : row.status === "APPROVED"
            ? "completed"
            : "processed",
      description: row.items.map((item) => item.product.name).join(", ") || "Purchase Order",
      amount: idr.format(Number(row.totalEstimatedPrice)),
    })),
  });
}

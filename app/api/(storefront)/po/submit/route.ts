import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getStorefrontSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPoBuyerContext } from "@/lib/storefront/po-buyer-context";

const submitPoSchema = z.object({
  productId: z.string().trim().min(1).max(150),
  quantity: z.number().int().min(1).max(999),
  voltage: z.string().trim().min(1).max(150),
  requestId: z.string().uuid(),
});

function createOrderNumber(userId: string, requestId: string) {
  const digest = createHash("sha256")
    .update(`${userId}:${requestId}`)
    .digest("hex")
    .slice(0, 12)
    .toUpperCase();
  return `PO-${digest}`;
}

function orderResponse(order: { id: string; orderNumber: string }, status = 201) {
  return NextResponse.json(
    {
      orderId: order.id,
      orderNumber: order.orderNumber,
      documentUrl: `/po-preview/pdf?order=${encodeURIComponent(order.id)}`,
    },
    { status }
  );
}

export async function POST(request: Request) {
  const session = await getStorefrontSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Silakan login untuk membuat PO." }, { status: 401 });
  }

  const parsed = submitPoSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Data produk atau jumlah PO tidak valid." }, { status: 400 });
  }

  const [buyer, product] = await Promise.all([
    getPoBuyerContext(session.user.id),
    prisma.product.findFirst({
      where: {
        isPublished: true,
        OR: [
          { id: parsed.data.productId },
          { slug: parsed.data.productId },
          { sku: parsed.data.productId },
        ],
      },
      select: { id: true, name: true, sku: true, price: true },
    }),
  ]);

  if (!buyer) {
    return NextResponse.json({ error: "Akun ini tidak dapat membuat PO." }, { status: 403 });
  }
  if (!buyer.poReady || !buyer.companyId || !buyer.addressId) {
    return NextResponse.json(
      {
        error: `Lengkapi ${buyer.missingFields.join(", ")} sebelum mengirim PO.`,
        code: "BUYER_DATA_INCOMPLETE",
        completionPath: buyer.completionPath,
      },
      { status: 422 }
    );
  }
  if (!product) {
    return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 });
  }

  const orderNumber = createOrderNumber(buyer.userId, parsed.data.requestId);
  const existingOrder = await prisma.order.findUnique({
    where: { orderNumber },
    select: { id: true, orderNumber: true, userId: true },
  });
  if (existingOrder) {
    if (existingOrder.userId !== buyer.userId) {
      return NextResponse.json({ error: "Nomor permintaan tidak valid." }, { status: 409 });
    }
    return orderResponse(existingOrder, 200);
  }

  const totalEstimatedPrice = product.price.mul(parsed.data.quantity);
  let order: { id: string; orderNumber: string };
  try {
    order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId: buyer.userId,
          companyId: buyer.companyId,
          shippingAddressId: buyer.addressId,
          status: "SUBMITTED_VIA_WA",
          totalEstimatedPrice,
          notes: JSON.stringify({
            requestId: parsed.data.requestId,
            voltage: parsed.data.voltage,
            buyerName: buyer.name,
            buyerPhone: buyer.phone,
            companyName: buyer.companyName,
            npwpNumber: buyer.npwpNumber,
            nibNumber: buyer.nibNumber,
            address: buyer.address,
          }),
          items: {
            create: {
              productId: product.id,
              quantity: parsed.data.quantity,
              priceAtTime: product.price,
            },
          },
        },
        select: { id: true, orderNumber: true },
      });
      const documentUrl = `/po-preview/pdf?order=${encodeURIComponent(created.id)}`;
      await tx.archiveDocument.create({
        data: {
          userId: buyer.userId,
          orderId: created.id,
          documentName: `Purchase Order ${orderNumber}`,
          documentType: "PO_DRAFT",
          fileUrl: documentUrl,
        },
      });
      await tx.activityLog.create({
        data: {
          userId: buyer.userId,
          action: "PO_SUBMITTED_VIA_WHATSAPP",
          details: JSON.stringify({
            orderId: created.id,
            orderNumber,
            productId: product.id,
          }),
        },
      });
      return created;
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const replay = await prisma.order.findUnique({
        where: { orderNumber },
        select: { id: true, orderNumber: true, userId: true },
      });
      if (replay?.userId === buyer.userId) return orderResponse(replay, 200);
    }
    throw error;
  }

  return orderResponse(order);
}

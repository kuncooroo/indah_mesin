import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getStorefrontSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPoBuyerContext, type PoBuyerContext } from "@/lib/storefront/po-buyer-context";
import { decidePoResubmit, readPoNotes } from "@/lib/storefront/po-resubmit";

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

function quotationNotes(
  buyer: PoBuyerContext,
  requestId: string,
  voltage: string,
) {
  return JSON.stringify({
    requestId,
    voltage,
    buyerName: buyer.name,
    buyerPhone: buyer.phone,
    companyName: buyer.companyName,
    npwpNumber: buyer.npwpNumber,
    nibNumber: buyer.nibNumber,
    address: buyer.address,
  });
}

const PROCESSED_PO_ERROR =
  "Purchase Order sebelumnya sudah diproses. Kirim ulang untuk membuat permintaan baru.";

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
    select: {
      id: true,
      orderNumber: true,
      userId: true,
      status: true,
      notes: true,
      items: {
        orderBy: { id: "asc" },
        take: 1,
        select: { id: true, productId: true, quantity: true },
      },
    },
  });
  if (existingOrder) {
    if (existingOrder.userId !== buyer.userId) {
      return NextResponse.json({ error: "Nomor permintaan tidak valid." }, { status: 409 });
    }
    const resolved = await resolveExistingPo(existingOrder, buyer, product, parsed.data);
    if (resolved) return resolved;
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
          notes: quotationNotes(buyer, parsed.data.requestId, parsed.data.voltage),
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
        select: {
          id: true,
          orderNumber: true,
          userId: true,
          status: true,
          notes: true,
          items: {
            orderBy: { id: "asc" },
            take: 1,
            select: { id: true, productId: true, quantity: true },
          },
        },
      });
      if (replay?.userId === buyer.userId) {
        const resolved = await resolveExistingPo(replay, buyer, product, parsed.data);
        if (resolved) return resolved;
      }
      if (replay && replay.userId !== buyer.userId) {
        return NextResponse.json({ error: "Nomor permintaan tidak valid." }, { status: 409 });
      }
    }
    throw error;
  }

  return orderResponse(order);
}

type ExistingPo = {
  id: string;
  orderNumber: string;
  status: "DRAFT" | "SUBMITTED_VIA_WA" | "NEGOTIATING" | "APPROVED" | "CANCELLED";
  notes: string | null;
  items: { id: string; productId: string; quantity: number }[];
};

async function resolveExistingPo(
  existingOrder: ExistingPo,
  buyer: PoBuyerContext,
  product: { id: string; price: Prisma.Decimal },
  submission: { requestId: string; quantity: number; voltage: string },
) {
  const notes = readPoNotes(existingOrder.notes);
  const item = existingOrder.items[0] ?? null;
  const decision = decidePoResubmit(
    {
      status: existingOrder.status,
      productId: item?.productId ?? null,
      quantity: item?.quantity ?? null,
      voltage: notes.voltage,
      notesAreSnapshot: notes.notesAreSnapshot,
    },
    {
      productId: product.id,
      quantity: submission.quantity,
      voltage: submission.voltage,
    },
  );

  if (decision === "replay") return orderResponse(existingOrder, 200);
  if (decision === "reject") {
    return NextResponse.json({ error: PROCESSED_PO_ERROR }, { status: 409 });
  }
  if (!buyer.companyId || !buyer.addressId) {
    return NextResponse.json(
      {
        error: "Lengkapi data perusahaan sebelum mengirim PO.",
        code: "BUYER_DATA_INCOMPLETE",
      },
      { status: 422 },
    );
  }

  const totalEstimatedPrice = product.price.mul(submission.quantity);
  const order = await prisma.$transaction(async (tx) => {
    if (item) {
      await tx.orderItem.update({
        where: { id: item.id },
        data: {
          productId: product.id,
          quantity: submission.quantity,
          priceAtTime: product.price,
        },
      });
    } else {
      await tx.orderItem.create({
        data: {
          orderId: existingOrder.id,
          productId: product.id,
          quantity: submission.quantity,
          priceAtTime: product.price,
        },
      });
    }

    const updated = await tx.order.update({
      where: { id: existingOrder.id },
      data: {
        status: "SUBMITTED_VIA_WA",
        companyId: buyer.companyId,
        shippingAddressId: buyer.addressId,
        totalEstimatedPrice,
        notes: quotationNotes(buyer, submission.requestId, submission.voltage),
      },
      select: { id: true, orderNumber: true },
    });
    await tx.activityLog.create({
      data: {
        userId: buyer.userId,
        action: "PO_REVISED_VIA_WHATSAPP",
        details: JSON.stringify({
          orderId: existingOrder.id,
          orderNumber: existingOrder.orderNumber,
          productId: product.id,
          quantity: submission.quantity,
          voltage: submission.voltage,
        }),
      },
    });
    return updated;
  });

  return orderResponse(order, 200);
}

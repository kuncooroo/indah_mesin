import { NextResponse } from "next/server";

import { getStorefrontSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getStorefrontSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const rows = await prisma.userNotification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadCount = await prisma.userNotification.count({
    where: { userId: session.user.id, readAt: null },
  });

  return NextResponse.json({
    unreadCount,
    notifications: rows.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      linkUrl: n.linkUrl,
      orderId: n.orderId,
      read: Boolean(n.readAt),
      createdAt: n.createdAt.toISOString(),
    })),
  });
}

export async function PATCH(request: Request) {
  const session = await getStorefrontSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    id?: string;
    markAllRead?: boolean;
  } | null;

  if (body?.markAllRead) {
    await prisma.userNotification.updateMany({
      where: { userId: session.user.id, readAt: null },
      data: { readAt: new Date() },
    });
    return NextResponse.json({ ok: true });
  }

  if (!body?.id) {
    return NextResponse.json({ error: "ID required." }, { status: 400 });
  }

  await prisma.userNotification.updateMany({
    where: { id: body.id, userId: session.user.id },
    data: { readAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}

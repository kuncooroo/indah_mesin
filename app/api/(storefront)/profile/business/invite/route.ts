import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getStorefrontSession, isStorefrontRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().toLowerCase(),
  phone: z.string().trim().max(30).optional(),
  position: z.string().trim().max(80).optional(),
});

export async function POST(request: Request) {
  const session = await getStorefrontSession();
  if (!session?.user?.id || !isStorefrontRole(session.user.role)) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const inviter = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, companyId: true, companyName: true },
  });
  if (!inviter?.companyId) {
    return NextResponse.json(
      { error: "Simpan identitas perusahaan terlebih dahulu sebelum mengundang anggota." },
      { status: 400 }
    );
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Nama dan email anggota wajib diisi dengan benar." },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existingUser) {
    return NextResponse.json(
      { error: "Email ini sudah terdaftar. Minta anggota login dengan akun tersebut." },
      { status: 409 }
    );
  }

  await prisma.teamInvite.deleteMany({
    where: {
      companyId: inviter.companyId,
      email: parsed.data.email,
      acceptedAt: null,
    },
  });

  const token = randomBytes(24).toString("hex");
  const invite = await prisma.teamInvite.create({
    data: {
      companyId: inviter.companyId,
      invitedBy: inviter.id,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      position: parsed.data.position || null,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const origin = new URL(request.url).origin;
  const inviteUrl = `${origin}/profile/invite?token=${invite.token}`;

  return NextResponse.json({
    ok: true,
    inviteUrl,
    message: "Undangan dibuat. Bagikan tautan kepada anggota tim (berlaku 7 hari).",
  });
}

export async function GET() {
  const session = await getStorefrontSession();
  if (!session?.user?.id || !isStorefrontRole(session.user.role)) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  const inviter = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { companyId: true },
  });
  if (!inviter?.companyId) return NextResponse.json({ invites: [] });

  const invites = await prisma.teamInvite.findMany({
    where: { companyId: inviter.companyId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json({ invites });
}

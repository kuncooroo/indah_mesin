import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";

import { getStorefrontSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const acceptSchema = z.object({
  token: z.string().trim().min(16),
  password: z.string().min(8).max(128),
});

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (!token) {
    return NextResponse.json({ error: "Token undangan wajib." }, { status: 400 });
  }
  const invite = await prisma.teamInvite.findUnique({
    where: { token },
    include: { company: { select: { companyName: true } } },
  });
  if (!invite || invite.acceptedAt || invite.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "Undangan tidak valid atau sudah kedaluwarsa." }, { status: 404 });
  }
  return NextResponse.json({
    name: invite.name,
    email: invite.email,
    companyName: invite.company.companyName,
    position: invite.position,
  });
}

export async function POST(request: Request) {
  const parsed = acceptSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Token dan kata sandi minimal 8 karakter wajib diisi." },
      { status: 400 }
    );
  }

  const invite = await prisma.teamInvite.findUnique({
    where: { token: parsed.data.token },
  });
  if (!invite || invite.acceptedAt || invite.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "Undangan tidak valid atau sudah kedaluwarsa." }, { status: 404 });
  }

  const existing = await prisma.user.findUnique({ where: { email: invite.email } });
  if (existing) {
    return NextResponse.json({ error: "Email undangan sudah terdaftar." }, { status: 409 });
  }

  const session = await getStorefrontSession();
  if (session?.user?.id) {
    return NextResponse.json(
      { error: "Keluar dari akun saat ini sebelum menerima undangan." },
      { status: 400 }
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        name: invite.name,
        email: invite.email,
        phone: invite.phone,
        position: invite.position,
        companyId: invite.companyId,
        password: await bcrypt.hash(parsed.data.password, 12),
        verificationStatus: "UNVERIFIED",
      },
    });
    await tx.teamInvite.update({
      where: { id: invite.id },
      data: { acceptedAt: new Date() },
    });
  });

  return NextResponse.json({ ok: true, email: invite.email });
}

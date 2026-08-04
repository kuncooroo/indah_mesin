import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  token: z.string().trim().min(20),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Token tidak valid atau kata sandi kurang dari 8 karakter." },
      { status: 400 }
    );
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { token: parsed.data.token },
  });
  if (!record || record.usedAt || record.expiresAt.getTime() < Date.now()) {
    return NextResponse.json(
      { error: "Tautan reset sudah tidak berlaku. Ajukan ulang lupa kata sandi." },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { password: await bcrypt.hash(parsed.data.password, 12) },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return NextResponse.json({ ok: true });
}

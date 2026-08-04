import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().trim().email().toLowerCase(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Masukkan email yang valid." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  // Jangan bocorkan apakah email ada atau tidak
  if (!user) {
    return NextResponse.json({
      ok: true,
      message: "Jika email terdaftar, tautan reset kata sandi telah disiapkan.",
    });
  }

  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id, usedAt: null },
  });

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  const origin = new URL(request.url).origin;
  const resetUrl = `${origin}/profile/reset-password?token=${token}`;

  return NextResponse.json({
    ok: true,
    message: "Tautan reset kata sandi siap digunakan (berlaku 1 jam).",
    resetUrl,
  });
}

import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isMailConfigured, sendMail } from "@/lib/mail";

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
      message: "If that email is registered, a password reset link has been sent.",
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

  const origin =
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    new URL(request.url).origin;
  const resetUrl = `${origin}/profile/reset-password?token=${token}`;

  const mail = await sendMail({
    to: user.email,
    subject: "Reset your MesinBagus password",
    text: [
      `Hi ${user.name},`,
      "",
      "We received a request to reset your MesinBagus account password.",
      "Open this link (valid for 1 hour):",
      resetUrl,
      "",
      "If you did not request this, you can ignore this email.",
    ].join("\n"),
    html: `
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>We received a request to reset your MesinBagus account password.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a> (valid for 1 hour).</p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  });

  if (!mail.sent) {
    if (!isMailConfigured()) {
      return NextResponse.json({
        ok: true,
        message:
          "SMTP is not configured on the server. Use the reset link below (development only).",
        resetUrl: process.env.NODE_ENV === "production" ? undefined : resetUrl,
        mailConfigured: false,
      });
    }
    return NextResponse.json(
      { error: "Failed to send the reset email. Try again or contact support." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: `A password reset link has been sent to ${user.email}. Check your inbox or spam folder.`,
    mailConfigured: true,
  });
}

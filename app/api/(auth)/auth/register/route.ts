import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registrationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  companyName: z.string().trim().min(2).max(150),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  const parsed = registrationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Masukkan nama, perusahaan, email, dan kata sandi minimal 8 karakter." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return NextResponse.json({ error: "Akun dengan email ini sudah terdaftar." }, { status: 409 });
  }

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      companyName: parsed.data.companyName,
      email: parsed.data.email,
      password: await bcrypt.hash(parsed.data.password, 12),
      role: "BUYER",
    },
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}

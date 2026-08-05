import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  formatInternationalPhone,
  parseStoredPhone,
  phoneFieldError,
} from "@/lib/storefront/country-dial-codes";

const registrationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  companyName: z.string().trim().min(2).max(150),
  email: z.email().trim().toLowerCase(),
  phone: z.string().trim().min(8).max(30),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  const parsed = registrationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          "Enter your name, company, email, phone number, and a password of at least 8 characters.",
      },
      { status: 400 }
    );
  }

  const parsedPhone = parseStoredPhone(parsed.data.phone);
  const phoneErr = phoneFieldError(parsedPhone.national, true);
  if (phoneErr) {
    return NextResponse.json({ error: phoneErr }, { status: 400 });
  }
  const phone = formatInternationalPhone(parsedPhone.dial, parsedPhone.national);

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const phoneDigits = phone.replace(/\D/g, "");
  const existingPhones = await prisma.user.findMany({
    where: { phone: { not: null } },
    select: { phone: true },
    take: 500,
  });
  if (existingPhones.some((row) => (row.phone ?? "").replace(/\D/g, "") === phoneDigits)) {
    return NextResponse.json(
      { error: "This phone number is already used by another account." },
      { status: 409 }
    );
  }

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      companyName: parsed.data.companyName,
      phone,
      company: {
        create: {
          companyName: parsed.data.companyName,
          type: "BUYER",
        },
      },
      email: parsed.data.email,
      password: await bcrypt.hash(parsed.data.password, 12),
    },
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}

import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getStorefrontSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().trim().toLowerCase(),
  phone: z.string().trim().max(30).optional(),
  avatar: z
    .string()
    .max(2_800_000)
    .refine((value) => !value || value.startsWith("data:image/"), "Invalid image")
    .optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).max(128).optional(),
});

export async function GET() {
  const session = await getStorefrontSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true, avatar: true, position: true },
  });
  return user
    ? NextResponse.json({ user })
    : NextResponse.json({ error: "Account not found." }, { status: 404 });
}

export async function PATCH(request: Request) {
  const session = await getStorefrontSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid account details." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  let password: string | undefined;
  const emailOwner = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (emailOwner && emailOwner.id !== user.id) {
    return NextResponse.json({ error: "This email is already used by another account." }, { status: 409 });
  }
  if (parsed.data.newPassword) {
    if (
      !parsed.data.currentPassword ||
      !(await bcrypt.compare(parsed.data.currentPassword, user.password))
    ) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }
    password = await bcrypt.hash(parsed.data.newPassword, 12);
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      avatar: parsed.data.avatar || undefined,
      password,
    },
    select: { name: true, email: true, phone: true, avatar: true },
  });
  return NextResponse.json({ user: updated });
}

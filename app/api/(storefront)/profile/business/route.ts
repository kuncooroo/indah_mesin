import { NextResponse } from "next/server";
import { z } from "zod";

import { getStorefrontSession, isStorefrontRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidNib, isValidNpwp, normalizeNib, normalizeNpwp } from "@/lib/storefront/legal-ids";

const companySchema = z
  .object({
    kind: z.literal("company"),
    companyName: z.string().trim().min(2).max(150),
    npwpNumber: z.string().trim().max(40),
    nibNumber: z.string().trim().max(40),
  })
  .superRefine((value, ctx) => {
    if (!isValidNpwp(value.npwpNumber)) {
      ctx.addIssue({
        code: "custom",
        path: ["npwpNumber"],
        message: "NPWP harus 15 digit (format lama) atau 16 digit.",
      });
    }
    if (!isValidNib(value.nibNumber)) {
      ctx.addIssue({
        code: "custom",
        path: ["nibNumber"],
        message: "NIB harus tepat 13 digit.",
      });
    }
  });

const addressSchema = z.object({
  label: z.string().trim().min(2).max(100),
  addressDetail: z.string().trim().min(5).max(1000),
  city: z.string().trim().min(2).max(300),
  postalCode: z.string().trim().max(20).optional(),
  isPrimary: z.boolean().optional(),
});

const addressUpdateSchema = addressSchema.extend({
  kind: z.literal("address"),
  id: z.string().uuid(),
});

async function getProfileUser() {
  const session = await getStorefrontSession();
  if (!session?.user?.id) return null;
  if (!isStorefrontRole(session.user.role)) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      position: true,
      companyId: true,
      companyName: true,
      company: {
        include: {
          addresses: { orderBy: [{ isPrimary: "desc" }, { label: "asc" }] },
          users: {
            orderBy: { createdAt: "asc" },
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              position: true,
              verificationStatus: true,
              avatar: true,
            },
          },
        },
      },
    },
  });
  return user ? { session, user } : null;
}

function unauthorized() {
  return NextResponse.json({ error: "Authentication required." }, { status: 401 });
}

export async function GET() {
  const profile = await getProfileUser();
  if (!profile) return unauthorized();
  const { user } = profile;
  const businessComplete = Boolean(
    user.company?.companyName.trim() &&
      user.company.npwpNumber?.trim() &&
      user.company.nibNumber?.trim() &&
      user.company.addresses.length
  );

  return NextResponse.json({
    canManage: true,
    businessComplete,
    business: user.company
      ? {
          id: user.company.id,
          companyName: user.company.companyName,
          npwpNumber: user.company.npwpNumber,
          nibNumber: user.company.nibNumber,
          isVerified: user.company.isVerified,
          addresses: user.company.addresses,
          personnel: user.company.users.map((person) => ({
            ...person,
            role: person.position ?? "PIC",
          })),
        }
      : {
          id: null,
          companyName: user.companyName ?? "",
          npwpNumber: null,
          nibNumber: null,
          isVerified: false,
          addresses: [],
          personnel: [
            {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              position: user.position,
              role: user.position ?? "PIC",
              verificationStatus: "UNVERIFIED",
              avatar: null,
            },
          ],
        },
  });
}

export async function PATCH(request: Request) {
  const profile = await getProfileUser();
  if (!profile) return unauthorized();

  const body = await request.json().catch(() => null);
  if (body && typeof body === "object" && "kind" in body && body.kind === "company") {
    const companyAttempt = companySchema.safeParse(body);
    if (!companyAttempt.success) {
      return NextResponse.json(
        { error: companyAttempt.error.issues[0]?.message ?? "Data perusahaan tidak valid." },
        { status: 400 }
      );
    }
  }
  const company = companySchema.safeParse(body);
  if (company.success) {
    const values = company.data;
    const npwpNumber = normalizeNpwp(values.npwpNumber);
    const nibNumber = normalizeNib(values.nibNumber);
    if (profile.user.companyId) {
      await prisma.$transaction([
        prisma.company.update({
          where: { id: profile.user.companyId },
          data: {
            companyName: values.companyName,
            npwpNumber,
            nibNumber,
          },
        }),
        prisma.user.update({
          where: { id: profile.user.id },
          data: { companyName: values.companyName },
        }),
      ]);
    } else {
      const created = await prisma.company.create({
        data: {
          companyName: values.companyName,
          npwpNumber,
          nibNumber,
          type: "BUYER",
        },
      });
      await prisma.user.update({
        where: { id: profile.user.id },
        data: { companyId: created.id, companyName: values.companyName },
      });
    }
    return NextResponse.json({ ok: true });
  }

  const address = addressUpdateSchema.safeParse(body);
  if (!address.success || !profile.user.companyId) {
    return NextResponse.json({ error: "Invalid business data." }, { status: 400 });
  }
  const ownedAddress = await prisma.companyAddress.findFirst({
    where: { id: address.data.id, companyId: profile.user.companyId },
  });
  if (!ownedAddress) {
    return NextResponse.json({ error: "Address not found." }, { status: 404 });
  }

  if (address.data.isPrimary) {
    await prisma.companyAddress.updateMany({
      where: { companyId: profile.user.companyId },
      data: { isPrimary: false },
    });
  }
  await prisma.companyAddress.update({
    where: { id: ownedAddress.id },
    data: {
      label: address.data.label,
      addressDetail: address.data.addressDetail,
      city: address.data.city,
      postalCode: address.data.postalCode || null,
      isPrimary: Boolean(address.data.isPrimary),
    },
  });
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const profile = await getProfileUser();
  if (!profile) return unauthorized();
  if (!profile.user.companyId) {
    return NextResponse.json(
      { error: "Simpan identitas perusahaan terlebih dahulu." },
      { status: 400 }
    );
  }
  const parsed = addressSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid address data." }, { status: 400 });
  }
  if (parsed.data.isPrimary) {
    await prisma.companyAddress.updateMany({
      where: { companyId: profile.user.companyId },
      data: { isPrimary: false },
    });
  }
  const address = await prisma.companyAddress.create({
    data: {
      companyId: profile.user.companyId,
      label: parsed.data.label,
      addressDetail: parsed.data.addressDetail,
      city: parsed.data.city,
      postalCode: parsed.data.postalCode || null,
      isPrimary: Boolean(parsed.data.isPrimary),
    },
  });
  return NextResponse.json({ address }, { status: 201 });
}

export async function DELETE(request: Request) {
  const profile = await getProfileUser();
  if (!profile) return unauthorized();
  if (!profile.user.companyId) {
    return NextResponse.json({ error: "Address not found." }, { status: 404 });
  }
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Address ID is required." }, { status: 400 });
  const address = await prisma.companyAddress.findFirst({
    where: { id, companyId: profile.user.companyId },
  });
  if (!address) return NextResponse.json({ error: "Address not found." }, { status: 404 });
  await prisma.companyAddress.delete({ where: { id: address.id } });
  return NextResponse.json({ ok: true });
}

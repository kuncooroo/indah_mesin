import "server-only";

import { prisma } from "@/lib/prisma";

export type PoBuyerContext = {
  userId: string;
  name: string;
  email: string;
  phone: string;
  companyId: string | null;
  companyName: string;
  npwpNumber: string;
  nibNumber: string;
  addressId: string | null;
  address: string;
  businessComplete: boolean;
  poReady: boolean;
  completionPath: "/profile/business" | "/profile/settings" | null;
  missingFields: string[];
};

export async function getPoBuyerContext(userId: string): Promise<PoBuyerContext | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      companyId: true,
      companyName: true,
      company: {
        select: {
          companyName: true,
          npwpNumber: true,
          nibNumber: true,
          addresses: {
            orderBy: [{ isPrimary: "desc" }, { label: "asc" }],
            take: 1,
            select: {
              id: true,
              addressDetail: true,
              city: true,
              postalCode: true,
            },
          },
        },
      },
    },
  });
  if (!user) return null;

  const companyName = user.company?.companyName?.trim() ?? user.companyName?.trim() ?? "";
  const npwpNumber = user.company?.npwpNumber?.trim() ?? "";
  const nibNumber = user.company?.nibNumber?.trim() ?? "";
  const companyAddress = user.company?.addresses[0];
  const address = companyAddress
    ? [
        companyAddress.addressDetail.trim(),
        companyAddress.city.trim(),
        companyAddress.postalCode?.trim(),
      ]
        .filter(Boolean)
        .join(", ")
    : "";
  const phone = user.phone?.trim() ?? "";

  const missingBusinessFields = [
    !companyName ? "nama perusahaan" : null,
    !npwpNumber ? "NPWP" : null,
    !nibNumber ? "NIB" : null,
    !companyAddress ? "alamat perusahaan" : null,
  ].filter((field): field is string => Boolean(field));
  const missingFields = [
    ...missingBusinessFields,
    !phone ? "nomor telepon PIC" : null,
  ].filter((field): field is string => Boolean(field));
  const businessComplete = missingBusinessFields.length === 0;

  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    phone,
    companyId: user.companyId,
    companyName,
    npwpNumber,
    nibNumber,
    addressId: companyAddress?.id ?? null,
    address,
    businessComplete,
    poReady: missingFields.length === 0,
    completionPath: !businessComplete
      ? "/profile/business"
      : !phone
        ? "/profile/settings"
        : null,
    missingFields,
  };
}

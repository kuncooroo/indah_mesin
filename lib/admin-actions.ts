"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession, isAdminRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { AdminRole, StockStatus } from "@prisma/client";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session?.user || !isAdminRole(session.user.role)) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function setProductPublished(productId: string, published: boolean) {
  await requireAdmin();
  await prisma.product.update({
    where: { id: productId },
    data: { isPublished: published },
  });
  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");
  revalidatePath("/beranda-artikel");
  revalidatePath("/categories");
}

export async function updateProductStatus(
  productId: string,
  status: string,
  statusLabel: string
) {
  void statusLabel;
  await requireAdmin();
  const statusEnum: StockStatus =
    status === "indent" ? "INDENT" : status === "contact" ? "OUT_OF_STOCK" : "READY_STOCK";
  await prisma.product.update({
    where: { id: productId },
    data: { stockStatus: statusEnum },
  });
  revalidatePath("/admin/products");
  revalidatePath(`/products/${productId}`);
}

export async function updateUserRole(userId: string, role: AdminRole) {
  const session = await requireAdmin();
  if (session.user.role !== "SUPERADMIN") {
    throw new Error("Forbidden");
  }
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    throw new Error("Role admin hanya ADMIN atau SUPERADMIN");
  }
  if (session.user.id === userId && role !== "SUPERADMIN") {
    throw new Error("Tidak dapat menurunkan role diri sendiri");
  }

  await prisma.admin.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin/dashboard");
}

export async function setAdminLoginVisible(visible: boolean) {
  const session = await requireAdmin();
  if (session.user.role !== "SUPERADMIN") {
    throw new Error("Hanya superadmin yang dapat mengubah visibilitas login admin");
  }

  await prisma.siteSetting.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      brandName: "MesinBagus",
      phoneDisplay: "-",
      phoneTel: "-",
      email: "info@indahmesin.com",
      salesEmail: "info@indahmesin.com",
      adminLoginVisible: visible,
    },
    update: { adminLoginVisible: visible },
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/login");
}

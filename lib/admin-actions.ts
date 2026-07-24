"use server";



import { revalidatePath } from "next/cache";

import { getServerSession } from "next-auth";

import { authOptions, isAdminRole } from "@/lib/auth";

import { prisma } from "@/lib/prisma";

import type { Role, StockStatus } from "@prisma/client";



async function requireAdmin() {

  const session = await getServerSession(authOptions);

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

  _statusLabel: string

) {

  await requireAdmin();

  const statusEnum: StockStatus =

    status === "indent"

      ? "INDENT"

      : status === "contact"

        ? "OUT_OF_STOCK"

        : "READY_STOCK";

  await prisma.product.update({

    where: { id: productId },

    data: { stockStatus: statusEnum },

  });

  revalidatePath("/admin/products");

  revalidatePath(`/products/${productId}`);

}



export async function updateUserRole(userId: string, role: Role) {

  const session = await requireAdmin();

  if (session.user.role !== "SUPERADMIN") {

    throw new Error("Forbidden");

  }

  if (session.user.id === userId && role !== "SUPERADMIN") {

    throw new Error("Tidak dapat menurunkan role diri sendiri");

  }

  await prisma.user.update({

    where: { id: userId },

    data: { role },

  });

  revalidatePath("/admin/users");

  revalidatePath("/admin/dashboard");

}


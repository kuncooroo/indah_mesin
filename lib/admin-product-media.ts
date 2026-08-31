"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession, isAdminRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, fail, type ActionResult } from "@/lib/action-result";
import { runAdminAction } from "@/lib/prisma-errors";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session?.user || !isAdminRole(session.user.role)) {
    throw new Error("Unauthorized");
  }
  return session;
}

function revalidateProduct(productId: string) {
  revalidatePath("/admin/products");
  revalidatePath("/beranda-artikel");
  revalidatePath("/categories");
  revalidatePath("/products", "layout");
}

export async function addProductMediaUrls(
  productId: string,
  urls: string[]
): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const clean = urls.map((u) => u.trim()).filter(Boolean);
    if (!productId || clean.length === 0) return fail("URL gambar wajib.");

    const maxOrder = await prisma.productMedia.aggregate({
      where: { productId },
      _max: { sortOrder: true },
    });
    let next = (maxOrder._max.sortOrder ?? -1) + 1;

    await prisma.productMedia.createMany({
      data: clean.map((url) => ({
        productId,
        url,
        sortOrder: next++,
        isPrimary: false,
      })),
    });

    revalidateProduct(productId);
    return ok("Gambar galeri ditambahkan.");
  }, "Gambar galeri ditambahkan.");
}

export async function reorderProductMedia(
  productId: string,
  orderedIds: string[]
): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    if (!productId || orderedIds.length === 0) return fail("Urutan tidak valid.");

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.productMedia.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );

    revalidateProduct(productId);
    return ok("Urutan gambar diperbarui.");
  }, "Urutan gambar diperbarui.");
}

export async function deleteProductMedia(mediaId: string): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const media = await prisma.productMedia.findUnique({ where: { id: mediaId } });
    if (!media) return fail("Gambar tidak ditemukan.");

    await prisma.productMedia.delete({ where: { id: mediaId } });

    if (media.isPrimary) {
      const next = await prisma.productMedia.findFirst({
        where: { productId: media.productId },
        orderBy: { sortOrder: "asc" },
      });
      if (next) {
        await prisma.productMedia.update({
          where: { id: next.id },
          data: { isPrimary: true },
        });
      }
    }

    revalidateProduct(media.productId);
    return ok("Gambar dihapus.");
  }, "Gambar dihapus.");
}

export async function setPrimaryProductMedia(mediaId: string): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const media = await prisma.productMedia.findUnique({ where: { id: mediaId } });
    if (!media) return fail("Gambar tidak ditemukan.");

    await prisma.$transaction([
      prisma.productMedia.updateMany({
        where: { productId: media.productId },
        data: { isPrimary: false },
      }),
      prisma.productMedia.update({
        where: { id: mediaId },
        data: { isPrimary: true, sortOrder: 0 },
      }),
    ]);

    revalidateProduct(media.productId);
    return ok("Gambar utama diperbarui.");
  }, "Gambar utama diperbarui.");
}

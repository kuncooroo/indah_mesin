"use server";

import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Role, RfqStatus, StockStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !isAdminRole(session.user.role)) {
    throw new Error("Unauthorized");
  }
  return session;
}

async function requireSuperAdmin() {
  const session = await requireAdmin();
  if (session.user.role !== "SUPERADMIN") {
    throw new Error("Forbidden");
  }
  return session;
}

function revalidateShop() {
  revalidatePath("/beranda-artikel");
  revalidatePath("/categories");
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function parseStockStatus(s: string): StockStatus {
  if (s === "INDENT" || s === "indent") return "INDENT";
  if (s === "OUT_OF_STOCK" || s === "contact" || s === "CONTACT") return "OUT_OF_STOCK";
  return "READY_STOCK";
}

function parsePrice(raw: string): Prisma.Decimal {
  const cleaned = raw.replace(/[^\d.,-]/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return new Prisma.Decimal(Number.isFinite(n) ? n : 0);
}

// ——— Product ———
export async function createProduct(formData: FormData) {
  await requireAdmin();
  const sku = String(formData.get("sku") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  if (!sku || !name || !categoryId) throw new Error("SKU, nama, dan kategori wajib diisi");

  const slug = slugify(String(formData.get("slug") ?? "") || name);
  const imageUrl = String(formData.get("image") ?? "").trim();

  await prisma.product.create({
    data: {
      sku,
      name,
      slug,
      categoryId,
      stockStatus: parseStockStatus(String(formData.get("stockStatus") ?? "READY_STOCK")),
      currency: String(formData.get("currency") ?? "IDR"),
      price: parsePrice(String(formData.get("price") ?? "0")),
      priceNote: String(formData.get("priceNote") ?? "") || null,
      isPublished: formData.get("isPublished") === "on",
      ...(imageUrl
        ? {
            media: {
              create: {
                url: imageUrl,
                isPrimary: true,
                sortOrder: 0,
              },
            },
          }
        : {}),
    },
  });
  revalidatePath("/admin/products");
  revalidateShop();
}

export async function updateProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("ID tidak valid");

  const imageUrl = String(formData.get("image") ?? "").trim();

  await prisma.product.update({
    where: { id },
    data: {
      name: String(formData.get("name") ?? ""),
      categoryId: String(formData.get("categoryId") ?? "") || undefined,
      stockStatus: parseStockStatus(String(formData.get("stockStatus") ?? "READY_STOCK")),
      price: parsePrice(String(formData.get("price") ?? "0")),
      priceNote: String(formData.get("priceNote") ?? "") || null,
      isPublished: formData.get("isPublished") === "on",
    },
  });

  if (imageUrl) {
    const primary = await prisma.productMedia.findFirst({
      where: { productId: id, isPrimary: true },
    });
    if (primary) {
      await prisma.productMedia.update({ where: { id: primary.id }, data: { url: imageUrl } });
    } else {
      await prisma.productMedia.create({
        data: { productId: id, url: imageUrl, isPrimary: true, sortOrder: 0 },
      });
    }
  }

  revalidatePath("/admin/products");
  revalidateShop();
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidateShop();
}

// ——— Category ———
export async function createCategory(formData: FormData) {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  if (!slug || !name) throw new Error("Slug dan nama wajib");

  const parentId = String(formData.get("parentId") ?? "").trim() || null;

  await prisma.category.create({
    data: {
      slug,
      name,
      icon: String(formData.get("icon") ?? "category") || null,
      parentId,
    },
  });
  revalidatePath("/admin/categories");
}

export async function updateCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parentId = String(formData.get("parentId") ?? "").trim() || null;

  await prisma.category.update({
    where: { id },
    data: {
      slug: String(formData.get("slug") ?? ""),
      name: String(formData.get("name") ?? ""),
      icon: String(formData.get("icon") ?? "category") || null,
      parentId,
    },
  });
  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

// ——— Article ———
export async function createArticle(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const slug =
    String(formData.get("slug") ?? "").trim() ||
    title.toLowerCase().replace(/\s+/g, "-").slice(0, 80);
  if (!title) throw new Error("Judul wajib");

  await prisma.article.create({
    data: {
      title,
      slug,
      category: String(formData.get("category") ?? "Umum"),
      imageUrl: String(formData.get("imageUrl") ?? ""),
      publishedAt: new Date(String(formData.get("publishedAt") ?? new Date().toISOString())),
      readMinutes: parseInt(String(formData.get("readMinutes") ?? "5"), 10) || 5,
      published: formData.get("published") === "on",
    },
  });
  revalidatePath("/admin/articles");
  revalidatePath("/beranda-artikel");
}

export async function updateArticle(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();

  await prisma.article.update({
    where: { id },
    data: {
      title: String(formData.get("title") ?? ""),
      category: String(formData.get("category") ?? ""),
      published: formData.get("published") === "on",
      readMinutes: parseInt(String(formData.get("readMinutes") ?? "5"), 10) || 5,
      ...(imageUrl ? { imageUrl } : {}),
    },
  });
  revalidatePath("/admin/articles");
  revalidatePath("/beranda-artikel");
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  await prisma.article.delete({ where: { id } });
  revalidatePath("/admin/articles");
  revalidatePath("/beranda-artikel");
}

// ——— User ———
export async function createUser(formData: FormData) {
  await requireSuperAdmin();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const email = String(formData.get("email") ?? "").trim() || `${username}@indahmesin.local`;
  if (!username || password.length < 6) throw new Error("Username dan password (min 6) wajib");

  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      username,
      email,
      password: hash,
      name: String(formData.get("name") ?? "") || username,
      role: String(formData.get("role") ?? "ADMIN") as Role,
    },
  });
  revalidatePath("/admin/users");
  revalidatePath("/admin/customers");
}

export async function updateCustomer(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const verified = formData.get("verifiedBuyer") === "on";

  await prisma.user.update({
    where: { id },
    data: {
      name: String(formData.get("name") ?? "") || undefined,
      email: String(formData.get("email") ?? "") || undefined,
      companyName: String(formData.get("companyName") ?? "") || null,
      customBuyerId: String(formData.get("customBuyerId") ?? "") || null,
      verificationStatus: verified ? "VERIFIED" : "UNVERIFIED",
    },
  });
  revalidatePath("/admin/customers");
}

export async function deleteCustomer(id: string) {
  await requireAdmin();
  const user = await prisma.user.findFirst({ where: { id, role: "BUYER" } });
  if (!user) throw new Error("Pelanggan tidak ditemukan");
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/customers");
}

export async function deleteUser(id: string) {
  const session = await requireSuperAdmin();
  if (session.user.id === id) throw new Error("Tidak dapat menghapus akun sendiri");
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
  revalidatePath("/admin/customers");
}

// ——— Saved items (favorites) ———
export async function createSavedItem(formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  const productId = String(formData.get("productId") ?? "");
  if (!userId || !productId) throw new Error("User dan produk wajib");

  await prisma.savedItem.create({ data: { userId, productId } });
  revalidatePath("/admin/favorites");
}

export async function deleteSavedItem(id: string) {
  await requireAdmin();
  await prisma.savedItem.delete({ where: { id } });
  revalidatePath("/admin/favorites");
}

/** @deprecated use createSavedItem */
export const createFavorite = createSavedItem;
/** @deprecated use deleteSavedItem */
export const deleteFavorite = deleteSavedItem;

// ——— RFQ ———
export async function updateRfqRequest(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.rfqRequest.update({
    where: { id },
    data: {
      status: String(formData.get("status") ?? "PENDING") as RfqStatus,
      picName: String(formData.get("picName") ?? ""),
      companyName: String(formData.get("companyName") ?? ""),
    },
  });
  revalidatePath("/admin/rfq");
}

export async function deleteRfqRequest(id: string) {
  await requireAdmin();
  await prisma.rfqRequest.delete({ where: { id } });
  revalidatePath("/admin/rfq");
}

export const updatePurchaseOrder = updateRfqRequest;
export const deletePurchaseOrder = deleteRfqRequest;

// ——— FAQ ———
export async function createFaq(formData: FormData) {
  await requireAdmin();
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  if (!question || !answer) throw new Error("Pertanyaan dan jawaban wajib");

  await prisma.faq.create({
    data: {
      question,
      answer,
      sortOrder: parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0,
      published: formData.get("published") === "on",
    },
  });
  revalidatePath("/admin/faq");
}

export async function updateFaq(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.faq.update({
    where: { id },
    data: {
      question: String(formData.get("question") ?? ""),
      answer: String(formData.get("answer") ?? ""),
      sortOrder: parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0,
      published: formData.get("published") === "on",
    },
  });
  revalidatePath("/admin/faq");
}

export async function deleteFaq(id: string) {
  await requireAdmin();
  await prisma.faq.delete({ where: { id } });
  revalidatePath("/admin/faq");
}

// ——— Review ———
export async function createReview(formData: FormData) {
  await requireAdmin();
  const authorName = String(formData.get("authorName") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  if (!authorName || !content) throw new Error("Nama dan ulasan wajib");

  await prisma.productReview.create({
    data: {
      authorName,
      content,
      productId: String(formData.get("productId") ?? "") || null,
      rating: Math.min(5, Math.max(1, parseInt(String(formData.get("rating") ?? "5"), 10) || 5)),
      published: formData.get("published") === "on",
    },
  });
  revalidatePath("/admin/reviews");
}

export async function updateReview(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.productReview.update({
    where: { id },
    data: {
      authorName: String(formData.get("authorName") ?? ""),
      content: String(formData.get("content") ?? ""),
      productId: String(formData.get("productId") ?? "") || null,
      rating: Math.min(5, Math.max(1, parseInt(String(formData.get("rating") ?? "5"), 10) || 5)),
      published: formData.get("published") === "on",
    },
  });
  revalidatePath("/admin/reviews");
}

export async function deleteReview(id: string) {
  await requireAdmin();
  await prisma.productReview.delete({ where: { id } });
  revalidatePath("/admin/reviews");
}

"use server";

import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { getAdminSession, isAdminRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type {
  AdminRole,
  StockStatus,
  OrderStatus,
  CompanyType,
  ArchiveDocumentType,
} from "@prisma/client";
import { Prisma } from "@prisma/client";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { runAdminAction } from "@/lib/prisma-errors";
import { parseNonNegativeDecimal, requireTrimmed } from "@/lib/admin/validation";

async function requireAdmin() {
  const session = await getAdminSession();
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
  revalidatePath("/products", "layout");
  revalidatePath("/sitemap.xml");
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

function parseOptionalInt(raw: FormDataEntryValue | null): number | null {
  const s = String(raw ?? "").trim();
  if (!s) return null;
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}

// ——— Product ———
export async function createProduct(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const sku = requireTrimmed(formData.get("sku"), "sku", "SKU", { min: 3, max: 50 });
    if (!sku.ok) return sku.result;
    const name = requireTrimmed(formData.get("name"), "name", "Nama", { min: 3, max: 150 });
    if (!name.ok) return name.result;
    const categoryId = requireTrimmed(formData.get("categoryId"), "categoryId", "Kategori");
    if (!categoryId.ok) return categoryId.result;
    const price = parseNonNegativeDecimal(formData.get("price"), "price", "Harga");
    if (!price.ok) return price.result;

    const slug = slugify(String(formData.get("slug") ?? "") || name.value);
    const imageUrl = String(formData.get("image") ?? "").trim();

    await prisma.product.create({
      data: {
        sku: sku.value,
        name: name.value,
        slug,
        categoryId: categoryId.value,
        stockStatus: parseStockStatus(String(formData.get("stockStatus") ?? "READY_STOCK")),
        currency: String(formData.get("currency") ?? "IDR") || "IDR",
        price: parsePrice(price.value),
        priceNote: String(formData.get("priceNote") ?? "") || null,
        indentDays: parseOptionalInt(formData.get("indentDays")),
        brochureUrl: String(formData.get("brochureUrl") ?? "") || null,
        sopUrl: String(formData.get("sopUrl") ?? "") || null,
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
    return ok("Produk berhasil dibuat.");
  }, "Produk berhasil dibuat.");
}

export async function updateProduct(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return fail("ID tidak valid.");

    const name = requireTrimmed(formData.get("name"), "name", "Nama", { min: 3, max: 150 });
    if (!name.ok) return name.result;
    const price = parseNonNegativeDecimal(formData.get("price"), "price", "Harga");
    if (!price.ok) return price.result;

    const imageUrl = String(formData.get("image") ?? "").trim();

    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          name: name.value,
          categoryId: String(formData.get("categoryId") ?? "") || undefined,
          stockStatus: parseStockStatus(String(formData.get("stockStatus") ?? "READY_STOCK")),
          price: parsePrice(price.value),
          priceNote: String(formData.get("priceNote") ?? "") || null,
          indentDays: parseOptionalInt(formData.get("indentDays")),
          brochureUrl: String(formData.get("brochureUrl") ?? "") || null,
          sopUrl: String(formData.get("sopUrl") ?? "") || null,
          isPublished: formData.get("isPublished") === "on",
        },
      });

      if (imageUrl) {
        const primary = await tx.productMedia.findFirst({
          where: { productId: id, isPrimary: true },
        });
        if (primary) {
          await tx.productMedia.update({ where: { id: primary.id }, data: { url: imageUrl } });
        } else {
          await tx.productMedia.create({
            data: { productId: id, url: imageUrl, isPrimary: true, sortOrder: 0 },
          });
        }
      }
    });

    revalidatePath("/admin/products");
    revalidateShop();
    return ok("Produk berhasil diperbarui.");
  }, "Produk berhasil diperbarui.");
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidateShop();
    return ok("Produk berhasil dihapus.");
  }, "Produk berhasil dihapus.");
}

// ——— Category ———
export async function createCategory(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const slug = requireTrimmed(formData.get("slug"), "slug", "Slug", { min: 2, max: 80 });
    if (!slug.ok) return slug.result;
    const name = requireTrimmed(formData.get("name"), "name", "Nama", { min: 2, max: 150 });
    if (!name.ok) return name.result;

    const parentId = String(formData.get("parentId") ?? "").trim() || null;

    await prisma.category.create({
      data: {
        slug: slug.value,
        name: name.value,
        icon: String(formData.get("icon") ?? "category") || null,
        parentId,
      },
    });
    revalidatePath("/admin/categories");
    revalidateShop();
    return ok("Kategori berhasil dibuat.");
  }, "Kategori berhasil dibuat.");
}

export async function updateCategory(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return fail("ID tidak valid.");
    const slug = requireTrimmed(formData.get("slug"), "slug", "Slug", { min: 2, max: 80 });
    if (!slug.ok) return slug.result;
    const name = requireTrimmed(formData.get("name"), "name", "Nama", { min: 2, max: 150 });
    if (!name.ok) return name.result;
    const parentId = String(formData.get("parentId") ?? "").trim() || null;

    await prisma.category.update({
      where: { id },
      data: {
        slug: slug.value,
        name: name.value,
        icon: String(formData.get("icon") ?? "category") || null,
        parentId,
      },
    });
    revalidatePath("/admin/categories");
    revalidateShop();
    return ok("Kategori berhasil diperbarui.");
  }, "Kategori berhasil diperbarui.");
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    revalidateShop();
    return ok("Kategori berhasil dihapus.");
  }, "Kategori berhasil dihapus.");
}

// ——— Article ———
export async function createArticle(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const title = requireTrimmed(formData.get("title"), "title", "Judul", { min: 3, max: 200 });
    if (!title.ok) return title.result;
    const slug =
      String(formData.get("slug") ?? "").trim() ||
      title.value.toLowerCase().replace(/\s+/g, "-").slice(0, 80);

    await prisma.article.create({
      data: {
        title: title.value,
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
    return ok("Artikel berhasil dibuat.");
  }, "Artikel berhasil dibuat.");
}

export async function updateArticle(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return fail("ID tidak valid.");
    const title = requireTrimmed(formData.get("title"), "title", "Judul", { min: 3, max: 200 });
    if (!title.ok) return title.result;
    const imageUrl = String(formData.get("imageUrl") ?? "").trim();

    await prisma.article.update({
      where: { id },
      data: {
        title: title.value,
        category: String(formData.get("category") ?? ""),
        published: formData.get("published") === "on",
        readMinutes: parseInt(String(formData.get("readMinutes") ?? "5"), 10) || 5,
        ...(imageUrl ? { imageUrl } : {}),
      },
    });
    revalidatePath("/admin/articles");
    revalidatePath("/beranda-artikel");
    return ok("Artikel berhasil diperbarui.");
  }, "Artikel berhasil diperbarui.");
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    await prisma.article.delete({ where: { id } });
    revalidatePath("/admin/articles");
    revalidatePath("/beranda-artikel");
    return ok("Artikel berhasil dihapus.");
  }, "Artikel berhasil dihapus.");
}

// ——— User (admin accounts) ———
export async function createUser(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireSuperAdmin();
    const username = requireTrimmed(formData.get("username"), "username", "Username", {
      min: 3,
      max: 50,
    });
    if (!username.ok) return username.result;
    const password = String(formData.get("password") ?? "");
    if (password.length < 6) {
      return fail("Password minimal 6 karakter.", {
        fieldErrors: { password: "Password minimal 6 karakter." },
      });
    }
    const email =
      String(formData.get("email") ?? "").trim() || `${username.value}@indahmesin.local`;

    const hash = await bcrypt.hash(password, 10);
    await prisma.admin.create({
      data: {
        username: username.value,
        email,
        password: hash,
        name: String(formData.get("name") ?? "") || username.value,
        role: String(formData.get("role") ?? "ADMIN") as AdminRole,
      },
    });
    revalidatePath("/admin/users");
    revalidatePath("/admin/companies");
    return ok("Admin berhasil dibuat.");
  }, "Admin berhasil dibuat.");
}

export async function updateCustomer(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return fail("ID tidak valid.");
    const verified = formData.get("verifiedBuyer") === "on";

    await prisma.user.update({
      where: { id },
      data: {
        name: String(formData.get("name") ?? "") || undefined,
        email: String(formData.get("email") ?? "") || undefined,
        phone: String(formData.get("phone") ?? "") || null,
        companyId: String(formData.get("companyId") ?? "") || null,
        companyName: String(formData.get("companyName") ?? "") || null,
        customBuyerId: String(formData.get("customBuyerId") ?? "") || null,
        position: String(formData.get("position") ?? "") || null,
        verificationStatus: verified ? "VERIFIED" : "UNVERIFIED",
      },
    });
    revalidatePath("/admin/companies");
    return ok("Pelanggan berhasil diperbarui.");
  }, "Pelanggan berhasil diperbarui.");
}

export async function deleteCustomer(id: string): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const user = await prisma.user.findFirst({ where: { id } });
    if (!user) return fail("Pelanggan tidak ditemukan.");
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/companies");
    return ok("Pelanggan berhasil dihapus.");
  }, "Pelanggan berhasil dihapus.");
}

export async function deleteUser(id: string): Promise<ActionResult> {
  return runAdminAction(async () => {
    const session = await requireSuperAdmin();
    if (session.user.id === id) return fail("Tidak dapat menghapus akun sendiri.");
    await prisma.admin.delete({ where: { id } });
    revalidatePath("/admin/users");
    revalidatePath("/admin/companies");
    return ok("Admin berhasil dihapus.");
  }, "Admin berhasil dihapus.");
}

// ——— Saved items (favorites) ———
export async function createSavedItem(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const userId = String(formData.get("userId") ?? "");
    const productId = String(formData.get("productId") ?? "");
    if (!userId || !productId) return fail("User dan produk wajib.");

    await prisma.savedItem.create({ data: { userId, productId } });
    revalidatePath("/admin/favorites");
    return ok("Favorit berhasil ditambahkan.");
  }, "Favorit berhasil ditambahkan.");
}

export async function deleteSavedItem(id: string): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    await prisma.savedItem.delete({ where: { id } });
    revalidatePath("/admin/favorites");
    return ok("Favorit berhasil dihapus.");
  }, "Favorit berhasil dihapus.");
}

/** @deprecated use createSavedItem */
export const createFavorite = createSavedItem;
/** @deprecated use deleteSavedItem */
export const deleteFavorite = deleteSavedItem;

// ——— FAQ ———
export async function createFaq(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const question = requireTrimmed(formData.get("question"), "question", "Pertanyaan", {
      min: 3,
      max: 500,
    });
    if (!question.ok) return question.result;
    const answer = requireTrimmed(formData.get("answer"), "answer", "Jawaban", { min: 3 });
    if (!answer.ok) return answer.result;

    await prisma.faq.create({
      data: {
        question: question.value,
        answer: answer.value,
        sortOrder: parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0,
        published: formData.get("published") === "on",
      },
    });
    revalidatePath("/admin/faq");
    return ok("FAQ berhasil dibuat.");
  }, "FAQ berhasil dibuat.");
}

export async function updateFaq(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return fail("ID tidak valid.");
    const question = requireTrimmed(formData.get("question"), "question", "Pertanyaan", {
      min: 3,
      max: 500,
    });
    if (!question.ok) return question.result;
    const answer = requireTrimmed(formData.get("answer"), "answer", "Jawaban", { min: 3 });
    if (!answer.ok) return answer.result;

    await prisma.faq.update({
      where: { id },
      data: {
        question: question.value,
        answer: answer.value,
        sortOrder: parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0,
        published: formData.get("published") === "on",
      },
    });
    revalidatePath("/admin/faq");
    return ok("FAQ berhasil diperbarui.");
  }, "FAQ berhasil diperbarui.");
}

export async function deleteFaq(id: string): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    await prisma.faq.delete({ where: { id } });
    revalidatePath("/admin/faq");
    return ok("FAQ berhasil dihapus.");
  }, "FAQ berhasil dihapus.");
}

// ——— Review ———
export async function createReview(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const authorName = requireTrimmed(formData.get("authorName"), "authorName", "Nama", {
      min: 2,
      max: 100,
    });
    if (!authorName.ok) return authorName.result;
    const content = requireTrimmed(formData.get("content"), "content", "Ulasan", { min: 3 });
    if (!content.ok) return content.result;

    await prisma.productReview.create({
      data: {
        authorName: authorName.value,
        content: content.value,
        productId: String(formData.get("productId") ?? "") || null,
        rating: Math.min(5, Math.max(1, parseInt(String(formData.get("rating") ?? "5"), 10) || 5)),
        published: formData.get("published") === "on",
      },
    });
    revalidatePath("/admin/reviews");
    return ok("Ulasan berhasil dibuat.");
  }, "Ulasan berhasil dibuat.");
}

export async function updateReview(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return fail("ID tidak valid.");
    const authorName = requireTrimmed(formData.get("authorName"), "authorName", "Nama", {
      min: 2,
      max: 100,
    });
    if (!authorName.ok) return authorName.result;
    const content = requireTrimmed(formData.get("content"), "content", "Ulasan", { min: 3 });
    if (!content.ok) return content.result;

    await prisma.productReview.update({
      where: { id },
      data: {
        authorName: authorName.value,
        content: content.value,
        productId: String(formData.get("productId") ?? "") || null,
        rating: Math.min(5, Math.max(1, parseInt(String(formData.get("rating") ?? "5"), 10) || 5)),
        published: formData.get("published") === "on",
      },
    });
    revalidatePath("/admin/reviews");
    return ok("Ulasan berhasil diperbarui.");
  }, "Ulasan berhasil diperbarui.");
}

export async function deleteReview(id: string): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    await prisma.productReview.delete({ where: { id } });
    revalidatePath("/admin/reviews");
    return ok("Ulasan berhasil dihapus.");
  }, "Ulasan berhasil dihapus.");
}

export async function createCompany(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const companyName = requireTrimmed(formData.get("companyName"), "companyName", "Nama perusahaan", {
      min: 2,
      max: 200,
    });
    if (!companyName.ok) return companyName.result;

    await prisma.company.create({
      data: {
        companyName: companyName.value,
        type: (String(formData.get("type") ?? "BUYER") as CompanyType) || "BUYER",
        npwpNumber: String(formData.get("npwpNumber") ?? "") || null,
        nibNumber: String(formData.get("nibNumber") ?? "") || null,
        isVerified: formData.get("isVerified") === "on",
      },
    });
    revalidatePath("/admin/companies");
    return ok("Perusahaan berhasil dibuat.");
  }, "Perusahaan berhasil dibuat.");
}

export async function updateCompany(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return fail("ID tidak valid.");
    const companyName = requireTrimmed(formData.get("companyName"), "companyName", "Nama perusahaan", {
      min: 2,
      max: 200,
    });
    if (!companyName.ok) return companyName.result;

    await prisma.company.update({
      where: { id },
      data: {
        companyName: companyName.value,
        type: (String(formData.get("type") ?? "BUYER") as CompanyType) || "BUYER",
        npwpNumber: String(formData.get("npwpNumber") ?? "") || null,
        nibNumber: String(formData.get("nibNumber") ?? "") || null,
        isVerified: formData.get("isVerified") === "on",
      },
    });
    revalidatePath("/admin/companies");
    return ok("Perusahaan berhasil diperbarui.");
  }, "Perusahaan berhasil diperbarui.");
}

export async function deleteCompany(id: string): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    await prisma.company.delete({ where: { id } });
    revalidatePath("/admin/companies");
    return ok("Perusahaan berhasil dihapus.");
  }, "Perusahaan berhasil dihapus.");
}

// ——— Company addresses ———
export async function createCompanyAddress(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const companyId = String(formData.get("companyId") ?? "");
    const label = requireTrimmed(formData.get("label"), "label", "Label", { min: 2, max: 100 });
    if (!companyId || !label.ok) {
      return label.ok === false ? label.result : fail("Perusahaan dan label wajib.");
    }

    await prisma.companyAddress.create({
      data: {
        companyId,
        label: label.value,
        addressDetail: String(formData.get("addressDetail") ?? ""),
        city: String(formData.get("city") ?? ""),
        postalCode: String(formData.get("postalCode") ?? "") || null,
        isPrimary: formData.get("isPrimary") === "on",
      },
    });
    revalidatePath("/admin/companies");
    return ok("Alamat berhasil ditambahkan.");
  }, "Alamat berhasil ditambahkan.");
}

export async function updateCompanyAddress(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return fail("ID tidak valid.");
    const label = requireTrimmed(formData.get("label"), "label", "Label", { min: 2, max: 100 });
    if (!label.ok) return label.result;

    await prisma.companyAddress.update({
      where: { id },
      data: {
        label: label.value,
        addressDetail: String(formData.get("addressDetail") ?? ""),
        city: String(formData.get("city") ?? ""),
        postalCode: String(formData.get("postalCode") ?? "") || null,
        isPrimary: formData.get("isPrimary") === "on",
      },
    });
    revalidatePath("/admin/companies");
    return ok("Alamat berhasil diperbarui.");
  }, "Alamat berhasil diperbarui.");
}

export async function deleteCompanyAddress(id: string): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    await prisma.companyAddress.delete({ where: { id } });
    revalidatePath("/admin/companies");
    return ok("Alamat berhasil dihapus.");
  }, "Alamat berhasil dihapus.");
}

// ——— Orders (PO) ———
export async function updateOrder(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return fail("ID tidak valid.");
    await prisma.order.update({
      where: { id },
      data: {
        status: String(formData.get("status") ?? "DRAFT") as OrderStatus,
        notes: String(formData.get("notes") ?? "") || null,
      },
    });
    revalidatePath("/admin/orders");
    return ok("Order berhasil diperbarui.");
  }, "Order berhasil diperbarui.");
}

export async function deleteOrder(id: string): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    await prisma.order.delete({ where: { id } });
    revalidatePath("/admin/orders");
    return ok("Order berhasil dihapus.");
  }, "Order berhasil dihapus.");
}

// ——— Archive documents ———
export async function createArchiveDocument(formData: FormData): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    const documentName = requireTrimmed(
      formData.get("documentName"),
      "documentName",
      "Nama dokumen",
      { min: 2, max: 200 }
    );
    if (!documentName.ok) return documentName.result;
    const fileUrl = requireTrimmed(formData.get("fileUrl"), "fileUrl", "URL file");
    if (!fileUrl.ok) return fileUrl.result;

    await prisma.archiveDocument.create({
      data: {
        documentName: documentName.value,
        fileUrl: fileUrl.value,
        documentType: String(formData.get("documentType") ?? "PO_DRAFT") as ArchiveDocumentType,
        userId: String(formData.get("userId") ?? "") || null,
        orderId: String(formData.get("orderId") ?? "") || null,
      },
    });
    revalidatePath("/admin/documents");
    return ok("Dokumen berhasil dibuat.");
  }, "Dokumen berhasil dibuat.");
}

export async function deleteArchiveDocument(id: string): Promise<ActionResult> {
  return runAdminAction(async () => {
    await requireAdmin();
    await prisma.archiveDocument.delete({ where: { id } });
    revalidatePath("/admin/documents");
    return ok("Dokumen berhasil dihapus.");
  }, "Dokumen berhasil dihapus.");
}

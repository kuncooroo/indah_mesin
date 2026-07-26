import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

function isMissingTableError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2021"
  );
}

async function safeCount(countFn: () => Promise<number>) {
  try {
    return await countFn();
  } catch (error) {
    if (isMissingTableError(error)) return 0;
    throw error;
  }
}

/** Count aman jika migrasi Faq/ProductReview belum di-deploy. */
export async function safeFaqCount(where?: Prisma.FaqWhereInput) {
  return safeCount(() => prisma.faq.count({ where }));
}

export async function safeProductReviewCount(where?: Prisma.ProductReviewWhereInput) {
  return safeCount(() => prisma.productReview.count({ where }));
}

export async function safeCompanyCount(where?: Prisma.CompanyWhereInput) {
  return safeCount(() => prisma.company.count({ where }));
}

export async function safeCompanyAddressCount(where?: Prisma.CompanyAddressWhereInput) {
  return safeCount(() => prisma.companyAddress.count({ where }));
}

export async function safeOrderCount(where?: Prisma.OrderWhereInput) {
  return safeCount(() => prisma.order.count({ where }));
}

export async function safeArchiveDocumentCount(where?: Prisma.ArchiveDocumentWhereInput) {
  return safeCount(() => prisma.archiveDocument.count({ where }));
}

export async function safeFaqFindMany(args: Prisma.FaqFindManyArgs) {
  try {
    return await prisma.faq.findMany(args);
  } catch (error) {
    if (isMissingTableError(error)) return [];
    throw error;
  }
}

export async function safeProductReviewFindMany<T extends Prisma.ProductReviewFindManyArgs>(
  args: T
): Promise<Prisma.ProductReviewGetPayload<T>[]> {
  try {
    return (await prisma.productReview.findMany(args)) as Prisma.ProductReviewGetPayload<T>[];
  } catch (error) {
    if (isMissingTableError(error)) return [] as Prisma.ProductReviewGetPayload<T>[];
    throw error;
  }
}

export async function isFaqTableReady() {
  try {
    await prisma.faq.count();
    return true;
  } catch (error) {
    if (isMissingTableError(error)) return false;
    throw error;
  }
}

export async function isProductReviewTableReady() {
  try {
    await prisma.productReview.count();
    return true;
  } catch (error) {
    if (isMissingTableError(error)) return false;
    throw error;
  }
}

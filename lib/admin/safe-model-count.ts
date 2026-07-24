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

/** Count aman jika migrasi Faq/ProductReview belum di-deploy. */
export async function safeFaqCount(where?: Prisma.FaqWhereInput) {
  try {
    return await prisma.faq.count({ where });
  } catch (error) {
    if (isMissingTableError(error)) return 0;
    throw error;
  }
}

export async function safeProductReviewCount(where?: Prisma.ProductReviewWhereInput) {
  try {
    return await prisma.productReview.count({ where });
  } catch (error) {
    if (isMissingTableError(error)) return 0;
    throw error;
  }
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

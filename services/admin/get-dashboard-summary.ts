import { prisma } from "@/lib/prisma";

import { safeFaqCount, safeProductReviewCount } from "@/lib/admin/safe-model-count";

import { listPublishedProducts } from "@/lib/catalog";

import { listPublishedArticles } from "@/lib/content";

import { adminModuleRegistry } from "@/services/admin/module-registry";

import type { AdminModuleSummary } from "@/types/admin/marketplace-module";

import { mainCategories } from "@/lib/categories";



export async function getAdminDashboardSummary(): Promise<AdminModuleSummary[]> {

  const marketplaceSlugs = mainCategories.map((c) => c.id);



  const [

    productPublishedDb,

    productTotalDb,

    categoryMarketplace,

    categoryTotal,

    articlePublishedDb,

    savedTotal,

    rfqTotal,

    customerTotal,

    adminTotal,

    shopProducts,

    shopArticles,

    faqPublished,

    faqTotal,

    reviewPublished,

    reviewTotal,

  ] = await Promise.all([

    prisma.product.count({ where: { isPublished: true } }),

    prisma.product.count(),

    prisma.category.count({ where: { slug: { in: marketplaceSlugs } } }),

    prisma.category.count(),

    prisma.article.count({ where: { published: true } }),

    prisma.savedItem.count(),

    prisma.rfqRequest.count(),

    prisma.user.count({ where: { role: "BUYER" } }),

    prisma.user.count({ where: { role: { in: ["ADMIN", "SUPERADMIN"] } } }),

    listPublishedProducts(),

    listPublishedArticles(),

    safeFaqCount({ published: true }),

    safeFaqCount(),

    safeProductReviewCount({ published: true }),

    safeProductReviewCount(),

  ]);



  const productVisible = Math.max(productPublishedDb, shopProducts.length);

  const articleVisible = Math.max(articlePublishedDb, shopArticles.length);



  const counts: Record<string, { shopVisibleCount: number; databaseTotal: number }> = {

    products: { shopVisibleCount: productVisible, databaseTotal: productTotalDb },

    categories: {

      shopVisibleCount: categoryMarketplace,

      databaseTotal: categoryTotal,

    },

    articles: {

      shopVisibleCount: articleVisible,

      databaseTotal: await prisma.article.count(),

    },

    reviews: {

      shopVisibleCount: reviewPublished,

      databaseTotal: reviewTotal,

    },

    faq: { shopVisibleCount: faqPublished, databaseTotal: faqTotal },

    rfq: { shopVisibleCount: rfqTotal, databaseTotal: rfqTotal },

    favorites: { shopVisibleCount: savedTotal, databaseTotal: savedTotal },

    customers: { shopVisibleCount: customerTotal, databaseTotal: customerTotal },

    admin: { shopVisibleCount: adminTotal, databaseTotal: adminTotal },

  };



  return adminModuleRegistry.map((meta) => {

    const c = counts[meta.key] ?? { shopVisibleCount: 0, databaseTotal: 0 };

    return {

      key: meta.key,

      label: meta.label,

      adminHref: meta.adminHref,

      shopHref: meta.shopHref,

      stitchScreenTitle: meta.stitchScreenTitle,

      shopVisibleCount: c.shopVisibleCount,

      databaseTotal: c.databaseTotal,

    };

  });

}


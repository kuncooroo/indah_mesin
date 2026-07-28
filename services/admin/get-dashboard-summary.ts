import { prisma } from "@/lib/prisma";



import {

  safeFaqCount,

  safeCompanyCount,

  safeCompanyAddressCount,

  safeOrderCount,

  safeArchiveDocumentCount,

} from "@/lib/admin/safe-model-count";



import { listPublishedProducts } from "@/lib/storefront/catalog";

import { listPublishedArticles } from "@/lib/storefront/content";

import { adminModuleRegistry } from "@/services/admin/module-registry";

import type { AdminDashboardInsight, AdminModuleSummary } from "@/types/admin/marketplace-module";

import {
  shopCatalogProductWhere,
  shopCatalogCategoryWhere,
} from "@/lib/storefront/catalog-data";

import { buyerRoles } from "@/lib/buyer-roles";



export async function getAdminDashboardInsights(): Promise<AdminDashboardInsight> {

  const [savedItemsTotal, legacyRfqTotal] = await Promise.all([

    prisma.savedItem.count(),

    prisma.rfqRequest.count(),

  ]);

  return { savedItemsTotal, legacyRfqTotal };

}



export async function getAdminDashboardSummary(): Promise<AdminModuleSummary[]> {
  const [
    productPublishedDb,
    productCatalogDb,
    categoryCatalogDb,
    articlePublishedDb,

    orderTotal,

    companyTotal,

    addressTotal,

    documentTotal,

    customerTotal,

    adminTotal,

    shopProducts,

    shopArticles,

    faqPublished,

    faqTotal,

  ] = await Promise.all([

    prisma.product.count({ where: shopCatalogProductWhere }),

    prisma.product.count({ where: shopCatalogProductWhere }),

    prisma.category.count({ where: shopCatalogCategoryWhere }),

    prisma.article.count({ where: { published: true } }),

    safeOrderCount(),

    safeCompanyCount(),

    safeCompanyAddressCount(),

    safeArchiveDocumentCount(),

    prisma.user.count({ where: { role: { in: buyerRoles } } }),

    prisma.user.count({ where: { role: { in: ["ADMIN", "SUPERADMIN"] } } }),

    listPublishedProducts(),

    listPublishedArticles(),

    safeFaqCount({ published: true }),

    safeFaqCount(),

  ]);



  const productVisible = Math.max(productPublishedDb, shopProducts.length);
  const articleVisible = Math.max(articlePublishedDb, shopArticles.length);
  const categoryMarketplace = categoryCatalogDb;
  const categoryTotal = categoryCatalogDb;



  const counts: Record<string, { shopVisibleCount: number; databaseTotal: number }> = {

    products: { shopVisibleCount: productVisible, databaseTotal: productCatalogDb },

    categories: {

      shopVisibleCount: categoryMarketplace,

      databaseTotal: categoryTotal,

    },

    companies: {

      shopVisibleCount: companyTotal,

      databaseTotal: companyTotal + addressTotal + customerTotal,

    },

    orders: { shopVisibleCount: orderTotal, databaseTotal: orderTotal },

    documents: { shopVisibleCount: documentTotal, databaseTotal: documentTotal },

    articles: {

      shopVisibleCount: articleVisible,

      databaseTotal: await prisma.article.count(),

    },

    faq: { shopVisibleCount: faqPublished, databaseTotal: faqTotal },

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


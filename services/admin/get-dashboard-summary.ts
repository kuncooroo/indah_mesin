import { prisma } from "@/lib/prisma";
import {
  safeFaqCount,
  safeCompanyCount,
  safeCompanyAddressCount,
  safeOrderCount,
  safeArchiveDocumentCount,
} from "@/lib/admin/safe-model-count";
import { adminModuleRegistry } from "@/services/admin/module-registry";
import type { AdminDashboardInsight, AdminModuleSummary } from "@/types/admin/marketplace-module";
import {
  shopCatalogProductWhere,
  shopCatalogCategoryWhere,
} from "@/lib/storefront/catalog-data";

export async function getAdminDashboardInsights(): Promise<AdminDashboardInsight> {
  const [savedItemsTotal, legacyRfqTotal, userTotal, adminTotal, orderTotal] = await Promise.all([
    prisma.savedItem.count(),
    prisma.rfqRequest.count(),
    prisma.user.count(),
    prisma.admin.count(),
    safeOrderCount(),
  ]);

  return { savedItemsTotal, legacyRfqTotal, userTotal, adminTotal, orderTotal };
}

export async function getAdminDashboardSummary(): Promise<AdminModuleSummary[]> {
  const [
    productPublishedDb,
    productTotalDb,
    categoryTotalDb,
    articlePublishedDb,
    articleTotalDb,
    orderTotal,
    companyTotal,
    addressTotal,
    documentTotal,
    customerTotal,
    orphanCustomerTotal,
    adminTotal,
    faqPublished,
    faqTotal,
  ] = await Promise.all([
    prisma.product.count({ where: shopCatalogProductWhere }),
    prisma.product.count(),
    prisma.category.count({ where: shopCatalogCategoryWhere }),
    prisma.article.count({ where: { published: true } }),
    prisma.article.count(),
    safeOrderCount(),
    safeCompanyCount(),
    safeCompanyAddressCount(),
    safeArchiveDocumentCount(),
    prisma.user.count(),
    prisma.user.count({ where: { companyId: null } }),
    prisma.admin.count(),
    safeFaqCount({ published: true }),
    safeFaqCount(),
  ]);

  const counts: Record<string, { shopVisibleCount: number; databaseTotal: number }> = {
    products: { shopVisibleCount: productPublishedDb, databaseTotal: productTotalDb },
    categories: { shopVisibleCount: categoryTotalDb, databaseTotal: categoryTotalDb },
    companies: { shopVisibleCount: companyTotal, databaseTotal: companyTotal },
    customers: { shopVisibleCount: orphanCustomerTotal, databaseTotal: customerTotal },
    orders: { shopVisibleCount: orderTotal, databaseTotal: orderTotal },
    documents: { shopVisibleCount: documentTotal, databaseTotal: documentTotal },
    articles: { shopVisibleCount: articlePublishedDb, databaseTotal: articleTotalDb },
    faq: { shopVisibleCount: faqPublished, databaseTotal: faqTotal },
    admin: { shopVisibleCount: adminTotal, databaseTotal: adminTotal },
  };
  void addressTotal;

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

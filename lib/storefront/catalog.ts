import type { Product, ProductStatus } from "@/lib/storefront/product-types";
import {
  products as catalogFallback,
  getProductBySku,
} from "@/lib/storefront/product-types";
import {
  MARKETPLACE_PRODUCTS,
  shopCatalogProductWhere,
  HOME_FEATURED_SKUS,
} from "@/lib/storefront/catalog-data";
import { getProductDetailEnrichment } from "@/lib/storefront/product-detail-enrichment";
import { prisma } from "@/lib/prisma";
import type { Prisma, StockStatus } from "@prisma/client";

type ProductRow = Prisma.ProductGetPayload<{
  include: {
    category: true;
    media: true;
    features: true;
    specifications: true;
    documents: true;
  };
}>;

function formatPrice(currency: string, price: Prisma.Decimal): string {
  const n = Number(price);
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n);
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function stockToProductStatus(status: StockStatus): ProductStatus {
  switch (status) {
    case "INDENT":
      return "indent";
    case "OUT_OF_STOCK":
      return "contact";
    default:
      return "ready";
  }
}

function stockLabel(status: StockStatus, indentDays: number | null): string {
  switch (status) {
    case "INDENT":
      return indentDays ? `Inden ±${indentDays} hari` : "Inden";
    case "OUT_OF_STOCK":
      return "Out of Stock";
    default:
      return "Ready Stock";
  }
}

function enrichFromCatalogSeed(product: Product): Product {
  const ref =
    getProductBySku(product.sku) ??
    MARKETPLACE_PRODUCTS.find((p) => p.sku === product.sku);
  const detail = getProductDetailEnrichment(product.sku);
  if (!ref && !detail) return product;

  const galleryFromDetail = detail?.gallery.slice(1);
  const gallery =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : galleryFromDetail?.length
        ? galleryFromDetail
        : ref?.gallery;

  const features =
    product.features && product.features.length > 0
      ? product.features
      : (detail?.features ?? ref?.features);

  const specs =
    product.specs && product.specs.length >= 4
      ? product.specs
      : (detail?.specs ?? ref?.specs);

  const image =
    product.image || detail?.gallery[0] || ref?.image || product.image;

  return {
    ...product,
    image,
    gallery,
    features,
    specs,
    priceLabel: product.priceLabel || ref?.priceLabel || product.priceLabel,
    priceNote: product.priceNote ?? ref?.priceNote,
    statusLabel: product.statusLabel ?? ref?.statusLabel,
    subtitle: product.subtitle || ref?.subtitle || product.name,
    savedPriceNote: product.savedPriceNote ?? ref?.savedPriceNote,
    savedSecondaryAction:
      product.savedSecondaryAction ?? ref?.savedSecondaryAction,
  };
}

export function mapDbProduct(row: ProductRow): Product {
  const primary =
    row.media.find((m) => m.isPrimary) ??
    row.media.sort((a, b) => a.sortOrder - b.sortOrder)[0];
  const gallery = row.media
    .filter((m) => m.url !== primary?.url)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((m) => m.url);

  const downloads = row.documents.map((d) => ({
    title: d.title,
    subtitle: d.subtitle ?? undefined,
    fileUrl: d.fileUrl,
    icon: d.title.toLowerCase().includes("sop")
      ? "description"
      : "picture_as_pdf",
  }));

  const priceAmount = Number(row.price);

  const mapped: Product = {
    id: row.slug,
    slug: row.slug,
    dbProductId: row.id,
    sku: row.sku,
    name: row.name,
    subtitle: "",
    category: row.category.slug,
    categoryLabel: row.category.name,
    image: primary?.url ?? "",
    gallery: gallery.length ? gallery : undefined,
    priceLabel: formatPrice(row.currency, row.price),
    priceAmount,
    priceNote: row.priceNote ?? undefined,
    status: stockToProductStatus(row.stockStatus),
    statusLabel: stockLabel(row.stockStatus, row.indentDays),
    indentDays: row.indentDays ?? undefined,
    brochureUrl: row.brochureUrl ?? undefined,
    sopUrl: row.sopUrl ?? undefined,
    features: row.features
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((f) => f.text),
    specs: row.specifications
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((s) => ({ label: s.attribute, value: s.value })),
    downloads: downloads.length ? downloads : undefined,
    createdAt: row.createdAt.toISOString(),
  };
  return enrichFromCatalogSeed(mapped);
}

const productInclude = {
  category: true,
  media: true,
  features: true,
  specifications: true,
  documents: true,
} as const;

async function fetchPublishedFromDb(): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({
      where: shopCatalogProductWhere,
      orderBy: { name: "asc" },
      include: productInclude,
    });
    return rows.map(mapDbProduct);
  } catch {
    return [];
  }
}

export async function listPublishedProducts(): Promise<Product[]> {
  const fromDb = await fetchPublishedFromDb();
  if (fromDb.length > 0) return fromDb;
  return catalogFallback.map(enrichFromCatalogSeed);
}

export async function listFeaturedProducts(limit = 3): Promise<Product[]> {
  const all = await listPublishedProducts();
  const picked = HOME_FEATURED_SKUS.map((sku) =>
    all.find((p) => p.sku === sku),
  ).filter((p): p is Product => Boolean(p));
  if (picked.length >= limit) return picked.slice(0, limit);
  try {
    const rows = await prisma.product.findMany({
      where: shopCatalogProductWhere,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: productInclude,
    });
    if (rows.length > 0) {
      return rows.map(mapDbProduct);
    }
  } catch {
    /* fallback */
  }
  return catalogFallback.slice(0, limit).map(enrichFromCatalogSeed);
}

export async function findProductById(
  id: string,
): Promise<Product | undefined> {
  try {
    const row = await prisma.product.findFirst({
      where: {
        AND: [
          shopCatalogProductWhere,
          { OR: [{ id }, { sku: id }, { slug: id }] },
        ],
      },
      include: productInclude,
    });
    if (row) return mapDbProduct(row);
  } catch {
    /* fallback */
  }
  const staticMatch = catalogFallback.find(
    (p) => p.id === id || p.sku === id || p.slug === id,
  );
  return staticMatch ? enrichFromCatalogSeed(staticMatch) : undefined;
}

export async function findProductBySku(
  sku: string,
): Promise<Product | undefined> {
  return findProductById(sku);
}

const DEMO_SAVED_EMAIL = "user@indahmesin.com";

export async function getDemoShopUserId(): Promise<string | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: DEMO_SAVED_EMAIL },
      select: { id: true },
    });
    return user?.id ?? null;
  } catch {
    return null;
  }
}

export async function listSavedSkusForShop(): Promise<string[]> {
  const userId = await getDemoShopUserId();
  if (!userId) return [];
  try {
    const rows = await prisma.savedItem.findMany({
      where: { userId },
      include: { product: { select: { sku: true, isPublished: true } } },
    });
    return rows.filter((r) => r.product.isPublished).map((r) => r.product.sku);
  } catch {
    return [];
  }
}

export async function getSavedProducts(): Promise<Product[]> {
  const userId = await getDemoShopUserId();
  if (!userId) return listPublishedProducts().then((all) => all.slice(0, 0));

  try {
    const rows = await prisma.savedItem.findMany({
      where: { userId },
      include: {
        product: { include: productInclude },
      },
      orderBy: { createdAt: "desc" },
    });
    if (rows.length > 0) {
      return rows
        .filter((r) => r.product.isPublished)
        .map((r) => mapDbProduct(r.product));
    }
  } catch {
    /* fallback */
  }
  return [];
}

export async function toggleSavedProductBySku(
  sku: string,
): Promise<{ saved: boolean; skus: string[] }> {
  const userId = await getDemoShopUserId();
  if (!userId) {
    throw new Error("Demo user tidak ditemukan. Jalankan npm run db:seed");
  }

  const product = await prisma.product.findFirst({
    where: { AND: [{ sku }, shopCatalogProductWhere] },
  });
  if (!product) {
    throw new Error("Produk tidak ditemukan");
  }

  const existing = await prisma.savedItem.findUnique({
    where: { userId_productId: { userId, productId: product.id } },
  });

  if (existing) {
    await prisma.savedItem.delete({ where: { id: existing.id } });
  } else {
    await prisma.savedItem.create({ data: { userId, productId: product.id } });
  }

  const skus = await listSavedSkusForShop();
  return { saved: !existing, skus };
}

export { DEMO_SAVED_EMAIL };

import type { Product, ProductStatus } from "@/lib/products";
import { products as staticProducts, getProductBySku } from "@/lib/products";
import { stitchSavedSkus } from "@/lib/stitch-screens";
import { prisma } from "@/lib/prisma";
import type { Prisma, StockStatus } from "@prisma/client";

type ProductRow = Prisma.ProductGetPayload<{
  include: {
    category: true;
    media: true;
    features: true;
    specifications: true;
  };
}>;

function formatPrice(currency: string, price: Prisma.Decimal): string {
  const n = Number(price);
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
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

function stockLabel(status: StockStatus): string {
  switch (status) {
    case "INDENT":
      return "Indent";
    case "OUT_OF_STOCK":
      return "Out of Stock";
    default:
      return "Ready Stock";
  }
}

function enrichFromStatic(product: Product): Product {
  const ref = getProductBySku(product.sku);
  if (!ref) return product;
  return {
    ...product,
    image: product.image || ref.image,
    gallery: product.gallery?.length ? product.gallery : ref.gallery,
    features: product.features?.length ? product.features : ref.features,
    specs: product.specs?.length ? product.specs : ref.specs,
    priceLabel: product.priceLabel || ref.priceLabel,
    priceNote: product.priceNote ?? ref.priceNote,
    statusLabel: product.statusLabel ?? ref.statusLabel,
    savedPriceNote: ref.savedPriceNote,
    savedSecondaryAction: ref.savedSecondaryAction,
  };
}

export function mapDbProduct(row: ProductRow): Product {
  const primary =
    row.media.find((m) => m.isPrimary) ?? row.media.sort((a, b) => a.sortOrder - b.sortOrder)[0];
  const gallery = row.media
    .filter((m) => m.url !== primary?.url)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((m) => m.url);

  const mapped: Product = {
    id: row.id,
    sku: row.sku,
    name: row.name,
    subtitle: row.priceNote ?? row.name,
    category: row.category.slug,
    categoryLabel: row.category.name,
    image: primary?.url ?? "",
    gallery: gallery.length ? gallery : undefined,
    priceLabel: formatPrice(row.currency, row.price),
    priceNote: row.priceNote ?? undefined,
    status: stockToProductStatus(row.stockStatus),
    statusLabel: stockLabel(row.stockStatus),
    features: row.features.sort((a, b) => a.sortOrder - b.sortOrder).map((f) => f.text),
    specs: row.specifications
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((s) => ({ label: s.attribute, value: s.value })),
  };
  return enrichFromStatic(mapped);
}

const productInclude = {
  category: true,
  media: true,
  features: true,
  specifications: true,
} as const;

export async function listPublishedProducts(): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { isPublished: true },
      orderBy: { name: "asc" },
      include: productInclude,
    });
    if (rows.length > 0) {
      return rows.map(mapDbProduct);
    }
  } catch {
    /* DB belum siap — fallback static */
  }
  return staticProducts;
}

export async function listAllProducts(): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({
      orderBy: { name: "asc" },
      include: productInclude,
    });
    if (rows.length > 0) {
      return rows.map(mapDbProduct);
    }
  } catch {
    /* fallback */
  }
  return staticProducts;
}

export async function findProductById(id: string): Promise<Product | undefined> {
  try {
    const row = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { sku: id }, { slug: id }],
        isPublished: true,
      },
      include: productInclude,
    });
    if (row) return mapDbProduct(row);
  } catch {
    /* fallback */
  }
  const staticMatch = staticProducts.find((p) => p.id === id || p.sku === id);
  return staticMatch ? enrichFromStatic(staticMatch) : undefined;
}

export async function findProductBySku(sku: string): Promise<Product | undefined> {
  return findProductById(sku);
}

export async function getSavedProducts(): Promise<Product[]> {
  try {
    const rows = await prisma.savedItem.findMany({
      include: {
        product: { include: productInclude },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    if (rows.length > 0) {
      const mapped = rows.map((r) => mapDbProduct(r.product));
      const order = stitchSavedSkus as readonly string[];
      return order
        .map((sku) => mapped.find((p) => p.sku === sku))
        .filter((p): p is Product => Boolean(p));
    }
  } catch {
    /* fallback */
  }
  const all = await listPublishedProducts();
  const filtered = all.filter((p) => (stitchSavedSkus as readonly string[]).includes(p.sku));
  return filtered.map(enrichFromStatic);
}

export { stitchSavedSkus };

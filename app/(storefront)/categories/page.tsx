import type { Metadata } from "next";
import { Suspense } from "react";
import { listPublishedProducts } from "@/lib/storefront/catalog";
import {
  findCatalogCategoryBySlug,
  listCatalogCategories,
} from "@/lib/storefront/categories";
import { buildPageMetadata } from "@/lib/seo";
import { CategoriesView } from "./categories-view";

type Props = {
  searchParams: Promise<{ cat?: string; q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { cat, q } = await searchParams;
  const category = cat ? await findCatalogCategoryBySlug(cat) : undefined;

  if (q?.trim()) {
    return buildPageMetadata({
      title: `Search: ${q.trim()}`,
      description: `Search results for “${q.trim()}” in the MesinBagus industrial equipment catalog.`,
      path: `/categories?q=${encodeURIComponent(q.trim())}`,
    });
  }

  if (category) {
    return buildPageMetadata({
      title: category.name,
      description: `Browse ${category.name} from Indah Mesin — specifications, stock status, and WhatsApp quotation requests on MesinBagus.`,
      path: `/categories?cat=${encodeURIComponent(category.id)}`,
      keywords: [category.name, "mesin industri", "Indah Mesin", "MesinBagus"],
    });
  }

  return buildPageMetadata({
    title: "Product Categories",
    description:
      "Browse industrial machine categories — sterilization, can seaming, packaging sealers, conveyors, and production equipment.",
    path: "/categories",
    keywords: ["kategori mesin industri", "katalog mesin", "MesinBagus"],
  });
}

export default async function CategoriesPage() {
  const [products, categories] = await Promise.all([
    listPublishedProducts(),
    listCatalogCategories(),
  ]);

  return (
    <Suspense fallback={null}>
      <CategoriesView products={products} categories={categories} />
    </Suspense>
  );
}

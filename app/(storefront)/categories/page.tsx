import { Suspense } from "react";
import { listPublishedProducts } from "@/lib/storefront/catalog";
import { listCatalogCategories } from "@/lib/storefront/categories";
import { CategoriesView } from "./categories-view";

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

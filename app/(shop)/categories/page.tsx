import { Suspense } from "react";
import { listPublishedProducts } from "@/lib/catalog";
import { listCatalogCategories, type ShopCategory } from "@/lib/shop-categories";
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

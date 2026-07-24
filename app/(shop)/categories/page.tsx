import { Suspense } from "react";
import { listPublishedProducts } from "@/lib/catalog";
import { CategoriesView } from "./categories-view";

export default async function CategoriesPage() {
  const products = await listPublishedProducts();
  return (
    <Suspense fallback={null}>
      <CategoriesView products={products} />
    </Suspense>
  );
}

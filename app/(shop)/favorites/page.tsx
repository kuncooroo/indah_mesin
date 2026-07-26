import { getSavedProducts } from "@/lib/catalog";
import { FavoritesView } from "./favorites-view";

export default async function FavoritesPage() {
  const saved = await getSavedProducts();
  return <FavoritesView initialProducts={saved} />;
}

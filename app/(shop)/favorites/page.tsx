import { getSavedProducts } from "@/lib/catalog";
import { PwaBanner } from "@/components/shop/pwa-banner";
import { IndustrialHeader } from "@/components/shop/industrial-header";
import { FavoritesView } from "./favorites-view";

export default async function FavoritesPage() {
  const saved = await getSavedProducts();
  return (
    <>
      <PwaBanner />
      <IndustrialHeader />
      <FavoritesView initialProducts={saved} />
    </>
  );
}

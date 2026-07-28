import { getSavedProducts } from "@/lib/storefront/catalog";
import { PwaBanner } from "@/components/storefront/pwa-banner";
import { IndustrialHeader } from "@/components/storefront/industrial-header";
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

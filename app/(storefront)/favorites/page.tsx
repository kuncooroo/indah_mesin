import type { Metadata } from "next";
import { getSavedProducts } from "@/lib/storefront/catalog";
import { PwaBanner } from "@/components/storefront/pwa-banner";
import { IndustrialHeader } from "@/components/storefront/industrial-header";
import { buildPageMetadata } from "@/lib/seo";
import { FavoritesView } from "./favorites-view";

export const metadata: Metadata = buildPageMetadata({
  title: "Saved Products",
  description: "Your saved industrial machines on MesinBagus.",
  path: "/favorites",
  noIndex: true,
});

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

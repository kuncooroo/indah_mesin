import Link from "next/link";
import { ArrowRight, Search, Settings } from "lucide-react";
import { PwaBanner } from "@/components/shop/pwa-banner";
import { IndustrialHeader } from "@/components/shop/industrial-header";
import { CatalogCard } from "@/components/shop/catalog-card";
import { mainCategories, quickFilters } from "@/lib/categories";
import { products } from "@/lib/products";

export default function HomePage() {
  return (
    <>
      <PwaBanner />
      <IndustrialHeader />

      <main>
        <section className="relative overflow-hidden bg-metallic-bg px-4 pb-10 pt-8">
          <div className="relative z-10">
            <h2 className="mb-6 max-w-md text-2xl font-bold leading-tight text-primary">
              Temukan Solusi Industri Terbaik Anda
            </h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-outline" />
              <input
                type="search"
                placeholder="Cari CNC, Packaging, atau SKU..."
                className="w-full rounded-xl border border-border-subtle bg-white py-4 pl-12 pr-4 text-base shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <Settings className="pointer-events-none absolute -right-8 top-0 size-48 rotate-12 text-primary opacity-10" />
        </section>

        <section className="px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-primary">Kategori Utama</h3>
            <Link
              href="/categories"
              className="flex items-center gap-1 text-sm font-semibold text-primary"
            >
              Lihat Semua <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {mainCategories.map(({ id, name, icon: Icon }) => (
              <Link
                key={id}
                href={`/categories?cat=${id}`}
                className="group flex flex-col items-center rounded-xl border border-border-subtle bg-white p-4 text-center transition-all hover:shadow-md"
              >
                <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-surface-container transition-colors group-hover:bg-primary-container group-hover:text-white">
                  <Icon className="size-8" />
                </div>
                <span className="text-sm font-semibold text-on-surface">{name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="sticky top-16 z-40 border-y border-border-subtle bg-white py-3">
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4">
            {quickFilters.map((filter, i) => (
              <button
                key={filter}
                type="button"
                className={
                  i === 0
                    ? "shrink-0 rounded-full border border-primary bg-primary px-5 py-2 text-sm font-semibold text-white"
                    : "shrink-0 rounded-full border border-border-subtle px-5 py-2 text-sm font-semibold text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                }
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6 px-4 py-8">
          <h3 className="text-lg font-semibold text-primary">Peralatan Terbaru</h3>
          {products.slice(0, 3).map((product) => (
            <CatalogCard key={product.id} product={product} />
          ))}
        </section>

        <section className="relative mx-4 mb-8 overflow-hidden rounded-2xl bg-primary p-6 text-white">
          <h3 className="mb-2 text-lg font-semibold">Butuh Spesifikasi Kustom?</h3>
          <p className="mb-4 max-w-md text-sm text-on-primary-container opacity-90">
            Tim ahli kami siap membantu Anda merancang lini produksi yang paling
            efisien untuk bisnis Anda.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-primary transition-transform hover:scale-105 active:scale-95"
          >
            Konsultasi Teknis Gratis
          </Link>
        </section>
      </main>
    </>
  );
}

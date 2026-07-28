import Link from "next/link";

import Image from "next/image";

import { PwaBanner } from "@/components/storefront/pwa-banner";

import { IndustrialHeader } from "@/components/storefront/industrial-header";

import { CatalogCard } from "@/components/storefront/catalog-card";

import { MaterialSymbol } from "@/components/ui/material-symbol";

import { listFeaturedProducts, listPublishedProducts } from "@/lib/storefront/catalog";

import { listPublishedArticles } from "@/lib/storefront/content";
import { listBerandaCategories } from "@/lib/storefront/categories";
import { ShopSearchForm } from "@/components/storefront/shop-search-form";
import { MARKETPLACE_QUICK_FILTERS } from "@/lib/storefront/catalog-data";



export default async function BerandaArtikelPage() {

  const [featured, searchProducts, articles, categories] = await Promise.all([

    listFeaturedProducts(3),
    listPublishedProducts(),

    listPublishedArticles(),

    listBerandaCategories(5),
  ]);



  return (

    <>

      <PwaBanner />

      <IndustrialHeader showSearch={false} />



      <main className="mx-auto max-w-7xl">

        <section className="relative overflow-visible bg-metallic-bg px-margin-mobile pb-12 pt-8 md:px-margin-desktop">

          <div className="relative z-10">

            <h2 className="mb-6 max-w-2xl font-headline-lg-mobile text-headline-lg-mobile leading-tight text-primary md:font-headline-lg md:text-headline-lg">

              Find the Best Industrial <br className="hidden md:block" />

              Solution for Your Business

            </h2>

            <ShopSearchForm
              className="relative z-10 max-w-3xl"
              suggestions={searchProducts}
            />

          </div>

          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-10">

            <MaterialSymbol name="settings" className="rotate-12 text-[240px]" />

          </div>

        </section>



        <section className="px-margin-mobile py-section-gap md:px-margin-desktop">

          <div className="mb-6 flex items-center justify-between">

            <h3 className="font-headline-md text-headline-md text-primary">Main Categories</h3>

            <Link

              href="/categories"

              className="flex items-center gap-1 text-body-sm font-semibold text-primary"

            >

              View All <MaterialSymbol name="arrow_forward" className="text-sm" />

            </Link>

          </div>

          <div className="grid grid-cols-2 gap-4">

            {categories.map(({ id, name, icon }) => (

              <Link

                key={id}

                href={`/categories?cat=${encodeURIComponent(id)}`}

                className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border border-border-subtle bg-white p-6 text-center transition-all hover:shadow-md"

              >

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-container transition-colors group-hover:bg-primary-container group-hover:text-white">

                  <MaterialSymbol name={icon} className="text-[32px]" />

                </div>

                <span className="font-body-sm text-body-sm font-semibold text-on-surface">

                  {name}

                </span>

              </Link>

            ))}

          </div>

        </section>



        <section className="sticky top-12 z-40 border-y border-border-subtle bg-white py-4 md:top-16">

          <div className="no-scrollbar flex gap-3 overflow-x-auto px-margin-mobile py-1 md:px-margin-desktop">

            {MARKETPLACE_QUICK_FILTERS.map(({ id, label }, i) => (
              <Link
                key={id}
                href={`/categories?filter=${id}`}
                className={
                  i === 0
                    ? "shrink-0 rounded-full border border-primary px-5 py-2 text-body-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white active:scale-95"
                    : "shrink-0 rounded-full border border-border-subtle px-5 py-2 text-body-sm font-semibold text-on-surface-variant transition-colors hover:border-primary hover:text-primary active:scale-95"
                }
              >
                {label}
              </Link>
            ))}

          </div>

        </section>



        <section className="px-margin-mobile py-section-gap md:px-margin-desktop">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md text-primary">Latest Collection</h3>
          </div>
          <div className="flex flex-col gap-8">
            {featured.slice(0, 3).map((product) => (
              <CatalogCard key={product.id} product={product} />
            ))}
          </div>
        </section>



        <section className="px-margin-mobile py-section-gap md:px-margin-desktop">

          <div className="mb-6 flex items-center justify-between">

            <h3 className="font-headline-md text-headline-md text-primary">

              Artikel &amp; Berita Industri

            </h3>

            <span className="flex items-center gap-1 text-body-sm font-semibold text-primary">

              View All <MaterialSymbol name="arrow_forward" className="text-sm" />

            </span>

          </div>

          <div className="flex flex-col gap-6">

            {articles.map((article) => (

              <a

                key={article.slug}

                href="https://indahmesin.com"

                target="_blank"

                rel="noopener noreferrer"

                className="flex cursor-pointer gap-4 rounded-xl border border-border-subtle bg-white p-4 transition-all hover:shadow-md"

              >

                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">

                  <Image

                    src={article.image}

                    alt=""

                    fill

                    className="object-cover"

                    sizes="96px"

                  />

                </div>

                <div className="flex flex-col justify-center">

                  <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-primary">

                    {article.category}

                  </span>

                  <h4 className="mb-2 line-clamp-2 font-body-md font-bold text-on-surface">

                    {article.title}

                  </h4>

                  <div className="flex items-center gap-2 text-xs text-outline">

                    <MaterialSymbol name="calendar_today" className="text-sm" />

                    <span>{article.date}</span>

                    <span className="mx-1">•</span>

                    <span>{article.readTime}</span>

                  </div>

                </div>

              </a>

            ))}

          </div>

        </section>



        <section className="relative mx-margin-mobile my-section-gap flex flex-col items-center justify-between gap-6 overflow-hidden rounded-2xl bg-primary p-8 text-white md:mx-margin-desktop md:flex-row">

          <div className="relative z-10">

            <h3 className="mb-2 font-headline-md text-headline-md">Need Custom Specifications?</h3>

            <p className="max-w-lg text-body-md text-on-primary-container opacity-90">

              Tim ahli kami siap membantu Anda merancang lini produksi yang paling efisien untuk

              bisnis Anda.

            </p>

          </div>

          <Link

            href="/contact"

            className="relative z-10 whitespace-nowrap rounded-full bg-white px-8 py-3 font-bold text-primary transition-transform hover:scale-105 active:scale-95"

          >

            Free Technical Consultation

          </Link>

          <MaterialSymbol

            name="engineering"

            className="absolute -bottom-4 -right-4 rotate-[-15deg] text-[160px] opacity-10"

          />

        </section>

      </main>

    </>

  );

}

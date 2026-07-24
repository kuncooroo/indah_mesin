import Image from "next/image";

import Link from "next/link";

import { Ms } from "@/components/stitch/ms";

import type { Product } from "@/lib/products";



function statusBadgeClass(product: Product) {

  if (product.status === "ready") return "bg-status-ready text-white";

  if (product.status === "indent") return "bg-status-indent text-white";

  return "bg-status-indent text-white";

}



/** Featured catalog card — Stitch 752245 */

export function CatalogCard({ product }: { product: Product }) {

  const badgeLabel =

    product.status === "indent" && product.statusLabel

      ? product.statusLabel

      : product.statusLabel ?? "Ready Stock";



  return (

    <article className="group overflow-hidden rounded-xl border border-border-subtle bg-white transition-all duration-700 hover:shadow-xl">

      <div className="relative aspect-video overflow-hidden">

        <Image

          src={product.image}

          alt={product.name}

          fill

          className="object-cover transition-transform duration-500 group-hover:scale-105"

          sizes="430px"

        />

        <span

          className={`absolute left-3 top-3 rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${statusBadgeClass(product)}`}

        >

          {badgeLabel}

        </span>

      </div>

      <div className="p-6">

        <div className="mb-2 flex items-start justify-between">

          <h4 className="font-body-md text-body-md font-bold leading-tight text-on-surface">

            {product.name}

          </h4>

          <span className="font-label-technical text-label-technical text-primary">

            #{product.sku}

          </span>

        </div>

        <p className="mb-6 line-clamp-2 text-body-sm text-on-surface-variant">

          {product.subtitle}

        </p>

        <div className="flex items-center justify-between border-t border-border-subtle pt-4">

          <div className="flex flex-col">

            <span className="text-[10px] font-bold uppercase text-outline">Mulai Dari</span>

            <span className="font-label-technical text-label-technical font-bold text-primary">

              {product.priceLabel}

            </span>

          </div>

          <Link

            href={`/products/${product.id}`}

            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-button-text text-body-sm text-white transition-transform active:scale-95"

          >

            Detail <Ms name="visibility" className="text-sm" />

          </Link>

        </div>

      </div>

    </article>

  );

}


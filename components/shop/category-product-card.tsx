import Image from "next/image";
import Link from "next/link";
import { Ms } from "@/components/stitch/ms";
import type { Product } from "@/lib/products";

function statusBadge(product: Product) {
  if (product.status === "ready") {
    return { label: "READY STOCK", className: "bg-status-ready" };
  }
  if (product.status === "indent") {
    return { label: "INDEN", className: "bg-status-indent" };
  }
  return {
    label: (product.statusLabel ?? "CONTACT").toUpperCase(),
    className: "bg-status-indent",
  };
}

/** Kartu produk katalog — Stitch 360986f2 */
export function CategoryProductCard({ product }: { product: Product }) {
  const badge = statusBadge(product);

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border-subtle bg-surface transition-shadow hover:shadow-lg">
      <div className="relative h-48 overflow-hidden bg-metallic-bg">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="430px"
        />
        <div
          className={`absolute left-3 top-3 rounded px-2 py-1 text-[10px] font-bold tracking-wider text-on-primary ${badge.className}`}
        >
          {badge.label}
        </div>
        <button
          type="button"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface/80 text-primary shadow-sm backdrop-blur-sm transition-colors hover:bg-surface"
        >
          <Ms name="bookmark" className="text-[20px]" />
        </button>
      </div>
      <div className="flex flex-grow flex-col p-4">
        <span className="mb-1 font-label-technical text-label-technical text-on-surface-variant">
          SKU: {product.sku}
        </span>
        <h3 className="mb-2 line-clamp-2 font-headline-md text-headline-md text-primary">
          {product.name}
        </h3>
        <div className="mt-auto">
          <p className="text-body-sm text-on-surface-variant">Mulai Dari</p>
          <p className="mb-4 font-headline-md text-headline-md font-bold text-primary">
            {product.priceLabel}
          </p>
          <Link
            href={`/products/${product.id}`}
            className="block w-full rounded border border-primary py-2 text-center font-button-text text-primary transition-colors hover:bg-primary hover:text-on-primary"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </article>
  );
}

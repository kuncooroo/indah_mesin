import Image from "next/image";
import Link from "next/link";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { Product } from "@/lib/storefront/product-types";

function statusBadgeClass(product: Product) {
  if (product.status === "ready") return "bg-status-ready text-white";
  if (product.status === "indent") return "bg-status-indent text-white";
  return "bg-on-surface-variant text-white";
}

function badgeLabel(product: Product) {
  if (product.status === "indent" && product.statusLabel) return product.statusLabel;
  return product.statusLabel ?? "Ready Stock";
}

/** Kartu katalog — layout Koleksi Terbaru (IndustrialX home mock) */
export function CatalogCard({ product }: { product: Product }) {
  const description =
    product.subtitle?.trim() ||
    product.features?.[0] ||
    product.categoryLabel;

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
          {badgeLabel(product)}
        </span>
      </div>

      <div className="p-6">
        <span className="mb-1 block font-label-technical text-[11px] uppercase tracking-wider text-primary">
          #{product.sku}
        </span>
        <h4 className="mb-2 font-headline-md text-[18px] font-bold leading-tight text-on-surface">
          {product.name}
        </h4>
        <p className="mb-6 line-clamp-2 text-body-sm text-on-surface-variant">{description}</p>

        <div className="flex items-center justify-between border-t border-border-subtle pt-4">
          <div className="flex min-w-0 flex-col">
            <span className="text-[10px] font-bold uppercase text-outline">Starting From</span>
            <span className="truncate font-label-technical font-bold text-primary">{product.priceLabel}</span>
          </div>
          <Link
            href={`/products/${product.id}`}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 font-button-text text-body-sm text-white transition-transform active:scale-95"
          >
            Details <MaterialSymbol name="visibility" className="text-sm" />
          </Link>
        </div>
      </div>
    </article>
  );
}

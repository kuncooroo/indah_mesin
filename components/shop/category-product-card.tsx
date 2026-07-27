import Image from "next/image";
import Link from "next/link";
import { SaveProductButton } from "@/components/shop/saved-products-context";
import type { Product } from "@/lib/products";

function statusBadgeClass(product: Product) {
  if (product.status === "ready") return "bg-status-ready text-on-primary";
  if (product.status === "indent") return "bg-status-indent text-on-primary";
  return "bg-status-indent text-on-primary";
}

/** Kartu produk — screen Kategori & Filter (mobile) */
export function CategoryProductCard({ product }: { product: Product }) {
  const badgeLabel =
    product.status === "indent"
      ? "PREORDER"
      : product.status === "ready"
        ? "READY STOCK"
        : (product.statusLabel ?? "CONTACT").toUpperCase();

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
          className={`absolute left-3 top-3 rounded px-2 py-1 text-[10px] font-bold tracking-wider ${statusBadgeClass(product)}`}
        >
          {badgeLabel}
        </div>
        <SaveProductButton sku={product.sku} className="absolute right-3 top-3" />
      </div>
      <div className="flex flex-grow flex-col p-4">
        <span className="mb-1 font-label-technical text-label-technical text-on-surface-variant">
          SKU: {product.sku}
        </span>
        <h3 className="mb-2 line-clamp-2 font-headline-md text-headline-md text-primary">{product.name}</h3>
        <div className="mt-auto">
          <p className="text-body-sm text-on-surface-variant">Starting From</p>
          <p className="mb-4 font-headline-md text-headline-md font-bold text-primary">
            {product.priceLabel}
          </p>
          <Link
            href={`/products/${product.id}`}
            className="block w-full rounded border border-primary py-2 text-center font-button-text text-primary transition-colors hover:bg-primary hover:text-on-primary"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

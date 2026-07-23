import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products";

export function CatalogCard({ product }: { product: Product }) {
  const isReady = product.status === "ready";

  return (
    <article className="group overflow-hidden rounded-xl border border-border-subtle bg-white transition-all hover:shadow-xl">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="400px"
        />
        <span
          className={cn(
            "absolute left-3 top-3 rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white",
            isReady ? "bg-status-ready" : "bg-status-indent"
          )}
        >
          {product.statusLabel}
        </span>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h4 className="text-base font-bold leading-tight text-on-surface">
            {product.name}
          </h4>
          <span className="shrink-0 font-mono text-sm text-primary">
            #{product.sku}
          </span>
        </div>
        <p className="mb-4 line-clamp-2 text-sm text-on-surface-variant">
          {product.subtitle}
        </p>
        <div className="flex items-center justify-between border-t border-border-subtle pt-4">
          <div>
            <span className="text-[10px] font-bold uppercase text-outline">
              Mulai Dari
            </span>
            <p className="font-mono text-sm font-bold text-primary">
              {product.priceLabel}
            </p>
          </div>
          <Link
            href={`/products/${product.id}`}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-transform active:scale-95"
          >
            Detail <Eye className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Ms } from "@/components/stitch/ms";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Product } from "@/lib/products";
import { useSavedProducts } from "@/components/shop/saved-products-context";

function WaConsultIcon() {
  return (
    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.437 2.503 1.163 3.485l-.762 2.78 2.84-.744c.937.615 2.056.965 3.259.967 3.18 0 5.767-2.587 5.768-5.766.001-3.179-2.587-5.768-5.767-5.768zm3.385 8.19c-.147.414-.731.758-1.011.804-.265.044-.606.079-1.385-.224-1.344-.523-2.222-1.892-2.29-1.982-.066-.09-.547-.728-.547-1.387 0-.658.344-.982.467-1.114.123-.131.272-.164.362-.164.09 0 .181.001.259.005.083.004.195-.031.305.234.113.272.387.942.421 1.01.034.068.056.147.011.237-.044.091-.067.147-.134.226-.067.079-.141.176-.201.237-.068.068-.138.142-.06.276.078.135.347.573.744.927.511.456.944.597 1.079.665.135.067.213.056.291-.034.079-.09.336-.39.426-.523.09-.133.18-.111.303-.067.123.045.783.37.918.437.135.067.224.1.258.158.033.058.033.336-.114.75zM12 2C6.477 2 2 6.477 2 12c0 2.136.67 4.116 1.81 5.74L2 22l4.437-1.157C8.032 21.43 9.948 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.877 0-3.63-.527-5.124-1.435l-.366-.222-2.61.68.691-2.518-.242-.385C3.447 14.63 3 12.877 3 11c0-4.963 4.037-9 9-9s9 4.037 9 9-4.037 9-9 9z" />
    </svg>
  );
}

function savedStatusBadge(product: { status: string; statusLabel?: string }) {
  if (product.status === "ready") {
    return (
      <span className="rounded-full border border-status-ready/20 bg-status-ready/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-status-ready backdrop-blur-md">
        Ready Stock
      </span>
    );
  }
  return (
    <span className="rounded-full border border-status-indent/25 bg-status-indent/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-status-indent backdrop-blur-md">
      {product.statusLabel ?? "Indent"}
    </span>
  );
}

export function FavoritesView({ initialProducts }: { initialProducts: Product[] }) {
  const { skus, toggle } = useSavedProducts();
  const [local, setLocal] = useState(initialProducts);

  const saved = useMemo(() => {
    if (skus.length === 0) return [];
    return local.filter((p) => skus.includes(p.sku));
  }, [local, skus]);

  async function remove(sku: string) {
    await toggle(sku);
    setLocal((list) => list.filter((p) => p.sku !== sku));
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border-subtle bg-surface px-margin-mobile">
        <div className="flex items-center gap-3">
          <Link
            href="/beranda-artikel"
            className="rounded-full p-2 transition-colors hover:bg-surface-container active:opacity-80"
          >
            <Ms name="arrow_back" className="text-primary" />
          </Link>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">IndustrialX</h1>
        </div>
        <Link href="/categories" className="rounded-full p-2 text-primary" aria-label="Cari">
          <Ms name="search" />
        </Link>
      </header>

      <main className="px-margin-mobile py-6 pb-8">
        <div className="mb-6">
          <h2 className="mb-2 font-headline-lg text-headline-lg font-bold text-primary">Saved Items</h2>
          <p className="text-body-md text-on-surface-variant">
            Mesin yang Anda simpan — sinkron dengan database (akun demo).
          </p>
        </div>

        {saved.length === 0 ? (
          <div className="rounded-xl border border-border-subtle bg-surface-container-low p-8 text-center">
            <Ms name="bookmark" className="mx-auto mb-2 text-4xl text-outline" />
            <p className="text-body-md text-on-surface-variant">Belum ada item tersimpan.</p>
            <Link href="/categories" className="mt-4 inline-block font-semibold text-primary">
              Jelajahi katalog →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {saved.map((item, index) => (
              <article
                key={item.sku}
                className="overflow-hidden rounded-xl border border-border-subtle bg-surface-container-lowest shadow-sm"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-metallic-bg">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="430px" />
                  <button
                    type="button"
                    onClick={() => void remove(item.sku)}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-error shadow-sm active:scale-90"
                    aria-label="Hapus dari simpanan"
                  >
                    <Ms name="delete" className="text-lg" fill />
                  </button>
                  <div className="absolute bottom-3 left-3">{savedStatusBadge(item)}</div>
                </div>

                <div className="flex flex-col p-4">
                  <p className="mb-1 font-label-technical text-[10px] uppercase tracking-widest text-on-surface-variant">
                    SKU: {item.sku}
                  </p>
                  <Link
                    href={`/products/${item.id}`}
                    className="mb-4 font-headline-md text-lg font-bold leading-snug text-on-surface hover:text-primary"
                  >
                    {item.name}
                  </Link>

                  <div className="mb-4 rounded-lg bg-metallic-bg p-3">
                    <div className="flex items-baseline justify-between gap-2 text-sm">
                      <span className="text-on-surface-variant">Price Estimate:</span>
                      <span className="font-bold text-on-surface">{item.priceLabel}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <a
                      href={buildWhatsAppUrl(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] text-sm font-semibold text-white shadow-sm transition-all hover:brightness-105 active:scale-[0.98]"
                    >
                      <WaConsultIcon />
                      Consult via WhatsApp
                    </a>
                    <Link
                      href={`/products/${item.id}`}
                      className="flex h-12 w-full items-center justify-center rounded-lg border border-primary text-sm font-semibold text-primary transition-all hover:bg-surface-container active:scale-[0.98]"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {saved.length > 0 ? (
          <div className="mt-8 rounded-xl border border-border-subtle bg-surface-container-low p-4">
            <p className="text-body-md text-on-surface">
              Anda memiliki <strong>{saved.length} item</strong> tersimpan.
            </p>
          </div>
        ) : null}
      </main>
    </>
  );
}

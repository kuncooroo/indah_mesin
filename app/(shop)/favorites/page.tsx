import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Search, Trash2 } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { products } from "@/lib/products";
import { cn } from "@/lib/utils";

export default function FavoritesPage() {
  const saved = products.filter((p) =>
    ["retort-sterilizer", "vmc-850-x4", "vertical-retort"].includes(p.id)
  );

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border-subtle bg-surface px-4 safe-top">
        <div className="flex items-center gap-3">
          <Link href="/home" className="rounded-full p-2 hover:bg-surface-container">
            <ArrowLeft className="size-5 text-primary" />
          </Link>
          <h1 className="text-lg font-bold text-primary">IndustrialX</h1>
        </div>
        <button type="button" className="rounded-full p-2 hover:bg-surface-container">
          <Search className="size-5 text-primary" />
        </button>
      </header>

      <main className="px-4 py-8">
        <div className="mb-8">
          <h2 className="mb-2 text-2xl font-bold text-primary">Saved Items</h2>
          <p className="text-base text-on-surface-variant">
            Review and manage your high-priority industrial equipment for
            procurement.
          </p>
        </div>

        <div className="space-y-4">
          {saved.map((product) => {
            const isReady = product.status === "ready";
            return (
              <article
                key={product.id}
                className="flex flex-col overflow-hidden rounded-lg border border-border-subtle bg-white transition-all hover:shadow-md"
              >
                <div className="relative aspect-video overflow-hidden bg-metallic-bg">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-error shadow-sm"
                    aria-label="Hapus"
                  >
                    <Trash2 className="size-4" />
                  </button>
                  <div className="absolute bottom-3 left-3">
                    <span
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md",
                        isReady
                          ? "border-status-ready/20 bg-status-ready/10 text-status-ready"
                          : "border-status-indent/20 bg-status-indent/10 text-status-indent"
                      )}
                    >
                      {product.statusLabel}
                    </span>
                  </div>
                </div>
                <div className="flex flex-grow flex-col p-3">
                  <span className="font-mono text-[13px] uppercase tracking-widest text-on-surface-variant">
                    SKU: {product.sku}
                  </span>
                  <h3 className="mb-4 text-lg font-semibold text-on-surface">
                    {product.name}
                  </h3>
                  <div className="mb-4 rounded bg-metallic-bg p-3">
                    <div className="flex justify-between text-sm text-on-surface-variant">
                      <span>Price Estimate:</span>
                      <span className="font-bold text-on-surface">
                        {product.priceLabel}
                      </span>
                    </div>
                  </div>
                  <a
                    href={buildWhatsAppUrl(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 items-center justify-center gap-2 rounded bg-[#25D366] text-base font-semibold text-white shadow-sm"
                  >
                    Consult via WhatsApp
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </>
  );
}

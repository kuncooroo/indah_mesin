"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { Product } from "@/lib/storefront/product-types";
import {
  DEFAULT_PO_DRAFT,
  defaultVoltageForProduct,
  readPoDraft,
  writePoDraft,
  type PoBuyerIdentity,
  type PoDraft,
} from "@/lib/storefront/po-draft";

export function PoEditForm({
  product,
  buyer,
}: {
  product: Product;
  buyer: PoBuyerIdentity;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<PoDraft>({
    ...DEFAULT_PO_DRAFT,
    voltage: defaultVoltageForProduct(product),
  });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const saved = readPoDraft(product.id);
      const nextDraft = {
        ...saved,
        voltage: saved.voltage || defaultVoltageForProduct(product),
        requestId: saved.requestId ?? crypto.randomUUID(),
      };
      setDraft(nextDraft);
      if (!saved.requestId) writePoDraft(nextDraft, product.id);
    });
    return () => window.clearTimeout(timeoutId);
  }, [product]);

  function update<K extends keyof PoDraft>(key: K, value: PoDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    writePoDraft(
      { ...draft, requestId: draft.requestId ?? crypto.randomUUID() },
      product.id
    );
    router.push(`/po-preview?product=${encodeURIComponent(product.id)}`);
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center gap-3 border-b border-border-subtle bg-surface px-margin-mobile">
        <Link
          href={`/po-preview?product=${encodeURIComponent(product.id)}`}
          className="rounded-full p-2 transition-colors hover:bg-surface-container"
          aria-label="Back"
        >
          <MaterialSymbol name="arrow_back" className="text-primary" />
        </Link>
        <h1 className="truncate font-headline-md text-headline-md font-bold text-primary">
          Edit Selection Details
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 px-margin-mobile py-8 pb-32">
        <p className="text-body-sm text-on-surface-variant">
          Product: <strong className="text-on-surface">{product.name}</strong> ({product.sku})
        </p>

        <section className="space-y-4 rounded-lg border border-border-subtle bg-white p-6">
          <h2 className="flex items-center gap-2 font-button-text text-primary">
            <MaterialSymbol name="settings_input_component" />
            Selection Details
          </h2>
          <label className="block">
            <span className="text-xs font-bold uppercase text-on-surface-variant">Voltage</span>
            <input
              className="mt-1 w-full rounded-lg border border-border-subtle px-3 py-2 text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20"
              value={draft.voltage}
              onChange={(e) => update("voltage", e.target.value)}
              required
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase text-on-surface-variant">Quantity</span>
            <input
              type="number"
              min={1}
              max={999}
              className="mt-1 w-full rounded-lg border border-border-subtle px-3 py-2 text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20"
              value={draft.quantity}
              onChange={(e) => update("quantity", Math.max(1, Number(e.target.value) || 1))}
              required
            />
          </label>
        </section>

        <section className="space-y-4 rounded-lg border border-border-subtle bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-button-text text-primary">
              <MaterialSymbol name="corporate_fare" />
              Company Information
            </h2>
            <Link href="/profile/business" className="text-body-sm font-semibold text-primary">
              Edit Business Identity
            </Link>
          </div>
          {[
            ["Your Name (PIC)", buyer.name],
            ["Company Name", buyer.companyName],
            ["Phone Number", buyer.phone],
            ["Company Address", buyer.address],
            ["NPWP / NIB", `${buyer.npwpNumber} / ${buyer.nibNumber}`],
          ].map(([label, value]) => (
            <div key={label}>
              <span className="text-xs font-bold uppercase text-on-surface-variant">{label}</span>
              <p className="mt-1 border-b border-dashed border-outline-variant py-2 text-body-md">
                {value}
              </p>
            </div>
          ))}
          <p className="text-xs text-on-surface-variant">
            Data ini diambil dari akun dan Business Identity agar dokumen PO tetap konsisten.
          </p>
        </section>

        <button
          type="button"
          onClick={() =>
            setDraft({
              ...DEFAULT_PO_DRAFT,
              voltage: defaultVoltageForProduct(product),
              requestId: draft.requestId ?? crypto.randomUUID(),
            })
          }
          className="text-body-sm font-semibold text-primary underline-offset-2 hover:underline"
        >
          Reset to defaults
        </button>

        <div className="fixed bottom-16 left-0 right-0 z-50 mx-auto max-w-[430px] border-t border-border-subtle bg-surface/95 p-4 backdrop-blur-md">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 font-button-text text-white active:scale-[0.98]"
          >
            <MaterialSymbol name="save" />
            Save &amp; Review PO
          </button>
        </div>
      </form>
    </>
  );
}

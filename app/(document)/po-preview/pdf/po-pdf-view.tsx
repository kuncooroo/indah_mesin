"use client";

import Link from "next/link";
import { Ms } from "@/components/stitch/ms";

export function PoPdfToolbar({
  backHref,
  iframeSrc,
}: {
  backHref: string;
  iframeSrc: string;
}) {
  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border-subtle bg-surface px-4 print:hidden">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href={backHref}
            className="rounded-full p-2 transition-colors hover:bg-surface-container active:opacity-80"
            aria-label="Kembali ke Review PO"
          >
            <Ms name="arrow_back" className="text-primary" />
          </Link>
          <h1 className="truncate text-sm font-bold text-primary sm:text-base">
            Purchase Order (A4)
          </h1>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1 rounded-full border border-primary px-3 py-1.5 text-xs font-semibold text-primary active:bg-primary/5"
        >
          <Ms name="print" className="text-base" />
          Print
        </button>
      </header>
      <iframe
        title="Purchase Order Preview"
        src={iframeSrc}
        className="min-h-0 w-full flex-1 border-0 bg-white"
        style={{ height: "calc(100dvh - 3.5rem)" }}
      />
    </>
  );
}

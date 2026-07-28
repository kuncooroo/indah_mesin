"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { cn } from "@/lib/utils";

type SavedContextValue = {
  skus: string[];
  loading: boolean;
  refresh: () => Promise<void>;
  toggle: (sku: string) => Promise<boolean>;
  isSaved: (sku: string) => boolean;
};

const SavedContext = createContext<SavedContextValue | null>(null);

export function SavedProductsProvider({ children }: { children: React.ReactNode }) {
  const [skus, setSkus] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/shop/saved", { cache: "no-store" });
      const data = (await res.json()) as { skus?: string[] };
      setSkus(data.skus ?? []);
    } catch {
      setSkus([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void refresh());
  }, [refresh]);

  const toggle = useCallback(async (sku: string) => {
    const res = await fetch("/api/shop/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sku }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { skus?: string[] };
    setSkus(data.skus ?? []);
    return true;
  }, []);

  const isSaved = useCallback((sku: string) => skus.includes(sku), [skus]);

  const value = useMemo(
    () => ({ skus, loading, refresh, toggle, isSaved }),
    [skus, loading, refresh, toggle, isSaved]
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSavedProducts() {
  const ctx = useContext(SavedContext);
  if (!ctx) {
    throw new Error("useSavedProducts must be used within SavedProductsProvider");
  }
  return ctx;
}

type SaveProductButtonProps = {
  sku: string;
  className?: string;
  iconClassName?: string;
};

export function SaveProductButton({ sku, className, iconClassName }: SaveProductButtonProps) {
  const { isSaved, toggle, loading } = useSavedProducts();
  const saved = isSaved(sku);

  return (
    <button
      type="button"
      disabled={loading}
      aria-label={saved ? "Hapus dari simpanan" : "Simpan produk"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void toggle(sku);
      }}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-surface/80 text-primary shadow-sm backdrop-blur-sm transition-colors hover:bg-surface disabled:opacity-50",
        className
      )}
    >
      <MaterialSymbol name="bookmark" className={cn("text-[20px]", iconClassName)} fill={saved} />
    </button>
  );
}

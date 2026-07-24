"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { setProductPublished } from "@/lib/admin-actions";

export function ProductPublishToggle({
  productId,
  published,
}: {
  productId: string;
  published: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      try {
        await setProductPublished(productId, !published);
        toast.success(published ? "Produk dinonaktifkan" : "Produk diaktifkan");
      } catch {
        toast.error("Gagal memperbarui produk");
      }
    });
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={toggle}
      className="rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
    >
      {published ? "Nonaktifkan" : "Aktifkan"}
    </button>
  );
}

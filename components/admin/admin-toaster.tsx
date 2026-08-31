"use client";

import { Toaster } from "@/components/ui/sonner";

/** Toast khusus admin — tema gelap/neutral, terpisah dari storefront. */
export function AdminToaster() {
  return (
    <Toaster
      position="top-right"
      richColors={false}
      closeButton
      toastOptions={{
        classNames: {
          toast: "!bg-neutral-900 !text-white !border-neutral-700",
          title: "!text-white",
          description: "!text-neutral-300",
          closeButton: "!border-neutral-600 !bg-neutral-800 !text-white",
        },
      }}
    />
  );
}

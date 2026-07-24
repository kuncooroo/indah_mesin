"use client";

import { useState } from "react";
import { Ms } from "@/components/stitch/ms";

export function PwaBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className="sticky top-0 z-[60] flex items-center justify-between bg-primary px-margin-mobile py-2 text-body-sm text-white md:px-margin-desktop"
      id="pwa-banner"
    >
      <div className="flex items-center gap-2">
        <Ms name="install_mobile" className="text-[20px]" />
        <span>Pasang IndustrialX untuk akses lebih cepat</span>
      </div>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-primary transition-transform active:scale-95"
      >
        Install
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Smartphone, X } from "lucide-react";

export function PwaBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="sticky top-0 z-[60] flex items-center justify-between bg-primary px-4 py-2 text-sm text-white safe-top">
      <div className="flex items-center gap-2">
        <Smartphone className="size-5" />
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

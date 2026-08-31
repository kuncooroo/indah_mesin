"use client";

import { useState } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";

export const ADMIN_MATERIAL_ICONS = [
  "category",
  "factory",
  "cleaning_services",
  "view_in_ar",
  "inventory_2",
  "precision_manufacturing",
  "conveyor_belt",
  "settings",
  "build",
  "engineering",
  "water_drop",
  "local_shipping",
  "warehouse",
  "handyman",
  "science",
  "biotech",
  "agriculture",
  "kitchen",
  "restaurant",
  "storefront",
  "shopping_cart",
  "package_2",
  "deployed_code",
  "heat_pump",
  "air",
  "bolt",
  "electric_bolt",
  "compress",
  "filter_alt",
  "recycling",
] as const;

export function AdminIconPicker({
  name = "icon",
  defaultValue = "category",
}: {
  name?: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue || "category");
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-3 block text-sm md:col-span-2">
      <span className="font-medium text-neutral-700">Ikon (Material Symbols)</span>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-1 flex w-full items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left text-sm hover:bg-neutral-50"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100">
          <MaterialSymbol name={value} className="text-xl text-neutral-800" />
        </span>
        <span className="font-mono text-neutral-700">{value}</span>
        <span className="ml-auto text-xs text-neutral-400">{open ? "Tutup" : "Pilih ikon"}</span>
      </button>
      {open ? (
        <div className="mt-2 grid max-h-48 grid-cols-6 gap-1 overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-50 p-2 sm:grid-cols-8">
          {ADMIN_MATERIAL_ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              title={icon}
              onClick={() => {
                setValue(icon);
                setOpen(false);
              }}
              className={`flex flex-col items-center gap-0.5 rounded-md p-2 text-[10px] transition-colors hover:bg-white ${
                value === icon ? "bg-neutral-900 text-white hover:bg-neutral-800" : "text-neutral-600"
              }`}
            >
              <MaterialSymbol name={icon} className="text-lg" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

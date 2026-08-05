"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FieldError, inputErrorClass } from "@/components/ui/form-feedback";
import { cn } from "@/lib/utils";

type WilayahItem = { id: string; name: string };

export type LocationSelection = {
  provinceId: string;
  provinceName: string;
  regencyId: string;
  regencyName: string;
  districtId: string;
  districtName: string;
  villageId: string;
  villageName: string;
  detail: string;
  postalCode: string;
};

const emptyLocation: LocationSelection = {
  provinceId: "",
  provinceName: "",
  regencyId: "",
  regencyName: "",
  districtId: "",
  districtName: "",
  villageId: "",
  villageName: "",
  detail: "",
  postalCode: "",
};

async function loadWilayah(level: string, parentId?: string) {
  const params = new URLSearchParams({ level });
  if (parentId) params.set("parentId", parentId);
  const response = await fetch(`/api/location?${params.toString()}`);
  const result = (await response.json()) as { items?: WilayahItem[]; error?: string };
  if (!response.ok) throw new Error(result.error ?? "Gagal memuat wilayah.");
  return result.items ?? [];
}

export function IndonesiaAddressFields({
  value,
  onChange,
  errors,
}: {
  value: LocationSelection;
  onChange: (next: LocationSelection) => void;
  errors?: Partial<Record<keyof LocationSelection | "location", string>>;
}) {
  const [provinces, setProvinces] = useState<WilayahItem[]>([]);
  const [regencies, setRegencies] = useState<WilayahItem[]>([]);
  const [districts, setDistricts] = useState<WilayahItem[]>([]);
  const [villages, setVillages] = useState<WilayahItem[]>([]);
  const [loading, setLoading] = useState("");

  useEffect(() => {
    void loadWilayah("provinces")
      .then(setProvinces)
      .catch(() => setProvinces([]));
  }, []);

  async function pickProvince(id: string) {
    const province = provinces.find((item) => item.id === id);
    onChange({
      ...emptyLocation,
      provinceId: id,
      provinceName: province?.name ?? "",
      detail: value.detail,
      postalCode: value.postalCode,
    });
    setRegencies([]);
    setDistricts([]);
    setVillages([]);
    if (!id) return;
    setLoading("regencies");
    try {
      setRegencies(await loadWilayah("regencies", id));
    } finally {
      setLoading("");
    }
  }

  async function pickRegency(id: string) {
    const regency = regencies.find((item) => item.id === id);
    onChange({
      ...value,
      regencyId: id,
      regencyName: regency?.name ?? "",
      districtId: "",
      districtName: "",
      villageId: "",
      villageName: "",
    });
    setDistricts([]);
    setVillages([]);
    if (!id) return;
    setLoading("districts");
    try {
      setDistricts(await loadWilayah("districts", id));
    } finally {
      setLoading("");
    }
  }

  async function pickDistrict(id: string) {
    const district = districts.find((item) => item.id === id);
    onChange({
      ...value,
      districtId: id,
      districtName: district?.name ?? "",
      villageId: "",
      villageName: "",
    });
    setVillages([]);
    if (!id) return;
    setLoading("villages");
    try {
      setVillages(await loadWilayah("villages", id));
    } finally {
      setLoading("");
    }
  }

  function pickVillage(id: string) {
    const village = villages.find((item) => item.id === id);
    onChange({
      ...value,
      villageId: id,
      villageName: village?.name ?? "",
    });
  }

  return (
    <div className="space-y-3">
      <SearchableSelect
        label="Province"
        value={value.provinceId}
        selectedLabel={value.provinceName}
        options={provinces}
        onChange={(id) => void pickProvince(id)}
        error={errors?.provinceId}
        placeholder="Search / select province"
      />
      <SearchableSelect
        label="City / Regency"
        value={value.regencyId}
        selectedLabel={value.regencyName}
        options={regencies}
        onChange={(id) => void pickRegency(id)}
        error={errors?.regencyId}
        placeholder={loading === "regencies" ? "Loading…" : "Search / select city or regency"}
        disabled={!value.provinceId || loading === "regencies"}
      />
      <SearchableSelect
        label="District"
        value={value.districtId}
        selectedLabel={value.districtName}
        options={districts}
        onChange={(id) => void pickDistrict(id)}
        error={errors?.districtId}
        placeholder={loading === "districts" ? "Loading…" : "Search / select district"}
        disabled={!value.regencyId || loading === "districts"}
      />
      <SearchableSelect
        label="Village / Sub-district"
        value={value.villageId}
        selectedLabel={value.villageName}
        options={villages}
        onChange={pickVillage}
        error={errors?.villageId}
        placeholder={loading === "villages" ? "Loading…" : "Search / select village"}
        disabled={!value.districtId || loading === "villages"}
      />
      <label className="block space-y-1">
        <span className="font-label-technical text-label-technical uppercase text-outline">
          Street, Building, House No.
        </span>
        <textarea
          value={value.detail}
          onChange={(event) => onChange({ ...value, detail: event.target.value })}
          rows={2}
          placeholder="Example: Jl. Industri Raya No. 45, Blok B"
          className={cn(
            "w-full resize-none rounded-lg border border-transparent bg-surface-container px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20",
            inputErrorClass(Boolean(errors?.detail))
          )}
        />
        <FieldError message={errors?.detail} />
      </label>
      <label className="block space-y-1">
        <span className="font-label-technical text-label-technical uppercase text-outline">
          Postal Code
        </span>
        <input
          value={value.postalCode}
          onChange={(event) =>
            onChange({ ...value, postalCode: event.target.value.replace(/\D/g, "").slice(0, 5) })
          }
          inputMode="numeric"
          placeholder="17530"
          className={cn(
            "h-11 w-full rounded-lg border border-transparent bg-surface-container px-3 outline-none focus:ring-2 focus:ring-primary/20",
            inputErrorClass(Boolean(errors?.postalCode))
          )}
        />
        <FieldError message={errors?.postalCode} />
      </label>
      <FieldError message={errors?.location} />
    </div>
  );
}

function SearchableSelect({
  label,
  value,
  selectedLabel,
  options,
  onChange,
  error,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  selectedLabel?: string;
  options: WilayahItem[];
  onChange: (id: string) => void;
  error?: string;
  placeholder: string;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && selectedLabel) setQuery(selectedLabel);
    if (!value) setQuery("");
  }, [value, selectedLabel]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || (selectedLabel && q === selectedLabel.toLowerCase())) return options;
    return options.filter((item) => item.name.toLowerCase().includes(q));
  }, [options, query, selectedLabel]);

  return (
    <div ref={rootRef} className="relative block space-y-1">
      <span className="font-label-technical text-label-technical uppercase text-outline">{label}</span>
      <input
        type="text"
        value={query}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        onFocus={() => {
          if (!disabled) setOpen(true);
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          if (value) onChange("");
        }}
        className={cn(
          "h-11 w-full rounded-lg border border-transparent bg-surface-container px-3 outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60",
          inputErrorClass(Boolean(error))
        )}
      />
      {open && !disabled ? (
        <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-border-subtle bg-surface-container-lowest shadow-lg">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-on-surface-variant">No results</li>
          ) : (
            filtered.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-surface-container",
                    item.id === value && "bg-primary/10 font-medium text-primary"
                  )}
                  onClick={() => {
                    onChange(item.id);
                    setQuery(item.name);
                    setOpen(false);
                  }}
                >
                  {item.name}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
      <FieldError message={error} />
    </div>
  );
}

export function locationToAddressPayload(location: LocationSelection, label: string) {
  const city = [location.villageName, location.districtName, location.regencyName, location.provinceName]
    .filter(Boolean)
    .join(", ");
  return {
    label,
    addressDetail: location.detail.trim(),
    city,
    postalCode: location.postalCode.trim(),
  };
}

export function validateLocation(location: LocationSelection) {
  const errors: Partial<Record<keyof LocationSelection, string>> = {};
  if (!location.provinceId) errors.provinceId = "Province is required.";
  if (!location.regencyId) errors.regencyId = "City / regency is required.";
  if (!location.districtId) errors.districtId = "District is required.";
  if (!location.villageId) errors.villageId = "Village / sub-district is required.";
  if (location.detail.trim().length < 5) {
    errors.detail = "Street address must be at least 5 characters.";
  }
  return errors;
}

export { emptyLocation };

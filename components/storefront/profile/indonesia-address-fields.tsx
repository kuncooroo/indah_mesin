"use client";

import { useEffect, useState } from "react";
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
      <SelectField
        label="Provinsi"
        value={value.provinceId}
        options={provinces}
        onChange={(id) => void pickProvince(id)}
        error={errors?.provinceId}
        placeholder="Pilih provinsi"
      />
      <SelectField
        label="Kota / Kabupaten"
        value={value.regencyId}
        options={regencies}
        onChange={(id) => void pickRegency(id)}
        error={errors?.regencyId}
        placeholder={loading === "regencies" ? "Memuat…" : "Pilih kota/kabupaten"}
        disabled={!value.provinceId || loading === "regencies"}
      />
      <SelectField
        label="Kecamatan"
        value={value.districtId}
        options={districts}
        onChange={(id) => void pickDistrict(id)}
        error={errors?.districtId}
        placeholder={loading === "districts" ? "Memuat…" : "Pilih kecamatan"}
        disabled={!value.regencyId || loading === "districts"}
      />
      <SelectField
        label="Kelurahan / Desa"
        value={value.villageId}
        options={villages}
        onChange={pickVillage}
        error={errors?.villageId}
        placeholder={loading === "villages" ? "Memuat…" : "Pilih kelurahan/desa"}
        disabled={!value.districtId || loading === "villages"}
      />
      <label className="block space-y-1">
        <span className="font-label-technical text-label-technical uppercase text-outline">
          Nama Jalan, Gedung, No. Rumah
        </span>
        <textarea
          value={value.detail}
          onChange={(event) => onChange({ ...value, detail: event.target.value })}
          rows={2}
          placeholder="Contoh: Jl. Industri Raya No. 45, Blok B"
          className={cn(
            "w-full resize-none rounded-lg border border-transparent bg-surface-container px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20",
            inputErrorClass(Boolean(errors?.detail))
          )}
        />
        <FieldError message={errors?.detail} />
      </label>
      <label className="block space-y-1">
        <span className="font-label-technical text-label-technical uppercase text-outline">
          Kode Pos
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

function SelectField({
  label,
  value,
  options,
  onChange,
  error,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  options: WilayahItem[];
  onChange: (id: string) => void;
  error?: string;
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <label className="block space-y-1">
      <span className="font-label-technical text-label-technical uppercase text-outline">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-11 w-full rounded-lg border border-transparent bg-surface-container px-3 outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60",
          inputErrorClass(Boolean(error))
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      <FieldError message={error} />
    </label>
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
  if (!location.provinceId) errors.provinceId = "Provinsi wajib dipilih.";
  if (!location.regencyId) errors.regencyId = "Kota/Kabupaten wajib dipilih.";
  if (!location.districtId) errors.districtId = "Kecamatan wajib dipilih.";
  if (!location.villageId) errors.villageId = "Kelurahan/Desa wajib dipilih.";
  if (location.detail.trim().length < 5) {
    errors.detail = "Detail alamat minimal 5 karakter.";
  }
  return errors;
}

export { emptyLocation };

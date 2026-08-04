"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import { ProfileSettingsHeader } from "@/components/storefront/profile/profile-settings-header";
import {
  emptyLocation,
  IndonesiaAddressFields,
  locationToAddressPayload,
  validateLocation,
  type LocationSelection,
} from "@/components/storefront/profile/indonesia-address-fields";
import { FieldError, FormAlert, inputErrorClass } from "@/components/ui/form-feedback";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import {
  formatNpwpDisplay,
  nibErrorMessage,
  normalizeNib,
  npwpErrorMessage,
} from "@/lib/storefront/legal-ids";
import { cn } from "@/lib/utils";

type Address = {
  id: string;
  label: string;
  addressDetail: string;
  city: string;
  postalCode: string | null;
  isPrimary: boolean;
};

type Personnel = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  position: string | null;
  role: string;
  verificationStatus: string;
};

type Business = {
  id: string | null;
  companyName: string;
  npwpNumber: string | null;
  nibNumber: string | null;
  isVerified: boolean;
  addresses: Address[];
  personnel: Personnel[];
};

type BusinessResponse = {
  canManage: boolean;
  businessComplete: boolean;
  business: Business;
};

export default function BusinessIdentityClient() {
  const searchParams = useSearchParams();
  const needPo = searchParams.get("need") === "po";
  const missingFromQuery = useMemo(
    () =>
      (searchParams.get("missing") ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [searchParams]
  );
  const productId = searchParams.get("product");
  const [data, setData] = useState<BusinessResponse | null>(null);
  const [npwp, setNpwp] = useState("");
  const [nib, setNib] = useState("");
  const [addressLabel, setAddressLabel] = useState("");
  const [location, setLocation] = useState<LocationSelection>(emptyLocation);
  const [addressPrimary, setAddressPrimary] = useState(true);
  const [editingAddressId, setEditingAddressId] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteResult, setInviteResult] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const loadBusiness = useCallback(async () => {
    const response = await fetch("/api/profile/business");
    const result = (await response.json()) as BusinessResponse & { error?: string };
    if (!response.ok) throw new Error(result.error ?? "Gagal memuat identitas bisnis.");
    setData(result);
    setNpwp(formatNpwpDisplay(result.business.npwpNumber ?? ""));
    setNib(normalizeNib(result.business.nibNumber ?? ""));
  }, []);

  useEffect(() => {
    let active = true;
    void loadBusiness()
      .catch((reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "Gagal memuat identitas bisnis.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [loadBusiness]);

  async function saveCompany(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!data?.canManage) return;
    const form = new FormData(event.currentTarget);
    const companyName = String(form.get("companyName") ?? "").trim();
    const nextErrors: Record<string, string> = {};
    if (companyName.length < 2) nextErrors.companyName = "Nama perusahaan minimal 2 karakter.";
    const npwpMsg = npwpErrorMessage(npwp);
    const nibMsg = nibErrorMessage(nib);
    if (npwpMsg) nextErrors.npwpNumber = npwpMsg;
    if (nibMsg) nextErrors.nibNumber = nibMsg;
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/profile/business", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "company",
          companyName,
          npwpNumber: npwp,
          nibNumber: nib,
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Gagal menyimpan perusahaan.");
      await loadBusiness();
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Gagal menyimpan perusahaan.");
    } finally {
      setSaving(false);
    }
  }

  async function saveAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!data?.canManage) return;
    const locationErrors = validateLocation(location);
    const nextErrors: Record<string, string> = { ...locationErrors };
    if (addressLabel.trim().length < 2) nextErrors.label = "Label lokasi minimal 2 karakter.";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = locationToAddressPayload(location, addressLabel.trim());
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/profile/business", {
        method: editingAddressId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editingAddressId ? { kind: "address", id: editingAddressId } : {}),
          ...payload,
          isPrimary: addressPrimary,
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Gagal menyimpan alamat.");
      await loadBusiness();
      setLocation(emptyLocation);
      setAddressLabel("");
      setEditingAddressId("");
      setShowAddressForm(false);
      setFieldErrors({});
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Gagal menyimpan alamat.");
    } finally {
      setSaving(false);
    }
  }

  async function inviteMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!data?.canManage) return;
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      position: String(form.get("position") ?? "").trim(),
    };
    const nextErrors: Record<string, string> = {};
    if (payload.name.length < 2) nextErrors.inviteName = "Nama anggota minimal 2 karakter.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      nextErrors.inviteEmail = "Email anggota tidak valid.";
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    setError("");
    setInviteResult("");
    try {
      const response = await fetch("/api/profile/business/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        error?: string;
        message?: string;
        inviteUrl?: string;
      };
      if (!response.ok) throw new Error(result.error ?? "Gagal membuat undangan.");
      setInviteResult(
        result.inviteUrl
          ? `${result.message ?? "Undangan siap."}\n${result.inviteUrl}`
          : result.message ?? "Undangan dibuat."
      );
      await loadBusiness();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Gagal membuat undangan.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteAddress(id: string) {
    if (!data?.canManage || !window.confirm("Hapus alamat ini?")) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/profile/business?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Gagal menghapus alamat.");
      await loadBusiness();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Gagal menghapus alamat.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <ProfileSettingsHeader backHref="/profile" title="Business Identity" />
      <main className="min-h-screen bg-background pb-24 pt-16">
        <div className="space-y-section-gap px-4 py-8">
          {loading ? (
            <div className="space-y-4">
              <div className="h-48 animate-pulse rounded-xl bg-surface-container" />
              <div className="h-64 animate-pulse rounded-xl bg-surface-container" />
            </div>
          ) : data ? (
            <>
              {needPo ? (
                <div className="space-y-1 rounded-xl border border-error/20 bg-error-container/40 p-3">
                  {(missingFromQuery.length > 0
                    ? missingFromQuery
                    : ["identitas bisnis"]
                  ).map((field) => (
                    <FieldError key={field} message={`Lengkapi ${field} untuk membuat PO.`} />
                  ))}
                </div>
              ) : !data.businessComplete ? (
                <div className="flex items-start gap-3 rounded-xl border border-status-indent/20 bg-status-indent/10 p-4">
                  <MaterialSymbol name="info" className="text-status-indent" />
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Lengkapi identitas legal dan alamat perusahaan untuk mempercepat verifikasi PO.
                  </p>
                </div>
              ) : null}

              {needPo && productId && data.businessComplete ? (
                <Link
                  href={`/po-preview?product=${encodeURIComponent(productId)}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-button-text text-on-primary"
                >
                  Lanjut ke Preview PO
                  <MaterialSymbol name="arrow_forward" className="text-[18px]" />
                </Link>
              ) : null}

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline-md text-headline-md text-on-surface">
                    Business Identity
                  </h2>
                  <VerificationBadge
                    verified={data.business.isVerified}
                    complete={data.businessComplete}
                  />
                </div>
                <form
                  onSubmit={saveCompany}
                  className="space-y-4 rounded-xl bg-surface-container-low p-4"
                  noValidate
                >
                  <BusinessField
                    name="companyName"
                    label="Company Name"
                    defaultValue={data.business.companyName}
                    readOnly={!data.canManage}
                    required
                    error={fieldErrors.companyName}
                  />
                  <label className="block space-y-1">
                    <span className="font-label-technical text-label-technical uppercase text-outline">
                      NPWP (15 atau 16 digit)
                    </span>
                    <input
                      value={npwp}
                      onChange={(event) => setNpwp(formatNpwpDisplay(event.target.value))}
                      readOnly={!data.canManage}
                      inputMode="numeric"
                      placeholder="01.234.567.8-012.000"
                      className={cn(
                        "h-12 w-full rounded-lg border border-transparent bg-surface-container px-3 font-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary/20 read-only:opacity-70",
                        inputErrorClass(Boolean(fieldErrors.npwpNumber))
                      )}
                    />
                    <FieldError message={fieldErrors.npwpNumber} />
                  </label>
                  <label className="block space-y-1">
                    <span className="font-label-technical text-label-technical uppercase text-outline">
                      NIB (13 digit)
                    </span>
                    <input
                      value={nib}
                      onChange={(event) => setNib(normalizeNib(event.target.value))}
                      readOnly={!data.canManage}
                      inputMode="numeric"
                      placeholder="1234567890123"
                      maxLength={13}
                      className={cn(
                        "h-12 w-full rounded-lg border border-transparent bg-surface-container px-3 font-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary/20 read-only:opacity-70",
                        inputErrorClass(Boolean(fieldErrors.nibNumber))
                      )}
                    />
                    <FieldError message={fieldErrors.nibNumber} />
                  </label>
                  {data.canManage ? (
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-button-text text-on-primary disabled:opacity-60"
                    >
                      <MaterialSymbol name={saved ? "check_circle" : "save"} />
                      {saved ? "Business Saved" : saving ? "Saving…" : "Save Business Identity"}
                    </button>
                  ) : (
                    <p className="text-body-sm text-on-surface-variant">
                      Data perusahaan dikelola oleh buyer utama atau administrator.
                    </p>
                  )}
                </form>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MaterialSymbol name="factory" className="text-primary" />
                    <h2 className="font-headline-md text-headline-md text-on-surface">Facilities</h2>
                  </div>
                  {data.canManage ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAddressId("");
                        setAddressLabel("");
                        setLocation(emptyLocation);
                        setAddressPrimary(true);
                        setShowAddressForm((open) => !open);
                      }}
                      className="flex items-center gap-1 font-button-text text-primary"
                    >
                      <MaterialSymbol name="add_circle" className="text-[20px]" />
                      Add
                    </button>
                  ) : null}
                </div>

                {showAddressForm ? (
                  <form
                    onSubmit={saveAddress}
                    className="space-y-3 rounded-xl bg-surface-container-low p-4"
                    noValidate
                  >
                    <label className="block space-y-1">
                      <span className="font-label-technical text-label-technical uppercase text-outline">
                        Label Lokasi
                      </span>
                      <input
                        value={addressLabel}
                        onChange={(event) => setAddressLabel(event.target.value)}
                        placeholder="Gudang Cikarang"
                        className={cn(
                          "h-11 w-full rounded-lg border border-transparent bg-surface-container px-3 outline-none focus:ring-2 focus:ring-primary/20",
                          inputErrorClass(Boolean(fieldErrors.label))
                        )}
                      />
                      <FieldError message={fieldErrors.label} />
                    </label>
                    <IndonesiaAddressFields
                      value={location}
                      onChange={setLocation}
                      errors={fieldErrors}
                    />
                    <label className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                      <input
                        type="checkbox"
                        checked={addressPrimary}
                        onChange={(event) => setAddressPrimary(event.target.checked)}
                      />
                      Jadikan alamat utama
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="h-11 flex-1 rounded-xl bg-surface-container-high text-on-surface"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="h-11 flex-1 rounded-xl bg-primary text-on-primary disabled:opacity-60"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                ) : null}

                <div className="space-y-3">
                  {data.business.addresses.length ? (
                    data.business.addresses.map((address) => (
                      <article
                        key={address.id}
                        className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm"
                      >
                        <div className="flex h-20 items-center justify-center bg-surface-container-highest text-primary">
                          <MaterialSymbol name="location_on" className="text-[36px]" />
                        </div>
                        <div className="space-y-3 p-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-headline-md text-body-lg text-on-surface">
                                {address.label}
                              </h3>
                              {address.isPrimary ? (
                                <span className="rounded bg-secondary-container px-2 py-0.5 text-[10px] font-bold uppercase text-on-secondary-container">
                                  Primary
                                </span>
                              ) : null}
                            </div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              {address.addressDetail}, {address.city}
                              {address.postalCode ? `, ${address.postalCode}` : ""}
                            </p>
                          </div>
                          {data.canManage ? (
                            <div className="flex justify-end gap-2 border-t border-border-subtle pt-3">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingAddressId(address.id);
                                  setAddressLabel(address.label);
                                  setLocation({
                                    ...emptyLocation,
                                    detail: address.addressDetail,
                                    postalCode: address.postalCode ?? "",
                                    // Prefill teks wilayah di detail/city; user pilih ulang cascade jika perlu
                                    provinceName: address.city,
                                  });
                                  setAddressPrimary(address.isPrimary);
                                  setShowAddressForm(true);
                                }}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-primary"
                                aria-label={`Edit ${address.label}`}
                              >
                                <MaterialSymbol name="edit" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteAddress(address.id)}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-error-container text-error"
                                aria-label={`Delete ${address.label}`}
                              >
                                <MaterialSymbol name="delete" />
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-xl bg-surface-container-low p-6 text-center">
                      <MaterialSymbol name="add_location_alt" className="text-[36px] text-outline" />
                      <p className="mt-2 text-body-sm text-on-surface-variant">
                        Belum ada alamat perusahaan.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              <section className="space-y-4 pb-4">
                <div className="flex items-center gap-2">
                  <MaterialSymbol name="badge" className="text-primary" />
                  <h2 className="font-headline-md text-headline-md text-on-surface">
                    Registered Personnel
                  </h2>
                </div>
                <div className="divide-y divide-border-subtle rounded-xl bg-surface-container-low">
                  {data.business.personnel.map((person) => (
                    <div key={person.id} className="flex items-center gap-4 p-4">
                      <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                        <MaterialSymbol name="person" />
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface-container-low bg-status-ready" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-button-text text-body-md text-on-surface">
                          {person.name}
                        </h4>
                        <p className="truncate font-body-sm text-body-sm text-on-surface-variant">
                          {person.position || person.role}
                        </p>
                      </div>
                      <span className="rounded bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase text-primary">
                        {person.verificationStatus === "REJECTED" ? "Review" : "Active"}
                      </span>
                    </div>
                  ))}
                </div>
                {data.canManage ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setShowInviteForm((open) => !open);
                        setInviteResult("");
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-button-text text-on-primary shadow-md active:scale-[0.98]"
                    >
                      <MaterialSymbol name="person_add" />
                      Invite New Team Member
                    </button>
                    {showInviteForm ? (
                      <form
                        onSubmit={inviteMember}
                        className="space-y-3 rounded-xl bg-surface-container-low p-4"
                        noValidate
                      >
                        <label className="block space-y-1">
                          <span className="font-label-technical text-label-technical uppercase text-outline">
                            Nama
                          </span>
                          <input
                            name="name"
                            className={cn(
                              "h-11 w-full rounded-lg border border-transparent bg-surface-container px-3 outline-none focus:ring-2 focus:ring-primary/20",
                              inputErrorClass(Boolean(fieldErrors.inviteName))
                            )}
                          />
                          <FieldError message={fieldErrors.inviteName} />
                        </label>
                        <label className="block space-y-1">
                          <span className="font-label-technical text-label-technical uppercase text-outline">
                            Email
                          </span>
                          <input
                            name="email"
                            type="email"
                            className={cn(
                              "h-11 w-full rounded-lg border border-transparent bg-surface-container px-3 outline-none focus:ring-2 focus:ring-primary/20",
                              inputErrorClass(Boolean(fieldErrors.inviteEmail))
                            )}
                          />
                          <FieldError message={fieldErrors.inviteEmail} />
                        </label>
                        <label className="block space-y-1">
                          <span className="font-label-technical text-label-technical uppercase text-outline">
                            No. WhatsApp (opsional)
                          </span>
                          <input
                            name="phone"
                            className="h-11 w-full rounded-lg bg-surface-container px-3 outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </label>
                        <label className="block space-y-1">
                          <span className="font-label-technical text-label-technical uppercase text-outline">
                            Jabatan (opsional)
                          </span>
                          <input
                            name="position"
                            placeholder="Purchasing"
                            className="h-11 w-full rounded-lg bg-surface-container px-3 outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </label>
                        <button
                          type="submit"
                          disabled={saving}
                          className="h-11 w-full rounded-xl bg-primary text-on-primary disabled:opacity-60"
                        >
                          {saving ? "Mengirim…" : "Buat Tautan Undangan"}
                        </button>
                      </form>
                    ) : null}
                    {inviteResult ? (
                      <div className="whitespace-pre-wrap rounded-xl border border-primary/20 bg-primary/5 p-3 text-body-sm text-on-surface">
                        {inviteResult}
                      </div>
                    ) : null}
                    <p className="text-center text-xs text-on-surface-variant">
                      Bagikan tautan undangan agar anggota membuat kata sandi dan bergabung ke
                      perusahaan Anda.
                    </p>
                  </>
                ) : null}
              </section>
            </>
          ) : null}

          {error ? <FormAlert message={error} /> : null}
        </div>
      </main>
    </>
  );
}

function VerificationBadge({ verified, complete }: { verified: boolean; complete: boolean }) {
  return (
    <span
      className={
        verified || complete
          ? "flex items-center gap-1 rounded-full bg-secondary-container px-3 py-1 text-xs text-on-secondary-container"
          : "flex items-center gap-1 rounded-full bg-status-indent/10 px-3 py-1 text-xs text-status-indent"
      }
    >
      <MaterialSymbol
        name={verified ? "verified" : complete ? "check_circle" : "error"}
        className="text-[16px]"
      />
      {verified ? "Verified" : complete ? "Data Lengkap" : "Belum Lengkap"}
    </span>
  );
}

function BusinessField({
  name,
  label,
  defaultValue,
  placeholder,
  readOnly,
  required = false,
  error,
}: {
  name: string;
  label: string;
  defaultValue: string;
  placeholder?: string;
  readOnly: boolean;
  required?: boolean;
  error?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="font-label-technical text-label-technical uppercase text-outline">{label}</span>
      <input
        key={defaultValue}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        aria-invalid={Boolean(error)}
        className={cn(
          "h-12 w-full rounded-lg border border-transparent bg-surface-container px-3 font-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary/20 read-only:cursor-not-allowed read-only:opacity-70",
          inputErrorClass(Boolean(error))
        )}
      />
      <FieldError message={error} />
    </label>
  );
}

function AddressInput({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  required = true,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  required?: boolean;
  error?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="font-label-technical text-label-technical uppercase text-outline">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          rows={3}
          aria-invalid={Boolean(error)}
          className={cn(
            "w-full resize-none rounded-lg border border-transparent bg-surface-container px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20",
            inputErrorClass(Boolean(error))
          )}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          aria-invalid={Boolean(error)}
          className={cn(
            "h-11 w-full rounded-lg border border-transparent bg-surface-container px-3 outline-none focus:ring-2 focus:ring-primary/20",
            inputErrorClass(Boolean(error))
          )}
        />
      )}
      <FieldError message={error} />
    </label>
  );
}

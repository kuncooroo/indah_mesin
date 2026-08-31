"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import { ProfileSettingsHeader } from "@/components/storefront/profile/profile-settings-header";
import {
  emptyLocation,
  IndonesiaAddressFields,
  locationToAddressPayload,
  validateLocation,
  type LocationSelection,
} from "@/components/storefront/profile/indonesia-address-fields";
import { useAppPopup } from "@/components/ui/app-popup";
import { FieldError, FieldHint, FormAlert, inputErrorClass } from "@/components/ui/form-feedback";
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

type PendingInvite = {
  id: string;
  name: string;
  email: string;
  position: string | null;
  expiresAt: string;
  acceptedAt: string | null;
};

type BusinessResponse = {
  canManage: boolean;
  businessComplete: boolean;
  business: Business;
};

export default function BusinessIdentityClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const needPo = searchParams.get("need") === "po";
  const productId = searchParams.get("product");
  const { showSuccess, showError, showConfirm } = useAppPopup();
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
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const remainingMissing = useMemo(() => {
    if (!data) return [] as string[];
    const fields: string[] = [];
    if (!data.business.companyName.trim()) fields.push("company name");
    if (!data.business.npwpNumber?.trim()) fields.push("NPWP");
    if (!data.business.nibNumber?.trim()) fields.push("NIB");
    if (!data.business.addresses.length) fields.push("company address");
    return fields;
  }, [data]);

  const poAlert =
    needPo && remainingMissing.length > 0
      ? `Complete the following to create a PO: ${remainingMissing.join(", ")}.`
      : "";

  const loadBusiness = useCallback(async () => {
    const response = await fetch("/api/profile/business");
    const result = (await response.json()) as BusinessResponse & { error?: string };
    if (!response.ok) throw new Error(result.error ?? "Failed to load business identity.");
    setData(result);
    setCompanyName(result.business.companyName ?? "");
    setNpwp(formatNpwpDisplay(result.business.npwpNumber ?? ""));
    setNib(normalizeNib(result.business.nibNumber ?? ""));
    return result;
  }, []);

  const loadInvites = useCallback(async () => {
    try {
      const response = await fetch("/api/profile/business/invite");
      if (!response.ok) return;
      const result = (await response.json()) as { invites?: PendingInvite[] };
      setPendingInvites(
        (result.invites ?? []).filter((invite) => !invite.acceptedAt)
      );
    } catch {
      /* ignore */
    }
  }, []);

  function afterSuccessfulSave(result: BusinessResponse) {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
    showSuccess("Business identity saved.");
    if (needPo && productId && result.businessComplete) {
      router.push(`/po-preview?product=${encodeURIComponent(productId)}`);
    }
  }

  useEffect(() => {
    let active = true;
    void Promise.all([loadBusiness(), loadInvites()])
      .catch((reason: unknown) => {
        if (active) {
          showError(reason instanceof Error ? reason.message : "Failed to load business identity.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [loadBusiness, loadInvites, showError]);

  async function saveAll(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!data?.canManage) return;

    const nextErrors: Record<string, string> = {};
    if (companyName.trim().length < 2) {
      nextErrors.companyName = "Company name must be at least 2 characters.";
    }
    const npwpMsg = npwpErrorMessage(npwp);
    const nibMsg = nibErrorMessage(nib);
    if (npwpMsg) nextErrors.npwpNumber = npwpMsg;
    if (nibMsg) nextErrors.nibNumber = nibMsg;

    const addressFormOpen = showAddressForm || data.business.addresses.length === 0;
    const wantsAddress =
      addressFormOpen &&
      (addressLabel.trim().length > 0 ||
        location.detail.trim().length > 0 ||
        data.business.addresses.length === 0);

    if (wantsAddress) {
      Object.assign(nextErrors, validateLocation(location));
      if (addressLabel.trim().length < 2) {
        nextErrors.label = "Location label must be at least 2 characters.";
      }
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      showError("Please fix the highlighted fields before saving.");
      return;
    }

    setSaving(true);
    try {
      const companyResponse = await fetch("/api/profile/business", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "company",
          companyName: companyName.trim(),
          npwpNumber: npwp,
          nibNumber: nib,
        }),
      });
      const companyResult = (await companyResponse.json()) as { error?: string };
      if (!companyResponse.ok) {
        throw new Error(companyResult.error ?? "Failed to save company details.");
      }

      if (wantsAddress) {
        const payload = locationToAddressPayload(location, addressLabel.trim());
        const addressResponse = await fetch("/api/profile/business", {
          method: editingAddressId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...(editingAddressId ? { kind: "address", id: editingAddressId } : {}),
            ...payload,
            isPrimary: addressPrimary,
          }),
        });
        const addressResult = (await addressResponse.json()) as { error?: string };
        if (!addressResponse.ok) {
          throw new Error(addressResult.error ?? "Failed to save address.");
        }
        setLocation(emptyLocation);
        setAddressLabel("");
        setEditingAddressId("");
        setShowAddressForm(false);
      }

      const refreshed = await loadBusiness();
      setFieldErrors({});
      if (refreshed) afterSuccessfulSave(refreshed);
    } catch (reason) {
      showError(reason instanceof Error ? reason.message : "Failed to save business identity.");
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
    if (payload.name.length < 2) nextErrors.inviteName = "Member name must be at least 2 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      nextErrors.inviteEmail = "Enter a valid member email.";
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      showError("Please fix the highlighted invite fields.");
      return;
    }

    setSaving(true);
    setInviteResult("");
    try {
      // Ensure company exists before inviting
      if (!data.business.id) {
        if (companyName.trim().length < 2) {
          throw new Error("Isi dan simpan Business Identity terlebih dahulu sebelum invite.");
        }
        const npwpMsg = npwpErrorMessage(npwp);
        const nibMsg = nibErrorMessage(nib);
        if (npwpMsg || nibMsg) {
          throw new Error("Lengkapi NPWP & NIB, lalu Save sebelum mengundang anggota.");
        }
        const companyResponse = await fetch("/api/profile/business", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: "company",
            companyName: companyName.trim(),
            npwpNumber: npwp,
            nibNumber: nib,
          }),
        });
        const companyResult = (await companyResponse.json()) as { error?: string };
        if (!companyResponse.ok) {
          throw new Error(companyResult.error ?? "Gagal menyimpan perusahaan sebelum invite.");
        }
        await loadBusiness();
      }

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
      if (!response.ok) throw new Error(result.error ?? "Failed to create invitation.");
      setInviteResult(
        result.inviteUrl
          ? `${result.message ?? "Invite ready."}\n${result.inviteUrl}`
          : result.message ?? "Invitation created."
      );
      showSuccess("Team invite created successfully.");
      event.currentTarget.reset();
      await Promise.all([loadBusiness(), loadInvites()]);
    } catch (reason) {
      showError(reason instanceof Error ? reason.message : "Failed to create invitation.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteAddress(id: string) {
    if (!data?.canManage) return;
    const confirmed = await showConfirm({
      title: "Delete address?",
      message: "This company address will be removed permanently.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!confirmed) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/profile/business?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Failed to delete address.");
      showSuccess("Address deleted.");
      await loadBusiness();
    } catch (reason) {
      showError(reason instanceof Error ? reason.message : "Failed to delete address.");
    } finally {
      setSaving(false);
    }
  }

  const mapQuery = (address: Address) =>
    [address.addressDetail, address.city, address.postalCode].filter(Boolean).join(", ");

  return (
    <>
      <ProfileSettingsHeader backHref="/profile" title="Business Identity" />
      <main className="min-h-screen bg-background pb-28 pt-16">
        <div className="space-y-section-gap px-4 py-8">
          {loading ? (
            <div className="space-y-4">
              <div className="h-48 animate-pulse rounded-xl bg-surface-container" />
              <div className="h-64 animate-pulse rounded-xl bg-surface-container" />
            </div>
          ) : data ? (
            <>
              {poAlert ? (
                <FormAlert message={poAlert} tone="warning" />
              ) : !data.businessComplete ? (
                <FormAlert
                  tone="warning"
                  message="Complete legal identity and company address to speed up PO verification."
                />
              ) : null}

              {needPo && productId && data.businessComplete ? (
                <Link
                  href={`/po-preview?product=${encodeURIComponent(productId)}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-button-text text-on-primary"
                >
                  Continue to PO Preview
                  <MaterialSymbol name="arrow_forward" className="text-[18px]" />
                </Link>
              ) : null}

              <form onSubmit={saveAll} className="space-y-8" noValidate>
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
                  <div className="space-y-4 rounded-xl bg-surface-container-low p-4">
                    <label className="block space-y-1">
                      <span className="font-label-technical text-label-technical uppercase text-outline">
                        Company Name
                      </span>
                      <input
                        value={companyName}
                        onChange={(event) => setCompanyName(event.target.value)}
                        readOnly={!data.canManage}
                        required
                        className={cn(
                          "h-12 w-full rounded-lg border border-transparent bg-surface-container px-3 font-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary/20 read-only:opacity-70",
                          inputErrorClass(Boolean(fieldErrors.companyName))
                        )}
                      />
                      <FieldError message={fieldErrors.companyName} />
                    </label>
                    <label className="block space-y-1">
                      <span className="font-label-technical text-label-technical uppercase text-outline">
                        NPWP (15 or 16 digits)
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
                      <FieldHint message="Enter 15 digits (legacy) or 16 digits (new NPWP / NIK)." />
                      <FieldError message={fieldErrors.npwpNumber} />
                    </label>
                    <label className="block space-y-1">
                      <span className="font-label-technical text-label-technical uppercase text-outline">
                        NIB (13 digits)
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
                      <FieldHint message="Business Identification Number (NIB) must be exactly 13 digits." />
                      <FieldError message={fieldErrors.nibNumber} />
                    </label>
                  </div>
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

                  {showAddressForm || data.business.addresses.length === 0 ? (
                    <div className="space-y-3 rounded-xl bg-surface-container-low p-4">
                      <label className="block space-y-1">
                        <span className="font-label-technical text-label-technical uppercase text-outline">
                          Location Label
                        </span>
                        <input
                          value={addressLabel}
                          onChange={(event) => setAddressLabel(event.target.value)}
                          placeholder="Cikarang Warehouse"
                          readOnly={!data.canManage}
                          className={cn(
                            "h-11 w-full rounded-lg border border-transparent bg-surface-container px-3 outline-none focus:ring-2 focus:ring-primary/20",
                            inputErrorClass(Boolean(fieldErrors.label))
                          )}
                        />
                        <FieldHint message="Short label for this facility or office." />
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
                          disabled={!data.canManage}
                        />
                        Set as primary address
                      </label>
                      {showAddressForm && data.business.addresses.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddressForm(false);
                            setEditingAddressId("");
                            setLocation(emptyLocation);
                            setAddressLabel("");
                          }}
                          className="h-11 w-full rounded-xl bg-surface-container-high text-on-surface"
                        >
                          Cancel address edit
                        </button>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="space-y-3">
                    {data.business.addresses.length ? (
                      data.business.addresses.map((address) => {
                        const query = mapQuery(address);
                        return (
                          <article
                            key={address.id}
                            className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm"
                          >
                            <div className="relative aspect-[16/9] bg-surface-container">
                              <iframe
                                title={`Map ${address.label}`}
                                src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
                                className="h-full w-full border-0"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                              />
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute left-3 top-3 flex items-center gap-1 rounded-md border border-border-subtle bg-white/95 px-2 py-1 text-xs font-semibold text-primary shadow-sm"
                              >
                                <MaterialSymbol name="near_me" className="text-[16px]" />
                                Open Maps
                              </a>
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
                        );
                      })
                    ) : (
                      <div className="rounded-xl bg-surface-container-low p-6 text-center">
                        <MaterialSymbol name="add_location_alt" className="text-[36px] text-outline" />
                        <p className="mt-2 text-body-sm text-on-surface-variant">
                          Add a facility address above, then tap Save.
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                {data.canManage ? (
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-button-text text-on-primary disabled:opacity-60"
                  >
                    <MaterialSymbol name={saved ? "check_circle" : "save"} />
                    {saved ? "Saved" : saving ? "Saving…" : "Save"}
                  </button>
                ) : (
                  <p className="text-body-sm text-on-surface-variant">
                    Company data is managed by the primary buyer or an administrator.
                  </p>
                )}
              </form>

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

                {pendingInvites.length > 0 ? (
                  <div className="space-y-2 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4">
                    <p className="font-button-text text-sm text-primary">Pending invites</p>
                    {pendingInvites.map((invite) => (
                      <div key={invite.id} className="text-body-sm text-on-surface-variant">
                        <span className="font-medium text-on-surface">{invite.name}</span>
                        {" · "}
                        {invite.email}
                        {invite.position ? ` · ${invite.position}` : ""}
                      </div>
                    ))}
                  </div>
                ) : null}

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
                            Name
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
                            WhatsApp (optional)
                          </span>
                          <input
                            name="phone"
                            className="h-11 w-full rounded-lg bg-surface-container px-3 outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </label>
                        <label className="block space-y-1">
                          <span className="font-label-technical text-label-technical uppercase text-outline">
                            Position (optional)
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
                          {saving ? "Sending…" : "Create Invite Link"}
                        </button>
                      </form>
                    ) : null}
                    {inviteResult ? (
                      <div className="space-y-2 whitespace-pre-wrap rounded-xl border border-primary/20 bg-primary/5 p-3 text-body-sm text-on-surface">
                        {inviteResult}
                        {inviteResult.includes("http") ? (
                          <button
                            type="button"
                            className="mt-2 text-sm font-semibold text-primary underline"
                            onClick={() => {
                              const url = inviteResult.split("\n").find((line) => line.startsWith("http"));
                              if (url) void navigator.clipboard.writeText(url);
                              showSuccess("Invite link copied.");
                            }}
                          >
                            Copy invite link
                          </button>
                        ) : null}
                      </div>
                    ) : null}
                    <p className="text-center text-xs text-on-surface-variant">
                      Share the invite link so teammates can set a password and join your company.
                    </p>
                  </>
                ) : null}
              </section>
            </>
          ) : null}
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
      {verified ? "Verified" : complete ? "Complete" : "Incomplete"}
    </span>
  );
}

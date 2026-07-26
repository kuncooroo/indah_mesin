"use client";

import {
  AdminCrudDialog,
  AdminFormField,
  AdminCheckboxField,
  AdminSubmitButton,
  adminFormGridClass,
} from "./admin-crud-ui";

const companyTypeOptions = [
  { value: "BUYER", label: "Buyer (Pembeli)" },
  { value: "VENDOR", label: "Vendor (Penjual)" },
];

export function CompanyCreateDialog({
  createAction,
}: {
  createAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <AdminCrudDialog title="Tambah Perusahaan" triggerLabel="+ Tambah Perusahaan">
      <form action={createAction} className={adminFormGridClass}>
        <AdminFormField label="Nama perusahaan" name="companyName" required />
        <AdminFormField
          label="Tipe"
          name="type"
          as="select"
          defaultValue="BUYER"
          options={companyTypeOptions}
        />
        <AdminFormField label="NPWP" name="npwpNumber" />
        <AdminFormField label="NIB" name="nibNumber" />
        <AdminCheckboxField label="Terverifikasi" name="isVerified" />
        <AdminSubmitButton label="Simpan" />
      </form>
    </AdminCrudDialog>
  );
}

export function CompanyEditDialog({
  row,
  updateAction,
}: {
  row: {
    id: string;
    companyName: string;
    type: string;
    npwpNumber: string | null;
    nibNumber: string | null;
    isVerified: boolean;
  };
  updateAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <AdminCrudDialog title="Edit Perusahaan" triggerLabel="Edit" variant="ghost" triggerMode="icon-edit">
      <form action={updateAction} className={adminFormGridClass}>
        <input type="hidden" name="id" value={row.id} />
        <AdminFormField label="Nama perusahaan" name="companyName" defaultValue={row.companyName} required />
        <AdminFormField
          label="Tipe"
          name="type"
          as="select"
          defaultValue={row.type}
          options={companyTypeOptions}
        />
        <AdminFormField label="NPWP" name="npwpNumber" defaultValue={row.npwpNumber ?? ""} />
        <AdminFormField label="NIB" name="nibNumber" defaultValue={row.nibNumber ?? ""} />
        <AdminCheckboxField label="Terverifikasi" name="isVerified" defaultChecked={row.isVerified} />
        <AdminSubmitButton label="Update" />
      </form>
    </AdminCrudDialog>
  );
}

export function CompanyAddressCreateDialog({
  createAction,
  companies,
  fixedCompanyId,
}: {
  createAction: (formData: FormData) => Promise<void>;
  companies?: { id: string; label: string }[];
  fixedCompanyId?: string;
}) {
  return (
    <AdminCrudDialog title="Tambah Alamat" triggerLabel="+ Tambah Alamat">
      <form action={createAction} className={adminFormGridClass}>
        {fixedCompanyId ? (
          <input type="hidden" name="companyId" value={fixedCompanyId} />
        ) : (
          <AdminFormField
            label="Perusahaan"
            name="companyId"
            as="select"
            required
            options={(companies ?? []).map((c) => ({ value: c.id, label: c.label }))}
          />
        )}
        <AdminFormField label="Label" name="label" defaultValue="Gudang Cikarang" required />
        <AdminFormField label="Alamat lengkap" name="addressDetail" as="textarea" required />
        <AdminFormField label="Kota" name="city" required />
        <AdminFormField label="Kode pos" name="postalCode" />
        <AdminCheckboxField label="Alamat utama" name="isPrimary" />
        <AdminSubmitButton label="Simpan" />
      </form>
    </AdminCrudDialog>
  );
}

export function CompanyAddressEditDialog({
  row,
  updateAction,
}: {
  row: {
    id: string;
    label: string;
    addressDetail: string;
    city: string;
    postalCode: string | null;
    isPrimary: boolean;
  };
  updateAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <AdminCrudDialog title="Edit Alamat" triggerLabel="Edit" variant="ghost" triggerMode="icon-edit">
      <form action={updateAction} className={adminFormGridClass}>
        <input type="hidden" name="id" value={row.id} />
        <AdminFormField label="Label" name="label" defaultValue={row.label} required />
        <AdminFormField label="Alamat lengkap" name="addressDetail" as="textarea" defaultValue={row.addressDetail} />
        <AdminFormField label="Kota" name="city" defaultValue={row.city} />
        <AdminFormField label="Kode pos" name="postalCode" defaultValue={row.postalCode ?? ""} />
        <AdminCheckboxField label="Alamat utama" name="isPrimary" defaultChecked={row.isPrimary} />
        <AdminSubmitButton label="Update" />
      </form>
    </AdminCrudDialog>
  );
}

const orderStatusOptions = [
  { value: "DRAFT", label: "Draft" },
  { value: "SUBMITTED_VIA_WA", label: "Submitted via WA" },
  { value: "NEGOTIATING", label: "Negotiating" },
  { value: "APPROVED", label: "Approved" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function OrderEditDialog({
  row,
  updateAction,
}: {
  row: { id: string; status: string; notes: string | null };
  updateAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <AdminCrudDialog title="Edit Order / PO" triggerLabel="Edit" variant="ghost" triggerMode="icon-edit">
      <form action={updateAction} className={adminFormGridClass}>
        <input type="hidden" name="id" value={row.id} />
        <AdminFormField
          label="Status"
          name="status"
          as="select"
          defaultValue={row.status}
          options={orderStatusOptions}
        />
        <AdminFormField label="Catatan" name="notes" as="textarea" defaultValue={row.notes ?? ""} />
        <AdminSubmitButton label="Update" />
      </form>
    </AdminCrudDialog>
  );
}

const documentTypeOptions = [
  { value: "PO_DRAFT", label: "Draf PO" },
  { value: "OFFICIAL_QUOTATION", label: "Quotation resmi" },
  { value: "INVOICE", label: "Invoice" },
  { value: "BROCHURE", label: "Brosur" },
];

export function ArchiveDocumentCreateDialog({
  createAction,
}: {
  createAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <AdminCrudDialog title="Tambah Dokumen" triggerLabel="+ Tambah Dokumen">
      <form action={createAction} className={adminFormGridClass}>
        <AdminFormField label="Nama file" name="documentName" required />
        <AdminFormField
          label="Tipe"
          name="documentType"
          as="select"
          defaultValue="PO_DRAFT"
          options={documentTypeOptions}
        />
        <AdminFormField label="URL file (PDF)" name="fileUrl" required />
        <AdminFormField label="User ID (opsional)" name="userId" />
        <AdminFormField label="Order ID (opsional)" name="orderId" />
        <AdminSubmitButton label="Simpan" />
      </form>
    </AdminCrudDialog>
  );
}

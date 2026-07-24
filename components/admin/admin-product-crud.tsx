"use client";

import {
  AdminCrudDialog,
  AdminFormField,
  AdminCheckboxField,
  AdminSubmitButton,
  AdminFileField,
  adminFormGridClass,
} from "./admin-crud-ui";

export function ProductCreateDialog({
  createAction,
  categories,
}: {
  createAction: (formData: FormData) => Promise<void>;
  categories: { id: string; label: string }[];
}) {
  return (
    <AdminCrudDialog title="Tambah Produk" triggerLabel="+ Tambah Produk">
      <form action={createAction} className={adminFormGridClass}>
        <AdminFormField label="SKU" name="sku" required />
        <AdminFormField label="Nama" name="name" required />
        <AdminFormField label="Slug (opsional)" name="slug" />
        <AdminFormField
          label="Kategori"
          name="categoryId"
          as="select"
          required
          options={categories.map((c) => ({ value: c.id, label: c.label }))}
        />
        <AdminFileField label="Gambar utama" name="image" />
        <AdminFormField label="Mata uang" name="currency" defaultValue="IDR" />
        <AdminFormField label="Harga (angka)" name="price" type="number" defaultValue={0} required />
        <AdminFormField label="Catatan harga" name="priceNote" />
        <AdminFormField
          label="Status stok"
          name="stockStatus"
          as="select"
          defaultValue="READY_STOCK"
          options={[
            { value: "READY_STOCK", label: "Ready Stock" },
            { value: "INDENT", label: "Indent" },
            { value: "OUT_OF_STOCK", label: "Out of Stock" },
          ]}
        />
        <AdminCheckboxField label="Published" name="isPublished" defaultChecked />
        <AdminSubmitButton label="Simpan" />
      </form>
    </AdminCrudDialog>
  );
}

export function ProductEditDialog({
  product,
  updateAction,
  categories,
  primaryImageUrl,
}: {
  product: {
    id: string;
    name: string;
    categoryId: string;
    currency: string;
    price: string | number;
    priceNote: string | null;
    stockStatus: string;
    isPublished: boolean;
  };
  updateAction: (formData: FormData) => Promise<void>;
  categories: { id: string; label: string }[];
  primaryImageUrl?: string;
}) {
  return (
    <AdminCrudDialog title="Edit Produk" triggerLabel="Edit" variant="ghost" triggerMode="icon-edit">
      <form action={updateAction} className={adminFormGridClass}>
        <input type="hidden" name="id" value={product.id} />
        <AdminFormField label="Nama" name="name" defaultValue={product.name} required />
        <AdminFormField
          label="Kategori"
          name="categoryId"
          as="select"
          defaultValue={product.categoryId}
          options={categories.map((c) => ({ value: c.id, label: c.label }))}
        />
        <AdminFileField label="Gambar utama" name="image" defaultUrl={primaryImageUrl} />
        <AdminFormField label="Harga (angka)" name="price" type="number" defaultValue={product.price} />
        <AdminFormField label="Catatan harga" name="priceNote" defaultValue={product.priceNote ?? ""} />
        <AdminFormField
          label="Status stok"
          name="stockStatus"
          as="select"
          defaultValue={product.stockStatus}
          options={[
            { value: "READY_STOCK", label: "Ready Stock" },
            { value: "INDENT", label: "Indent" },
            { value: "OUT_OF_STOCK", label: "Out of Stock" },
          ]}
        />
        <AdminCheckboxField label="Published" name="isPublished" defaultChecked={product.isPublished} />
        <AdminSubmitButton label="Update" />
      </form>
    </AdminCrudDialog>
  );
}

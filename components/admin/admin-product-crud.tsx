"use client";

import {
  AdminCrudDialog,
  AdminFormField,
  AdminCheckboxField,
  AdminSubmitButton,
  AdminFileField,
  AdminActionForm,
  adminFormGridClass,
} from "./admin-crud-ui";
import { AdminProductGallery, type ProductMediaItem } from "./admin-product-gallery";
import type { ActionResult } from "@/lib/action-result";

export function ProductCreateDialog({
  createAction,
  categories,
}: {
  createAction: (formData: FormData) => Promise<ActionResult | void>;
  categories: { id: string; label: string }[];
}) {
  return (
    <AdminCrudDialog title="Tambah Produk" triggerLabel="+ Tambah Produk">
      <AdminActionForm action={createAction} className={adminFormGridClass}>
        <AdminFormField label="SKU" name="sku" required minLength={3} maxLength={50} />
        <AdminFormField label="Nama" name="name" required minLength={3} maxLength={150} />
        <AdminFormField label="Slug (opsional)" name="slug" maxLength={80} />
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
        <AdminFormField label="Indent (hari)" name="indentDays" type="number" />
        <AdminFileField label="URL Brosur PDF" name="brochureUrl" />
        <AdminFileField label="URL SOP PDF" name="sopUrl" />
        <AdminCheckboxField label="Published" name="isPublished" defaultChecked />
        <AdminSubmitButton label="Simpan" />
      </AdminActionForm>
    </AdminCrudDialog>
  );
}

export function ProductEditDialog({
  product,
  updateAction,
  categories,
  primaryImageUrl,
  media,
}: {
  product: {
    id: string;
    name: string;
    categoryId: string;
    currency: string;
    price: string | number;
    priceNote: string | null;
    stockStatus: string;
    indentDays: number | null;
    brochureUrl: string | null;
    sopUrl: string | null;
    isPublished: boolean;
  };
  updateAction: (formData: FormData) => Promise<ActionResult | void>;
  categories: { id: string; label: string }[];
  primaryImageUrl?: string;
  media?: ProductMediaItem[];
}) {
  return (
    <AdminCrudDialog title="Edit Produk" triggerLabel="Edit" variant="ghost" triggerMode="icon-edit">
      <AdminActionForm action={updateAction} className={adminFormGridClass} resetOnSuccess={false}>
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
        <AdminProductGallery productId={product.id} initialMedia={media ?? []} />
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
        <AdminFormField
          label="Indent (hari)"
          name="indentDays"
          type="number"
          defaultValue={product.indentDays ?? ""}
        />
        <AdminFileField label="URL Brosur PDF" name="brochureUrl" defaultUrl={product.brochureUrl ?? undefined} />
        <AdminFileField label="URL SOP PDF" name="sopUrl" defaultUrl={product.sopUrl ?? undefined} />
        <AdminCheckboxField label="Published" name="isPublished" defaultChecked={product.isPublished} />
        <AdminSubmitButton label="Update" />
      </AdminActionForm>
    </AdminCrudDialog>
  );
}

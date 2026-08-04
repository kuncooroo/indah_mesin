"use client";

import {
  AdminCrudDialog,
  AdminFormField,
  AdminCheckboxField,
  AdminSubmitButton,
  AdminFileField,
  adminFormGridClass,
} from "./admin-crud-ui";

export function CategoryCreateDialog({
  createAction,
  parentOptions,
}: {
  createAction: (formData: FormData) => Promise<void>;
  parentOptions?: { value: string; label: string }[];
}) {
  return (
    <AdminCrudDialog title="Tambah Kategori" triggerLabel="+ Tambah Kategori">
      <form action={createAction} className={adminFormGridClass}>
        <AdminFormField label="Slug" name="slug" required />
        <AdminFormField label="Nama" name="name" required />
        <AdminFormField label="Ikon (Material)" name="icon" defaultValue="category" />
        {parentOptions && parentOptions.length > 0 ? (
          <AdminFormField
            label="Induk (opsional)"
            name="parentId"
            as="select"
            defaultValue=""
            options={[{ value: "", label: "— Tidak ada —" }, ...parentOptions]}
          />
        ) : (
          <input type="hidden" name="parentId" value="" />
        )}
        <AdminSubmitButton label="Simpan" />
      </form>
    </AdminCrudDialog>
  );
}

export function CategoryEditDialog({
  row,
  updateAction,
  parentOptions,
}: {
  row: {
    id: string;
    slug: string;
    name: string;
    icon: string | null;
    parentId: string | null;
  };
  updateAction: (formData: FormData) => Promise<void>;
  parentOptions?: { value: string; label: string }[];
}) {
  return (
    <AdminCrudDialog title="Edit Kategori" triggerLabel="Edit" variant="ghost" triggerMode="icon-edit">
      <form action={updateAction} className={adminFormGridClass}>
        <input type="hidden" name="id" value={row.id} />
        <AdminFormField label="Slug" name="slug" defaultValue={row.slug} required />
        <AdminFormField label="Nama" name="name" defaultValue={row.name} required />
        <AdminFormField label="Ikon" name="icon" defaultValue={row.icon ?? "category"} />
        {parentOptions && parentOptions.length > 0 ? (
          <AdminFormField
            label="Induk"
            name="parentId"
            as="select"
            defaultValue={row.parentId ?? ""}
            options={[
              { value: "", label: "— Tidak ada —" },
              ...parentOptions.filter((p) => p.value !== row.id),
            ]}
          />
        ) : null}
        <AdminSubmitButton label="Update" />
      </form>
    </AdminCrudDialog>
  );
}

export function ArticleCreateDialog({
  createAction,
}: {
  createAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <AdminCrudDialog title="Tambah Artikel" triggerLabel="+ Tambah Artikel">
      <form action={createAction} className={adminFormGridClass}>
        <AdminFormField label="Judul" name="title" required />
        <AdminFormField label="Slug" name="slug" />
        <AdminFormField label="Kategori" name="category" defaultValue="Teknologi" />
        <AdminFileField label="Gambar" name="imageUrl" />
        <AdminFormField label="Menit baca" name="readMinutes" type="number" defaultValue={5} />
        <AdminCheckboxField label="Published" name="published" defaultChecked />
        <AdminSubmitButton label="Simpan" />
      </form>
    </AdminCrudDialog>
  );
}

export function ArticleEditDialog({
  row,
  updateAction,
  imageUrl,
}: {
  row: { id: string; title: string; category: string; readMinutes: number; published: boolean };
  updateAction: (formData: FormData) => Promise<void>;
  imageUrl?: string;
}) {
  return (
    <AdminCrudDialog title="Edit Artikel" triggerLabel="Edit" variant="ghost" triggerMode="icon-edit">
      <form action={updateAction} className={adminFormGridClass}>
        <input type="hidden" name="id" value={row.id} />
        <AdminFormField label="Judul" name="title" defaultValue={row.title} required />
        <AdminFormField label="Kategori" name="category" defaultValue={row.category} />
        <AdminFileField label="Gambar" name="imageUrl" defaultUrl={imageUrl} />
        <AdminFormField label="Menit baca" name="readMinutes" type="number" defaultValue={row.readMinutes} />
        <AdminCheckboxField label="Published" name="published" defaultChecked={row.published} />
        <AdminSubmitButton label="Update" />
      </form>
    </AdminCrudDialog>
  );
}

export function FaqCreateDialog({
  createAction,
}: {
  createAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <AdminCrudDialog title="Tambah FAQ" triggerLabel="+ Tambah FAQ">
      <form action={createAction} className={adminFormGridClass}>
        <AdminFormField label="Pertanyaan" name="question" required className="md:col-span-2" />
        <AdminFormField label="Jawaban" name="answer" as="textarea" required className="md:col-span-2" />
        <AdminFormField label="Urutan" name="sortOrder" type="number" defaultValue={0} />
        <AdminCheckboxField label="Published" name="published" defaultChecked />
        <AdminSubmitButton label="Simpan" />
      </form>
    </AdminCrudDialog>
  );
}

export function FaqEditDialog({
  row,
  updateAction,
}: {
  row: { id: string; question: string; answer: string; sortOrder: number; published: boolean };
  updateAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <AdminCrudDialog title="Edit FAQ" triggerLabel="Edit" variant="ghost" triggerMode="icon-edit">
      <form action={updateAction} className={adminFormGridClass}>
        <input type="hidden" name="id" value={row.id} />
        <AdminFormField label="Pertanyaan" name="question" defaultValue={row.question} required className="md:col-span-2" />
        <AdminFormField label="Jawaban" name="answer" as="textarea" defaultValue={row.answer} required className="md:col-span-2" />
        <AdminFormField label="Urutan" name="sortOrder" type="number" defaultValue={row.sortOrder} />
        <AdminCheckboxField label="Published" name="published" defaultChecked={row.published} />
        <AdminSubmitButton label="Update" />
      </form>
    </AdminCrudDialog>
  );
}

export function ReviewCreateDialog({
  createAction,
  products,
}: {
  createAction: (formData: FormData) => Promise<void>;
  products: { id: string; name: string }[];
}) {
  return (
    <AdminCrudDialog title="Tambah Ulasan" triggerLabel="+ Tambah Ulasan">
      <form action={createAction} className={adminFormGridClass}>
        <AdminFormField label="Nama penulis" name="authorName" required />
        <AdminFormField
          label="Produk"
          name="productId"
          as="select"
          defaultValue=""
          options={[{ value: "", label: "— Tanpa produk —" }, ...products.map((p) => ({ value: p.id, label: p.name }))]}
        />
        <AdminFormField label="Rating (1–5)" name="rating" type="number" defaultValue={5} />
        <AdminFormField label="Ulasan" name="content" as="textarea" required className="md:col-span-2" />
        <AdminCheckboxField label="Published" name="published" defaultChecked />
        <AdminSubmitButton label="Simpan" />
      </form>
    </AdminCrudDialog>
  );
}

export function ReviewEditDialog({
  row,
  updateAction,
  products,
}: {
  row: {
    id: string;
    authorName: string;
    content: string;
    rating: number;
    published: boolean;
    productId: string | null;
  };
  updateAction: (formData: FormData) => Promise<void>;
  products: { id: string; name: string }[];
}) {
  return (
    <AdminCrudDialog title="Edit Ulasan" triggerLabel="Edit" variant="ghost" triggerMode="icon-edit">
      <form action={updateAction} className={adminFormGridClass}>
        <input type="hidden" name="id" value={row.id} />
        <AdminFormField label="Nama penulis" name="authorName" defaultValue={row.authorName} required />
        <AdminFormField
          label="Produk"
          name="productId"
          as="select"
          defaultValue={row.productId ?? ""}
          options={[{ value: "", label: "— Tanpa produk —" }, ...products.map((p) => ({ value: p.id, label: p.name }))]}
        />
        <AdminFormField label="Rating" name="rating" type="number" defaultValue={row.rating} />
        <AdminFormField label="Ulasan" name="content" as="textarea" defaultValue={row.content} required className="md:col-span-2" />
        <AdminCheckboxField label="Published" name="published" defaultChecked={row.published} />
        <AdminSubmitButton label="Update" />
      </form>
    </AdminCrudDialog>
  );
}

export function UserCreateDialog({
  createAction,
}: {
  createAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <AdminCrudDialog title="Tambah Admin" triggerLabel="+ Tambah User">
      <form action={createAction} className={adminFormGridClass}>
        <AdminFormField label="Username" name="username" required />
        <AdminFormField label="Password" name="password" type="password" required />
        <AdminFormField label="Nama" name="name" />
        <AdminFormField label="Email" name="email" type="email" />
        <AdminFormField
          label="Role Admin"
          name="role"
          as="select"
          defaultValue="ADMIN"
          options={[
            { value: "ADMIN", label: "ADMIN" },
            { value: "SUPERADMIN", label: "SUPERADMIN" },
          ]}
        />
        <AdminSubmitButton label="Simpan" />
      </form>
    </AdminCrudDialog>
  );
}

export function CustomerEditDialog({
  row,
  companies,
  updateAction,
}: {
  row: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    role?: string;
    companyId: string | null;
    companyName: string | null;
    customBuyerId: string | null;
    verificationStatus: string;
  };
  companies: { id: string; label: string }[];
  updateAction: (formData: FormData) => Promise<void>;
}) {
  const verified = row.verificationStatus === "VERIFIED";
  return (
    <AdminCrudDialog title="Edit PIC" triggerLabel="Edit" variant="ghost" triggerMode="icon-edit">
      <form action={updateAction} className={adminFormGridClass}>
        <input type="hidden" name="id" value={row.id} />
        <AdminFormField label="Nama PIC" name="name" defaultValue={row.name ?? ""} />
        <AdminFormField label="Email" name="email" defaultValue={row.email ?? ""} />
        <AdminFormField label="No. WhatsApp" name="phone" defaultValue={row.phone ?? ""} />
        <AdminFormField
          label="Perusahaan (FK)"
          name="companyId"
          as="select"
          defaultValue={row.companyId ?? ""}
          options={[{ value: "", label: "— Pilih —" }, ...companies.map((c) => ({ value: c.id, label: c.label }))]}
        />
        <AdminFormField label="Perusahaan (legacy teks)" name="companyName" defaultValue={row.companyName ?? ""} />
        <AdminFormField label="Buyer ID" name="customBuyerId" defaultValue={row.customBuyerId ?? ""} />
        <AdminCheckboxField label="Verified Buyer" name="verifiedBuyer" defaultChecked={verified} />
        <AdminSubmitButton label="Update" />
      </form>
    </AdminCrudDialog>
  );
}

export function FavoriteCreateDialog({
  createAction,
  users,
  products,
}: {
  createAction: (formData: FormData) => Promise<void>;
  users: { id: string; label: string }[];
  products: { id: string; label: string }[];
}) {
  return (
    <AdminCrudDialog title="Tambah Favorit" triggerLabel="+ Tambah Favorit">
      <form action={createAction} className={adminFormGridClass}>
        <AdminFormField
          label="Pengguna"
          name="userId"
          as="select"
          required
          options={users.map((u) => ({ value: u.id, label: u.label }))}
        />
        <AdminFormField
          label="Produk"
          name="productId"
          as="select"
          required
          options={products.map((p) => ({ value: p.id, label: p.label }))}
        />
        <AdminSubmitButton label="Simpan" />
      </form>
    </AdminCrudDialog>
  );
}

export function RfqEditDialog({
  row,
  updateAction,
}: {
  row: {
    id: string;
    status: string;
    picName: string;
    companyName: string;
  };
  updateAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <AdminCrudDialog title="Edit RFQ" triggerLabel="Edit" variant="ghost" triggerMode="icon-edit">
      <form action={updateAction} className={adminFormGridClass}>
        <input type="hidden" name="id" value={row.id} />
        <AdminFormField
          label="Status"
          name="status"
          as="select"
          defaultValue={row.status}
          options={[
            { value: "PENDING", label: "PENDING" },
            { value: "PROCESSED", label: "PROCESSED" },
            { value: "QUOTATION_SENT", label: "QUOTATION_SENT" },
            { value: "CANCELLED", label: "CANCELLED" },
          ]}
        />
        <AdminFormField label="PIC" name="picName" defaultValue={row.picName} />
        <AdminFormField label="Perusahaan" name="companyName" defaultValue={row.companyName} />
        <AdminSubmitButton label="Update" />
      </form>
    </AdminCrudDialog>
  );
}

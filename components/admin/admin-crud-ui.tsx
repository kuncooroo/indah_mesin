"use client";

import { useState } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AdminCrudDialog({
  title,
  triggerLabel,
  children,
  variant = "primary",
  triggerMode = "text",
}: {
  title: string;
  triggerLabel: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  triggerMode?: "text" | "icon-edit";
}) {
  const [open, setOpen] = useState(false);

  const triggerClass =
    variant === "primary"
      ? "rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
      : triggerMode === "icon-edit"
        ? "inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
        : "rounded-md border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50";

  return (
    <>
      <button
        type="button"
        className={triggerClass}
        title={triggerMode === "icon-edit" ? triggerLabel : undefined}
        onClick={() => setOpen(true)}
      >
        {triggerMode === "icon-edit" ? (
          <Pencil className="h-4 w-4" strokeWidth={1.75} />
        ) : (
          triggerLabel
        )}
      </button>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Tutup"
            onClick={() => setOpen(false)}
          />
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-neutral-200 bg-white p-6 shadow-xl sm:p-8">
            <h2 className="mb-5 text-lg font-semibold text-neutral-900">{title}</h2>
            {children}
            <button
              type="button"
              className="mt-5 text-sm text-neutral-500 hover:text-neutral-800"
              onClick={() => setOpen(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

export const adminFormGridClass =
  "grid grid-cols-1 gap-x-4 gap-y-0 md:grid-cols-2 [&>*:last-child:nth-child(odd)]:md:col-span-2";

export function AdminFormField({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  as = "input",
  options,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
  as?: "input" | "textarea" | "select";
  options?: { value: string; label: string }[];
  className?: string;
}) {
  const inputClass =
    "mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400";

  return (
    <label className={`mb-3 block text-sm ${className ?? ""}`}>
      <span className="font-medium text-neutral-700">{label}</span>
      {as === "textarea" ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          required={required}
          rows={3}
          className={inputClass}
        />
      ) : as === "select" ? (
        <select name={name} defaultValue={defaultValue} required={required} className={inputClass}>
          {options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          required={required}
          className={inputClass}
        />
      )}
    </label>
  );
}

export function AdminFileField({
  label,
  name,
  defaultUrl,
  accept = "image/jpeg,image/png,image/webp,image/gif",
}: {
  label: string;
  name: string;
  defaultUrl?: string;
  accept?: string;
}) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [uploading, setUploading] = useState(false);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        toast.error(data.error ?? "Upload gagal");
        return;
      }
      setUrl(data.url);
      toast.success("Gambar terunggah");
    } catch {
      toast.error("Upload gagal");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="mb-3 block text-sm md:col-span-2">
      <span className="font-medium text-neutral-700">{label}</span>
      <input type="hidden" name={name} value={url} />
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span>Pilih file…</span>
          )}
          <input type="file" accept={accept} className="hidden" disabled={uploading} onChange={onFileChange} />
        </label>
        {url ? (
          <span className="max-w-md truncate text-xs text-neutral-500" title={url}>
            {url}
          </span>
        ) : (
          <span className="text-xs text-neutral-400">Belum ada gambar</span>
        )}
      </div>
    </div>
  );
}

export function AdminCheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="mb-3 flex items-center gap-2 text-sm md:col-span-2">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="rounded" />
      <span className="text-neutral-700">{label}</span>
    </label>
  );
}

export function AdminSubmitButton({ label }: { label: string }) {
  return (
    <div className="md:col-span-2">
      <button
        type="submit"
        className="w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
      >
        {label}
      </button>
    </div>
  );
}

export function AdminDeleteButton({
  action,
}: {
  action: (formData: FormData) => void | Promise<void>;
  label?: string;
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        title="Hapus"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 text-red-700 transition-colors hover:bg-red-50"
        onClick={(e) => {
          if (!confirm("Yakin hapus data ini?")) e.preventDefault();
        }}
      >
        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
      </button>
    </form>
  );
}

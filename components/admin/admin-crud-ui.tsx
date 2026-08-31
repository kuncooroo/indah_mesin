"use client";

import {
  createContext,
  useContext,
  useState,
  useTransition,
  type FormEvent,
  type ReactNode,
} from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/action-result";

const AdminDialogCloseCtx = createContext<(() => void) | null>(null);
const AdminFormPendingCtx = createContext(false);

export function AdminCrudDialog({
  title,
  triggerLabel,
  children,
  variant = "primary",
  triggerMode = "text",
}: {
  title: string;
  triggerLabel: string;
  children: ReactNode;
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
            <AdminDialogCloseCtx.Provider value={() => setOpen(false)}>
              {children}
            </AdminDialogCloseCtx.Provider>
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

export function AdminActionForm({
  action,
  className,
  children,
  resetOnSuccess = true,
}: {
  action: (formData: FormData) => Promise<ActionResult | void>;
  className?: string;
  children: ReactNode;
  resetOnSuccess?: boolean;
}) {
  const close = useContext(AdminDialogCloseCtx);
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setFieldErrors({});
    startTransition(async () => {
      const result = await action(fd);
      if (!result) {
        toast.success("Berhasil.");
        close?.();
        router.refresh();
        if (resetOnSuccess) form.reset();
        return;
      }
      if (result.success) {
        toast.success(result.message);
        close?.();
        router.refresh();
        if (resetOnSuccess) form.reset();
        return;
      }
      toast.error(result.message);
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
    });
  }

  return (
    <AdminFormPendingCtx.Provider value={pending}>
      <form onSubmit={onSubmit} className={className}>
        <fieldset disabled={pending} className="min-w-0 contents">
          {children}
        </fieldset>
        {Object.keys(fieldErrors).length > 0 ? (
          <ul className="mt-2 space-y-1 text-sm text-red-600 md:col-span-2">
            {Object.entries(fieldErrors).map(([key, msg]) => (
              <li key={key}>{msg}</li>
            ))}
          </ul>
        ) : null}
      </form>
    </AdminFormPendingCtx.Provider>
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
  minLength,
  maxLength,
  min,
  max,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
  as?: "input" | "textarea" | "select";
  options?: { value: string; label: string }[];
  className?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  placeholder?: string;
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
          minLength={minLength}
          maxLength={maxLength}
          placeholder={placeholder}
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
          minLength={minLength}
          maxLength={maxLength}
          min={min}
          max={max}
          placeholder={placeholder}
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
  const pending = useContext(AdminFormPendingCtx);
  return (
    <div className="md:col-span-2">
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {pending ? "Menyimpan…" : label}
      </button>
    </div>
  );
}

export function AdminDeleteButton({
  action,
  label,
}: {
  action: () => Promise<ActionResult | void>;
  label?: string;
}) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function onConfirm() {
    startTransition(async () => {
      const result = await action();
      if (!result || result.success) {
        toast.success(result?.message ?? "Data berhasil dihapus.");
        setConfirmOpen(false);
        router.refresh();
        return;
      }
      toast.error(result.message);
    });
  }

  return (
    <>
      <button
        type="button"
        title={label ?? "Hapus"}
        className={
          label
            ? "rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
            : "inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 text-red-700 transition-colors hover:bg-red-50"
        }
        onClick={() => setConfirmOpen(true)}
      >
        {label ? label : <Trash2 className="h-4 w-4" strokeWidth={1.75} />}
      </button>
      {confirmOpen ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Batal"
            onClick={() => !pending && setConfirmOpen(false)}
          />
          <div className="relative w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-5 shadow-xl">
            <h3 className="text-base font-semibold text-neutral-900">Hapus data?</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Tindakan ini tidak dapat dibatalkan. Pastikan data tidak masih digunakan.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={pending}
                className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
                onClick={() => setConfirmOpen(false)}
              >
                Batal
              </button>
              <button
                type="button"
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                onClick={onConfirm}
              >
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {pending ? "Menghapus…" : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { ChevronDown, ChevronUp, Loader2, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  addProductMediaUrls,
  deleteProductMedia,
  reorderProductMedia,
  setPrimaryProductMedia,
} from "@/lib/admin-product-media";
import { adminToast } from "@/lib/admin/admin-toast";

export type ProductMediaItem = {
  id: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
};

export function AdminProductGallery({
  productId,
  initialMedia,
}: {
  productId: string;
  initialMedia: ProductMediaItem[];
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  const sorted = [...media].sort((a, b) => a.sortOrder - b.sortOrder);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    const urls: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !data.url) {
          adminToast.error(data.error ?? "Upload gagal");
          continue;
        }
        urls.push(data.url);
      }
      if (urls.length === 0) return;

      startTransition(async () => {
        const result = await addProductMediaUrls(productId, urls);
        if (result.success) {
          adminToast.success(result.message);
          router.refresh();
        } else {
          adminToast.error(result.message);
        }
      });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function move(id: string, dir: -1 | 1) {
    const idx = sorted.findIndex((m) => m.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= sorted.length) return;
    const next = [...sorted];
    [next[idx], next[swap]] = [next[swap], next[idx]];
    const ids = next.map((m) => m.id);
    setMedia(next.map((m, i) => ({ ...m, sortOrder: i })));
    startTransition(async () => {
      const result = await reorderProductMedia(productId, ids);
      if (result.success) {
        adminToast.success(result.message);
        router.refresh();
      } else {
        adminToast.error(result.message);
      }
    });
  }

  function onDelete(id: string) {
    startTransition(async () => {
      const result = await deleteProductMedia(id);
      if (result.success) {
        setMedia((prev) => prev.filter((m) => m.id !== id));
        adminToast.success(result.message);
        router.refresh();
      } else {
        adminToast.error(result.message);
      }
    });
  }

  function onSetPrimary(id: string) {
    startTransition(async () => {
      const result = await setPrimaryProductMedia(id);
      if (result.success) {
        setMedia((prev) =>
          prev.map((m) => ({ ...m, isPrimary: m.id === id }))
        );
        adminToast.success(result.message);
        router.refresh();
      } else {
        adminToast.error(result.message);
      }
    });
  }

  return (
    <div className="mb-4 md:col-span-2">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-700">Galeri gambar</span>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50">
          {uploading || pending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : null}
          + Tambah gambar
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            disabled={uploading || pending}
            onChange={(e) => uploadFiles(e.target.files)}
          />
        </label>
      </div>

      {sorted.length === 0 ? (
        <p className="text-xs text-neutral-400">Belum ada gambar galeri.</p>
      ) : (
        <ul className="space-y-2">
          {sorted.map((item, index) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50/50 p-2"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded border border-neutral-200 bg-white">
                <Image src={item.url} alt="" fill className="object-cover" sizes="56px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-neutral-600" title={item.url}>
                  {item.url}
                </p>
                {item.isPrimary ? (
                  <span className="mt-0.5 inline-block text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                    Utama
                  </span>
                ) : null}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  title="Jadikan utama"
                  disabled={pending || item.isPrimary}
                  onClick={() => onSetPrimary(item.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-neutral-600 hover:bg-white disabled:opacity-40"
                >
                  <Star
                    className={`h-4 w-4 ${item.isPrimary ? "fill-amber-500 text-amber-500" : ""}`}
                  />
                </button>
                <button
                  type="button"
                  title="Naik"
                  disabled={pending || index === 0}
                  onClick={() => move(item.id, -1)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-neutral-600 hover:bg-white disabled:opacity-40"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Turun"
                  disabled={pending || index === sorted.length - 1}
                  onClick={() => move(item.id, 1)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-neutral-600 hover:bg-white disabled:opacity-40"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Hapus"
                  disabled={pending}
                  onClick={() => onDelete(item.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { Ms } from "@/components/stitch/ms";

/** Pagination — Stitch 360986f2 (halaman 1 aktif) */
export function CategoryPagination() {
  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-on-surface-variant transition-colors hover:bg-surface-variant"
      >
        <Ms name="chevron_left" />
      </button>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-button-text text-on-primary"
      >
        1
      </button>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle font-button-text text-on-surface-variant transition-colors hover:bg-surface-variant"
      >
        2
      </button>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle font-button-text text-on-surface-variant transition-colors hover:bg-surface-variant"
      >
        3
      </button>
      <span className="px-2">...</span>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle font-button-text text-on-surface-variant transition-colors hover:bg-surface-variant"
      >
        8
      </button>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-on-surface-variant transition-colors hover:bg-surface-variant"
      >
        <Ms name="chevron_right" />
      </button>
    </div>
  );
}

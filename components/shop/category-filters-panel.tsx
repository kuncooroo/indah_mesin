import { Ms } from "@/components/stitch/ms";

/** Sidebar filter — Stitch 360986f2 */
export function CategoryFiltersPanel() {
  return (
    <aside className="px-margin-mobile md:px-0 md:col-span-3">
      <div className="sticky top-20 rounded-xl border border-border-subtle bg-surface-container-low p-gutter">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-headline-md text-headline-md text-primary">Filters</h3>
          <button type="button" className="md:hidden">
            <Ms name="expand_more" />
          </button>
        </div>

        <div className="mb-8">
          <label className="mb-3 block font-button-text text-body-md text-primary">
            Status Stok
          </label>
          <div className="space-y-3">
            <label className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="h-5 w-5 rounded border-outline text-primary focus:ring-primary"
              />
              <span className="text-body-md text-on-surface-variant group-hover:text-primary">
                Ready Stock
              </span>
            </label>
            <label className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-outline text-primary focus:ring-primary"
              />
              <span className="text-body-md text-on-surface-variant group-hover:text-primary">
                Inden
              </span>
            </label>
          </div>
        </div>

        <div className="mb-8">
          <label className="mb-3 block font-button-text text-body-md text-primary">
            Mulai Dari (IDR)
          </label>
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-body-sm text-outline">
                Rp
              </span>
              <input
                type="number"
                placeholder="Harga Minimum"
                className="w-full rounded-lg border border-border-subtle bg-surface py-2 pl-10 pr-4 text-body-md outline-none focus:border-primary focus:ring-2 focus:ring-primary-container"
              />
            </div>
            <input
              type="range"
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-outline-variant accent-primary"
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="mb-3 block font-button-text text-body-md text-primary">
            Manufaktur
          </label>
          <select className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-body-md outline-none focus:border-primary focus:ring-2 focus:ring-primary-container">
            <option>Semua Brand</option>
            <option>Hardinge</option>
            <option>Mazak</option>
            <option>Fanuc</option>
            <option>Haas Automation</option>
          </select>
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-container py-3 font-button-text text-on-primary-container transition-colors hover:bg-primary"
        >
          Terapkan Filter
        </button>
      </div>
    </aside>
  );
}

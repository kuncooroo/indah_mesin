"use client";

import { useEffect, useMemo, useState } from "react";

import { ProfileSettingsHeader } from "@/components/storefront/profile/profile-settings-header";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import {
  type DocCategory,
  type ProfileDocument,
} from "@/lib/storefront/profile-demo-data";
import { cn } from "@/lib/utils";

type Chip = "all" | DocCategory;

const chips: { id: Chip; label: string }[] = [
  { id: "all", label: "All Files" },
  { id: "po", label: "Purchase Orders" },
  { id: "manual", label: "Technical Manuals" },
  { id: "brochure", label: "Brochures" },
];

export default function ProfileDocsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Chip>("all");
  const [documents, setDocuments] = useState<ProfileDocument[]>([]);

  useEffect(() => {
    void fetch("/api/profile/documents")
      .then((response) => (response.ok ? response.json() : { documents: [] }))
      .then((result) => setDocuments(result.documents ?? []));
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return documents.filter((doc) => {
      const matchCat = category === "all" || doc.category === category;
      const matchQuery = !q || doc.name.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [query, category, documents]);

  function resetFilters() {
    setQuery("");
    setCategory("all");
  }

  return (
    <>
      <ProfileSettingsHeader backHref="/profile" />
      <main className="min-h-screen bg-background pt-16">
        <div className="flex w-full flex-col gap-6 p-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-outline">
                <MaterialSymbol name="search" className="text-[20px]" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search POs, manuals, or specs..."
                className="h-12 w-full rounded-xl bg-surface-container-low pl-10 pr-4 font-body-md text-on-surface placeholder:text-outline outline-none transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {chips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setCategory(chip.id)}
                  className={cn(
                    "whitespace-nowrap rounded-full px-4 py-1.5 font-button-text text-button-text transition-colors",
                    category === chip.id
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-high text-on-surface-variant"
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {visible.length > 0 ? (
            <div className="flex flex-col gap-3">
              {visible.map((doc) => (
                <div
                  key={doc.id}
                  className="group flex items-center rounded-xl bg-surface-container-lowest p-3 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                >
                  <div
                    className={cn(
                      "mr-4 flex h-12 w-12 items-center justify-center rounded-lg",
                      doc.iconBg,
                      doc.iconColor
                    )}
                  >
                    <MaterialSymbol name={doc.icon} className="text-[28px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-headline-md text-headline-md text-on-surface">
                      {doc.name}
                    </h3>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="font-label-technical text-label-technical uppercase text-outline">
                        {doc.sizeLabel}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-outline-variant" />
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {doc.dateLabel}
                      </span>
                    </div>
                  </div>
                  <a
                    href={doc.fileUrl}
                    download={doc.category === "po" ? undefined : true}
                    target={doc.category === "po" ? "_blank" : undefined}
                    rel={doc.category === "po" ? "noopener noreferrer" : undefined}
                    className="ml-2 flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary-container/10"
                    aria-label={`Download ${doc.name}`}
                  >
                    <MaterialSymbol name="download" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-10 py-20 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container text-outline">
                <MaterialSymbol name="folder_open" className="text-[40px]" />
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                No documents found
              </h3>
              <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 font-button-text text-button-text text-primary"
              >
                Clear all filters
              </button>
            </div>
          )}

          <div className="mt-auto flex items-start gap-4 rounded-2xl bg-primary-container/10 p-4">
            <MaterialSymbol name="info" className="mt-1 text-primary" />
            <p className="flex-1 font-body-sm text-body-sm text-on-surface">
              Can&apos;t find a specific document? Contact your account manager directly via{" "}
              <span className="font-semibold text-secondary">WhatsApp</span> for priority support.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

import { isFaqTableReady, isProductReviewTableReady } from "@/lib/admin/safe-model-count";

export async function AdminMigrationNotice({
  model,
}: {
  model: "Faq" | "ProductReview";
}) {
  const ready =
    model === "Faq" ? await isFaqTableReady() : await isProductReviewTableReady();

  if (ready) return null;

  return (
    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      Tabel <strong>{model}</strong> belum ada di database. Jalankan di terminal proyek:{" "}
      <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">
        npx prisma migrate deploy
      </code>
    </div>
  );
}

import Link from "next/link";
import { Ms } from "@/components/stitch/ms";

export default function PoPreviewPdfPage() {
  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border-subtle bg-surface px-margin-mobile">
        <Link
          href="/po-preview"
          className="rounded-full p-2 hover:bg-surface-container"
        >
          <Ms name="arrow_back" className="text-primary" />
        </Link>
        <h1 className="font-headline-md text-headline-md font-bold text-primary">
          Pratinjau PDF Purchase Order (A4)
        </h1>
      </header>
      <div className="h-[calc(100dvh-4rem)] w-full overflow-auto bg-metallic-bg p-2 md:p-4">
        <iframe
          title="Pratinjau PDF Purchase Order"
          src="/stitch/po-a4.html"
          className="mx-auto min-h-[1200px] w-full max-w-5xl rounded-lg border border-border-subtle bg-white shadow-sm"
        />
      </div>
    </>
  );
}

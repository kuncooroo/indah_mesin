"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { hasPoDraft, readPoDraft } from "@/lib/storefront/po-draft";

export type PoDocumentData = {
  authenticatedBuyer: boolean;
  productId: string;
  productName: string;
  productSku: string;
  unitPrice: number;
  priceLabel: string;
  buyerName: string;
  buyerCompany: string;
  buyerAddress: string;
  buyerEmail: string;
  buyerPhone: string;
};

function escapePdfText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function createPdfBlob(sourceText: string) {
  const wrapped = sourceText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => line.match(/.{1,88}(?:\s|$)|.{1,88}/g) ?? [line]);
  const pages = Array.from(
    { length: Math.max(1, Math.ceil(wrapped.length / 52)) },
    (_, page) => wrapped.slice(page * 52, (page + 1) * 52)
  );

  const objects: string[] = [];
  const addObject = (body: string) => {
    objects.push(body);
    return objects.length;
  };
  const catalogId = addObject("");
  const pagesId = addObject("");
  const fontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pageIds: number[] = [];

  for (const lines of pages) {
    const stream = [
      "BT",
      "/F1 10 Tf",
      "48 790 Td",
      ...lines.flatMap((line, index) => [
        index === 0 ? "" : "0 -14 Td",
        `(${escapePdfText(line)}) Tj`,
      ]),
      "ET",
    ]
      .filter(Boolean)
      .join("\n");
    const contentId = addObject(
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`
    );
    const pageId = addObject(
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`
    );
    pageIds.push(pageId);
  }

  objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  objects[pagesId - 1] =
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((body, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)
    .join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}

export function PoPdfToolbar({
  backHref,
  iframeSrc,
  documentData,
}: {
  backHref: string;
  iframeSrc: string;
  documentData: PoDocumentData;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [downloading, setDownloading] = useState(false);

  function printDocument() {
    iframeRef.current?.contentWindow?.print();
  }

  function populateDocument() {
    const frameDocument = iframeRef.current?.contentDocument;
    if (!frameDocument) return;
    const draft = readPoDraft(documentData.productId);
    const savedDraftExists =
      hasPoDraft(documentData.productId) && !documentData.authenticatedBuyer;
    const quantity = Math.max(1, draft.quantity || 1);
    const formattedTotal = documentData.unitPrice
      ? new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(documentData.unitPrice * quantity)
      : documentData.priceLabel;
    const values: Record<string, string> = {
      "po-buyer-company": savedDraftExists ? draft.companyName : documentData.buyerCompany,
      "po-buyer-name": `Attn: ${savedDraftExists ? draft.picName : documentData.buyerName}`,
      "po-buyer-address": savedDraftExists ? draft.address : documentData.buyerAddress,
      "po-buyer-email": documentData.buyerEmail,
      "po-buyer-phone": savedDraftExists ? draft.phone : documentData.buyerPhone,
      "po-product-sku": documentData.productSku,
      "po-product-name": documentData.productName,
      "po-product-variant": `Voltage: ${draft.voltage}`,
      "po-product-quantity": `${quantity} Unit${quantity > 1 ? "s" : ""}`,
      "po-product-price": documentData.priceLabel,
      "po-product-total": formattedTotal,
      "po-subtotal": formattedTotal,
      "po-grand-total": formattedTotal,
      "po-signature-name": savedDraftExists ? draft.picName : documentData.buyerName,
      "po-signature-company": savedDraftExists ? draft.companyName : documentData.buyerCompany,
    };
    Object.entries(values).forEach(([id, value]) => {
      const element = frameDocument.getElementById(id);
      if (element) element.textContent = value;
    });
  }

  function downloadDocument() {
    const documentText = iframeRef.current?.contentDocument?.body.innerText;
    if (!documentText) return;
    setDownloading(true);
    const url = URL.createObjectURL(createPdfBlob(documentText));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `MesinBagus-Purchase-Order-${new Date().toISOString().slice(0, 10)}.pdf`;
    anchor.click();
    window.setTimeout(() => {
      URL.revokeObjectURL(url);
      setDownloading(false);
    }, 1000);
  }

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border-subtle bg-surface px-4 print:hidden">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href={backHref}
            className="rounded-full p-2 transition-colors hover:bg-surface-container active:opacity-80"
            aria-label="Back to PO review"
          >
            <MaterialSymbol name="arrow_back" className="text-primary" />
          </Link>
          <h1 className="truncate text-sm font-bold text-primary sm:text-base">
            Purchase Order (A4)
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={printDocument}
            className="flex items-center gap-1 rounded-full border border-primary px-3 py-1.5 text-xs font-semibold text-primary active:bg-primary/5"
          >
            <MaterialSymbol name="print" className="text-base" />
            Print
          </button>
          <button
            type="button"
            onClick={downloadDocument}
            disabled={downloading}
            className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white active:opacity-80"
            title="Download Purchase Order as PDF"
          >
            <MaterialSymbol name="download" className="text-base" />
            {downloading ? "Preparing…" : "Download"}
          </button>
        </div>
      </header>
      <iframe
        ref={iframeRef}
        onLoad={populateDocument}
        title="Purchase Order Preview"
        src={iframeSrc}
        className="min-h-0 w-full flex-1 border-0 bg-white"
        style={{ height: "calc(100dvh - 3.5rem)" }}
      />
    </>
  );
}

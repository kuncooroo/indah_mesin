"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { readPoDraft } from "@/lib/storefront/po-draft";

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
  buyerNpwp?: string;
  buyerNib?: string;
  quantity?: number;
  voltage?: string;
  orderNumber?: string;
  issuedAt?: string;
};

function buildFieldValues(documentData: PoDocumentData): Record<string, string> {
  const draft = readPoDraft(documentData.productId);
  const quantity = Math.max(1, documentData.quantity ?? draft.quantity ?? 1);
  const voltage = documentData.voltage ?? draft.voltage;
  const issuedAt = documentData.issuedAt ? new Date(documentData.issuedAt) : new Date();
  const issuedLabel = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(issuedAt);
  const orderNumber =
    documentData.orderNumber ??
    `DRAFT-${issuedAt.toISOString().slice(0, 10).replace(/-/g, "")}-${documentData.productSku.slice(0, 6)}`;
  const formattedTotal = documentData.unitPrice
    ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(documentData.unitPrice * quantity)
    : documentData.priceLabel;

  return {
    "po-number": orderNumber,
    "po-date": issuedLabel,
    "po-ref": orderNumber,
    "po-buyer-company": documentData.buyerCompany || "—",
    "po-buyer-name": `Attn: ${documentData.buyerName || "—"}`,
    "po-buyer-npwp": `NPWP: ${documentData.buyerNpwp || "—"}`,
    "po-buyer-nib": `NIB: ${documentData.buyerNib || "—"}`,
    "po-buyer-address": documentData.buyerAddress || "—",
    "po-buyer-email": documentData.buyerEmail || "—",
    "po-buyer-phone": documentData.buyerPhone || "—",
    "po-product-sku": documentData.productSku,
    "po-product-name": documentData.productName,
    "po-product-variant": `Voltage: ${voltage}`,
    "po-product-quantity": `${quantity} Unit${quantity > 1 ? "s" : ""}`,
    "po-product-price": documentData.priceLabel,
    "po-product-total": formattedTotal,
    "po-subtotal": formattedTotal,
    "po-grand-total": formattedTotal,
    "po-signature-name": documentData.buyerName || "—",
    "po-signature-company": documentData.buyerCompany || "—",
  };
}

function applyValuesToDocument(frameDocument: Document, values: Record<string, string>) {
  Object.entries(values).forEach(([id, value]) => {
    const element = frameDocument.getElementById(id);
    if (element) element.textContent = value;
  });
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
  const dataRef = useRef(documentData);
  dataRef.current = documentData;

  function populateDocument() {
    const frame = iframeRef.current;
    const frameDocument = frame?.contentDocument;
    if (!frameDocument?.body) return false;
    const values = buildFieldValues(dataRef.current);
    applyValuesToDocument(frameDocument, values);
    frame?.contentWindow?.postMessage({ type: "MESINBAGUS_PO_DATA", values }, "*");
    return Boolean(frameDocument.getElementById("po-buyer-company")?.textContent);
  }

  useEffect(() => {
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (populateDocument() || attempts >= 20) {
        window.clearInterval(timer);
      }
    }, 150);
    return () => window.clearInterval(timer);
  }, [documentData, iframeSrc]);

  function printDocument() {
    populateDocument();
    iframeRef.current?.contentWindow?.print();
  }

  async function downloadDocument() {
    populateDocument();
    const frameDocument = iframeRef.current?.contentDocument;
    const target =
      (frameDocument?.querySelector(".a4-container") as HTMLElement | null) ??
      frameDocument?.body;
    if (!target) return;

    setDownloading(true);
    try {
      // Wait a tick so populated text paints before capture
      await new Promise((resolve) => window.setTimeout(resolve, 80));
      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: target.scrollWidth,
        windowHeight: target.scrollHeight,
      } as Parameters<typeof html2canvas>[1]);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(
        `MesinBagus-${documentData.orderNumber ?? "Purchase-Order"}-${new Date().toISOString().slice(0, 10)}.pdf`
      );
    } catch (reason) {
      console.error("PO PDF capture failed", reason);
      // Fallback: open print dialog so user can Save as PDF with matching layout
      iframeRef.current?.contentWindow?.print();
    } finally {
      setDownloading(false);
    }
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
            onClick={() => void downloadDocument()}
            disabled={downloading}
            className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white active:opacity-80 disabled:opacity-60"
            title="Download Purchase Order as PDF"
          >
            <MaterialSymbol name="download" className="text-base" />
            {downloading ? "Preparing…" : "Download"}
          </button>
        </div>
      </header>
      <iframe
        ref={iframeRef}
        onLoad={() => {
          populateDocument();
        }}
        title="Purchase Order Preview"
        src={iframeSrc}
        className="min-h-0 w-full flex-1 border-0 bg-white"
        style={{ height: "calc(100dvh - 3.5rem)" }}
      />
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findProductById } from "@/lib/storefront/catalog";
import { ProductDetailView } from "@/components/storefront/product-detail-view";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await findProductById(id);
  if (!product) {
    return { title: "Produk tidak ditemukan" };
  }

  const title = `${product.name} (${product.sku})`;
  const description =
    product.subtitle ||
    product.features?.slice(0, 2).join(" ") ||
    `Spesifikasi dan penawaran ${product.name} — MesinBagus by Indah Mesin.`;

  const url = `/products/${product.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: product.image ? [{ url: product.image, alt: product.name }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await findProductById(id);
  if (!product) notFound();

  const productUrl = `${
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  }/products/${product.id}`;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description:
      product.subtitle ||
      product.features?.slice(0, 2).join(" ") ||
      `Mesin industri ${product.name} dari Indah Mesin.`,
    image: product.image ? [product.image] : undefined,
    url: productUrl,
    brand: { "@type": "Brand", name: "Indah Mesin" },
    offers: product.priceAmount
      ? {
          "@type": "Offer",
          url: productUrl,
          price: product.priceAmount,
          priceCurrency: "IDR",
          availability:
            product.status === "ready"
              ? "https://schema.org/InStock"
              : "https://schema.org/PreOrder",
          seller: { "@type": "Organization", name: "Indah Mesin" },
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema).replace(/</g, "\\u003c") }}
      />
      <ProductDetailView product={product} />
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findProductById } from "@/lib/storefront/catalog";
import { ProductDetailView } from "@/components/storefront/product-detail-view";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await findProductById(id);
  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false, follow: false },
    };
  }

  const title = `${product.name} (${product.sku})`;
  const description =
    product.subtitle ||
    product.features?.slice(0, 2).join(" ") ||
    `Specifications and quotation for ${product.name} — MesinBagus by Indah Mesin.`;

  return buildPageMetadata({
    title,
    description,
    path: `/products/${product.id}`,
    image: product.image,
    imageAlt: product.name,
    keywords: [product.name, product.sku, "mesin industri", "Indah Mesin", "MesinBagus"],
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await findProductById(id);
  if (!product) notFound();

  const productUrl = absoluteUrl(`/products/${product.id}`);
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description:
      product.subtitle ||
      product.features?.slice(0, 2).join(" ") ||
      `Industrial equipment ${product.name} from Indah Mesin.`,
    image: product.image ? [absoluteUrl(product.image)] : undefined,
    url: productUrl,
    brand: { "@type": "Brand", name: "Indah Mesin" },
    category: product.category,
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/beranda-artikel"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Categories",
        item: absoluteUrl("/categories"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={[productSchema, breadcrumbSchema]} />
      <ProductDetailView product={product} />
    </>
  );
}

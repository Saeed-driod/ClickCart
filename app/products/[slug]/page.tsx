import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getProducts } from "@/lib/db";
import { ProductDetailView } from "@/components/product-detail-view";
import {
  SITE_URL,
  SITE_NAME,
  formatProductTitle,
  formatMetaDescription,
  getSeoImageUrl,
} from "@/lib/site";

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return {
      title: `Product Not Found | ${SITE_NAME}`,
    };
  }

  const title = formatProductTitle(product.name);
  const description = formatMetaDescription(product.description, 160);
  const canonicalUrl = `${SITE_URL}/products/${product.slug}`;
  const ogImageUrl = getSeoImageUrl(product.images[0]);

  const productRegion = product.region === "UK" ? "UK" : "USA";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    other: {
      "product:price:amount": String(product.salePrice || product.price),
      "product:price:currency": productRegion === "UK" ? "GBP" : "USD",
      "product:availability": product.stock > 0 ? "in stock" : "out of stock",
      "product:brand": product.brand?.name || SITE_NAME,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const productRegion = product.region === "UK" ? "UK" : "USA";
  const canonicalUrl = `${SITE_URL}/products/${product.slug}`;
  const validImages = product.images
    .filter((img) => img && !img.startsWith("data:"))
    .map((img) => getSeoImageUrl(img));
  const schemaImages =
    validImages.length > 0 ? validImages : [`${SITE_URL}/og-image.png`];

  // Fetch related products in the SAME region and category
  const relatedResult = await getProducts({
    category: product.category?.slug,
    region: productRegion,
    limit: 5,
  });

  const relatedProducts = relatedResult.products.filter((p) => p.id !== product.id);

  // Structured Data: Product JSON-LD
  const productJsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: schemaImages,
    description: product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand?.name || SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: productRegion === "UK" ? "GBP" : "USD",
      price: String(product.salePrice || product.price),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  if (product.reviewCount > 0 && product.rating > 0) {
    productJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(product.rating),
      reviewCount: String(product.reviewCount),
    };
  }

  // Structured Data: BreadcrumbList JSON-LD
  const breadcrumbItems: any[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Products",
      item: `${SITE_URL}/products`,
    },
  ];

  if (product.category) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: product.category.name,
      item: `${SITE_URL}/category/${product.category.slug}`,
    });
  }

  breadcrumbItems.push({
    "@type": "ListItem",
    position: product.category ? 4 : 3,
    name: product.name,
    item: canonicalUrl,
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5 flex-wrap"
        >
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href={`/products?region=${productRegion}`} className="hover:text-foreground">
            {productRegion === "UK" ? "🇬🇧 UK Products" : "🇺🇸 USA Products"}
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/category/${product.category.slug}`}
                className="hover:text-foreground"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        <ProductDetailView product={product} relatedProducts={relatedProducts} />
      </div>
    </>
  );
}

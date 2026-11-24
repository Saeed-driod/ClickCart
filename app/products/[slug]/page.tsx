import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getProducts } from "@/lib/db";
import { ProductDetailView } from "@/components/product-detail-view";

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60;

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found - ClickCart" };

  return {
    title: `${product.name} - ClickCart Pakistan`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // Fetch related products in the same category
  const relatedResult = await getProducts({
    category: product.category?.slug,
    limit: 5,
  });

  const relatedProducts = relatedResult.products.filter((p) => p.id !== product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground">Products</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`/products?category=${product.category.slug}`}
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
  );
}

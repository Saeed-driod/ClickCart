import { cookies } from "next/headers";
import { getProducts, getCategories } from "@/lib/db";
import { HomeRegionView } from "@/components/home-region-view";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cookieStore = cookies();
  const regionCookie = cookieStore.get("clickcart_region")?.value;
  const activeRegion = regionCookie === "UK" ? "UK" : "USA";

  const [categories, productsResult] = await Promise.all([
    getCategories(),
    getProducts({ region: activeRegion, limit: 12 }),
  ]);

  return (
    <HomeRegionView
      initialRegion={activeRegion}
      initialProducts={productsResult.products}
      initialTotal={productsResult.total}
      categories={categories}
    />
  );
}

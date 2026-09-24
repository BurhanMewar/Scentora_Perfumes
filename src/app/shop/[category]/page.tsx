import { notFound } from "next/navigation";
import ProductCard from "@/components/storefront/ProductCardLarge";
import { Breadcrumb } from "@/components/storefront/common/Breadcrumb";
import { Heading } from "@/components/storefront/common/PageHeading";
import { FilterBar } from "@/components/storefront/Filterbar";
import Newsletter from "@/components/storefront/common/Newsletter";
import { Pagination } from "@/components/storefront/common/Pagination";
import BestSellersSection from "@/components/storefront/BestsellersSection";
import { findCategoryBySlug, getProducts } from "@/lib/api/catalog";
import { getWishlistProductIdSet } from "@/lib/api/wishlist";

interface Props {
  params: Promise<{
    category: string;
  }>;
  searchParams?: Promise<{
    search?: string | string[];
    sort?: string | string[];
  }>;
}

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Scentora Perfumes | Collections",
  description:
    "Explore Scentora's luxury perfume collections crafted for men, women, and unisex fragrances.",
};

export const labelMap: Record<string, string> = {
  all: "All Perfume",
  men: "Men's Luxury Perfume",
  women: "Women's Luxury Perfume",
  unisex: "Unisex Luxury Perfume",
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;
  const search =
    typeof resolvedSearchParams?.search === "string"
      ? resolvedSearchParams.search.trim()
      : "";
  const sort =
    typeof resolvedSearchParams?.sort === "string"
      ? resolvedSearchParams.sort
      : "";
  const categoryDetails =
    category === "all" ? null : await findCategoryBySlug(category);

  if (category !== "all" && !categoryDetails) {
    notFound();
  }

  const [result, wishlistProductIds] = await Promise.all([
    getProducts({
      category: category === "all" ? null : category,
      search,
      sort,
      limit: "48",
    }),
    getWishlistProductIdSet(),
  ]);
  const headingTitle = labelMap[category] ?? categoryDetails?.name ?? "Perfumes";
  const pageTitle = search
    ? `Search results for "${search}"`
    : `${headingTitle}s`;

  const breadcrumbItems = [
    { label: "Shop", href: "/" },
    { label: headingTitle, href: `/shop/${category}` },
  ];

  return (
    <main className="min-h-screen max-w-[1300px] mx-auto px-4 font-body">
      <Breadcrumb items={breadcrumbItems} />
      <Heading
        text={pageTitle}
        count={result.meta.total}
        Filter={<FilterBar currentCategory={category} currentSort={sort} search={search} />}
      />

      {result.data.length > 0 ? (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {result.data.map((product) => (
            <ProductCard
              key={product.id}
              productId={product.id}
              image={product.image}
              name={product.name}
              slug={product.slug}
              notes={product.notes.join(", ")}
              price={product.price.toFixed(2)}
              tag={product.tag ?? undefined}
              category={product.category}
              isWishlisted={wishlistProductIds.has(product.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-textSecondary py-10">
          {search
            ? `No perfumes found for "${search}".`
            : "No perfumes found in this category."}
        </p>
      )}

      {result.meta.totalPages > 1 ? <Pagination /> : null}
      <section className="flex w-full flex-col gap-y-10 py-8 md:py-10">
        <BestSellersSection />
        <Newsletter />
      </section>
    </main>
  );
}

export function generateStaticParams() {
  return [
    { category: "all" },
    { category: "men" },
    { category: "women" },
    { category: "unisex" },
  ];
}

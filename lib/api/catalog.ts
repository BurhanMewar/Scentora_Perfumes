import {
  categories,
  collections,
  products,
  type Product as CatalogProduct,
  type ProductTag,
} from "@/lib/data/catalog";
import { fetchCms } from "@/lib/content/api";

export type ProductSort = "newest" | "price_asc" | "price_desc" | "name_asc";

export type ProductQuery = {
  category?: string | null;
  collection?: string | null;
  search?: string | null;
  tag?: string | null;
  bestSeller?: string | null;
  featured?: string | null;
  sort?: string | null;
  page?: string | null;
  limit?: string | null;
};

export type StorefrontProduct = CatalogProduct & {
  detailedDescription: string;
  productDetailHtml: string;
  seoKeywords: string[];
  scentOptions: string[];
  categoryDetails: (typeof categories)[number];
  collectionDetails: (typeof collections)[number][];
};

const toProduct = (product: CatalogProduct): StorefrontProduct => {
  const category = categories.find((item) => item.slug === product.category) ?? categories[0];
  const productCollections = collections.filter((item) =>
    product.collections.includes(item.slug),
  );

  return {
    ...product,
    detailedDescription: `${product.description} Designed to linger beautifully from the first spray to the final warm trace.`,
    productDetailHtml: `<p>${product.description}</p><p>Layer it thoughtfully and let the character of this fragrance unfold throughout the day.</p>`,
    seoKeywords: [product.name, "Scentora", "perfume", "fragrance", ...product.notes],
    scentOptions: [],
    categoryDetails: category,
    collectionDetails: productCollections,
  };
};

const allProducts = products.filter((product) => product.isActive).map(toProduct);

export async function getProducts(query: ProductQuery = {}) {
  const remote = await fetchCms<{
    data: StorefrontProduct[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }>(`/catalog/products${toQueryString(query)}`);

  if (remote) {
    return remote;
  }

  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 12, 1), 50);
  const search = query.search?.trim().toLowerCase();

  let filtered = allProducts.filter((product) => {
    const matchesCategory =
      !query.category || query.category === "all" || product.category === query.category;
    const matchesCollection =
      !query.collection ||
      query.collection === "all" ||
      product.collections.includes(query.collection);
    const matchesSearch =
      !search ||
      [product.name, product.description, product.notes.join(" ")].some((value) =>
        value.toLowerCase().includes(search),
      );
    const matchesTag = !query.tag || product.tag === query.tag;
    const matchesBestSeller = query.bestSeller !== "true" || product.isBestSeller;
    const matchesFeatured = query.featured !== "true" || product.isFeatured;

    return (
      matchesCategory &&
      matchesCollection &&
      matchesSearch &&
      matchesTag &&
      matchesBestSeller &&
      matchesFeatured
    );
  });

  if (query.sort === "price_asc") filtered = filtered.toSorted((a, b) => a.price - b.price);
  if (query.sort === "price_desc") filtered = filtered.toSorted((a, b) => b.price - a.price);
  if (query.sort === "name_asc") {
    filtered = filtered.toSorted((a, b) => a.name.localeCompare(b.name));
  }

  const total = filtered.length;
  const data = filtered.slice((page - 1) * limit, page * limit);
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export async function findProductByIdOrSlug(idOrSlug: string) {
  const remote = await fetchCms<StorefrontProduct>(
    `/catalog/products/${encodeURIComponent(idOrSlug)}`,
  );

  if (remote) {
    return remote;
  }

  const normalized = idOrSlug.trim().toLowerCase();
  return (
    allProducts.find(
      (product) =>
        product.id.toLowerCase() === normalized ||
        product.slug.toLowerCase() === normalized ||
        product.modelNo.toLowerCase() === normalized,
    ) ?? null
  );
}

export async function getProductVariants(_parentProductId?: string): Promise<
  Array<{
    id: string;
    name: string;
    modelNo: string;
    image: string;
    price: number;
    stock: number;
  }>
> {
  void _parentProductId;
  return [];
}

export async function getRelatedProducts(input: {
  productId: string;
  categoryId: string;
  notes: string[];
  tag: ProductTag | null;
  collectionIds: string[];
  limit?: number;
}) {
  const limit = Math.min(Math.max(input.limit ?? 3, 1), 6);
  return allProducts
    .filter(
      (product) =>
        product.id !== input.productId &&
        (product.categoryDetails.id === input.categoryId ||
          product.notes.some((note) => input.notes.includes(note))),
    )
    .slice(0, limit);
}

export async function getCategories() {
  const remote = await fetchCms<(typeof categories)>(`/catalog/categories`);

  if (remote) {
    return remote;
  }

  return categories;
}

export async function findCategoryBySlug(slug: string) {
  const remote = await fetchCms<(typeof categories)[number]>(
    `/catalog/categories/${encodeURIComponent(slug)}`,
  );

  if (remote) {
    return remote;
  }

  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getCollections() {
  const remote = await fetchCms<(typeof collections)>(`/catalog/collections`);

  if (remote) {
    return remote;
  }

  return collections;
}

export async function getBrands() {
  return [];
}

export async function findCollectionBySlug(slug: string) {
  const remote = await fetchCms<(typeof collections)[number]>(
    `/catalog/collections/${encodeURIComponent(slug)}`,
  );

  if (remote) {
    return remote;
  }

  return collections.find((collection) => collection.slug === slug) ?? null;
}

function toQueryString(query: ProductQuery) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value) {
      params.set(key, value);
    }
  }

  const value = params.toString();
  return value ? `?${value}` : "";
}

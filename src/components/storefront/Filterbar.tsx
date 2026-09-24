"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDownUp } from "lucide-react";
import { SingleSelectDropdown, type DropdownOption } from "@/components/Dropdown";

const sortOptions: DropdownOption[] = [
  { value: "", label: "Recommended" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "name_asc", label: "Name: A to Z" },
];

export function FilterBar({
  currentCategory,
  currentSort = "",
  search = "",
}: {
  currentCategory: string;
  currentSort?: string;
  search?: string;
}) {
  const router = useRouter();
  const filters = [
    { label: "All", href: "/shop/all" },
    { label: "Men", href: "/shop/men" },
    { label: "Women", href: "/shop/women" },
    { label: "Unisex", href: "/shop/unisex" },
  ];

  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (currentSort) query.set("sort", currentSort);
  const queryString = query.size ? `?${query.toString()}` : "";

  function changeSort(value: string | number | null) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (typeof value === "string" && value) params.set("sort", value);
    const nextQuery = params.toString();
    router.push(`/shop/${currentCategory}${nextQuery ? `?${nextQuery}` : ""}`);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white/70 p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-3.5">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-textSecondary">Category</span>
        <nav aria-label="Filter by category" className="flex flex-wrap gap-1.5">
          {filters.map((filter) => (
            <Link
              key={filter.href}
              href={`${filter.href}${queryString}`}
              aria-current={filter.href === `/shop/${currentCategory}` ? "page" : undefined}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                filter.href === `/shop/${currentCategory}`
                  ? "bg-textPrimary text-white shadow-sm"
                  : "text-textSecondary hover:bg-pageBg hover:text-textPrimary"
              }`}
            >
              {filter.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex min-w-0 items-center justify-between gap-2 border-t border-black/10 pt-2.5 sm:shrink-0 sm:justify-start sm:border-0 sm:pt-0">
        <label htmlFor="product-sort" className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-textSecondary">
          <ArrowDownUp size={14} aria-hidden="true" /> Sort
        </label>
        <SingleSelectDropdown
          id="product-sort"
          shape="pill"
          options={sortOptions}
          value={currentSort}
          onChange={changeSort}
          size="small"
          searchable={false}
          sx={{ width: { xs: "calc(100% - 52px)", sm: 220 }, minWidth: 0, flex: "0 0 auto" }}
        />
      </div>
    </div>
  );
}

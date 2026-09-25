"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import CommonLink from "./CommonLink";
import { addGuestCartItem } from "@/lib/guest-cart";
import {
    addGuestWishlistItem,
    isGuestWishlisted,
    removeGuestWishlistItem,
} from "@/lib/guest-wishlist";
import { formatKwd, parseCurrencyAmount } from "@/lib/currency";

interface ProductCardWideProps {
    productId?: string;
    image: string;
    name: string;
    tagline?: string;
    description: string;
    price: string;
    stockText?: string;
    features?: string;
    notes?: string;
    slug?: string;
    isWishlisted?: boolean;
}

export default function ProductCardWide({
    productId,
    image,
    name,
    tagline = "Embrace the Mystery of the Night",
    description,
    price,
    stockText = "Only have 25 Products",
    features,
    notes,
    slug,
    isWishlisted = false,
}: ProductCardWideProps) {
    const [adding, setAdding] = useState(false);
    const [wishlistActive, setWishlistActive] = useState(() =>
        isWishlisted || (productId ? isGuestWishlisted(productId) : false),
    );
    const [updatingWishlist, setUpdatingWishlist] = useState(false);

    async function addToCart() {
        if (!productId) {
            return;
        }

        setAdding(true);

        try {
            addGuestCartItem({
                productId,
                name,
                image,
                price: parseCurrencyAmount(price),
                quantity: 1,
            });
            window.dispatchEvent(new Event("scentora:cart-updated"));
        } finally {
            setAdding(false);
        }
    }

    async function toggleWishlist() {
        if (!productId || updatingWishlist) {
            return;
        }

        setUpdatingWishlist(true);

        try {
            if (wishlistActive) {
                removeGuestWishlistItem(productId);
                setWishlistActive(false);
            } else {
                addGuestWishlistItem({
                    productId,
                    name,
                    image,
                    price: parseCurrencyAmount(price),
                    notes,
                    slug,
                });
                setWishlistActive(true);
            }
            window.dispatchEvent(new Event("scentora:wishlist-updated"));
        } finally {
            setUpdatingWishlist(false);
        }
    }

    const detailHref = `/products/${slug || productId || ""}`;

    return (
        <div className="flex flex-col gap-4 overflow-hidden rounded-2xl transition-all duration-300 sm:gap-6 md:flex-row">
            {/* Left - Image */}
            <Link
                href={detailHref}
                className="relative h-[220px] w-full overflow-hidden rounded-2xl shadow-sm sm:h-[240px] md:h-auto md:aspect-[4/3] md:w-5/12"
                aria-label={`View ${name} details`}
            >
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover object-center transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                    priority
                />
            </Link>

            {/* Right - Content */}
            <div className="w-full sm:flex-1 flex flex-col justify-center text-textPrimary">
                <Link href={detailHref} className="hover:opacity-75">
                    <h2 className="mb-1 font-heading text-2xl font-semibold sm:text-3xl">
                        {name}
                    </h2>
                </Link>
                <p className="mb-3 text-sm text-textSecondary">{tagline}</p>

                {/* Price & stock */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <p className="text-xl font-semibold text-accent">
                        {formatKwd(price)}
                    </p>
                    <span className="bg-[#FFEBCB] text-accent text-sm font-medium px-3 py-1 rounded-full">
                        {stockText}
                    </span>
                </div>

                {/* Description */}
                <p className="mb-3 text-sm leading-relaxed text-textSecondary">
                    {description}
                </p>

                {/* Features */}
                {features && (
                    <p className="mb-2 text-sm">
                        <span className="font-semibold text-textPrimary ">
                            Special Features:
                        </span>{" "}
                        {features}
                    </p>
                )}

                {/* Notes */}
                {notes && (
                    <p className="mb-4 text-sm">
                        <span className="font-semibold text-textPrimary">
                            Notes:
                        </span>{" "}
                        {notes}
                    </p>
                )}

                {/* Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <CommonLink inverse href={detailHref} className="flex-1">
                        View Details
                    </CommonLink>

                    <button
                        type="button"
                        onClick={toggleWishlist}
                        disabled={!productId || updatingWishlist}
                        aria-pressed={wishlistActive}
                        aria-label={
                            wishlistActive
                                ? `Remove ${name} from wishlist`
                                : `Add ${name} to wishlist`
                        }
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-accent/30 text-textPrimary transition-all hover:border-accent hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Heart
                            size={18}
                            className={
                                wishlistActive
                                    ? "fill-red-500 text-red-500"
                                    : undefined
                            }
                            aria-hidden="true"
                        />
                    </button>

                    <button
                        onClick={addToCart}
                        disabled={!productId || adding}
                        className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full border border-textPrimary px-3 py-2 text-xs font-semibold transition-all hover:bg-textPrimary hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
                    >
                        {adding ? "Adding..." : "Add to Bag"} <ShoppingBag size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}


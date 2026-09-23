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
        <div className="flex flex-col md:flex-row rounded-3xl gap-5 sm:gap-10 overflow-hidden  transition-all duration-300">
            {/* Left - Image */}
            <Link
                href={detailHref}
                className="relative w-full sm:w-5/12 aspect-square overflow-hidden rounded-3xl shadow-md"
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
                    <h2 className="mb-1 font-heading text-3xl font-semibold sm:text-5xl">
                        {name}
                    </h2>
                </Link>
                <p className="mb-4">{tagline}</p>

                {/* Price & stock */}
                <div className="flex items-center gap-3 mb-5">
                    <p className="text-xl font-semibold text-accent">
                        {formatKwd(price)}
                    </p>
                    <span className="bg-[#FFEBCB] text-accent text-sm font-medium px-3 py-1 rounded-full">
                        {stockText}
                    </span>
                </div>

                {/* Description */}
                <p className="text-sm  mb-4 leading-relaxed ">
                    {description}
                </p>

                {/* Features */}
                {features && (
                    <p className="text-sm mb-2">
                        <span className="font-semibold text-textPrimary ">
                            Special Features:
                        </span>{" "}
                        {features}
                    </p>
                )}

                {/* Notes */}
                {notes && (
                    <p className="text-sm mb-8">
                        <span className="font-semibold text-textPrimary">
                            Notes:
                        </span>{" "}
                        {notes}
                    </p>
                )}

                {/* Buttons */}
                <div className="flex items-center gap-4">
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
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-textPrimary transition-all hover:bg-[#3b3b3b] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
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
                        className="border w-1/2 border-textPrimary justify-center py-3 font-semibold rounded-full text-sm flex items-center gap-2 hover:bg-[#3b3b3b] hover:text-white transition-all disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {adding ? "Adding..." : "Add to Bag"} <ShoppingBag size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

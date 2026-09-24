"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import BuyButton from "./BuyButton";
import { addGuestCartItem } from "@/lib/guest-cart";
import {
    addGuestWishlistItem,
    isGuestWishlisted,
    removeGuestWishlistItem,
} from "@/lib/guest-wishlist";
import { parseCurrencyAmount } from "@/lib/currency";

interface ProductCardProps {
    productId?: string;
    image: string;
    name: string;
    notes: string;
    price: string;
    tag?: string;
    category?: string;
    slug?: string;
    isWishlisted?: boolean;
}

export default function ProductCardLarge({
    productId,
    image,
    name,
    notes,
    price,
    tag,
    slug,
    isWishlisted = false,
}: ProductCardProps) {
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
                    tag,
                    slug,
                });
                setWishlistActive(true);
            }
            window.dispatchEvent(new Event("scentora:wishlist-updated"));
        } finally {
            setUpdatingWishlist(false);
        }
    }

    const detailHref = slug || productId ? `/products/${slug || productId}` : null;

    return (
        <div
            className="rounded-soft flex flex-1 flex-col transition-transform duration-300 hover:scale-[101%]"
            itemScope
            itemType="https://schema.org/Product"
        >
            <div className="relative">
                {detailHref ? (
                <Link href={detailHref} aria-label={`View ${name} details`}>
                    <Image
                        src={image}
                        alt={`${name} perfume bottle`}
                        width={360}
                        height={360}
                        className="h-[170px] w-full rounded-xl object-cover sm:h-[185px] xl:h-[195px]"
                        loading="lazy"
                        priority={false}
                    />
                </Link>
                ) : (
                    <Image
                        src={image}
                        alt={`${name} perfume bottle`}
                        width={360}
                        height={360}
                        className="h-[170px] w-full rounded-xl object-cover sm:h-[185px] xl:h-[195px]"
                        loading="lazy"
                        priority={false}
                    />
                )}
                {tag ? (
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-accent px-2 py-1 text-[10px] font-bold uppercase text-white shadow-sm">
                        {tag}
                    </span>
                ) : null}
                <button
                    type="button"
                    aria-label={`Add ${name} to cart`}
                    onClick={addToCart}
                    disabled={!productId || adding}
                    className="group absolute right-11 top-2.5 grid h-7 w-7 place-items-center rounded-full border border-accent/30 bg-pageBg/80 text-textPrimary shadow-sm backdrop-blur-sm transition hover:border-accent hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {adding ? (
                        <span className="text-xs font-semibold">...</span>
                    ) : (
                        <ShoppingBag className="h-3.5 w-3.5 transition-colors group-hover:text-white" aria-hidden="true" />
                    )}
                </button>
                <button
                    type="button"
                    aria-label={
                        wishlistActive
                            ? `Remove ${name} from wishlist`
                            : `Add ${name} to wishlist`
                    }
                    aria-pressed={wishlistActive}
                    onClick={toggleWishlist}
                    disabled={!productId || updatingWishlist}
                    className="group absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full border border-accent/30 bg-pageBg/80 text-textPrimary shadow-sm backdrop-blur-sm transition hover:border-accent hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Heart
                        className={`h-4 w-4 ${
                            wishlistActive
                            ? "fill-accent text-accent group-hover:fill-white group-hover:text-white"
                            : "text-current"
                        }`}
                        aria-hidden="true"
                    />
                </button>
                <div
                    className="absolute bottom-2 left-2 w-[calc(100%-1rem)] rounded-lg border border-white/15 bg-black/55 p-2 shadow-sm backdrop-blur-sm"
                    itemProp="name"
                >
                    {detailHref ? (
                        <Link href={detailHref} className="hover:underline">
                            <h3 className="line-clamp-1 text-[13px] font-semibold text-white sm:text-sm">{name}</h3>
                        </Link>
                    ) : (
                        <h3 className="line-clamp-1 text-[13px] font-semibold text-white sm:text-sm">{name}</h3>
                    )}
                    <p className="line-clamp-1 text-xs text-white/90 sm:text-[13px]" itemProp="description">
                        {notes}
                    </p>
                </div>
            </div>

            <BuyButton image={image} name={name} price={price} productId={productId} />
        </div>
    );
}

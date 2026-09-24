"use client";

import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { addGuestCartItem } from "@/lib/guest-cart";
import {
    addGuestWishlistItem,
    isGuestWishlisted,
    removeGuestWishlistItem,
} from "@/lib/guest-wishlist";
import { formatKwd, parseCurrencyAmount } from "@/lib/currency";

type Props = {
  img: string;
  title: string;
  price: string;
  productId?: string;
};

export default function ProductCard({ img, title, price, productId }: Props) {
  const [adding, setAdding] = useState(false);
  const [wishlistActive, setWishlistActive] = useState(() =>
    productId ? isGuestWishlisted(productId) : false,
  );
  const [updatingWishlist, setUpdatingWishlist] = useState(false);

  async function addToCart() {
    if (!productId) return;
    setAdding(true);

    try {
      addGuestCartItem({
        productId,
        name: title,
        image: img,
        price: parseCurrencyAmount(price),
        quantity: 1,
      });
      window.dispatchEvent(new Event("scentora:cart-updated"));
    } finally {
      setAdding(false);
    }
  }

  async function toggleWishlist() {
    if (!productId || updatingWishlist) return;
    setUpdatingWishlist(true);

    try {
      if (wishlistActive) {
        removeGuestWishlistItem(productId);
      } else {
        addGuestWishlistItem({
          productId,
          name: title,
          image: img,
          price: parseCurrencyAmount(price),
        });
      }
      setWishlistActive((active) => !active);
      window.dispatchEvent(new Event("scentora:wishlist-updated"));
    } finally {
      setUpdatingWishlist(false);
    }
  }

  return (
    <article className="group flex min-w-0 items-center gap-3 rounded-2xl border border-black/5 bg-cardBg p-3 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-xl sm:gap-4 sm:p-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white shadow-card sm:h-[72px] sm:w-[72px]">
        <Image
          src={img}
          alt={title}
          width={72}
          height={72}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="line-clamp-2 break-words font-body text-sm font-semibold leading-tight text-textPrimary sm:text-base">
          {title}
        </h3>
        <p className="mt-1 text-sm font-medium text-accent sm:mt-2 sm:text-base">
          {formatKwd(price)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <button
          onClick={toggleWishlist}
          disabled={updatingWishlist}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-60"
          aria-label="Add to wishlist"
        >
          <Heart
            size={16}
            className={`transition-colors ${
              wishlistActive
                ? "fill-red-500 text-red-500"
                : "text-textPrimary"
            }`}
          />
        </button>
        <button
          onClick={addToCart}
          disabled={adding}
          className="p-2 rounded-full hover:bg-textPrimary hover:text-white transition-colors disabled:opacity-60"
          aria-label="Add to cart"
        >
          <ShoppingBag
            size={16}
            className="text-textPrimary group-hover:text-white"
          />
        </button>
      </div>
    </article>
  );
}

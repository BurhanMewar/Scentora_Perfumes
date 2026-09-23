"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CommonLink from "./common/CommonLink";
import { addGuestCartItem } from "@/lib/guest-cart";
import { formatKwd, parseCurrencyAmount } from "@/lib/currency";

export default function BuyButton({
  image,
  name,
  price,
  productId,
}: {
  image?: string;
  name?: string;
  price: string;
  productId?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function buyNow() {
    if (!productId) {
      router.push("/shop/all");
      return;
    }

    setLoading(true);

    try {
      addGuestCartItem({
        productId,
        name: name || "Perfume",
        image: image || "/images/perfume-bottle.webp",
        price: parseCurrencyAmount(price),
        quantity: 1,
      });
      window.dispatchEvent(new Event("scentora:cart-updated"));
      window.dispatchEvent(new Event("scentora:cart-open"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      {productId ? (
        <button
          type="button"
          onClick={buyNow}
          disabled={loading}
          className="flex min-h-11 flex-1 items-center justify-center rounded-full bg-textPrimary px-5 text-sm font-semibold text-white transition hover:bg-textPrimary/85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Adding..." : "Buy Now"}
        </button>
      ) : (
        <CommonLink inverse href="/shop/all" className="flex-1">
          Buy Now
        </CommonLink>
      )}

      <span className="rounded-pill border px-3 py-2 font-medium text-textPrimary">
        {formatKwd(price)}
      </span>
    </div>
  );
}

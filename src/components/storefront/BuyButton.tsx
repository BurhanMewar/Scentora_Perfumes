"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CommonLink from "./common/CommonLink";
import { addGuestCartItem } from "@/lib/guest-cart";
import { formatKwd, parseCurrencyAmount } from "@/lib/currency";
import { Button } from "@/components/ui";

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
    <div className="mt-2 flex flex-col items-stretch gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
      {productId ? (
        <Button
          onClick={buyNow}
          loading={loading}
          loadingText="Adding..."
          size="sm"
          className="w-full sm:flex-1"
        >
          Buy Now
        </Button>
      ) : (
        <CommonLink inverse href="/shop/all" className="w-full sm:flex-1">
          Buy Now
        </CommonLink>
      )}

      <span className="whitespace-nowrap self-center rounded-pill border border-black/10 bg-white/50 px-2.5 py-1.5 text-xs font-semibold text-textPrimary sm:self-auto sm:text-sm">
        {formatKwd(price)}
      </span>
    </div>
  );
}


"use client";

import { Heart, Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getGuestCartQuantity } from "@/lib/guest-cart";
import { getGuestWishlistQuantity } from "@/lib/guest-wishlist";

const links = [
  ["Shop", "/shop/all"],
  ["Collections", "/collections/all"],
  ["Best sellers", "/best-sellers"],
  ["The guide", "/guide"],
  ["Our story", "/about"],
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [wishlistQuantity, setWishlistQuantity] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      setCartQuantity(getGuestCartQuantity());
      setWishlistQuantity(getGuestWishlistQuantity());
    };
    updateCounts();
    window.addEventListener("scentora:cart-updated", updateCounts);
    window.addEventListener("scentora:wishlist-updated", updateCounts);
    return () => {
      window.removeEventListener("scentora:cart-updated", updateCounts);
      window.removeEventListener("scentora:wishlist-updated", updateCounts);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-pageBg/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-[1300px] items-center justify-between gap-3 px-4 sm:px-6">
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-10 w-10 place-items-center rounded-full border border-black/20 md:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <nav className="hidden items-center gap-5 text-sm font-semibold md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="transition-opacity hover:opacity-60">
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          className="font-heading text-xl font-bold uppercase tracking-[0.22em] sm:text-2xl"
        >
          Scentora
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/wishlist" aria-label="Wishlist" className="relative grid h-10 w-10 place-items-center rounded-full border border-black/20">
            <Heart className={`h-4 w-4 ${wishlistQuantity ? "fill-red-500 text-red-500" : ""}`} />
            <Count value={wishlistQuantity} />
          </Link>
          <button
            type="button"
            aria-label="Open cart"
            onClick={() => window.dispatchEvent(new Event("scentora:cart-open"))}
            className="relative grid h-10 w-10 place-items-center rounded-full border border-black/20"
          >
            <ShoppingBag className="h-4 w-4" />
            <Count value={cartQuantity} />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav className="border-t border-black/10 px-4 py-4 md:hidden">
          <div className="mx-auto grid max-w-[1300px] gap-1">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-semibold hover:bg-black/5"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function Count({ value }: { value: number }) {
  return value > 0 ? (
    <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-accent px-1 text-center text-[10px] font-bold">
      {value}
    </span>
  ) : null;
}

"use client";

import { Heart, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getGuestCartQuantity } from "@/lib/guest-cart";
import { getGuestWishlistQuantity } from "@/lib/guest-wishlist";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/slice/AuthSlice";
import { useRouter } from "next/navigation";

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
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function handleLogout() {
    await dispatch(logoutUser());
    router.push("/auth/login");
  }

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
      <div className="relative mx-auto grid min-h-14 max-w-[1300px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 sm:min-h-16 sm:px-6">
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-9 w-9 place-items-center rounded-full border border-black/15 text-textPrimary transition hover:border-accent hover:bg-accent hover:text-white xl:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <nav className="hidden items-center gap-3 text-xs font-semibold lg:gap-4 lg:text-sm xl:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="transition-opacity hover:opacity-60">
              {label}
            </Link>
          ))}
          {isAuthenticated ? <button type="button" onClick={handleLogout} className="text-textSecondary transition-opacity hover:opacity-60">Logout</button> : null}
        </nav>

        <Link
          href="/"
          aria-label="Scentora home"
          className="absolute left-1/2 inline-flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap sm:gap-3"
        >
          <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-xl bg-accent font-heading text-2xl font-bold text-textPrimary shadow-sm ring-1 ring-black/5 sm:h-10 sm:w-10 sm:text-3xl">
            S
          </span>
          <span className="font-heading text-sm font-bold uppercase leading-none tracking-[0.2em] text-accent sm:text-base sm:tracking-[0.26em] md:text-lg">
            SCENTORA
          </span>
        </Link>

        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5 sm:right-6 sm:gap-2">
          <Link href="/account" aria-label="Your account" className="group relative hidden h-8 w-8 place-items-center rounded-full border border-accent/25 bg-pageBg/70 text-textPrimary transition hover:border-accent hover:bg-accent hover:text-white sm:grid sm:h-9 sm:w-9">
            <UserRound className="h-3.5 w-3.5 transition-colors group-hover:text-white sm:h-4 sm:w-4" />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="group relative grid h-8 w-8 place-items-center rounded-full border border-accent/25 bg-pageBg/70 text-textPrimary transition hover:border-accent hover:bg-accent hover:text-white sm:h-9 sm:w-9">
            <Heart className={`h-3.5 w-3.5 transition-colors sm:h-4 sm:w-4 ${wishlistQuantity ? "fill-accent text-accent group-hover:fill-white group-hover:text-white" : "group-hover:text-white"}`} />
            <Count value={wishlistQuantity} />
          </Link>
          <button
            type="button"
            aria-label="Open cart"
            onClick={() => window.dispatchEvent(new Event("scentora:cart-open"))}
            className="group relative grid h-8 w-8 place-items-center rounded-full border border-accent/25 bg-pageBg/70 text-textPrimary transition hover:border-accent hover:bg-accent hover:text-white sm:h-9 sm:w-9"
          >
            <ShoppingBag className="h-3.5 w-3.5 transition-colors group-hover:text-white sm:h-4 sm:w-4" />
            <Count value={cartQuantity} />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav className="border-t border-black/10 bg-pageBg px-3 py-3 shadow-lg xl:hidden">
          <div className="mx-auto grid max-w-[1300px] gap-1">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-accent/10 hover:text-accent"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-accent/10 hover:text-accent"
            >
              <UserRound className="h-4 w-4" aria-hidden="true" /> Account
            </Link>
            {isAuthenticated ? <button type="button" onClick={handleLogout} className="rounded-lg px-3 py-3 text-left text-base font-semibold text-textSecondary hover:bg-black/5">Logout</button> : null}
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

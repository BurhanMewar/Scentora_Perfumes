import { Breadcrumb } from "@/components/storefront/common/Breadcrumb";
import Newsletter from "@/components/storefront/common/Newsletter";
import GuestWishlistView from "./ui/guest-wishlist-view";

export const metadata = {
  title: "Wishlist | Scentora",
  description: "View your saved Scentora perfumes.",
};

export default function WishlistPage() {
  return (
    <main className="min-h-screen max-w-[1300px] mx-auto px-4 font-body">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Wishlist", href: "/wishlist" },
        ]}
      />
      <GuestWishlistView />

      <section className="flex w-full flex-col gap-y-10 py-8 md:py-10">
        <Newsletter />
      </section>
    </main>
  );
}

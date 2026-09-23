import { Breadcrumb } from "@/components/common/Breadcrumb";
import Newsletter from "@/components/common/Newsletter";
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

      <section className="flex flex-col gap-y-16 pt-10 pb-10 md:pt-16 w-full">
        <Newsletter />
      </section>
    </main>
  );
}

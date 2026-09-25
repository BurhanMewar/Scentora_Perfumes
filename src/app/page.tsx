import Image from "next/image";
import Hero from "@/components/storefront/Hero";
import FooterMarquee from "@/components/storefront/FooterMarquee";
import CategorySection from "@/components/storefront/CategorySection";
import FragranceSection from "@/components/storefront/FragranceSection";
import ExperienceSection from "@/components/storefront/ExperienceSection";
import FeaturedCollections from "@/components/storefront/FeaturedCollections";
import PremiumIngredients from "@/components/storefront/PremiumIngredients";
import BestSellersSection from "@/components/storefront/BestsellersSection";
import Newsletter from "@/components/storefront/common/Newsletter";

export const metadata = {
  title: "SCENTORA | Timeless Scents & Lasting Impressions",
  description:
    "Discover SCENTORA's luxurious perfumes crafted with the finest ingredients. Explore men's, women's, unisex and luxury collections that define sophistication.",
  keywords:
    "perfume, fragrance, scent, luxury perfumes, men's perfume, women's perfume, unisex scents, SCENTORA",
  openGraph: {
    title: "SCENTORA | Luxury Perfumes for Men & Women",
    description:
      "Explore premium fragrances that blend modern artistry and timeless elegance.",
    url: "https://scentora.com",
    siteName: "SCENTORA",
    images: [
      {
        url: "/images/hero.webp",
        width: 1200,
        height: 630,
        alt: "Luxury perfume bottle from SCENTORA",
      },
    ],
    type: "website",
  },
};

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="relative mx-auto flex w-full max-w-[1200px] flex-col items-center gap-x-8 px-4 md:flex-row lg:px-6">
        <Hero />

        <aside className="relative flex w-full items-end justify-center xl:w-[40%] xl:justify-end">
          <div className="flex h-full w-full items-center justify-center xl:justify-end">
            <div className="relative max-w-[360px] xl:max-w-[420px]">
              <Image
                src="/images/hero.webp"
                alt="Premium perfume bottle held in hand"
                width={480}
                height={640}
                className="h-auto max-h-[520px] w-full object-contain"
                priority
              />
            </div>
          </div>
        </aside>
      </section>

      <FooterMarquee />
      <CategorySection />
      <section className="mx-auto flex w-full max-w-[1200px] flex-col gap-y-9 px-4 py-6 sm:gap-y-12 sm:py-8 md:gap-y-14 md:py-12">
        <FragranceSection />
        <ExperienceSection />
        <FeaturedCollections />
        <PremiumIngredients />
        <BestSellersSection />
        <Newsletter />
      </section>
    </main>
  );
}


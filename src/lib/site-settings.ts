import { DEFAULT_PROMO_BANNER_TEXT } from "@/lib/banner-store";
import { fetchCms } from "@/lib/content/api";
import { siteConfig } from "@/lib/site-config";

export { DEFAULT_PROMO_BANNER_TEXT };

export const FACEBOOK_URL_KEY = "facebook_url";
export const X_URL_KEY = "x_url";
export const YOUTUBE_URL_KEY = "youtube_url";
export const INSTAGRAM_URL_KEY = "instagram_url";
export const CONTACT_PHONE_KEY = "contact_phone";
export const CONTACT_EMAIL_KEY = "contact_email";
export const HOME2_PROMO_SLIDES_KEY = "home2_promo_slides";

export const DEFAULT_CONTACT_PHONE = "";
export const DEFAULT_CONTACT_EMAIL = siteConfig.contactEmail;

export const DEFAULT_HOME2_PROMO_SLIDES = [
  {
    eyebrow: "AI Curated Edit",
    title: "Indulge in Exquisite Fragrances",
    description:
      "Discover refined perfumes shaped around mood, memory, and modern elegance.",
    image: "/images/hero.webp",
    href: "/shop/all",
    cta: "Shop fragrances",
  },
  {
    eyebrow: "Limited Arrival",
    title: "Signature Scents for Every Occasion",
    description:
      "Explore luminous florals, warm ambers, and confident woody blends.",
    image: "/images/perfume-bottle.webp",
    href: "/shop/all",
    cta: "Explore arrivals",
  },
  {
    eyebrow: "Best Seller Spotlight",
    title: "Customer-Loved Perfume Stories",
    description:
      "Find the long-lasting blends that keep returning to the top shelf.",
    image: "/images/perfume-blue.webp",
    href: "/best-sellers",
    cta: "View best sellers",
  },
];

export type Home2PromoSlide = (typeof DEFAULT_HOME2_PROMO_SLIDES)[number];

export async function getSiteSettings() {
  const remote = await fetchCms<{
    promoBannerText: string;
    facebookUrl: string;
    xUrl: string;
    youtubeUrl: string;
    instagramUrl: string;
    contactPhone: string;
    contactEmail: string;
    home2PromoSlides: Home2PromoSlide[];
  }>("/content/site-settings");

  if (remote) {
    return remote;
  }

  return {
    promoBannerText: DEFAULT_PROMO_BANNER_TEXT,
    facebookUrl: "",
    xUrl: "",
    youtubeUrl: "",
    instagramUrl: "",
    contactPhone: DEFAULT_CONTACT_PHONE,
    contactEmail: DEFAULT_CONTACT_EMAIL,
    home2PromoSlides: DEFAULT_HOME2_PROMO_SLIDES,
  };
}

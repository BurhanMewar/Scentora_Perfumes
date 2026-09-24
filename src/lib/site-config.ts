const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");

export const siteConfig = {
  name: "Scentora",
  url: siteUrl || "http://localhost:3000",
  description:
    "Discover elegant, long-lasting fragrances crafted for individuality.",
  currency: process.env.NEXT_PUBLIC_CURRENCY || "KWD",
  locale: process.env.NEXT_PUBLIC_LOCALE || "en-KW",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  theme: {
    colors: {
      page: "#fef8e8",
      surface: "#fffaf0",
      accent: "#fc8c3d",
      accentSoft: "#ffcc70",
      text: "#262626",
      muted: "#6b6b6b",
      card: "#fdefca",
    },
  },
} as const;

"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import CartDrawer from "@/components/storefront/cart/CartDrawer";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import PromoBar from "@/components/storefront/common/PromoBar";

type SiteSettings = {
  promoBannerText: string;
  facebookUrl: string;
  xUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  contactPhone: string;
  contactEmail: string;
};

export default function SiteShellClient({
  children,
  settings,
}: {
  children: ReactNode;
  settings: SiteSettings;
}) {
  const pathname = usePathname();
  const legacyAdminRoutes = ["/auth", "/user", "/role", "/permission", "/menu", "/appsetting"];
  const isLegacyAdminRoute = pathname === "/cms" || pathname.startsWith("/cms/") || legacyAdminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  ) || (pathname.startsWith("/admin") && !pathname.startsWith("/admin/banner"));

  if (isLegacyAdminRoute) {
    return <div className="min-h-screen bg-[#f8fafc] text-[#111827]">{children}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PromoBar text={settings.promoBannerText} />
      <Header variant="storefront" />
      <CartDrawer />
      <div className="flex-1">{children}</div>
      <Footer variant="storefront" settings={settings} />
    </div>
  );
}

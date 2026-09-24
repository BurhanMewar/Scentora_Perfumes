"use client";

import AdminFooter from "@/components/layout/Footer";
import CmsFooter from "@/components/storefront/cms/CmsFooter";
import StorefrontFooter from "@/components/storefront/common/Footer";

type FooterSettings = {
  facebookUrl: string;
  xUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  contactPhone: string;
  contactEmail: string;
};

type SharedFooterProps =
  | { variant: "admin" }
  | { variant: "cms" }
  | { variant: "storefront"; settings: FooterSettings };

export default function Footer(props: SharedFooterProps) {
  if (props.variant === "admin") return <AdminFooter />;
  if (props.variant === "cms") return <CmsFooter />;
  return <StorefrontFooter settings={props.settings} />;
}

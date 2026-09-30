import SiteShell from "@/components/storefront/layout/SiteShell";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
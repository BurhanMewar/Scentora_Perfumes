import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import "./storefront.css";
import ThemeProvider from "../components/ThemeProvider";
import { StoreProvider } from "../store/Provider";
import SiteShell from "@/components/storefront/layout/SiteShell";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: `${siteConfig.name} | Timeless Scents, Lasting Impressions`,
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} | Timeless Scents, Lasting Impressions`,
    description: siteConfig.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{
        "--scentora-page": siteConfig.theme.colors.page,
        "--scentora-surface": siteConfig.theme.colors.surface,
        "--scentora-accent": siteConfig.theme.colors.accent,
        "--scentora-accent-soft": siteConfig.theme.colors.accentSoft,
        "--scentora-text": siteConfig.theme.colors.text,
        "--scentora-muted": siteConfig.theme.colors.muted,
        "--scentora-card": siteConfig.theme.colors.card,
      } as CSSProperties}
    >
      <body className="text-textPrimary">
        <StoreProvider>
          <ThemeProvider>
            <SiteShell>{children}</SiteShell>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

import { siteConfig } from "@/lib/site-config";

export function parseCurrencyAmount(value: string | number) {
  const amount = typeof value === "number" ? value : Number.parseFloat(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

export function formatKwd(value: string | number) {
  return new Intl.NumberFormat(siteConfig.locale, {
    style: "currency",
    currency: siteConfig.currency,
  }).format(parseCurrencyAmount(value));
}

export function parseCurrencyAmount(value: string | number) {
  const amount = typeof value === "number" ? value : Number.parseFloat(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

export function formatKwd(value: string | number) {
  return `${parseCurrencyAmount(value).toFixed(2)} KWD`;
}

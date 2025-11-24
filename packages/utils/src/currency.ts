export function formatCurrency(
  value: number,
  currency: string,
  locale = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function calculateUtilizationPercent(
  used: number,
  total: number,
): number {
  if (!total || total <= 0) {
    return 0;
  }

  return Math.round((used / total) * 100);
}
export type CurrencyCode = "USD" | "GBP" | "EUR" | "PKR" | "AED";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
  },
  PKR: {
    code: "PKR",
    symbol: "₨",
    name: "Pakistani Rupee",
  },
  AED: {
    code: "AED",
    symbol: "AED",
    name: "UAE Dirham",
  },
};

export function formatMoney(amount: number, currency: CurrencyCode = "USD"): string {
  const config = CURRENCIES[currency] || CURRENCIES.USD;

  if (currency === "PKR") {
    return `${config.symbol} ${Math.round(amount).toLocaleString("en-PK")}`;
  }

  return `${config.symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

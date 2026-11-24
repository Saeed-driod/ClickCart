export type CurrencyCode = "PKR" | "USD" | "EUR" | "GBP" | "AED";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateFromPKR: number; // 1 PKR = rate in target currency
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  PKR: {
    code: "PKR",
    symbol: "₨",
    name: "Pakistani Rupee",
    rateFromPKR: 1,
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    rateFromPKR: 1 / 278,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    rateFromPKR: 1 / 300,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    rateFromPKR: 1 / 355,
  },
  AED: {
    code: "AED",
    symbol: "AED",
    name: "UAE Dirham",
    rateFromPKR: 1 / 75.7,
  },
};

export function formatMoney(amountInPKR: number, currency: CurrencyCode = "PKR"): string {
  const config = CURRENCIES[currency] || CURRENCIES.PKR;
  const converted = amountInPKR * config.rateFromPKR;

  if (currency === "PKR") {
    return `${config.symbol} ${Math.round(converted).toLocaleString("en-PK")}`;
  }

  return `${config.symbol}${converted.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

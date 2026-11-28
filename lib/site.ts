export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://clickcarts.vercel.app"
).replace(/\/+$/, "");

export const SITE_NAME = "ClickCart";

/**
 * Formats a product title as "<Product Name> | ClickCart" within ~60 chars.
 */
export function formatProductTitle(name: string): string {
  const suffix = ` | ${SITE_NAME}`;
  const maxNameLen = 60 - suffix.length;
  const cleanName = name.trim();
  if (cleanName.length <= maxNameLen) {
    return `${cleanName}${suffix}`;
  }
  return `${cleanName.slice(0, maxNameLen - 1).trimEnd()}…${suffix}`;
}

/**
 * Formats a meta description cleanly within maxLength (default 160 chars).
 */
export function formatMetaDescription(text: string, maxLength = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  const sliced = clean.slice(0, maxLength - 3);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${(lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).trimEnd()}...`;
}

/**
 * Returns an HTTP(S) image URL suitable for OpenGraph/Twitter/JSON-LD scrapers.
 */
export function getSeoImageUrl(url?: string | null): string {
  if (!url || url.startsWith("data:")) {
    return `${SITE_URL}/og-image.png`;
  }
  if (url.startsWith("/")) {
    return `${SITE_URL}${url}`;
  }
  return url;
}

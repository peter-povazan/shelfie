// lib/i18n.ts
export const locales = ["sk", "en", "cz"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "sk";

export function isLocale(x: unknown): x is Locale {
  return typeof x === "string" && (locales as readonly string[]).includes(x);
}

// Accept-Language často vracia "cs" pre češtinu (nie "cz")
export function pickLocaleFromHeader(al?: string | null): Locale | undefined {
  if (!al) return undefined;

  const first = al.split(",")[0]?.trim().toLowerCase(); // napr "sk-sk"
  const short = first?.split("-")[0]; // "sk"

  if (short === "cs") return "cz";
  if (isLocale(short)) return short;

  return undefined;
}

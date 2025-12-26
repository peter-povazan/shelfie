"use client";

import { useParams } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

export function useLocale() {
  const params = useParams<{ locale?: string }>();
  const raw = params?.locale;
  const locale: Locale = raw && isLocale(raw) ? (raw as Locale) : "sk";
  return locale;
}

export function useL() {
  const locale = useLocale();
  return (path: string) => `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

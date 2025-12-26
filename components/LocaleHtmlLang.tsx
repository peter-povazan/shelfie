// components/LocaleHtmlLang.tsx
"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";

export default function LocaleHtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}

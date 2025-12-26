"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isLocale, defaultLocale } from "@/lib/i18n";

export default function HtmlLang() {
  const pathname = usePathname();

  useEffect(() => {
    const seg1 = pathname.split("/")[1] || "";
    const loc = isLocale(seg1) ? seg1 : defaultLocale;
    document.documentElement.lang = loc;
  }, [pathname]);

  return null;
}

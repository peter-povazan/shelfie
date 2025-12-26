"use client";

import { useMemo } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { isLocale, defaultLocale, locales } from "@/lib/i18n";

function stripLeadingLocale(pathname: string, current: Locale) {
  // pathname napr: "/sk/result" | "/sk" | "/sk/o-projekte"
  const prefix = `/${current}`;
  if (pathname === prefix) return ""; // home
  if (pathname.startsWith(prefix + "/")) return pathname.slice(prefix.length); // "/result"
  return pathname; // fallback
}

export default function LocaleSwitcher({
  className = "",
  cookieName = "shelfie_locale",
}: {
  className?: string;
  cookieName?: string;
}) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const params = useParams<{ locale?: string }>();

  const current: Locale = useMemo(() => {
    const raw = params?.locale;
    return raw && isLocale(raw) ? raw : defaultLocale;
  }, [params]);

  const rest = useMemo(() => stripLeadingLocale(pathname, current), [pathname, current]);

  function go(to: Locale) {
    // zapamätaj voľbu (1 rok)
    document.cookie = `${cookieName}=${to}; Path=/; Max-Age=31536000; SameSite=Lax`;

    // prehoď routu
    const nextPath = `/${to}${rest || ""}`;
    router.push(nextPath);
  }

  return (
    <div className={`mt-3 flex items-center justify-center gap-2 text-xs ${className}`}>

      {locales.map((l) => {
        const active = l === current;
        return (
          <button
            key={l}
            type="button"
            onClick={() => go(l)}
            className={[
              "rounded-full px-2 py-1 font-semibold transition",
              active ? "bg-slate-900/30 text-white" : "text-slate-700 hover:bg-white",
            ].join(" ")}
            aria-current={active ? "true" : undefined}
          >
            {l.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

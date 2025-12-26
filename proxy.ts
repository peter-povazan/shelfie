// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale, pickLocaleFromHeader } from "@/lib/i18n";

const PUBLIC_FILE = /\.(.*)$/;

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const seg1 = pathname.split("/")[1];
  if (isLocale(seg1)) return NextResponse.next();

  const locale =
    pickLocaleFromHeader(req.headers.get("accept-language")) ?? defaultLocale;

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api).*)"],
};

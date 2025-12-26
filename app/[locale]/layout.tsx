// app/[locale]/layout.tsx
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params; // ✅ Next 16: params môže byť Promise

  if (!isLocale(raw)) notFound();

  const loc: Locale = raw;

  return (
    <>
      <LocaleHtmlLang locale={loc} />
      {children}
    </>
  );
}

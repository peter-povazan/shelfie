import PageFrame from "@/components/PageFrame";
import { PAGES } from "@/lib/pagesCopy";
import type { Locale } from "@/lib/i18n";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const C = PAGES[locale].about;

  return (
    <PageFrame locale={locale} title={C.title} subtitle={C.subtitle}>
      <div className="mt-6 text-sm text-slate-700 leading-relaxed space-y-4">
        {C.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </PageFrame>
  );
}

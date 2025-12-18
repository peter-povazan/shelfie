import PageFrame from "@/components/PageFrame";

export default function Page() {
  return (
    <PageFrame
      title="Podmienky používania"
      subtitle="Základné pravidlá používania aplikácie"
    >
      <div className="mt-6 text-sm text-slate-700 leading-relaxed space-y-3">
        <p>
          Používaním aplikácie Shelfie súhlasíte s tým, že výsledky
          majú odporúčací a informačný charakter.
        </p>
        <p>
          Aplikácia neslúži ako odborné poradenstvo.
        </p>
      </div>
    </PageFrame>
  );
}

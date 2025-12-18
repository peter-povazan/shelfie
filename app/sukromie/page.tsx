import PageFrame from "@/components/PageFrame";

export default function Page() {
  return (
    <PageFrame
      title="Súkromie"
      subtitle="Ako pracujeme s vašimi údajmi"
    >
      <div className="mt-6 text-sm text-slate-700 leading-relaxed space-y-3">
        <p>
          Fotografie sú použité výhradne na analýzu obsahu knižnice.
        </p>
        <p>
          Neuchovávame ich dlhodobo ani ich neposkytujeme tretím stranám.
        </p>
      </div>
    </PageFrame>
  );
}

import PageFrame from "@/components/PageFrame";

export default function Page() {
  return (
    <PageFrame
      title="O projekte"
      subtitle="Čo je Shelfie a prečo vznikla"
    >
      <div className="mt-6 text-sm text-slate-700 leading-relaxed">
        Shelfie je experimentálna aplikácia vydavateľstva Albatros Media,
        ktorá pomocou fotografie knižnice analyzuje čitateľské preferencie
        a určuje čitateľský archetyp.
      </div>
    </PageFrame>
  );
}

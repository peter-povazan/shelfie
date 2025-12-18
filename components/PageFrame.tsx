import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

type PageFrameProps = {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
};

function ShelfieLogo() {
  const letter = "inline-block";
  return (
    <div className="text-2xl font-extrabold tracking-widest select-none">
      <span className="text-slate-900">#</span>
      <span className={`${letter} text-[#ea8d79]`}>S</span>
      <span className={`${letter} text-[#18b1df]`}>H</span>
      <span className={`${letter} text-[#7b9aba]`}>E</span>
      <span className={`${letter} text-[#e6a87f]`}>L</span>
      <span className={`${letter} text-[#ea8d79]`}>F</span>
      <span className={`${letter} text-[#18b1df]`}>I</span>
      <span className={`${letter} text-[#7b9aba]`}>E</span>
    </div>
  );
}

export default function PageFrame({
  title,
  subtitle,
  children,
}: PageFrameProps) {
  return (
    <main className="min-h-screen bg-[#d1d4fa] text-slate-900">
      <div className="mx-auto flex w-full max-w-md flex-col px-5 py-6">
        <section>
          <div className="p-4">
            {/* top badge */}
            <div className="flex items-center justify-between">
              <ShelfieLogo />
            </div>

            {/* title */}
            <div className="mt-6 text-2xl font-bold tracking-tight">
              {title}
            </div>

            {/* subtitle / content */}
            <div className="mt-1 text-sm font-semibold text-slate-600">
              {subtitle}
            </div>

            {/* page specific content */}
            {children}
            <div className="mt-8 flex justify-center">
              <Link
                href="/"
                className="
                  inline-flex items-center gap-2
                  text-sm font-semibold
                  text-slate-600
                  hover:text-slate-900
                  transition
                "
              >
                <ArrowLeftIcon className="h-4 w-4" />
                späť na úvod
              </Link>
            </div>

          </div>
        </section>

        {/* footer */}
        <footer className="mt-8 text-center text-sm text-slate-600">
          <div>
            <a href="/" className="hover:text-slate-900">Domov</a>
            <span className="mx-2">|</span>
            <a href="/o-projekte" className="hover:text-slate-900">O projekte</a>
            <span className="mx-2">|</span>
            <a href="/sukromie" className="hover:text-slate-900">Súkromie</a>
            <span className="mx-2">|</span>
            <a href="/podmienky" className="hover:text-slate-900">Podmienky</a>
          </div>

          <div className="mt-2 text-xs text-slate-500">
            © 2026 Albatros Media Slovakia s.r.o.
          </div>
        </footer>
      </div>
    </main>
  );
}

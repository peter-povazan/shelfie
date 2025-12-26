import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import type { Locale } from "@/lib/dict";
import { t } from "@/lib/dict";
import LocaleSwitcher from "@/components/LocaleSwitcher";

type PageFrameProps = {
  locale: Locale;
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
  locale,
  title,
  subtitle,
  children,
}: PageFrameProps) {
  const U = t(locale);

  return (
    <main className="min-h-screen bg-[#fbf5e9] text-slate-900">
      <div className="mx-auto flex w-full max-w-md flex-col px-5 py-6">
        <section>
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <ShelfieLogo />
            </div>

            {/* Title */}
            <div className="mt-6 text-2xl font-bold tracking-tight">
              {title}
            </div>

            <div className="mt-1 text-sm font-semibold text-slate-600">
              {subtitle}
            </div>

            {/* Content */}
            {children}

            {/* Back */}
            <div className="mt-8 flex justify-center">
              <Link
                href={`/${locale}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                {U.backHome}
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-slate-600">
          <div>
            <Link href={`/${locale}`} className="hover:text-slate-900">
              {U.home}
            </Link>
            <span className="mx-2">|</span>
            <Link href={`/${locale}/o-projekte`} className="hover:text-slate-900">
              {U.about}
            </Link>
            <span className="mx-2">|</span>
            <Link href={`/${locale}/sukromie`} className="hover:text-slate-900">
              {U.privacy}
            </Link>
            <span className="mx-2">|</span>
            <Link href={`/${locale}/podmienky`} className="hover:text-slate-900">
              {U.terms}
            </Link>
          </div>

          {/* Language switcher */}
          <LocaleSwitcher />

          <div className="mt-2 text-xs text-slate-500">
            © 2026 Albatros Media Slovakia s.r.o.
          </div>
        </footer>
      </div>
    </main>
  );
}

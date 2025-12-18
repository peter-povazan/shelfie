"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";

type ShelfieResult = {
  archetype: string;
  description: string;
};

type BookPick = {
  title: string;
  author?: string;
  url: string;
  cover?: string;
};

function ArchetypeSVG({ archetype }: { archetype: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <div className="text-xs uppercase tracking-widest text-slate-500">
          svg fotky archetypu
        </div>
        <div className="mt-2 text-2xl font-semibold">{archetype}</div>
        <div className="mt-2 text-sm text-slate-600">
          Sem pôjde tvoje veľké pekné SVG.
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [result, setResult] = useState<ShelfieResult | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const picks: BookPick[] = useMemo(
    () => [
      { title: "Kniha 1 (placeholder)", author: "Autor", url: "https://example.com" },
      { title: "Kniha 2 (placeholder)", author: "Autor", url: "https://example.com" },
      { title: "Kniha 3 (placeholder)", author: "Autor", url: "https://example.com" },
      { title: "Kniha 4 (placeholder)", author: "Autor", url: "https://example.com" },
      { title: "Kniha 5 (placeholder)", author: "Autor", url: "https://example.com" },
      { title: "Kniha 6 (placeholder)", author: "Autor", url: "https://example.com" },
    ],
    []
  );

  useEffect(() => {
    const raw = sessionStorage.getItem("shelfie_result");
    if (!raw) {
      window.location.href = "/";
      return;
    }
    try {
      setResult(JSON.parse(raw));
    } catch {
      window.location.href = "/";
    }
  }, []);

  async function shareStoriesCard() {
    if (!cardRef.current) return;
    setShareError(null);

    try {
      setIsSharing(true);

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        filter: (node) => {
          if (!(node instanceof HTMLElement)) return true;
          return !node.hasAttribute("data-no-export");
        },
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "shelfie-story.png", { type: "image/png" });

      const canShareFiles = !!navigator.canShare?.({ files: [file] });

      if (navigator.share && canShareFiles) {
        await navigator.share({
          files: [file],
          title: "Shelfie",
          text: "Môj čitateľský archetyp 🔥",
        });
        return;
      }

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "shelfie-story.png";
      a.click();
    } catch {
      setShareError("Nepodarilo sa vytvoriť obrázok na zdieľanie.");
    } finally {
      setIsSharing(false);
    }
  }

  if (!result) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto w-full max-w-md px-5 py-6">
        {/* SHARE CARD 9:16 */}
        <section>
          <div
            ref={cardRef}
            className="relative w-full overflow-hidden bg-white"
            style={{ aspectRatio: "9 / 16" }}
          >
            <div className="absolute inset-0">
              <div className="flex h-full flex-col p-4">
                {/* Top row */}
                <div className="flex items-center justify-between">
                  <div className="rounded-lg border-2 border-slate-900 px-3 py-1 text-xs font-semibold tracking-widest">
                    SHELFIE
                  </div>
                </div>

                {/* Title */}
                <div className="mt-5">
                  <div className="mt-1 text-2xl font-semibold">{result.archetype}</div>
                  <div className="mt-1 text-sm text-slate-600">{result.description}</div>
                </div>

                {/* Square SVG */}
                <div className="mt-5 aspect-square w-full rounded-2xl border-2 border-slate-900 bg-slate-50 p-4">
                  <ArchetypeSVG archetype={result.archetype} />
                </div>

                {/* SHARE BUTTON (UI only, excluded from export) */}
                <button
                  data-no-export
                  onClick={shareStoriesCard}
                  disabled={isSharing}
                  className="
    mt-4
    w-full
    rounded-2xl
    border-2 border-slate-900
    border-b-4 border-b-slate-900
    bg-white
    px-3 py-4
    text-sm font-bold
    transition
    active:translate-y-[2px]
    active:border-b-2
    disabled:opacity-50
                  "
                >
                  {isSharing ? "Pripravujem…" : "Zdieľať"}
                </button>

                {/* absorb remaining space */}
                <div className="mt-auto" />
              </div>
            </div>
          </div>

          {shareError && <div className="mt-3 text-sm text-red-600">{shareError}</div>}
        </section>

        {/* PICKS */}
        <section className="mt-8">
          <div className="text-base font-semibold">Knihy pre teba</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {picks.slice(0, 6).map((b, idx) => (
              <a
                key={idx}
                href={b.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-slate-200 bg-white p-3 hover:border-slate-400"
              >
                <div className="aspect-[3/4] w-full rounded-xl bg-slate-100" />
                <div className="mt-2 text-sm font-semibold">{b.title}</div>
                {b.author && <div className="mt-1 text-xs text-slate-600">{b.author}</div>}
                <div className="mt-2 text-xs font-semibold">Pozrieť →</div>
              </a>
            ))}
          </div>
        </section>

        {/* Footer links (outside card, like in your wireframes) */}
        <footer className="mt-8 text-center text-sm text-slate-600">
          <div>
            <a className="hover:text-slate-900" href="/o-projekte">
              O projekte
            </a>
            <span className="mx-2">|</span>
            <a className="hover:text-slate-900" href="/sukromie">
              Súkromie
            </a>
            <span className="mx-2">|</span>
            <a className="hover:text-slate-900" href="/podmienky">
              Podmienky
            </a>
          </div>

          <div className="mt-2 text-xs text-slate-500">
            © 2026 Albatros Media Slovakia s.r.o.
          </div>
        </footer>
      </div>
    </main>
  );
}

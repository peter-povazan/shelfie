"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import Link from "next/link";
import { ARCHETYPES, type ArchetypeKey } from "@/lib/archetypes";
import { ShareIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

type ShelfieResult = {
  archetype: string;
};

function ShelfieLogo() {
  const letter = "inline-block";
  return (
    <div className="text-2xl font-extrabold tracking-widest select-none whitespace-nowrap leading-none">
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

function getCopy(archetype: string) {
  if (archetype in ARCHETYPES) return ARCHETYPES[archetype as ArchetypeKey];
  return ARCHETYPES["Bezkniznik"];
}

/**
 * Placeholder pre “WEBP grafiku archetypu” – úmyselne je to “plocha” (štvorec),
 * nie iba malý badge. Neskôr sem dáš reálny <img src="...webp" />
 */
function ArchetypeWebpPanel({ title }: { title: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center p-6 text-center">
      <div>
        <div className="text-xs font-extrabold tracking-widest text-white/85">
          WEBP GRAFIKA
        </div>
        <div className="mt-2 text-2xl font-extrabold text-white">{title}</div>
      </div>
    </div>
  );
}

export default function Result2Page() {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [result, setResult] = useState<ShelfieResult | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("shelfie_result");
    const p = sessionStorage.getItem("shelfie_photo");

    if (!raw) {
      window.location.href = "/";
      return;
    }
    try {
      const parsed = JSON.parse(raw) as ShelfieResult;
      if (!parsed?.archetype) {
        window.location.href = "/";
        return;
      }
      setResult(parsed);
      if (p) setPhoto(p);
    } catch {
      window.location.href = "/";
    }
  }, []);

  async function makeCardPng(): Promise<{ dataUrl: string; file: File }> {
    if (!cardRef.current) throw new Error("Missing card ref");

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
    return { dataUrl, file };
  }

  async function share() {
    if (isWorking) return;
    setToast(null);

    try {
      setIsWorking(true);
      const { file, dataUrl } = await makeCardPng();
      const canShareFiles = !!navigator.canShare?.({ files: [file] });

      if (navigator.share && canShareFiles) {
        await navigator.share({
          files: [file],
          title: "Shelfie",
          text: "Môj knihotyp 🔥",
        });
        setToast("Pripravené na zdieľanie 👌");
        return;
      }

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "shelfie-story.png";
      a.click();
      setToast("Stiahnuté ako PNG ✅");
    } catch {
      setToast("Nepodarilo sa pripraviť obrázok. Skús znova.");
    } finally {
      setIsWorking(false);
    }
  }

  async function download() {
    if (isWorking) return;
    setToast(null);

    try {
      setIsWorking(true);
      const { dataUrl } = await makeCardPng();
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "shelfie-story.png";
      a.click();
      setToast("Stiahnuté ako PNG ✅");
    } catch {
      setToast("Nepodarilo sa stiahnuť obrázok. Skús znova.");
    } finally {
      setIsWorking(false);
    }
  }

  if (!result) return null;
  const copy = getCopy(result.archetype);

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
                {/* LOGO center */}
                <div className="grid grid-cols-3 items-center">
                  <div />
                  <div className="flex justify-center">
                    <ShelfieLogo />
                  </div>
                  <div />
                </div>

                {/* FOTO – štvorec s rovnakým border/radius ako homepage */}
                <div
                  className="
                    mt-6
                    aspect-square w-full
                    overflow-hidden
                    rounded-2xl
                    border-2 border-[#9393bc]
                    bg-slate-100
                  "
                >
                  {photo ? (
                    <img
                      src={photo}
                      alt=""
                      className="h-full w-full object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
                      (Sem pôjde fotka knižnice)
                    </div>
                  )}
                </div>

                {/* WEBP “plocha” (štvorec) – rovno pod fotkou, s jednotným štýlom */}
                <div
                  className="
                    mt-5
                    aspect-square w-full
                    overflow-hidden
                    rounded-2xl
                    border-2 border-[#9393bc]
                    bg-slate-700
                  "
                >
                  <ArchetypeWebpPanel title={copy.title} />
                </div>

                {/* Text */}
                <div className="mt-5 text-center">
                  <div className="text-2xl font-extrabold">{copy.title}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {copy.description}
                  </div>
                </div>

                {/* CTA */}
                <div data-no-export className="mt-6">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={share}
                      disabled={isWorking}
                      className="
                        flex items-center justify-center gap-2
                        w-full cursor-pointer rounded-2xl
                        border-2 border-[#8d5d5d]
                        border-b-4 border-[#64393e]
                        bg-[#ea8d79]
                        px-4 py-3
                        text-sm font-extrabold
                        transition
                        active:translate-y-[2px]
                        active:border-b-2
                        active:bg-[#c57e6e]
                        text-white
                        disabled:opacity-50
                      "
                    >
                      <ShareIcon className="h-6 w-6 stroke-[2.3] text-white" />
                      {isWorking ? "Pripravujem…" : "Zdieľať"}
                    </button>

                    <button
                      onClick={download}
                      disabled={isWorking}
                      className="
                        flex items-center justify-center gap-2
                        w-full cursor-pointer rounded-2xl
                        border-2 border-[#515d7e]
                        border-b-4 border-[#384361]
                        bg-[#18b1df]
                        px-4 py-3
                        text-sm font-extrabold
                        transition
                        active:translate-y-[2px]
                        active:border-b-2
                        active:bg-[#1a9dc5]
                        text-white
                        disabled:opacity-50
                      "
                    >
                      <ArrowDownTrayIcon className="h-6 w-6 stroke-[2.3] text-white" />
                      {isWorking ? "Pripravujem…" : "Stiahnuť"}
                    </button>
                  </div>

                  {toast && (
                    <div className="mt-3 text-center text-sm text-slate-700">
                      {toast}
                    </div>
                  )}

                  <div className="mt-3 text-center">
                    <a
                      href="/"
                      className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                    >
                      Urobiť ďalšiu Shelfie →
                    </a>
                  </div>
                </div>

                <div className="mt-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* Footer links (mimo export) */}
        <footer className="mt-8 text-center text-sm text-slate-600">
          <div>
            <Link className="hover:text-slate-900" href="/o-projekte">
              O projekte
            </Link>
            <span className="mx-2">|</span>
            <Link className="hover:text-slate-900" href="/sukromie">
              Súkromie
            </Link>
            <span className="mx-2">|</span>
            <Link className="hover:text-slate-900" href="/podmienky">
              Podmienky
            </Link>
          </div>

          <div className="mt-2 text-xs text-slate-500">
            © 2026 Albatros Media Slovakia s.r.o.
          </div>
        </footer>
      </div>
    </main>
  );
}

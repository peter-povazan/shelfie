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

function getCopy(archetype: string) {
  if (archetype in ARCHETYPES) return ARCHETYPES[archetype as ArchetypeKey];
  return ARCHETYPES["Bezkniznik"];
}

function normalizeArchetypeKey(archetype: string): ArchetypeKey {
  if (archetype in ARCHETYPES) return archetype as ArchetypeKey;
  return "Bezkniznik";
}

// ✅ uprav si len toto, ak máš inú cestu/názvy
function getArchetypeImageSrc(archetype: string) {
  const key = normalizeArchetypeKey(archetype);
  return `/assets/home.webp`;
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
  const pageBg = copy.theme.pageBg ?? "transparent";
  const archetypeImg = copy.theme.imageSrc ?? "/assets/home.webp";

  const cameraBtnClass = `
    flex items-center justify-center gap-2
    w-full cursor-pointer rounded-2xl
    border-2 border-[#8d5d5d] border-b-4 border-[#64393e]
    bg-[#ea8d79]
    px-3 py-3 text-m font-semibold
    transition
    active:translate-y-[2px] active:border-b-2 active:bg-[#c57e6e]
    text-white
    disabled:opacity-50
  `;

  const galleryBtnClass = `
    flex items-center justify-center gap-2
    w-full cursor-pointer rounded-2xl
    border-2 border-[#515d7e] border-b-4 border-[#384361]
    bg-[#18b1df]
    px-3 py-3 text-m font-semibold
    transition
    active:translate-y-[2px] active:border-b-2 active:bg-[#1a9dc5]
    text-white
    disabled:opacity-50
  `;

  return (
    <main
  className="min-h-screen text-slate-900"
  style={{ backgroundColor: copy.theme.pageBg }}
>

      <div className="mx-auto w-full max-w-md px-5 py-6">
        <section>
          {/* EXPORTOVATEĽNÁ „STORY“ KARTA */}
          <div
            ref={cardRef}
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "9 / 16",
              backgroundColor: copy.theme.pageBg ?? "#ffffff", // ✅ toto je kľúč
            }}
          >
            <div className="absolute inset-0">
              <div className="flex h-full flex-col px-4 pt-4 pb-5">
                {/* LOGO V STREDE */}
                <div className="flex items-center justify-center">
                  <ShelfieLogo />
                </div>

                {/* FOTO ŠTVOREC (rovnaký radius/border ako homepage) */}
                <div className="relative mt-4">
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-[#9393bc] bg-slate-50">
                    {photo ? (
                      <img
                        src={photo}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src="/assets/home.webp"
                        alt=""
                        className="h-full w-full object-contain"
                        loading="eager"
                      />
                    )}
                  </div>

                  {/* Wepb image - Knihotyp */}
                  <div className="absolute inset-x-0 top-full -translate-y-[75%] px-0">
                    <div className="h-48 w-full overflow-hidden">
                      <img
                        src={archetypeImg}
                        alt=""
                        className="h-full w-full object-contain"
                        loading="eager"
                      />
                    </div>
                  </div>
                </div>

                {/* TEXTY (trochu vyššie) */}
                <div className="mt-16 text-center">
                  <div className="text-2xl font-bold tracking-tight">
                    {copy.title}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-600">
                    {copy.description}
                  </div>
                </div>

                {/* CTA + ďalšia shelfie neexportovať */}
                <div data-no-export className="mt-5">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={share}
                      disabled={isWorking}
                      className={cameraBtnClass}
                    >
                      <ShareIcon className="h-7 w-7 stroke-[2]" />
                      {isWorking ? "Pripravujem…" : "Zdieľať"}
                    </button>

                    <button
                      onClick={download}
                      disabled={isWorking}
                      className={galleryBtnClass}
                    >
                      <ArrowDownTrayIcon className="h-7 w-7 stroke-[2]" />
                      Stiahnuť
                    </button>
                  </div>

                  {toast && (
                    <div className="mt-2 text-center text-sm text-slate-700">
                      {toast}
                    </div>
                  )}

                  <div className="mt-3 text-center">
                    <Link
                      href="/"
                      className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                    >
                      Urobiť ďalšiu Shelfie →
                    </Link>
                  </div>
                </div>

                <div className="flex-1" />
              </div>
            </div>
          </div>
        </section>

        {/* STRÁNKOVÝ FOOTER */}
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

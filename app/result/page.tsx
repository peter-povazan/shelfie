"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import Link from "next/link";
import { ARCHETYPES, type ArchetypeKey } from "@/lib/archetypes";
import { ShareIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

type ShelfieResult = {
  archetype: string;
  vibe?: number; // 1–5
};

function ShelfieLogo() {
  const letter = "inline-block";
  return (
    <div className="text-base font-extrabold tracking-widest select-none">
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

function StarsCompact({ value }: { value: number }) {
  const v = Math.max(1, Math.min(5, Math.round(value || 1)));
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < v;
        return (
          <svg
            key={i}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className={filled ? "opacity-100" : "opacity-25"}
            aria-hidden="true"
          >
            <path
              d="M12 17.27l-5.18 3.06 1.39-5.96L3 9.24l6.09-.52L12 3l2.91 5.72 6.09.52-5.21 5.13 1.39 5.96L12 17.27z"
              fill="currentColor"
            />
          </svg>
        );
      })}
    </div>
  );
}

function normalizeArchetypeKey(archetype: string): ArchetypeKey {
  if (archetype in ARCHETYPES) return archetype as ArchetypeKey;
  return "Bezkniznik";
}

function getCopy(archetype: string) {
  const key = normalizeArchetypeKey(archetype);
  return ARCHETYPES[key];
}

/** fallback, keby neboli assety */
function getArchetypeFallbackImageSrc() {
  return `/assets/home.webp`;
}

/* -----------------------------
   Dominant hue → HSV(h, 12%, 95%) → RGB background
------------------------------ */
function rgbToHsv(r: number, g: number, b: number) {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;

  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === rr) h = ((gg - bb) / d) % 6;
    else if (max === gg) h = (bb - rr) / d + 2;
    else h = (rr - gg) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : d / max;
  const v = max;

  return { h, s, v };
}

function hsvToRgb(h: number, s: number, v: number) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let rr = 0,
    gg = 0,
    bb = 0;

  if (h >= 0 && h < 60) [rr, gg, bb] = [c, x, 0];
  else if (h >= 60 && h < 120) [rr, gg, bb] = [x, c, 0];
  else if (h >= 120 && h < 180) [rr, gg, bb] = [0, c, x];
  else if (h >= 180 && h < 240) [rr, gg, bb] = [0, x, c];
  else if (h >= 240 && h < 300) [rr, gg, bb] = [x, 0, c];
  else [rr, gg, bb] = [c, 0, x];

  return {
    r: Math.round((rr + m) * 255),
    g: Math.round((gg + m) * 255),
    b: Math.round((bb + m) * 255),
  };
}

async function extractDominantHue(dataUrl: string): Promise<number | null> {
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = dataUrl;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Image load failed"));
    });

    const size = 40;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(img, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);

    let sumX = 0;
    let sumY = 0;
    let sumW = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a < 200) continue;

      const { h, s, v } = rgbToHsv(r, g, b);

      if (v < 0.18) continue;
      if (v > 0.98 && s < 0.12) continue;
      if (s < 0.08) continue;

      const w = s * v;
      const rad = (h * Math.PI) / 180;

      sumX += Math.cos(rad) * w;
      sumY += Math.sin(rad) * w;
      sumW += w;
    }

    if (sumW === 0) return null;

    const avgRad = Math.atan2(sumY / sumW, sumX / sumW);
    let avgDeg = (avgRad * 180) / Math.PI;
    if (avgDeg < 0) avgDeg += 360;

    return avgDeg;
  } catch {
    return null;
  }
}

/* -----------------------------
   ✅ Random sticker per RESULT (stable), new random when you do new shelfie
------------------------------ */
function getOrCreateRunId() {
  const k = "shelfie_run_id";
  const existing = sessionStorage.getItem(k);
  if (existing) return existing;
  const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  sessionStorage.setItem(k, id);
  return id;
}

function pickStableStickerForRun(archetypeKey: string, count: number) {
  if (count <= 1) return 0;
  const runId = getOrCreateRunId();
  const storageKey = `shelfie_sticker_idx_${runId}_${archetypeKey}`;

  const raw = sessionStorage.getItem(storageKey);
  if (raw != null) {
    const n = Number(raw);
    if (Number.isFinite(n) && n >= 0 && n < count) return n;
  }

  const idx = Math.floor(Math.random() * count);
  sessionStorage.setItem(storageKey, String(idx));
  return idx;
}

export default function Result2Page() {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [result, setResult] = useState<ShelfieResult | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [pageBg, setPageBg] = useState<string | null>(null);
  const [stickerIndex, setStickerIndex] = useState<number>(0);

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

  // background color from photo
  useEffect(() => {
    let alive = true;

    (async () => {
      if (!photo) {
        setPageBg(null);
        return;
      }
      const hue = await extractDominantHue(photo);
      if (!alive) return;

      if (hue == null) {
        setPageBg(null);
        return;
      }

      const { r, g, b } = hsvToRgb(hue, 0.12, 0.95);
      setPageBg(`rgb(${r}, ${g}, ${b})`);
    })();

    return () => {
      alive = false;
    };
  }, [photo]);

  // ✅ choose sticker once per run + archetype
  useEffect(() => {
    if (!result) return;

    const key = normalizeArchetypeKey(result.archetype);
    const meta = ARCHETYPES[key];
    const list = meta.theme.imageSrcs; // ✅ only this
    const count = list.length || 1;

    const idx = pickStableStickerForRun(key, count);
    setStickerIndex(idx);
  }, [result]);

  async function makeCardPng(): Promise<{ dataUrl: string; file: File }> {
    if (!cardRef.current) throw new Error("Missing card ref");
    const root = cardRef.current;

    const exportOnly = Array.from(root.querySelectorAll<HTMLElement>("[data-export-only]"));
    const prev = exportOnly.map((el) => ({
      el,
      opacity: el.style.opacity,
      visibility: el.style.visibility,
    }));

    exportOnly.forEach((el) => {
      el.style.opacity = "1";
      el.style.visibility = "visible";
    });

    try {
      const dataUrl = await toPng(root, {
        cacheBust: true,
        pixelRatio: 2,
        filter: (node) => {
          if (!(node instanceof HTMLElement)) return true;
          if (node.hasAttribute("data-no-export")) return false;
          return true;
        },
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "shelfie-story.png", { type: "image/png" });
      return { dataUrl, file };
    } finally {
      prev.forEach(({ el, opacity, visibility }) => {
        el.style.opacity = opacity;
        el.style.visibility = visibility;
      });
    }
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
          text: "#SHELFIE 📚",
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

  const key = normalizeArchetypeKey(result.archetype);
  const copy = getCopy(key);

  const motive = copy.motif; // ✅ no defaultMotive anymore
  const insight =
    copy.insight ??
    (copy.description.split(". ").slice(0, 1).join(". ").trim() + (copy.description.includes(".") ? "." : ""));

  const list = copy.theme.imageSrcs;
  const archetypeImg =
    list.length > 0 ? list[Math.min(stickerIndex, list.length - 1)] : getArchetypeFallbackImageSrc();

  const vibe = Math.max(1, Math.min(5, Math.round(result.vibe ?? (key === "Bezkniznik" ? 1 : 3))));
  const effectiveBg = pageBg ?? "#ffffff";
  const archetypeColor = copy.theme.pageBg ?? "#000000";

  const cameraBtnClass = `
    flex items-center justify-center gap-2
    w-full cursor-pointer rounded-2xl
    border-2 border-[#8d5d5d] border-b-4 border-[#64393e]
    bg-[#ea8d79]
    px-3 py-3 text-base font-semibold
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
    px-3 py-3 text-base font-semibold
    transition
    active:translate-y-[2px] active:border-b-2 active:bg-[#1a9dc5]
    text-white
    disabled:opacity-50
  `;

  const labelClass = "text-[10px] font-extrabold uppercase tracking-wider italic text-white/95";

  function resetForNextShelfie() {
    sessionStorage.removeItem("shelfie_run_id");
  }

  return (
    <main className="min-h-screen text-slate-900" style={{ backgroundColor: effectiveBg }}>
      <style jsx global>{`
        [data-export-only] {
          opacity: 0;
          visibility: hidden;
        }
      `}</style>

      <div className="mx-auto w-full max-w-md px-5 py-6">
        <section>
          <div
            ref={cardRef}
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "9 / 16",
              backgroundColor: effectiveBg,
            }}
          >
            <div className="absolute inset-0">
              <div className="flex h-full flex-col px-4 pb-5">
                <div className="flex items-center justify-center">
                  <ShelfieLogo />
                </div>

                <div className="relative mt-4">
                  {/* FOTO */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-50">
                    {photo ? (
                      <img src={photo} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <img src="/assets/home.webp" alt="" className="h-full w-full object-contain" loading="eager" />
                    )}

                    <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/25 to-transparent" />

                    <div className="absolute inset-x-0 top-0 p-3">
                      <div className="flex justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="inline-flex rounded-[8px] bg-[#e7945df2] px-3 py-2 shadow-sm backdrop-blur">
                            <div className="flex items-center gap-2">
                              <div className={labelClass}>Book vibe</div>
                              <div className="text-white">
                                <StarsCompact value={vibe} />
                              </div>
                            </div>
                          </div>

                          {/* ✅ motif label background = pageBg */}
                          <div
                            className="inline-flex rounded-[8px] px-3 py-2 shadow-sm backdrop-blur"
                            style={{ backgroundColor: copy.theme.pageBg }}
                          >
                            <div className={labelClass}>{motive}</div>
                          </div>

                          {/* ✅ debug (len pre test, môžeš potom zmazať) */}
                          <div className="text-[11px] font-semibold text-white/80">
                            {key} • {stickerIndex + 1}/{Math.max(1, list.length)} • {archetypeImg}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STICKER */}
                  <div className="absolute inset-x-0 top-full -translate-y-[85%] px-0">
                    <div className="h-56 w-full overflow-hidden">
                      <img src={archetypeImg} alt="" className="h-full w-full object-contain" loading="eager" />
                    </div>
                  </div>
                </div>

                {/* DOLE */}
                <div className="mt-10 text-center">
                  <div
                    className="inline-block rounded-[8px] bg-slate-100 px-2 py-1 text-2xl font-extrabold tracking-wide"
                    style={{ color: archetypeColor }}
                  >
                    {copy.title}
                  </div>

                  <div className="mt-2 text-base font-normal tracking-normal text-slate-700">{insight}</div>
                </div>

                <div data-no-export className="mt-6">
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={share} disabled={isWorking} className={cameraBtnClass}>
                      <ShareIcon className="h-7 w-7 stroke-[2]" />
                      {isWorking ? "Pripravujem…" : "Zdieľať"}
                    </button>

                    <button onClick={download} disabled={isWorking} className={galleryBtnClass}>
                      <ArrowDownTrayIcon className="h-7 w-7 stroke-[2]" />
                      Stiahnuť
                    </button>
                  </div>

                  {toast && <div className="mt-2 text-center text-sm text-slate-700">{toast}</div>}

                  <div className="mt-3 text-center">
                    <Link
                      href="/"
                      onClick={resetForNextShelfie}
                      className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                    >
                      Urobiť ďalšiu Shelfie →
                    </Link>
                  </div>
                </div>

                <div className="flex-1" />
              </div>
            </div>

            {/* EXPORT-ONLY watermark */}
            <div data-export-only className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-6">
              <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white/70 to-transparent" />
              <div className="relative flex items-center justify-between text-[11px] font-extrabold tracking-wider text-slate-900/80">
                <span>#SHELFIE</span>
                <span>shelfie.albatrosmedia.app</span>
              </div>
            </div>
          </div>
        </section>

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

          <div className="mt-2 text-xs text-slate-500">© 2026 Albatros Media Slovakia s.r.o.</div>
        </footer>
      </div>
    </main>
  );
}

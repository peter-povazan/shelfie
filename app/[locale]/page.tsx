// app/[locale]/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CameraIcon, PhotoIcon, ArrowPathIcon, SparklesIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { compressImageFile } from "@/lib/compressImage";
import { idbSetBlob, idbDel } from "@/lib/photoStore";
import { t as T } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";
import LocaleSwitcher from "@/components/LocaleSwitcher";

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

async function getImageDims(file: File): Promise<{ width: number; height: number }> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Failed to load image"));
      el.src = url;
    });
    return { width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function AnalyzingLabel({ text }: { text: string }) {
  return (
    <span className="flex items-center justify-center gap-2">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/60 border-t-white" />
      <span className="relative">
        {text}
        <span className="inline-flex w-6 justify-start">
          <span className="animate-[dot_1.2s_infinite]">.</span>
          <span className="animate-[dot_1.2s_infinite] [animation-delay:0.2s]">.</span>
          <span className="animate-[dot_1.2s_infinite] [animation-delay:0.4s]">.</span>
        </span>
      </span>

      <style jsx>{`
        @keyframes dot {
          0%,
          20% {
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
}

export default function Home() {
  const router = useRouter();
  const params = useParams<{ locale: Locale }>();
  const locale: Locale = (params?.locale as Locale) ?? "sk";
  const U = T(locale);

  const isDev = process.env.NODE_ENV !== "production";

  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lastSource, setLastSource] = useState<"camera" | "gallery">("camera");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const hasPhoto = Boolean(file && previewUrl);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function pick(f?: File, source?: "camera" | "gallery") {
    if (!f) return;
    if (!f.type.startsWith("image/")) return;
    if (isAnalyzing) return;

    if (source) setLastSource(source);

    if (isDev) console.log("ORIGINAL:", { type: f.type, sizeKB: Math.round(f.size / 1024), name: f.name });

    let out: File = f;
    try {
      out = await compressImageFile(f, { maxSide: 1600, quality: 0.82, mimeType: "image/jpeg" });
    } catch (e) {
      if (isDev) console.warn("compressImageFile failed, using original", e);
    }

    if (isDev) {
      const dims = await getImageDims(out);
      console.log("TO UPLOAD:", { type: out.type, sizeKB: Math.round(out.size / 1024), name: out.name, dims: `${dims.width}x${dims.height}` });
    }

    try {
      await idbSetBlob("shelfie_photo_blob", out);
      sessionStorage.removeItem("shelfie_photo");
    } catch (e) {
      if (isDev) console.warn("Failed to store photo in IndexedDB", e);
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(out);
    setPreviewUrl(URL.createObjectURL(out));
  }

  function openCamera() {
    if (isAnalyzing) return;
    setLastSource("camera");
    cameraInputRef.current?.click();
  }

  function openGallery() {
    if (isAnalyzing) return;
    setLastSource("gallery");
    galleryInputRef.current?.click();
  }

  async function clearPhoto() {
    if (isAnalyzing) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFile(null);

    sessionStorage.removeItem("shelfie_photo");
    try {
      await idbDel("shelfie_photo_blob");
    } catch (e) {
      if (isDev) console.warn("Failed to delete photo from IndexedDB", e);
    }

    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  }

  async function analyze() {
    if (!file || isAnalyzing) return;

    try {
      setIsAnalyzing(true);

      const fd = new FormData();
      fd.append("image", file);

      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.log("ANALYZE FAILED:", res.status, text);
        alert(`Analýza zlyhala (${res.status})`);
        return;
      }

      const data = await res.json();
      sessionStorage.setItem("shelfie_result", JSON.stringify(data));
      router.push(`/${locale}/result`);
    } finally {
      setIsAnalyzing(false);
    }
  }

  const cameraBtnClass = `
    flex items-center justify-center gap-2 w-full cursor-pointer rounded-2xl
    border-2 border-[#8d5d5d] border-b-4 border-[#64393e]
    bg-[#ea8d79] px-2 py-2 text-m font-semibold transition
    active:translate-y-[2px] active:border-b-2 active:bg-[#c57e6e]
    text-white
  `;

  const galleryBtnClass = `
    flex items-center justify-center gap-2 w-full cursor-pointer rounded-2xl
    border-2 border-[#515d7e] border-b-4 border-[#384361]
    bg-[#18b1df] px-2 py-2 text-m font-semibold transition
    active:translate-y-[2px] active:border-b-2 active:bg-[#1a9dc5]
    text-white
  `;

  const analyzeBtnClass = `
    ${lastSource === "gallery" ? galleryBtnClass : cameraBtnClass}
    ${isAnalyzing ? "opacity-80 cursor-not-allowed" : ""}
  `;

  return (
    <main className="min-h-screen bg-[#fbf5e9] text-slate-900">
      <div className="mx-auto flex w-full max-w-md flex-col px-5 py-6">
        <section>
          <div className="p-4">
            <div className="flex items-center justify-center">
              <ShelfieLogo />
            </div>

            <div className="mt-6 text-center">
              <span className="inline-block bg-[#ffffff] px-2 py-1 rounded-[8px] text-2xl font-extrabold tracking-tight text-[#c88a5f]">
                {U.heroTitle}
              </span>
              <div className="mt-2 text-base font-normal tracking-normal text-slate-700">{U.heroSubtitle}</div>
            </div>

            <div
              className="relative mt-5 aspect-square w-full overflow-hidden rounded-xl border-2 border-[#dfd6ba]"
              style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.05)" }}
            >
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Selected photo" className="h-full w-full object-cover" />
                  <button
                    onClick={clearPhoto}
                    disabled={isAnalyzing}
                    className="absolute right-3 top-3 rounded-full border border-slate-900 bg-white/90 px-3 py-1 text-xs font-semibold shadow-sm disabled:opacity-50"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <img src="/assets/home3.webp" alt="" className="h-full w-full object-contain" loading="eager" />
              )}
            </div>

            <div className="mt-5">
              {!hasPhoto ? (
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={openCamera} className={cameraBtnClass} disabled={isAnalyzing}>
                    <CameraIcon className="h-8 w-8 stroke-[1.5]" />
                  </button>
                  <button onClick={openGallery} className={galleryBtnClass} disabled={isAnalyzing}>
                    <PhotoIcon className="h-8 w-8 stroke-[1.5]" />
                  </button>
                </div>
              ) : (
                <button onClick={analyze} disabled={isAnalyzing} className={analyzeBtnClass}>
                  {isAnalyzing ? (
                    <AnalyzingLabel text={U.analyzing} />
                  ) : (
                    <>
                      <SparklesIcon className="h-8 w-8 stroke-[1.2]" />
                      <span className="uppercase tracking-wide">{U.cta}</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="mt-3 text-center text-xs text-slate-500">
              <span className="font-semibold">{U.tip}</span> {U.tipText}
            </div>
          </div>
        </section>

        <footer className="mt-8 text-center text-sm text-slate-600">
          <div>
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

          <div className="mt-2 text-xs text-slate-500">© 2026 Albatros Media Slovakia s.r.o.</div>
        </footer>
      </div>

      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => pick(e.target.files?.[0], "camera")} />
      <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0], "gallery")} />
    </main>
  );
}

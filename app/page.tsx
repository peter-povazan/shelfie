"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CameraIcon,
  PhotoIcon,
  ArrowPathIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { compressImageFile } from "@/lib/compressImage";

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

export default function Home() {
  const router = useRouter();

  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lastSource, setLastSource] = useState<"camera" | "gallery">("camera");

  const hasPhoto = Boolean(file && previewUrl);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function pick(f?: File, source?: "camera" | "gallery") {
    if (!f) return;
    if (!f.type.startsWith("image/")) return;

    if (source) setLastSource(source);

    // ⬇️ KOMPRESIA
    const compressed = await compressImageFile(f, {
      maxSide: 1600,
      quality: 0.82,
      mimeType: "image/jpeg",
    });

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setFile(compressed);
    setPreviewUrl(URL.createObjectURL(compressed));
  }

  function openCamera() {
    setLastSource("camera");
    cameraInputRef.current?.click();
  }

  function openGallery() {
    setLastSource("gallery");
    galleryInputRef.current?.click();
  }

  function clearPhoto() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFile(null);

    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  }

  async function analyze() {
    if (!file) return;

    const fd = new FormData();
    fd.append("image", file);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      alert("Analýza zlyhala");
      return;
    }

    const data = await res.json();
    sessionStorage.setItem("shelfie_result", JSON.stringify(data));
    router.push("/result");
  }

  const cameraBtnClass = `
    flex items-center justify-center gap-2
    w-full
    cursor-pointer
    rounded-2xl
    border-2 border-[#8d5d5d]
    border-b-4 border-[#64393e]
    bg-[#ea8d79]
    px-2 py-2
    text-m font-bold
    transition
    active:translate-y-[2px]
    active:border-b-2
    active:bg-[#c57e6e]
    text-white
  `;

  const galleryBtnClass = `
    flex items-center justify-center gap-2
    w-full
    cursor-pointer
    rounded-2xl
    border-2 border-[#515d7e]
    border-b-4 border-[#384361]
    bg-[#18b1df]
    px-2 py-2
    text-m font-bold
    transition
    active:translate-y-[2px]
    active:border-b-2
    active:bg-[#1a9dc5]
    text-white
  `;

  return (
    <main className="min-h-screen bg-[#d1d4fa] text-slate-900">
      <div className="mx-auto flex w-full max-w-md flex-col px-5 py-6">
        <section>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <ShelfieLogo />
            </div>

            <div className="mt-6 text-2xl font-bold tracking-tight">
              Odfoť si poličku
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-600">
              a spoznaj svoj knihotyp
            </div>

            <div className="relative mt-5 aspect-square w-full overflow-hidden rounded-2xl border-2 border-[#9393bc]">
              {previewUrl ? (
                <>
                  <img
                    src={previewUrl}
                    alt="Vybraná fotka"
                    className="h-full w-full object-cover"
                  />

                  <button
                    onClick={clearPhoto}
                    className="absolute right-3 top-3 rounded-full border border-slate-900 bg-white/90 px-3 py-1 text-xs font-semibold shadow-sm"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <img
                  src="/assets/home.webp"
                  alt=""
                  className="h-full w-full object-contain"
                  loading="eager"
                />
              )}
            </div>

            <div className="mt-5">
              {!hasPhoto ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={openCamera}
                    className={cameraBtnClass}
                  >
                    <CameraIcon className="h-8 w-8" />
                  </button>

                  <button
                    onClick={openGallery}
                    className={galleryBtnClass}
                  >
                    <PhotoIcon className="h-8 w-8" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={analyze}
                  className={
                    lastSource === "gallery"
                      ? galleryBtnClass
                      : cameraBtnClass
                  }
                >
                  <SparklesIcon className="h-8 w-8" />
                  ZISTI MÔJ KNIHOTYP
                </button>
              )}
            </div>

            <div className="mt-3 text-center text-xs text-slate-500">
              <span className="font-semibold">TIP:</span> čitateľné chrbty kníh,
              bez odlesku a s dobrým svetlom.
            </div>
          </div>
        </section>

          <footer className="mt-8 text-center text-sm text-slate-600">
            <div>
              <Link href="/o-projekte" className="hover:text-slate-900">
                O projekte
              </Link>
              <span className="mx-2">|</span>
              <Link href="/sukromie" className="hover:text-slate-900">
                Súkromie
              </Link>
              <span className="mx-2">|</span>
              <Link href="/podmienky" className="hover:text-slate-900">
                Podmienky
              </Link>
            </div>

            <div className="mt-2 text-xs text-slate-500">
              © 2026 Albatros Media Slovakia s.r.o.
            </div>
          </footer>

      </div>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0], "camera")}
      />

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0], "gallery")}
      />
    </main>
  );
}

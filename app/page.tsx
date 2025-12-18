"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CameraIcon, PhotoIcon, ArrowPathIcon, SparklesIcon } from "@heroicons/react/24/outline";

function PlaceholderSVG() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
      <div className="mb-4 h-14 w-14 rounded-2xl border-2 border-slate-300" />
      <div className="text-sm font-semibold">MIESTO PRE SVG GRAFIKU</div>
      <div className="mt-2 max-w-xs text-sm text-slate-600">
        Po nahratí fotky sa SVG schová a zobrazí sa fotka + malé tlačidlo{" "}
        <span className="font-semibold">Zmeniť</span>.
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();

  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const hasPhoto = Boolean(file && previewUrl);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function pick(f?: File) {
    if (!f) return;
    if (!f.type.startsWith("image/")) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  function openCamera() {
    cameraInputRef.current?.click();
  }

  function openGallery() {
    galleryInputRef.current?.click();
  }

  function clearPhoto() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFile(null);

    // reset inputov aby šlo vybrať aj ten istý súbor znova
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  }

  async function analyze() {
    // TODO: neskôr sem príde reálne API volanie (upload → backend → GPT)
    const mock = {
      archetype: "Gamer",
      description: "Hľadáš napätie, tempo a svet, ktorý ťa vtiahne. Čítaš ako hráš: naplno.",
    };

    sessionStorage.setItem("shelfie_result", JSON.stringify(mock));
    router.push("/result");
  }

  return (
    <main className="min-h-screen bg-[#d1d4fa] text-slate-900">
      <div className="mx-auto flex w-full max-w-md flex-col px-5 py-6">
        {/* ONE unified frame – styled like results */}
        <section>
          <div>
            <div className="p-4">
              {/* top row */}
              <div className="flex items-center justify-between">
                <div className="rounded-lg border-2 border-slate-900 px-3 py-1 text-xs font-semibold tracking-widest">
                  #SHELFIE
                </div>
              </div>

              {/* label + intro */}
              <div className="mt-6 text-2xl font-bold tracking-tight">
                Odfoť si poličku
              </div>
              <div className="font-semibold mt-1 text-sm text-slate-600">
                a spoznaj svoj knihotyp
              </div>

              {/* big frame */}
              <div className="relative mt-5 aspect-square w-full overflow-hidden rounded-2xl border-2 border-[#9393bc]">
                {previewUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
                  <div className="flex h-full items-center justify-center">
                    <img
                      src="/assets/home.webp"
                      alt=""
                      className="block h-full w-full object-contain"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                )}
              </div>

              {/* actions (same place as result share button area, but inside card) */}
              <div className="mt-5">
                {!hasPhoto ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={openCamera}
                      className="
    flex items-center justify-center gap-2
    cursor-pointer                  
    rounded-2xl
    border-2 border-[#8d5d5d]
    border-b-4 border-[#64393e]
    bg-[#ea8d79]
    px-2 py-2
    text-sm font-bold
    transition
    active:translate-y-[2px]
    active:border-b-2
    active:bg-[#c57e6e]
    text-white
    "
                    >
                      <CameraIcon className="h-8 w-8" />
                    </button>
                    <button
                      onClick={openGallery}
                      className="
    flex items-center justify-center gap-2
    cursor-pointer                  
    rounded-2xl
    border-2 border-[#515d7e]
    border-b-4 border-[#384361]
    bg-[#18b1df]
    px-2 py-2
    text-sm font-bold
    transition
    active:translate-y-[2px]
    active:border-b-2
    active:bg-[#5b7da3]
    text-white
    "
                    >
                      <PhotoIcon className="h-8 w-8" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={analyze}
                    className="
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
    active:bg-[#5b7da3]
    text-white
                    "
                  >
                      <SparklesIcon className="h-8 w-8" /> ZISTI MÔJ KNIHOTYP
                  </button>
                )}

              </div>

              {/* TIP under buttons */}
              <div className="mt-3 text-center text-xs text-slate-500">
                <span className="font-semibold">TIP:</span>{" "}
                čitateľné chrbty kníh, bez odlesku a s dobrým svetlom.
              </div>

            </div>
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

      {/* Hidden inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />
    </main>
  );
}

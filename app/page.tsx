"use client";

import { useMemo, useState } from "react";

type ReaderProfile = {
  genres: string[];
  themes: string[];
  audience: string | null;
  language: string | null;
  vibe: string | null;
};

type Pick = {
  ean?: string;
  title?: string;
  brand?: string;
  category?: string;
  tagline?: string;
  blurb?: string;
  audience?: string;
  language?: string;
  tags?: string[];
};

type RecommendResult = {
  has_books: boolean;
  needs_better_photo: boolean;
  photo_tips: string[];

  reader_profile: ReaderProfile;
  picks: Pick[];
  rationale: string[];
  debug?: any;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  function resetAll() {
    setFile(null);
    setResult(null);
    setError(null);
    setLoading(false);
  }

  async function onAnalyze() {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/recommend", {
        method: "POST",
        body: fd,
      });

      // ✅ robust: vždy najprv text, potom JSON parse
      const text = await res.text();
      let data: any = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error(text || `Non-JSON response (status ${res.status})`);
      }

      if (!res.ok) throw new Error(data?.detail ?? `Request failed (status ${res.status})`);

      setResult(data);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Shelfie</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Uploadni fotku poličky alebo kníh. Shelfie najprv overí, či sú na fotke knihy, potom spraví profil a odporučí knihy z katalógu.
            </p>
          </div>

          <div className="hidden sm:block">
            <span className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-300">
              Next.js + Tailwind + FastAPI
            </span>
          </div>
        </header>

        {/* Upload card */}
        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="text-sm font-medium text-zinc-200">
                Fotka (JPG/PNG)
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetAll}
                  disabled={loading && !file}
                  className="rounded-xl border border-zinc-800 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-900 disabled:opacity-50"
                >
                  Reset
                </button>

                <button
                  type="button"
                  onClick={onAnalyze}
                  disabled={!file || loading}
                  className="rounded-xl bg-white px-4 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-200 disabled:opacity-50"
                >
                  {loading ? "Analyzing…" : "Analyze"}
                </button>
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-zinc-200 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-900 hover:file:bg-zinc-200"
            />

            {/* Preview */}
            {previewUrl && (
              <div className="mt-1 overflow-hidden rounded-xl border border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-64 w-full object-cover"
                />
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-900/40 bg-red-950/40 p-3 text-sm text-red-200 whitespace-pre-wrap">
                {error}
              </div>
            )}
          </div>
        </section>

        {/* Results */}
        {result && (
          <section className="mt-8 grid gap-4">
            {/* No books detected */}
            {result.has_books === false && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h2 className="text-sm font-semibold text-zinc-200">
                  Na fotke nevidím knihy
                </h2>

                {result.needs_better_photo ? (
                  <p className="mt-2 text-sm text-zinc-300">
                    Možno tam knihy sú, ale fotka je zrejme príliš tmavá/rozmazaná alebo je to príliš ďaleko.
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-zinc-300">
                    Skús odfotiť knižné chrbty alebo obálky bližšie a ostrejšie.
                  </p>
                )}

                {result.photo_tips?.length ? (
                  <ul className="mt-3 list-disc pl-5 text-sm text-zinc-300">
                    {result.photo_tips.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-4 text-xs text-zinc-500">
                  Tip: najlepšie fungujú fotky, kde sú viditeľné chrbty kníh s textom (rovno spredu, bez odleskov).
                </div>
              </div>
            )}

            {/* If books detected, show profile + picks */}
            {result.has_books === true && (
              <>
                {/* Profile */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
                  <h2 className="text-sm font-semibold text-zinc-200">
                    Čitateľský profil
                  </h2>

                  <div className="mt-3 grid gap-2 text-sm text-zinc-300">
                    <div>
                      <span className="text-zinc-400">vibe:</span>{" "}
                      <b className="text-zinc-100">{result.reader_profile.vibe ?? "-"}</b>
                    </div>
                    <div>
                      <span className="text-zinc-400">audience:</span>{" "}
                      <b className="text-zinc-100">{result.reader_profile.audience ?? "-"}</b>
                    </div>
                    <div>
                      <span className="text-zinc-400">language:</span>{" "}
                      <b className="text-zinc-100">{result.reader_profile.language ?? "-"}</b>
                    </div>
                    <div>
                      <span className="text-zinc-400">genres:</span>{" "}
                      <b className="text-zinc-100">{result.reader_profile.genres?.join(", ") || "-"}</b>
                    </div>
                    <div>
                      <span className="text-zinc-400">themes:</span>{" "}
                      <b className="text-zinc-100">{result.reader_profile.themes?.join(", ") || "-"}</b>
                    </div>
                  </div>

                  {(result.photo_tips?.length || result.needs_better_photo) && (
                    <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/30 p-3">
                      <div className="text-xs font-medium text-zinc-300">
                        Kvalita fotky
                      </div>
                      {result.needs_better_photo && (
                        <div className="mt-1 text-xs text-zinc-400">
                          Odporúčam lepšiu fotku pre presnejšie rozpoznanie.
                        </div>
                      )}
                      {result.photo_tips?.length ? (
                        <ul className="mt-2 list-disc pl-5 text-xs text-zinc-400">
                          {result.photo_tips.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      ) : null}
                    </div>
                  )}

                  {result.rationale?.length > 0 && (
                    <div className="mt-4 text-xs text-zinc-400">
                      <div className="font-medium text-zinc-300">rationale</div>
                      <ul className="mt-2 list-disc pl-5">
                        {result.rationale.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Picks */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
                  <h2 className="text-sm font-semibold text-zinc-200">
                    Odporúčané knihy
                  </h2>

                  {result.picks?.length ? (
                    <div className="mt-4 grid gap-3">
                      {result.picks.map((p, i) => (
                        <div
                          key={i}
                          className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-4"
                        >
                          <div className="flex flex-col gap-1">
                            <div className="text-base font-semibold text-zinc-100">
                              {p.title ?? "—"}
                            </div>

                            <div className="text-xs text-zinc-400">
                              {p.brand ? <span>{p.brand}</span> : null}
                              {p.category ? (
                                <span>{p.brand ? " • " : ""}{p.category}</span>
                              ) : null}
                              {p.ean ? (
                                <span>{(p.brand || p.category) ? " • " : ""}EAN {p.ean}</span>
                              ) : null}
                            </div>

                            {p.tagline && (
                              <div className="mt-2 text-sm text-zinc-200">
                                {p.tagline}
                              </div>
                            )}

                            {p.blurb && (
                              <div className="mt-2 text-sm text-zinc-300 line-clamp-4">
                                {p.blurb}
                              </div>
                            )}

                            {p.tags?.length ? (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {p.tags.slice(0, 8).map((t) => (
                                  <span
                                    key={t}
                                    className="rounded-full border border-zinc-800 bg-zinc-900/40 px-2 py-1 text-xs text-zinc-300"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 text-sm text-zinc-400">
                      Žiadne odporúčania.
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

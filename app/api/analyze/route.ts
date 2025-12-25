// app/api/analyze/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 1_500_000; // 1.5 MB

const ArchetypeEnum = z.enum([
  "Bezkniznik",
  "Manga",
  "Fantasta",
  "Scifi",
  "Detektiv",
  "Horor",
  "Romantik",
  "Poetik",
  "Akcny",
  "Motivator",
  "Biznis",
  "Intelektual",
  "Rodic",
  "Cestovatel",
  "Dobrodruh",
  "Labuznik",
  "Gamer",
  "Vsehochut",
]);

const EvidenceSchema = z.object({
  hasBooks: z.boolean(),
  vibe: z.number().int().min(1).max(5),
  confidence: z.number().int().min(1).max(5),
  titles: z.array(z.string()).max(20).default([]),
  keywords: z.array(z.string()).max(20).default([]),
});
type EvidenceOut = z.infer<typeof EvidenceSchema>;

const ArchetypeSchema = z.object({
  archetype: ArchetypeEnum,
  confidence: z.number().int().min(1).max(5),
});
type ArchetypeOut = z.infer<typeof ArchetypeSchema>;

const ShelfieSchema = z.object({
  archetype: ArchetypeEnum,
  vibe: z.number().int().min(1).max(5),
  confidence: z.number().int().min(1).max(5),
  evidence: z
    .object({
      titles: z.array(z.string()).max(20),
      keywords: z.array(z.string()).max(20),
    })
    .default({ titles: [], keywords: [] }),
});
type ShelfieOut = z.infer<typeof ShelfieSchema>;

function toBase64(buffer: ArrayBuffer) {
  return Buffer.from(buffer).toString("base64");
}

function clampInt(n: unknown, min: number, max: number, fallback: number) {
  const x = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(x)) return fallback;
  return Math.max(min, Math.min(max, Math.round(x)));
}

function shouldRunHighEvidencePass(e: EvidenceOut) {
  if (!e.hasBooks) return false;
  if ((e.titles?.length ?? 0) < 3) return true;
  if (e.confidence <= 3) return true;
  return false;
}

export async function POST(req: Request) {
  const isDev = process.env.NODE_ENV !== "production";

  try {
    const form = await req.formData();
    const file = form.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File is not an image" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        {
          error: "Image too large after compression",
          maxKB: Math.round(MAX_BYTES / 1024),
          gotKB: Math.round(file.size / 1024),
        },
        { status: 413 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    if (isDev) {
      console.log("IMAGE:", {
        type: file.type,
        size: `${Math.round(file.size / 1024)} KB`,
        name: file.name,
      });
    }

    const b64 = toBase64(await file.arrayBuffer());
    const dataUrl = `data:${file.type};base64,${b64}`;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const baseEvidenceRules = `
Si Shelfie.

Úloha (EVIDENCE PASS):
1) Rozhodni, či sú na fotke knihy/polička s knihami.
   - Ak knihy nevidíš alebo nie sú jasné -> hasBooks=false, vibe=1, confidence=5, titles/keywords prázdne.
2) Ak knihy sú:
   - vibe 1–5 podľa atmosféry knižnice
   - confidence 1–5: istota, že vieš z fotky spoľahlivo vyťažiť informácie (titulovosť, čitateľnosť)
   - titles: LEN tituly/autorov/série, ktoré reálne VIDÍŠ a vieš prečítať (max 20)
   - keywords: stručné kľúčové slová odvodené z toho, čo vidíš
     (napr. fantasy, sci-fi, thriller, horror, romance, manga, nonfiction...) (max 20)
Pravidlá:
- Vráť iba JSON podľa schémy.
- Ak nevieš prečítať aspoň 3 tituly/autorov, confidence zníž (typicky 1–3).
`.trim();

    const developerEvidenceLow = `
${baseEvidenceRules}

LOW:
- Nehraj sa na OCR. Skôr globálna interpretácia + len očividne čitateľné nápisy.
- titles môžu byť prázdne.
`.trim();

    const developerEvidenceHigh = `
${baseEvidenceRules}

HIGH:
- Zameraj sa na čítanie názvov na chrbtoch/obaloch (aspoň 3, ak sa dá).
- Ak sa nedá nič prečítať (rozmazané/odlesky), priznaj to cez nízke confidence a prázdne titles.
`.trim();

    const developerClassify = `
Si Shelfie.

Úloha (CLASSIFY PASS, bez obrázka):
Dostaneš zoznam "titles" a "keywords" z fotky knižnice.
- Vyber presne jeden archetype z enumu.
- confidence 1–5: istota archetypu vzhľadom na dôkazy.

Pravidlá:
- Rozhoduj PRIMÁRNE z titles. Sekundárne z keywords.
- Ak je evidence slabé (málo titulov), confidence zníž (typicky 1–3).
- Ak je knižnica jasná, ale žánre sú rozptýlené a nič nevyhráva -> použi "Vsehochut" s confidence 2–3.

Rozlíšenia:
- Manga:
  - ak titles/keywords obsahujú manga/anime/volume/tome alebo jasné manga série -> "Manga".
  - Manga NIKDY neklasifikuj ako "Gamer" ani "Akcny".

- Gamer:
  - iba pri jasných herných signáloch: game/rpg/d&d/warhammer/lore/artbook/videogame titles.
  - inak Gamer nepoužívaj.

- Horor:
  - ak titles/keywords jasne hovoria "horror/horor" alebo typické horor série/autori.
  - ak je mix thriller + horror a horor je dominantný -> "Horor", inak "Detektiv" alebo "Akcny".

- Fantasta vs Scifi:
  - Fantasta = fantasy/epic/grimdark/mágia/dragons + typickí autori/série.
  - Scifi = sci-fi/space/cyberpunk/AI/future + typickí autori/série.
  - ak je mix a dominancia nie je jasná -> preferuj "Fantasta".

- Detektiv: crime/mystery/thriller/detective/noir.
- Akcny: page-turner akcia, vojna, military, survival, napätie bez jasnej detektívky.

- Romantik: romance/rom-com, vzťahy.
- Poetik: poézia / literárna próza zameraná na jazyk.

- Intelektual: non-fiction o svete, veda, história, filozofia, eseje (nie biznis/self-help).
- Biznis: podnikanie, marketing, leadership, financie.
- Motivator: self-help, návyky, produktivita.
- Rodic: parenting, výchova.
- Cestovatel: travel, sprievodcovia, kultúry.
- Dobrodruh: expedície, outdoor, príroda, horolezectvo.
- Labuznik: kuchárky, jedlo, nápoje.

- Bezkniznik iba ak v evidence nie sú knihy (typicky už vyriešené v prvom passe).
`.trim();

    const userEvidence = `Vyťaž z fotky evidence: hasBooks + vibe + confidence + titles + keywords.`;
    const userClassify = `Klasifikuj archetyp z týchto dôkazov.`;

    async function runEvidencePass(detail: "low" | "high", developer: string) {
      const response = await openai.responses.parse({
        model: "gpt-4o-2024-08-06",
        input: [
          { role: "developer", content: developer },
          {
            role: "user",
            content: [
              { type: "input_text", text: userEvidence },
              { type: "input_image", image_url: dataUrl, detail },
            ],
          },
        ],
        text: { format: zodTextFormat(EvidenceSchema, "evidence") },
        temperature: 0.2,
      });

      const e = response.output_parsed as EvidenceOut;

      return {
        hasBooks: !!e?.hasBooks,
        vibe: clampInt(e?.vibe, 1, 5, e?.hasBooks ? 3 : 1),
        confidence: clampInt(e?.confidence, 1, 5, e?.hasBooks ? 3 : 5),
        titles: Array.isArray(e?.titles) ? e.titles.slice(0, 20) : [],
        keywords: Array.isArray(e?.keywords) ? e.keywords.slice(0, 20) : [],
      } satisfies EvidenceOut;
    }

    async function runClassifyPass(evidence: EvidenceOut) {
      const response = await openai.responses.parse({
        model: "gpt-4o-2024-08-06",
        input: [
          { role: "developer", content: developerClassify },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text:
                  userClassify +
                  "\n\n" +
                  JSON.stringify({ titles: evidence.titles, keywords: evidence.keywords }, null, 2),
              },
            ],
          },
        ],
        text: { format: zodTextFormat(ArchetypeSchema, "archetype") },
        temperature: 0.2,
      });

      const a = response.output_parsed as ArchetypeOut;

      return {
        archetype: a?.archetype ?? "Bezkniznik",
        confidence: clampInt(a?.confidence, 1, 5, 3),
      } satisfies ArchetypeOut;
    }

    // PASS A1: Evidence LOW
    const evidenceLow = await runEvidencePass("low", developerEvidenceLow);
    let evidence = evidenceLow;

    // PASS A2: Evidence HIGH
    let usedHighEvidence = false;
    let evidenceHigh: EvidenceOut | null = null;

    if (shouldRunHighEvidencePass(evidenceLow)) {
      evidenceHigh = await runEvidencePass("high", developerEvidenceHigh);

      const highBetter =
        evidenceHigh.titles.length > evidenceLow.titles.length ||
        evidenceHigh.confidence > evidenceLow.confidence;

      if (highBetter) {
        evidence = evidenceHigh;
        usedHighEvidence = true;
      }
    }

    if (!evidence.hasBooks) {
      const out: ShelfieOut = {
        archetype: "Bezkniznik",
        vibe: 1,
        confidence: 5,
        evidence: { titles: [], keywords: [] },
      };
      return NextResponse.json(out);
    }

    const titlesCount = evidence.titles.length;

    // PASS B
    const arche = await runClassifyPass(evidence);

    const combinedConfidence = Math.round((evidence.confidence + arche.confidence) / 2);

    const out: ShelfieOut = {
      archetype: arche.archetype,
      vibe: evidence.vibe,
      confidence: clampInt(
        titlesCount < 3 ? Math.min(combinedConfidence, 3) : combinedConfidence,
        1,
        5,
        3
      ),
      evidence: {
        titles: evidence.titles,
        keywords: evidence.keywords,
      },
    };

    if (isDev) {
      console.log("ANALYZE 2-STAGE:", {
        evidenceLow: {
          hasBooks: evidenceLow.hasBooks,
          vibe: evidenceLow.vibe,
          confidence: evidenceLow.confidence,
          titles: evidenceLow.titles.length,
        },
        evidenceHigh: evidenceHigh
          ? {
              hasBooks: evidenceHigh.hasBooks,
              vibe: evidenceHigh.vibe,
              confidence: evidenceHigh.confidence,
              titles: evidenceHigh.titles.length,
            }
          : null,
        usedHighEvidence,
        chosenEvidence: {
          vibe: evidence.vibe,
          confidence: evidence.confidence,
          titles: evidence.titles.length,
          keywords: evidence.keywords.length,
        },
        archetype: {
          archetype: arche.archetype,
          confidence: arche.confidence,
        },
        final: {
          archetype: out.archetype,
          vibe: out.vibe,
          confidence: out.confidence,
          titles: out.evidence.titles.length,
        },
      });
    }

    return NextResponse.json(out);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error("ANALYZE ERROR:", err);
    const fallback: ShelfieOut = {
      archetype: "Bezkniznik",
      vibe: 1,
      confidence: 5,
      evidence: { titles: [], keywords: [] },
    };
    return NextResponse.json(fallback, { status: 200 });
  }
}

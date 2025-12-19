// app/api/analyze/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 1_500_000; // 1.5 MB

// Sem daj svoj finálny zoznam archetypov (zatiaľ placeholder).
const ArchetypeEnum = z.enum([
  "Bezkniznik",
  "Gamer",
  "Myslitel",
  "Fantasta",
  "Labuznik",
  "Dobrodruh",
  "Romantik",
  "Detektiv",
  "Motivator",
  "Minimalista",
  "Ucenec",
  "Rodic",
  "Cestovatel",
  "Biznis",
  "Scifi",
  "Poetik",
]);

// ✅ API výstup: iba archetype
const ShelfieSchema = z.object({
  archetype: ArchetypeEnum,
});

type ShelfieOut = z.infer<typeof ShelfieSchema>;

function toBase64(buffer: ArrayBuffer) {
  return Buffer.from(buffer).toString("base64");
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

    const developer = `
Si Shelfie. Z fotky rozhodni, či sú na nej knihy/polička s knihami.
Ak knihy nevidíš alebo nie sú jasné -> vráť archetype="Bezkniznik".
Inak vyber jeden archetype z enumu.
Nevracaj nič okrem JSON podľa schémy.
`.trim();

    const user = `Vyber čitateľský archetyp z fotky.`;

    const response = await openai.responses.parse({
      model: "gpt-4o-2024-08-06",
      input: [
        { role: "developer", content: developer },
        {
          role: "user",
          content: [
            { type: "input_text", text: user },
            { type: "input_image", image_url: dataUrl, detail: "low" },
          ],
        },
      ],
      text: { format: zodTextFormat(ShelfieSchema, "shelfie_result") },
      temperature: 0.2,
    });

    const out = response.output_parsed as ShelfieOut;

    // posledná poistka
    if (!out?.archetype) {
      return NextResponse.json({ archetype: "Bezkniznik" } satisfies ShelfieOut);
    }

    return NextResponse.json(out);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error("ANALYZE ERROR:", err);
    const fallback: ShelfieOut = { archetype: "Bezkniznik" };
    return NextResponse.json(fallback, { status: 200 });
  }
}

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("image");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image" }, { status: 400 });
  }

  // rýchly sanity log (do Vercel logs)
  console.log("IMAGE:", {
    type: file.type,
    size: Math.round(file.size / 1024) + " KB",
  });

  // MOCK odpoveď – len aby sa flow overil
  return NextResponse.json({
    archetype: "Gamer",
    description: "Hľadáš napätie, tempo a svet, ktorý ťa vtiahne. Čítaš ako hráš: naplno.",
  });
}

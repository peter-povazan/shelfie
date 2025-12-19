// lib/compressImage.ts
export async function compressImageFile(
  file: File,
  opts?: {
    maxSide?: number;      // 1600
    quality?: number;      // 0.82
    mimeType?: "image/jpeg" | "image/webp";
  }
): Promise<File> {
  const maxSide = opts?.maxSide ?? 1600;
  const quality = opts?.quality ?? 0.82;
  const mimeType = opts?.mimeType ?? "image/jpeg";

  // decode
  const img = await fileToImageBitmap(file);

  const { width, height } = img;
  const scale = Math.min(1, maxSide / Math.max(width, height));
  const targetW = Math.round(width * scale);
  const targetH = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas ctx missing");

  ctx.drawImage(img, 0, 0, targetW, targetH);

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      mimeType,
      quality
    );
  });

  const ext = mimeType === "image/webp" ? "webp" : "jpg";
  const outName = file.name.replace(/\.\w+$/, "") + `-shelfie.${ext}`;

  return new File([blob], outName, { type: mimeType });
}

async function fileToImageBitmap(file: File): Promise<ImageBitmap> {
  // createImageBitmap je rýchle a obchádza niektoré memory issues
  // (na iOS Safari môže byť občas problematické; fallback nižšie)
  try {
    return await createImageBitmap(file);
  } catch {
    // fallback
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = reject;
        el.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas ctx missing");
      ctx.drawImage(img, 0, 0);
      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png");
      });
      return await createImageBitmap(blob);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

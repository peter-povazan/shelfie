import os
import base64
import json
from typing import List, Optional

from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel, Field
from openai import OpenAI

app = FastAPI()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# --- Health ---
@app.get("/api/health")
@app.get("/health")
def health():
    return {"ok": True}

# --- Response schema ---
class BookCandidate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    language: Optional[str] = None
    confidence: float = Field(ge=0, le=1)
    evidence: Optional[str] = None
    notes: Optional[str] = None

class ReaderProfile(BaseModel):
    genres: List[str] = []
    themes: List[str] = []
    audience: Optional[str] = None   # "YA", "adult", "kids"
    language: Optional[str] = None
    vibe: Optional[str] = None

class AnalyzeResult(BaseModel):
    has_books: bool
    needs_better_photo: bool
    photo_tips: List[str] = []
    book_candidates: List[BookCandidate] = []
    reader_profile: ReaderProfile

@app.post("/api/analyze", response_model=AnalyzeResult)
async def analyze(file: UploadFile = File(...)):
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not set")

    ct = (file.content_type or "").lower()
    if ct not in ("image/jpeg", "image/jpg", "image/png", "image/webp"):
        raise HTTPException(status_code=400, detail="Unsupported image type")

    img = await file.read()
    if not img:
        raise HTTPException(status_code=400, detail="Empty file")

    # ⚠️ Vercel request body limit ~4.5MB – preto fotky komprimuj/resize (neskôr spravíme na FE)
    b64 = base64.b64encode(img).decode("utf-8")
    data_url = f"data:{ct};base64,{b64}"

    system = (
        "You are Shelfie. Analyze photos for books and infer a reader profile. "
        "Be conservative: if titles are unreadable, say so and keep confidence low."
    )

    user_content = [
        {
            "type": "input_text",
            "text": (
                "Return ONLY valid JSON with this shape:\n"
                "{\n"
                '  "has_books": boolean,\n'
                '  "needs_better_photo": boolean,\n'
                '  "photo_tips": string[],\n'
                '  "book_candidates": [{ "title": string|null, "author": string|null, "language": string|null, "confidence": 0..1, "evidence": string|null, "notes": string|null }],\n'
                '  "reader_profile": { "genres": string[], "themes": string[], "audience": string|null, "language": string|null, "vibe": string|null }\n'
                "}\n"
                "Rules:\n"
                "- If no books: has_books=false and book_candidates=[]\n"
                "- If books exist but unreadable: has_books=true, needs_better_photo=true, add photo_tips\n"
            ),
        },
        {"type": "input_image", "image_url": data_url},
    ]

    try:
        resp = client.responses.create(
            model="gpt-4.1-mini",
            input=[
                {"role": "system", "content": system},
                {"role": "user", "content": user_content},
            ],
            response_format={"type": "json_object"},
        )
        return json.loads(resp.output_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analyze failed: {e}")

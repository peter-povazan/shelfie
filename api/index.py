import os
import re
import base64
import json
import random
from pathlib import Path
from typing import List, Optional, Any, Dict

from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from openai import OpenAI

# =================================================
# App & OpenAI
# =================================================

app = FastAPI()

if not os.getenv("OPENAI_API_KEY"):
    raise RuntimeError("OPENAI_API_KEY is not set")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# =================================================
# Catalog
# =================================================

ROOT_DIR = Path(__file__).resolve().parents[1]
CATALOG_INDEX_PATH = ROOT_DIR / "catalog" / "catalog_index.json"
CATALOG_FULL_PATH = ROOT_DIR / "catalog" / "catalog.json"

_catalog_index = None
_catalog_full = None


def load_catalogs():
    global _catalog_index, _catalog_full
    if _catalog_index is None:
        _catalog_index = json.loads(CATALOG_INDEX_PATH.read_text(encoding="utf-8"))
    if _catalog_full is None:
        _catalog_full = json.loads(CATALOG_FULL_PATH.read_text(encoding="utf-8"))


# =================================================
# Utils (TYPE-SAFE)
# =================================================

def norm(x: Any) -> str:
    """Normalize to lowercase string, tolerate list / None."""
    if x is None:
        return ""
    if isinstance(x, list):
        x = x[0] if x else ""
    return str(x).lower().strip()


def ensure_str_list(x: Any) -> List[str]:
    if x is None:
        return []
    if isinstance(x, list):
        return [str(i) for i in x if i is not None]
    return [str(x)]


def tokenize(s: str) -> set[str]:
    s = norm(s)
    s = re.sub(r"[^a-z0-9áäčďéíĺľňóôŕšťúýž\s-]+", " ", s)
    return set(t for t in s.split() if len(t) >= 2)


ALLOWED_TAGS = {
    "kids", "ya", "adult",
    "fiction", "nonfiction",
    "fantasy", "sci-fi", "thriller", "crime",
    "romance", "horror",
    "biography", "poetry",
    "comics", "handbook", "encyclopedia", "novel"
}


def normalize_tags(tags: Any) -> List[str]:
    out = []
    for t in ensure_str_list(tags):
        t = norm(t)
        if t in ALLOWED_TAGS and t not in out:
            out.append(t)
    return out[:5]


def resolve_audience(tags: List[str], audience: Any) -> str:
    if "kids" in tags:
        return "Kids"
    if "ya" in tags:
        return "YA"
    return audience if audience in ("Kids", "YA", "Adult") else "Adult"


def normalize_language(lang: Any) -> Optional[str]:
    if lang is None:
        return None
    if isinstance(lang, list):
        lang = lang[0] if lang else None
    if not lang:
        return None
    lang = norm(lang)
    return lang if lang in ("sk", "cs", "en") else None


# =================================================
# TAG FALLBACK (keď model zlyhá)
# =================================================

def infer_tags_from_text(genres, themes, vibe_list) -> List[str]:
    text = norm(" ".join(ensure_str_list(genres) + ensure_str_list(themes) + ensure_str_list(vibe_list)))
    tags = ["adult"]

    def add(t):
        if t not in tags:
            tags.append(t)

    if "sci" in text or "science fiction" in text:
        add("sci-fi"); add("fiction")
    if "fantasy" in text:
        add("fantasy"); add("fiction")
    if "thriller" in text:
        add("thriller"); add("fiction")
    if "crime" in text or "mystery" in text or "detekt" in text:
        add("crime"); add("thriller"); add("fiction")
    if "romance" in text or "romant" in text:
        add("romance"); add("fiction")
    if "biograph" in text or "životopis" in text:
        add("biography"); add("nonfiction")
    if "comic" in text or "komiks" in text:
        add("comics")

    if "fiction" not in tags and "nonfiction" not in tags:
        add("fiction")

    return normalize_tags(tags)


# =================================================
# Health
# =================================================

@app.get("/")
@app.get("/health")
@app.get("/api/health")
def health():
    return {"ok": True, "service": "shelfie-api"}


# =================================================
# Schemas
# =================================================

class ReaderProfile(BaseModel):
    genres: List[str] = []
    themes: List[str] = []
    audience: Optional[str] = None
    language: Optional[str] = None
    vibe: Optional[str] = None


class RecommendResult(BaseModel):
    has_books: bool = False
    needs_better_photo: bool = False
    photo_tips: List[str] = []
    reader_profile: ReaderProfile
    picks: List[dict]
    rationale: List[str]
    debug: Optional[dict] = None


# =================================================
# Matching logic
# =================================================

def score_item(item, desired_tags, desired_audience, query_tokens):
    tags = set(norm(t) for t in item.get("tags", []))
    audience = norm(item.get("audience"))

    tag_overlap = len(tags & set(desired_tags))
    aud_bonus = 2.0 if norm(desired_audience) == audience else 0.0

    title_tokens = tokenize(item.get("title", ""))
    brand_tokens = tokenize(item.get("brand", ""))
    text_overlap = len((title_tokens | brand_tokens) & query_tokens)

    return tag_overlap * 3.0 + aud_bonus + text_overlap * 0.5


def weighted_choice(items):
    """items: List[(score>=0, item)]"""
    total = sum(max(0.0, s) for s, _ in items)
    if total <= 0:
        return None
    r = random.random() * total
    acc = 0.0
    for s, it in items:
        acc += max(0.0, s)
        if acc >= r:
            return it
    return items[-1][1] if items else None


def item_similarity(a, b) -> float:
    """Simple similarity 0..1 based on tags/category/brand."""
    ta = set(norm(t) for t in a.get("tags", []))
    tb = set(norm(t) for t in b.get("tags", []))
    jacc = (len(ta & tb) / max(1, len(ta | tb)))

    ca = norm(a.get("category"))
    cb = norm(b.get("category"))
    cat_bonus = 0.15 if ca and cb and ca == cb else 0.0

    ba = norm(a.get("brand"))
    bb = norm(b.get("brand"))
    brand_bonus = 0.10 if ba and bb and ba == bb else 0.0

    return min(1.0, jacc + cat_bonus + brand_bonus)


def pick_2_plus_1(
    catalog_index,
    catalog_full,
    desired_tags,
    desired_audience,
    query_text,
    seed: Optional[str] = None,
):
    """
    Returns up to 3 full items:
      - 2 relevant picks sampled from TOPK with diversity penalty
      - 1 wildcard sampled from neighbor tags, also from TOPK
    """
    if seed:
        random.seed(seed)

    query_tokens = tokenize(query_text)
    scored = []

    for it in catalog_index:
        s = score_item(it, desired_tags, desired_audience, query_tokens)
        if s > 0:
            scored.append((s, it))

    scored.sort(key=lambda x: x[0], reverse=True)

    TOPK = 40
    pool = scored[:TOPK] if len(scored) > TOPK else scored[:]
    if not pool:
        return []

    chosen = []
    seen = set()

    # pick 2 with weighted random + diversity penalty
    for _ in range(2):
        adjusted = []
        for s, it in pool:
            ean = it.get("ean")
            if not ean or ean in seen:
                continue

            penalty = 0.0
            for c in chosen:
                penalty += item_similarity(it, c) * 2.0  # diversity strength
            adj = max(0.0, s - penalty)
            adjusted.append((adj, it))

        pick = weighted_choice(adjusted) or weighted_choice(pool)
        if not pick:
            break

        ean = pick.get("ean")
        if ean and ean not in seen:
            chosen.append(pick)
            seen.add(ean)

    # wildcard pool from neighbors, sampled (not deterministic top1)
    neighbors = set()
    if "fiction" in desired_tags:
        neighbors |= {"thriller", "crime", "fantasy", "sci-fi", "romance"}
    if "nonfiction" in desired_tags:
        neighbors |= {"biography", "handbook", "encyclopedia"}

    wc_pool = []
    for s, it in pool:
        ean = it.get("ean")
        if not ean or ean in seen:
            continue
        tags = set(norm(t) for t in it.get("tags", []))
        if not tags & neighbors:
            continue
        overlap = len(tags & set(desired_tags))
        if overlap >= 2:
            continue

        # prefer "adjacent" but not too overlapping
        wc_pool.append((max(0.0, s - overlap * 3.5), it))

    wildcard = weighted_choice(wc_pool) if wc_pool else None
    if wildcard and wildcard.get("ean") and wildcard.get("ean") not in seen:
        chosen.append(wildcard)

    full_by_ean = {x["ean"]: x for x in catalog_full}
    return [full_by_ean[it["ean"]] for it in chosen if it.get("ean") in full_by_ean][:3]


# =================================================
# Gate: detect if photo contains books
# =================================================

def detect_books_from_image(data_url: str) -> Dict[str, Any]:
    system = "You are a careful vision QA assistant. Be conservative."
    prompt = {
        "type": "input_text",
        "text": (
            "Return ONLY valid JSON:\n"
            "{ has_books: boolean, needs_better_photo: boolean, photo_tips: string[] }\n"
            "Rules:\n"
            "- has_books=true ONLY if you clearly see books/book spines/book covers.\n"
            "- needs_better_photo=true if there might be books but the image is too blurry/dark/too far.\n"
            "- photo_tips: 0–5 short tips in Slovak.\n"
        ),
    }

    resp = client.responses.create(
        model="gpt-4.1-mini",
        input=[
            {"role": "system", "content": system},
            {"role": "user", "content": [prompt, {"type": "input_image", "image_url": data_url}]},
        ],
        text={"format": {"type": "json_object"}},
    )

    try:
        out = json.loads(resp.output_text)
        if not isinstance(out, dict):
            return {"has_books": False, "needs_better_photo": False, "photo_tips": []}

        return {
            "has_books": bool(out.get("has_books", False)),
            "needs_better_photo": bool(out.get("needs_better_photo", False)),
            "photo_tips": ensure_str_list(out.get("photo_tips"))[:5],
        }
    except Exception:
        return {"has_books": False, "needs_better_photo": False, "photo_tips": []}


# =================================================
# Core recommender
# =================================================

MAX_IMAGE_BYTES = 8 * 1024 * 1024  # 8MB


async def run_recommender(file: UploadFile) -> dict:
    load_catalogs()

    img = await file.read()
    if not img:
        raise HTTPException(status_code=400, detail="Empty file")

    if len(img) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Image too large (max 8MB)")

    ct = (file.content_type or "image/jpeg").lower()
    if not ct.startswith("image/"):
        raise HTTPException(status_code=400, detail=f"Unsupported content_type: {ct}")

    b64 = base64.b64encode(img).decode()
    data_url = f"data:{ct};base64,{b64}"

    # 1) Gate: books yes/no
    gate = detect_books_from_image(data_url)

    if not gate["has_books"]:
        return {
            "has_books": False,
            "needs_better_photo": bool(gate.get("needs_better_photo", False)),
            "photo_tips": ensure_str_list(gate.get("photo_tips"))[:5],
            "reader_profile": {
                "genres": [],
                "themes": [],
                "audience": None,
                "language": None,
                "vibe": None,
            },
            "picks": [],
            "rationale": ["no_books_detected"],
            "debug": {"gate": gate},
        }

    # 2) Profile inference
    system = "You are Shelfie. Infer conservative reader preferences for book recommendation."
    prompt = {
        "type": "input_text",
        "text": (
            "Return ONLY valid JSON:\n"
            "{ reader_profile: { genres, themes, audience, language, vibe, tags } }\n"
            "Rules:\n"
            "- tags REQUIRED (1–5), lowercase, from whitelist\n"
            "- if uncertain use ['adult','fiction']\n"
            "- vibe should be a SHORT STRING (not a list); if unsure, give 2–5 words\n"
        ),
    }

    resp = client.responses.create(
        model="gpt-4.1-mini",
        input=[
            {"role": "system", "content": system},
            {"role": "user", "content": [prompt, {"type": "input_image", "image_url": data_url}]},
        ],
        text={"format": {"type": "json_object"}},
    )

    try:
        analysis = json.loads(resp.output_text)
    except Exception:
        analysis = {}

    rp = analysis.get("reader_profile", {}) if isinstance(analysis, dict) else {}

    genres = ensure_str_list(rp.get("genres"))
    themes = ensure_str_list(rp.get("themes"))

    vibe_raw = rp.get("vibe")
    vibe_list = ensure_str_list(vibe_raw)
    vibe = ", ".join(vibe_list) if vibe_list else None

    desired_tags = normalize_tags(rp.get("tags"))
    if not desired_tags:
        desired_tags = infer_tags_from_text(genres, themes, vibe_list)

    desired_audience = resolve_audience(desired_tags, rp.get("audience"))
    language = normalize_language(rp.get("language"))

    query_text = " ".join(genres + themes + vibe_list)

    # stable-ish randomness seed derived from profile
    seed = f"{vibe or ''}|{','.join(desired_tags)}|{desired_audience or ''}|{language or ''}"

    picks = pick_2_plus_1(
        _catalog_index,
        _catalog_full,
        desired_tags,
        desired_audience,
        query_text,
        seed=seed
    )

    return {
        "has_books": True,
        "needs_better_photo": bool(gate.get("needs_better_photo", False)),
        "photo_tips": ensure_str_list(gate.get("photo_tips"))[:5],
        "reader_profile": {
            "genres": genres,
            "themes": themes,
            "audience": desired_audience,
            "language": language,
            "vibe": vibe,
        },
        "picks": picks,
        "rationale": [
            f"tags={desired_tags}",
            f"audience={desired_audience}",
            "strategy=topK_weighted_random + diversity + wildcard",
        ],
        "debug": {
            "gate": gate,
            "normalized_tags": desired_tags,
            "resolved_audience": desired_audience,
            "seed": seed,
        },
    }


# =================================================
# Endpoints
# =================================================

@app.post("/api/recommend", response_model=RecommendResult)
async def recommend(file: UploadFile = File(...)):
    return await run_recommender(file)


@app.post("/api/analyze", response_model=RecommendResult)
async def analyze(file: UploadFile = File(...)):
    return await run_recommender(file)

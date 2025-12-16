# tools/csv_to_catalog.py
import csv
import json
import re
from pathlib import Path

SRC = "zoznam.csv"
OUT_FULL = "catalog/catalog.json"
OUT_INDEX = "catalog/catalog_index.json"


# ---------- helpers ----------

def normalize_key(s: str) -> str:
    return (s or "").strip().lower().replace("\ufeff", "")


def clean_text(s: str) -> str:
    if not s:
        return ""
    s = str(s)
    s = s.replace("\r\n", "\n").replace("\r", "\n")
    s = re.sub(r"[ \t]+", " ", s)      # zjednotí medzery
    s = re.sub(r"\n{3,}", "\n\n", s)   # max 2 prázdne riadky
    return s.strip()


def split_listish(value: str):
    if not value:
        return []
    value = clean_text(value)
    for sep in [";", ",", "/", "|"]:
        if sep in value:
            return [x.strip() for x in value.split(sep) if x.strip()]
    return [value] if value else []


def pick(row_norm: dict, *candidates, default=""):
    for c in candidates:
        v = row_norm.get(normalize_key(c))
        if v is None:
            continue
        v = str(v).strip()
        if v != "":
            return v
    return default


def slug(s: str) -> str:
    s = (s or "").strip().lower()
    s = re.sub(r"\s+", " ", s)
    return s


# ---------- tags ----------

# Minimal conservative canonicalization: SK/CZ -> EN stable tags
CANON_GENRE = {
    "encyklopédia": "encyclopedia",
    "encyklopedia": "encyclopedia",
    "náučná beletria": "nonfiction",
    "naučná beletria": "nonfiction",
    "náučné": "nonfiction",
    "naučné": "nonfiction",
    "detektívka": "crime",
    "detektivka": "crime",
    "krimi": "crime",
    "romantika": "romance",
    "romantický": "romance",
    "romanticke": "romance",
    "životopis": "biography",
    "zivotopis": "biography",
    "biografia": "biography",
    "komiks": "comics",
    "poézia": "poetry",
    "poezia": "poetry",
    "príručka": "handbook",
    "prirucka": "handbook",
}

def extract_tags(category: str, genres: list[str], audience: str):
    tags = set()

    # audience tag
    if audience:
        tags.add(slug(audience))  # kids / ya / adult

    cat = slug(category)
    g = [slug(x) for x in (genres or [])]

    # category hints
    if "det" in cat:
        tags.add("kids")
    if "mládež" in cat or "mladez" in cat or "ya" in cat:
        tags.add("ya")
    if "nauč" in cat or "náuč" in cat or "encykl" in cat:
        tags.add("nonfiction")
    if "beletria" in cat:
        tags.add("fiction")
    if "román" in cat or "roman" in cat:
        tags.add("novel")

    # genre hints (EN direct)
    for gi in g:
        if "fantasy" in gi:
            tags.add("fantasy")
        if "sci-fi" in gi or "scifi" in gi or "science fiction" in gi:
            tags.add("sci-fi")
        if "thriller" in gi:
            tags.add("thriller")
        if "horor" in gi:
            tags.add("horror")
        if "romant" in gi:
            tags.add("romance")
        if "detekt" in gi or "krimi" in gi:
            tags.add("crime")
        if "komiks" in gi:
            tags.add("comics")
        if "poez" in gi:
            tags.add("poetry")
        if "biograf" in gi or "zivotopis" in gi or "životopis" in gi:
            tags.add("biography")
        if "encykl" in gi:
            tags.add("encyclopedia")
        if "príru" in gi or "priruc" in gi:
            tags.add("handbook")

    # canonicalize exact known SK/CZ genres -> EN tags
    for gi in g:
        if gi in CANON_GENRE:
            tags.add(CANON_GENRE[gi])

    tags = [t for t in tags if t]
    tags.sort()
    return tags


# ---------- main ----------

def main():
    src_path = Path(SRC)
    if not src_path.exists():
        raise SystemExit(f"❌ Missing input CSV: {SRC}")

    raw = src_path.read_bytes()
    sample_text = raw.decode("utf-8-sig", errors="replace")

    sniff = csv.Sniffer()
    try:
        dialect = sniff.sniff(sample_text[:4096], delimiters=[",", ";", "\t", "|"])
    except Exception:
        dialect = csv.excel
        dialect.delimiter = ";"  # SK/CZ fallback

    full = []
    index = []

    with src_path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f, dialect=dialect)

        print("CSV delimiter:", repr(getattr(dialect, "delimiter", None)))
        print("CSV headers:", reader.fieldnames)

        first_row_debugged = False

        for row in reader:
            row_norm = {normalize_key(k): v for k, v in (row or {}).items()}

            if not first_row_debugged:
                print("SAMPLE ROW (normalized keys):", {k: row_norm[k] for k in list(row_norm)[:12]})
                first_row_debugged = True

            # --- SK mapping ---
            ean = pick(row_norm, "ean", "eán", default="")
            title = pick(row_norm, "názov", "nazov", default="")
            brand = pick(row_norm, "značka", "znacka", default="")
            category = pick(row_norm, "kategória", "kategoria", default="")
            tagline = clean_text(pick(row_norm, "slogan", default=""))
            blurb = clean_text(pick(row_norm, "anotácia", "anotacia", default=""))
            genres = split_listish(pick(row_norm, "žáner", "zaner", default=""))

            # --- audience inference ---
            age = pick(row_norm, "vek", default="")
            audience = "Adult"

            if age.isdigit():
                a = int(age)
                if a <= 12:
                    audience = "Kids"
                elif a <= 17:
                    audience = "YA"
            else:
                cat_l = (category or "").lower()
                if "det" in cat_l:
                    audience = "Kids"
                elif "mládež" in cat_l or "ya" in cat_l:
                    audience = "YA"

            # skip empty rows
            if not (ean or title or brand or category or blurb):
                continue

            tags = extract_tags(category=category, genres=genres, audience=audience)

            item_full = {
                "ean": ean,
                "title": title,
                "brand": brand,
                "category": category,
                "genres": genres,
                "tags": tags,
                "audience": audience,
                "tagline": tagline,
                "blurb": blurb,
            }
            full.append(item_full)

            item_index = {
                "ean": ean,
                "title": title,
                "brand": brand,
                "category": category,
                "tags": tags,
                "audience": audience,
            }
            index.append(item_index)

    Path(OUT_FULL).parent.mkdir(parents=True, exist_ok=True)
    Path(OUT_FULL).write_text(json.dumps(full, ensure_ascii=False, indent=2), encoding="utf-8")
    Path(OUT_INDEX).write_text(json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8")

    if full:
        print("SANITY FIRST ITEM (FULL):")
        print(json.dumps(full[0], ensure_ascii=False, indent=2)[:900])

    print(f"✅ Exportované: {OUT_FULL} ({len(full)} položiek)")
    print(f"✅ Exportované: {OUT_INDEX} ({len(index)} položiek)")


if __name__ == "__main__":
    main()

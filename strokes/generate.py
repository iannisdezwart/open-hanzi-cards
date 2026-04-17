import json
import time
import requests
import zipfile

from tqdm import tqdm
from pathlib import Path

THROTTLING_DELAY = 0.01
ENDPOINT = "https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1"
WORDS_FILE = Path("../words.json")
STROKES_DIR = Path(".strokes_tmp")
OUT_ZIP = Path("offline-strokes-bundle.zip")

chars = set()
data = json.loads(WORDS_FILE.read_text(encoding="utf-8"))
for item in data:
    chars.update(item["simplified"])

STROKES_DIR.mkdir(exist_ok=True)

for char in tqdm(chars, desc="Downloading strokes"):
    file = STROKES_DIR / f"{char}.json"
    if file.exists():
        continue
    try:
        res = requests.get(f"{ENDPOINT}/{char}.json")
        res.raise_for_status()
        file.write_bytes(res.content)
        time.sleep(THROTTLING_DELAY)
    except Exception as e:
        print(f"Failed to download strokes for {char}: {e}")


print("Packaging files...")
with zipfile.ZipFile(OUT_ZIP, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
    for f in STROKES_DIR.glob("*.json"):
        zf.write(f, arcname=f.stem)

print(f"Done -> {OUT_ZIP}")
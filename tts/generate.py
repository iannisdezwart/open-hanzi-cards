import os
import subprocess
import zipfile
import json
import time

from gtts import gTTS
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm


AUDIO_DIR = Path("audio")
WORDS_FILE = Path("../words.json")
THROTTLING_DELAY = 0.1
TMP_DIR = Path(".audio_tmp")
OUT_ZIP = Path("offline-tts-bundle.zip")
BITRATE = "16k"
MAX_WORKERS = os.cpu_count()

AUDIO_DIR.mkdir(exist_ok=True)
TMP_DIR.mkdir(exist_ok=True)

words: list[str] = []
with open("../words.json", "r", encoding="utf-8") as f:
    data = json.load(f)
    for item in data:
        words.append(item["simplified"])

for word in tqdm(words, desc="Generating audio"):
    file = AUDIO_DIR / f"{word}.mp3"
    if file.exists():
        continue
    try:
        tts = gTTS(text=word, lang="zh-CN")
        tts.save(file)
        time.sleep(THROTTLING_DELAY)
    except Exception as e:
        print(f"Failed to generate audio for {word}: {e}")

def encode(src_path: Path):
    dest_path = TMP_DIR / f"{src_path.stem}.ogg"
    if dest_path.exists():
        return src_path.name
    subprocess.run([
        "ffmpeg", "-y", "-loglevel", "error",
        "-i", str(src_path.name),
        "-b:a", BITRATE,
        "-c:a", "libopus",
        "-map_metadata", "-1",
        str(dest_path)
    ], check=True)
    return src_path.name

files = list(AUDIO_DIR.glob("*.mp3"))

print(f"Re-encoding {len(files)} files with {MAX_WORKERS} threads...")

with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
    futures = {executor.submit(encode, f) for f in files}
    for future in tqdm(as_completed(futures), total=len(futures), desc="Re-encoding"):
        _ = future.result()

print("All files encoded.")

print("Packaging files...")

with zipfile.ZipFile(OUT_ZIP, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
    for f in TMP_DIR.glob(f"*.ogg"):
        zf.write(f, arcname=f.stem)
print(f"Done -> {OUT_ZIP}")

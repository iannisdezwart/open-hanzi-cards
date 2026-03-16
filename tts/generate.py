import json
import os
import time

from gtts import gTTS
from tqdm import tqdm


THROTTLING_DELAY = 0.1


words = []
with open("../words.json", "r", encoding="utf-8") as f:
    data = json.load(f)
    for item in data:
        words.append(item["simplified"])

os.makedirs("audio", exist_ok=True)

for word in tqdm(words, desc="Generating audio"):
    filename = f"audio/{word}.mp3"
    if os.path.exists(filename):
        continue
    try:
        tts = gTTS(text=word, lang="zh-CN")
        tts.save(filename)
        time.sleep(THROTTLING_DELAY)
    except Exception as e:
        print(f"Failed to generate audio for {word}: {e}")

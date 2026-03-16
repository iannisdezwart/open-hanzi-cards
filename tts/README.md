# Generate text-to-speech audio files for all words in the HSK word list.

This script uses the [Google Text-to-Speech API](https://cloud.google.com/text-to-speech)
to generate audio files for all words in the HSK word list. The generated audio files are stored in the `audio` directory.

## Usage

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python generate.py
```

import { unzip, Unzipped } from "fflate";

const DB_NAME = "offline";
const DB_VERSION = 1;
const AUDIO_STORE = "audio";
const STROKE_STORE = "strokes";

let db: IDBDatabase;

export function initOfflineDb() {
  return new Promise<void>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      db = req.result;
      if (!db.objectStoreNames.contains(AUDIO_STORE)) {
        db.createObjectStore(AUDIO_STORE);
      }
      if (!db.objectStoreNames.contains(STROKE_STORE)) {
        db.createObjectStore(STROKE_STORE);
      }
    };
    req.onsuccess = () => {
      db = req.result;
      resolve();
    };
    req.onerror = () => reject(req.error);
  });
}

function asyncUnzip(zipBuffer: ArrayBuffer) {
  return new Promise<Unzipped>((resolve, reject) => {
    unzip(new Uint8Array(zipBuffer), {}, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

async function storeAudioFromZip(zipBuffer: ArrayBuffer) {
  const files = await asyncUnzip(zipBuffer);

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(AUDIO_STORE, "readwrite");
    const store = tx.objectStore(AUDIO_STORE);

    try {
      for (const name in files) {
        store.put(files[name], name);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    } catch (e) {
      reject(e);
    }
  });
}

export async function downloadOfflineAudio() {
  const res = await fetch("res/offline-tts-bundle.zip");
  const buf = await res.arrayBuffer();
  await storeAudioFromZip(buf);
}

async function storeStrokesFromZip(zipBuffer: ArrayBuffer) {
  const files = await asyncUnzip(zipBuffer);

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STROKE_STORE, "readwrite");
    const store = tx.objectStore(STROKE_STORE);

    try {
      for (const name in files) {
        store.put(files[name], name);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    } catch (e) {
      reject(e);
    }
  });
}

export async function downloadOfflineStrokes() {
  const res = await fetch("res/offline-strokes-bundle.zip");
  const buf = await res.arrayBuffer();
  await storeStrokesFromZip(buf);
}

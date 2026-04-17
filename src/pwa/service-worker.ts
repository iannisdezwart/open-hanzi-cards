const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE_NAME = "pwa-cache-v1";
const CORE_ASSETS = ["./", "./scripts/app.js"];

sw.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)),
  );
  sw.skipWaiting();
});

sw.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      ),
  );
  sw.clients.claim();
});

const respondWithCachedAudio = (event: FetchEvent, wordFile: string) => {
  event.respondWith(
    (async () => {
      const dbRequest = indexedDB.open("offline", 1);

      const db: IDBDatabase = await new Promise((resolve, reject) => {
        dbRequest.onsuccess = () => resolve(dbRequest.result);
        dbRequest.onerror = () => reject(dbRequest.error);
      });

      return new Promise<Response>((resolve) => {
        const tx = db.transaction("audio", "readonly");
        const store = tx.objectStore("audio");
        const getReq = store.get(wordFile);

        getReq.onsuccess = () => {
          const res = getReq.result;
          if (res == null) {
            resolve(fetch(event.request));
            return;
          }
          const blob = new Blob([res], { type: "audio/ogg" });
          resolve(new Response(blob));
        };

        getReq.onerror = () => resolve(fetch(event.request));
      });
    })(),
  );
};

const respondWithCachedStroke = (event: FetchEvent, charFile: string) => {
  event.respondWith(
    (async () => {
      const dbRequest = indexedDB.open("offline", 1);

      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        dbRequest.onsuccess = () => resolve(dbRequest.result);
        dbRequest.onerror = () => reject(dbRequest.error);
      });

      return new Promise<Response>((resolve) => {
        const tx = db.transaction("strokes", "readonly");
        const store = tx.objectStore("strokes");
        const getReq = store.get(charFile);

        getReq.onsuccess = () => {
          const res = getReq.result;
          if (res == null) {
            resolve(fetch(event.request));
            return;
          }
          const blob = new Blob([res], { type: "application/json" });
          resolve(new Response(blob));
        };

        getReq.onerror = () => resolve(fetch(event.request));
      });
    })(),
  );
};

sw.addEventListener("fetch", (event: FetchEvent) => {
  const url = new URL(event.request.url);

  const audioMatch = /res\/audio\/(.*)\.mp3/.exec(url.pathname);
  if (audioMatch) {
    const word = decodeURIComponent(audioMatch[1]);
    respondWithCachedAudio(event, word);
    return;
  }

  const strokeMatch =
    /https:\/\/cdn\.jsdelivr\.net\/npm\/hanzi-writer-data@[^/]+\/(.+)\.json/.exec(
      event.request.url,
    );
  if (strokeMatch) {
    const charFile = decodeURIComponent(strokeMatch[1]);
    respondWithCachedStroke(event, charFile);
    return;
  }

  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request)),
  );
});

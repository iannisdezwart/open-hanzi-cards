const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE_NAME = "pwa-cache-v1";
const CORE_ASSETS = ["/", "/scripts/app.js"];

// Install: cache core assets
sw.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)),
  );
  sw.skipWaiting();
});

// Activate: remove old caches
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

// Fetch: offline-first
sw.addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request)),
  );
});

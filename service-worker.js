const CACHE_NAME = "pwa-version-1";
const urlsToCache = [
  "audio/collision.mp3",
  "audio/explosion.mp3",
  "audio/interactiveUI.mp3",
  "html/game.html",
  "image/favicon.png",
  "image/logo.png",
  "script/game.js",
  "script/matter.js",
  "script/script.js",
  "video/game.mp4",
  "video/main.mp4",
  "font.woff2",
  "manifest.json",
  "index.html",
  "style.css",
];
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Caching app resources");
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log("[Service Worker] Skip waiting");
        return self.skipWaiting();
      })
  );
});
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log("[Service Worker] Deleting old cache:", cache);
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => {
        console.log("[Service Worker] Claiming clients");
        return self.clients.claim();
      })
  );
});
self.addEventListener("fetch", (event) => {
  if (!event.request.url.startsWith("http")) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((response) => {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch((error) => {
          console.error("Fetch failed:", error);
          if (event.request.mode === "navigate") {
            return caches.match("index.html");
          }
          return new Response("Offline", {
            status: 503,
            statusText: "Service Unavailable",
            headers: new Headers({
              "Content-Type": "text/plain",
            }),
          });
        });
    })
  );
});
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});

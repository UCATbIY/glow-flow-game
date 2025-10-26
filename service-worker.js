const CACHE_NAME = "Glow-Flow-v2";
const OFFLINE_URL = "./html/offline.html";

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/html/offline.html",
  "/css/offline.css",
  "/js/offline.js",
  "/html/game.html",
  "/html/settings.html",
  "/html/statistics.html",
  "/html/offline.html",
  "/css/variables.css",
  "/css/style.css",
  "/css/game.css",
  "/css/settings.css",
  "/css/statistics.css",
  "/css/offline.css",
  "/js/matter.min.js",
  "/js/script.js",
  "/js/game.js",
  "/js/vibration.js",
  "/js/settings.js",
  "/js/statistics.js",
  "/js/offline.js",
  "/json/manifest.json",
  "/image/favicon.png",
  "/image/icon-192x192.png",
  "/image/icon-512x512.png",
  "/image/bg.png",
  // "/audio/bg-music.opus",
  "/audio/collision.opus",
  "/audio/explosion.opus",
  "/fonts/Orbitron-ExtraBold.woff2",
];
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching offline assets");
        return cache.addAll([
          OFFLINE_URL,
          "../css/offline.css",
          "../js/offline.js",
          "../image/bg.png",
          "../image/favicon.png",
          "../fonts/Orbitron-ExtraBold.woff2",
          "../js/vibration.js",
        ]);
      })
      .then(() => self.skipWaiting())
  );
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          console.log("Offline mode - showing offline page");
          return caches.match(OFFLINE_URL);
        }
      })()
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

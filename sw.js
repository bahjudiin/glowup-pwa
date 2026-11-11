/* GlowUp service worker — app-shell + data precache, offline-first.
   Bump CACHE when any shell asset changes. */
const CACHE = "glowup-v14";
const ASSETS = [
  "./",
  "./index.html",
  "./assets/app.css",
  "./assets/fonts.css",
  "./assets/fonts/inter-400.woff2",
  "./assets/fonts/inter-600.woff2",
  "./assets/fonts/inter-700.woff2",
  "./assets/fonts/jetbrains-mono-700.woff2",
  "./assets/app.js",
  "./art.js",
  "./copy.js",
  "./guides.js",
  "./plan.js",
  "./topics.js",
  "./data.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // addAll is atomic: one missing file aborts the whole precache and the
      // app silently loses offline support. Add each asset independently so
      // a single stale entry cannot take the rest down with it.
      .then((cache) => Promise.allSettled(ASSETS.map((a) => cache.add(a))))
      .then((results) => {
        const failed = results
          .map((r, i) => (r.status === "rejected" ? ASSETS[i] : null))
          .filter(Boolean);
        if (failed.length) console.warn("GlowUp SW: could not precache", failed);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // never cache third-party (iHerb/USDA links)

  // Navigations: network-first, fall back to cached shell so deep links work offline.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match("./index.html")))
    );
    return;
  }

  // Static assets: cache-first, then network (and cache the result).
  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match("./index.html"));
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") self.skipWaiting();
});

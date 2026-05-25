const CACHE = "lumina-lingua-v1";

const PRECACHE = [
  "/",
  "/dashboard",
  "/vocabulary",
  "/conversation",
  "/progress",
  "/offline",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and API calls (always network)
  if (request.method !== "GET") return;
  if (url.pathname.startsWith("/api/")) return;
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  // Network-first for HTML pages, cache-first for assets
  const isPage =
    request.headers.get("Accept")?.includes("text/html") ||
    url.pathname === "/" ||
    !url.pathname.includes(".");

  if (isPage) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached ?? caches.match("/offline"))
        )
    );
  } else {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((res) => {
            if (res.ok) {
              const clone = res.clone();
              caches.open(CACHE).then((c) => c.put(request, clone));
            }
            return res;
          })
      )
    );
  }
});

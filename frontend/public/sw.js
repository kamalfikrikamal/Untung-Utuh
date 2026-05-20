// Service Worker — Untung Utuh PWA
// Increment CACHE_VERSION when deploying a new version to force cache refresh.
const CACHE_VERSION = 'v1';
const CORE_CACHE   = `core-${CACHE_VERSION}`;
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const API_CACHE    = `api-${CACHE_VERSION}`;
const IMG_CACHE    = `images-${CACHE_VERSION}`;

const ALL_CACHES = [CORE_CACHE, STATIC_CACHE, API_CACHE, IMG_CACHE];

// Core assets cached during install (must be available offline)
const CORE_ASSETS = ['/', '/offline.html'];

// ── Install ────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CORE_CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate ───────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !ALL_CACHES.includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Message (allow page to trigger skipWaiting for version updates) ─────────
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

// ── Fetch ──────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1. API calls — network-first, cache as stale fallback (5 min TTL)
  if (url.origin === self.location.origin && url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE, 5 * 60));
    return;
  }

  // 2. Cloudinary images — cache-first (7 day TTL, max 200 entries)
  if (url.hostname.includes('cloudinary.com')) {
    event.respondWith(cacheFirst(request, IMG_CACHE));
    return;
  }

  // 3. Hashed static assets (JS/CSS/fonts/SVG) — cache-first (immutable)
  if (/\.(js|css|woff2?|ttf|eot|ico|webp|png|jpg|jpeg|gif|svg)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // 4. HTML navigation — network-first, fall back to cached page or offline.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CORE_CACHE).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() =>
          caches.match(request).then(
            (cached) => cached || caches.match('/offline.html')
          )
        )
    );
  }
});

// ── Strategy helpers ───────────────────────────────────────────────────────

/**
 * Network-first: try network, serve cached copy on failure.
 * On success, update the cache.  On failure, return cached data or a 503 JSON stub.
 */
async function networkFirst(request, cacheName, maxAgeSeconds) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) {
      const headers = new Headers(response.headers);
      headers.set('x-sw-cached-at', String(Date.now()));
      const toCache = new Response(await response.clone().blob(), {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
      cache.put(request, toCache);
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) {
      const cachedAt = Number(cached.headers.get('x-sw-cached-at') || 0);
      if (!maxAgeSeconds || Date.now() - cachedAt < maxAgeSeconds * 1000) {
        return cached;
      }
    }
    return new Response(
      JSON.stringify({ status: 'error', message: 'You are offline' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Cache-first: serve from cache immediately; fetch and update cache on miss.
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

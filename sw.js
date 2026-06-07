// Cycle Dashboard service worker — app-shell cache.
// Bump CACHE_VERSION whenever the asset list changes.
const CACHE_VERSION = 'cycle-dashboard-v5';

const ASSETS = [
  './mobile.html',
  './data.js',
  './tweaks-panel.jsx',
  './ios-frame.jsx',
  './mobile-app.jsx',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png',
  // External React + Babel — same-origin cache will pull from network on first
  // load and serve cached on subsequent visits.
  'https://unpkg.com/react@18.3.1/umd/react.development.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700&family=Manrope:wght@500;600;700&display=swap',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      // Use addAll best-effort; opaque cross-origin responses are still cacheable.
      Promise.all(ASSETS.map((url) =>
        cache.add(url).catch((err) => console.warn('[sw] skipped', url, err))
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first: always try the network; fall back to cache when offline.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    fetch(req).then((res) => {
      if (res && (res.status === 200 || res.type === 'opaque')) {
        const clone = res.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(req, clone));
      }
      return res;
    }).catch(() => caches.match(req))
  );
});

/* Offline support: pre-caches the app so it works without a connection.
   When online, files are fetched fresh (and the cache updated); when offline, the cached copy is used.
   Bump VERSION if the list of files changes. */
const VERSION = 'itil5-v7';
const FILES = [
  './', 'index.html', 'app.js', 'manifest.webmanifest', 'favicon.ico',
  'questions/flashcards.js',
  ...Array.from({length: 23}, (_, i) => `questions/s${String(i + 1).padStart(2, '0')}.js`),
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// App files: network first (so updates show immediately when online), cached copy when offline.
// Google Fonts: cache first, since font files never change.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (url.origin !== location.origin && !isFont) return;
  e.respondWith(caches.open(VERSION).then(async cache => {
    if (isFont) {
      const hit = await cache.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
      return res;
    }
    try {
      const res = await fetch(req, {cache: 'no-cache'});
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    } catch (err) {
      const hit = await cache.match(req, {ignoreSearch: true}) || (req.mode === 'navigate' && await cache.match('index.html'));
      if (hit) return hit;
      throw err;
    }
  }));
});

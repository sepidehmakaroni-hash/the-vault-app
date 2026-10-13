/* Keeps the app usable offline: the app shell and AI model are cached on first visit,
   fonts are cached as they load. Bump VERSION whenever index.html changes. */
const VERSION = 'kmt-test-v5';
const SHELL = ['./', 'index.html', 'face-api.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('kmt-test-') && k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // video is left to the browser so range requests (needed by iPhone) keep working
  if (/\.(mp4|webm)$/.test(url.pathname)) return;
  // the page itself: network first so updates arrive, cache as fallback
  if (req.mode === 'navigate') { e.respondWith(fetch(req, { cache: 'no-store' }).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put('index.html', c)); return r; }).catch(() => caches.match('index.html'))); return; }
  if (url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok || r.type === 'opaque') { const c = r.clone(); caches.open(VERSION).then(x => x.put(req, c)); } return r; })));
  }
});

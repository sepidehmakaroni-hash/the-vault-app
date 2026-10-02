/* Offline support: on first visit every file of the app is saved on the device; after that it opens with no internet. */
const PREFIX = 'the-vault-v1fixed-';
const CACHE = PREFIX + 'demo-fixes-v6';
const FILES = [
 "./",
 "index.html",
 "styles.css",
 "runtime.js",
 "app.js",
 "demo.js",
 "manifest.json",
 "../assets/img/mark-bronze.png",
 "../assets/img/lockup.png",
 "../assets/img/pattern.png",
 "../assets/img/lockup-dark.svg",
 "../assets/img/ornament-bronze.png",
 "../assets/img/ornament-oxblood.png",
 "../assets/img/dial-hero.png",
 "../assets/img/mark-oxblood.png",
 "../assets/img/mark-gold.png",
 "../assets/img/mark-ivory.png",
 "../assets/img/mark.svg",
 "../assets/img/ornament-gold.png",
 "../assets/img/ornament-ivory.png",
 "../assets/img/lockup-dark.png",
 "../assets/img/lockup.svg",
 "../assets/img/ornament-black.png",
 "../assets/img/mark.png",
 "../assets/img/ornament.png",
 "../assets/img/dial-step.png",
 "../assets/img/mark-black.png",
 "../assets/icons/icon-maskable-512.png",
 "../assets/icons/icon-192.png",
 "../assets/icons/apple-touch-icon.png",
 "../assets/icons/icon-512.png",
 "../assets/fonts/Awaken.otf",
 "../assets/fonts/BodoniModa-VF.ttf",
 "../assets/fonts/BodoniModa-Italic-VF.ttf",
 "../assets/fonts/Archivo-VF.ttf",
 "../assets/fonts/Vazirmatn-VF.ttf",
 "../assets/photos/room-door.jpg",
 "../assets/photos/room-sushi.jpg",
 "../assets/photos/room-humidor.jpg",
 "../assets/photos/room-terrace.jpg",
 "../assets/photos/room-garden.jpg",
 "../assets/photos/room-meeting.jpg",
 "../assets/photos/room-table.jpg",
 "../assets/photos/room-vault.jpg",
 "../assets/photos/lounge.jpg",
 "../assets/photos/hero-2.jpg",
 "../assets/photos/hero-1.jpg",
 "../assets/photos/gallery.jpg",
 "../assets/photos/member-events.jpg",
 "../assets/photos/dining.jpg",
 "../assets/photos/events.jpg",
 "../assets/photos/bar.jpg",
 "../assets/photos/membership-card.jpg"
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  const entry = new URL('index.html', self.registration.scope).href;
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match(entry)));
    return;
  }
  // Only precached static assets belong here; never cache future API responses.
  const allowed = FILES.some(path => new URL(path, self.registration.scope).pathname === url.pathname);
  if (!allowed) return;
  e.respondWith(caches.open(CACHE).then(cache => cache.match(e.request, {ignoreSearch:true}).then(hit => hit || fetch(e.request))));
});

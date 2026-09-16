/* Service Worker fuer Flutlicht Karriere.
 *
 * Zweck: das Spiel liegt nach dem ersten Aufruf dauerhaft auf dem Geraet und
 * startet auch ohne Internet. Der normale Browser-Cache reicht dafuer nicht --
 * den raeumt Safari weg, wenn Platz knapp wird.
 *
 * Diese Datei ist eine Vorlage. build.sh ersetzt 221da168e1f5 durch einen Hash
 * des gebauten Spiels, damit ein neuer Stand den alten Cache sicher ersetzt.
 */
const VERSION = '221da168e1f5';
const CACHE = 'flutlicht-' + VERSION;

/* Das Spiel selbst. Ohne diese Dateien startet nichts. */
const GERUEST = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icons/icon-180.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
];

/* Google Fonts. Fehlen sie, sieht das Spiel anders aus, laeuft aber. */
const SCHRIFT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // cache:'reload' umgeht den HTTP-Cache, sonst legt der Service Worker
    // womoeglich eine veraltete Kopie als "neuen" Stand ab.
    await cache.addAll(GERUEST.map((u) => new Request(u, { cache: 'reload' })));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const namen = await caches.keys();
    await Promise.all(
      namen.filter((n) => n.startsWith('flutlicht-') && n !== CACHE)
           .map((n) => caches.delete(n))
    );
    await self.clients.claim();
  })());
});

/* Netz zuerst, Cache als Rueckfall -- und der Cache wird nebenbei aufgefrischt. */
async function netzZuerst(request, cache, rueckfall) {
  try {
    const antwort = await fetch(request);
    if (antwort && antwort.ok) cache.put(request, antwort.clone());
    return antwort;
  } catch (err) {
    const gespeichert = await cache.match(request)
      || (rueckfall ? await cache.match(rueckfall) : null);
    if (gespeichert) return gespeichert;
    throw err;
  }
}

/* Cache zuerst -- fuer alles, was sich innerhalb einer Version nicht aendert. */
async function cacheZuerst(request, cache) {
  const gespeichert = await cache.match(request);
  if (gespeichert) return gespeichert;
  const antwort = await fetch(request);
  if (antwort && (antwort.ok || antwort.type === 'opaque')) {
    cache.put(request, antwort.clone());
  }
  return antwort;
}

self.addEventListener('fetch', (e) => {
  const request = e.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const eigen = url.origin === self.location.origin;

  if (!eigen && !SCHRIFT_HOSTS.includes(url.hostname)) return;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);

    // Der Seitenaufruf selbst: online den neuesten Stand holen, offline den
    // gespeicherten. Ohne den Rueckfall auf index.html scheitert der Aufruf
    // von .../Jump/ ohne Netz, weil die URL selbst nicht im Cache steht.
    if (request.mode === 'navigate') {
      return netzZuerst(request, cache, 'index.html');
    }

    // Schriften: einmal geholt, bleiben sie liegen.
    if (!eigen) return cacheZuerst(request, cache);

    // Eigene Dateien sind pro Version unveraenderlich.
    return cacheZuerst(request, cache);
  })());
});

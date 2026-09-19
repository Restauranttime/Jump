/* Wappen muessen innerhalb einer Liga unterscheidbar sein. Frueher war
   eines ein farbiges Quadrat mit Kuerzel - in der 2. Bundesliga sahen
   damit acht von zwoelf Vereinen gleich aus, ueber alle Ligen waren 149
   von 442 verwechselbar. */
karriere({ clubId: 'de1-5' });
const proLiga = {};
CLUBS.forEach(c => (proLiga[c.liga] = proLiga[c.liga] || []).push(c));
const schluessel = c => (c.wappenTausch ? c.farbe2 : c.farbe) + '|' + (c.wappen || c.muster);
let verwechselbar = 0;
const schlimmste = [];
for (const lid of Object.keys(proLiga)) {
  const z = {};
  proLiga[lid].forEach(c => { const k = schluessel(c); z[k] = (z[k] || 0) + 1; });
  const n = Object.values(z).filter(x => x > 1).reduce((a, b) => a + (b - 1), 0);
  verwechselbar += n;
  if (n >= 4) schlimmste.push(lid + ': ' + n + ' von ' + proLiga[lid].length);
}
pruefe(verwechselbar <= 30, 'kaum ein Verein ist in seiner Liga verwechselbar',
  verwechselbar + ' von ' + CLUBS.length + (schlimmste.length ? ' · ' + schlimmste.join(', ') : ''));
const muster = {};
CLUBS.forEach(c => { const m = c.wappen || c.muster; muster[m] = (muster[m] || 0) + 1; });
pruefe(Object.keys(muster).length >= 8, 'es gibt genug verschiedene Muster',
  Object.keys(muster).length + ' Muster');
let ohneWappen = CLUBS.filter(c => !c.wappen && !c.muster);
pruefe(ohneWappen.length === 0, 'jeder Verein hat ein Muster', ohneWappen.length + ' ohne');
let kaputt = 0;
for (const c of CLUBS) { const svg = wappenSvg(c); if (!svg || svg.indexOf('<svg') !== 0 || svg.indexOf(c.kurz) < 0) kaputt++; }
pruefe(kaputt === 0, 'jedes Wappen laesst sich zeichnen und traegt sein Kuerzel', kaputt + ' kaputt');
abschluss();

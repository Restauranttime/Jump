/* Die hinterlegten Kader muessen in sich stimmen: gueltige Positionen,
   plausible Werte, ein Torwart je Verein, und eine Flagge zu jedem
   Herkunftsland - sonst steht in der Aufstellung eine Luecke. */
const POSSE = ['TW', 'IV', 'AV', 'DM', 'ZM', 'OM', 'FL', 'ST'];
karriere({ clubId: 'de1-5' });
let spieler = 0, schiefePos = 0, schiefesAlter = 0, schiefeStaerke = 0;
let ohneTorwart = [], ohneFlagge = {}, ohneVerein = [];
for (const cid of Object.keys(ECHTE_KADER)) {
  if (!CL(cid)) { ohneVerein.push(cid); continue; }
  const k = ECHTE_KADER[cid];
  for (const e of k) {
    spieler++;
    if (POSSE.indexOf(e[1]) < 0) schiefePos++;
    if (e[2] < 15 || e[2] > 45) schiefesAlter++;
    if (e[4] < 40 || e[4] > 99) schiefeStaerke++;
    if (!herkunft(e[3])) ohneFlagge[e[3]] = (ohneFlagge[e[3]] || 0) + 1;
  }
  if (!k.some(e => e[1] === 'TW')) ohneTorwart.push(CL(cid).name);
}
pruefe(ohneVerein.length === 0, 'jeder hinterlegte Kader gehoert zu einem Verein', ohneVerein.join(', ') || Object.keys(ECHTE_KADER).length + ' Vereine');
pruefe(schiefePos === 0, 'alle Positionen sind gueltig', spieler + ' Spieler');
pruefe(schiefesAlter === 0, 'alle Altersangaben sind plausibel', schiefesAlter + ' daneben');
pruefe(schiefeStaerke === 0, 'alle Staerken liegen zwischen 40 und 99', schiefeStaerke + ' daneben');
pruefe(ohneTorwart.length === 0, 'jeder Verein hat einen Torwart', ohneTorwart.slice(0, 3).join(', ') || 'geprueft');
pruefe(Object.keys(ohneFlagge).length === 0, 'jedes Herkunftsland hat eine Flagge',
  Object.keys(ohneFlagge).join(' ') || '98 Laender');
const mitText = Object.keys(ECHTE_KADER).reduce((a, c) => a + ECHTE_KADER[c].filter(e => spielerText(e[0])).length, 0);
melde(spieler + ' echte Spieler, davon ' + mitText + ' mit Beschreibung');
pruefe(mitText > spieler * .8, 'die meisten Spieler haben eine Beschreibung',
  Math.round(100 * mitText / spieler) + ' %');
abschluss();

/* Der breite Durchlauf: volle Laufbahnen auf allen acht Positionen, quer
   durch die Startwege. Findet alles, was irgendwann wirft - der haeufigste
   Fehler nach einer Aenderung ist kein falscher Wert, sondern eine Zeile,
   die bei einer seltenen Verkettung gar nicht mehr laeuft. */
(async () => {
  const POSSE = ['TW', 'IV', 'AV', 'DM', 'ZM', 'OM', 'FL', 'ST'];
  let fehler = 0, saisons = 0, wochen = 0;
  const ersterFehler = [];
  for (let i = 0; i < 16; i++) {
    karriere({ pos: POSSE[i % 8], weg: STARTWEGE[i % 3].id, archetyp: ARCHETYPEN[i % 5].id,
      clubId: ['de1-5', 'de2-3', 'en1-7', 'es1-9', 'it2-4', 'fr1-6', 'at1-2', 'de3-8'][i % 8] });
    let w = 0;
    while (!S.beendet && w < 900) {
      S.plan = S.p.energie < 45 ? 'regen' : 'technik';
      try { await wocheVor(); }
      catch (e) {
        fehler++;
        if (ersterFehler.length < 3) ersterFehler.push(e.message + ' | ' + (e.stack || '').split('\n')[1].trim());
        break;
      }
      w++;
    }
    saisons += S.karriere.length;
    wochen += w;
  }
  ersterFehler.forEach(x => melde(x));
  pruefe(fehler === 0, 'keine Laufzeitfehler', wochen + ' Wochen, ' + saisons + ' Saisons, 16 Laufbahnen');
  pruefe(saisons >= 150, 'die Laufbahnen laufen lang genug', saisons + ' Saisons');
  abschluss();
})();

/* Was der Spieler sieht, muss beim zweiten Hinsehen dasselbe sein.
   Breite Suche nach der Fehlerklasse, die zweimal zugeschlagen hat:
   etwas wird gewuerfelt, aber nicht gespeichert.
   Absichtlich NICHT hier: Torjaeger, Weltspitze und Vereinsvorschlaege -
   die sollen pro Laufbahn anders sein und werden bei ihrer Erzeugung
   einmal gewuerfelt und dann im Spielstand gehalten. */
const ANSICHTEN = [
  ['Kader eines fremden Vereins',   () => fremderKader('de1-0').map(k => k.name + k.ovr).join(';')],
  ['Trainer eines fremden Vereins', () => JSON.stringify(fremderTrainer('de1-0'))],
  ['Nationalaufgebot',              () => natKader(S.p.natId).map(k => k.name + k.ovr).join(';')],
  ['Konkurrenz im Aufgebot',        () => natKonkurrenten().map(k => k.name).join(';')],
  ['Torjaegerliste (gespeichert)',  () => (S.torjaeger || []).map(t => t.name + t.tore).join(';')],
  ['Weltspitze (gespeichert)',      () => (S.stars || []).map(s => s.name + s.tore).join(';')],
  ['Eigener Kader',                 () => (S.kader || []).map(k => k.name + k.ovr).join(';')],
  ['Tabelle',                       () => tabellenListe().map(x => x.id + x.p).join(';')],
  ['Marktwert',                     () => String(marktwert())],
  ['Echter Kaderstand',             () => echterKaderStand('en1-0').map(k => k.name + k.alter).join(';')],
];
(async () => {
  karriere({ clubId: 'de1-5' });
  await spiele(2033, 300);
  melde('Laufbahn bis Jahr ' + S.jahr + ', jede Ansicht dreimal abgefragt');
  for (const [name, f] of ANSICHTEN) {
    let erste = null, stabil = true, fehler = null;
    for (let i = 0; i < 3; i++) {
      let r;
      try { r = f(); } catch (e) { fehler = e.message; break; }
      if (i === 0) erste = r; else if (r !== erste) stabil = false;
    }
    pruefe(!fehler && stabil, name, fehler ? 'wirft: ' + fehler : (stabil ? 'bestaendig' : 'aendert sich beim Hinsehen'));
  }
  abschluss();
})();

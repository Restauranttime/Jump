/* Jeder Verein laesst sich ansehen - und zeigt dabei jedes Mal dasselbe.
   Kader und Trainer der 441 anderen Vereine stehen in keinem Spielstand,
   sie werden bei jedem Aufschlagen neu beschrieben. Mit echtem Zufall
   hiesse der Trainer von Bayern bei jedem zweiten Blick anders. */
const bild = cid => fremderKader(cid).map(k => k.name + '|' + k.pos + '|' + k.alter + '|' + Math.round(k.ovr)).sort().join(';')
  + ' || ' + JSON.stringify(fremderTrainer(cid));
(async () => {
  karriere({ clubId: 'de1-5' });
  const proben = ['de1-0', 'de2-3', 'de3-7', 'en1-0', 'en4-5', 'es1-0', 'es3-9', 'it1-2', 'fr2-4', 'at1-1', 'nl3-2', 'sa1-0'];
  const da = proben.filter(c => CL(c));
  let wackelt = 0;
  for (const cid of da) if (bild(cid) !== bild(cid)) wackelt++;
  pruefe(wackelt === 0, 'zwei Aufrufe liefern dasselbe', da.length + ' Vereine quer durch alle Ligen');

  await spiele(2034, 400);
  const vor = {}; da.forEach(c => { vor[c] = bild(c); });
  const code = standKodieren();
  S = standDekodieren(code); natKaderCache = null;
  if (typeof migriere === 'function') migriere();
  const anders = da.filter(c => vor[c] !== bild(c));
  pruefe(anders.length === 0, 'nach Speichern und Laden unveraendert',
    anders.length ? anders.join(', ') : 'Jahr ' + S.jahr);

  const t1 = fremderTrainer(S.p.clubId);
  pruefe(t1 && S.trainer && t1.name === S.trainer.name,
    'der eigene Verein zeigt den Trainer aus dem Spielstand', t1 ? t1.name : '-');

  let kaputt = 0, leer = 0, kleinster = 99;
  for (const c of CLUBS) {
    try {
      const k = fremderKader(c.id);
      if (!k.length) leer++;
      if (k.length < kleinster) kleinster = k.length;
      if (!fremderTrainer(c.id)) kaputt++;
    } catch (e) { kaputt++; }
  }
  pruefe(kaputt === 0 && leer === 0, 'alle ' + CLUBS.length + ' Vereine lassen sich oeffnen',
    kaputt + ' Fehler, ' + leer + ' leer, kleinster Kader ' + kleinster);
  pruefe(kleinster >= 18, 'kein Verein hat einen zu duennen Kader', 'kleinster ' + kleinster);
  abschluss();
})();

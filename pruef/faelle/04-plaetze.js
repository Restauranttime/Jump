/* Drei Spielstaende nebeneinander duerfen sich nicht vermischen.
   Ein Platz, der ueber eine andere Laufbahn hinweg zurueckgeladen wird,
   muss die Welt exakt so vorfinden, wie er sie verlassen hat. */
const welt = () => CLUBS.map(c => c.id + ':' + c.liga + ':' + c.staerke).join('|');
function laden(code) {
  S = standDekodieren(code);
  natKaderCache = null;
  if (typeof migriere === 'function') migriere();
}
(async () => {
  karriere({ clubId: 'de1-5' });
  await spiele(2030, 200);
  const platz2 = standKodieren();
  const weltVon2 = welt();
  melde('Platz 2 gesichert im Jahr ' + S.jahr);

  karriere({ clubId: 'de1-5' });
  await spiele(2040, 600);
  pruefe(welt() !== weltVon2, 'die zweite Laufbahn veraendert die Welt wirklich', 'Jahr ' + S.jahr);

  laden(platz2);
  pruefe(welt() === weltVon2, 'Platz 2 findet seine Welt unveraendert vor', 'Jahr ' + S.jahr);

  karriere({ clubId: 'en1-3' });
  await spiele(2035, 300);
  laden(platz2);
  pruefe(welt() === weltVon2, 'auch nach einer dritten Laufbahn dazwischen');
  abschluss();
})();

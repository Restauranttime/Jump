/* Eine neue Karriere beginnt in der Welt der Vorlage.
   Gefunden am 19.09.2026 von einem Tester: Auf- und Abstieg schreiben die
   Liga direkt in das Vereinsobjekt. Diese Objekte leben ausserhalb des
   Spielstands, und wer nach einer langen Karriere neu begann, fand
   86 Vereine in der falschen Liga vor. */
const vorlage = {};
CLUBS.forEach(c => { vorlage[c.id] = { liga: c.liga, staerke: c.staerke }; });
const falscheLiga = () => CLUBS.filter(c => c.liga !== vorlage[c.id].liga);
const falscheStaerke = () => CLUBS.filter(c => c.staerke !== vorlage[c.id].staerke);

(async () => {
  karriere({ clubId: 'de1-5' });
  await spiele(2039, 550);
  melde('nach einer Laufbahn bis ' + S.jahr + ': ' + falscheLiga().length + ' Vereine verschoben');

  karriere({ clubId: 'de1-5' });
  const l = falscheLiga(), st = falscheStaerke();
  pruefe(l.length === 0, 'kein Verein in der falschen Liga',
    l.length ? l.slice(0, 3).map(c => c.name + ': ' + vorlage[c.id].liga + '->' + c.liga).join(', ') : '442 geprueft');
  pruefe(st.length === 0, 'keine veraenderte Vereinsstaerke',
    st.length ? st.length + ' Vereine' : '442 geprueft');


  /* Auch die Vereinsvorschlaege bei der Erstellung lesen die Ligen. */
  NEU.weg = 'nlz'; NEU.land = 'Deutschland'; NEU._clubs = null; NEU._weg = null;
  const vorschlaege = startClubs();
  const startliga = startLiga('nlz');
  /* Nicht nur "steht jetzt in dieser Liga" pruefen - das waere auch bei
     verschobener Welt erfuellt. Es muss die Liga der Vorlage sein. */
  const falsch = vorschlaege.filter(c => vorlage[c.id].liga !== startliga);
  pruefe(vorschlaege.length > 0 && falsch.length === 0,
    'die Vereinsvorschlaege gehoeren laut Vorlage in die Startliga',
    falsch.length ? falsch.map(c => c.kurz + ' gehoert nach ' + vorlage[c.id].liga).join(', ')
                  : vorschlaege.map(c => c.kurz).join(' ') + ' in ' + startliga);

  /* Drei Laufbahnen hintereinander duerfen sich nicht aufaddieren. */
  for (const c of ['en1-3', 'es1-7', 'it1-2']) { karriere({ clubId: c }); await spiele(2032, 250); }
  karriere({ clubId: 'de1-5' });
  pruefe(falscheLiga().length === 0, 'auch nach drei Laufbahnen sauber', falscheLiga().length + ' verschoben');
  abschluss();
})();

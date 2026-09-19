/* Ueberlebt die Welt einen Ladevorgang?
   Gespeichert werden der eigene Kader, die Tabellen, die Torjaegerlisten,
   die Weltspitze und eine Zeile je Wechsel. Die Kader der uebrigen 121
   Vereine werden dagegen bei jeder Abfrage neu berechnet - das taugt nur,
   wenn dieselbe Abfrage verlaesslich dasselbe liefert.
   Gefunden am 18.09.2026: Wo einer Nation der Nachwuchs ausging, wuerfelte
   der Verband Ersatzspieler. Nach fuenfzehn Saisons hiessen alle drei
   Torhueter des Aufgebots nach dem Laden anders. */
function bild() {
  const b = {};
  for (const cid of Object.keys(ECHTE_KADER).slice(0, 25))
    b['kader:' + cid] = echterKaderStand(cid).map(k => k.name + '|' + k.alter + '|' + Math.round(k.ovr)).sort().join(';');
  b.torjaeger = (S.torjaeger || []).map(t => t.name + '|' + t.tore).join(';');
  b.stars = (S.stars || []).map(s => s.name + '|' + s.clubId + '|' + s.tore).join(';');
  b.natkader = natKader(S.p.natId).map(k => k.name + '|' + k.pos + '|' + k.alter + '|' + Math.round(k.ovr)).join(';');
  b.natkonk = natKonkurrenten().map(k => k.name + '|' + Math.round(k.ovr)).join(';');
  b.eigener = (S.kader || []).map(k => k.name + '|' + k.alter + '|' + Math.round(k.ovr)).sort().join(';');
  b.rivale = S.rivale ? S.rivale.name + '|' + S.rivale.clubId : '-';
  b.trainer = S.trainer ? S.trainer.name : '-';
  b.nattrainer = S.natTrainer ? S.natTrainer.name : '-';
  return b;
}
/* Genau der Weg des Sicherungscodes. */
function durchLaden() {
  const code = standKodieren();
  S = standDekodieren(code);
  natKaderCache = null;
  if (typeof migriere === 'function') migriere();
}
(async () => {
  for (const pos of ['ST', 'TW', 'IV', 'ZM']) {
    karriere({ pos, archetyp: 'komplett', clubId: 'de1-5' });
    let w = 0, gemacht = 0;
    while (!S.beendet && w < 900) {
      S.plan = S.p.energie < 45 ? 'regen' : 'technik';
      await wocheVor(); w++;
      /* Mitten in der Saison pruefen, nicht am Jahreswechsel: Dort wird
         ohnehin vieles neu gesetzt und der Fehler verschwaende sich. */
      if (w === 120 || w === 340 || w === 560) {
        const vor = bild();
        durchLaden();
        const nach = bild();
        const anders = Object.keys(vor).filter(k => vor[k] !== nach[k]);
        pruefe(anders.length === 0, pos + ', Woche ' + w + ' (Jahr ' + S.jahr + ')',
          anders.length ? 'anders: ' + anders.join(', ') : Object.keys(vor).length + ' Groessen gleich');
        gemacht++;
      }
    }
    if (!gemacht) melde(pos + ': Laufbahn zu kurz fuer eine Pruefung');
  }
  abschluss();
})();

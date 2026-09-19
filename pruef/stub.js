function stub() {
  const f = function () { return p; };
  const p = new Proxy(f, {
    get(t, k) {
      if (k === 'textContent' || k === 'innerHTML' || k === 'value' || k === 'className') return '';
      if (k === 'dataset') return {};
      if (k === 'hidden' || k === 'disabled') return false;
      if (k === 'length') return 0;
      if (k === 'forEach' || k === 'map' || k === 'appendChild' || k === 'addEventListener' || k === 'setAttribute' || k === 'focus' || k === 'toggle') return () => p;
      if (k === Symbol.toPrimitive || k === 'toString') return () => '';
      return p;
    },
    set() { return true; },
    apply() { return p; }
  });
  return p;
}
const S_ = stub();
globalThis.document = { getElementById: () => S_, querySelectorAll: () => ({ forEach: () => {} }), createElement: () => S_, addEventListener: () => {} };
globalThis.window = { };
globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
globalThis.addEventListener = () => {};
globalThis.navigator = { standalone: false };
globalThis.screen = { height: 956 };
globalThis.document.documentElement = S_;
globalThis.document.body = S_;

/* ---------------------------------------------------------------------
   Der Spielcode laeuft im Browser. Fuer die Pruefung wird er aus
   src/game.html geschnitten und hier gegen ein Attrappen-DOM gesetzt: Ein
   Proxy, der auf jeden Zugriff wieder sich selbst liefert, sodass jede
   Zeile Anzeigecode folgenlos durchlaeuft. Geprueft wird damit die
   Simulation, nicht die Darstellung - die wird im Browser geprueft.
   --------------------------------------------------------------------- */

/* Jeder Fall meldet sich hier. Am Ende entscheidet der Zaehler ueber den
   Rueckgabewert des Prozesses: Ohne das haette ein Fehlschlag in der
   Werkbank niemanden geweckt. */
globalThis.FEHLER = 0;
globalThis.pruefe = function (bedingung, was, wie) {
  if (bedingung) { console.log('  ok    ' + was + (wie ? '  (' + wie + ')' : '')); return true; }
  console.log('  FEHLT ' + was + (wie ? '  (' + wie + ')' : ''));
  FEHLER++;
  return false;
};
globalThis.melde = function (text) { console.log('  ---   ' + text); };
globalThis.abschluss = function () {
  if (FEHLER) console.log('\n' + FEHLER + ' Pruefung' + (FEHLER > 1 ? 'en' : '') + ' fehlgeschlagen.');
  else console.log('\nAlles bestanden.');
  process.exit(FEHLER ? 1 : 0);
};

/* Eine Karriere anlegen, ohne durch die Erstellung zu klicken. */
globalThis.karriere = function (o) {
  o = o || {};
  NEU.vorname = o.vorname || 'Test'; NEU.nachname = o.nachname || 'Spieler';
  NEU.pos = o.pos || 'ST'; NEU.archetyp = o.archetyp || 'knipser';
  NEU.land = o.land || 'Deutschland'; NEU.weg = o.weg || 'nlz';
  NEU._clubs = null; NEU._weg = null;
  NEU.clubId = o.clubId || 'de1-5';
  NEU._tut = { an: false, gesehen: {} };
  karriereStarten();
};
/* Wochen abspulen, bis ein Jahr erreicht ist oder die Laufbahn endet. */
globalThis.spiele = async function (bisJahr, hoechstens) {
  let w = 0;
  while (!S.beendet && S.jahr < bisJahr && w < (hoechstens || 900)) {
    S.plan = S.p.energie < 45 ? 'regen' : 'technik';
    await wocheVor();
    w++;
  }
  return w;
};

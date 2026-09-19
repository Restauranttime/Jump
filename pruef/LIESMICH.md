# Prüfung

    ./pruef.sh              alle Fälle
    ./pruef.sh welt         nur Fälle, deren Name "welt" enthält
    ./pruef.sh 03           nur Fall 03

Rückgabewert 0, wenn alles bestanden ist, sonst 1. Läuft in etwa einer Minute
und braucht nichts außer Node.

## Wie es funktioniert

Der Spielcode lebt in `src/game.html` und ist für den Browser geschrieben.
`pruef/bau.sh` schneidet ihn heraus und setzt drei Teile zusammen:

1. `stub.js` — ein Attrappen-DOM. Ein Proxy, der auf jeden Zugriff wieder sich
   selbst liefert, sodass jede Zeile Anzeigecode folgenlos durchläuft. Dazu die
   Hilfen `pruefe()`, `melde()`, `abschluss()`, `karriere()` und `spiele()`.
2. Den Spielcode.
3. `stilllegen.js` — ersetzt `frage()`, `sagen()` und die übrigen Wartepunkte.
   **Das muss nach dem Spielcode stehen:** Diese Funktionen leben in dessen
   Gültigkeitsbereich, nicht auf `globalThis`. Eine Zuweisung davor läuft ins
   Leere, und der Wochenablauf wartet still auf eine Eingabe, die im Terminal
   niemand macht.
4. Den Fall selbst aus `pruef/faelle/`.

Geprüft wird damit die Simulation, nicht die Darstellung. Wie etwas aussieht,
wird im Browser geprüft — dafür gibt es hier nichts.

## Die Fälle

| Fall | Was er sichert |
|---|---|
| 01-laufzeit | 16 volle Laufbahnen auf allen acht Positionen, quer durch die Startwege. Findet alles, was irgendwann wirft. |
| 02-neustart | Eine neue Karriere beginnt in der Welt der Vorlage — keine geerbten Auf- und Abstiege. |
| 03-laden | Speichern und Laden mitten in der Saison, 33 verglichene Größen, viermal quer durch die Laufbahn. |
| 04-plaetze | Drei Spielstände nebeneinander vermischen sich nicht. |
| 05-vereinsseite | Kader und Trainer aller 442 Vereine sind beständig und vollständig. |
| 06-kaderdaten | Die 2.332 hinterlegten Spieler sind in sich stimmig. |
| 07-wappen | Wappen sind innerhalb ihrer Liga unterscheidbar. |
| 08-bestaendig | Zehn Ansichten liefern beim zweiten Hinsehen dasselbe. |

## Warum es das gibt

Zwei ernste Fehler kamen von einem Tester, nicht aus einer Messung:

- **Die Namen im Nationalaufgebot** wechselten nach dem Laden. Wo einer Nation
  der Nachwuchs ausging, würfelte der Verband Ersatzspieler, die in keinem
  Spielstand standen. Fall 03 findet das.
- **Die Ligen nach einem Neustart.** Auf- und Abstieg schreiben die Liga direkt
  in das Vereinsobjekt; diese Objekte leben außerhalb des Spielstands und wurden
  nie zurückgesetzt. 86 Vereine standen falsch. Fall 02 findet das.

Beide gehören zur selben Klasse: Etwas wird gewürfelt oder verändert, aber nicht
gespeichert und nicht zurückgesetzt. Fall 08 sucht breit danach.

## Einen neuen Fall schreiben

```js
/* Ein Satz dazu, was hier gesichert wird und warum. */
(async () => {
  karriere({ pos: 'ST', clubId: 'de1-5' });
  await spiele(2034, 400);
  pruefe(bedingung, 'was gelten soll', 'die gemessene Zahl dazu');
  abschluss();
})();
```

`pruefe()` zählt Fehlschläge, `abschluss()` beendet den Prozess mit dem
passenden Rückgabewert. `melde()` schreibt eine Zeile, die nichts entscheidet.

**Ein Fall, der nie fehlschlägt, ist wertlos.** Nach dem Schreiben den Fehler
künstlich einbauen und nachsehen, ob der Fall rot wird. Für die vier Fälle oben
ist das gemacht: Zurücksetzen ausgebaut, gesäten Generator durch Zufall ersetzt,
Trainer würfeln lassen, einem Verein den Torwart genommen — jedes Mal schlug
genau der zuständige Fall an.

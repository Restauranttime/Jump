# Nachtfalter

Ein endloses Sprungspiel im Stil von Doodle Jump — als **einzelne HTML-Datei**, ohne
Build, ohne Abhängigkeiten. Ein Nachtfalter springt von der Gartenlaterne über Blätter,
Laternen und Spinnen hinauf bis zwischen die Sterne.

## Sofort spielen

`index.html` im Browser öffnen — das war's. Auf dem Handy am schönsten:
Datei auf einen beliebigen Webspace oder GitHub Pages legen und die Seite
"Zum Home-Bildschirm hinzufügen" (läuft dann im Vollbild).

## Steuerung

| Eingabe | Wirkung |
| --- | --- |
| Linke / rechte Bildschirmhälfte halten | Nach links / rechts fliegen |
| Kurz tippen | Staubwolke nach oben schießen — trifft Spinnen |
| Handy neigen | Dasselbe per Sensor — optional, siehe unten |
| ← / → , Leertaste | Dasselbe mit Tastatur |

Beim ersten Start blendet das Spiel kurz ein, welche Bildschirmhälfte was tut.

### Zur Neigungssteuerung

Sie ist ein Extra, kein Muss — die Bildschirmhälften sind gleichwertig. iOS gibt den
Bewegungssensor nur nach einem Tipp auf **Neigungssteuerung aktivieren** frei, und nur
auf einer Seite, die über HTTPS und **nicht in einem fremden Frame** läuft. In
eingebetteten Vorschauen bleibt der Sensor gesperrt; das Spiel sagt das dann auch statt
stumm liegenzubleiben. Ein einmal abgelehnter Zugriff wird gemerkt und lässt sich unter
*Einstellungen › Safari › Bewegung & Ausrichtung* zurücksetzen.

Am linken Rand hinaus zu fliegen bringt dich rechts wieder herein.

## Spielelemente

- **Grüne Blätter** — tragen dich immer.
- **Blaue Blätter** — wandern hin und her.
- **Braune Blätter** — tragen genau einen Sprung, dann brechen sie unter dir weg.
- **Laternen** — katapultieren dich sehr viel höher als ein normaler Sprung.
- **Spinnen** — tödlich bei Berührung, außer du landest von oben auf ihnen oder triffst sie mit Staub.

Der Himmel färbt sich mit der Höhe von der Abenddämmerung bis in den Sternenraum,
die Sprünge werden weiter und die Blätter unzuverlässiger. Jede Reihe wird beim
Erzeugen auf Erreichbarkeit geprüft: der seitliche Spielraum folgt aus der Zeit, die
ein Sprung über der Zielhöhe verbringt, mal einem Sicherheitsfaktor — es kann also
keine unmögliche Lücke entstehen. Der Bestwert liegt im
`localStorage` des Browsers.

## Technik

- Canvas 2D, feste Physik-Schrittweite (1/120 s), Zeichnen entkoppelt vom Simulieren.
- Feste Spielfeld-Proportion (Handy-Format, mittig auf breiten Bildschirmen), damit
  Sprunghöhe und Abstände auf jedem Gerät identisch sind.
- Klänge über die Web Audio API, umschaltbar über den Lautsprecher-Knopf.
- Kein Netzwerkzugriff außer den Google Fonts; ohne sie greifen Systemschriften.

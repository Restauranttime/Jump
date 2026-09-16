# Flutlicht Karriere

Ein deutschsprachiger Fußball-Karriere-Simulator fürs Handy. Du spielst einen einzelnen
Spieler von 17 bis zum Karriereende: Training, Spieltage, Presse, Transfers, Nationalelf,
Verletzungen, Alterung — bis zum Rücktritt und der Legacy-Wertung.

## Spielen

`index.html` im Browser öffnen. Sonst nichts — keine Installation, kein Server, keine
Abhängigkeiten. Die Datei ist eigenständig, funktioniert offline und speichert den
Spielstand automatisch im `localStorage` des Browsers.

Auf dem Handy: Seite öffnen, „Zum Home-Bildschirm hinzufügen" — läuft dann wie eine App.

## Was drin ist

**Karriere anlegen** — Name, Nation, Position (7 Positionen von Innenverteidiger bis
Mittelstürmer), starker Fuß, Spielertyp (5 Archetypen mit eigenen Stärken) und der
Herkunftsweg: Straßenkicker (3. Liga, härtester Weg, höchstes Potenzial),
Nachwuchsleistungszentrum (2. Bundesliga) oder Wunderkind (Bundesliga, viel Erwartungsdruck).

**Wochenrhythmus** — Jede Woche wählst du einen Plan: gezieltes Techniktraining auf ein
Attribut, Doppelschichten (schneller besser, höheres Verletzungsrisiko), Athletik,
Regeneration, Videoanalyse, Social Media oder Freizeit. Dann kommt der Spieltag.

**Spieltag** — 34 Ligaspieltage plus Pokal und Europapokal. Ob du spielst, entscheidet sich
aus deiner Stärke im Vergleich zum Kader, dem Trainer-Vertrauen, deiner Form und deiner
Energie. Im Spiel bekommst du zwei bis drei Schlüsselmomente mit je drei Optionen —
Kopfball, Volley oder ablegen; grätschen, leiten oder Tempoduell. Der Ausgang hängt am
passenden Attribut, an der Schwierigkeit und am Zufall. Am Ende steht eine Note von
1,0 bis 6,0 nach deutscher Sportpresse-Skala.

**Drumherum** — Presse-Interviews nach Spielen, Follower und Ruf, Sponsorenverträge,
zufällige Ereignisse (Kabinenstreit, Trainerbüro, Boulevard, Wettanfragen, der Junge aus
der U19), Transferfenster im Winter und Sommer mit Vertragsverhandlung, Nationalmannschaft
mit Länderspielpausen und Turnieren, Auf- und Abstieg mit dem eigenen Verein,
Investitionen vom verdienten Geld.

**Langfristig** — Attribute wachsen mit dem Training und dem Alter gegen dein verborgenes
Potenzial, ab 29 baut der Körper ab. Saisonbilanz mit Torschützenkönig, Spieler der Saison
und Goldenem Ball, Weltrangliste, Titelvitrine, Karrieretabelle über alle Saisons.
Am Schluss: Rücktritt und Legacy-Punkte.

7 Ligen in 6 Ländern, rund 140 Vereine. Alle Vereins- und Spielernamen sind frei erfunden.

## Aufbau

| Datei | Inhalt |
|---|---|
| `src/game.html` | Die Quelle: Titel, Stile, Markup und die komplette Spiellogik. Enthält bewusst kein `<head>`/`<body>`, damit die Datei direkt als Artifact veröffentlicht werden kann. |
| `index.html` | Erzeugt aus `src/game.html`. Vollständiges HTML-Dokument zum Öffnen im Browser oder Ausliefern über GitHub Pages. |
| `build.sh` | Baut `index.html` aus `src/game.html`. Nach jeder Änderung an der Quelle einmal ausführen. |

Bearbeitet wird immer `src/game.html`, danach `./build.sh`.

## Balance

Die Simulation wurde kopflos über mehrere hundert Saisons durchgerechnet. Richtwerte für
eine durchgespielte Karriere:

- Ohne Plan gespielt: Stärke um 65–72, wenige oder keine Titel, solider Profi.
- Gezielt trainiert und regeneriert: Stärke 80–86, Torschützenkönig, Goldener Ball möglich.
- Ein Mittelstürmer landet bei etwa 0,6–0,7 Toren pro Spiel, ein Innenverteidiger bei 0,1.
- Marktwert auf dem Höhepunkt: zweistellige Millionen, mit Weltklasse deutlich darüber.

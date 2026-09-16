# Flutlicht Karriere

Ein deutschsprachiger Fußball-Karriere-Simulator fürs Handy. Du spielst einen einzelnen
Spieler von 17 bis zum Karriereende: Training, Spieltage, Presse, Transfers, Nationalelf,
Verletzungen, Alterung — bis zum Rücktritt und der Legacy-Wertung.

## Spielen

`index.html` im Browser öffnen. Sonst nichts — keine Installation, kein Server, keine
Abhängigkeiten. Die Datei ist eigenständig und funktioniert offline.

Auf dem Handy: Seite öffnen, „Zum Home-Bildschirm hinzufügen" — läuft dann wie eine App.

## Speichern

Der Spielstand wird nach jeder Woche automatisch gesichert, über drei Stufen:

1. **`localStorage`** — sofort und offline, funktioniert auch, wenn die Datei direkt von
   der Platte geöffnet wird. In eingebetteten Ansichten ist der Browser-Speicher allerdings
   teils abgeschottet und kommt beim nächsten Öffnen leer zurück; als einzige Quelle reicht
   er deshalb nicht.
2. **`db`-Fähigkeit der Artifact-Plattform** — dauerhafter Speicher, überlebt das Schließen
   der Seite und gilt geräteübergreifend. Wird über `capabilities: {db: {}}` angefordert und
   ist nur in der veröffentlichten Fassung verfügbar; das Spiel läuft ohne sie unverändert
   weiter.
3. **Sicherungscode** — ein kopierbarer Textblock im Profil, mit dem sich die Karriere in
   jedem Browser zurückholen lässt. Die Rückfallebene, falls beides versagt.

Das Profil zeigt jederzeit an, wo der Stand liegt, und erlaubt manuelles Speichern.

## Was drin ist

**Karriere anlegen** — Name, Nation, Position (7 Positionen von Innenverteidiger bis
Mittelstürmer), starker Fuß, Spielertyp (5 Archetypen mit eigenen Stärken) und der
Herkunftsweg: Straßenkicker (3. Liga, härtester Weg, höchstes Potenzial),
Nachwuchsleistungszentrum (2. Bundesliga) oder Wunderkind (Bundesliga, viel Erwartungsdruck).

**Wochenrhythmus** — Jede Woche wählst du einen Plan: gezieltes Techniktraining auf ein
Attribut, Doppelschichten (schneller besser, höheres Verletzungsrisiko), Ausdauertraining,
Athletik, Regeneration, Videoanalyse, Social Media oder Freizeit. Dann kommt der Spieltag.

**Rhythmus** — Was früher „Fitness" hieß und nie etwas tat, ist jetzt deine Spielpraxis.
Sie wächst nur durch echte Einsatzminuten und sinkt auf ein Grundniveau, wenn du nicht
spielst. Unter 75 kostet sie Stärke und erhöht das Verletzungsrisiko. Damit wird Bankdrücken
teuer: Wer nicht spielt, verliert Rhythmus und spielt dadurch noch weniger — dagegen hilft
nur, sich zurückzukämpfen oder den Verein zu wechseln.

**Ausdauer** — Ein eigener Langzeitwert neben den sieben Attributen. Sie zählt nicht in die
Stärke, macht dich also nicht besser, sondern belastbarer: Sie senkt den Energieverbrauch
und beschleunigt vor allem die Erholung zwischen den Spieltagen. Aufbauen kannst du sie nur
über Ausdauertraining — eine Woche, in der du technisch nicht besser wirst. Wer sie
ignoriert, verbringt rund ein Viertel der Saison unter 55 Energie und damit im
Leistungsabfall; wer regelmäßig investiert, kommt auf unter zehn Prozent. Ab 31 baut sie
wieder ab.

**Trainer** — Jeder Verein hat einen Trainer mit Namen, Herkunft, Alter und einer Spielidee:
Offensivfußball, defensive Ordnung, Talentförderer, ergebnisorientiert oder akribischer
Arbeiter. Die Spielidee beeinflusst, wen er aufstellt — ein Talentförderer bevorzugt junge
Spieler, ein Defensivtrainer die hinteren Reihen. Das Vertrauen, das du bei ihm hast, ist
damit an eine Person gebunden statt an eine Zahl.

**Saisonziel** — Vor jeder Saison gibt der Verein ein Ziel aus, das sich aus seiner Stärke im
Ligavergleich ergibt: Klassenerhalt, ruhiges Mittelfeld, einstelliger Platz, Europapokal oder
Meisterschaft. Wird es erreicht, zahlt der Verein eine Prämie und der Trainer bleibt. Wird es
verfehlt, fliegt er mit hoher Wahrscheinlichkeit — und der Nachfolger bewertet dich neu, was
deine Chance oder dein Problem sein kann. Liegt der Verein bei zwei Dritteln der Saison weit
zurück, kommt die Freistellung schon mittendrin.

**Kader** — Jeder Verein hat einen Kader aus 26 Spielern mit Position, Alter, Nation und
Stärke. Entscheidend ist die Rangfolge auf deiner Position: Du siehst, wer vor dir steht und
wie weit. Daraus berechnet sich, ob du aufgestellt wirst — nicht aus einer abstrakten
Vereinsstärke. Der Kader altert über die Jahre, Spieler gehen und kommen.

**Spieltag** — 34 bis 38 Ligaspieltage plus Pokal und Europapokal. Ob du spielst, entscheidet sich
aus deiner Stärke im Vergleich zum Kader, dem Trainer-Vertrauen, deiner Form und deiner
Energie. Im Spiel bekommst du zwei bis drei **Schlüsselmomente** aus einem Vorrat von
45 Situationen mit je drei Optionen — Kopfball, Volley oder ablegen; grätschen, leiten oder
Tempoduell. Der Ausgang hängt am passenden Attribut, an der Schwierigkeit und am Zufall und
reicht vom Traumtor über Abseits und herausgeholten Elfmeter bis zur eigenen Verletzung, die
dich vom Platz holt. Am Ende steht eine Note von 1,0 bis 6,0 nach deutscher
Sportpresse-Skala.

**Stab** — Du stellst Personal an und bezahlst es jede Woche, statt es einmal zu kaufen:
sieben Trainer (je einer pro Attribut), drei medizinische Kräfte und drei fürs Umfeld, jeweils
in drei Stufen von der Nachwuchskraft (250 € pro Woche) bis Weltklasse (9.000 € pro Woche).
Ein vollständiger Weltklasse-Stab kostet 6,1 Mio € im Jahr — mehr, als die meisten Spieler
verdienen. Reicht das Konto nicht, wird zurückgestuft und im Zweifel entlassen. Ein
Spitzentrainer hebt außerdem die Trainingsdecke für sein Attribut deutlich an.

**Besitz** — Einmalkäufe für das, was Gehalt sonst nicht verbraucht: Anlagen mit passivem
Wocheneinkommen, Lifestyle für Moral und Reichweite, und Vermächtnis-Projekte (Kunstrasen,
Akademie, Stiftung), die am Karriereende Legacy-Punkte bringen.

**Drumherum** — Presse-Interviews nach Spielen, Follower und Ruf, Sponsorenverträge,
44 zufällige Wochenereignisse, viele davon an deine Lage gekoppelt: ein Formtief, drei
Niederlagen in Folge, ein auslaufender Vertrag, fehlende Spielpraxis, ein junger Konkurrent
im eigenen Kader, eine Gehaltsforderung aus deinem Stab, die Winterpause. Dazu
Transferfenster im Winter und Sommer mit Vertragsverhandlung, Nationalmannschaft
mit Länderspielpausen und Turnieren, Auf- und Abstieg mit dem eigenen Verein,
Investitionen vom verdienten Geld.

**Welt** — Ein eigener Reiter mit den Tabellen aller zehn Ligen, die Woche für Woche
mitlaufen, der laufenden Torjägerliste deiner Liga mit echten Spielernamen, dem Europapokal
als vollständigem Wettbewerb (24 Teilnehmer, Ligaphase mit Tabelle, K.-o.-Baum bis zum
Finale), deinem Pokalweg und den Titelträgern der vergangenen Saisons.

**Höhepunkte** — Der Verlauf ist ein Ringspeicher und vergisst nach 60 Einträgen. Besondere
Momente bleiben dagegen dauerhaft: Profidebüt, erstes Tor, Dreierpack, Traumnote, Titel,
Länderspieldebüt, Rekordtransfer, schwere Verletzung, jedes 50. Karrieretor und jedes
100. Pflichtspiel. Im Profil als Zeitleiste, am Karriereende als Rückblick.

**Langfristig** — Attribute wachsen mit dem Training und dem Alter gegen dein verborgenes
Potenzial, ab 29 baut der Körper ab. Saisonbilanz mit Torschützenkönig, Spieler der Saison
und Goldenem Ball, Weltrangliste, Titelvitrine, Karrieretabelle über alle Saisons.
Am Schluss: Rücktritt und Legacy-Punkte.

## Vereine und Spieler

10 Ligen in 8 Ländern, 182 Vereine mit ihren echten Namen, Trikotfarben und -mustern. Vereins-
logos sind bewusst nicht enthalten: Die Wappen sind aus den Trikotfarben gezeichnet, nicht
kopiert.

Echte Kader liegen für 108 der 182 Vereine vor — rund 1.300 Spieler, Stand der Saison 2025/26:

| Liga | Abdeckung |
|---|---|
| Bundesliga | alle 18 Vereine |
| Premier League | alle 20 Vereine |
| LaLiga | alle 20 Vereine |
| Serie A | alle 20 Vereine |
| Ligue 1 | alle 18 Vereine |
| Österreichische Bundesliga | alle 12 Vereine |
| 2. Bundesliga, 3. Liga, Eredivisie, Saudi Pro League | erzeugte Kader |

Für alle übrigen Vereine erzeugt das Spiel Kader mit zur Liga passenden Nationalitäten;
angefangene echte Kader werden nach demselben Verfahren aufgefüllt, statt unsichere Namen zu
erfinden. Über die Jahre wächst der Anteil erzeugter Spieler, weil der Kader altert.

Die Kaderdaten werden beim Start gegen Vereins-IDs, Positionen, Nationen, Altersspannen und
Doppeleinträge geprüft (`scratchpad`-Testskript im Entwicklungsablauf) — Nationen ohne eigenen
Eintrag in der Nationenliste sind auf die jeweils nächstliegende abgebildet.

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
- Energie eines Stammspielers: Ø 48–60, je nach Umgang mit Regenerationswochen. Wer nicht
  spielt, bleibt naturgemäß frisch — der Karriereschnitt über alle Wochen liegt deshalb höher.
- Ausdauer wirkt sichtbar: Mit hohem Wert sinkt der Anteil der Wochen unter 55 Energie von
  gut 40 % auf rund ein Viertel.
- Ein Attribut erreicht ohne Trainer etwa Potenzial + 6, mit Weltklasse-Trainer rund
  Potenzial + 15. Gemessen über 20 Durchläufe: 84 / 86 / 89 / 93 je Trainerstufe.
- Verletzungen kosten rund ein Zehntel aller Wochen.
- Trainerwechsel: rund alle drei Saisons einer, gleichmäßig über die fünf Spielideen verteilt.

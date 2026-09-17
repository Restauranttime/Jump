# Flutlicht Karriere

Ein deutschsprachiger Fußball-Karriere-Simulator fürs Handy. Du spielst einen einzelnen
Spieler von 17 bis zum Karriereende: Training, Spieltage, Presse, Transfers, Nationalelf,
Verletzungen, Alterung — bis zum Rücktritt und der Legacy-Wertung.

## Spielen

`index.html` im Browser öffnen. Sonst nichts — keine Installation, kein Server, keine
Abhängigkeiten. Die Datei ist eigenständig; die einzige externe Referenz sind die Google
Fonts, ohne die das Spiel schlicht in einer Standardschrift läuft.

Auf dem Handy nicht als Datei verschicken: iOS zeigt eine HTML-Datei in der Vorschau nur an
und führt kein JavaScript aus — das Titelbild erscheint, reagiert aber auf nichts. Über
GitHub Pages ausliefern und die Adresse weitergeben.

## Offline und als App installieren

`sw.js` ist ein Service Worker, der das Spiel beim ersten Aufruf dauerhaft auf dem Gerät
ablegt. Der normale Browser-Cache reicht dafür nicht: den räumt Safari weg, sobald Platz
knapp wird. Gespeichert werden `index.html`, das Manifest, die Icons und die Google Fonts.

Auf dem iPhone: Seite einmal mit Netz öffnen, dann Teilen → „Zum Home-Bildschirm". Das Icon
startet das Spiel ohne Internet und im Vollbild ohne Safari-Leisten. Auf Android macht Chrome
dasselbe über „App installieren".

**Strategie:** Der Seitenaufruf geht zuerst ans Netz und fällt offline auf die gespeicherte
Fassung zurück — so kommt ein neuer Stand an, ohne dass Offline-Spielen daran hängt. Alles
Übrige kommt zuerst aus dem Cache, weil es sich innerhalb einer Version nicht ändert.

**Versionierung:** `build.sh` stempelt einen Hash von `index.html` in den Service Worker.
Ändert sich das Spiel, ändert sich der Cache-Name, der neue Stand wird installiert und der
alte Cache beim Aktivieren gelöscht. Ohne diesen Stempel würden Geräte ewig die erste
Fassung behalten. `src/sw.js` ist die Vorlage mit dem Platzhalter, `sw.js` das Ergebnis —
letzteres nicht von Hand bearbeiten.

Der Service Worker braucht `https` oder `localhost`. Wird `index.html` direkt von der Platte
geöffnet, meldet er sich still ab und das Spiel läuft wie zuvor.

**Icons:** `src/icon.svg` ist die Quelle, `icons/*.png` sind die daraus gerenderten Größen
(180 für iOS, 192 und 512 für das Manifest, dazu eine Maskable-Fassung, bei der das Motiv
auf 80 % geschrumpft in der Sicherheitszone der Android-Maske liegt).

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

## Gestaltung

Ein dunkles Grün-Schwarz mit Bernstein als einziger Akzentfarbe, Anton für Zahlen und
Überschriften, IBM Plex Sans für Fließtext und IBM Plex Sans Condensed für Daten und Tabellen.
Semantische Farben (gut / Warnung / schlecht) sind vom Akzent getrennt.

Drei Entscheidungen, die mehr als Geschmack sind:

- **Wappen** tragen die Trikotfarben als Grund und das Kürzel auf einem Band quer darüber. Ohne
  das Band verschwanden die Buchstaben bei Längsstreifen — BVB, BO4 und BMG waren schlicht nicht
  zu lesen. Das Band ist zugleich ein echtes Trikotmotiv.
- **Der Spieltag** füllt sich von unten wie ein Liveticker, und darunter liegt sehr blass der
  Rasen unter dem Flutlicht. Beim Anpfiff stand dort vorher ein schwarzes Loch über die halbe
  Seite; jetzt ist der leere Platz gewollt statt übrig. Zum Text hin wird der Rasen ausgeblendet,
  damit die Meldungen auf sauberem Grund stehen.
- **Querleisten** laufen am rechten Rand weich aus. Die harte Schnittkante sah aus wie
  abgeschnittener Text statt wie etwas zum Weiterschieben.

Tiefe wird nach Rolle vergeben, nicht überall gleich: Karten bekommen oben einen Hauch Licht und
darunter einen weichen Schatten, die Kante wird dafür zurückgenommen. Das Flutlicht selbst ist
nur auf der Anzeigetafel sichtbar — dem Bildschirm mit der meisten Spielzeit.

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

## Dein Jahrgang

Beim Anlegen bekommst du einen echten Spieler deiner Position und deines Jahrgangs als Rivalen
zugelost — je nach Position Lamine Yamal, Kenan Yıldız, Pietro Comuzzo oder einen der anderen
rund fünfzig Zwanzigjährigen aus den Kaderdaten. Er läuft die ganze Karriere neben dir her.

Gespeichert wird nur sein Name und was er geleistet hat. Alter, Stärke und Verein ergeben sich
aus denselben Regeln wie für jeden anderen echten Spieler — er altert also mit, wechselt über
das Transferfenster den Klub und beendet irgendwann seine Laufbahn, ohne dass irgendetwas
doppelt geführt wird.

Am Ende jeder Saison stellt euch das Spiel gegenüber, im Profil steht der Karrierestand, und
beim Rücktritt fällt ein Urteil. Zur Fairness zählt bei ihm die Torjägerkrone als Titel mit —
auf deiner Seite zählen Einzelauszeichnungen schließlich auch.

Gemessen über sechs volle Karrieren liegen beide im Mittel bei rund 110 Karrieretoren; wer vorn
liegt, entscheidet sich von Karriere zu Karriere.

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
erfinden.

**Die Welt altert mit.** Der Datenstand ist 2025/26, eine Karriere läuft aber über zwanzig
Jahre — ohne Fortschreibung stünde 2041 noch derselbe 39-jährige Torwart im Tor und die
Torjägerliste führte Saison für Saison derselbe Name an. Deshalb werden die echten Kader auf
die laufende Saison umgerechnet: Spieler werden älter, bis etwa 27 stärker, ab 30 schwächer und
beenden mit 36 ihre Laufbahn. Wer dann fehlt, wird durch einen erzeugten Nachfolger ersetzt.

Die Umrechnung läuft bewusst ohne Zufall, damit dieselbe Abfrage innerhalb einer Saison immer
dasselbe Ergebnis liefert. Bei Bayern sind 2026 noch 20 Spieler namentlich echt, 2036 elf und
ab 2046 keiner mehr. Saison 1 entspricht dabei exakt der Vorlage — geprüft über alle 1.315
Einträge.

**Wechsel zwischen den Vereinen.** Zwischen zwei Saisons wechseln vier bis fünf echte Spieler
den Klub: nach oben, wer seinem Verein entwachsen ist, nach unten, wer ihn überschritten hat,
sonst auf Augenhöhe. Die Auswahl ist nach Stärke gewichtet — gute Spieler wechseln häufiger als
Ergänzungsspieler, und nur deren Wechsel bekommt man überhaupt mit. Pro Verein passiert
höchstens eine Bewegung, damit kein Kader ausgedünnt wird. Die ein bis zwei größten Wechsel
einer Saison stehen im Verlauf.

Gespeichert wird das als eine Zeile pro Spieler (`Name → Verein`), nicht als Kader aller 182
Vereine; über eine ganze Karriere wächst der Spielstand dadurch um etwa 5 KB. Der eigene Verein
bleibt außen vor: Dessen Kader liegt als eigener Stand im Spielstand und würde sonst
auseinanderlaufen — Wechsel im eigenen Umfeld deckt der Wochenablauf mit seinen Ereignissen ab.

**Vereinsstärken driften.** Die Abschlusstabelle verschiebt jede Saison die Stärke jedes
Vereins um Bruchteile eines Punktes: Erfolg zahlt sich aus, Misserfolg kostet. Dazu etwas
Rauschen und ein Zug zurück zur Vorlage, begrenzt auf acht Punkte in jede Richtung — sonst wäre
die Rangordnung nach zwanzig Jahren reines Rauschen. Gemessen über vier volle Karrieren liegt
die durchschnittliche Abweichung bei 2,2 Punkten, die größte bei 6.

Die Kaderdaten werden beim Start gegen Vereins-IDs, Positionen, Nationen, Altersspannen und
Doppeleinträge geprüft (`scratchpad`-Testskript im Entwicklungsablauf) — Nationen ohne eigenen
Eintrag in der Nationenliste sind auf die jeweils nächstliegende abgebildet.

## Aufbau

| Datei | Inhalt |
|---|---|
| `src/game.html` | Die Quelle: Titel, Stile, Markup und die komplette Spiellogik. Enthält bewusst kein `<head>`/`<body>`, damit die Datei direkt als Artifact veröffentlicht werden kann. |
| `index.html` | Erzeugt aus `src/game.html`. Vollständiges HTML-Dokument zum Öffnen im Browser oder Ausliefern über GitHub Pages. |
| `build.sh` | Baut `index.html` aus `src/game.html` und legt zusätzlich `Flutlicht-Karriere.html` an — dieselbe Datei mit sprechendem Namen zum Weitergeben. Nach jeder Änderung an der Quelle einmal ausführen. |

Zum Weitergeben: `./build.sh` ausführen und `Flutlicht-Karriere.html` verschicken. Die Datei ist
eigenständig, läuft offline und speichert im Browser des Empfängers. Auf Android und am Rechner
genügt ein Doppelklick; auf dem iPhone muss sie erst in der Dateien-App gesichert werden und
öffnet dann nur in einer Vorschau — ob der Spielstand dort erhalten bleibt, ist ungeprüft. Für
diesen Fall gibt es im Profil den Sicherungscode.

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

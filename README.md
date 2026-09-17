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

**Karriere anlegen** — Name, Nation, Position (8 Positionen vom Torwart bis zum
Mittelstürmer), Spielertyp, **Startland** und Herkunftsweg. Aus Land und Weg ergibt sich die
Startliga, daraus drei vorgeschlagene Vereine.

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

**Der Auftrag** — Der Trainer gibt der Startelf vor jedem Anpfiff eine Aufgabe, die zu seiner
Spielidee passt, und sieht danach nach. Eigener Abschnitt weiter unten.

**Leihe** — Wer nicht spielt, kann eine Saison oder eine Rückrunde woanders verbringen, ohne
seinen Vertrag aufzugeben. Eigener Abschnitt weiter unten.

**Kader** — Jeder Verein hat einen Kader aus 26 Spielern mit Position, Alter, Nation und
Stärke. Entscheidend ist die Rangfolge auf deiner Position: Du siehst, wer vor dir steht und
wie weit. Daraus berechnet sich, ob du aufgestellt wirst — nicht aus einer abstrakten
Vereinsstärke. Der Kader altert über die Jahre, Spieler gehen und kommen.

**Spieltag** — 34 bis 38 Ligaspieltage plus Pokal und Europapokal. Ob du spielst, entscheidet sich
aus deiner Stärke im Vergleich zum Kader, dem Trainer-Vertrauen, deiner Form und deiner
Energie. Als Startelfspieler bekommst du zwei **Schlüsselmomente**, als Einwechselspieler
einen — aus einem Vorrat von 45 Situationen mit je drei Optionen: Kopfball, Volley oder
ablegen; grätschen, leiten oder Tempoduell. Der Ausgang hängt am passenden Attribut, an der
Schwierigkeit und am Zufall und reicht vom Traumtor über Abseits und herausgeholten Elfmeter
bis zur eigenen Verletzung, die dich vom Platz holt. Nicht alle Ausgänge sind gleich
wahrscheinlich: Ein Querpass gelingt bis zu 86 %, eine Vorlage höchstens 68 %, ein Torschuss
58 % und ein Traumtor 42 % — Abschließen ist die schwerste Aktion im Fußball und darf sich
nicht anfühlen wie ein Rückpass. Dazu kommt, aus welcher Lage du schießt: Vom Flügel und aus
der Abwehr ist der Winkel schlechter als aus dem Zentrum.

Die Tore deiner Mannschaft im übrigen Spielverlauf werden unter allen Feldspielern
ausgelost, nach Position und Stärke gewichtet — du stehst dabei mit drin, wenn du auf dem
Platz bist. Für einen Stürmer sind das rund 15 % seiner Tore, für einen Sechser fast alle.
Am Ende steht eine Note von 1,0 bis 6,0 nach deutscher Sportpresse-Skala. Sie zählt Tore,
Vorlagen, gelungene und misslungene Aktionen, das Ergebnis und den Spielstand — Gegentore
gehen dem letzten Mann an, ein Viertorespiel schreibt man dem Angriff gut. Gemessen über
12.000 Partien: 8 % Einser, 20 % Zweier, 46 % Dreier, 22 % Vierer, 4 % Fünfer.

**Stab** — Du stellst Personal an und bezahlst es jede Woche, statt es einmal zu kaufen:
sieben Trainer (je einer pro Attribut), drei medizinische Kräfte und drei fürs Umfeld, jeweils
in drei Stufen von der Nachwuchskraft (250 € pro Woche) bis Weltklasse (9.000 € pro Woche).
Ein vollständiger Weltklasse-Stab kostet 6,1 Mio € im Jahr — mehr, als die meisten Spieler
verdienen. Reicht das Konto nicht, wird zurückgestuft und im Zweifel entlassen. Ein
Spitzentrainer hebt außerdem die Trainingsdecke für sein Attribut deutlich an.

**Besitz** — Zehn Anschaffungen in drei Gruppen: Anlagen mit passivem Wocheneinkommen,
Lifestyle für Moral und Reichweite, und Vermächtnis-Projekte, die am Karriereende
Legacy-Punkte bringen. Fast alles kostet danach jede Woche Unterhalt. Eigener Abschnitt
weiter unten.

**Geld** — Gehalt, Steuern, Werbung, laufende Kosten. Eigener Abschnitt weiter unten.

**Verletzungen** — Kurze Pausen laufen nebenher ab. Ab acht Wochen wird daraus eine Reha mit Phasen, einer eigenen Entscheidung, Rückschlägen und einem Preis, den du danach behältst. Eigener Abschnitt weiter unten.

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

## Die schwere Verletzung

Eine Prellung ist eine Pause. Ein Kreuzbandriss ist etwas anderes — und sah bisher genauso
aus: ein Zähler, der acht Monate lang jede Woche um eins kleiner wurde. Ab acht Wochen wird
daraus eine Reha.

**Vier Phasen**, jede mit eigenem Text und eigenem Risiko: Ruhigstellung, Aufbau im
Kraftraum, erste Läufe auf dem Nebenplatz, Teiltraining mit Ball. Jede neue Phase wird
angekündigt — daran merkst du, dass es vorangeht.

**Eine Entscheidung, die bleibt.** Statt eines Wochenplans wählst du, wie du an die Reha
herangehst. Gemessen über je 18 Karrieren und rund 60 lange Verletzungen je Spalte:

| | echte Wochen weg | Rückschläge | Tempo dauerhaft weg | 90 %-Fall |
|---|---|---|---|---|
| Nichts erzwingen | 13,4 | 0,10 | 0,72 | 32 Wochen |
| Nach Plan | 11,3 | 0,27 | 0,80 | 21 Wochen |
| Vorantreiben | **9,2** | 0,42 | **1,41** | 15 Wochen |

Drei echte Wege, keine Falle: Wer treibt, ist im Schnitt vier Wochen früher zurück und
zahlt dafür fast das Doppelte an Substanz. Die erste Fassung war anders herum — dort
dauerte „Vorantreiben“ 20,4 statt 15,2 Wochen, weil die Rückschläge mehr kosteten als das
Tempo einbrachte. Das war keine Entscheidung, sondern eine Strafe für Neugier.

**Der Rückschlag.** Es zieht wieder, dieselbe Stelle: zwei bis fünf Wochen mehr, eine Phase
zurück, Moral weg. Mit „Vorantreiben“ passiert das viermal so oft wie mit „Nichts
erzwingen“.

**Der Preis.** Nach einer langen Verletzung kommst du nicht als derselbe zurück. Wie viel
Tempo, Physis und Zweikampf dauerhaft fehlen, hängt an drei Dingen: wie alt du bist, wie
lange du weg warst, und wie du die Reha gemacht hast. Ein Kreuzbandriss kostet im Schnitt
2,6 Tempo, mit über dreissig und drei Rückschlägen ein Vielfaches davon. Dazu wird der
Körper **anfälliger** — bis zu 50 % mehr Verletzungsrisiko, das über die nächsten Saisons
wieder abklingt.

**Das Comeback** bekommt einen eigenen Bildschirm: wie lange, wie viele Rückschläge, was es
gekostet hat, wo dein Rhythmus steht. Im ersten Spiel danach steht das Stadion auf, wenn
deine Nummer gezeigt wird.

**Und die Frage.** Wer mit über dreißig länger als achtzehn Wochen weg war, wird gefragt, ob
er wirklich zurückkommt. Das Spiel beendet keine Karriere von selbst — es legt dir nur die
Zahlen hin. Gemessen kommt die Frage in jeder fünften bis dritten Karriere.

Im Profil steht danach eine Liste aller langen Verletzungen mit Saison, Alter, Dauer und
Rückschlägen.

## Der Torwart

Die Positionsauswahl zeigte sieben Felder und kein Tor. Jetzt ist der Torwart die achte
Position — und die einzige, die nicht mit denselben Augen bewertet wird.

**Dieselben sieben Fächer, anderes Handwerk.** Intern bleiben es die bekannten Attribute,
angezeigt werden sie im Tor anders: Reflexe, Abschlag, Spielöffnung, Fangsicherheit, Eins
gegen eins, Strafraum, Mentalität. Damit laufen Training, Stab und Entwicklung unverändert
weiter — der Abschlusstrainer trainiert beim Torwart eben den Abschlag.

**Eigene Spielertypen:** Der Rückhalt (Reflexe), der mitspielende Torwart (Spielöffnung und
Abschlag), der Strafraumbeherrscher, der Unerschütterliche, der Komplette.

**Sechzehn eigene Schlüsselmomente,** in denen es nie ums Toreschießen geht: die Flanke in
den Fünfer, das Eins gegen eins, der abgefälschte Schuss, der Rückpass unter Druck, die
Mauer beim Freistoß, das Zeitspiel in Führung, die Viererkette, die zu weit auseinander
steht. Nicht jeder Patzer ist gleich ein Tor: Zwischen Parade und Gegentor liegt der
Nachschuss, der knapp vorbeigeht. Einen Elfmeter zu halten hat eine eigene, sehr flache
Kurve — selbst ein Weltklassemann kommt kaum über ein Drittel. Und einmal geht es doch
nach vorn: In der Nachspielzeit, bei Rückstand, lässt der Schiedsrichter dich mit hoch.

**Die Note rechnet sich anders.** Nicht aus Toren und Vorlagen, sondern aus Paraden,
Patzern, Gegentoren und der Null. Ein Sechs-zu-null ist seine beste Partie, ein Vier-zu-drei
trotz fünf Paraden keine gute.

**Er wirkt anders auf das Spiel.** Ein Feldspieler macht seine Mannschaft gefährlicher, ein
Torwart macht sie schwerer zu bezwingen: Seine Stärke zählt ausschließlich nach hinten.
Und weil seine Schlüsselmomente genau die Gelegenheiten der anderen Mannschaft sind, gehen
sie von deren Chancen ab statt obendrauf zu kommen — ohne das kassierte dieselbe Mannschaft
mit einem Torwart als Spielfigur anderthalb Tore je Spiel statt 1,3.

**Überall, wo sonst Tore stehen, steht bei ihm die Null:** in der Saisonbilanz, in der
Karrieretabelle, bei den Bestmarken (längste Serie ohne Gegentor), im Vergleich mit deinem
Rivalen — der für einen Torwart auch ein Torwart ist —, in der Wahl zum Weltfußballer und
in den Legacy-Punkten. Drei eigene Traineraufträge kommen dazu.

## Geld

Geld war lange eine Zahl, die nur nach oben ging: Gemessen lagen am Karriereende im Median
29 Mio € auf dem Konto, während alles Kaufbare zusammen 17 Mio € kostete. Ab der Mitte der
Karriere war jede Entscheidung schon getroffen. Das ist umgestellt.

**Das Gehalt ist die Haupteinnahme** und an echten Zahlen geeicht. Es hängt an der Stärke
deines Vereins und daran, wie du im Verhältnis dazu stehst — wer über dem Niveau seiner
Mannschaft spielt, verdient mehr als der Rest, wer darunter liegt, wird wie ein Bankspieler
bezahlt:

| Verein | Beispiel | Gehalt auf Vereinsniveau |
|---|---|---|
| Stärke 43 | League Two | rund 60.000 € im Jahr |
| Stärke 46 | 3. Liga | rund 85.000 € |
| Stärke 55 | Championship, Serie B | rund 230.000 € |
| Stärke 60 | 2. Bundesliga | rund 390.000 € |
| Stärke 71 | Bundesliga-Mittelfeld | rund 1,3 Mio € |
| Stärke 85 | Spitzenverein | rund 6 Mio € |
| Stärke 93 | Bayern, Real | rund 15 Mio € |

**Werbung ist ein Zubrot, kein zweites Gehalt.** Vorher brachten drei Sponsorenverträge das
Sechsfache dessen, was der Verein zahlte — sie trugen die ganze Wirtschaft allein. Jetzt
bleiben selbst die Verträge eines Weltstars unter seinem Vereinsgehalt.

**Steuern.** Auf Gehalt und Werbung gehen 43 bis 50 % weg, je nach Land, in dem du spielst,
auf Kapitalerträge 26 %. Die Wochenbilanz zeigt jede Zeile einzeln. Saudi-Arabien zahlt
keine Steuer und obendrein mehr als das Doppelte — der Grund, warum am Ende einer Karriere
dort das Telefon klingelt.

**Laufende Kosten.** Der Stab kostet Wochengehalt, fast jede Anschaffung danach Unterhalt:
Der Sportwagen 400 € pro Woche, die Villa 1.600 €, der Privatjet 7.000 €, die Stiftung
4.000 €. Reicht das Konto nicht, wird erst der Stab zurückgestuft und entlassen — und wenn
niemand mehr da ist, unter Wert verkauft.

**Anlagen** werfen gut zehn Prozent im Jahr ab statt der früheren zwanzig. Eine Anlage mit
22 hat sich Mitte dreißig bezahlt gemacht, eine mit 33 nicht mehr — damit ist auch der
Zeitpunkt eine Entscheidung.

Gemessen über 30 Karrieren kauft sich eine durchschnittliche Karriere davon drei bis fünf
der zehn Anschaffungen und hält zwischen 17 und 33 der 39 Stabstufen; nur eine einzige
Karriere kam auf alles. Der Kontostand am Ende liegt im Median bei 1,5 Mio € statt bei 29.

## Wunschverein

Beim Berater kannst du einen bestimmten Verein als Ziel angeben. Er arbeitet dann gezielt
daran, statt nur allgemein den Markt zu sondieren — und sagt dir vorher, was er davon hält:
„machbar", „schwierig", „sehr schwierig", „fast aussichtslos" oder „chancenlos".

Nennen darfst du jeden der 182 Vereine. Es kostet acht Punkte Trainer-Vertrauen — dein Verein
erfährt davon — und zwei Prozent deines Marktwerts als Beratervorschuss. Der Wunsch bleibt
bestehen, bis er erfüllt ist oder du ihn zurückziehst; wirst du im Lauf der Jahre besser, öffnet
sich ein vorher chancenloses Ziel von selbst.

Die Chance hängt davon ab, wie weit der Verein über deinem Niveau steht. **Ab zwölf Punkten
Abstand ist sie null, nicht bloß klein.** Mit einer Restchance von einem Prozent hätte sich über
zwanzig Transferfenster jedes Ziel von selbst erfüllt: Im Test landete ein Spieler mit Stärke 75
in drei von vier Karrieren bei Bayern.

Gemessen: Ein 1. FC Heidenheim erscheint für einen passenden Spieler ohne Wunsch in 0 Prozent
der Transferfenster — er macht dir von sich aus nie ein Angebot. Mit Wunsch in 92 Prozent, genau
der angesagten Chance.

## Der Auftrag

Der Trainer hat bisher nur entschieden, **ob** du spielst. Sobald angepfiffen war, existierte
er nicht mehr. Jetzt gibt er der Startelf vor dem Anpfiff eine Aufgabe — sie steht in der
Anpfiffmeldung, ohne zusätzlichen Knopf, denn vierzig Spiele pro Saison vertragen keine
weitere Abfrage.

Dreizehn Aufträge, gefiltert nach Position und gewichtet nach der Spielidee des Trainers: Der
offensive verlangt ein Tor oder eine Vorlage, der defensive die Null hinten, der akribische
Fehlerfreiheit, der ergebnisorientierte drei Punkte, der Talentförderer, dass ein Junger sich
zeigt statt sich zu verstecken. Sein Stil macht den passenden Auftrag viermal so
wahrscheinlich — aber nicht zum einzig möglichen, sonst käme bei demselben Trainer immer
dasselbe.

Geprüft wird ausschließlich gegen Zahlen, die der Spieltag ohnehin führt. Erfüllt heißt Note
−0,35 und Trainer-Vertrauen +4, verfehlt +0,2 und −2. Die Anpassung läuft über die Note und
nicht daneben, damit Form, Moral und Vertrauen ihr ohne zweite Rechnung folgen.

Gemessen über rund 6.000 Aufträge: Die Schwierigkeit reicht von „zwei Tore" (12 % bei einem
Spitzenstürmer) bis „ohne Karte, aber sichtbar" (66 %), im Schnitt 43 %. **Wer für den Auftrag
spielt, kommt auf 51 % statt 41 %** — ein spürbarer, aber kein überwältigender Hebel, und das
ist Absicht: Ein Versuch mit doppelter Wirkung machte die Sache schlechter, weil ein Stürmer,
der nur noch den Auftrag im Kopf hat, weniger Tore schießt und am Ende die schlechtere Note
bekommt. Der Auftrag soll gutes Fußballspielen würzen, nicht ersetzen.

## Der Weg nach oben

Auf- und Abstieg passieren gut dreimal pro Karriere — das war bisher eine Zeile im
Saisonbericht. Jetzt hängt daran ein Bogen.

**Vor dem Anpfiff** steht die Zuschauerzahl. Sie folgt der Stärke des Heimvereins und macht
den Unterschied zwischen den Stufen erst spürbar: gemessen im Median 25.300 in der ersten
Liga, 11.900 in der zweiten, 4.300 in der dritten und 1.400 in der vierten. In der
Regionalliga stehen tausend Leute am Zaun, in München sitzen fünfzigtausend.

**Auf den letzten fünf Spieltagen** sagt der Ticker, worum es geht: „Platz 1. Ihr steht auf
einem Aufstiegsplatz — heute geht es darum, ihn zu verteidigen." oder „Nur zwei Punkte trennen
euch vom Abstiegsplatz." Eine erste Fassung zeigte das über die letzten vierzig Prozent der
Saison und kam damit auf 1.827 Meldungen in 483 Saisons — so oft nutzt es sich ab. Jetzt sind
es gut eine pro Saison, und ein entscheidender letzter Spieltag kommt in gut jeder vierten vor.

**Aufstieg und Abstieg** bekommen einen eigenen Bildschirm am Saisonende, mit Platz, Zielliga
und deiner Bilanz. Der Aufstieg bringt Moral, Ruf und Follower, der Abstieg kostet Moral und
Trainer-Vertrauen — und lässt offen, ob du mit hinuntergehst.

**Die Pokalsensation.** Wirfst du einen Verein aus dem Pokal, der zwölf Stärkepunkte über
deinem liegt, wird das ein Höhepunkt für die ganze Laufbahn. Gemessen passiert das etwa einmal
pro Karriere — selten genug, dass es eine Geschichte bleibt.

**Presse nach Ligastufe.** In der Regionalliga wartet keine Journalistin im Spielertunnel:
Die Wahrscheinlichkeit eines Interviews fällt von 34 % in der ersten Liga auf 11 % in der
vierten.

**Die österreichische Bundesliga** spielt jetzt dreifach statt doppelt: 33 statt 22 Spieltage.
Mit zwölf Vereinen hatte sie vorher weniger Spiele als ihre eigene zweite Liga mit dreißig —
wer aufstieg, spielte dadurch weniger, und das ist offensichtlich verkehrt herum.

## Ligen und Startländer

Dreiundzwanzig Ligen in acht Ländern, 442 Vereine. Sieben Länder haben einen Unterbau und sind
damit als Startland wählbar:

| Land | Ligen | Spieltage |
|---|---|---|
| 🇩🇪 Deutschland | Bundesliga · 2. Bundesliga · 3. Liga | 34 / 34 / 38 |
| 🏴󠁧󠁢󠁥󠁮󠁧󠁿 England | Premier League · Championship · League One · League Two | 38 / 46 / 46 / 46 |
| 🇪🇸 Spanien | LaLiga · LaLiga Hypermotion · Primera Federación | 38 / 42 / 38 |
| 🇮🇹 Italien | Serie A · Serie B · Serie C | 38 / 38 / 38 |
| 🇫🇷 Frankreich | Ligue 1 · Ligue 2 · Championnat National | 34 / 34 / 34 |
| 🇦🇹 Österreich | Bundesliga · 2. Liga · Regionalliga Ost | 22 / 30 / 30 |
| 🇳🇱 Niederlande | Eredivisie · Eerste Divisie · Tweede Divisie | 34 / 38 / 34 |

Dazu die Saudi Pro League als Ziel für späte Karrierejahre, ohne Unterbau und darum kein
Startland. Auf- und Abstieg laufen in jedem Land durch die ganze Pyramide — in England über
vier Stufen.

**Der Weg bestimmt die Stufe, nicht die Liga.** Wunderkind startet ganz oben, das
Nachwuchsleistungszentrum eine Stufe darunter, der Straßenkicker ganz unten. In England heißt
das League Two, in Österreich die Regionalliga Ost, in Italien die Serie C. Danach kommen wie
bisher drei Vereinsvorschläge aus den schwächeren siebzig Prozent dieser Liga. Wohin du später
wechselst, bleibt offen: Gemessen über alle einundzwanzig Kombinationen aus Land und Weg
erreicht ein Spieler aus der Tweede Divisie oder der Regionalliga im Lauf einer Karriere die
Premier League oder die Serie A.

Weil die Spielzeiten jetzt zwischen 22 und 46 Spieltagen liegen, ist „Tore pro Saison" kein
vergleichbares Maß mehr — der Abschnitt Balance zählt deshalb Tore pro Spiel.

Die Vereinslisten der dritten Ligen (Serie C, Primera Federación, Regionalliga Ost,
Championnat National, Tweede Divisie) sind der ungenaueste Teil der Daten: Dort spielen zum
Teil Halbprofis in regionalen Gruppen, und die Zusammensetzung wechselt jedes Jahr. Die Namen
sind echt, die Gruppen aber zusammengestellt statt abgebildet.

## Leihe

Wer auf seiner Position nicht die erste Wahl ist, saß bisher fest: für einen festen Wechsel ist
er seinem Verein zu wertvoll, zum Spielen steht er zu weit hinten. Genau dafür gibt es die
Leihe. Der Vertrag beim Stammverein läuft weiter, gespielt wird woanders.

**Wann.** Im Sommer- und im Winterfenster, wenn du auf deiner Position nicht die Nummer eins
bist und in weniger als 45 % der Wochen in der Startelf standest. Über den Berater lässt sich
die Schwelle auf 80 % anheben, verliehen wird aber auch dann nur, wer nicht gesetzt ist. Ab 31
gibt es keine Leihe mehr — wer in dem Alter nicht spielt, wechselt fest oder hört auf.

**Wohin.** Zwei bis vier Vereine fragen an, mit Liga, Teamstärke und der zu erwartenden Rolle.
Der Zielverein muss deutlich schwächer sein als dein eigener *und* schwächer als du selbst —
sonst ist es keine Leihe, nur ein Ortswechsel. Ohne diese zweite Bedingung landete im Test ein
Kölner Reservist bei Heidenheim und saß dort genauso auf der Bank.

**Wie lange.** Eine Sommerleihe läuft eine ganze Saison, eine Winterleihe die Rückrunde. Beide
enden zum Saisonende. Ist es gut gelaufen — mindestens 14 Spiele und ein Notenschnitt von 3,35
oder besser —, darf der Leihverein dich fest verpflichten; du entscheidest. Sonst kehrst du
zurück, mit spürbar mehr oder etwas weniger Trainer-Vertrauen als vorher. Die Leihe führt eine
eigene Bilanz, damit bei einer Winterleihe nicht die Hinrunde beim Stammverein mitzählt.

Gemessen über 690 Saisons: gut die Hälfte aller Karrieren enthält mindestens eine Leihe, im
Schnitt 1,3 pro Karriere, praktisch alle zwischen 17 und 23. Ein Fünftel endet mit einer festen
Verpflichtung. Der Effekt: **rund 22 % mehr Pflichtspiele bis zum 21. Geburtstag** und etwa 9 %
mehr Spiele, Tore und Legacy-Punkte über die gesamte Karriere. Die Leihe beschleunigt die
Entwicklung, sie hebt nicht die Decke.

## Bestmarken

Im Profil stehen die Rekorde einer Karriere: meiste Tore in einem Spiel, beste Note, längste
Serie mit einem Treffer, längste Serie ohne Niederlage, höchster Marktwert — jeweils mit
Gegner und Saison. Dazu die Saisonbestwerte (Tore, Vorlagen, Notenschnitt, Stärke) und die
Karriere in Zahlen: Spiele, Tore, Vorlagen, Vereine, Ligen, Titel, Länderspiele.

Mitgeschrieben wird nur, was sich später nicht mehr rekonstruieren lässt — was in einem
einzelnen Spiel passiert ist und wie lange eine Serie gehalten hat. Alles Übrige rechnet die
Ansicht aus dem Karriereverlauf aus, statt es ein zweites Mal zu speichern und damit eine
weitere Stelle zu schaffen, die auseinanderlaufen kann.

## Nationalmannschaft

Länderspiele laufen über denselben Bildschirm wie Vereinsspiele — mit Schlüsselmomenten, Note,
Verletzungsrisiko und allem anderen. Dafür treten Nationen als Pseudo-Vereine auf, mit
Trikotfarben, Kürzel und Stärke; der Spieltag-Ablauf musste nicht verdoppelt werden.

**Der Kader** entsteht aus den echten Spielern, die der Nation angehören — quer durch alle
Ligen, auf die laufende Saison fortgeschrieben, nach Positionen aufgebaut (3 Torhüter, 4
Innenverteidiger, 2 Sechser und so weiter). Damit ist der Platz in der Nationalelf keine
Würfelsache mehr: Als deutscher Mittelstürmer stehst du hinter Havertz, Undav und Woltemade,
als österreichischer Innenverteidiger hast du es deutlich leichter. Fehlt auf einer Position der
Nachwuchs, weil die bekannten Spieler längst aufgehört haben, stellt der Verband trotzdem
jemanden auf Landesniveau auf — sonst wärst du nach fünfzehn Jahren automatisch die Nummer eins
deines Landes.

**Eingeladen** wird, wer zu den ersten seiner Position zählt; wer zweimal in Folge dahinter
fällt, fliegt wieder heraus. Die Zahl der Plätze richtet sich nach der Position: vier für
Innenverteidiger, zwei für Sechser.

**Der Bundestrainer** hat eine eigene Spielidee wie ein Vereinstrainer und ein eigenes
Vertrauenskonto. Wer das Halbfinale erreicht, bleibt im Amt.

**Qualifikation und Turnier:** In der Saison vor einem Turnier sind drei der vier
Länderspieltermine Qualifikationsspiele gegen drei Gegner — jeder spielt dreimal, die ersten
zwei fahren hin. Das Turnier läuft dann als Folge einzelner Spiele: drei Gruppenspiele, dann die
K.-o.-Runde.

Gemessen über acht volle Karrieren: alle acht kommen zu Länderspielen, im Mittel 25 Einsätze,
zwölf Turniere und ein Titel; sechsmal verlor jemand seinen Platz im Aufgebot wieder.

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
- Gezielt trainiert, regeneriert und mit Personal: Stärke 88–95, Wechsel bis zu einem der
  Großen, Europapokal und Goldener Ball regelmäßig. Der Abstand zwischen beiden ist der
  eigentliche Reiz: Gemessen über je 24 Karrieren gewinnt gewöhnliches Spiel den Europapokal
  in 0 % aller Saisons, meisterhaftes in 11 %; den Goldenen Ball in 0,2 % gegen 23 %.
- Die Note dreht um **3,5**. Derselbe Wert gilt für Trainer-Vertrauen, Moral, Form und den
  Kurzeinsatz — wandert einer dieser Drehpunkte, schiebt sich das ganze Spiel unbemerkt in
  eine Richtung.
- Torquoten je Position, gemessen über je 30 Karrieren und rund 400 Stammsaisons (ab 25
  Spielen). In Toren pro Spiel, weil die Spielzeiten je nach Land 22 bis 46 Spieltage haben.
  Die Spanne reicht von überlegt gewählt bis immer abgeschlossen:

  | Position | Tore je Spiel | Tore je Stammsaison | Vorlagen |
  |---|---|---|---|
  | Mittelstürmer | 0,82–0,89 | 28–30 | 0,6–1,4 |
  | Flügelstürmer | 0,51–0,65 | 18–22 | 2,8–18,5 |
  | Offensives Mittelfeld | 0,22–0,29 | 7–10 | 5,3–15,1 |
  | Zentrales Mittelfeld | 0,14–0,18 | 5–6 | 6,7–15,5 |
  | Defensives Mittelfeld | 0,08–0,12 | 3–4 | 2,2–9,1 |
  | Außenverteidiger | 0,08–0,13 | 3–4 | 0–4,3 |
  | Innenverteidiger | 0,06–0,10 | 2–3 | 0,1–4,7 |
- Marktwert auf dem Höhepunkt: zweistellige Millionen, mit Weltklasse deutlich darüber.
- Energie eines Stammspielers: Ø 48–60, je nach Umgang mit Regenerationswochen. Wer nicht
  spielt, bleibt naturgemäß frisch — der Karriereschnitt über alle Wochen liegt deshalb höher.
- Ausdauer wirkt sichtbar: Mit hohem Wert sinkt der Anteil der Wochen unter 55 Energie von
  gut 40 % auf rund ein Viertel.
- Ein Attribut erreicht ohne Trainer etwa Potenzial + 6, mit Weltklasse-Trainer rund
  Potenzial + 15. Gemessen über 20 Durchläufe: 84 / 86 / 89 / 93 je Trainerstufe.
- Die drei Startwege sind eine echte Entscheidung, keine Kosmetik. Gemessen über je 21
  Karrieren, Median:

  | Weg | Potenzial | Höchststärke | Tore | Titel | Legacy |
  |---|---|---|---|---|---|
  | Straßenkicker (3. Liga) | 87 | 95 | 350 | 52 | 4235 |
  | Nachwuchsleistungszentrum | 77 | 92 | 334 | 40 | 3716 |
  | Wunderkind (Bundesliga) | 74 | 89 | 368 | 36 | 3804 |

  Der harte Weg hat den höchsten Deckel, das Wunderkind die meisten Tore (früher Start). Der
  Deckel zahlt sich aber nur bei gezieltem Training aus: Wer ohne Plan spielt, fährt mit dem
  Wunderkind besser (Höchststärke 70,0 gegen 67,6).
- Geld ist wieder eine Entscheidung. Über 30 Karrieren mit bestmöglichem Wirtschaften
  gemessen: Spitzengehalt 0,96 bis 9,7 Mio € im Jahr, drei bis fünf der zehn Anschaffungen
  gekauft, 17 bis 33 der 39 Stabstufen besetzt, Kontostand am Ende im Median 1,5 Mio €.
  Genau eine der 30 Karrieren konnte sich alles leisten. Vorher: 29 Mio € Rest auf dem
  Konto, alles gekauft, kompletter Weltklasse-Stab — in jeder einzelnen Karriere.
- Der Torwart spielt sich wie eine eigene Position, wird aber wie jede andere bewertet.
  Gemessen über 14 Karrieren und 8.213 Partien: Notenverteilung 8,7 / 21,9 / 44,6 / 20,9 /
  3,5 / 0,4 Prozent — praktisch deckungsgleich mit der eines Feldspielers (9,6 / 22,4 /
  43,1 / 21,2 / 3,6 / 0,2). In einer Stammsaison: 34 Spiele, 45 Gegentore (1,32 je Spiel,
  derselbe Wert wie bei einem Feldspieler im Team), fünfmal zu Null, Rekord 19. Von den
  Momentausgängen sind 15 Prozent Paraden, 11 Prozent Gegentore, 6 Prozent Nachschüsse.
  Die Höchststärke liegt im Mittelfeld aller Positionen (68 im Median gegen 67 bis 73).
- Verletzungen kosten rund ein Zehntel aller Wochen (bei riskanter Trainingswahl ein Siebtel).
  Gemessen über 20 Karrieren: 21 Verletzungen je Laufbahn, davon vier ab acht Wochen; 18 von
  20 Karrieren erleben mindestens eine lange, acht von 20 eine ab zwanzig Wochen. Ein
  Kreuzbandriss dauert im Schnitt dreissig Wochen. Das Medianalter bei einer langen
  Verletzung ist 30 — genau dort, wo sie am meisten kostet.
- Alle 44 Zufallsereignisse sind erreichbar — geprüft wird das über einen Lauf, der zählt, wie
  oft die Bedingung jedes Ereignisses überhaupt zutrifft, nicht nur, welches gezogen wurde.
- Ein Spielstand überlebt das Fehlen jedes einzelnen Feldes: geprüft über 16 Fassungen, von
  „ohne Leihe" bis zu einem auf Name, Jahr und Woche abgetragenen Stand.
- Trainerwechsel: rund alle drei Saisons einer, gleichmäßig über die fünf Spielideen verteilt.

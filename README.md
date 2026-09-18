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
startet das Spiel ohne Internet und im Vollbild ohne Safari-Leisten.

**Auf Android geht es genauso, und etwas besser.** Chrome bietet die Installation von selbst
an oder man findet sie im Menü unter „App installieren". Anders als auf iOS entsteht dabei
ein richtiger App-Eintrag: eigenes Symbol in der App-Liste, eigener Startbildschirm in den
Vereinsfarben, und `orientation: portrait` wird eingehalten — das Spiel dreht sich nicht mit,
wenn man das Telefon kippt. Alle Bedingungen, die Chrome dafür prüft, sind erfüllt: Manifest
ohne Fehler, Icons in 192 und 512 samt maskabler Fassung, aktiver Service Worker mit
`fetch`-Handler, ausgeliefert über https.

**Android-Geräte sind oft niedriger als ein iPhone.** Geprüft auf 412×915, 360×780, 360×640
und 320×568: kein Querscroll in irgendeinem Reiter, kein Knopf unter der Kante. Gefunden und
behoben wurde dabei ein Fall — auf 360×640 stand der sechste Einstellungsknopf 54 Pixel zu
tief (erreichbar, aber unsichtbar). Auf flachen Fenstern bauen die Wahlknöpfe jetzt enger;
davon profitiert auch das iPhone SE mit seinen 667 Pixeln.

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

## Wappen

Ein Wappen war frueher ein abgerundetes Quadrat mit dem Vereinskürzel darin. Bei 442 Vereinen
reichte das nicht: In der 2. Bundesliga sahen acht von zwölf Vereinen gleich aus — blaues
Quadrat, drei Buchstaben. Gemessen über alle Ligen waren **149 von 442 Vereinen innerhalb der
eigenen Liga verwechselbar** (gleiche Hauptfarbe, gleiches Muster).

Jetzt ist es ein Schild mit einem von neun Mustern: einfarbig, senkrechte Streifen, waagrechte
Bänder, Diagonale, Ring, geviertelt, Chevron, halbiert, Kreuz. **Kein einziges fremdes Bild** —
alles entsteht aus Farbe, Form und Kürzel, die ohnehin in den Daten stehen. Die Datei wächst
dadurch um 3,7 KB, nicht um Megabyte.

**Die Muster werden je Liga kollisionsfrei vergeben.** Ein Hash allein reichte nicht: Er
verteilt gleichmässig, aber drei blaue Vereine bekamen dreimal denselben Ring. Deshalb prüft
`wappenVerteilen()` beim Aufbau, ob die Kombination aus Farbe und Muster in dieser Liga schon
vergeben ist, und rückt sonst weiter. Der Startpunkt kommt aus dem Kürzel, damit ein Verein
sein Wappen über alle Spielstände hinweg behält.

**Die Muster aus den echten Trikots bleiben.** Wo zwei davon in einer Liga kollidieren — die
spanische zweite Liga ist voller rot-weiss gestreifter Vereine — werden stattdessen die beiden
Farben getauscht. Rot-weiss und weiss-rot gestreift sind nebeneinander klar zu unterscheiden.

| | vorher | jetzt |
|---|---|---|
| Muster | 4 | **9** |
| in der eigenen Liga verwechselbar | 149 von 442 | **20 von 442** |
| Dateizuwachs | — | 3,7 KB |

## Das Tutorial

Wer auf einen freien Platz tippt, wird zuerst gefragt: **„Zum ersten Mal hier?"** Zwei Knöpfe —
Tutorial mitnehmen oder nicht. Die Frage steht dort und nicht auf der Startseite, weil genau
dort eine neue Karriere beginnt; jeder der drei Plätze entscheidet für sich.

Es ist **kein eigener Modus und kein Probelauf.** Die Hinweise erscheinen in der richtigen
Karriere, jeder genau einmal und genau dann, wenn die Sache zum ersten Mal vor einem steht.
Man lernt am eigenen Spieler statt an einem Beispiel, und nichts davon wird hinterher
verworfen.

**Sprechblasen an der Stelle, um die es geht.** Der Hinweis zum Wochenplan sitzt über den
sieben Plänen, der zu den Zustandswerten über den vier Zahlen — mit einer Spitze nach unten.
Er blockiert nichts: Der Bildschirm bleibt bedienbar, während die Blase dasteht, und wenn auf
einem Bildschirm mehrere Dinge neu sind, kommt erst die eine und nach „Verstanden" die
nächste. Drei Erklärungen auf einmal wären auf einem Telefon mehr Erklärung als Spiel.
Läge die nächste Blase unter der Bildkante, scrollt der Bildschirm zu ihr — sonst sähe es
so aus, als wäre nach dem „Verstanden" nichts passiert.

Im Spieltag gibt es keine Blasen. Dort ist der Fuß der Ort, an dem ohnehin alles steht und
getippt wird — die Hinweise nutzen deshalb dieselbe Bauform wie die Ansage des Trainers vor
dem Anpfiff. Der Hinweis zur Note hängt sich unter den Notenkasten, statt ihn zu löschen.

**Gesprochen wird vom Berater.** Er gehört schon zum Spiel, hat einen eigenen Bereich und darf
auch über Dinge reden, die den Trainer nichts angehen — Kontostand, Sponsoren, Sicherungscode.
Jeder Hinweis erklärt und **empfiehlt**, ohne zu erzwingen: „Für den Anfang: Techniktraining.
Solide, günstig, und du siehst den Fortschritt sofort." Was du tust, bleibt deine Sache.

Sechzehn Hinweise, verteilt über die erste Saison:

| Wo | Was |
|---|---|
| Erstellung | Position · Spielertyp · Herkunftsweg |
| Heim | Die Woche als Runde · die vier Zustandswerte · Wochenplan · Schwerpunkt |
| Verein | Trainer und Saisonziel · wer dir den Platz streitig macht |
| Markt | Vertrag, Berater und Wochenbilanz — die Blase sitzt über dem Vertrag, wo die Seite anfängt |
| Welt / Presse / Profil | je einer |
| Spieltag | vor dem Anpfiff · beim ersten Schlüsselmoment · zur Note |

In jeder Blase steht ein zweiter Knopf **„Tutorial beenden"**, und hinter dem Zahnrad lässt
es sich jederzeit wieder einschalten — auch mitten in einer laufenden Karriere. Bestehende Spielstände
bekommen kein Tutorial: Die Migration setzt es auf aus.

## Einstellungen

Oben rechts in der Kopfleiste sitzt ein **Zahnrad** — auf jedem der sechs Reiter erreichbar.
Dahinter liegt alles, was nicht zur Karriere gehört, sondern zum Spielstand: der
Speicherzustand, *Jetzt speichern*, der *Sicherungscode*, *Tutorial an/aus*, *Karriere
wechseln* und *Diese Karriere löschen*.

Vorher standen diese fünf Knöpfe mitten im Profil, zwischen Attributen und Titelvitrine. Das
Profil zeigt jetzt nur noch, was zur Laufbahn gehört: Fächer, Formkurve, Saisonzahlen,
Bestmarken, Titel, Höhepunkte und die Karrieretabelle.

Dabei kam ein Fehler ans Licht, den die Umstellung auf drei Plätze hinterlassen hatte:
`data-act="loeschen"` rief `standLoeschen()` **ohne Platznummer** auf. Seit es drei Plätze
gibt, traf das den Schlüssel `.pundefined` — also nichts. „Karriere löschen und neu beginnen"
schickte einen zur Startseite zurück, und der Spielstand stand unverändert da.

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

**Drei Plätze nebeneinander.** Die Startseite zeigt drei Zeilen: belegte mit Wappen, Name,
Verein, Saison und Woche, freie als „Platz 2 — frei". Ein Tipp setzt fort oder legt an, der
Papierkorb daneben löscht genau diesen Platz. Im Spiel führt „Karriere wechseln" im Profil
zurück zur Auswahl — vorher wird gespeichert.

Jeder Platz ist **ein eigenes Dokument**, kein Feld in einem gemeinsamen: Ein Dokument des
dauerhaften Speichers darf 256 KiB groß sein, und ein einzelner Spielstand liegt gemessen
schon bei 117 bis 150 KB. Drei Stände in einem Dokument würden die Grenze sprengen.

Platz 1 behält bewusst die alten Schlüssel (`flutlicht.karriere.v1`) und den alten
Dokumentpfad (`spielstand/karriere`). Ein vorhandener Spielstand **ist** damit Platz 1, ohne
dass irgendetwas umkopiert wird — es gibt keinen Moment, in dem er zwischen zwei Orten
unterwegs wäre. Die Plätze 2 und 3 hängen `.p2` / `.p3` an.

Der Sicherungscode fragt beim Einfügen, auf welchen Platz er soll, und zeigt dabei, was dort
gerade steht; ein freier Platz wird hervorgehoben. Gefragt wird erst, nachdem der Code
gelesen wurde — bei einem unlesbaren Code soll niemand vorher aussuchen, welche Karriere er
dafür opfert.

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
einen — aus einem Vorrat von **127 Situationen** mit je drei Optionen: Kopfball, Volley oder
ablegen; grätschen, leiten oder Tempoduell. Ein Teil davon gehört nur einer einzigen Position:
Der Außenverteidiger hinterläuft und wird überlaufen, der Innenverteidiger räumt ab und rückt
aus der Kette, der Sechser zerstört, der Zehner erfindet. Je nach Position stehen damit 24 bis
27 verschiedene Situationen zur Auswahl statt vorher 14 bis 16. Der Ausgang hängt am passenden Attribut, an der
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

**Welt** — Ein eigener Reiter mit den Tabellen aller 23 Ligen, die Woche für Woche
mitlaufen, der laufenden Torjägerliste deiner Liga mit echten Spielernamen, dem Europapokal
als vollständigem Wettbewerb (24 Teilnehmer, Ligaphase mit Tabelle, K.-o.-Baum bis zum
Finale), deinem Pokalweg, den Titelträgern der vergangenen Saisons und dem Saisonrückblick
zum Nachlesen.

**Die Saison in Europa** — Am Ende jeder Saison ein eigener Bildschirm mit allen 23 Ligen:
Meister, Torschützenkönig, Auf- und Absteiger. Eigener Abschnitt weiter unten.

**Höhepunkte** — Der Verlauf ist ein Ringspeicher und vergisst nach 60 Einträgen. Besondere
Momente bleiben dagegen dauerhaft: Profidebüt, erstes Tor, Dreierpack, Traumnote, Titel,
Länderspieldebüt, Rekordtransfer, schwere Verletzung, jedes 50. Karrieretor und jedes
100. Pflichtspiel. Im Profil als Zeitleiste, am Karriereende als Rückblick.

**Langfristig** — Attribute wachsen mit dem Training und dem Alter gegen dein verborgenes
Potenzial, ab 29 baut der Körper ab. Saisonbilanz mit Torschützenkönig, Spieler der Saison
und Goldenem Ball, Weltrangliste, Titelvitrine, Karrieretabelle über alle Saisons.
Am Schluss: Rücktritt und Legacy-Punkte.

## Was im Laufe der Jahre passiert

Zwischen den Spieltagen zieht das Spiel Wochenereignisse: Der Trainer bittet dich ins Büro,
ein Routinier stellt dich in der Kabine bloss, ein Sponsor klopft an. Der Topf war dafür zu
klein. Gemessen über zehn volle Laufbahnen:

| | vorher | jetzt |
|---|---|---|
| Ereignisse im Topf | 43 | **87** |
| Ziehungen je Laufbahn | 212 | 171 |
| davon verschiedene | 38 | **66** |
| häufigstes Ereignis je Laufbahn | 13–19 mal | **7–10 mal** |

In Saison drei war die Welt noch neu, ab Saison acht kannte man jeden Text. Die Wiederholung
ist jetzt etwa halbiert.

**Die neuen Ereignisse hängen an der Lebensphase.** Sie ziehen nur, solange sie passen —
damit wiederholen sie sich nicht nur seltener, sie stehen auch dort, wo der Spieler gerade
wirklich steht:

- **Die frühen Jahre** (bis etwa 22): der erste Profivertrag, die erste eigene Wohnung, die
  Abschlussprüfung mitten in der Rückrunde, das erste Trikot mit deinem Namen auf dem
  Rücken, der alte Jugendtrainer am Zaun, die U21, das erste richtige Geld, der Freund aus
  der Jugend, der es nicht geschafft hat.
- **Die mittleren Jahre** (22 bis 31): die Beziehung, die unter dem Beruf leidet, Nachwuchs,
  das erste eigene Haus, die grosse Berateragentur, der sichere Tipp eines Mitspielers, die
  freigewordene Rückennummer, die Frage, wer die Elfmeter schießt.
- **Die späten Jahre** (ab 30): der Trainerschein, der Körper, der länger braucht, das
  Angebot aus Übersee, ein Platz in der Geschäftsstelle, die Rolle als Ältester in der
  Kabine, das Abschiedsspiel, der letzte Vertrag mit weniger Gehalt — und das erste
  Punktspiel des eigenen Kindes.
- **Ohne Altersgrenze:** die Dopingkontrolle um sechs Uhr morgens, der liegengebliebene
  Mannschaftsbus, das Gehalt, das drei Wochen später kommt, das Wiedersehen mit dem
  Ex-Verein, der Sprachkurs und das Heimweh im Ausland, die Autogrammstunde im Regen.

**Manches gibt es nur einmal.** Dreiundzwanzig Ereignisse tragen ein Kennzeichen, das sie
nach dem ersten Mal aus dem Topf nimmt — den ersten Profivertrag zweimal zu unterschreiben
wäre albern. Gemessen über zwölf Laufbahnen: kein einziger Verstoß.

**Was die Balance dazu sagt.** Ein größerer Topf verschiebt leicht das ganze Spiel. Gemessen
über je zehn Laufbahnen und rund 3.500 Spiele pro Position, gegen denselben Aufbau vorher:

- Die neuen Ereignisse gaben anfangs **3,33 Moral je Wahl** gegen 1,43 im Bestand — das
  Privatleben war schlicht zu warm. Die großen Momente dürfen groß bleiben, weil sie nur
  einmal kommen; die wiederkehrenden liegen jetzt bei 1,67 gegen 1,49.
- Die neuen Spielsituationen hoben zuerst den Flügelstürmer (+22 % Tore), den Zehner
  (+30 %) und die Vorlagen des Außenverteidigers (+53 %). Sechs Ausgänge wurden
  zurückgenommen; danach liegt alles im Rauschen des Messverfahrens selbst, das bei zehn
  Laufbahnen 10 bis 20 % beträgt. Die Durchschnittsnoten aller acht Positionen bewegen sich
  um höchstens 0,1 — und an der Note hängt alles Weitere.

## Die Saison in Europa

Am Ende jeder Saison steht ein Bildschirm, der durch alle 23 Ligen geht: **Meister,
Torschützenkönig, Aufsteiger, Absteiger** — nach Ländern geordnet, die eigene Liga
hervorgehoben, der eigene Name farbig, wenn du selbst die Torjägerkrone geholt hast. Die
letzten sechs Saisons lassen sich im Welt-Reiter jederzeit nachlesen.

Eine Weile kam der Bildschirm leer heraus — Überschrift, Zeile, Knopf, darunter nichts, beim
Saisonende wie beim Nachschlagen. Der Grund lag nicht im Rückblick, sondern eine Ebene
tiefer: `sagen()` nahm gar kein eigenes Markup entgegen und baute nur die Wirkungspillen.
Wer ihm `extra` mitgab, verlor es stillschweigend. Gefunden hat das erst ein Test, der den
echten Weg geht und das Fenster anklickt wie eine Hand — der Test davor hatte das Fenster
selbst zusammengesetzt und damit genau die Stelle übersprungen, an der es kaputtging.

Dafür mussten zwei Dinge überhaupt erst entstehen:

**Auf- und Abstieg gibt es jetzt in allen Ligen.** Vorher bewegte sich zwischen zwei Ligen
nur dein eigener Verein, und der tauschte mit dem schwächsten beziehungsweise stärksten der
Nachbarliga den Platz. Ausserhalb deiner eigenen Pyramidenstufe stand die Welt still — die
Frage „wer ist wo aufgestiegen“ hatte gar keine Antwort. Jetzt steigen in jedem Land und auf
jeder Stufe die ersten zwei auf und die letzten zwei ab, nach der Abschlusstabelle; pro
Saison bewegen sich damit rund sechzig Vereine statt einem.

Geprüft, ob das die Pyramide zerlegt: nein. Nach 22 Saisons steht der Median der Bundesliga
bei 73 (Start 71), der 2. Bundesliga bei 60 (60), der 3. Liga bei 45 (46) — und kein
einziger Verein einer unteren Liga ist stärker als der Median der Liga darüber. 22 Prozent
der Aufsteiger gehen direkt wieder runter, was ungefähr der Wirklichkeit entspricht.

**Die Torjägerlisten stimmten nicht.** Die Trefferquote eines Ligatorjägers hing an der
absoluten Vereinsstärke gegen eine feste Schwelle von 60. Unterhalb der ersten Liga lag
damit die halbe bis ganze Liga auf dem Mindestwert:

| Liga | bester Torjäger, alte Formel | Vereine auf dem Mindestwert | jetzt (Median) |
|---|---|---|---|
| Bundesliga | 24,5 Tore | 0 von 18 | 26 |
| 2. Bundesliga | 5,7 | 6 von 18 | 22 |
| 3. Liga | **1,5** | **20 von 20** | 21 |
| League Two | **1,8** | **24 von 24** | 20 |
| Regionalliga Ost | **1,2** | **16 von 16** | 20 |

Nach siebzehn Spieltagen standen in der 3. Liga **51 Prozent aller Vereine bei null Toren**.
Und weil dein eigener Stürmer selbst dort auf fünfzehn Tore kommt, wurde er fast
zwangsläufig Torschützenkönig. Jetzt zählt, wie ein Stürmer zu **seiner eigenen** Liga
steht: Ein Torjäger der dritten Liga trifft in seiner Liga genauso oft wie einer der ersten,
und die Krone gewinnt ein gierig gespielter Stürmer in 32 Prozent seiner Saisons statt in
fast allen.

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

**Die letzte Woche ist eine ganze Woche.** Lange stand „noch 1 Woche" da — und in genau
dieser Woche spieltest du. `rehaWoche()` lief ganz oben im Wochenablauf, zog die letzte
Woche ab und setzte die Verletzung auf null; weiter unten in derselben Woche lief der
Spieltag. Gemessen über 350 Verletzungen: **in 93 % von ihnen stand man in der Woche auf dem
Platz, in der es hieß „noch eine Woche"**. Jetzt merkt `rehaWoche()` das Ende nur vor;
freigegeben wird zu Beginn der Woche darauf. Nicht nach dem Spieltag, sondern am
Wochenanfang — weil ein Länderspielturnier später in derselben Woche laufen kann, und dort
spielte in einem ersten Anlauf einer von 381 trotzdem.

**Nach einer schweren Verletzung kommt eine Aufbauwoche.** Der Comeback-Bildschirm sagt
wörtlich „Heute stehst du zum ersten Mal wieder in der vollen Einheit" — und danach spielte
man. Jetzt stimmt beides überein: eine Woche volles Training, kein Einsatz, ab der Woche
darauf bist du wieder eine Option. Nur ab acht Wochen Ausfall, eine Zerrung über zwei Wochen
braucht das nicht. Gemessen: 1,18 Spiele je schwerer Verletzung fallen in die Aufbauwoche.

**Der Ausfall ist kein Loch mehr.** Sechs Ereignisse gibt es nur, während du nicht spielst:
dein Vertreter trifft doppelt und die Zeitung nennt ihn „die Lösung, die keiner gesucht
hat"; zwei Mitspieler stehen mit Kaffee in der Behandlungskabine; die Presse rechnet vor,
wie wenige nach dieser Verletzung ihr Niveau wiederfinden; der Trainer ruft an einem
Sonntagabend an; drei Uhr nachts rechnest du dein Alter gegen deinen Vertrag; ein Spezialist
im Ausland bietet eine zweite Meinung an, die zwei Wochen sparen kann oder 28.000 € kostet.
Gemessen 0,8 je Verletzung — die letzte Woche bleibt frei, die gehört dem Comeback.

**Ereignisse behaupten nichts mehr über Spiele, die du nicht gespielt hast.** „Im Interview
hast du die Schiedsrichterleistung zerlegt" hatte gar keine Bedingung, „Drei schwache Spiele
hintereinander" prüfte nur die Saisonsumme. Gemessen feuerten **629 Ereignisse, während das
letzte Spiel drei Wochen oder länger her war** — nach einer langen Verletzung las man dann,
man habe schlecht gespielt, obwohl man überhaupt nicht gespielt hatte. Acht Ereignisse
prüfen jetzt `frischGespielt()`: höchstens zwei Wochen ohne Einsatz, und nicht in der
Aufbauwoche. In der Endwoche der Verletzung kommt gar kein Zufallsereignis mehr (vorher:
35 % aller Verletzungen).

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

**Sechsundzwanzig eigene Schlüsselmomente,** in denen es fast nie ums Toreschießen geht: die Flanke in
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

**Sponsoren melden sich, wenn Reichweite da ist.** Die Anfrage stand vorher als eines von
siebenundzwanzig Ereignissen in einem Topf, aus dem nur jede dritte Woche überhaupt gezogen
wurde — gemessen 4,6 % Anteil daran. Vom Erreichen der 25.000 Follower bis zum ersten
Angebot vergingen im Median 40 Wochen, in einem Viertel der Fälle über 100. Mit einer
Viertelmillion Followern konnte man Saison um Saison auf den ersten Vertrag warten, ohne
dass an der Reichweite irgendetwas hing. Jetzt würfelt der Sponsor eine eigene Woche, und
die Chance hängt daran, wie weit du über der Schwelle für den nächsten freien Platz liegst:

| Followerschwelle | für den … Vertrag |
|---|---|
| 25.000 | ersten |
| 150.000 | zweiten |
| 900.000 | dritten |

Direkt an der Schwelle meldet sich etwa alle 17 Wochen jemand, beim Zehnfachen alle sechs;
der Ruf verschiebt das um ±30 %. Nach jeder Anfrage sind 5 bis 11 Wochen Ruhe. Gemessen über
12 Karrieren: erste Anfrage im Median 15 Wochen nach den 25.000 statt 40, längste Wartezeit
27 Wochen statt 273. Auf dem Social-Bildschirm steht jetzt, wie viele Follower bis zum
nächsten Platz fehlen.

Damit die Werbung dabei ein Zubrot bleibt, hängt das Angebot nicht mehr allein an der
Reichweite, sondern auch am Vereinsgehalt. Ohne diese Bindung zahlten drei Verträge einem
Spieler mit einer Million Followern in einem Mittelfeldverein mehr als sein Beruf — gemessen
**40,2 Mio € Werbeeinnahmen gegen 24,2 Mio € Gehalt** über eine Karriere, bei einem
Kontostand am Ende von 5,6 statt 1,5 Mio €.

Der Deckel liegt bei knapp einem Fünftel des Wochengehalts je Vertrag, ist aber **weich**:
Ein harter Deckel hätte in 96 % aller Angebote gegriffen — dann hätte die Reichweite nur
noch entschieden, *ob* jemand anfragt, und nicht mehr, *was* er bietet. Darüber zahlt die
Reichweite deshalb logarithmisch weiter. Wer viel größer ist als sein Verein, holt mehr
heraus, aber nicht beliebig viel:

| Alter | Median je Woche | im Jahr | Anteil am Wochengehalt |
|---|---|---|---|
| 17–21 | 1.800 € | 93.600 € | 18 % |
| 22–26 | 3.400 € | 176.800 € | 20 % |
| 27–31 | 6.300 € | 327.600 € | 21 % |
| 32+ | 6.100 € | 317.200 € | 23 % |

Unterm Strich: viermal so viele Anfragen wie vorher, in der Summe dasselbe Geld —
9,8 Mio € Werbeeinnahmen über eine Karriere gegen vorher 9,5.

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

## Weltrangliste und Karriereende

Die Weltrangliste ist die Wertung der Fachpresse: 22 Weltstars plus du, sortiert nach Toren,
Vorlagen, Note, Titeln, Stärke und Vereinsstärke. Zwei Dinge stimmten daran nicht.

**Die eigene Zeile fehlte.** Gezeigt wurden die ersten zehn — und der eigene Spieler stand
gemessen über 368 Saisons im Median auf Platz 23 von 23, in 0 % aller Saisons unter den
ersten zehn. Man sah also fast nie, wo man selbst steht. Jetzt hängt die eigene Zeile
darunter, mit dem echten Platz und einer Zeile darüber, wie viele es insgesamt sind.

**Es gab keine Torhüter.** Der Positionstopf der Weltstars war `ST, ST, FL, FL, OM, ZM, IV` —
ein Torwart spielte gegen ein Feld, in dem seine Position nicht vorkam, und wurde an Toren
gemessen, die er nie schießen wird. Jetzt sind es rund zehn von 54, und sie rechnen in
derselben Währung wie er: die Null zählt für den Torwart, was das Tor für den Stürmer zählt.
In der Tabelle steht bei ihnen die Zahl der Spiele zu Null.

**Die Weltstars bekamen ihre Saison auf einmal.** `starsSaison()` würfelte jedem seine
kompletten Saisonzahlen in dem Moment, in dem die alte Saison endete — während die
Ligatorjäger seit jeher Spieltag für Spieltag mitwachsen. In den ersten Wochen einer neuen
Saison stand man deshalb mit null Toren gegen Stürmer mit 26, aus einer Saison, die noch
niemand gespielt hatte. Gemessen über 598 Saisons, jeweils in **Woche 3**:

| | bester Stern | eigener Platz (Median) |
|---|---|---|
| vorher | 26 Tore | 23. von 23 |
| jetzt | 3 Tore | 19. von 55 |

Derselbe Fehler entschied den Goldenen Ball: Der Weltrang wurde erst berechnet, nachdem die
Weltspitze gealtert und neu ausgewürfelt war — die abgelaufene Saison des eigenen Spielers
wurde also gegen die Zahlen der *nächsten* verglichen. Jetzt wird erst gewertet, dann
gealtert. Für einen meisterhaft gespielten Spieler steigt die Quote dadurch von 10,2 auf
15,4 % aller Saisons, weil beide Seiten dieselbe Saison zeigen.

**Das Feld hatte keine Mitte.** 22 Weltstars zwischen Stärke 83 und 93 — und du. Dazwischen
nichts. Ein gewöhnlich gespielter Spieler (Höchststärke 71) stand damit in 98 % aller
Saisons auf dem letzten Platz, zwanzig Jahre lang, ohne dass sich je etwas bewegte. Eine
Liste, auf der man sich nicht bewegen kann, sagt nichts. Jetzt sind es 54 in drei Stufen:

| Stufe | Anzahl | Stärke | Vereine |
|---|---|---|---|
| Weltspitze | 22 | 83–93 | ab Stärke 76 |
| internationale Klasse | 16 | 76–84 | 66–86 |
| solide Stammspieler | 16 | 69–77 | 55–75 |

Gemessen über 598 Saisons je Spielweise:

| | Median-Platz | bester Platz einer Laufbahn | unter den ersten 10 | Goldener Ball |
|---|---|---|---|---|
| gewöhnlich (Stärke 71) | 45. von 55 | 28. | 1,3 % | 0 % |
| meisterhaft (Stärke 94) | 22. von 55 | 9. | 25,4 % | 15,4 % |

Aus einem toten letzten Platz wird damit eine Leiter: Eine gewöhnliche Laufbahn klettert von
etwa 50 auf 28, eine meisterhafte bis ganz nach oben. Der Spielstand wächst dadurch von 109
auf 117 KB — die Raten der Sterne sind aus Stärke, Position und Saisonlänge ableitbar und
werden deshalb nicht mitgespeichert.

**Ein Fehler beim Wintertransfer.** `starteSaisonTeilweise()` sichert vor dem Ligawechsel
Tabelle und Weltdaten und stellt sie danach zurück. Für die Sterne genügte das nicht:
`weltAufsetzen()` baut ein neues Objekt, der alte Verweis bleibt also heil — `starsSaisonStart()`
setzt die Sterne dagegen *an Ort und Stelle* zurück, und ein zweiter Verweis auf dasselbe
Feld zeigt danach auf dieselben genullten Objekte. Gemessen stand der beste Torschütze der
Welt in Woche 10 bei acht Toren und in Woche 20 bei zwei. Jetzt wird eine echte Kopie
gesichert; die Kurve läuft über 34 Spieltage monoton 0 → 4 → 8 → 14 → 23.

**Die Legacy-Stufen.** Am Karriereende steht eine von fünf Stufen. Zwei davon waren
unerreichbar: Die beste je erreichte Stärke zählte mal drei, das waren für jeden, der
überhaupt Profi wurde, rund 250 geschenkte Punkte — gemessen kam über 16 Laufbahnen keine
einzige unter 599 Punkte, gegen Grenzen bei 280 und 550. Jetzt zählt nur, was über dem Wert
eines Reservisten liegt, und die Grenzen stehen dort, wo die gemessene Verteilung
auseinanderfällt:

| ab | Stufe | wer das ist |
|---|---|---|
| 0 | Ein ehrlicher Arbeiter | Laufbahn vor der neunten Saison zu Ende |
| 280 | Solider Profi | rund 9 bis 15 Saisons |
| 600 | Ein Großer seiner Liga | durchgespielt, ohne die ganz großen Titel |
| 1.100 | Weltklassespieler | Europapokal, Goldener Ball, Nationalelf |
| 1.800 | Legende des Weltfußballs | mehrfach davon |

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
er nicht mehr. Jetzt gibt er der Startelf vor dem Anpfiff eine Aufgabe.

**Man muss durch sie hindurch.** Anfangs stand der Auftrag als eine Zeile im Ticker — und war
nach drei Meldungen weggescrollt. Jetzt ist er ein eigener Bildschirm mit dem Namen des
Trainers, seinem Wortlaut und der Aufgabe hervorgehoben; **sein Knopf ist der Anpfiff selbst**,
er kostet also keinen zusätzlichen Druck. Vierzig Spiele pro Saison vertragen keine weitere
Abfrage. Danach bleibt der Auftrag als schmale Leiste unter dem Spielstand stehen, das ganze
Spiel lang, und wechselt am Ende auf grün oder rot.

**Und man bekommt auch Gelegenheiten dazu.** Die Momente eines Spiels wurden gewürfelt, ohne
den Auftrag zu kennen — die beiden wussten nichts voneinander. Ein Außenverteidiger mit dem
Auftrag „Eine Vorlage geben" spielt in der Momentgruppe *Abwehr*, und dort bieten nur **3 von
14** Momenten überhaupt eine Vorlage an: Die Wahrscheinlichkeit, dass beide gewürfelten
Momente eine hergaben, lag bei **3 %**. Eine Aufgabe ohne Gelegenheit.

Jeder Auftrag trägt jetzt, welche Momentausgänge ihn erfüllen können, und der Spielverlauf
wird nach dem Auftrag gebaut statt davor: **Beide Momente eines Startelfspielers bieten einen
passenden Ausgang an** — gemessen über 3.227 Aufträge in 100 % der Fälle. Auch der Elfmeter,
der in 12 % der Spiele einen Moment ersetzt, nimmt nicht mehr ausgerechnet den, auf den es
ankommt.

Das hat einen Preis, und der steht hier: Ein Außenverteidiger kommt dadurch auf 0,17 Tore je
Spiel statt 0,13, ein offensiver Mittelfeldspieler auf 0,32 statt 0,29 — wer eine echte
Gelegenheit bekommt, nutzt sie manchmal auch. Die Erfüllungsquote steigt von 53 auf **61 %**
für den, der für den Auftrag spielt, gegen 52 % für den, der ihn ignoriert.

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

**Er kommt aus deiner Liga, so weit die Daten das hergeben.** Vorher wurde er aus ganz Europa
gezogen. Streng geht es nicht: `ECHTE_KADER` kennt nur die sechs obersten Ligen — alles
darunter und die ganze Eredivisie haben keine echten Kaderdaten, und eine Karriere, die in der
3. Liga oder der Championship beginnt, hätte damit gar keinen Rivalen mehr. Deshalb
gestaffelt, wobei die Position in jeder Stufe gesetzt bleibt (sie ist für den Vergleich
wichtiger als die Liga): eigene Liga → eigenes Land → irgendwo. Und lieber den Jahrgang etwas
weiter fassen als die Liga verlassen — innerhalb der eigenen Liga wird auf 23 Jahre und
Stärke 66 gelockert, bevor die nächste Stufe drankommt.

Gemessen über 1.344 echte Karrierestarts:

| | vorher | jetzt |
|---|---|---|
| aus der eigenen Liga oder dem eigenen Land | 54 % | **84 %** |
| aus einer fremden Liga | 46 % | **16 %** |

Die verbleibenden 16 % sind genau zwei Fälle: **die Niederlande**, wo für keine einzige
Position Kaderdaten vorliegen, und **spanische Torhüter** — junge Keeper gibt es in den Daten
praktisch nur in der Ligue 1. Für Deutschland, England, Italien, Frankreich und Österreich
bleibt der Rivale auf allen acht Positionen im eigenen Land.

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
ab 2046 keiner mehr. Saison 1 entspricht dabei exakt der Vorlage.

**Der Bestand: 2.332 echte Spieler in 122 Vereinen.** Die fünf großen Ligen und die
österreichische Bundesliga sind mit vollen Kadern von zwanzig bis zweiundzwanzig Spielern
hinterlegt, vorher waren es zwölf. Vierzehn Vereine der Vorlage stehen im Spiel eine Liga
tiefer — Schalke, Elversberg, Hull City, Málaga — und bekommen ihre Kader dort. Damit haben
auch zweite Ligen echte Namen.

**Die Balance ändert sich dadurch nicht.** Ein Kader wird immer auf dieselbe Größe
aufgefüllt: Mehr echte Spieler ersetzen erfundene, statt zusätzlich zu kommen. Gemessen über
je sechs Laufbahnen pro Position ist die Zahl der Konkurrenten auf der eigenen Position vorher
wie nachher identisch (Torwart 3,0 · Innenverteidiger 4,0 · Sechser 2,0). Auch die
Kaderstärke passt zur Vereinsstärke: Median drei Punkte Abweichung, nur zwei von 121 Vereinen
liegen mehr als acht daneben.

**Ein Satz zu jedem Spieler.** 2.164 Beschreibungen, angezeigt dort, wo man den Spieler sieht:
in der Rangfolge auf der eigenen Position und im Kader. Sie hängen am Namen, nicht am
Kadereintrag — ein Spieler wechselt im Lauf einer Karriere den Verein, sein Satz bleibt
derselbe. Und sie landen nie im Spielstand: Der liegt vorher wie nachher bei 111 KB, gegen
eine Grenze von 256.

**Achtundsiebzig weitere Herkunftsländer.** Die echten Kader bringen Dänen, Senegalesen und
Schotten mit — Länder, die keine spielbare Nationalelf sind. Sie stehen in einem schmalen
Register mit Name und Flagge, ohne Stärke und Namenspool, damit die Nationalelf-Logik sie
nicht mitschleppen muss. Die Flagge entsteht aus dem Ländercode selbst; nur die britischen
Landesteile und der Kosovo brauchen eine eigene.

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
  | Offensives Mittelfeld | 0,26–0,32 | 9–11 | 5,3–15,1 |
  | Zentrales Mittelfeld | 0,14–0,18 | 5–6 | 6,7–15,5 |
  | Defensives Mittelfeld | 0,08–0,12 | 3–4 | 2,2–9,1 |
  | Außenverteidiger | 0,13–0,17 | 4–6 | 0–4,3 |
  | Innenverteidiger | 0,06–0,10 | 2–3 | 0,1–4,7 |
- Marktwert auf dem Höhepunkt: zweistellige Millionen, mit Weltklasse deutlich darüber.
- **Die Pausen füllen den Tank.** Die Sommerpause gab früher zehn Punkte Energie, die
  Winterpause gar nichts — wer ausgelaugt in den Mai ging, startete ausgelaugt in den August.
  Jetzt füllen beide auf, so weit der Körper es im jeweiligen Alter noch hergibt: bis 29 auf
  100, danach zwei Punkte weniger je Jahr, mit 35 noch 88. Die Winterpause kostet dafür vier
  Punkte Rhythmus — frisch, aber nicht im Spielfluss. Gemessen über 288 Winterpausen: Energie
  64 → 100 im Median, bei den über 33-Jährigen 86.
- Das Ereignis „Zwei Wochen frei" gibt deshalb keine Energie mehr, sondern entscheidet, was
  du sonst aus den zwei Wochen mitnimmst: Kopf frei (Moral, kostet Rhythmus), individuelles
  Programm (Ausdauer und Rhythmus, kostet Moral) oder Heimatverein (Moral und Ruf).
- Energie über eine ganze Karriere, gemessen über je fünf Spielweisen. Die Pausen heben vor
  allem den unteren Rand — wer gar nicht regeneriert, kommt zweimal im Jahr trotzdem voll
  zurück:

  | Spielweise | Ø Energie | Wochen unter 55 |
  |---|---|---|
  | nur Techniktraining | 64,0 → **75,8** | 41 % → **18 %** |
  | Technik, Regen unter 50 | 74,9 → **75,2** | 12 % → **16 %** |
  | jede 3. Woche Ausdauer | 66,6 → **72,9** | 26 % → **15 %** |
  | Doppelschichten durchgehend | 50,0 → **60,7** | 61 % → **40 %** |

  Der Preis steht in derselben Tabelle: Die Regenerationswoche war vorher elf Punkte Energie
  wert (64,0 gegen 74,9), jetzt ist der Unterschied verschwunden. Wer den Tank zweimal im
  Jahr geschenkt bekommt, muss ihn unterwegs seltener selbst füllen.
- Wer nicht spielt, bleibt naturgemäß frisch — der Karriereschnitt über alle Wochen liegt
  deshalb höher als der eines Stammspielers in der Saison.
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
- Sponsorenanfragen, gemessen über 12 Karrieren: erste Anfrage im Median 15 Wochen nach den
  25.000 Followern (vorher 40, längstenfalls 273), Wochenchance im Schnitt 20 %, rund 30
  Angebote über eine ganze Laufbahn, keine Karriere ohne Angebot. Die Werbung bleibt trotzdem
  ein Zubrot: 9,8 Mio € über die Karriere gegen 19,3 Mio € Gehalt — mehr Anfragen, dafür
  kleinere Verträge. Kontostand am Ende im Median 1,2 Mio €, vorher 1,5.
- Während einer Verletzung wird nicht gespielt — auch nicht in der letzten Woche. Gemessen
  über 306 Verletzungen und 1.254 verletzte Wochen: null Einsätze, davon 315 Wochen mit
  „noch 1 Woche" und ebenfalls null Einsätzen. Vorher: 93 % der Verletzungen endeten mit
  einem Spiel in der letzten Woche.
- Die acht Ereignisse, die ein gespieltes Spiel voraussetzen, feuern nur noch mit höchstens
  zwei spielfreien Wochen im Rücken. Gemessen über 562 Auslösungen: 0 Wochen 446×, 1 Woche
  70×, 2 Wochen 46×, darüber keine.
- Die Weltrangliste ist eine Leiter, keine Decke. Gemessen über 598 Saisons je Spielweise:
  gewöhnlich gespielt Median-Platz 45 von 55 mit dem besten Jahr auf 28, meisterhaft Median 22
  mit dem besten Jahr auf 9 und dem Goldenen Ball in 15,4 % aller Saisons. Vorher: 23 von 23
  in 98 % aller Saisons, unabhängig davon, wie gut man spielte.
- Die fünf Legacy-Stufen sind alle erreichbar. Gemessen über 90 durchgespielte Laufbahnen in
  drei Spielweisen: Solider Profi 22, Großer seiner Liga 46, Weltklassespieler 9, Legende 13;
  die Spanne reicht von 311 bis 3.620 Punkten, der Median liegt bei 810. Die unterste Stufe
  hängt an der Länge — eine Laufbahn, die vor der neunten Saison endet, liegt im Median unter
  280 Punkten. Vorher: 0 von 16 Laufbahnen unter 599 Punkten, gegen Grenzen bei 280 und 550.
- Torschützenkönig je Liga, gemessen über 230 Saisons: Median 20 bis 26 Tore in jeder
  einzelnen der 23 Ligen, Spanne 8 bis 49. Der eigene Spieler holt die Krone in 32 % seiner
  Saisons — vorher in fast jeder, weil die Konkurrenz unterhalb der ersten Liga bei ein bis
  zwei Toren pro Saison stand.
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

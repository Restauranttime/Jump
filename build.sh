#!/bin/sh
# Baut aus src/game.html eine eigenständige index.html.
#
# src/game.html enthält nur den Seiteninhalt (Titel, Stile, Markup, Skript) und ist
# damit direkt als Artifact veröffentlichbar. Für den Browser-Aufruf von der Platte
# oder über GitHub Pages fehlt das Dokumentgerüst — das ergänzt dieses Skript.
# Zusätzlich entsteht hier der Service Worker, der das Spiel offline verfügbar macht.
set -e
cd "$(dirname "$0")"
{
  echo '<!doctype html>'
  echo '<html lang="de">'
  echo '<head>'
  echo '<meta charset="utf-8">'
  echo '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
  # Farbe der Leisten, nicht des Seitenhintergrunds: iOS malt damit Bereiche
  # aus, die ausserhalb der Seite liegen. So wirken sie wie deren Fortsetzung.
  echo '<meta name="theme-color" content="#0F1C15">'
  echo '<meta name="description" content="Flutlicht Karriere - ein deutschsprachiger Fussball-Karriere-Simulator fuers Handy.">'
  echo '<meta name="mobile-web-app-capable" content="yes">'
  # Ohne diese vier Zeilen startet das Icon vom iOS-Homescreen nur in Safari
  # statt im Vollbild.
  echo '<meta name="apple-mobile-web-app-capable" content="yes">'
  echo '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">'
  echo '<meta name="apple-mobile-web-app-title" content="Flutlicht">'
  echo '<link rel="apple-touch-icon" href="icons/icon-180.png">'
  echo '<link rel="icon" href="icons/icon-192.png" type="image/png">'
  echo '<link rel="manifest" href="manifest.webmanifest">'
  grep -m1 '<title>' src/game.html
  echo '<style>'
  # Hier bewusst kein padding fuer die sicheren Bereiche: das Spiel verteilt sie
  # selbst auf Kopf- und Tableiste. Um die ganze Seite herum wuerde es unter der
  # Tableiste einen Streifen Hintergrund stehen lassen.
  echo 'html{-webkit-text-size-adjust:100%}'
  echo 'body{margin:0;font:14px system-ui,sans-serif}'
  echo 'img{max-width:100%}'
  echo '[hidden]{display:none!important}'
  echo '</style>'
  echo '</head>'
  echo '<body>'
  sed '/<title>/d' src/game.html
  # Der Service Worker läuft nur über https oder localhost. Beim Aufruf als
  # lokale Datei fehlt navigator.serviceWorker ganz — das Spiel braucht ihn
  # dort auch nicht, also scheitert die Anmeldung still.
  echo '<script>'
  echo 'if("serviceWorker" in navigator){addEventListener("load",function(){try{navigator.serviceWorker.register("sw.js").catch(function(){});}catch(e){}});}'
  echo '</script>'
  echo '</body>'
  echo '</html>'
} > index.html

# Der Service Worker führt eine Version mit. Ändert sich das Spiel, ändert sich
# der Hash und damit der Cache-Name — erst dadurch bekommen Geräte den neuen Stand.
VERSION=$(sha256sum index.html | cut -c1-12)
sed "s/__VERSION__/$VERSION/" src/sw.js > sw.js

cp index.html "Flutlicht-Karriere.html"
echo "index.html gebaut: $(wc -c < index.html) Bytes"
echo "sw.js gebaut, Version $VERSION"
echo "Flutlicht-Karriere.html zum Weitergeben erzeugt (gleiche Datei, sprechender Name)"

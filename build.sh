#!/bin/sh
# Baut aus src/game.html eine eigenständige index.html.
#
# src/game.html enthält nur den Seiteninhalt (Titel, Stile, Markup, Skript) und ist
# damit direkt als Artifact veröffentlichbar. Für den Browser-Aufruf von der Platte
# oder über GitHub Pages fehlt das Dokumentgerüst — das ergänzt dieses Skript.
set -e
cd "$(dirname "$0")"
{
  echo '<!doctype html>'
  echo '<html lang="de">'
  echo '<head>'
  echo '<meta charset="utf-8">'
  echo '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
  echo '<meta name="theme-color" content="#07100B">'
  echo '<meta name="description" content="Flutlicht Karriere - ein deutschsprachiger Fussball-Karriere-Simulator fuers Handy.">'
  echo '<meta name="mobile-web-app-capable" content="yes">'
  grep -m1 '<title>' src/game.html
  echo '<style>'
  echo ':root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}'
  echo 'html{-webkit-text-size-adjust:100%}'
  echo 'body{margin:0;font:14px system-ui,sans-serif}'
  echo 'img{max-width:100%}'
  echo '[hidden]{display:none!important}'
  echo '</style>'
  echo '</head>'
  echo '<body>'
  sed '/<title>/d' src/game.html
  echo '</body>'
  echo '</html>'
} > index.html
echo "index.html gebaut: $(wc -c < index.html) Bytes"

#!/bin/bash
# Setzt einen Pruefall lauffaehig zusammen: Attrappen-DOM, der aus
# src/game.html geschnittene Spielcode, dann der Fall selbst.
# Aufruf: pruef/bau.sh <fall.js> <ziel.js>
set -e
WURZEL="$(cd "$(dirname "$0")/.." && pwd)"
ZIEL="${2:-/tmp/pruef-lauf.js}"
awk '/<script>/{f=1;next}/<\/script>/{f=0}f' "$WURZEL/src/game.html" > "$ZIEL.spiel"
cat "$WURZEL/pruef/stub.js" "$ZIEL.spiel" "$WURZEL/pruef/stilllegen.js" "$1" > "$ZIEL"
rm -f "$ZIEL.spiel"

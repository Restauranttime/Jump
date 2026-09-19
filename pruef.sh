#!/bin/bash
# Alle Pruefungen nacheinander. Rueckgabewert 0 nur, wenn jede bestanden ist.
# Aufruf: ./pruef.sh            alle Faelle
#         ./pruef.sh welt       nur Faelle, deren Name "welt" enthaelt
cd "$(dirname "$0")"
MUSTER="${1:-}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "Syntaxpruefung"
awk '/<script>/{f=1;next}/<\/script>/{f=0}f' src/game.html > "$TMP/spiel.js"
if node --check "$TMP/spiel.js" 2>&1 | head -5; then
  echo "  ok    src/game.html laesst sich lesen"
else
  echo "  FEHLT src/game.html hat einen Syntaxfehler"
  exit 1
fi
echo ""

GESAMT=0
KAPUTT=0
for FALL in pruef/faelle/*.js; do
  NAME="$(basename "$FALL" .js)"
  [ -n "$MUSTER" ] && [[ "$NAME" != *"$MUSTER"* ]] && continue
  GESAMT=$((GESAMT + 1))
  echo "$NAME"
  pruef/bau.sh "$FALL" "$TMP/$NAME.js"
  if ! node "$TMP/$NAME.js"; then
    KAPUTT=$((KAPUTT + 1))
  fi
  echo ""
done

echo "========================================"
if [ "$KAPUTT" -eq 0 ]; then
  echo "$GESAMT Pruefungen, alle bestanden."
  exit 0
fi
echo "$GESAMT Pruefungen, $KAPUTT fehlgeschlagen."
exit 1

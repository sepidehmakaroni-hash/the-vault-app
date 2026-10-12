#!/bin/sh
# Builds a self-contained copy of v3 (no ../ links) for a developer: sh handoff/make-package.sh <out-dir>
set -e
ROOT=$(cd "$(dirname "$0")/.." && pwd)
OUT=${1:?usage: make-package.sh <out-dir>}
APP="$OUT/app"
mkdir -p "$APP/assets/icons" "$APP/assets/img" "$APP/fonts/yekan-bakh" "$OUT/brand"
cp -r "$ROOT/v3/img" "$APP/"
cp "$ROOT/v3/index.html" "$ROOT/v3/manifest.webmanifest" "$ROOT/v3/v3.css" "$ROOT/v3/v3.js" "$APP/"
cp "$ROOT"/assets/icons/*.png "$APP/assets/icons/"
cp "$ROOT/assets/img/mark.svg" "$APP/assets/img/"
cp "$ROOT"/fonts/yekan-bakh/* "$APP/fonts/yekan-bakh/"
cp "$ROOT/v2/fonts/bodoni.woff2" "$ROOT/v2/fonts/archivo.woff2" "$APP/fonts/"
sed -i 's#\.\./assets/#assets/#g; s#\.\./v2/fonts/#fonts/#g; s#\.\./fonts/yekan-bakh/#fonts/yekan-bakh/#g' "$APP/index.html" "$APP/manifest.webmanifest" "$APP/v3.css"
cp "$ROOT/handoff/README.md" "$OUT/"
cp "$ROOT/assets/img/mark.svg" "$ROOT/assets/img/lockup.svg" "$ROOT/assets/img/lockup-dark.svg" "$ROOT/assets/img/pattern.png" "$OUT/brand/"
if grep -q '\.\./' "$APP/index.html" "$APP/manifest.webmanifest" "$APP/v3.css"; then echo "error: a ../ link is left" >&2; exit 1; fi
echo "built $OUT"

#!/usr/bin/env bash
# Renders the WhatsApp Status / Instagram Story images (1080x1920) and the
# link-preview image (1200x630) from story.html using headless Google Chrome.
# Re-run after editing story.html or js/config.js (e.g. after setting siteUrl).
#
#   ./scripts/render-images.sh
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
[ -x "$CHROME" ] || CHROME="$(command -v google-chrome || command -v chromium || true)"
[ -n "$CHROME" ] || { echo "Google Chrome not found. Set CHROME=/path/to/chrome"; exit 1; }

ROOT="file://$(pwd)/story.html"
mkdir -p assets/stories

shot() { # id width height out
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size="$2,$3" --virtual-time-budget=8000 --allow-file-access-from-files \
    --screenshot="$4" "$ROOT?render=$1" >/dev/null 2>&1
  echo "  ✓ $4"
}

echo "Rendering story cards…"
for id in savedate wedding reception; do
  shot "$id" 1080 1920 "assets/stories/$id.png"
done

echo "Rendering link preview…"
shot og 1200 630 assets/og-image.png
if command -v sips >/dev/null; then
  sips -s format jpeg -s formatOptions 88 assets/og-image.png --out assets/og-image.jpg >/dev/null && rm assets/og-image.png
  echo "  ✓ assets/og-image.jpg"
else
  echo "  (convert assets/og-image.png to assets/og-image.jpg)"
fi
echo "Done."

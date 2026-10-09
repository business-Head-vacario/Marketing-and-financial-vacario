#!/usr/bin/env sh
# Downloads the on-device OCR engine (Tesseract.js 5.1.1, English model) into src/ocr/
# (or the directory given as the first argument, e.g. web/ocr for Firebase Hosting).
# The Card Scanner publishes these files alongside the page so it can read cards in
# browsers where Claude reading is not available. They are not committed (about 11 MB).
set -e
OUT="${1:-src/ocr}"
TMP="$(mktemp -d)"
mkdir -p "$OUT"
( cd "$TMP" && npm pack --silent tesseract.js@5.1.1 tesseract.js-core@5.1.1 @tesseract.js-data/eng@1.0.0 >/dev/null )
for f in "$TMP"/*.tgz; do tar xzf "$f" -C "$TMP" && mv "$TMP/package" "$TMP/$(basename "$f" .tgz)"; done
cp "$TMP/tesseract.js-5.1.1/dist/tesseract.min.js" "$TMP/tesseract.js-5.1.1/dist/worker.min.js" "$OUT/"
cp "$TMP/tesseract.js-core-5.1.1/tesseract-core-lstm.wasm.js" "$TMP/tesseract.js-core-5.1.1/tesseract-core-simd-lstm.wasm.js" "$OUT/"
cp "$TMP/tesseract.js-data-eng-1.0.0/4.0.0_best_int/eng.traineddata.gz" "$OUT/eng-traineddata.wasm"
cp "$(dirname "$0")/src/ocr-boot.js" "$OUT/"
rm -rf "$TMP"
ls -la "$OUT"

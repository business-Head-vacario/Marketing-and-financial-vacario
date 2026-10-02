#!/usr/bin/env sh
# Wraps src/app.html (the single source of truth) into a standalone, offline index.html.
# The Google Fonts links are dropped so the local copy makes zero network requests;
# the page falls back to system fonts.
set -e
cd "$(dirname "$0")"
SRC="src/app.html"
OUT="index.html"
{
  printf '<!doctype html>\n<html lang="en">\n<head>\n'
  printf '<meta charset="utf-8">\n'
  printf '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
  printf '<meta name="description" content="Offline resume checker, interview prep, cold outreach writer and job tracker for hospitality, tourism, FM, events and aviation.">\n'
  printf '<style>:root{color-scheme:light}body{margin:0}img{max-width:100%%}[hidden]{display:none!important}</style>\n'
  printf '</head>\n<body>\n'
  grep -v 'fonts.googleapis.com\|fonts.gstatic.com' "$SRC"
  printf '\n</body>\n</html>\n'
} > "$OUT"
echo "built $OUT from $SRC ($(wc -l < "$OUT") lines)"

# Single-file edition: same page with pdf.js and mammoth embedded, so one .html file
# works on its own (email it, put it on a USB stick, double-click). Libraries are kept
# as inert text blocks and only run when a PDF or DOCX is first uploaded.
SINGLE="CareerPrep-Studio.html"
node -e '
const fs = require("fs");
const page = fs.readFileSync(process.argv[1], "utf8");
const libs = ["lib/pdf.min.js", "lib/pdf.worker.min.js", "lib/mammoth.browser.min.js"].map(p => {
  const js = fs.readFileSync(p, "utf8").replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "\\x3C!--");
  return `<script type="text/plain" id="lib:${p}">${js}</script>`;
}).join("\n");
fs.writeFileSync(process.argv[2], page.replace("\n</body>", "\n" + libs + "\n</body>"));
' "$OUT" "$SINGLE"
echo "built $SINGLE ($(du -h "$SINGLE" | cut -f1), libraries embedded)"

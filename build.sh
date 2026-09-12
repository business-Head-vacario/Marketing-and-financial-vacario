#!/usr/bin/env sh
# Wraps the artifact fragment (src/app.html) into a standalone index.html.
# src/app.html is the single source of truth; index.html is generated.
set -e
SRC="src/app.html"
OUT="index.html"
{
  printf '<!doctype html>\n<html lang="en">\n<head>\n'
  printf '<meta charset="utf-8">\n'
  printf '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
  printf '<meta name="description" content="Marketing budget scenarios, break-even and funding need for the Vacario India growth plan.">\n'
  printf '<style>:root{color-scheme:light}body{margin:0;font:14px system-ui,sans-serif;background:#f1f2ee}'
  printf 'img{max-width:100%%}[hidden]{display:none!important}</style>\n'
  printf '</head>\n<body>\n'
  cat "$SRC"
  printf '\n</body>\n</html>\n'
} > "$OUT"
echo "built $OUT from $SRC ($(wc -l < "$OUT") lines)"

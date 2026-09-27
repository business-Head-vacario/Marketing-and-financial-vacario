#!/usr/bin/env sh
# Wraps each artifact fragment in src/ into a standalone page.
# The fragments are the single source of truth; the .html pages at the root are generated.
# A fragment line <script data-inline="X" ...></script> is replaced by the contents of src/X,
# so shared data (src/workflow-data.js) lives in one place.
set -e
mkdir -p build

inline() {
  awk '
    /<script data-inline="[^"]+"/ {
      match($0, /data-inline="[^"]+"/)
      f = "src/" substr($0, RSTART + 13, RLENGTH - 14)
      print "<script>"
      while ((getline line < f) > 0) print line
      close(f)
      print "</script>"
      next
    }
    { print }
  ' "$1"
}

build() {
  SRC="$1"; OUT="$2"; DESC="$3"
  inline "$SRC" > "build/$(basename "$SRC")"
  {
    printf '<!doctype html>\n<html lang="en">\n<head>\n'
    printf '<meta charset="utf-8">\n'
    printf '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
    printf '<meta name="description" content="%s">\n' "$DESC"
    printf '<style>:root{color-scheme:light}body{margin:0;font:14px system-ui,sans-serif;background:#f1f2ee}'
    printf 'img{max-width:100%%}[hidden]{display:none!important}</style>\n'
    printf '</head>\n<body>\n'
    cat "build/$(basename "$SRC")"
    printf '\n</body>\n</html>\n'
  } > "$OUT"
  echo "built $OUT from $SRC ($(wc -l < "$OUT") lines)"
}
build src/app.html index.html "Marketing budget scenarios, break-even and funding need for the Vacario India growth plan."
build src/workflows.html workflows.html "Step-by-step workflows for the seven Vacario India communication channels."
build src/kpi-workspace.html kpi-workspace.html "Enter monthly numbers, measure all 61 KPIs, follow each channel's workflow and lead flow, and ask Claude using your own files."

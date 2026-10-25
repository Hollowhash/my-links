#!/usr/bin/env bash
# Render still di detik tertentu lalu gabung jadi satu lembar untuk diperiksa.
# Pakai: tools/stills.sh <komposisi> 0 3.4 8 13 ...
set -euo pipefail
cd "$(dirname "$0")/.."
FPS=30
KELUAR="out/stills"
rm -rf "$KELUAR"
mkdir -p "$KELUAR"
KOMP="$1"
shift
i=0
for DETIK in "$@"; do
  FRAME=$(python3 -c "print(round($DETIK*$FPS))")
  NAMA=$(printf "%02d-%s" "$i" "$DETIK")
  (cd remotion && npx remotion still "$KOMP" "../$KELUAR/$NAMA.png" --frame="$FRAME" >/dev/null 2>&1)
  ffmpeg -y -loglevel error -i "$KELUAR/$NAMA.png" -vf "scale=270:-1,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='${DETIK}s':x=8:y=8:fontsize=20:fontcolor=yellow:box=1:boxcolor=black@0.65,pad=iw+4:ih+4:2:2:0x1E2638" "$KELUAR/t-$NAMA.png"
  echo "  $DETIK detik"
  i=$((i+1))
done
JUMLAH=$(ls "$KELUAR"/t-*.png | wc -l)
KOLOM=$(python3 -c "import math;print(min(7,max(1,$JUMLAH)))")
BARIS=$(python3 -c "import math;print(math.ceil($JUMLAH/$KOLOM))")
ffmpeg -y -loglevel error -pattern_type glob -i "$KELUAR/t-*.png" -filter_complex "tile=${KOLOM}x${BARIS}" -frames:v 1 "$KELUAR/sheet.jpg"
echo "$KELUAR/sheet.jpg"

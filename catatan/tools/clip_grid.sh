#!/usr/bin/env bash
# Grid frame bergaris + timestamp, untuk mencari momen penting, plat nomor, logo, tulisan.
# Pakai: tools/clip_grid.sh remotion/public/clips/klip-01.mp4 [langkah_detik]
set -euo pipefail
KLIP="$1"
LANGKAH="${2:-0.8}"
NAMA=$(basename "$KLIP" .mp4)
KELUAR="out/grid"
mkdir -p "$KELUAR"
ffmpeg -y -loglevel error -i "$KLIP" \
  -vf "fps=1/$LANGKAH,scale=360:-1,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='%{eif\:n*$LANGKAH\:d}.%{eif\:mod(n*$LANGKAH*10,10)\:d}s':x=8:y=8:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.6,drawgrid=w=36:h=36:t=1:c=cyan@0.35,tile=5x2" \
  -frames:v 1 "$KELUAR/$NAMA.jpg"
echo "$KELUAR/$NAMA.jpg"

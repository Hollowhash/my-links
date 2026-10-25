#!/usr/bin/env bash
# Gabung voice over, musik, dan efek. Musik otomatis mengecil saat ada suara.
# Loudness disetel dua langkah supaya benar-benar mendarat di -14 LUFS.
# Pakai: ./mix.sh <slug> <voice_over.mp3> <durasi_total> <keluaran.wav>
set -euo pipefail
cd "$(dirname "$0")"
SLUG="$1"
VO="$2"
DUR="$3"
OUT="$4"
mkdir -p "$(dirname "$OUT")"

RANTAI="[0:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=mono,apad[vo];\
[vo]asplit=2[vo1][key];\
[1:a]volume=0.095[mus];\
[mus][key]sidechaincompress=threshold=0.025:ratio=7:attack=6:release=380:makeup=1[musduck];\
[2:a]volume=0.5[sfx];\
[vo1][musduck][sfx]amix=inputs=3:duration=first:dropout_transition=0:normalize=0,atrim=0:${DUR}[mix]"

# Langkah 1: ukur dulu
UKUR=$(ffmpeg -hide_banner -i "$VO" -i "music_$SLUG.wav" -i "sfx_$SLUG.wav" \
  -filter_complex "${RANTAI};[mix]loudnorm=I=-14:TP=-1.0:LRA=11:print_format=json[out]" \
  -map "[out]" -f null - 2>&1 | sed -n '/^{/,/^}/p')

AMBIL() { echo "$UKUR" | grep "\"$1\"" | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/'; }
GESER=$(AMBIL target_offset)
[ -z "$GESER" ] && GESER=0

# Langkah 2: terapkan, lalu geser sesuai sisa selisih dan tahan puncaknya
ffmpeg -y -loglevel error -i "$VO" -i "music_$SLUG.wav" -i "sfx_$SLUG.wav" \
  -filter_complex "${RANTAI};\
[mix]loudnorm=I=-14:TP=-1.0:LRA=11,volume=${GESER}dB,alimiter=limit=0.891:level=disabled,\
aformat=sample_fmts=s16:sample_rates=48000:channel_layouts=stereo[out]" \
  -map "[out]" "$OUT"

echo "$OUT"
ffmpeg -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | tail -12 | grep -E "I:|Peak:" || true

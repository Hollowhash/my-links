#!/usr/bin/env bash
# Gabung voice over, musik, dan efek. Musik otomatis mengecil saat ada suara.
# Pakai: ./mix.sh <voice_over.mp3> <durasi_total> <keluaran.wav>
set -euo pipefail
cd "$(dirname "$0")"
VO="$1"
DUR="$2"
OUT="$3"
mkdir -p "$(dirname "$OUT")"
ffmpeg -y -loglevel error \
  -i "$VO" -i music_raw.wav -i sfx_bus.wav \
  -filter_complex "\
[0:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=mono,apad[vo];\
[vo]asplit=2[vo1][key];\
[1:a]volume=0.095[mus];\
[mus][key]sidechaincompress=threshold=0.025:ratio=7:attack=6:release=380:makeup=1[musduck];\
[2:a]volume=0.5[sfx];\
[vo1][musduck][sfx]amix=inputs=3:duration=first:dropout_transition=0:normalize=0[mix];\
[mix]loudnorm=I=-14:TP=-1.0:LRA=11,atrim=0:${DUR},aformat=sample_fmts=s16:sample_rates=48000:channel_layouts=stereo[out]" \
  -map "[out]" "$OUT"
echo "$OUT"
ffmpeg -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | tail -12 | grep -E "I:|Peak:" || true

# Catatan: pabrik video vertikal

Aturan kerjanya ada di `CLAUDE.md` (kiriman Galih). File ini hanya peta cepat
isi folder dan urutan perintahnya.

```
episode/            naskah.txt, voice_over.mp3, paket-naskah.md
remotion/           proyek Remotion (React)
  src/lib.tsx       design system: warna, font, Kartu, Mark, Strike, Rise, Clip, Foto, SceneFX, Grain
  src/Captions.tsx  caption karaoke per kata
  src/vo.ts         cari detik sebuah frasa di voice over
  src/Main.tsx      daftar scene
  src/timeline.json satu sumber waktu (dibuat oleh tools/buat-timeline.mjs)
  src/words.json    timing per kata (dibuat oleh tools/asr)
  src/scenes/       scene per episode
  public/clips/     klip-01.mp4, klip-02.mp4
  public/photos/    foto-01.jpg, foto-02.jpg
tools/asr/          timing per kata: whisper-tiny lokal + alignment ke naskah
tools/audio/        musik dan efek disintesis sendiri, lalu dicampur
tools/stills.sh     cuplikan untuk pemeriksaan visual
tools/clip_grid.sh  grid frame klip untuk mencari momen dan tulisan
out/                hasil render
```

## Urutan kerja satu episode

```bash
# 1. kenali footage
tools/clip_grid.sh remotion/public/clips/klip-01.mp4

# 2. timing per kata dari voice over
cd tools/asr && ./run.sh ../../episode/voice_over.mp3 ../../episode/naskah.txt ../../remotion/src/words.json

# 3. batas scene, dikunci ke kata di naskah
node tools/buat-timeline.mjs

# 4. periksa tampilan sebelum render penuh
tools/stills.sh 0 16.5 21 34 47 54 66 73 82

# 5. musik, efek, dan campuran audio
cd tools/audio
python3 make_audio.py ../../remotion/src/timeline.json
python3 mix.py ../../remotion/src/timeline.json
./mix.sh ../../episode/voice_over.mp3 <durasi_total> ../../out/mix.wav

# 6. render lalu pasang audionya
cd remotion && npx remotion render Main ../out/video_silent.mp4 --muted --codec=h264 --crf=18
cd ../out && ffmpeg -i video_silent.mp4 -i mix.wav -map 0:v -map 1:a \
  -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -profile:v high \
  -movflags +faststart -c:a aac -b:a 192k -shortest final.mp4
```

## Catatan untuk episode berikutnya

- Ganti isi `episode/`, `remotion/public/clips/`, dan `remotion/public/photos/`,
  lalu ulangi langkah 2 sampai 6.
- Teks tiap scene ada di `remotion/src/Main.tsx`. Angka waktu jangan ditulis
  tangan: pakai `kapan("potongan kalimat")` supaya terkunci ke voice over.
- Semua klaim harus punya sumber dari paket naskah, bukan karangan.

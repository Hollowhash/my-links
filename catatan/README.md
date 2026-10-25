# Catatan: pabrik video vertikal

Aturan kerjanya ada di `CLAUDE.md` (kiriman Galih). File ini hanya peta cepat
isi folder dan urutan perintahnya.

```
episode/<slug>/     naskah.txt, voice_over.mp3
episode/paket-naskah.md   fakta, sumber, rencana susunan, metadata
remotion/
  src/lib.tsx       design system: warna, font, Kartu, Mark, Strike, Rise, Clip, Foto, SceneFX, Grain
  src/kaca.tsx      kartu kaca, pita kaca, angka berjalan, centang, garis waktu, teks sapu
  src/Captions.tsx  caption karaoke per kata
  src/vo.ts         cari detik sebuah frasa di voice over
  src/scenes/       komponen kartu yang dipakai semua episode
  src/episodes/<slug>/
      Main.tsx      daftar scene episode itu
      adegan.json   urutan scene, tiap scene dikunci ke frasa naskah
      timeline.json satu sumber waktu (dibuat tools/buat-timeline.mjs)
      words.json    timing per kata (dibuat tools/asr)
      *.tsx         scene khusus episode itu, termasuk momen 3D
  public/<slug>/    clips/, photos/, voice_over.mp3
  public/fonts/     Plus Jakarta Sans dan IBM Plex Mono
tools/asr/          timing per kata: whisper-tiny lokal + alignment ke naskah
tools/audio/        musik dan efek disintesis sendiri, lalu dicampur ke -14 LUFS
tools/stills.sh     cuplikan untuk pemeriksaan visual
tools/clip_grid.sh  grid frame klip untuk mencari momen dan tulisan
out/                hasil render
```

Episode yang sudah jadi: `ep01` (nafkah anak setelah cerai), `ep02` (adopsi resmi).

## Urutan kerja satu episode

Contoh untuk `ep02`:

```bash
# 1. kenali footage
tools/clip_grid.sh remotion/public/ep02/clips/klip-01.mp4

# 2. timing per kata dari voice over
cd tools/asr && ./run.sh ../../episode/ep02/voice_over.mp3 ../../episode/ep02/naskah.txt \
  ../../remotion/src/episodes/ep02/words.json

# 3. batas scene, dikunci ke frasa di naskah (isi dulu adegan.json)
node tools/buat-timeline.mjs ep02

# 4. periksa tampilan sebelum render penuh
tools/stills.sh ep02 0 11 19 29 39 45 48 57 64 72

# 5. musik, efek, dan campuran audio
cd tools/audio
python3 make_audio.py ../../remotion/src/episodes/ep02/timeline.json
python3 mix.py ../../remotion/src/episodes/ep02/timeline.json
./mix.sh ep02 ../../episode/ep02/voice_over.mp3 <durasi_total> ../../out/mix-ep02.wav

# 6. render lalu pasang audionya
cd remotion && npx remotion render ep02 ../out/ep02_silent.mp4 --muted --codec=h264 --crf=18
cd ../out && ffmpeg -i ep02_silent.mp4 -i mix-ep02.wav -map 0:v -map 1:a \
  -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -profile:v high \
  -movflags +faststart -c:a aac -b:a 192k -shortest ep02.mp4
```

## Catatan untuk episode berikutnya

- Buat folder baru `episode/<slug>/`, `remotion/public/<slug>/`, dan
  `remotion/src/episodes/<slug>/`, lalu ulangi langkah 2 sampai 6.
- Daftarkan komposisinya di `remotion/src/Root.tsx`.
- Teks tiap scene ada di `Main.tsx` episode itu. Angka waktu jangan ditulis
  tangan: pakai `kapan("potongan kalimat")` supaya terkunci ke voice over.
- Kartu kaca memakai salinan latar yang diburamkan, bukan `backdrop-filter`,
  supaya tidak kena bug teks berbayang di Chrome headless.
- Semua klaim harus punya sumber dari paket naskah, bukan karangan.

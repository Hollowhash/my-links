# Pabrik video vertikal "Catatan"

Dokumen ini adalah aturan kerja untuk Claude Code. Baca semuanya sebelum mulai satu episode baru. Patokan kualitasnya adalah episode 01 "Jalan berlubang: ada pasalnya" (`examples/ep01-jalan-berlubang/`). Episode baru harus setara atau lebih bagus. Jangan sampai lebih sederhana.

## Isi folder

```
remotion/            proyek Remotion (React). Semua visual ada di sini.
  src/lib.tsx        design system: warna, font, glass, Mark, Strike, Rise, CatatanLabel, SceneFX, CardBG, Clip (+ blur plat), Grain
  src/Captions.tsx   caption karaoke per kata dari words.json
  src/Main.tsx       daftar scene + transisi
  src/timeline.json  SATU sumber waktu: durasi, batas scene, bagian musik, daftar SFX, ambience
  src/words.json     timing per kata dari VO (hasil tools/asr)
  src/scenes/*.tsx   scene per episode (ganti tiap episode)
  public/clips/      klip-01.mp4 ... klip-04.mp4 dari Google Flow
tools/asr/run.sh     timing per kata: whisper-tiny dari npm + alignment ke naskah asli
tools/audio/         musik + SFX disintesis sendiri (bebas hak cipta), mix + loudnorm -14 LUFS
tools/stills.sh      render still di detik tertentu + gabung jadi satu gambar untuk QA
tools/clip_grid.sh   grid frame bergaris + timestamp untuk cari plat nomor/logo/tulisan
episode/             input episode: naskah.txt (dengan tag ElevenLabs), voice_over.mp3, swoosh.mp3
examples/ep01-.../   kode scene episode 01 sebagai contoh rujukan
```

## Input yang dibutuhkan tiap episode

1. `episode/naskah.txt` berisi naskah VO persis seperti yang ditempel ke ElevenLabs. Tag seperti `[serious]` tidak apa-apa ikut, nanti dibuang otomatis.
2. `episode/voice_over.mp3` dari ElevenLabs.
3. `remotion/public/clips/klip-01.mp4` sampai `klip-04.mp4` dari Google Flow (720x1280, 24 fps, sekitar 8 detik).
4. Paket naskah episode (fakta + sumber, rencana susunan video, judul hook cover). Kartu infografis WAJIB berisi fakta dari paket ini, bukan karangan.
5. Opsional: `episode/swoosh.mp3`.

Kalau ada input yang kurang, tanya dulu sebelum mulai.

## Alur kerja (urutannya jangan dilompati)

### 1. Kenali footage
- Pakai `ffprobe` untuk cek durasi dan fps tiap klip.
- Jalankan `tools/clip_grid.sh` untuk tiap klip, lalu LIHAT gambarnya. Catat:
  - momen penting dan detiknya (misalnya "detik 3,2: roda masuk lubang, ada cipratan");
  - posisi plat nomor, logo merek, dan tulisan yang terbaca. Tulis track-nya di `PLATES` (`lib.tsx`) dalam koordinat sumber 720x1280 (grid 72 px). Kalau ada logo atau tulisan besar yang sulit di-blur, jangan pakai potongan detik itu;
  - suara bawaan klip: selalu `muted`. Flow kadang menghasilkan suara orang ngomong.

### 2. Timing VO
```
cd tools/asr && ./run.sh ../../episode/voice_over.mp3 ../../episode/naskah.txt ../../remotion/src/words.json
```
- Model whisper-tiny diambil dari npm (`sts-whisper-tiny`), jadi tidak butuh akses HuggingFace. Audio dipotong per jeda sekitar 9 sampai 12 detik supaya model tidak berhalusinasi, lalu teks naskah asli di-align ke hasilnya. Hasilnya: teks 100% sesuai naskah dengan timing per kata.
- Cek cepat hasilnya: kata pertama harus mulai sekitar 0,3 sampai 0,6 detik, dan tidak boleh ada kata yang timing-nya mundur.
- Di `Captions.tsx`, gabungkan token khusus kalau ada (contoh yang sudah ada: "L B H" jadi "LBH", "lapor titik go titik id" jadi "lapor.go.id").

### 3. Storyboard dulu, baru kode
Tulis tabel di chat: detik, kalimat VO, visual (footage atau kartu), animasi, SFX. Aturannya:
- **Hook 0 sampai 3 detik:** kartu judul cover sudah terlihat penuh di frame 0 (berfungsi sebagai thumbnail), di atas klip-01. Momen dramatis klip (benturan, kaget) disinkronkan dengan kata VO, boleh pakai slow-mo (`rate` 0,5) plus `shakeAt` dan impact flash.
- **Ganti visual tiap 2 sampai 4 detik.** Kalau satu kartu tampil lama, isinya harus terus bergerak: item muncul bergantian, highlight pindah, angka naik.
- **Setiap klaim atau angka punya kartu "catatan N dari M"** dengan sumber kecil dalam huruf mono (pasal, UU, lembaga). Gunakan hanya fakta dari paket naskah.
- **Footage sekitar 40%, kartu sekitar 60%.** Empat klip dipakai sesuai fungsi cerita: masalah, titik emosional, aksi, lega.
- **Teks kartu disinkronkan per kata VO** (lihat `words.json`): highlight, kemunculan item, dan centang jatuh tepat di detik kata itu diucapkan.
- Minimal satu "momen wow" per episode. Contoh episode 01: jalan 3D Three.js yang rambu dan kerucutnya jatuh, serta HP dengan form lapor yang terisi sendiri sampai "Laporan terkirim".
- **Penutup:** kalimat pembela penonton dalam tipografi besar, lalu kartu pertanyaan komentar, lalu tombol Follow, Simpan, Kirim (muncul tepat saat diucapkan), lalu kartu akhir dengan sumber.
- **Jangan tulis nama akun** (@...) di video, supaya bisa diunggah ke banyak akun.

### 4. Bangun scene
- Isi `timeline.json` (`scenes`, `music`, `sfx`, `ambience`) lebih dulu. Semua waktu absolut dalam detik.
- Setiap scene adalah komponen di `src/scenes/`, didaftarkan di `Main.tsx`. Di dalam scene, pakai `useT(start)` supaya `T` berisi detik absolut, lalu animasikan dengan `ramp(T, a, b)`, `springAt(T, at)`, `<Rise>`, `<Mark>`, dan `<Strike>`.
- Footage: `<Clip clip srcStart rate dur zoom plates shakeAt blur/>`. Untuk mengatur ulang waktu, bungkus beberapa `<Clip>` dengan `<Sequence>`.
- Transisi antar-scene sudah otomatis (`SceneFX`: zoom-blur 0,3 detik). Tambahkan SFX swoosh di sekitar 0,2 detik sebelum batas scene.
- Three.js: pakai `ThreeCanvas` dari `@remotion/three`. Kamera diatur di komponen rig yang memakai `useThree()`, `fov` sekitar 58. Benda yang belum waktunya muncul diletakkan di y=60 (di luar layar), jangan cuma diturunkan sedikit.
- Ikon: `lucide-react`. Jangan pakai emoji.

### 5. QA visual (WAJIB, sebelum render penuh)
```
tools/stills.sh 0 3.4 8 13 18.5 23 26 31 37 42.5 44.6 50 58 62 65.8 68.8 72 76.5
```
Lihat `out/stills/sheet.jpg`, lalu cek:
- Frame 0 terbaca sebagai thumbnail.
- Tidak ada teks yang terpotong, menimpa teks lain, atau tertutup caption.
- Caption tidak menutupi elemen penting.
- Plat nomor dan logo ter-blur.
- Tidak ada "teks hantu" (lihat jebakan no. 1).
- Ukuran teks minimum sekitar 28 px pada 1080p.
Perbaiki, lalu cek ulang. Ulangi sampai bersih.

### 6. Audio
```
cd tools/audio
python3 make_audio.py ../../remotion/src/timeline.json          # music_raw.wav + SFX .wav
python3 mix.py ../../remotion/src/timeline.json ../../episode/swoosh.mp3   # sfx_bus.wav
./mix.sh ../../episode/voice_over.mp3 <durasi_total> ../../out/mix.wav     # target -14 LUFS, peak di bawah -1 dBTP
```
- Bagian musik mengikuti `timeline.json.music`: `tension_end` (intro tegang), `groove_end` (beat lo-fi untuk bagian informasi), `break_end` (breakdown tenang), lalu bagian akhir yang lebih cerah.
- Musik di-duck otomatis (sidechain) setiap ada VO. Kalau musik terasa terlalu keras, turunkan `volume=0.095` di `mix.sh`. Jangan menurunkan VO.

### 7. Render dan gabung
```
cd remotion
npx remotion render src/index.ts Main ../out/video_silent.mp4 --muted --codec=h264 --crf=18
cd ../out
ffmpeg -i video_silent.mp4 -i mix.wav -map 0:v -map 1:a -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
  -profile:v high -movflags +faststart -c:a aac -b:a 192k -shortest final.mp4
```
- Untuk revisi kecil, render ulang hanya rentang frame yang berubah (`--frames=A-B`), lalu sambung dengan filter `trim` + `concat` di ffmpeg. Hasilnya jauh lebih cepat.
- Setelah render, buat contact sheet 1 fps (`fps=1,scale=180:-1,tile=13x6`) dan cek sekali lagi.

## Design system "Catatan" (jangan diubah tanpa izin)
- Warna: dasar `#E6ECF2` ke `#DCE4EC`, teks dan bayangan navy `#1E2638`, putih, SATU aksen `#D9482B`, stabilo `#FCE3DD`, teks sekunder `#5B667D`.
- Font: Plus Jakarta Sans 600, 700, 800 untuk teks; IBM Plex Mono untuk label "catatan N dari M" dan sumber.
- Kartu: putih dengan sudut 48 px, bayangan lembut, lingkaran nomor merah-oranye, titik progres yang bergeser.
- Area aman 1080x1920: konten di y 130 sampai 1400; caption di `paddingBottom: 395`; 120 px di sisi kanan setengah bawah dibiarkan kosong (ikon platform); 20% bagian bawah layar hanya untuk caption.
- Footage diberi grade `contrast(1.06) saturate(0.92)`, gradien navy di atas dan bawah, vignette, dan grain.

## Jebakan yang sudah pernah terjadi
1. **Teks hantu atau terpantul di kartu.** Penyebabnya `backdrop-filter` pada kartu yang punya anak ber-`transform` di Chrome headless. Aturannya: kartu di atas `CardBG` (latar terang statis) atau di atas footage yang sudah di-blur pakai `glass(alpha, 0, false)`, tanpa backdrop. `backdrop-filter` hanya untuk kartu kecil di atas footage tajam.
2. **3D terlalu dekat atau tertutup kartu.** Di layar vertikal, `fov` horizontal jauh lebih sempit. Pakai `fov` sekitar 58, jarak kamera sekitar 15 sampai 17, dan arahkan `lookAt` sehingga objek utama berada di sekitar 60% tinggi layar (di bawah kartu, di atas caption).
3. **Benda 3D melayang sebelum waktunya.** Sembunyikan dengan y=60 sebelum animasi jatuhnya dimulai.
4. **Timing caption meleset.** Jangan memakai whisper untuk teks. Selalu align ke naskah asli dengan `tools/asr`.
5. **Plat nomor atau logo terbaca.** Lihat jebakan langkah 1. Bagian close-up berlogo dibuang, jangan diakali.
6. **Suara bawaan klip berisi omongan.** Selalu `muted`, lalu pakai ambience sintetis.
7. **Teks label di HP atau kartu terlalu kecil.** Minimum sekitar 28 px.
8. **Komponen `PLATES`** memakai `clip-path` dengan salinan video yang di-blur, bukan `backdrop-filter`.

## Di laptop vs di cloud
- Laptop: `npm i` di `remotion/` dan `tools/asr/`. Remotion akan mengunduh Chrome headless sendiri. Butuh `ffmpeg`, Python 3, `numpy`, dan `scipy`.
- Sandbox tanpa akses unduhan Chrome: `export REMOTION_CHROME=/path/ke/chrome-headless-shell` dan pasang paket dengan `npm i --ignore-scripts`.
- Render 78 detik dengan Three.js butuh sekitar 35 menit di 2 CPU. Atur `REMOTION_CONCURRENCY` sesuai jumlah core.

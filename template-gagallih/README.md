# Template kartu putih gagallih

Template Remotion untuk video Short gagallih, ukuran 1080 x 1920, gaya kartu putih.
Panduan proyek ada di CLAUDE.md milik Galih. Baca itu dulu sebelum mengerjakan episode.

## Isi folder

```
episodes/<slug>/episode.json   isi episode: skrip, catatan, nama file bahan
public/aset/<slug>/            foto, klip, voice over, musik episode itu
public/fonts/                  font Plus Jakarta Sans, dipakai offline
src/                           kode template, jarang perlu diubah
scripts/                       skrip bantu
```

## Membuat episode baru

1. Buat folder `episodes/<slug>/` dan salin `episodes/contoh/episode.json` ke sana.
2. Taruh bahan dari Galih di `public/aset/<slug>/`: voice over, 2 klip, 3 foto, musik kalau ada.
3. Isi `episode.json`: judul, pembuka, lima atau enam catatan, penutup, dan nama file bahannya.
4. Arahkan template ke episode baru. Ubah satu baris di `src/episode-aktif.ts`:
   `import data from "../episodes/<slug>/episode.json";`
5. Isi durasi otomatis: `node scripts/siapkan-episode.mjs <slug>`
6. Cek aturan konten: `node scripts/cek-sebelum-kirim.mjs <slug>`
7. Render: `npx remotion render Episode out/<slug>.mp4`
8. Ambil beberapa cuplikan untuk dicek: `npx remotion still Episode out/cek-200.png --frame=200`

Jangan membangun ulang template dari nol. Cukup ganti isinya.

## Cara menulis teks di episode.json

- Kata aksen dibungkus bintang: `Paklaring itu *hak lo*, bukan hadiah.`
  Kata di dalam bintang jadi merah-oranye dengan stabilo peach.
- `teks` adalah tulisan besar di kartu. Buat pendek, maksimal tiga baris.
- `vo` adalah teks voice over bagian itu. Ini yang dipakai jadi subtitle, jadi tulis
  persis seperti yang dibaca di rekaman.
- Dilarang menulis nama akun di teks mana pun.
- Jangan pakai tanda pisah panjang.

## Waktu dan subtitle

- `durasiVO` diisi otomatis oleh `siapkan-episode.mjs` dari file voice over.
- Kalau tiap kartu tidak diberi `mulai`, waktu dibagi otomatis menurut panjang teks VO.
  Hasilnya biasanya meleset satu dua detik.
- Kalau mau pas, isi `mulai` tiap kartu dengan detik saat bagian itu mulai terdengar
  di voice over. Dengarkan VO sekali sambil mencatat.
- Kalau subtitle perlu diatur sendiri, isi `subtitle` dengan daftar
  `{ "teks": "...", "mulai": 12.4, "selesai": 15.1 }` dalam detik. Daftar itu
  menimpa subtitle otomatis.
- Kalau `vo` dan `durasiVO` masih kosong, template memakai perkiraan lama baca
  supaya tetap bisa dilihat sebelum rekaman jadi.

## Bahan

- Foto: lebih besar dari 1200 piksel sisi pendek. Foto dapat gerak zoom pelan.
  Atur `fokus` ke `atas`, `tengah`, atau `bawah` kalau bagian penting kepotong.
- Klip: MP4 tanpa suara penting. Kalau klip lebih pendek dari kartunya, klip diulang.
  `mulaiKlip` untuk memotong bagian awal yang tidak terpakai.
- Tiap catatan sebaiknya punya foto atau klip yang ikut bercerita.

## Gerak

Yang bergerak di template ini:

- Kartu naik dari bawah sambil sedikit miring, lalu didorong mundur ke belakang
  waktu kartu berikutnya datang. Pergantiannya menyambung, bukan potong.
- Teks besar muncul kata demi kata, stabilo peach menyapu di belakang kata aksen.
- Subtitle juga muncul kata demi kata mengikuti irama kalimat.
- Foto dibuka dengan sapuan dari bawah, lalu zoom dan geser pelan.
  Klip dibuka dengan cara yang sama.
- Nomor catatan melompat masuk, batang penanda melebar ke catatan yang aktif.
- Angka besar lewat di belakang kartu tiap ganti catatan.
- Latar hidup terus: noda cahaya, titik-titik yang merayap, cincin dan kotak melayang.

Pengaturannya ada di `src/gerak.ts`. `TRANSISI` mengatur lama tumpang tindih
antar kartu dalam frame.

## Catatan teknis

- Durasi video mengikuti durasi voice over, tidak diatur manual.
- Kartu dan subtitle sengaja dijauhkan dari tepi atas dan bawah layar supaya tidak
  tertutup tombol aplikasi.
- Episode `contoh` hanya untuk menguji tampilan. Teks dan bahannya dummy,
  jangan dipakai jadi video sungguhan.

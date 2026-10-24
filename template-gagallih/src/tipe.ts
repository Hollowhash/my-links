// Bentuk data satu episode. File episode ada di episodes/<slug>/episode.json

export type JenisMedia = "foto" | "klip";

export type Media = {
  jenis: JenisMedia;
  /** Nama file di dalam public/aset/<slug>/ */
  file: string;
  /** Bagian gambar yang diutamakan kalau kena potong */
  fokus?: "atas" | "tengah" | "bawah";
  /** Khusus klip: mulai dari detik ke berapa */
  mulaiKlip?: number;
  /** Lama klip dalam detik. Diisi otomatis oleh scripts/siapkan-episode.mjs */
  durasiKlip?: number;
};

export type Kartu = {
  /** Teks besar di kartu. Bungkus kata aksen dengan *bintang*. */
  teks: string;
  /** Tulisan kecil di atas teks, khusus kartu pembuka dan penutup */
  label?: string;
  /** Teks voice over untuk bagian ini, dipakai jadi subtitle */
  vo?: string;
  media?: Media;
  /** Detik ke berapa bagian ini mulai di file VO. Kosongkan untuk dibagi otomatis. */
  mulai?: number;
};

export type Cue = {
  teks: string;
  mulai: number;
  selesai: number;
};

export type Episode = {
  slug: string;
  judul: string;
  pembuka: Kartu;
  catatan: Kartu[];
  penutup: Kartu;
  /** Nama file VO di public/aset/<slug>/ */
  vo?: string | null;
  /** Durasi VO dalam detik. Diisi otomatis oleh scripts/siapkan-episode.mjs */
  durasiVO?: number | null;
  musik?: string | null;
  volumeMusik?: number;
  /** Isi kalau mau atur subtitle manual, menimpa hasil otomatis */
  subtitle?: Cue[] | null;
  /** Lama kartu penutup dalam detik */
  durasiPenutup?: number;
};

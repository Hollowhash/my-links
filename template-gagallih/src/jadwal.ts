import type { Episode, Kartu } from "./tipe";
import { ukuran } from "./tema";

export type Bagian = { dari: number; sampai: number };

export type Jadwal = {
  pembuka: Bagian;
  catatan: Bagian[];
  penutup: Bagian;
  totalFrame: number;
  totalDetik: number;
};

/** Perkiraan lama baca kalau VO belum ada: sekitar 14 huruf per detik. */
const perkiraanDetik = (k: Kartu) =>
  Math.max(2.5, (k.vo ?? k.teks).replace(/\*/g, "").length / 14);

/**
 * Bagi waktu untuk pembuka, semua catatan, dan penutup.
 * Kalau sebuah kartu punya "mulai", waktu itu dipakai apa adanya.
 * Sisanya dibagi otomatis sesuai panjang teks VO.
 */
export const hitungJadwal = (episode: Episode): Jadwal => {
  const fps = ukuran.fps;
  const semua: Kartu[] = [episode.pembuka, ...episode.catatan, episode.penutup];
  const bobot = semua.map(perkiraanDetik);
  const ekor = 0.6;

  const totalDetik =
    episode.durasiVO && episode.durasiVO > 0
      ? episode.durasiVO + ekor
      : bobot.reduce((a, b) => a + b, 0);

  // titik[i] = detik mulai kartu ke-i, titik[n] = akhir video
  const n = semua.length;
  const titik: (number | null)[] = semua.map((k, i) =>
    i === 0 ? (k.mulai ?? 0) : (k.mulai ?? null),
  );
  titik.push(totalDetik);

  let acuan = 0;
  for (let i = 1; i <= n; i++) {
    if (titik[i] === null) continue;
    const kosong = i - acuan - 1;
    if (kosong > 0) {
      const awal = titik[acuan] as number;
      const akhir = titik[i] as number;
      const porsi = bobot.slice(acuan, i);
      const jumlah = porsi.reduce((a, b) => a + b, 0);
      let jalan = awal;
      for (let j = 0; j < kosong; j++) {
        jalan += ((akhir - awal) * porsi[j]) / jumlah;
        titik[acuan + 1 + j] = jalan;
      }
    }
    acuan = i;
  }

  const frame = (detik: number) => Math.round(detik * fps);
  const bagian = (i: number): Bagian => ({
    dari: frame(titik[i] as number),
    sampai: frame(titik[i + 1] as number),
  });

  return {
    pembuka: bagian(0),
    catatan: episode.catatan.map((_, i) => bagian(i + 1)),
    penutup: bagian(n - 1),
    totalFrame: frame(totalDetik),
    totalDetik,
  };
};

import type { Cue, Episode, Kartu } from "./tipe";
import { ukuran } from "./tema";
import { hitungJadwal } from "./jadwal";

export type Potongan = { teks: string; aksen: boolean; ekor?: string };

/** Ubah "biaya *nol rupiah* kok" jadi potongan biasa dan potongan aksen. */
export const pecahAksen = (teks: string): Potongan[] =>
  teks
    .split(/(\*[^*]+\*)/g)
    .filter((bagian) => bagian.length > 0)
    .map((bagian) =>
      bagian.startsWith("*") && bagian.endsWith("*")
        ? { teks: bagian.slice(1, -1), aksen: true }
        : { teks: bagian, aksen: false },
    );

/**
 * Tempelkan tanda baca sesudah kata aksen ke kata itu sendiri,
 * supaya titik atau koma tidak jatuh sendirian ke baris berikutnya.
 */
export const rapikanTandaBaca = (potongan: Potongan[]): Potongan[] => {
  const hasil = potongan.map((p) => ({ ...p }));
  for (let i = 0; i < hasil.length - 1; i++) {
    if (!hasil[i].aksen) continue;
    const cocok = hasil[i + 1].teks.match(/^[.,!?:;]+/);
    if (!cocok) continue;
    hasil[i].ekor = cocok[0];
    hasil[i + 1].teks = hasil[i + 1].teks.slice(cocok[0].length);
  }
  return hasil.filter((p) => p.teks.length > 0 || p.ekor);
};

export const buangTandaAksen = (teks: string) => teks.replace(/\*/g, "");

/** Pecah kalimat panjang jadi potongan subtitle yang enak dibaca di HP. */
const pecahKalimat = (teks: string, maks = 64): string[] => {
  const kalimat = teks
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?,:])\s+/)
    .filter(Boolean);

  const hasil: string[] = [];
  for (const k of kalimat) {
    if (k.length <= maks) {
      hasil.push(k);
      continue;
    }
    let baris = "";
    for (const kata of k.split(" ")) {
      if ((baris + " " + kata).trim().length > maks) {
        hasil.push(baris.trim());
        baris = kata;
      } else {
        baris = (baris + " " + kata).trim();
      }
    }
    if (baris.trim()) hasil.push(baris.trim());
  }
  return hasil;
};

/** Bagi teks jadi dua baris supaya tidak melebar ke pinggir layar. */
export const duaBaris = (teks: string): string[] => {
  const kata = teks.split(" ");
  if (teks.length <= 34 || kata.length < 3) return [teks];
  let kiri = "";
  let i = 0;
  while (i < kata.length && (kiri + " " + kata[i]).trim().length <= teks.length / 2) {
    kiri = (kiri + " " + kata[i]).trim();
    i++;
  }
  return [kiri, kata.slice(i).join(" ")];
};

const cueDariKartu = (kartu: Kartu, dariFrame: number, sampaiFrame: number): Cue[] => {
  const vo = kartu.vo ?? buangTandaAksen(kartu.teks);
  const potongan = pecahKalimat(vo);
  if (potongan.length === 0) return [];

  const total = potongan.reduce((a, b) => a + b.length, 0);
  let jalan = dariFrame;
  return potongan.map((teks, i) => {
    const panjang = ((sampaiFrame - dariFrame) * teks.length) / total;
    const mulai = jalan;
    jalan += panjang;
    const selesai = i === potongan.length - 1 ? sampaiFrame : jalan;
    return { teks, mulai: Math.round(mulai), selesai: Math.round(selesai) };
  });
};

/**
 * Subtitle untuk seluruh episode, dalam frame.
 * Kalau episode.subtitle diisi (dalam detik), itu yang dipakai.
 */
export const buatSubtitle = (episode: Episode): Cue[] => {
  if (episode.subtitle && episode.subtitle.length > 0) {
    return episode.subtitle.map((c) => ({
      teks: c.teks,
      mulai: Math.round(c.mulai * ukuran.fps),
      selesai: Math.round(c.selesai * ukuran.fps),
    }));
  }

  const jadwal = hitungJadwal(episode);
  const pasangan: [Kartu, { dari: number; sampai: number }][] = [
    [episode.pembuka, jadwal.pembuka],
    ...episode.catatan.map(
      (k, i) => [k, jadwal.catatan[i]] as [Kartu, { dari: number; sampai: number }],
    ),
    [episode.penutup, jadwal.penutup],
  ];

  return pasangan.flatMap(([kartu, bagian]) =>
    cueDariKartu(kartu, bagian.dari, bagian.sampai),
  );
};

/** Pilih ukuran huruf supaya teks panjang tidak melebihi kartu. */
export const ukuranHurufKartu = (teks: string, pembuka = false): number => {
  const panjang = buangTandaAksen(teks).length;
  if (pembuka) {
    if (panjang <= 46) return 94;
    if (panjang <= 72) return 82;
    if (panjang <= 104) return 72;
    return 64;
  }
  if (panjang <= 58) return 78;
  if (panjang <= 92) return 70;
  if (panjang <= 132) return 62;
  return 54;
};

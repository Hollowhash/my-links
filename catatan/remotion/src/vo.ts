export type Kata = { word: string; start: number; end: number };

const polos = (s: string) => s.toLowerCase().replace(/[^a-z0-9-]/g, "");

/**
 * Alat untuk satu episode: cari detik saat sebuah frasa mulai diucapkan.
 * Dipakai supaya animasi jatuh tepat di kata yang sedang terdengar.
 */
export const buatVo = (sumber: { words: Kata[] }) => {
  const KATA = sumber.words;

  const kapan = (frasa: string, mulaiDari = 0): number => {
    const cari = frasa.split(" ").map(polos);
    for (let i = 0; i + cari.length <= KATA.length; i++) {
      if (KATA[i].start < mulaiDari) continue;
      let cocok = true;
      for (let j = 0; j < cari.length; j++) {
        if (!polos(KATA[i + j].word).startsWith(cari[j])) {
          cocok = false;
          break;
        }
      }
      if (cocok) return KATA[i].start;
    }
    throw new Error(`Frasa tidak ada di naskah: "${frasa}"`);
  };

  return { KATA, kapan };
};

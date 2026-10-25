// Susun timeline.json dari naskah: tiap scene dikunci ke kata di voice over,
// jadi kalau VO diganti, batas scene ikut bergeser sendiri.
// Pakai: node tools/buat-timeline.mjs
import fs from "node:fs";

const slug = process.argv[2];
if (!slug) {
  console.error("Pakai: node tools/buat-timeline.mjs <slug>   (contoh: ep02)");
  process.exit(1);
}
const dir = `remotion/src/episodes/${slug}`;
const { durasi, words } = JSON.parse(fs.readFileSync(`${dir}/words.json`, "utf8"));

const polos = (s) => s.toLowerCase().replace(/[^a-z0-9-]/g, "");

const cari = (frasa) => {
  const cari2 = frasa.split(" ").map(polos);
  for (let i = 0; i + cari2.length <= words.length; i++) {
    let cocok = true;
    for (let j = 0; j < cari2.length; j++) {
      if (!polos(words[i + j].word).startsWith(cari2[j])) {
        cocok = false;
        break;
      }
    }
    if (cocok) return words[i].start;
  }
  throw new Error(`Frasa tidak ketemu di naskah: "${frasa}"`);
};

const daftar = JSON.parse(fs.readFileSync(`${dir}/adegan.json`, "utf8"));

const ekor = 1.2;
const total = Number((durasi + ekor).toFixed(2));

const scenes = daftar.map(([id, frasa], i) => {
  const mulai = frasa === null ? 0 : Number(cari(frasa).toFixed(2));
  return { id, mulai, selesai: 0, index: i };
});
scenes.forEach((s, i) => {
  s.selesai = i + 1 < scenes.length ? scenes[i + 1].mulai : total;
  delete s.index;
});

const timeline = {
  total,
  fps: 30,
  lebar: 1080,
  tinggi: 1920,
  slug,
  vo: "voice_over.mp3",
  scenes,
  // Bagian musik: tegang di awal, beat untuk penjelasan, tenang di penutup.
  music: {
    tension_end: scenes[2].mulai,
    groove_end: scenes[Math.max(0, scenes.length - 5)].mulai,
    break_end: scenes[scenes.length - 3].mulai,
  },
  // Swoosh tipis 0,2 detik sebelum tiap pergantian scene.
  sfx: scenes.slice(1).map((s) => ({ jenis: "swoosh", at: Number((s.mulai - 0.2).toFixed(2)) })),
  ambience: [{ jenis: "ruang", dari: 0, sampai: total, volume: 0.05 }],
};

fs.writeFileSync(`${dir}/timeline.json`, JSON.stringify(timeline, null, 1) + "\n");
console.log(`total ${total} detik, ${scenes.length} scene`);
for (const s of scenes) {
  console.log(`  ${s.id.padEnd(10)} ${s.mulai.toFixed(2)} - ${s.selesai.toFixed(2)}  (${(s.selesai - s.mulai).toFixed(2)}s)`);
}

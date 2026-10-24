// Susun timeline.json dari naskah: tiap scene dikunci ke kata di voice over,
// jadi kalau VO diganti, batas scene ikut bergeser sendiri.
// Pakai: node tools/buat-timeline.mjs
import fs from "node:fs";

const { durasi, words } = JSON.parse(fs.readFileSync("remotion/src/words.json", "utf8"));

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

const daftar = [
  ["hook1", null],
  ["hook2", "Banyak yang diam"],
  ["judul4", "Kita lurusin"],
  ["mitos1", "Mitos satu"],
  ["fakta1", "Faktanya undang-undang"],
  ["fakta1b", "sesuai kemampuannya"],
  ["mitos2", "Mitos dua"],
  ["fakta2", "Faktanya hakim"],
  ["foto2", "Kalau putusannya"],
  ["mitos3", "Mitos tiga"],
  ["wow3d", "Faktanya Mahkamah"],
  ["bukti", "Simpan bukti"],
  ["mitos4", "Mitos empat"],
  ["klip2", "Faktanya lo"],
  ["eksekusi", "Ujungnya bisa"],
  ["posbakum", "Yang nggak mampu"],
  ["penutup", "Nagih nafkah"],
  ["komentar", "Menurut lo"],
  ["cta", "Simpan kirim"],
];

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
  vo: "voice_over.mp3",
  scenes,
  music: {
    tension_end: scenes.find((s) => s.id === "judul4").mulai,
    groove_end: scenes.find((s) => s.id === "wow3d").mulai,
    break_end: scenes.find((s) => s.id === "penutup").mulai,
  },
  // Swoosh tipis 0,2 detik sebelum tiap pergantian scene.
  sfx: scenes.slice(1).map((s) => ({ jenis: "swoosh", at: Number((s.mulai - 0.2).toFixed(2)) })),
  ambience: [{ jenis: "ruang", dari: 0, sampai: total, volume: 0.05 }],
};

fs.writeFileSync("remotion/src/timeline.json", JSON.stringify(timeline, null, 1) + "\n");
console.log(`total ${total} detik, ${scenes.length} scene`);
for (const s of scenes) {
  console.log(`  ${s.id.padEnd(10)} ${s.mulai.toFixed(2)} - ${s.selesai.toFixed(2)}  (${(s.selesai - s.mulai).toFixed(2)}s)`);
}

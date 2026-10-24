// Cek aturan konten sebelum video dikirim ke Galih.
// Pakai: node scripts/cek-sebelum-kirim.mjs <slug>
import fs from "node:fs";
import path from "node:path";

const slug = process.argv[2];
if (!slug) {
  console.error("Pakai: node scripts/cek-sebelum-kirim.mjs <slug>");
  process.exit(1);
}

const episode = JSON.parse(
  fs.readFileSync(path.join("episodes", slug, "episode.json"), "utf8"),
);
const folderAset = path.join("public", "aset", slug);

const dilarang = [
  "pinjol", "ojk", "paylater", "pay later", "slik", "bi checking",
  "skor kredit", "galbay", "penagih utang", "debt collector",
];

const masalah = [];
const catatanKecil = [];

const semuaKartu = [
  ["pembuka", episode.pembuka],
  ...episode.catatan.map((k, i) => [`catatan ${i + 1}`, k]),
  ["penutup", episode.penutup],
];

for (const [nama, kartu] of semuaKartu) {
  const teks = [kartu.teks, kartu.vo ?? "", kartu.label ?? ""].join(" ");
  const kecil = teks.toLowerCase();

  if (/@[a-z0-9._]+/i.test(teks)) masalah.push(`${nama}: ada nama akun di teks`);
  if (teks.includes("—")) masalah.push(`${nama}: ada tanda pisah panjang`);

  for (const kata of dilarang) {
    if (kecil.includes(kata)) masalah.push(`${nama}: topik terlarang "${kata}"`);
  }

  const bintang = (kartu.teks.match(/\*/g) ?? []).length;
  if (bintang % 2 !== 0) masalah.push(`${nama}: tanda *aksen* tidak lengkap`);
  if (bintang === 0) catatanKecil.push(`${nama}: belum ada kata aksen`);

  if (kartu.teks.replace(/\*/g, "").length > 150) {
    catatanKecil.push(`${nama}: teks panjang, cek jangan sampai terpotong`);
  }

  if (!kartu.vo) catatanKecil.push(`${nama}: belum ada teks VO untuk subtitle`);

  if (kartu.media) {
    const penuh = path.join(folderAset, kartu.media.file);
    if (!fs.existsSync(penuh)) masalah.push(`${nama}: file ${kartu.media.file} tidak ada`);
  } else if (nama.startsWith("catatan")) {
    catatanKecil.push(`${nama}: belum ada foto atau klip`);
  }
}

if (!episode.vo) catatanKecil.push("belum ada file voice over");
if (episode.durasiVO && (episode.durasiVO < 60 || episode.durasiVO > 110)) {
  catatanKecil.push(`durasi VO ${episode.durasiVO} detik, target sekitar 90 detik`);
}

console.log(`Cek episode: ${episode.judul}\n`);
if (masalah.length === 0) console.log("Tidak ada pelanggaran aturan.");
else {
  console.log("HARUS DIBETULKAN:");
  for (const m of masalah) console.log("  x " + m);
}
if (catatanKecil.length > 0) {
  console.log("\nPerlu dilihat lagi:");
  for (const c of catatanKecil) console.log("  - " + c);
}

process.exit(masalah.length > 0 ? 1 : 0);

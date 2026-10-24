// Isi otomatis durasi VO dan durasi tiap klip ke dalam episode.json.
// Pakai: node scripts/siapkan-episode.mjs <slug>
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const slug = process.argv[2];
if (!slug) {
  console.error("Pakai: node scripts/siapkan-episode.mjs <slug>");
  process.exit(1);
}

const berkas = path.join("episodes", slug, "episode.json");
const folderAset = path.join("public", "aset", slug);
const episode = JSON.parse(fs.readFileSync(berkas, "utf8"));

const durasi = (namaFile) => {
  const penuh = path.join(folderAset, namaFile);
  if (!fs.existsSync(penuh)) return null;
  const keluaran = execFileSync("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "csv=p=0",
    penuh,
  ]).toString().trim();
  const angka = Number(keluaran);
  return Number.isFinite(angka) ? Math.round(angka * 100) / 100 : null;
};

const hilang = [];

if (episode.vo) {
  const d = durasi(episode.vo);
  if (d === null) hilang.push(episode.vo);
  else {
    episode.durasiVO = d;
    console.log(`VO ${episode.vo}: ${d} detik`);
  }
}

if (episode.musik && durasi(episode.musik) === null) hilang.push(episode.musik);

const semuaKartu = [episode.pembuka, ...episode.catatan, episode.penutup];
for (const kartu of semuaKartu) {
  const media = kartu?.media;
  if (!media) continue;
  const d = durasi(media.file);
  if (d === null) {
    hilang.push(media.file);
    continue;
  }
  if (media.jenis === "klip") {
    media.durasiKlip = d;
    console.log(`klip ${media.file}: ${d} detik`);
  }
}

fs.writeFileSync(berkas, JSON.stringify(episode, null, 2) + "\n");
console.log(`\n${berkas} sudah diperbarui.`);

if (hilang.length > 0) {
  console.log("\nBahan yang belum ada di " + folderAset + ":");
  for (const f of hilang) console.log("  - " + f);
}

// Timing per kata dari voice over.
// whisper-tiny lokal untuk dengar, lalu hasilnya di-align ke naskah asli
// supaya teksnya 100% sama dengan naskah.
// Pakai: node run.mjs <voice_over.mp3> <naskah.txt> <keluaran words.json>
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env, pipeline } from "@xenova/transformers";

const sini = path.dirname(fileURLToPath(import.meta.url));
env.localModelPath = path.join(sini, "node_modules/sts-whisper-tiny/models");
env.allowRemoteModels = false;
env.allowLocalModels = true;

const [mp3, naskahPath, keluaran] = process.argv.slice(2);
if (!mp3 || !naskahPath || !keluaran) {
  console.error("Pakai: node run.mjs <voice_over.mp3> <naskah.txt> <words.json>");
  process.exit(1);
}

const bersih = (s) =>
  s
    .toLowerCase()
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/[^a-z0-9àâäéèêëîïôöùûüç.\s-]/gi, " ")
    .replace(/\./g, " ")
    .replace(/\s+/g, " ")
    .trim();

// --- 1. Audio jadi PCM 16 kHz mono ---
const wav = path.join(sini, "tmp-16k.wav");
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", mp3, "-ac", "1", "-ar", "16000", "-f", "wav", wav]);
const buf = fs.readFileSync(wav);
let pos = 12;
let dataOffset = 0;
let dataLen = 0;
while (pos < buf.length - 8) {
  const id = buf.toString("ascii", pos, pos + 4);
  const len = buf.readUInt32LE(pos + 4);
  if (id === "data") {
    dataOffset = pos + 8;
    dataLen = len;
    break;
  }
  pos += 8 + len + (len % 2);
}
const contoh = new Float32Array(dataLen / 2);
for (let i = 0; i < contoh.length; i++) {
  contoh[i] = buf.readInt16LE(dataOffset + i * 2) / 32768;
}
const LAJU = 16000;
const durasi = contoh.length / LAJU;

// --- 2. Cari jeda, lalu potong jadi bagian 9 sampai 12 detik ---
const keluaranSilence = spawnSync(
  "ffmpeg",
  ["-i", mp3, "-af", "silencedetect=noise=-34dB:d=0.18", "-f", "null", "-"],
  { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
).stderr;

const jeda = [];
{
  let mulai = null;
  for (const baris of keluaranSilence.split("\n")) {
    const a = baris.match(/silence_start: ([\d.]+)/);
    const b = baris.match(/silence_end: ([\d.]+)/);
    if (a) mulai = Number(a[1]);
    if (b && mulai !== null) {
      jeda.push([mulai, Number(b[1])]);
      mulai = null;
    }
  }
}

const potong = [];
{
  let awal = 0;
  for (const [js, je] of jeda) {
    const tengah = (js + je) / 2;
    if (tengah - awal >= 9) {
      potong.push([awal, tengah]);
      awal = tengah;
    }
  }
  potong.push([awal, durasi]);
}

console.log(`Audio ${durasi.toFixed(2)} detik, ${potong.length} bagian, ${jeda.length} jeda.`);

// --- 3. Dengarkan tiap bagian ---
const kenal = [];
const asr = await pipeline("automatic-speech-recognition", "Xenova/whisper-tiny");
for (const [a, b] of potong) {
  const bagian = contoh.slice(Math.floor(a * LAJU), Math.floor(b * LAJU));
  const hasil = await asr(bagian, {
    language: "indonesian",
    task: "transcribe",
    return_timestamps: "word",
    chunk_length_s: 30,
  });
  for (const k of hasil.chunks ?? []) {
    const teks = bersih(k.text);
    if (!teks) continue;
    const [m, s] = k.timestamp;
    kenal.push({ teks, mulai: a + (m ?? 0), selesai: a + (s ?? m ?? 0) });
  }
  process.stdout.write(`  bagian ${a.toFixed(1)} sampai ${b.toFixed(1)} detik selesai\n`);
}

// --- 4. Sandingkan naskah asli dengan hasil dengar ---
const naskah = fs.readFileSync(naskahPath, "utf8");
const kataNaskah = [];
for (const baris of naskah.split("\n")) {
  const tanpaTag = baris.replace(/\[[^\]]*\]/g, " ");
  for (const k of tanpaTag.split(/\s+/)) {
    if (k.trim()) kataNaskah.push(k.trim());
  }
}
const normal = kataNaskah.map((k) => bersih(k));
const hyp = kenal.map((k) => k.teks);

const biaya = (a, b) => {
  if (a === b) return 0;
  if (a.length > 3 && b.length > 3 && (a.startsWith(b.slice(0, 4)) || b.startsWith(a.slice(0, 4)))) return 0.35;
  return 1;
};

const N = normal.length;
const M = hyp.length;
const d = Array.from({ length: N + 1 }, () => new Float64Array(M + 1));
const jejak = Array.from({ length: N + 1 }, () => new Uint8Array(M + 1));
for (let i = 1; i <= N; i++) {
  d[i][0] = i;
  jejak[i][0] = 1;
}
for (let j = 1; j <= M; j++) {
  d[0][j] = j;
  jejak[0][j] = 2;
}
for (let i = 1; i <= N; i++) {
  for (let j = 1; j <= M; j++) {
    const ganti = d[i - 1][j - 1] + biaya(normal[i - 1], hyp[j - 1]);
    const buang = d[i - 1][j] + 1;
    const sisip = d[i][j - 1] + 1;
    const min = Math.min(ganti, buang, sisip);
    d[i][j] = min;
    jejak[i][j] = min === ganti ? 0 : min === buang ? 1 : 2;
  }
}

const waktu = new Array(N).fill(null);
{
  let i = N;
  let j = M;
  while (i > 0 && j > 0) {
    const arah = jejak[i][j];
    if (arah === 0) {
      if (biaya(normal[i - 1], hyp[j - 1]) < 1) {
        waktu[i - 1] = { mulai: kenal[j - 1].mulai, selesai: kenal[j - 1].selesai };
      }
      i--;
      j--;
    } else if (arah === 1) i--;
    else j--;
  }
}

const cocok = waktu.filter(Boolean).length;
console.log(`Kata naskah: ${N}, kata terdengar: ${M}, cocok: ${cocok} (${Math.round((cocok / N) * 100)}%)`);

// --- 5. Saring jangkar, lalu bagi sisanya di atas waktu bicara saja ---

// Bagian audio yang benar-benar ada suaranya (di luar jeda).
const bicara = [];
{
  let awal = 0;
  for (const [a, b] of jeda) {
    if (a - awal > 0.08) bicara.push([awal, a]);
    awal = b;
  }
  bicara.push([awal, durasi]);
}

/** Lama bicara (tanpa jeda) antara dua detik. */
const bicaraAntara = (a, b) => {
  let jumlah = 0;
  for (const [x, y] of bicara) jumlah += Math.max(0, Math.min(b, y) - Math.max(a, x));
  return jumlah;
};

/** Maju dari detik `t` sebanyak `d` detik bicara, melompati jeda. */
const majuBicara = (t, d) => {
  let sisa = d;
  for (const [x, y] of bicara) {
    if (y <= t) continue;
    const dari = Math.max(t, x);
    const ada = y - dari;
    if (ada >= sisa) return dari + sisa;
    sisa -= ada;
  }
  return durasi;
};

const panjang = (i) => Math.max(2, normal[i].replace(/[^a-z0-9]/g, "").length);

// Pilih kumpulan jangkar terbanyak yang masih masuk akal:
// jarak antar jangkar harus cukup untuk mengucapkan kata di antaranya.
const calon = [];
for (let i = 0; i < N; i++) if (waktu[i]) calon.push(i);

const masukAkal = (a, b) => {
  const kata = b - a;
  const lama = bicaraAntara(waktu[a].mulai, waktu[b].mulai);
  return lama >= 0.2 * kata && lama <= 0.85 * kata;
};

const skor = new Array(calon.length).fill(1);
const dari = new Array(calon.length).fill(-1);
for (let j = 0; j < calon.length; j++) {
  for (let i = 0; i < j; i++) {
    if (skor[i] + 1 > skor[j] && masukAkal(calon[i], calon[j])) {
      skor[j] = skor[i] + 1;
      dari[j] = i;
    }
  }
}
let akhirJ = 0;
for (let j = 1; j < calon.length; j++) if (skor[j] > skor[akhirJ]) akhirJ = j;
const jangkar = [];
for (let j = akhirJ; j !== -1; j = dari[j]) jangkar.unshift(calon[j]);
console.log(`Jangkar dipakai: ${jangkar.length} dari ${calon.length}`);

const hasil = new Array(N).fill(null);
const isiAntara = (dariIdx, sampaiIdx, t0, t1) => {
  if (sampaiIdx <= dariIdx) return;
  let total = 0;
  for (let k = dariIdx; k < sampaiIdx; k++) total += panjang(k);
  const adaBicara = bicaraAntara(t0, t1);
  const pakaiBicara = adaBicara > 0.05;
  const rentang = pakaiBicara ? adaBicara : Math.max(0.05, t1 - t0);
  let jalan = t0;
  for (let k = dariIdx; k < sampaiIdx; k++) {
    const d = (rentang * panjang(k)) / total;
    const selesai = pakaiBicara ? majuBicara(jalan, d) : Math.min(t1, jalan + d);
    hasil[k] = { mulai: jalan, selesai };
    jalan = selesai;
  }
};

if (jangkar.length === 0) {
  isiAntara(0, N, 0, durasi);
} else {
  isiAntara(0, jangkar[0], 0, waktu[jangkar[0]].mulai);
  for (let j = 0; j < jangkar.length; j++) {
    const i = jangkar[j];
    const berikut = j + 1 < jangkar.length ? jangkar[j + 1] : N;
    const batasAkhir = j + 1 < jangkar.length ? waktu[berikut].mulai : durasi;
    // Kata jangkar ikut dibagi bersama kata sesudahnya, supaya tidak ada
    // bagian yang panjangnya nol.
    isiAntara(i, berikut, waktu[i].mulai, batasAkhir);
  }
}

const batas = (x) => Math.min(durasi, Math.max(0, x));
let akhir = 0;
const kata = hasil.map((w, i) => {
  const mulai = batas(Math.max(akhir, w.mulai));
  const selesai = batas(Math.max(mulai + 0.06, Math.min(w.selesai, mulai + 1.6)));
  akhir = mulai;
  return { word: kataNaskah[i], start: Number(mulai.toFixed(3)), end: Number(selesai.toFixed(3)) };
});
for (let i = 0; i < kata.length - 1; i++) {
  if (kata[i].end > kata[i + 1].start) kata[i].end = kata[i + 1].start;
}
kata[kata.length - 1].end = Number(batas(durasi - 0.05).toFixed(3));

// Peringatan kalau masih ada bagian yang terlalu cepat.
for (let i = 0; i + 4 < kata.length; i++) {
  const laju = 5 / Math.max(0.01, kata[i + 4].start - kata[i].start);
  if (laju > 6) console.log(`  cepat di detik ${kata[i].start.toFixed(2)}: "${kata.slice(i, i + 5).map((k) => k.word).join(" ")}"`);
}

fs.writeFileSync(keluaran, JSON.stringify({ durasi, words: kata }, null, 1) + "\n");
fs.unlinkSync(wav);
console.log(`Ditulis ke ${keluaran}. Kata pertama mulai ${kata[0].start} detik.`);

// Dengarkan voice over tanpa naskah pembanding, lalu cetak teksnya.
// Dipakai kalau paket naskah belum ada, supaya isi videonya bisa dikenali.
// Pakai: node transkrip.mjs <voice_over.mp3>
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env, pipeline } from "@xenova/transformers";

const sini = path.dirname(fileURLToPath(import.meta.url));
env.localModelPath = path.join(sini, "node_modules/sts-whisper-tiny/models");
env.allowRemoteModels = false;
env.allowLocalModels = true;

const mp3 = process.argv[2];
const wav = path.join(sini, "tmp-transkrip.wav");
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
for (let i = 0; i < contoh.length; i++) contoh[i] = buf.readInt16LE(dataOffset + i * 2) / 32768;
const LAJU = 16000;
const durasi = contoh.length / LAJU;

const keluaranSilence = spawnSync(
  "ffmpeg",
  ["-i", mp3, "-af", "silencedetect=noise=-34dB:d=0.18", "-f", "null", "-"],
  { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
).stderr;
const jeda = [];
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
const potong = [];
let awal = 0;
for (const [js, je] of jeda) {
  const tengah = (js + je) / 2;
  if (tengah - awal >= 9) {
    potong.push([awal, tengah]);
    awal = tengah;
  }
}
potong.push([awal, durasi]);

const asr = await pipeline("automatic-speech-recognition", "Xenova/whisper-tiny");
for (const [a, b] of potong) {
  const bagian = contoh.slice(Math.floor(a * LAJU), Math.floor(b * LAJU));
  const hasil = await asr(bagian, { language: "indonesian", task: "transcribe", chunk_length_s: 30 });
  console.log(`[${a.toFixed(1)}-${b.toFixed(1)}] ${hasil.text.trim()}`);
}
fs.unlinkSync(wav);

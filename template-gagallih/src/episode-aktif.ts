// Episode yang sedang dikerjakan. Ganti satu baris di bawah untuk pindah episode.
import data from "../episodes/contoh/episode.json";
import type { Episode } from "./tipe";

export const episodeAktif = data as unknown as Episode;

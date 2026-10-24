import { interpolate } from "remotion";

/** Lama tumpang tindih antar kartu, dipakai untuk pergantian yang menyambung. */
export const TRANSISI = 14;

/** Gerak masuk yang pelan di ujung, enak dilihat untuk teks dan kartu. */
export const mulus = (
  frame: number,
  dari: number,
  sampai: number,
  nilai: [number, number],
) =>
  interpolate(frame, [dari, sampai], nilai, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

/** Gerak bolak-balik pelan untuk benda latar. */
export const ayun = (frame: number, laju: number, jauh: number, geser = 0) =>
  Math.sin(frame * laju + geser) * jauh;

import React from "react";
import { AbsoluteFill } from "remotion";
import { AMAN, C, F, ramp } from "./lib";
import kataJson from "./words.json";

type Kata = { word: string; start: number; end: number };

const semua = (kataJson as { words: Kata[] }).words;

/** Kelompokkan kata jadi baris pendek: berhenti di tanda baca, jeda, atau 5 kata. */
const buatBaris = () => {
  const baris: Kata[][] = [];
  let sekarang: Kata[] = [];
  for (let i = 0; i < semua.length; i++) {
    const k = semua[i];
    sekarang.push(k);
    const berikut = semua[i + 1];
    const jeda = berikut ? berikut.start - k.end : 99;
    const tandaBaca = /[.,!?]$/.test(k.word);
    if (!berikut || sekarang.length >= 5 || jeda > 0.42 || (tandaBaca && sekarang.length >= 2)) {
      baris.push(sekarang);
      sekarang = [];
    }
  }
  return baris;
};

const BARIS = buatBaris();

/** Caption karaoke: baris muncul utuh, kata yang sedang diucapkan menyala. */
export const Captions: React.FC<{ T: number }> = ({ T }) => {
  const aktif = BARIS.find((b, i) => {
    const mulai = b[0].start - 0.12;
    const berikut = BARIS[i + 1];
    const selesai = berikut ? berikut[0].start - 0.08 : b[b.length - 1].end + 0.4;
    return T >= mulai && T < selesai;
  });
  if (!aktif) return null;

  const mulai = aktif[0].start - 0.12;
  const muncul = ramp(T, mulai, mulai + 0.16);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: AMAN.capPad,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          padding: "20px 38px",
          borderRadius: 28,
          background: "rgba(255,255,255,0.93)",
          boxShadow: "0 14px 30px rgba(30,38,56,0.14)",
          fontFamily: F.sans,
          fontWeight: 700,
          fontSize: 46,
          lineHeight: 1.22,
          color: C.navy,
          textAlign: "center",
          opacity: muncul,
          transform: `translateY(${(1 - muncul) * 12}px)`,
        }}
      >
        {aktif.map((k, i) => {
          const nyala = T >= k.start - 0.04;
          return (
            <span
              key={i}
              style={{
                color: nyala ? C.aksen : C.navy,
                opacity: nyala ? 1 : 0.55,
                display: "inline-block",
              }}
            >
              {k.word}
              {i < aktif.length - 1 ? " " : null}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

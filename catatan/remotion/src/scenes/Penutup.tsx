import React from "react";
import { AbsoluteFill } from "remotion";
import { Bookmark, MessageCircle, Send, UserPlus } from "lucide-react";
import { AMAN, C, CardBG, F, KataDemiKata, Kartu, Mark, Rise, glass, ramp, springAt } from "../lib";
import { Isi } from "./dasar";
import { AdeganKlip } from "./Footage";
import { kapan } from "../vo";

/** Kalimat pembela penonton, di atas wajah ibu yang sudah tegar. */
export const Penutup: React.FC<{ T: number; mulai: number; selesai: number }> = ({
  T,
  mulai,
  selesai,
}) => (
  <AdeganKlip
    T={T}
    mulai={mulai}
    selesai={selesai}
    clip="klip-01.mp4"
    srcStart={5.3}
    rate={0.85}
    zoom={[1.12, 1.02]}
  >
    <AbsoluteFill style={{ padding: `${AMAN.atas + 10}px 82px 0` }}>
      <KataDemiKata
        T={T}
        at={mulai + 0.1}
        teks="Nagih nafkah anak bukan ngemis."
        style={{
          fontFamily: F.sans,
          fontWeight: 800,
          fontSize: 86,
          lineHeight: 1.06,
          color: C.putih,
          letterSpacing: "-0.02em",
          textShadow: "0 10px 36px rgba(30,38,56,0.6)",
        }}
      />
      <div
        style={{
          marginTop: 34,
          fontFamily: F.sans,
          fontWeight: 800,
          fontSize: 86,
          lineHeight: 1.06,
          color: C.aksen,
          letterSpacing: "-0.02em",
        }}
      >
        <Mark T={T} at={kapan("Itu hak anak lo")}>
          Itu hak anak lo.
        </Mark>
      </div>
    </AbsoluteFill>
  </AdeganKlip>
);

/** Pertanyaan untuk kolom komentar. */
export const Komentar: React.FC<{ T: number; mulai: number }> = ({ T, mulai }) => (
  <AbsoluteFill>
    <CardBG />
    <Isi>
      <Kartu T={T} at={mulai + 0.05} style={{ display: "flex", flexDirection: "column", gap: 34 }}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 30,
            background: C.stabilo,
            color: C.aksen,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${0.6 + springAt(T, mulai + 0.1, 11) * 0.4})`,
          }}
        >
          <MessageCircle size={52} strokeWidth={2.4} />
        </div>
        <KataDemiKata
          T={T}
          at={mulai + 0.25}
          teks="Menurut lo, apa yang paling bikin orang tua tunggal nggak nagih?"
          jeda={0.055}
          style={{
            fontFamily: F.sans,
            fontWeight: 800,
            fontSize: 68,
            lineHeight: 1.14,
            color: C.navy,
            letterSpacing: "-0.015em",
          }}
        />
        <Rise T={T} at={mulai + 1.9} jauh={16}>
          <div
            style={{
              fontFamily: F.mono,
              fontWeight: 600,
              fontSize: 30,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: C.aksen,
            }}
          >
            tulis di komentar
          </div>
        </Rise>
      </Kartu>
    </Isi>
  </AbsoluteFill>
);

const Tombol: React.FC<{ T: number; at: number; ikon: React.ReactNode; teks: string }> = ({
  T,
  at,
  ikon,
  teks,
}) => {
  const m = springAt(T, at, 11);
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        padding: "30px 10px",
        borderRadius: 32,
        background: C.stabilo,
        color: C.aksen,
        opacity: ramp(T, at, at + 0.2),
        transform: `translateY(${(1 - m) * 30}px) scale(${0.9 + m * 0.1})`,
      }}
    >
      {ikon}
      <div
        style={{
          fontFamily: F.sans,
          fontWeight: 800,
          fontSize: 34,
          color: C.navy,
        }}
      >
        {teks}
      </div>
    </div>
  );
};

/** Tombol simpan, kirim, follow, lalu kartu sumber. */
export const CTA: React.FC<{ T: number; mulai: number; selesai: number }> = ({
  T,
  mulai,
  selesai,
}) => (
  <AbsoluteFill>
    <CardBG />
    <Isi>
      <Kartu T={T} at={mulai + 0.05} style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        <div
          style={{
            fontFamily: F.sans,
            fontWeight: 800,
            fontSize: 60,
            lineHeight: 1.12,
            color: C.navy,
            letterSpacing: "-0.015em",
          }}
        >
          Kirim ke yang lagi butuh
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <Tombol T={T} at={kapan("Simpan, kirim")} ikon={<Bookmark size={54} strokeWidth={2.3} />} teks="Simpan" />
          <Tombol T={T} at={kapan("kirim ke yang")} ikon={<Send size={54} strokeWidth={2.3} />} teks="Kirim" />
          <Tombol T={T} at={kapan("follow akun")} ikon={<UserPlus size={54} strokeWidth={2.3} />} teks="Follow" />
        </div>
      </Kartu>

      <div
        style={{
          ...glass(0.95, 0, false),
          marginTop: 30,
          padding: 34,
          opacity: ramp(T, selesai - 2.2, selesai - 1.8),
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: C.kedua,
            marginBottom: 14,
          }}
        >
          sumber
        </div>
        <div style={{ fontFamily: F.mono, fontWeight: 500, fontSize: 27, lineHeight: 1.5, color: C.navy }}>
          UU 1/1974 Pasal 41 · UU Perlindungan Anak Pasal 26 · SEMA 4/2016 · KHI Pasal 156
          <br />
          SEMA 2/2019 · PP 45/1990 · Perma 1/2014 · Mahkamah Agung
        </div>
      </div>
    </Isi>
  </AbsoluteFill>
);

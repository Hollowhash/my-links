import React from "react";
import { AbsoluteFill } from "remotion";
import { Bookmark, MessageCircle, Send, UserPlus } from "lucide-react";
import { C, CardBG, F, KataDemiKata, Kartu, Rise, glass, ramp, springAt } from "../lib";
import { Isi } from "./dasar";

/** Kartu pertanyaan untuk kolom komentar. */
export const KartuKomentar: React.FC<{
  T: number;
  mulai: number;
  teks: string;
}> = ({ T, mulai, teks }) => (
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
          teks={teks}
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
      <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 34, color: C.navy }}>{teks}</div>
    </div>
  );
};

/** Tombol simpan, kirim, follow, lalu kartu sumber. */
export const KartuCTA: React.FC<{
  T: number;
  mulai: number;
  selesai: number;
  judul: string;
  atSimpan: number;
  atKirim: number;
  atFollow: number;
  sumber: string[];
}> = ({ T, mulai, selesai, judul, atSimpan, atKirim, atFollow, sumber }) => (
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
          {judul}
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <Tombol T={T} at={atSimpan} ikon={<Bookmark size={54} strokeWidth={2.3} />} teks="Simpan" />
          <Tombol T={T} at={atKirim} ikon={<Send size={54} strokeWidth={2.3} />} teks="Kirim" />
          <Tombol T={T} at={atFollow} ikon={<UserPlus size={54} strokeWidth={2.3} />} teks="Follow" />
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
          {sumber.map((b, i) => (
            <div key={i}>{b}</div>
          ))}
        </div>
      </div>
    </Isi>
  </AbsoluteFill>
);

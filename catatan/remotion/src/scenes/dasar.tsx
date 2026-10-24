import React from "react";
import { AbsoluteFill } from "remotion";
import { AMAN, C, CardBG, CatatanLabel, F, Kartu, Rise, Strike, Sumber, ramp, springAt } from "../lib";

/** Bingkai isi: menjaga semua teks di dalam area aman layar HP. */
export const Isi: React.FC<{ children: React.ReactNode; rata?: "atas" | "tengah" }> = ({
  children,
  rata = "tengah",
}) => (
  <AbsoluteFill
    style={{
      padding: `${AMAN.atas}px 82px ${1920 - AMAN.bawah}px 62px`,
      display: "flex",
      flexDirection: "column",
      justifyContent: rata === "tengah" ? "center" : "flex-start",
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Label kecil berbentuk pil, misalnya MITOS atau FAKTA. */
export const Pil: React.FC<{
  T: number;
  at: number;
  teks: string;
  warna?: string;
  teksWarna?: string;
}> = ({ T, at, teks, warna = C.stabilo, teksWarna = C.aksen }) => {
  const m = springAt(T, at, 12);
  return (
    <div
      style={{
        alignSelf: "flex-start",
        padding: "14px 28px",
        borderRadius: 999,
        background: warna,
        color: teksWarna,
        fontFamily: F.mono,
        fontWeight: 600,
        fontSize: 30,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        transform: `scale(${0.8 + m * 0.2})`,
        opacity: ramp(T, at, at + 0.22),
      }}
    >
      {teks}
    </div>
  );
};

/** Kartu mitos: kalimat yang salah, lalu dicoret. */
export const KartuMitos: React.FC<{
  T: number;
  mulai: number;
  n: number;
  dari: number;
  teks: string;
  coretAt: number;
}> = ({ T, mulai, n, dari, teks, coretAt }) => (
  <AbsoluteFill>
    <CardBG />
    <Isi>
      <Kartu T={T} at={mulai + 0.05} style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <CatatanLabel T={T} at={mulai + 0.1} n={n} dari={dari} judul="mitos" />
        </div>
        <div
          style={{
            fontFamily: F.sans,
            fontWeight: 800,
            fontSize: 76,
            lineHeight: 1.14,
            color: C.navy,
            letterSpacing: "-0.015em",
          }}
        >
          <Strike T={T} at={coretAt} tebal={9}>
            {teks}
          </Strike>
        </div>
        <Rise T={T} at={coretAt + 0.18} jauh={16}>
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
            ini keliru
          </div>
        </Rise>
      </Kartu>
    </Isi>
  </AbsoluteFill>
);

export type Poin = { ikon: React.ReactNode; teks: string; at: number };

/** Kartu fakta: poin muncul satu per satu, sumber di bawah. */
export const KartuFakta: React.FC<{
  T: number;
  mulai: number;
  judul?: string;
  poin: Poin[];
  sumber?: string;
  pil?: string;
}> = ({ T, mulai, judul, poin, sumber, pil = "faktanya" }) => (
  <AbsoluteFill>
    <CardBG />
    <Isi>
      <Kartu T={T} at={mulai + 0.05} style={{ display: "flex", flexDirection: "column", gap: 34 }}>
        <Pil T={T} at={mulai + 0.1} teks={pil} />
        {judul ? (
          <Rise T={T} at={mulai + 0.2}>
            <div
              style={{
                fontFamily: F.sans,
                fontWeight: 800,
                fontSize: 62,
                lineHeight: 1.16,
                color: C.navy,
                letterSpacing: "-0.015em",
              }}
            >
              {judul}
            </div>
          </Rise>
        ) : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          {poin.map((p, i) => {
            const m = springAt(T, p.at, 13);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  opacity: ramp(T, p.at, p.at + 0.28),
                  transform: `translateX(${(1 - m) * 26}px)`,
                }}
              >
                <div
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 24,
                    background: C.stabilo,
                    color: C.aksen,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {p.ikon}
                </div>
                <div
                  style={{
                    fontFamily: F.sans,
                    fontWeight: 700,
                    fontSize: 46,
                    lineHeight: 1.2,
                    color: C.navy,
                  }}
                >
                  {p.teks}
                </div>
              </div>
            );
          })}
        </div>
        {sumber ? <Sumber T={T} at={poin[poin.length - 1].at + 0.3} teks={sumber} /> : null}
      </Kartu>
    </Isi>
  </AbsoluteFill>
);

import React from "react";
import { AbsoluteFill } from "remotion";
import { C, F, ramp, springAt } from "./lib";

/**
 * Kartu kaca. Efek buramnya dibuat dengan menumpuk salinan latar yang sudah
 * diburamkan, bukan `backdrop-filter`, karena backdrop-filter bikin teks
 * berbayang di Chrome headless.
 *
 * `latarBuram` harus elemen latar yang sama persis dengan yang di belakang,
 * hanya dengan `blur` dihidupkan, supaya gambarnya pas.
 */
export const Kaca: React.FC<{
  T: number;
  at: number;
  x: number;
  y: number;
  lebar: number;
  latarBuram: React.ReactNode;
  anak: React.ReactNode;
  pad?: number;
  sudut?: number;
  kabut?: number;
}> = ({ T, at, x, y, lebar, latarBuram, anak, pad = 44, sudut = 48, kabut = 0.56 }) => {
  const m = springAt(T, at, 17);
  const muncul = ramp(T, at, at + 0.3);
  // Kilau yang menyapu sekali saat kartu masuk.
  const kilau = ramp(T, at + 0.15, at + 1.1);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: lebar,
        borderRadius: sudut,
        overflow: "hidden",
        opacity: muncul,
        transform: `translateY(${(1 - m) * 40}px) scale(${0.97 + m * 0.03})`,
        boxShadow: "0 30px 70px rgba(30,38,56,0.28), inset 0 1px 0 rgba(255,255,255,0.75)",
      }}
    >
      <div style={{ position: "absolute", left: -x, top: -y, width: 1080, height: 1920 }}>
        {latarBuram}
      </div>
      <div style={{ position: "absolute", inset: 0, background: `rgba(255,255,255,${kabut})` }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(104deg, rgba(255,255,255,0) ${kilau * 150 - 60}%, rgba(255,255,255,0.5) ${kilau * 150 - 28}%, rgba(255,255,255,0) ${kilau * 150}%)`,
        }}
      />
      <div style={{ position: "relative", padding: pad }}>{anak}</div>
    </div>
  );
};

/** Pita kaca yang menyapu layar, dipakai sebagai pergantian antar bagian. */
export const PitaKaca: React.FC<{ T: number; at: number; lama?: number }> = ({
  T,
  at,
  lama = 0.5,
}) => {
  const p = ramp(T, at, at + lama);
  if (p <= 0 || p >= 1) return null;
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: -400,
          left: -600 + p * 2200,
          width: 520,
          height: 2800,
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 45%, rgba(255,255,255,0) 100%)",
          transform: "rotate(14deg)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Angka yang naik sendiri, misalnya umur 30 sampai 55. */
export const Angka: React.FC<{
  T: number;
  at: number;
  dari: number;
  sampai: number;
  lama?: number;
  /** Pakai titik pemisah ribuan, misalnya 16.800. Jangan dipakai untuk tahun. */
  ribuan?: boolean;
  gaya?: React.CSSProperties;
}> = ({ T, at, dari, sampai, lama = 0.8, ribuan = false, gaya }) => {
  const p = ramp(T, at, at + lama);
  const nilai = Math.round(dari + (sampai - dari) * p);
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...gaya }}>
      {ribuan ? nilai.toLocaleString("id-ID") : nilai}
    </span>
  );
};

/** Centang yang tergambar sendiri. */
export const Centang: React.FC<{ T: number; at: number; ukuran?: number }> = ({
  T,
  at,
  ukuran = 46,
}) => {
  const p = ramp(T, at, at + 0.3);
  const panjang = 34;
  return (
    <svg width={ukuran} height={ukuran} viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
      <circle cx="16" cy="16" r="15" fill="none" stroke={C.aksen} strokeWidth="2.4" opacity={ramp(T, at - 0.1, at + 0.2)} />
      <path
        d="M9 16.5 l5 5 l9 -10"
        fill="none"
        stroke={C.aksen}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={panjang}
        strokeDashoffset={panjang * (1 - p)}
      />
    </svg>
  );
};

/** Satu baris syarat yang tercentang sendiri. */
export const BarisSyarat: React.FC<{
  T: number;
  at: number;
  anak: React.ReactNode;
}> = ({ T, at, anak }) => {
  const m = springAt(T, at - 0.15, 13);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        opacity: ramp(T, at - 0.2, at),
        transform: `translateX(${(1 - m) * 28}px)`,
      }}
    >
      <Centang T={T} at={at} />
      <div
        style={{
          fontFamily: F.sans,
          fontWeight: 700,
          fontSize: 44,
          lineHeight: 1.2,
          color: C.navy,
        }}
      >
        {anak}
      </div>
    </div>
  );
};

/** Garis waktu yang tergambar, dengan titik yang menyala satu per satu. */
export const GarisWaktu: React.FC<{
  T: number;
  at: number;
  titik: { label: string; at: number }[];
}> = ({ T, at, titik }) => {
  const tarik = ramp(T, at, at + 1.1);
  return (
    <div style={{ position: "relative", paddingTop: 28 }}>
      <div
        style={{
          position: "absolute",
          left: 22,
          right: 22,
          top: 44,
          height: 8,
          borderRadius: 4,
          background: "rgba(30,38,56,0.12)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 22,
          top: 44,
          height: 8,
          borderRadius: 4,
          background: C.aksen,
          width: `calc((100% - 44px) * ${tarik})`,
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
        {titik.map((t, i) => {
          const m = springAt(T, t.at, 11);
          const nyala = ramp(T, t.at, t.at + 0.3);
          return (
            <div
              key={i}
              style={{
                width: 190,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: nyala > 0.5 ? C.aksen : "rgba(30,38,56,0.22)",
                  border: "6px solid #FFFFFF",
                  transform: `scale(${0.72 + m * 0.28})`,
                  boxShadow: nyala > 0.5 ? "0 6px 16px rgba(217,72,43,0.35)" : "none",
                }}
              />
              <div
                style={{
                  fontFamily: F.sans,
                  fontWeight: 700,
                  fontSize: 32,
                  lineHeight: 1.2,
                  textAlign: "center",
                  color: C.navy,
                  opacity: 0.4 + nyala * 0.6,
                }}
              >
                {t.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Teks yang tersingkap seperti disapu, dengan garis aksen berjalan di depannya. */
export const TeksSapu: React.FC<{
  T: number;
  at: number;
  teks: string;
  lama?: number;
  gaya?: React.CSSProperties;
}> = ({ T, at, teks, lama = 0.7, gaya }) => {
  const p = ramp(T, at, at + lama);
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div style={{ ...gaya, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>{teks}</div>
      {p > 0 && p < 1 ? (
        <div
          style={{
            position: "absolute",
            top: "6%",
            bottom: "6%",
            left: `calc(${p * 100}% - 7px)`,
            width: 7,
            borderRadius: 4,
            background: C.aksen,
          }}
        />
      ) : null}
    </div>
  );
};

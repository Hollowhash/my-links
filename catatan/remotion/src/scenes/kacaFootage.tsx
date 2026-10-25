import React from "react";
import { AbsoluteFill } from "remotion";
import { C, Clip, F, Foto } from "../lib";
import { Kaca } from "../kaca";

/** Foto dengan kartu kaca di atasnya. Kacanya memakai salinan foto yang diburamkan. */
export const FotoKaca: React.FC<{
  T: number;
  mulai: number;
  selesai: number;
  file: string;
  zoom?: [number, number];
  geser?: [number, number];
  naik?: [number, number];
  kacaY: number;
  at: number;
  anak: React.ReactNode;
}> = ({ T, mulai, selesai, file, zoom, geser, naik, kacaY, at, anak }) => {
  const dasar = { file, dur: selesai - mulai, T, mulai, zoom, geser, naik };
  return (
    <AbsoluteFill>
      <Foto {...dasar} />
      <Kaca
        T={T}
        at={at}
        x={82}
        y={kacaY}
        lebar={916}
        latarBuram={<Foto {...dasar} blur={30} />}
        anak={anak}
      />
    </AbsoluteFill>
  );
};

/** Klip dengan kartu kaca di atasnya. */
export const KlipKaca: React.FC<{
  T: number;
  mulai: number;
  selesai: number;
  clip: string;
  srcStart?: number;
  rate?: number;
  zoom?: [number, number];
  kacaY: number;
  at: number;
  anak: React.ReactNode;
}> = ({ T, mulai, selesai, clip, srcStart, rate, zoom, kacaY, at, anak }) => {
  const dasar = { clip, srcStart, rate, zoom, dur: selesai - mulai, T, mulai };
  return (
    <AbsoluteFill>
      <Clip {...dasar} />
      <Kaca
        T={T}
        at={at}
        x={82}
        y={kacaY}
        lebar={916}
        latarBuram={<Clip {...dasar} blur={28} />}
        anak={anak}
      />
    </AbsoluteFill>
  );
};

export const judulKaca = (teks: string, catatan?: string) => (
  <>
    <div
      style={{
        fontFamily: F.sans,
        fontWeight: 800,
        fontSize: 58,
        lineHeight: 1.14,
        color: C.navy,
        letterSpacing: "-0.015em",
      }}
    >
      {teks}
    </div>
    {catatan ? (
      <div style={{ marginTop: 18, fontFamily: F.mono, fontWeight: 500, fontSize: 28, color: C.kedua }}>
        {catatan}
      </div>
    ) : null}
  </>
);


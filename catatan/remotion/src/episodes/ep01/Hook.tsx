import React from "react";
import { AbsoluteFill } from "remotion";
import { AMAN, C, F, KataDemiKata, Mark, glass, ramp } from "../../lib";
import { AdeganFoto, AdeganKlip } from "../../scenes/Footage";

/**
 * Pembuka: foto ibu menghitung uang, kartu judul sudah penuh di frame 0
 * supaya bisa dipakai sebagai gambar sampul.
 */
export const Hook1: React.FC<{ T: number; mulai: number; selesai: number }> = ({
  T,
  mulai,
  selesai,
}) => (
  <AdeganFoto
    T={T}
    mulai={mulai}
    selesai={selesai}
    file="ep01/photos/foto-01.jpg"
    zoom={[1.03, 1.13]}
    geser={[0, -18]}
    naik={[0, 10]}
  >
    <AbsoluteFill style={{ justifyContent: "flex-end", padding: `0 82px ${1920 - AMAN.bawah + 40}px` }}>
      <div style={{ ...glass(1, 0, false), padding: 54 }}>
        <div
          style={{
            fontFamily: F.sans,
            fontWeight: 800,
            fontSize: 82,
            lineHeight: 1.1,
            color: C.navy,
            letterSpacing: "-0.02em",
          }}
        >
          Udah cerai, uang anak berhenti?
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: F.sans,
            fontWeight: 800,
            fontSize: 82,
            lineHeight: 1.1,
            color: C.aksen,
            letterSpacing: "-0.02em",
          }}
        >
          <Mark T={T} at={mulai - 1}>
            Itu hak anak lo
          </Mark>
        </div>
      </div>
    </AbsoluteFill>
  </AdeganFoto>
);

/** Pelukan ibu dan anak, lalu kalimat penegas. */
export const Hook2: React.FC<{ T: number; mulai: number; selesai: number; tegasAt: number }> = ({
  T,
  mulai,
  selesai,
  tegasAt,
}) => (
  <AdeganKlip
    T={T}
    mulai={mulai}
    selesai={selesai}
    clip="ep01/clips/klip-01.mp4"
    srcStart={1.2}
    rate={0.9}
    zoom={[1.1, 1.02]}
  >
    <AbsoluteFill style={{ padding: `${AMAN.atas + 20}px 82px 0`, justifyContent: "flex-start" }}>
      <KataDemiKata
        T={T}
        at={tegasAt}
        teks="Padahal itu hak anak."
        style={{
          fontFamily: F.sans,
          fontWeight: 800,
          fontSize: 84,
          lineHeight: 1.08,
          color: C.putih,
          letterSpacing: "-0.02em",
          textShadow: "0 10px 34px rgba(30,38,56,0.55)",
        }}
      />
      <div
        style={{
          marginTop: 26,
          height: 10,
          width: ramp(T, tegasAt + 0.5, tegasAt + 1.3) * 300,
          borderRadius: 6,
          background: C.aksen,
        }}
      />
    </AbsoluteFill>
  </AdeganKlip>
);

import React from "react";
import { AbsoluteFill } from "remotion";
import { AMAN, C, F, KataDemiKata, Mark } from "../../lib";
import { AdeganKlip } from "../../scenes/Footage";
import { buatVo } from "../../vo";
import kataJson from "./words.json";

const { kapan } = buatVo(kataJson);

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
    clip="ep01/clips/klip-01.mp4"
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

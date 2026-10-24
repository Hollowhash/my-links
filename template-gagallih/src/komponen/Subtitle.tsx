import { interpolate, useCurrentFrame } from "remotion";
import type { Cue } from "../tipe";
import { duaBaris } from "../teks";
import { font, ukuran, warna } from "../tema";

type Props = {
  cue: Cue[];
};

/** Subtitle mengikuti suara VO. Dua baris, ukuran besar, mudah dibaca di HP. */
export const Subtitle: React.FC<Props> = ({ cue }) => {
  const frame = useCurrentFrame();
  const aktif = cue.find((c) => frame >= c.mulai && frame < c.selesai);
  if (!aktif) return null;

  const muncul = interpolate(frame, [aktif.mulai, aktif.mulai + 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: ukuran.subtitleY,
        width: ukuran.lebar,
        height: ukuran.subtitleTinggi,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: muncul,
      }}
    >
      <div
        style={{
          maxWidth: 880,
          padding: "26px 44px",
          borderRadius: 32,
          backgroundColor: "rgba(255,255,255,0.93)",
          boxShadow: "0 16px 34px rgba(18,42,74,0.10)",
          fontFamily: font.keluarga,
          fontWeight: font.sedang,
          fontSize: 48,
          lineHeight: 1.26,
          color: warna.navy,
          textAlign: "center",
          transform: `translateY(${interpolate(muncul, [0, 1], [10, 0])}px)`,
        }}
      >
        {duaBaris(aktif.teks).map((baris, i) => (
          <div key={i}>{baris}</div>
        ))}
      </div>
    </div>
  );
};

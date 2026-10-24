import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { font, warna } from "../tema";
import { mulus } from "../gerak";

type Props = {
  nomor: number;
  total: number;
};

/** Nomor bulat merah-oranye dengan label "catatan 1 dari N". */
export const NomorCatatan: React.FC<Props> = ({ nomor, total }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, delay: 2, config: { damping: 11, mass: 0.5 } });
  const label = mulus(frame, 6, 20, [0, 1]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
      <div
        style={{
          width: 104,
          height: 104,
          borderRadius: "50%",
          background: `linear-gradient(140deg, #FF7A3D 0%, ${warna.aksen} 72%)`,
          color: "#FFFFFF",
          fontFamily: font.keluarga,
          fontWeight: font.tebal,
          fontSize: 54,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 12px 26px rgba(239,75,35,0.3)",
          transform: `scale(${0.5 + pop * 0.5}) rotate(${(1 - pop) * -12}deg)`,
        }}
      >
        <span style={{ transform: `translateY(${(1 - pop) * 10}px)`, display: "inline-block" }}>
          {nomor}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          opacity: label,
          transform: `translateX(${(1 - label) * -18}px)`,
        }}
      >
        <div
          style={{
            fontFamily: font.keluarga,
            fontWeight: font.sedang,
            fontSize: 30,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: warna.navyLembut,
          }}
        >
          catatan {nomor} dari {total}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {Array.from({ length: total }).map((_, i) => {
            const ini = i + 1 === nomor;
            const lebar = ini ? 18 + mulus(frame, 8, 26, [0, 26]) : 18;
            return (
              <div
                key={i}
                style={{
                  width: lebar,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: ini ? warna.aksen : warna.garis,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

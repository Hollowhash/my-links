import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { font, warna } from "../tema";

type Props = {
  nomor: number;
  total: number;
};

/** Nomor bulat merah-oranye dengan label "catatan 1 dari N". */
export const NomorCatatan: React.FC<Props> = ({ nomor, total }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const masuk = spring({ frame, fps, delay: 4, config: { damping: 14, mass: 0.5 } });

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
          transform: `scale(${interpolate(masuk, [0, 1], [0.6, 1])})`,
        }}
      >
        {nomor}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i + 1 === nomor ? 44 : 18,
                height: 10,
                borderRadius: 5,
                backgroundColor: i + 1 === nomor ? warna.aksen : warna.garis,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

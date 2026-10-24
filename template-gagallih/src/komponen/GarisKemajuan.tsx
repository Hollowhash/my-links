import { useCurrentFrame, useVideoConfig } from "remotion";
import { warna } from "../tema";

/** Garis tipis di atas layar yang terisi sepanjang video berjalan. */
export const GarisKemajuan: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();
  const jalan = Math.min(1, frame / Math.max(1, durationInFrames - 1));

  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        top: 140,
        width: width - 140,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(18,42,74,0.10)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${jalan * 100}%`,
          height: "100%",
          borderRadius: 4,
          background: `linear-gradient(90deg, #FF7A3D 0%, ${warna.aksen} 100%)`,
        }}
      />
    </div>
  );
};

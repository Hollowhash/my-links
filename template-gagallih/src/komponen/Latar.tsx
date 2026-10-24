import { AbsoluteFill, useCurrentFrame } from "remotion";
import { warna } from "../tema";

/** Latar abu-biru dengan dua noda cahaya yang bergerak lambat. */
export const Latar: React.FC = () => {
  const frame = useCurrentFrame();
  const geser = (laju: number, jauh: number) => Math.sin(frame * laju) * jauh;

  return (
    <AbsoluteFill style={{ backgroundColor: warna.latar, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          left: -380 + geser(0.004, 40),
          top: -500 + geser(0.003, 60),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${warna.latarTua} 0%, rgba(211,222,236,0) 68%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          right: -360 + geser(0.0035, 50),
          bottom: -360 + geser(0.0025, 45),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${warna.latarHangat} 0%, rgba(251,228,215,0) 70%)`,
          opacity: 0.85,
        }}
      />
    </AbsoluteFill>
  );
};

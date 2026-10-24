import { AbsoluteFill, useCurrentFrame } from "remotion";
import { warna } from "../tema";
import { ayun } from "../gerak";

/**
 * Latar abu-biru: noda cahaya yang bergerak, titik-titik halus yang merayap,
 * dan beberapa bentuk ringan yang melayang pelan.
 */
export const Latar: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: warna.latar, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          left: -380 + ayun(frame, 0.004, 40),
          top: -500 + ayun(frame, 0.003, 60),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${warna.latarTua} 0%, rgba(211,222,236,0) 68%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          right: -360 + ayun(frame, 0.0035, 50),
          bottom: -360 + ayun(frame, 0.0025, 45),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${warna.latarHangat} 0%, rgba(251,228,215,0) 70%)`,
          opacity: 0.85,
        }}
      />

      {/* Titik-titik halus yang merayap ke atas */}
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(18,42,74,0.10) 2px, transparent 2px)",
          backgroundSize: "46px 46px",
          transform: `translateY(${-((frame * 0.35) % 46)}px)`,
          opacity: 0.5,
        }}
      />

      {/* Cincin dan kotak ringan yang melayang */}
      <div
        style={{
          position: "absolute",
          left: 60 + ayun(frame, 0.006, 24),
          top: 1540 + ayun(frame, 0.005, 30, 2),
          width: 190,
          height: 190,
          borderRadius: "50%",
          border: "10px solid rgba(239,75,35,0.16)",
          transform: `rotate(${frame * 0.12}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 70 + ayun(frame, 0.0045, 20, 1),
          top: 70 + ayun(frame, 0.004, 26),
          width: 130,
          height: 130,
          borderRadius: 34,
          backgroundColor: "rgba(18,42,74,0.07)",
          transform: `rotate(${18 + frame * 0.08}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 210 + ayun(frame, 0.0055, 18, 3),
          bottom: 190 + ayun(frame, 0.0042, 22, 1.5),
          width: 86,
          height: 86,
          borderRadius: "50%",
          backgroundColor: "rgba(239,75,35,0.12)",
        }}
      />
    </AbsoluteFill>
  );
};

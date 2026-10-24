import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ukuran, warna } from "../tema";

type Props = {
  /** Lama kartu ini tampil, dalam frame. Dipakai untuk animasi keluar. */
  durasi: number;
  /** "isi" membuat kartu setinggi isinya, dipakai untuk kartu tanpa media. */
  tinggi?: "penuh" | "isi";
  children: React.ReactNode;
};

/** Kartu putih di tengah layar, masuk dengan gerak halus lalu keluar lembut. */
export const KartuPutih: React.FC<Props> = ({ durasi, tinggi = "penuh", children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const masuk = spring({ frame, fps, config: { damping: 200, mass: 0.6 } });
  const keluar = interpolate(frame, [durasi - 12, durasi], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const skala = interpolate(masuk, [0, 1], [0.955, 1]) - keluar * 0.025;
  const naik = interpolate(masuk, [0, 1], [46, 0]) - keluar * 26;

  return (
    <div
      style={{
        position: "absolute",
        left: ukuran.kartuX,
        top: ukuran.kartuY,
        width: ukuran.kartuLebar,
        height: ukuran.kartuTinggi,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: tinggi === "penuh" ? "100%" : "auto",
          maxHeight: "100%",
          backgroundColor: warna.kartu,
          borderRadius: ukuran.sudutKartu,
          padding: ukuran.pad,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 40px 90px rgba(18,42,74,0.14), 0 6px 18px rgba(18,42,74,0.06)",
          opacity: masuk * (1 - keluar),
          transform: `translateY(${naik}px) scale(${skala})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

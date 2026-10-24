import { useCurrentFrame } from "remotion";
import { ukuran, warna } from "../tema";
import { TRANSISI, mulus } from "../gerak";

type Props = {
  /** Lama kartu ini tampil, dalam frame. Dipakai untuk animasi keluar. */
  durasi: number;
  /** "isi" membuat kartu setinggi isinya, dipakai untuk kartu tanpa media. */
  tinggi?: "penuh" | "isi";
  children: React.ReactNode;
};

/**
 * Kartu putih yang masuk dari bawah sambil berdiri tegak, lalu didorong
 * mundur ke belakang waktu kartu berikutnya datang.
 */
export const KartuPutih: React.FC<Props> = ({ durasi, tinggi = "penuh", children }) => {
  const frame = useCurrentFrame();

  const masuk = mulus(frame, 0, 22, [0, 1]);
  const keluar = mulus(frame, durasi - TRANSISI, durasi, [0, 1]);

  // Masuk: naik dari bawah, sedikit miring, lalu tegak.
  // Keluar: mundur ke belakang dan memudar.
  const naik = (1 - masuk) * 150 - keluar * 70;
  const jauh = (1 - masuk) * -260 - keluar * 300;
  const miring = (1 - masuk) * 9 - keluar * 5;
  // Dorongan kamera pelan supaya kartu tidak terasa diam.
  const dorong = mulus(frame, 0, durasi, [1, 1.022]);

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
        perspective: 2000,
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
          boxShadow: `0 ${40 + (1 - masuk) * 50}px ${90 + (1 - masuk) * 60}px rgba(18,42,74,${0.14 * masuk}), 0 6px 18px rgba(18,42,74,0.06)`,
          opacity: masuk * (1 - keluar),
          transform: `translateY(${naik}px) translateZ(${jauh}px) rotateX(${miring}deg) scale(${dorong})`,
          transformOrigin: "center 40%",
        }}
      >
        {children}
      </div>
    </div>
  );
};

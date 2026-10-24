import { useCurrentFrame } from "remotion";
import type { Cue } from "../tipe";
import { duaBaris } from "../teks";
import { font, ukuran, warna } from "../tema";
import { mulus } from "../gerak";

type Props = {
  cue: Cue[];
};

/**
 * Subtitle mengikuti suara VO. Katanya muncul berurutan sepanjang kalimat,
 * jadi terasa seperti ikut diucapkan.
 */
export const Subtitle: React.FC<Props> = ({ cue }) => {
  const frame = useCurrentFrame();
  const aktif = cue.find((c) => frame >= c.mulai && frame < c.selesai);
  if (!aktif) return null;

  const panjang = Math.max(1, aktif.selesai - aktif.mulai);
  const muncul = mulus(frame, aktif.mulai, aktif.mulai + 5, [0, 1]);
  const pudar = mulus(frame, aktif.selesai - 4, aktif.selesai, [0, 1]);
  const baris = duaBaris(aktif.teks);
  const jumlahKata = baris.join(" ").split(" ").length;
  let nomorKata = 0;

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
        opacity: muncul * (1 - pudar),
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
          transform: `translateY(${mulus(frame, aktif.mulai, aktif.mulai + 7, [14, 0])}px) scale(${mulus(frame, aktif.mulai, aktif.mulai + 7, [0.97, 1])})`,
        }}
      >
        {baris.map((isi, i) => (
          <div key={i}>
            {isi.split(" ").map((kata, j) => {
              // Kata dibagi rata sepanjang kalimat, mengikuti irama bicara.
              const tunda = aktif.mulai + (nomorKata / jumlahKata) * panjang * 0.7;
              nomorKata += 1;
              const kelihatan = mulus(frame, tunda, tunda + 5, [0, 1]);
              return (
                <span
                  key={j}
                  style={{
                    display: "inline-block",
                    opacity: 0.34 + kelihatan * 0.66,
                    transform: `translateY(${(1 - kelihatan) * 8}px)`,
                  }}
                >
                  {kata}
                  {j < isi.split(" ").length - 1 ? " " : null}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

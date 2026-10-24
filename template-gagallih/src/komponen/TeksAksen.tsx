import { Fragment } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { font, warna } from "../tema";
import { pecahAksen, rapikanTandaBaca } from "../teks";

type Props = {
  teks: string;
  ukuranHuruf: number;
  /** Frame saat teks ini mulai tampil */
  mulai?: number;
  tinggiBaris?: number;
};

/**
 * Teks navy dengan kata aksen merah-oranye dan efek stabilo peach.
 * Tulis kata aksen di antara *bintang*.
 */
export const TeksAksen: React.FC<Props> = ({
  teks,
  ukuranHuruf,
  mulai = 0,
  tinggiBaris = 1.16,
}) => {
  const frame = useCurrentFrame() - mulai;
  const potongan = rapikanTandaBaca(pecahAksen(teks));
  let nomorAksen = 0;

  return (
    <div
      style={{
        fontFamily: font.keluarga,
        fontWeight: font.tebal,
        fontSize: ukuranHuruf,
        lineHeight: tinggiBaris,
        color: warna.navy,
        letterSpacing: "-0.015em",
      }}
    >
      {potongan.map((bagian, i) => {
        if (!bagian.aksen) {
          return <span key={i}>{bagian.teks}</span>;
        }

        // Tiap kata dapat stabilo sendiri supaya frasa panjang tetap bisa
        // pindah baris tanpa menabrak pinggir kartu.
        const kata = bagian.teks.split(" ");

        return kata.map((satuKata, j) => {
          const tunda = 14 + nomorAksen * 5;
          nomorAksen += 1;
          const lebar = interpolate(frame, [tunda, tunda + 11], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <Fragment key={`${i}-${j}`}>
              <span
                style={{
                  position: "relative",
                  display: "inline-block",
                  color: warna.aksen,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: "-0.08em",
                    right: "-0.08em",
                    bottom: "0.06em",
                    height: "0.5em",
                    backgroundColor: warna.stabilo,
                    borderRadius: 6,
                    transform: `scaleX(${lebar}) rotate(-0.7deg)`,
                    transformOrigin: "left center",
                  }}
                />
                <span style={{ position: "relative" }}>{satuKata}</span>
                {j === kata.length - 1 && bagian.ekor ? (
                  <span style={{ position: "relative", color: warna.navy }}>
                    {bagian.ekor}
                  </span>
                ) : null}
              </span>
              {j < kata.length - 1 ? " " : null}
            </Fragment>
          );
        });
      })}
    </div>
  );
};

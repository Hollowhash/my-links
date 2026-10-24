import { Fragment } from "react";
import { useCurrentFrame } from "remotion";
import { font, warna } from "../tema";
import { pecahAksen, rapikanTandaBaca } from "../teks";
import { mulus } from "../gerak";

type Props = {
  teks: string;
  ukuranHuruf: number;
  /** Frame saat teks ini mulai muncul */
  mulai?: number;
  tinggiBaris?: number;
};

type Kata = { kata: string; aksen: boolean; ekor?: string };

/**
 * Teks navy yang muncul kata demi kata. Kata aksen berwarna merah-oranye
 * dan disapu stabilo peach. Tulis kata aksen di antara *bintang*.
 */
export const TeksAksen: React.FC<Props> = ({
  teks,
  ukuranHuruf,
  mulai = 0,
  tinggiBaris = 1.16,
}) => {
  const frame = useCurrentFrame() - mulai;

  const semuaKata: Kata[] = [];
  for (const bagian of rapikanTandaBaca(pecahAksen(teks))) {
    const pecahan = bagian.teks.split(" ").filter((k) => k.length > 0);
    pecahan.forEach((kata, i) => {
      semuaKata.push({
        kata,
        aksen: bagian.aksen,
        ekor: i === pecahan.length - 1 ? bagian.ekor : undefined,
      });
    });
  }

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
      {semuaKata.map((item, i) => {
        const tunda = i * 2.5;
        const muncul = mulus(frame, tunda, tunda + 12, [0, 1]);
        const naik = mulus(frame, tunda, tunda + 14, [0.34 * ukuranHuruf, 0]);
        const sapu = mulus(frame, tunda + 6, tunda + 18, [0, 1]);

        return (
          <Fragment key={i}>
            <span
              style={{
                position: "relative",
                display: "inline-block",
                color: item.aksen ? warna.aksen : undefined,
                opacity: muncul,
                transform: `translateY(${naik}px)`,
              }}
            >
              {item.aksen ? (
                <span
                  style={{
                    position: "absolute",
                    left: "-0.08em",
                    right: "-0.08em",
                    bottom: "0.06em",
                    height: "0.5em",
                    backgroundColor: warna.stabilo,
                    borderRadius: 6,
                    transform: `scaleX(${sapu}) rotate(-0.7deg)`,
                    transformOrigin: "left center",
                  }}
                />
              ) : null}
              <span style={{ position: "relative" }}>{item.kata}</span>
              {item.ekor ? (
                <span style={{ position: "relative", color: warna.navy }}>
                  {item.ekor}
                </span>
              ) : null}
            </span>
            {i < semuaKata.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </div>
  );
};

import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Kartu } from "../tipe";
import { KartuPutih } from "../komponen/KartuPutih";
import { MediaKartu } from "../komponen/MediaKartu";
import { TeksAksen } from "../komponen/TeksAksen";
import { ukuranHurufKartu } from "../teks";
import { font, warna } from "../tema";

type Props = {
  kartu: Kartu;
  slug: string;
  durasi: number;
};

/** Kartu penutup: kalimat pamungkas, media jadi pelengkap. */
export const Penutup: React.FC<Props> = ({ kartu, slug, durasi }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const masuk = spring({ frame, fps, delay: 4, config: { damping: 200 } });

  return (
    <KartuPutih durasi={durasi} tinggi={kartu.media ? "penuh" : "isi"}>
      <div
        style={{
          alignSelf: "flex-start",
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 44,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: `linear-gradient(140deg, #FF7A3D 0%, ${warna.aksen} 72%)`,
            boxShadow: "0 10px 22px rgba(239,75,35,0.28)",
          }}
        />
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
          {kartu.label ?? "pegang ini"}
        </div>
      </div>

      <div
        style={{
          opacity: masuk,
          transform: `translateY(${interpolate(masuk, [0, 1], [24, 0])}px)`,
          marginBottom: kartu.media ? 46 : 0,
        }}
      >
        <TeksAksen
          teks={kartu.teks}
          ukuranHuruf={ukuranHurufKartu(kartu.teks, true)}
          mulai={4}
          tinggiBaris={1.12}
        />
      </div>

      {kartu.media ? (
        <MediaKartu media={kartu.media} slug={slug} durasi={durasi} />
      ) : null}
    </KartuPutih>
  );
};

import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Kartu } from "../tipe";
import { KartuPutih } from "../komponen/KartuPutih";
import { MediaKartu } from "../komponen/MediaKartu";
import { NomorCatatan } from "../komponen/NomorCatatan";
import { TeksAksen } from "../komponen/TeksAksen";
import { ukuranHurufKartu } from "../teks";

type Props = {
  kartu: Kartu;
  nomor: number;
  total: number;
  slug: string;
  durasi: number;
};

/** Kartu catatan: nomor, media yang ikut bercerita, lalu teks utama. */
export const Catatan: React.FC<Props> = ({ kartu, nomor, total, slug, durasi }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const masuk = spring({ frame, fps, delay: 8, config: { damping: 200 } });

  return (
    <KartuPutih durasi={durasi}>
      <NomorCatatan nomor={nomor} total={total} />

      <div style={{ height: 40 }} />

      {kartu.media ? (
        <MediaKartu media={kartu.media} slug={slug} durasi={durasi} />
      ) : (
        <div style={{ flex: 1 }} />
      )}

      <div
        style={{
          marginTop: 46,
          opacity: masuk,
          transform: `translateY(${interpolate(masuk, [0, 1], [22, 0])}px)`,
        }}
      >
        <TeksAksen
          teks={kartu.teks}
          ukuranHuruf={ukuranHurufKartu(kartu.teks)}
          mulai={8}
        />
      </div>
    </KartuPutih>
  );
};

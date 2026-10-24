import { useCurrentFrame } from "remotion";
import type { Kartu } from "../tipe";
import { KartuPutih } from "../komponen/KartuPutih";
import { MediaKartu } from "../komponen/MediaKartu";
import { TeksAksen } from "../komponen/TeksAksen";
import { ukuranHurufKartu } from "../teks";
import { font, warna } from "../tema";
import { mulus } from "../gerak";

type Props = {
  kartu: Kartu;
  slug: string;
  durasi: number;
};

/** Kartu pembuka: hook dulu yang besar, media menyusul di bawahnya. */
export const Pembuka: React.FC<Props> = ({ kartu, slug, durasi }) => {
  const frame = useCurrentFrame();
  const pil = mulus(frame, 2, 16, [0, 1]);

  return (
    <KartuPutih durasi={durasi}>
      <div
        style={{
          alignSelf: "flex-start",
          padding: "16px 30px",
          borderRadius: 999,
          backgroundColor: warna.stabilo,
          color: warna.aksen,
          fontFamily: font.keluarga,
          fontWeight: font.sedang,
          fontSize: 30,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: 40,
          opacity: pil,
          transform: `translateY(${(1 - pil) * -16}px)`,
        }}
      >
        {kartu.label ?? "catatan singkat"}
      </div>

      <div style={{ marginBottom: 48 }}>
        <TeksAksen
          teks={kartu.teks}
          ukuranHuruf={ukuranHurufKartu(kartu.teks, true)}
          mulai={6}
          tinggiBaris={1.1}
        />
      </div>

      {kartu.media ? (
        <MediaKartu media={kartu.media} slug={slug} durasi={durasi} />
      ) : null}
    </KartuPutih>
  );
};

import { Img, Loop, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import type { Media } from "../tipe";
import { ukuran, warna } from "../tema";
import { ayun, mulus } from "../gerak";

type Props = {
  media: Media;
  slug: string;
  /** Lama kartu tampil, dalam frame */
  durasi: number;
};

const posisi = (fokus: Media["fokus"]) =>
  fokus === "atas" ? "50% 18%" : fokus === "bawah" ? "50% 82%" : "50% 50%";

/**
 * Foto atau klip di dalam kartu. Dibuka dengan sapuan dari bawah,
 * lalu terus bergerak pelan supaya gambarnya hidup.
 */
export const MediaKartu: React.FC<Props> = ({ media, slug, durasi }) => {
  const frame = useCurrentFrame();
  const sumber = staticFile(`aset/${slug}/${media.file}`);

  const buka = mulus(frame, 4, 26, [0, 100]);
  // Kilau tipis yang lewat sekali sesudah media terbuka
  const kilau = mulus(frame, 16, 44, [-60, 160]);

  const bingkai: React.CSSProperties = {
    position: "relative",
    flex: 1,
    minHeight: 0,
    borderRadius: 36,
    overflow: "hidden",
    backgroundColor: warna.latarTua,
    boxShadow: "inset 0 0 0 1px rgba(18,42,74,0.06)",
    clipPath: `inset(${100 - buka}% 0% 0% 0% round 36px)`,
  };

  const isiPenuh: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: posisi(media.fokus),
  };

  const lapisanKilau = (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(104deg, rgba(255,255,255,0) ${kilau - 26}%, rgba(255,255,255,0.4) ${kilau}%, rgba(255,255,255,0) ${kilau + 26}%)`,
        pointerEvents: "none",
      }}
    />
  );

  if (media.jenis === "klip") {
    const frameKlip = media.durasiKlip
      ? Math.max(
          1,
          Math.round(media.durasiKlip * ukuran.fps) -
            Math.round((media.mulaiKlip ?? 0) * ukuran.fps),
        )
      : null;

    const video = (
      <OffthreadVideo
        src={sumber}
        trimBefore={media.mulaiKlip ? Math.round(media.mulaiKlip * ukuran.fps) : undefined}
        muted
        style={isiPenuh}
      />
    );

    return (
      <div style={bingkai}>
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${mulus(frame, 0, durasi, [1.06, 1.0])})`,
          }}
        >
          {frameKlip && frameKlip < durasi ? (
            <Loop durationInFrames={frameKlip}>{video}</Loop>
          ) : (
            video
          )}
        </div>
        {lapisanKilau}
      </div>
    );
  }

  // Foto: zoom pelan ditambah geser halus supaya tidak terasa gambar diam.
  const zoom = mulus(frame, 0, durasi, [1.05, 1.15]);
  const geserX = ayun(frame, 0.012, 14);
  const geserY = ayun(frame, 0.009, 10, 1.2);

  return (
    <div style={bingkai}>
      <Img
        src={sumber}
        style={{
          ...isiPenuh,
          transform: `scale(${zoom}) translate(${geserX}px, ${geserY}px)`,
        }}
      />
      {lapisanKilau}
    </div>
  );
};

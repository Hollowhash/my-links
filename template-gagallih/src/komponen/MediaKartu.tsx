import { Img, Loop, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import type { Media } from "../tipe";
import { ukuran, warna } from "../tema";

type Props = {
  media: Media;
  slug: string;
  /** Lama kartu tampil, dalam frame */
  durasi: number;
};

const posisi = (fokus: Media["fokus"]) =>
  fokus === "atas" ? "50% 18%" : fokus === "bawah" ? "50% 82%" : "50% 50%";

/** Foto atau klip di dalam kartu. Foto dapat gerak zoom pelan. */
export const MediaKartu: React.FC<Props> = ({ media, slug, durasi }) => {
  const frame = useCurrentFrame();
  const sumber = staticFile(`aset/${slug}/${media.file}`);

  const bingkai: React.CSSProperties = {
    position: "relative",
    flex: 1,
    minHeight: 0,
    borderRadius: 36,
    overflow: "hidden",
    backgroundColor: warna.latarTua,
    boxShadow: "inset 0 0 0 1px rgba(18,42,74,0.06)",
  };

  const isiPenuh: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: posisi(media.fokus),
  };

  if (media.jenis === "klip") {
    const frameKlip = media.durasiKlip
      ? Math.max(1, Math.round(media.durasiKlip * ukuran.fps) -
          Math.round((media.mulaiKlip ?? 0) * ukuran.fps))
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
        {frameKlip && frameKlip < durasi ? (
          <Loop durationInFrames={frameKlip}>{video}</Loop>
        ) : (
          video
        )}
      </div>
    );
  }

  const zoom = interpolate(frame, [0, durasi], [1.04, 1.13], {
    extrapolateRight: "clamp",
  });

  return (
    <div style={bingkai}>
      <Img
        src={sumber}
        style={{ ...isiPenuh, transform: `scale(${zoom})` }}
      />
    </div>
  );
};

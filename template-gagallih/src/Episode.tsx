import "./font";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import type { Episode } from "./tipe";
import { Latar } from "./komponen/Latar";
import { Subtitle } from "./komponen/Subtitle";
import { Pembuka } from "./adegan/Pembuka";
import { Catatan } from "./adegan/Catatan";
import { Penutup } from "./adegan/Penutup";
import { hitungJadwal } from "./jadwal";
import { buatSubtitle } from "./teks";

export type PropsEpisode = {
  episode: Episode;
};

export const VideoEpisode: React.FC<PropsEpisode> = ({ episode }) => {
  const jadwal = hitungJadwal(episode);
  const cue = buatSubtitle(episode);
  const total = episode.catatan.length;
  const volumeMusik = episode.volumeMusik ?? 0.08;

  return (
    <AbsoluteFill>
      <Latar />

      <Sequence
        from={jadwal.pembuka.dari}
        durationInFrames={jadwal.pembuka.sampai - jadwal.pembuka.dari}
        name="pembuka"
      >
        <Pembuka
          kartu={episode.pembuka}
          slug={episode.slug}
          durasi={jadwal.pembuka.sampai - jadwal.pembuka.dari}
        />
      </Sequence>

      {episode.catatan.map((kartu, i) => {
        const bagian = jadwal.catatan[i];
        return (
          <Sequence
            key={i}
            from={bagian.dari}
            durationInFrames={bagian.sampai - bagian.dari}
            name={`catatan ${i + 1}`}
          >
            <Catatan
              kartu={kartu}
              nomor={i + 1}
              total={total}
              slug={episode.slug}
              durasi={bagian.sampai - bagian.dari}
            />
          </Sequence>
        );
      })}

      <Sequence
        from={jadwal.penutup.dari}
        durationInFrames={jadwal.penutup.sampai - jadwal.penutup.dari}
        name="penutup"
      >
        <Penutup
          kartu={episode.penutup}
          slug={episode.slug}
          durasi={jadwal.penutup.sampai - jadwal.penutup.dari}
        />
      </Sequence>

      <Subtitle cue={cue} />

      {episode.vo ? <Audio src={staticFile(`aset/${episode.slug}/${episode.vo}`)} /> : null}

      {episode.musik ? (
        <Audio
          src={staticFile(`aset/${episode.slug}/${episode.musik}`)}
          volume={(f) =>
            interpolate(
              f,
              [0, 30, jadwal.totalFrame - 45, jadwal.totalFrame],
              [0, volumeMusik, volumeMusik, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          }
        />
      ) : null}
    </AbsoluteFill>
  );
};

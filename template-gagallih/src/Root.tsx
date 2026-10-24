import { Composition } from "remotion";
import { VideoEpisode } from "./Episode";
import { episodeAktif } from "./episode-aktif";
import { hitungJadwal } from "./jadwal";
import { ukuran } from "./tema";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Episode"
      component={VideoEpisode}
      width={ukuran.lebar}
      height={ukuran.tinggi}
      fps={ukuran.fps}
      durationInFrames={hitungJadwal(episodeAktif).totalFrame}
      defaultProps={{ episode: episodeAktif }}
      calculateMetadata={({ props }) => ({
        durationInFrames: hitungJadwal(props.episode).totalFrame,
      })}
    />
  );
};

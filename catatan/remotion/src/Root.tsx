import React from "react";
import { Composition } from "remotion";
import { Ep01 } from "./episodes/ep01/Main";
import timelineEp01 from "./episodes/ep01/timeline.json";
import { Ep02 } from "./episodes/ep02/Main";
import timelineEp02 from "./episodes/ep02/timeline.json";
import { Ep03 } from "./episodes/ep03/Main";
import timelineEp03 from "./episodes/ep03/timeline.json";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="ep01"
      component={Ep01}
      width={timelineEp01.lebar}
      height={timelineEp01.tinggi}
      fps={timelineEp01.fps}
      durationInFrames={Math.round(timelineEp01.total * timelineEp01.fps)}
    />
    <Composition
      id="ep02"
      component={Ep02}
      width={timelineEp02.lebar}
      height={timelineEp02.tinggi}
      fps={timelineEp02.fps}
      durationInFrames={Math.round(timelineEp02.total * timelineEp02.fps)}
    />
    <Composition
      id="ep03"
      component={Ep03}
      width={timelineEp03.lebar}
      height={timelineEp03.tinggi}
      fps={timelineEp03.fps}
      durationInFrames={Math.round(timelineEp03.total * timelineEp03.fps)}
    />
  </>
);

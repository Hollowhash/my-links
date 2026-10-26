import React from "react";
import { Composition } from "remotion";
import { Ep01 } from "./episodes/ep01/Main";
import timelineEp01 from "./episodes/ep01/timeline.json";
import { Ep02 } from "./episodes/ep02/Main";
import timelineEp02 from "./episodes/ep02/timeline.json";
import { Ep03 } from "./episodes/ep03/Main";
import timelineEp03 from "./episodes/ep03/timeline.json";
import { Ep04 } from "./episodes/ep04/Main";
import timelineEp04 from "./episodes/ep04/timeline.json";
import { Ep05 } from "./episodes/ep05/Main";
import timelineEp05 from "./episodes/ep05/timeline.json";

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
    <Composition
      id="ep04"
      component={Ep04}
      width={timelineEp04.lebar}
      height={timelineEp04.tinggi}
      fps={timelineEp04.fps}
      durationInFrames={Math.round(timelineEp04.total * timelineEp04.fps)}
    />
    <Composition
      id="ep05"
      component={Ep05}
      width={timelineEp05.lebar}
      height={timelineEp05.tinggi}
      fps={timelineEp05.fps}
      durationInFrames={Math.round(timelineEp05.total * timelineEp05.fps)}
    />
  </>
);

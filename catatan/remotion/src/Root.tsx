import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import timeline from "./timeline.json";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Main"
    component={Main}
    width={timeline.lebar}
    height={timeline.tinggi}
    fps={timeline.fps}
    durationInFrames={Math.round(timeline.total * timeline.fps)}
  />
);

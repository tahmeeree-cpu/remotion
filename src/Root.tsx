import React from "react";
import { Composition } from "remotion";
import { CoffeeAd } from "./CoffeeAd";
import { VAGuideAd } from "./VAGuideAd";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CoffeeAd"
        component={CoffeeAd}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1080}
      />
      <Composition
        id="VAGuideAd"
        component={VAGuideAd}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

import React from "react";
import { Composition } from "remotion";
import { CoffeeAd } from "./CoffeeAd";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CoffeeAd"
      component={CoffeeAd}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1080}
    />
  );
};

import { Composition } from "remotion";
import { StatementHook } from "./StatementHook";
import { ProductShowcase } from "./ProductShowcase";

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="StatementHook"
        component={StatementHook}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1080}
      />
      <Composition
        id="ProductShowcase"
        component={ProductShowcase}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
}

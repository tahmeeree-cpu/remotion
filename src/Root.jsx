import { Composition } from "remotion";
import { StatementHook } from "./StatementHook";

export function RemotionRoot() {
  return (
    <Composition
      id="StatementHook"
      component={StatementHook}
      durationInFrames={210}
      fps={30}
      width={1080}
      height={1080}
    />
  );
}

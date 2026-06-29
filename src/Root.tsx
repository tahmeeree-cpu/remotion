import {Composition} from 'remotion';
import {ShowcaseVideo} from './ShowcaseVideo';

export const FPS = 30;
export const DURATION_IN_SECONDS = 30;

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="ShowcaseVideo"
			component={ShowcaseVideo}
			durationInFrames={DURATION_IN_SECONDS * FPS}
			fps={FPS}
			width={1080}
			height={1920}
		/>
	);
};

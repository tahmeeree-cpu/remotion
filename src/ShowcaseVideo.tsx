import {AbsoluteFill, Sequence} from 'remotion';
import {Hook} from './scenes/Hook';
import {FeatureHighlight} from './scenes/FeatureHighlight';
import {CallToAction} from './scenes/CallToAction';

const ACCENT = '#3B82F6';
const BG = '#0A0A0F';

const FEATURES = [
	{
		title: '100+ Ready Prompts',
		subtitle: 'Captions, replies & content ideas — copy, paste, post.',
		icon: '✍️',
	},
	{
		title: 'Built For VAs',
		subtitle: 'Step-by-step workflows made for virtual assistants.',
		icon: '⚡',
	},
	{
		title: 'Save Hours Every Week',
		subtitle: 'Stop staring at a blank screen. Just plug & post.',
		icon: '⏱️',
	},
];

export const ShowcaseVideo: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: BG}}>
			<Sequence from={0} durationInFrames={90}>
				<Hook accent={ACCENT} />
			</Sequence>

			<Sequence from={90} durationInFrames={210}>
				<FeatureHighlight
					accent={ACCENT}
					index={1}
					title={FEATURES[0].title}
					subtitle={FEATURES[0].subtitle}
					icon={FEATURES[0].icon}
				/>
			</Sequence>

			<Sequence from={300} durationInFrames={210}>
				<FeatureHighlight
					accent={ACCENT}
					index={2}
					title={FEATURES[1].title}
					subtitle={FEATURES[1].subtitle}
					icon={FEATURES[1].icon}
				/>
			</Sequence>

			<Sequence from={510} durationInFrames={210}>
				<FeatureHighlight
					accent={ACCENT}
					index={3}
					title={FEATURES[2].title}
					subtitle={FEATURES[2].subtitle}
					icon={FEATURES[2].icon}
				/>
			</Sequence>

			<Sequence from={720} durationInFrames={180}>
				<CallToAction accent={ACCENT} url="socialmediava.guide" />
			</Sequence>
		</AbsoluteFill>
	);
};

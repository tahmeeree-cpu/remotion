import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const FeatureHighlight: React.FC<{
	accent: string;
	index: number;
	title: string;
	subtitle: string;
	icon: string;
}> = ({accent, index, title, subtitle, icon}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const enter = spring({frame, fps, config: {damping: 16, stiffness: 140}});
	const translateY = interpolate(enter, [0, 1], [80, 0]);
	const opacity = interpolate(frame, [0, 15], [0, 1], {extrapolateRight: 'clamp'});

	const badgeScale = spring({
		frame: frame - 5,
		fps,
		config: {damping: 10, stiffness: 200},
	});

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80}}>
			<div
				style={{
					opacity,
					transform: `translateY(${translateY}px)`,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					textAlign: 'center',
					maxWidth: 880,
				}}
			>
				<div
					style={{
						transform: `scale(${badgeScale})`,
						backgroundColor: accent,
						color: 'white',
						fontFamily: 'Arial, sans-serif',
						fontWeight: 900,
						fontSize: 32,
						width: 72,
						height: 72,
						borderRadius: '50%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						marginBottom: 32,
					}}
				>
					{index}
				</div>

				<div style={{fontSize: 100, marginBottom: 24}}>{icon}</div>

				<div
					style={{
						color: 'white',
						fontFamily: 'Arial, sans-serif',
						fontSize: 72,
						fontWeight: 900,
						marginBottom: 24,
						lineHeight: 1.1,
					}}
				>
					{title}
				</div>

				<div
					style={{
						color: '#C7CBD1',
						fontFamily: 'Arial, sans-serif',
						fontSize: 36,
						fontWeight: 400,
						lineHeight: 1.4,
					}}
				>
					{subtitle}
				</div>

				<div
					style={{
						marginTop: 40,
						width: 120,
						height: 6,
						backgroundColor: accent,
						borderRadius: 3,
					}}
				/>
			</div>
		</AbsoluteFill>
	);
};

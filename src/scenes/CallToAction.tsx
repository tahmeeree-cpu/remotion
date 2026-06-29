import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const CallToAction: React.FC<{accent: string; url: string}> = ({accent, url}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const enter = spring({frame, fps, config: {damping: 14, stiffness: 160}});
	const opacity = interpolate(frame, [0, 15], [0, 1], {extrapolateRight: 'clamp'});

	const pulse = 1 + 0.04 * Math.sin(frame / 8);

	const buttonDelay = spring({
		frame: frame - 20,
		fps,
		config: {damping: 12, stiffness: 180},
	});

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				padding: 80,
			}}
		>
			<div
				style={{
					opacity,
					transform: `scale(${enter})`,
					textAlign: 'center',
				}}
			>
				<div
					style={{
						color: 'white',
						fontFamily: 'Arial, sans-serif',
						fontSize: 76,
						fontWeight: 900,
						lineHeight: 1.1,
						marginBottom: 16,
					}}
				>
					Get The
					<br />
					Full Guide
				</div>
				<div
					style={{
						color: accent,
						fontFamily: 'Arial, sans-serif',
						fontSize: 40,
						fontWeight: 700,
						marginBottom: 56,
					}}
				>
					Link in Bio
				</div>

				<div
					style={{
						transform: `scale(${buttonDelay * pulse})`,
						backgroundColor: accent,
						color: 'white',
						fontFamily: 'Arial, sans-serif',
						fontSize: 38,
						fontWeight: 800,
						padding: '24px 48px',
						borderRadius: 16,
						display: 'inline-block',
					}}
				>
					{url}
				</div>
			</div>
		</AbsoluteFill>
	);
};

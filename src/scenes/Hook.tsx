import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const Hook: React.FC<{accent: string}> = ({accent}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = spring({frame, fps, config: {damping: 12, stiffness: 180}});
	const flash = interpolate(frame, [0, 8, 16], [1, 1.15, 1], {
		extrapolateRight: 'clamp',
	});
	const glow = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				padding: 80,
			}}
		>
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at 50% 50%, ${accent}33 0%, transparent 70%)`,
					opacity: glow,
				}}
			/>
			<div
				style={{
					transform: `scale(${scale * flash})`,
					textAlign: 'center',
				}}
			>
				<div
					style={{
						color: accent,
						fontFamily: 'Arial, sans-serif',
						fontSize: 56,
						fontWeight: 900,
						letterSpacing: 4,
						textTransform: 'uppercase',
						marginBottom: 24,
					}}
				>
					Stop Guessing
				</div>
				<div
					style={{
						color: 'white',
						fontFamily: 'Arial, sans-serif',
						fontSize: 88,
						fontWeight: 900,
						lineHeight: 1.05,
					}}
				>
					What To Post
					<br />
					Today
				</div>
			</div>
		</AbsoluteFill>
	);
};

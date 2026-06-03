import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const titleScale = spring({ frame, fps, from: 0.6, to: 1, config: { damping: 12, stiffness: 80 } });

  const subtitleY = interpolate(frame, [15, 40], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtitleOpacity = interpolate(frame, [15, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const orb1X = interpolate(frame, [0, durationInFrames], [0, 40], {});
  const orb1Y = interpolate(frame, [0, durationInFrames], [0, -25], {});
  const orb2X = interpolate(frame, [0, durationInFrames], [0, -30], {});
  const orb2Y = interpolate(frame, [0, durationInFrames], [0, 20], {});

  const shimmer = interpolate(frame, [30, 50, 70], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 40%, #0a0a1a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        fontFamily: "'Helvetica Neue', sans-serif",
      }}
    >
      {/* Ambient orbs */}
      <div style={{
        position: "absolute",
        width: 600,
        height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
        top: "10%",
        left: "5%",
        transform: `translate(${orb1X}px, ${orb1Y}px)`,
        filter: "blur(40px)",
      }} />
      <div style={{
        position: "absolute",
        width: 500,
        height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)",
        bottom: "5%",
        right: "8%",
        transform: `translate(${orb2X}px, ${orb2Y}px)`,
        filter: "blur(50px)",
      }} />
      <div style={{
        position: "absolute",
        width: 350,
        height: 350,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)",
        top: "40%",
        right: "20%",
        filter: "blur(35px)",
      }} />

      {/* Grid lines */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.04,
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Glow ring */}
      <div style={{
        position: "absolute",
        width: 520,
        height: 520,
        borderRadius: "50%",
        border: "1px solid rgba(139,92,246,0.15)",
        boxShadow: "0 0 80px rgba(139,92,246,0.08), inset 0 0 80px rgba(139,92,246,0.05)",
        opacity: fadeIn,
      }} />
      <div style={{
        position: "absolute",
        width: 400,
        height: 400,
        borderRadius: "50%",
        border: "1px solid rgba(99,102,241,0.1)",
        opacity: fadeIn,
      }} />

      {/* Main content */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 28,
        opacity: fadeIn,
        zIndex: 10,
      }}>
        {/* Tag line */}
        <div style={{
          fontSize: 13,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(167,139,250,0.8)",
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
        }}>
          You can now use
        </div>

        {/* Title */}
        <div style={{
          fontSize: 96,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          transform: `scale(${titleScale})`,
          background: "linear-gradient(135deg, #e0e7ff 0%, #a78bfa 40%, #818cf8 70%, #c4b5fd 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1,
          textShadow: "none",
          filter: `drop-shadow(0 0 ${40 + shimmer * 20}px rgba(139,92,246,${0.3 + shimmer * 0.2}))`,
        }}>
          Remotion
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 18,
          fontWeight: 300,
          letterSpacing: "0.15em",
          color: "rgba(196,181,253,0.6)",
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
        }}>
          whenever you want
        </div>

        {/* Divider */}
        <div style={{
          width: interpolate(frame, [40, 60], [0, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)",
          opacity: subtitleOpacity,
        }} />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => {
        const t = (frame / durationInFrames + i / 6) % 1;
        const px = 150 + i * 165;
        const py = interpolate(t, [0, 1], [720, -20], {});
        const po = interpolate(t, [0, 0.1, 0.85, 1], [0, 0.6, 0.6, 0]);
        return (
          <div key={i} style={{
            position: "absolute",
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: i % 2 === 0 ? "rgba(167,139,250,0.8)" : "rgba(99,102,241,0.8)",
            left: px,
            top: py,
            opacity: po,
            boxShadow: `0 0 6px ${i % 2 === 0 ? "rgba(167,139,250,0.8)" : "rgba(99,102,241,0.8)"}`,
          }} />
        );
      })}
    </div>
  );
};

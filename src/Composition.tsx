import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const Aurora = ({ frame }: { frame: number }) => {
  const s = (offset: number) =>
    interpolate(Math.sin((frame + offset) / 40), [-1, 1], [0.85, 1.15], {});
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.55 }}
      viewBox="0 0 1280 720"
      preserveAspectRatio="none"
    >
      <defs>
        <radialGradient id="a1" cx="30%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="a2" cx="70%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="a3" cx="50%" cy="20%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur stdDeviation="30" />
        </filter>
      </defs>
      <g filter="url(#blur)">
        <ellipse cx="384" cy="288" rx={340 * s(0)} ry={220 * s(10)} fill="url(#a1)" />
        <ellipse cx="896" cy="396" rx={310 * s(20)} ry={200 * s(5)} fill="url(#a2)" />
        <ellipse cx="640" cy="144" rx={290 * s(15)} ry={180 * s(25)} fill="url(#a3)" />
      </g>
    </svg>
  );
};

const Scanlines = () => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)",
    zIndex: 20,
  }} />
);

const words = ["you", "can", "now", "use"];

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const globalFade = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  const wordAnimations = words.map((_, i) => ({
    opacity: interpolate(frame, [10 + i * 7, 20 + i * 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    y: interpolate(frame, [10 + i * 7, 22 + i * 7], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  }));

  const titleScale = spring({ frame: Math.max(0, frame - 38), fps, from: 0.75, to: 1, config: { damping: 14, stiffness: 90 } });
  const titleOpacity = interpolate(frame, [38, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const taglineOpacity = interpolate(frame, [55, 68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const taglineX = interpolate(frame, [55, 68], [-20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cursorOpacity = frame > 68
    ? interpolate(Math.sin(frame / 8), [-1, 1], [0, 1], {})
    : 0;

  const glowPulse = interpolate(Math.sin(frame / 18), [-1, 1], [0.6, 1], {});

  const lineW = interpolate(frame, [52, 72], [0, 480], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const dots = Array.from({ length: 8 }, (_, i) => {
    const speed = 0.6 + i * 0.1;
    const t = ((frame * speed + i * 110) % (durationInFrames * speed)) / (durationInFrames * speed);
    return {
      x: 80 + i * 160,
      y: interpolate(t, [0, 1], [740, -20], {}),
      opacity: interpolate(t, [0, 0.08, 0.88, 1], [0, 0.7, 0.7, 0]),
      size: 2 + (i % 3),
      color: ["#67e8f9", "#a78bfa", "#6ee7b7"][i % 3],
    };
  });

  return (
    <div style={{
      width: "100%", height: "100%", overflow: "hidden", position: "relative",
      background: "#020817",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}>
      <Aurora frame={frame} />

      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: 0.035,
        zIndex: 1,
      }} />

      <Scanlines />

      {[
        { top: 32, left: 32 },
        { top: 32, right: 32 },
        { bottom: 32, left: 32 },
        { bottom: 32, right: 32 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: "absolute", ...pos,
          width: 24, height: 24,
          borderTop: i < 2 ? "1px solid rgba(99,102,241,0.4)" : "none",
          borderBottom: i >= 2 ? "1px solid rgba(99,102,241,0.4)" : "none",
          borderLeft: i % 2 === 0 ? "1px solid rgba(99,102,241,0.4)" : "none",
          borderRight: i % 2 === 1 ? "1px solid rgba(99,102,241,0.4)" : "none",
          opacity: globalFade,
          zIndex: 10,
        }} />
      ))}

      {dots.map((d, i) => (
        <div key={i} style={{
          position: "absolute", left: d.x, top: d.y,
          width: d.size, height: d.size, borderRadius: "50%",
          background: d.color, opacity: d.opacity,
          boxShadow: `0 0 ${d.size * 3}px ${d.color}`,
          zIndex: 5,
        }} />
      ))}

      <div style={{
        position: "absolute", inset: 0, zIndex: 15,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 0,
      }}>
        <div style={{
          display: "flex", gap: 12, marginBottom: 16,
          opacity: globalFade,
        }}>
          {words.map((word, i) => (
            <span key={word} style={{
              fontSize: 15,
              fontWeight: 400,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(148,163,184,0.9)",
              opacity: wordAnimations[i].opacity,
              transform: `translateY(${wordAnimations[i].y}px)`,
              display: "inline-block",
            }}>
              {word}
            </span>
          ))}
        </div>

        <div style={{
          fontSize: 110,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
          background: "linear-gradient(120deg, #e2e8f0 10%, #7dd3fc 40%, #a78bfa 65%, #e2e8f0 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: `drop-shadow(0 0 ${30 * glowPulse}px rgba(125,211,252,0.4)) drop-shadow(0 0 ${60 * glowPulse}px rgba(167,139,250,0.2))`,
        }}>
          Remotion
        </div>

        <div style={{
          width: lineW, height: 1, marginTop: 20,
          background: "linear-gradient(90deg, transparent, rgba(125,211,252,0.5), rgba(167,139,250,0.5), transparent)",
        }} />

        <div style={{
          marginTop: 18, display: "flex", alignItems: "center", gap: 8,
          opacity: taglineOpacity,
          transform: `translateX(${taglineX}px)`,
        }}>
          <span style={{
            fontSize: 16, fontWeight: 300,
            letterSpacing: "0.2em",
            color: "rgba(148,163,184,0.7)",
          }}>
            whenever you want
          </span>
          <span style={{
            display: "inline-block", width: 2, height: 18,
            background: "rgba(125,211,252,0.8)",
            opacity: cursorOpacity,
            borderRadius: 1,
          }} />
        </div>
      </div>
    </div>
  );
};

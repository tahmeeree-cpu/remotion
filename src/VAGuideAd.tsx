import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";

// ── Palette ───────────────────────────────────────────────────────────────────
const BG = "#080c14";
const BLUE = "#3B82F6";
const BLUE_LIGHT = "#93C5FD";
const BLUE_GLOW = "#1D4ED8";
const WHITE = "#F8FAFC";
const MUTED = "#94A3B8";

// ── Spring slide-in ───────────────────────────────────────────────────────────
function useSpringIn(frame: number, fps: number, delay = 0, dy = 50) {
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 80, mass: 1 },
    durationInFrames: 35,
  });
  return {
    opacity: p,
    transform: `translateY(${interpolate(p, [0, 1], [dy, 0])}px)`,
  };
}

// ── Fade out helper ───────────────────────────────────────────────────────────
function useFadeOut(frame: number, total: number, duration = 15) {
  return interpolate(frame, [total - duration, total], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ── Animated grid lines ───────────────────────────────────────────────────────
function GridLines() {
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.07 }}
      preserveAspectRatio="none"
    >
      {/* verticals */}
      {[20, 40, 60, 80].map((x) => (
        <line key={x} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke={BLUE} strokeWidth="1" />
      ))}
      {/* horizontals */}
      {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((y) => (
        <line key={y} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke={BLUE} strokeWidth="1" />
      ))}
    </svg>
  );
}

// ── Floating dots ─────────────────────────────────────────────────────────────
function Dots({ frame }: { frame: number }) {
  const dots = Array.from({ length: 22 }, (_, i) => {
    const seed = i * 97.3;
    const x = (seed * 3.1) % 100;
    const y = (seed * 7.7) % 100;
    const speed = 0.2 + (i % 6) * 0.08;
    const size = 1.5 + (i % 3);
    const oy = (frame * speed) % 110;
    return { x, y: (y - oy + 110) % 110, size, opacity: 0.1 + (i % 5) * 0.07 };
  });
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      {dots.map((d, i) => (
        <circle key={i} cx={`${d.x}%`} cy={`${d.y}%`} r={d.size} fill={BLUE} opacity={d.opacity} />
      ))}
    </svg>
  );
}

// ── Blue accent bar ───────────────────────────────────────────────────────────
function AccentBar({ frame, fps, delay }: { frame: number; fps: number; delay: number }) {
  const p = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 80 }, durationInFrames: 25 });
  return (
    <div
      style={{
        height: 3,
        width: `${interpolate(p, [0, 1], [0, 280])}px`,
        background: `linear-gradient(90deg, ${BLUE_GLOW}, ${BLUE}, ${BLUE_LIGHT})`,
        borderRadius: 2,
        boxShadow: `0 0 16px ${BLUE}cc`,
        margin: "0 auto 20px",
      }}
    />
  );
}

// ── Glowing badge ─────────────────────────────────────────────────────────────
function Badge({ text, frame, fps, delay }: { text: string; frame: number; fps: number; delay: number }) {
  const s = useSpringIn(frame, fps, delay, -20);
  return (
    <div
      style={{
        ...s,
        display: "inline-block",
        padding: "6px 20px",
        border: `1px solid ${BLUE}`,
        borderRadius: 999,
        color: BLUE_LIGHT,
        fontSize: 22,
        letterSpacing: 5,
        fontFamily: "monospace",
        background: `rgba(59,130,246,0.08)`,
        boxShadow: `0 0 20px ${BLUE}44`,
        textTransform: "uppercase",
      }}
    >
      {text}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCENE 1 — HOOK (frames 0–90, 0–3s)
// ══════════════════════════════════════════════════════════════════════════════
function SceneHook() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOpacity = useFadeOut(frame, 90, 12);

  // "attention flash" — quick white pulse at frame 0
  const flash = interpolate(frame, [0, 6, 14], [1, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const line1 = useSpringIn(frame, fps, 5, 60);
  const line2 = useSpringIn(frame, fps, 22, 60);
  const line3 = useSpringIn(frame, fps, 38, 40);
  const badge = useSpringIn(frame, fps, 55, -30);

  return (
    <AbsoluteFill
      style={{
        opacity: exitOpacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 64px",
        gap: 0,
      }}
    >
      {/* flash overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: WHITE,
          opacity: flash,
          pointerEvents: "none",
        }}
      />

      <AccentBar frame={frame} fps={fps} delay={4} />

      <div style={{ ...line1, fontFamily: "Georgia, serif", fontSize: 52, fontWeight: 700, color: WHITE, textAlign: "center", lineHeight: 1.15, marginBottom: 8 }}>
        Struggling to
      </div>
      <div style={{ ...line2, fontFamily: "Georgia, serif", fontSize: 52, fontWeight: 700, color: BLUE, textAlign: "center", lineHeight: 1.15, marginBottom: 28, textShadow: `0 0 30px ${BLUE}88` }}>
        write VA prompts?
      </div>
      <div style={{ ...line3, fontFamily: "sans-serif", fontSize: 26, color: MUTED, textAlign: "center", lineHeight: 1.5, marginBottom: 36 }}>
        We solved that for you.
      </div>

      <div style={badge}>
        <Badge text="Social Media VA Guide" frame={frame} fps={fps} delay={55} />
      </div>
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCENE 2 — FEATURES (frames 90–630, 3–21s)
// ══════════════════════════════════════════════════════════════════════════════

const FEATURES = [
  {
    icon: "⚡",
    number: "01",
    title: "100+ Ready-to-Use\nPrompts",
    desc: "Copy, paste, and delegate — instantly. No more blank-page paralysis for your VA.",
    startFrame: 0,
  },
  {
    icon: "🎯",
    number: "02",
    title: "Platform-Specific\nTemplates",
    desc: "Tailored for Instagram, TikTok, LinkedIn & more. Every platform, covered.",
    startFrame: 180,
  },
  {
    icon: "🚀",
    number: "03",
    title: "10× Your Content\nOutput",
    desc: "Batch-schedule weeks of content in a single afternoon with your VA.",
    startFrame: 360,
  },
];

function FeatureCard({
  icon,
  number,
  title,
  desc,
  frame,
  fps,
}: {
  icon: string;
  number: string;
  title: string;
  desc: string;
  frame: number;
  fps: number;
}) {
  const iconStyle = useSpringIn(frame, fps, 5, 80);
  const numStyle = useSpringIn(frame, fps, 18, 50);
  const titleStyle = useSpringIn(frame, fps, 32, 50);
  const descStyle = useSpringIn(frame, fps, 48, 40);
  const lineStyle = {
    opacity: spring({ frame: frame - 28, fps, config: { damping: 18, stiffness: 80 }, durationInFrames: 25 }),
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
        padding: "0 56px",
        textAlign: "center",
      }}
    >
      {/* number badge */}
      <div style={{ ...numStyle, color: BLUE, fontFamily: "monospace", fontSize: 18, letterSpacing: 6, marginBottom: 20 }}>
        — {number} —
      </div>

      {/* icon */}
      <div style={{ ...iconStyle, fontSize: 80, marginBottom: 24, filter: `drop-shadow(0 0 20px ${BLUE}88)` }}>
        {icon}
      </div>

      {/* divider */}
      <div
        style={{
          ...lineStyle,
          height: 2,
          width: 80,
          background: `linear-gradient(90deg, transparent, ${BLUE}, transparent)`,
          borderRadius: 2,
          marginBottom: 28,
          boxShadow: `0 0 12px ${BLUE}`,
        }}
      />

      {/* title */}
      <div
        style={{
          ...titleStyle,
          fontFamily: "Georgia, serif",
          fontSize: 46,
          fontWeight: 700,
          color: WHITE,
          lineHeight: 1.2,
          marginBottom: 24,
          whiteSpace: "pre-line",
        }}
      >
        {title}
      </div>

      {/* desc */}
      <div
        style={{
          ...descStyle,
          fontFamily: "sans-serif",
          fontSize: 26,
          color: MUTED,
          lineHeight: 1.6,
          maxWidth: 560,
        }}
      >
        {desc}
      </div>
    </div>
  );
}

function SceneFeatures() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Which feature is active
  const activeIndex = Math.min(
    FEATURES.length - 1,
    Math.floor(frame / 180)
  );
  const localFrame = frame - FEATURES[activeIndex].startFrame;
  const feature = FEATURES[activeIndex];

  // progress dots
  const exitOpacity = useFadeOut(frame, 540, 15);

  return (
    <AbsoluteFill style={{ opacity: exitOpacity, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <FeatureCard
        key={activeIndex}
        frame={localFrame}
        fps={fps}
        icon={feature.icon}
        number={feature.number}
        title={feature.title}
        desc={feature.desc}
      />

      {/* progress dots */}
      <div style={{ position: "absolute", bottom: 80, display: "flex", gap: 12 }}>
        {FEATURES.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === activeIndex ? 32 : 10,
              height: 10,
              borderRadius: 5,
              background: i === activeIndex ? BLUE : `${BLUE}44`,
              transition: "all 0.3s",
              boxShadow: i === activeIndex ? `0 0 10px ${BLUE}` : "none",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCENE 3 — CTA (frames 630–900, 21–30s)
// ══════════════════════════════════════════════════════════════════════════════
function SceneCTA() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glow = interpolate(Math.sin((frame / 25) * Math.PI), [-1, 1], [0.5, 1]);

  const tag = useSpringIn(frame, fps, 0, -30);
  const h1 = useSpringIn(frame, fps, 15, 60);
  const h2 = useSpringIn(frame, fps, 28, 60);
  const sub = useSpringIn(frame, fps, 42, 40);
  const btn = useSpringIn(frame, fps, 58, 50);
  const url = useSpringIn(frame, fps, 75, 30);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 64px",
        gap: 0,
      }}
    >
      {/* tag */}
      <div style={{ ...tag, color: BLUE_LIGHT, fontFamily: "monospace", fontSize: 20, letterSpacing: 6, marginBottom: 24, opacity: tag.opacity * 0.8 }}>
        LIMITED TIME OFFER
      </div>

      <AccentBar frame={frame} fps={fps} delay={8} />

      <div style={{ ...h1, fontFamily: "Georgia, serif", fontSize: 62, fontWeight: 700, color: WHITE, textAlign: "center", lineHeight: 1.1, marginBottom: 8 }}>
        Get the Guide.
      </div>
      <div
        style={{
          ...h2,
          fontFamily: "Georgia, serif",
          fontSize: 62,
          fontWeight: 700,
          color: BLUE,
          textAlign: "center",
          lineHeight: 1.1,
          marginBottom: 32,
          textShadow: `0 0 40px ${BLUE}88`,
        }}
      >
        Reclaim Your Time.
      </div>

      <div style={{ ...sub, fontFamily: "sans-serif", fontSize: 26, color: MUTED, textAlign: "center", lineHeight: 1.6, marginBottom: 48, maxWidth: 560 }}>
        100+ expert prompts that make your VA an extension of your brand — not a liability.
      </div>

      {/* CTA button */}
      <div
        style={{
          ...btn,
          padding: "22px 64px",
          background: `rgba(59,130,246,${0.15 * glow})`,
          border: `2px solid ${BLUE}`,
          borderRadius: 8,
          color: WHITE,
          fontFamily: "sans-serif",
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: 4,
          textAlign: "center",
          boxShadow: `0 0 ${32 * glow}px ${BLUE}88, inset 0 0 ${20 * glow}px ${BLUE}22`,
          marginBottom: 28,
          textTransform: "uppercase",
        }}
      >
        Download Free →
      </div>

      {/* URL */}
      <div
        style={{
          ...url,
          fontFamily: "monospace",
          fontSize: 22,
          color: BLUE_LIGHT,
          letterSpacing: 2,
          opacity: url.opacity * 0.85,
        }}
      >
        yoursite.com/va-guide
      </div>
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// BACKGROUND
// ══════════════════════════════════════════════════════════════════════════════
function Background({ frame }: { frame: number }) {
  return (
    <AbsoluteFill>
      <div style={{ width: "100%", height: "100%", background: BG }} />
      {/* top-left corner glow */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: -200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BLUE}22 0%, transparent 70%)`,
        }}
      />
      {/* bottom-right corner glow */}
      <div
        style={{
          position: "absolute",
          bottom: -200,
          right: -200,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BLUE_GLOW}18 0%, transparent 70%)`,
        }}
      />
      <GridLines />
      <Dots frame={frame} />
      {/* vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.75) 100%)",
        }}
      />
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export const VAGuideAd: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Background frame={frame} />
      {/* Hook: 0–90 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneHook />
      </Sequence>
      {/* Features: 90–630 */}
      <Sequence from={90} durationInFrames={540}>
        <SceneFeatures />
      </Sequence>
      {/* CTA: 630–900 */}
      <Sequence from={630} durationInFrames={270}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};

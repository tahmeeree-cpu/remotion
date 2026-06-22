import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";

// ── Palette ──────────────────────────────────────────────────────────────────
const BG = "#0d0a07";
const ORANGE = "#e8630a";
const ORANGE_LIGHT = "#f5a623";
const CREAM = "#f5ead8";

// ── Helpers ───────────────────────────────────────────────────────────────────

function useFadeSlideIn(
  frame: number,
  fps: number,
  delay = 0,
  direction: "up" | "down" | "left" | "right" = "up"
) {
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 80, mass: 1 },
    durationInFrames: 30,
  });
  const dist = interpolate(progress, [0, 1], [40, 0]);
  const opacity = progress;
  const transform =
    direction === "up"
      ? `translateY(${dist}px)`
      : direction === "down"
      ? `translateY(${-dist}px)`
      : direction === "left"
      ? `translateX(${dist}px)`
      : `translateX(${-dist}px)`;
  return { opacity, transform };
}

// ── Particle dots ─────────────────────────────────────────────────────────────

function Particles({ frame }: { frame: number }) {
  const particles = Array.from({ length: 18 }, (_, i) => {
    const seed = i * 137.5;
    const x = ((seed * 7.3) % 100);
    const y = ((seed * 3.7) % 100);
    const size = 2 + (i % 3);
    const speed = 0.3 + (i % 5) * 0.12;
    const offsetY = (frame * speed) % 110;
    const opacity = 0.15 + (i % 4) * 0.08;
    return { x, y: (y - offsetY + 110) % 110, size, opacity };
  });

  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      {particles.map((p, i) => (
        <circle
          key={i}
          cx={`${p.x}%`}
          cy={`${p.y}%`}
          r={p.size}
          fill={ORANGE}
          opacity={p.opacity}
        />
      ))}
    </svg>
  );
}

// ── Steam wisps ───────────────────────────────────────────────────────────────

function Steam({ frame }: { frame: number }) {
  const wisps = [
    { x: 48, delay: 0, amp: 12 },
    { x: 50, delay: 8, amp: -10 },
    { x: 52, delay: 16, amp: 8 },
  ];

  return (
    <svg
      viewBox="0 0 100 120"
      style={{
        position: "absolute",
        bottom: "44%",
        left: "50%",
        transform: "translateX(-50%)",
        width: 160,
        height: 120,
        overflow: "visible",
      }}
    >
      {wisps.map((w, i) => {
        const t = (frame + w.delay * 3) / 90;
        const yOff = (t * 60) % 120;
        const xWave = Math.sin(t * Math.PI * 2) * w.amp;
        const opacity = Math.max(0, 0.5 - yOff / 120);
        return (
          <path
            key={i}
            d={`M ${w.x + xWave} ${120 - yOff} Q ${w.x + xWave * 1.5} ${
              100 - yOff
            } ${w.x} ${80 - yOff}`}
            stroke={ORANGE_LIGHT}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
}

// ── Coffee cup illustration ───────────────────────────────────────────────────

function CoffeeCup({ scale = 1 }: { scale?: number }) {
  return (
    <svg
      viewBox="0 0 120 140"
      width={220 * scale}
      height={220 * scale}
      style={{ display: "block" }}
    >
      {/* saucer */}
      <ellipse cx="60" cy="128" rx="46" ry="8" fill="#1a1108" />
      {/* cup body */}
      <path
        d="M20 60 Q18 110 35 122 Q60 132 85 122 Q102 110 100 60 Z"
        fill="#1e1308"
        stroke={ORANGE}
        strokeWidth="2"
      />
      {/* cup rim */}
      <ellipse cx="60" cy="60" rx="40" ry="10" fill="#251a0d" stroke={ORANGE} strokeWidth="2" />
      {/* coffee surface */}
      <ellipse cx="60" cy="60" rx="36" ry="8" fill="#3b1e08" />
      {/* latte art swirl */}
      <path
        d="M50 57 Q55 52 60 57 Q65 62 70 57"
        stroke={CREAM}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* handle */}
      <path
        d="M100 72 Q120 72 120 88 Q120 104 100 104"
        stroke={ORANGE}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* highlight */}
      <path
        d="M28 70 Q26 90 30 108"
        stroke="white"
        strokeWidth="1"
        fill="none"
        opacity="0.15"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Animated headline ─────────────────────────────────────────────────────────

function AnimatedText({
  text,
  frame,
  fps,
  delay,
  fontSize,
  color,
  letterSpacing,
  fontWeight,
}: {
  text: string;
  frame: number;
  fps: number;
  delay: number;
  fontSize: number;
  color: string;
  letterSpacing?: number;
  fontWeight?: number;
}) {
  const style = useFadeSlideIn(frame, fps, delay, "up");
  return (
    <div
      style={{
        ...style,
        fontSize,
        color,
        fontFamily: "'Georgia', serif",
        fontWeight: fontWeight ?? 700,
        letterSpacing: letterSpacing ?? 2,
        textAlign: "center",
        lineHeight: 1.2,
        textShadow: `0 0 40px ${ORANGE}55`,
      }}
    >
      {text}
    </div>
  );
}

// ── Orange divider line ───────────────────────────────────────────────────────

function DividerLine({ frame, fps, delay }: { frame: number; fps: number; delay: number }) {
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 70 },
    durationInFrames: 25,
  });
  return (
    <div
      style={{
        height: 2,
        background: `linear-gradient(90deg, transparent, ${ORANGE}, ${ORANGE_LIGHT}, ${ORANGE}, transparent)`,
        width: `${interpolate(progress, [0, 1], [0, 300])}px`,
        borderRadius: 2,
        boxShadow: `0 0 12px ${ORANGE}`,
        margin: "16px auto",
      }}
    />
  );
}

// ── Scene 1 — Brand intro (0–3 s = frames 0–90) ───────────────────────────────

function SceneIntro() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cupScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 60 },
    durationInFrames: 40,
  });
  const cupOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const exitOpacity = interpolate(frame, [75, 90], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      <div
        style={{
          position: "absolute",
          bottom: "36%",
          left: "50%",
          transform: `translateX(-50%) scale(${cupScale})`,
          opacity: cupOpacity,
        }}
      >
        <CoffeeCup />
      </div>

      <Steam frame={frame} />

      <div
        style={{
          position: "absolute",
          bottom: "18%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <AnimatedText text="ROASTED TO" frame={frame} fps={fps} delay={20} fontSize={28} color={ORANGE_LIGHT} letterSpacing={8} fontWeight={400} />
        <AnimatedText text="PERFECTION" frame={frame} fps={fps} delay={35} fontSize={52} color={CREAM} letterSpacing={6} />
        <DividerLine frame={frame} fps={fps} delay={50} />
        <AnimatedText text="OBSCURA COFFEE" frame={frame} fps={fps} delay={60} fontSize={20} color={ORANGE} letterSpacing={12} fontWeight={400} />
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 2 — Product benefits (frames 90–540 = 3–18 s) ──────────────────────

function BenefitCard({
  frame,
  fps,
  delay,
  icon,
  title,
  subtitle,
}: {
  frame: number;
  fps: number;
  delay: number;
  icon: string;
  title: string;
  subtitle: string;
}) {
  const s = useFadeSlideIn(frame, fps, delay, "up");
  return (
    <div
      style={{
        ...s,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        width: 160,
      }}
    >
      <div style={{ fontSize: 36 }}>{icon}</div>
      <div style={{ color: CREAM, fontSize: 18, fontWeight: 700, fontFamily: "Georgia, serif", letterSpacing: 2 }}>{title}</div>
      <div style={{ color: ORANGE_LIGHT, fontSize: 13, fontFamily: "Georgia, serif", letterSpacing: 1, opacity: 0.85, textAlign: "center" }}>{subtitle}</div>
    </div>
  );
}

const BENEFITS = [
  { icon: "🌱", title: "SINGLE ORIGIN", subtitle: "Direct from\nEthiopian highlands" },
  { icon: "🔥", title: "DARK ROAST", subtitle: "Bold, deep\nsmooth finish" },
  { icon: "♾️", title: "ALWAYS FRESH", subtitle: "Roasted weekly\nto order" },
];

function SceneBenefits() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleStyle = useFadeSlideIn(frame, fps, 0, "up");
  const exitOpacity = interpolate(frame, [130, 150], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      <div
        style={{
          position: "absolute",
          top: "15%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ ...titleStyle, color: ORANGE, fontFamily: "Georgia, serif", fontSize: 14, letterSpacing: 10, fontWeight: 400, marginBottom: 4 }}>
          WHY OBSCURA
        </div>
        <DividerLine frame={frame} fps={fps} delay={10} />
      </div>

      <div
        style={{
          position: "absolute",
          top: "35%",
          width: "100%",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "flex-start",
          padding: "0 40px",
        }}
      >
        {BENEFITS.map((b, i) => (
          <BenefitCard key={i} frame={frame} fps={fps} delay={20 + i * 18} {...b} />
        ))}
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 3 — Lifestyle quote (frames 540–720 = 18–24 s) ─────────────────────

function SceneQuote() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOpacity = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill
      style={{
        opacity: exitOpacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
      }}
    >
      <AnimatedText
        text={'"Every morning'}
        frame={frame}
        fps={fps}
        delay={0}
        fontSize={36}
        color={CREAM}
        letterSpacing={3}
      />
      <AnimatedText
        text={'deserves a ritual”'}
        frame={frame}
        fps={fps}
        delay={18}
        fontSize={36}
        color={CREAM}
        letterSpacing={3}
      />
      <DividerLine frame={frame} fps={fps} delay={36} />
      <AnimatedText
        text="— OBSCURA COFFEE CO."
        frame={frame}
        fps={fps}
        delay={50}
        fontSize={16}
        color={ORANGE_LIGHT}
        letterSpacing={6}
        fontWeight={400}
      />
    </AbsoluteFill>
  );
}

// ── Scene 4 — CTA (frames 720–900 = 24–30 s) ────────────────────────────────

function SceneCTA() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glowPulse = interpolate(Math.sin((frame / 30) * Math.PI), [-1, 1], [0.6, 1]);

  const btnStyle = useFadeSlideIn(frame, fps, 40, "up");

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: 40,
      }}
    >
      <AnimatedText text="THE PERFECT CUP" frame={frame} fps={fps} delay={0} fontSize={48} color={CREAM} letterSpacing={5} />
      <AnimatedText text="AWAITS YOU" frame={frame} fps={fps} delay={15} fontSize={48} color={ORANGE} letterSpacing={5} />

      <DividerLine frame={frame} fps={fps} delay={30} />

      {/* CTA button */}
      <div
        style={{
          ...btnStyle,
          marginTop: 12,
          padding: "14px 48px",
          border: `2px solid ${ORANGE}`,
          borderRadius: 4,
          color: CREAM,
          fontFamily: "Georgia, serif",
          fontSize: 18,
          letterSpacing: 6,
          fontWeight: 700,
          background: `rgba(232, 99, 10, ${0.12 * glowPulse})`,
          boxShadow: `0 0 ${24 * glowPulse}px ${ORANGE}88`,
          textAlign: "center",
        }}
      >
        SHOP NOW
      </div>

      <AnimatedText text="obscuracoffee.com" frame={frame} fps={fps} delay={60} fontSize={14} color={ORANGE_LIGHT} letterSpacing={4} fontWeight={400} />
    </AbsoluteFill>
  );
}

// ── Background vignette ───────────────────────────────────────────────────────

function Background({ frame }: { frame: number }) {
  const hue = interpolate(frame, [0, 900], [12, 20], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BG,
        }}
      />
      {/* warm radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 50% at 50% 60%, hsl(${hue}, 80%, 10%) 0%, transparent 70%)`,
        }}
      />
      {/* vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      <Particles frame={frame} />
    </AbsoluteFill>
  );
}

// ── Root composition ──────────────────────────────────────────────────────────

export const CoffeeAd: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Background frame={frame} />

      {/* Scene 1: 0–90 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneIntro />
      </Sequence>

      {/* Scene 2: 90–540 (3s–18s) */}
      <Sequence from={90} durationInFrames={450}>
        <SceneBenefits />
      </Sequence>

      {/* Scene 3: 540–720 (18s–24s) */}
      <Sequence from={540} durationInFrames={180}>
        <SceneQuote />
      </Sequence>

      {/* Scene 4: 720–900 (24s–30s) */}
      <Sequence from={720} durationInFrames={180}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};

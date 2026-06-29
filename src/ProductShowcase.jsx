import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  Sequence,
} from "remotion";

// ── helpers ──────────────────────────────────────────────────────────────────

function fadeUp(frame, start, duration = 25, distance = 40) {
  const opacity = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const y = interpolate(frame, [start, start + duration], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return { opacity, transform: `translateY(${y}px)` };
}

function scaleIn(frame, start, fps, stiffness = 140, damping = 20) {
  const s = spring({ frame: frame - start, fps, config: { stiffness, damping, mass: 0.9 }, from: 0, to: 1 });
  return { transform: `scale(${s})`, opacity: Math.min(s, 1) };
}

// ── background grid ──────────────────────────────────────────────────────────
function Grid({ frame }) {
  const opacity = interpolate(frame, [0, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: opacity * 0.07 }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#3B82F6" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </AbsoluteFill>
  );
}

// ── ambient orbs ─────────────────────────────────────────────────────────────
function Orb({ cx, cy, r, opacity, frame, phase = 0 }) {
  const pulse = 1 + Math.sin((frame * 0.025 + phase) * 1) * 0.06;
  return (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: cy,
        width: r,
        height: r,
        borderRadius: "50%",
        transform: `translate(-50%, -50%) scale(${pulse})`,
        background: "radial-gradient(circle, rgba(59,130,246,0.55) 0%, rgba(59,130,246,0.1) 55%, transparent 100%)",
        opacity,
        filter: "blur(60px)",
        pointerEvents: "none",
      }}
    />
  );
}

// ── particles ─────────────────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: 4 + ((i * 43 + 17) % 92),
  y: 2 + ((i * 61 + 9) % 96),
  size: 1.5 + (i % 3) * 0.8,
  phase: i * 0.7,
  speed: 0.3 + (i % 5) * 0.12,
  opacity: 0.12 + (i % 5) * 0.07,
}));

function Particles({ frame }) {
  return (
    <>
      {PARTICLES.map((p) => {
        const drift = Math.sin((frame * p.speed + p.phase) * 0.04) * 10;
        const driftY = Math.cos((frame * p.speed * 0.6 + p.phase) * 0.035) * 14;
        const pulse = 0.5 + Math.sin((frame * 0.06 + p.phase)) * 0.5;
        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: "#3B82F6",
              opacity: p.opacity * pulse,
              transform: `translate(${drift}px, ${driftY}px)`,
            }}
          />
        );
      })}
    </>
  );
}

// ── accent line ───────────────────────────────────────────────────────────────
function AccentLine({ frame, startFrame, width = 200, style = {} }) {
  const w = interpolate(frame, [startFrame, startFrame + 30], [0, width], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        height: 3,
        width: w,
        borderRadius: 2,
        background: "linear-gradient(90deg, #3B82F6, #60A5FA, #93C5FD)",
        ...style,
      }}
    />
  );
}

// ── feature card ──────────────────────────────────────────────────────────────
function FeatureCard({ frame, startFrame, fps, icon, title, desc }) {
  const s = spring({ frame: frame - startFrame, fps, config: { stiffness: 120, damping: 18, mass: 0.8 }, from: 0, to: 1 });
  const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(frame, [startFrame, startFrame + 30], [-60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 28,
        padding: "36px 40px",
        borderRadius: 24,
        background: "rgba(59,130,246,0.06)",
        border: "1px solid rgba(59,130,246,0.18)",
        backdropFilter: "blur(8px)",
        opacity,
        transform: `translateX(${x}px) scale(${s})`,
      }}
    >
      <div
        style={{
          fontSize: 48,
          lineHeight: 1,
          minWidth: 60,
          textAlign: "center",
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.01em",
            marginBottom: 8,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.5,
            fontWeight: 400,
          }}
        >
          {desc}
        </div>
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export function ProductShowcase() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // timing (30fps):
  // 0-90    HOOK section
  // 90-600  FEATURES (3 × ~90 frames each)  — actually spread over 90–540
  // 540-750 (18s–25s) transition + CTA
  // 750-900 CTA hold

  // --- HOOK ---
  const hookEyebrow = fadeUp(frame, 10, 20);
  const hookLine1 = fadeUp(frame, 22, 22);
  const hookLine2 = fadeUp(frame, 38, 22);
  const hookSub = fadeUp(frame, 58, 22);

  const hookFade = interpolate(frame, [72, 88], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // flash on transition
  const flash1 = interpolate(frame, [86, 90, 96], [0, 0.22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- FEATURES ---
  const featuresOpacity = interpolate(frame, [88, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const featuresFade = interpolate(frame, [510, 530], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const featuresVisible = Math.min(featuresOpacity, featuresFade);

  const featHeader = fadeUp(frame, 94, 22);

  // feature cards stagger: 110, 210, 310
  const FEATURES = [
    {
      start: 110,
      icon: "⚡",
      title: "Done-For-You Prompts",
      desc: "100+ plug-and-play captions crafted to stop the scroll instantly.",
    },
    {
      start: 210,
      icon: "🎯",
      title: "Hook Formulas",
      desc: "Proven templates for statement, question & story hooks — all in one guide.",
    },
    {
      start: 310,
      icon: "📈",
      title: "Engagement Boosters",
      desc: "CTAs, engagement bait phrases & hashtag stacks included.",
    },
  ];

  // flash 2 before CTA
  const flash2 = interpolate(frame, [526, 530, 536], [0, 0.22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- CTA ---
  const ctaOpacity = interpolate(frame, [528, 548], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ctaTag = fadeUp(frame, 532, 22);
  const ctaHeadline = fadeUp(frame, 550, 24);
  const ctaBtn = scaleIn(frame, 575, fps, 130, 18);
  const ctaUrl = fadeUp(frame, 600, 22);
  const ctaPulse = 1 + Math.sin(frame * 0.12) * 0.03;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #040b18 0%, #050d1f 50%, #020810 100%)",
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <Grid frame={frame} />
      <Orb cx="30%" cy="18%" r={600} opacity={0.5} frame={frame} phase={0} />
      <Orb cx="80%" cy="75%" r={500} opacity={0.4} frame={frame} phase={1.6} />
      <Orb cx="15%" cy="85%" r={380} opacity={0.25} frame={frame} phase={3} />
      <Particles frame={frame} />

      {/* Flash overlays */}
      <AbsoluteFill style={{ background: "white", opacity: flash1, pointerEvents: "none" }} />
      <AbsoluteFill style={{ background: "white", opacity: flash2, pointerEvents: "none" }} />

      {/* ── HOOK (frames 0–88) ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 70px",
          opacity: hookFade,
          gap: 0,
        }}
      >
        {/* Eyebrow chip */}
        <div
          style={{
            ...hookEyebrow,
            marginBottom: 36,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 28px",
            borderRadius: 100,
            border: "1px solid rgba(59,130,246,0.5)",
            background: "rgba(59,130,246,0.1)",
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B82F6" }} />
          <span style={{ fontSize: 22, letterSpacing: "0.25em", textTransform: "uppercase", color: "#60A5FA", fontWeight: 600 }}>
            social media va
          </span>
        </div>

        <div
          style={{
            ...hookLine1,
            fontSize: 86,
            fontWeight: 900,
            color: "white",
            textAlign: "center",
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            marginBottom: 4,
          }}
        >
          Stop Writing
        </div>
        <div
          style={{
            ...hookLine2,
            fontSize: 86,
            fontWeight: 900,
            textAlign: "center",
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            marginBottom: 40,
            background: "linear-gradient(90deg, #3B82F6, #60A5FA, #93C5FD)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Dead Captions.
        </div>

        <AccentLine frame={frame} startFrame={48} width={240} style={{ marginBottom: 40 }} />

        <div
          style={{
            ...hookSub,
            fontSize: 30,
            color: "rgba(255,255,255,0.6)",
            textAlign: "center",
            lineHeight: 1.6,
            maxWidth: 700,
            fontWeight: 400,
          }}
        >
          Your audience decides in{" "}
          <span style={{ color: "#60A5FA", fontWeight: 700 }}>2 seconds</span>
          {" "}whether to keep scrolling. Here's how to make them stop.
        </div>
      </AbsoluteFill>

      {/* ── FEATURES (frames 88–530) ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 60px",
          gap: 32,
          opacity: featuresVisible,
        }}
      >
        {/* Section header */}
        <div style={{ ...featHeader, marginBottom: 8 }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#3B82F6",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            what's inside
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: "white",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            The Prompt
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #3B82F6, #60A5FA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Guide
            </span>
          </div>
        </div>

        {FEATURES.map((f) => (
          <FeatureCard key={f.title} frame={frame} fps={fps} startFrame={f.start} icon={f.icon} title={f.title} desc={f.desc} />
        ))}
      </AbsoluteFill>

      {/* ── CTA (frames 528–900) ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 70px",
          gap: 0,
          opacity: ctaOpacity,
        }}
      >
        {/* Badge */}
        <div
          style={{
            ...ctaTag,
            marginBottom: 40,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 28px",
            borderRadius: 100,
            border: "1px solid rgba(59,130,246,0.5)",
            background: "rgba(59,130,246,0.1)",
          }}
        >
          <span style={{ fontSize: 22, letterSpacing: "0.2em", textTransform: "uppercase", color: "#60A5FA", fontWeight: 600 }}>
            get it now
          </span>
        </div>

        <div
          style={{
            ...ctaHeadline,
            fontSize: 76,
            fontWeight: 900,
            color: "white",
            textAlign: "center",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: 20,
          }}
        >
          Your captions
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #3B82F6, #60A5FA, #93C5FD)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            deserve better.
          </span>
        </div>

        <AccentLine frame={frame} startFrame={562} width={200} style={{ marginBottom: 56 }} />

        {/* CTA button */}
        <div
          style={{
            ...ctaBtn,
            transform: `${ctaBtn.transform} scale(${ctaPulse})`,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              padding: "32px 72px",
              borderRadius: 100,
              background: "linear-gradient(135deg, #2563EB, #3B82F6, #60A5FA)",
              boxShadow: "0 0 60px rgba(59,130,246,0.5), 0 0 120px rgba(59,130,246,0.2)",
              fontSize: 36,
              fontWeight: 800,
              color: "white",
              letterSpacing: "0.01em",
              textAlign: "center",
            }}
          >
            Download the Guide →
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            ...ctaUrl,
            fontSize: 30,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.05em",
          }}
        >
          yourwebsite.com/va-prompts
        </div>

        {/* Decorative dots */}
        <div style={{ display: "flex", gap: 12, marginTop: 60, ...ctaUrl }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: i === 1 ? 28 : 10,
                height: 10,
                borderRadius: 5,
                background: i === 1 ? "#3B82F6" : "rgba(59,130,246,0.3)",
                transition: "width 0.3s",
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

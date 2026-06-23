import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from "remotion";

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: 5 + ((i * 37 + 11) % 90),
  y: 5 + ((i * 53 + 7) % 90),
  size: 2 + (i % 4),
  delay: (i * 3) % 40,
  speed: 0.4 + (i % 5) * 0.15,
  opacity: 0.15 + (i % 6) * 0.08,
}));

function FloatingParticle({ x, y, size, delay, speed, opacity, frame }) {
  const drift = Math.sin((frame * speed + delay) * 0.04) * 12;
  const driftY = Math.cos((frame * speed * 0.7 + delay) * 0.03) * 8;
  const pulse = 0.6 + Math.sin((frame * 0.05 + delay) * 1.2) * 0.4;
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: "white",
        opacity: opacity * pulse,
        transform: `translate(${drift}px, ${driftY}px)`,
      }}
    />
  );
}

function GradientOrb({ cx, cy, r, color1, color2, frame, phaseOffset = 0 }) {
  const scale = 1 + Math.sin((frame * 0.02 + phaseOffset) * 1) * 0.08;
  return (
    <div
      style={{
        position: "absolute",
        left: `${cx}%`,
        top: `${cy}%`,
        width: r,
        height: r,
        borderRadius: "50%",
        transform: `translate(-50%, -50%) scale(${scale})`,
        background: `radial-gradient(circle, ${color1} 0%, ${color2} 60%, transparent 100%)`,
        opacity: 0.55,
        filter: "blur(40px)",
      }}
    />
  );
}

export function StatementHook() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Phase timing (at 30fps):
  // 0-60:   Statement enters
  // 60-90:  Statement holds
  // 90-105: Statement fades
  // 105-135: Pause (silence + visual breath)
  // 135-195: Hook text enters and holds

  const statementEnter = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const statementFade = interpolate(frame, [88, 105], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const statementOpacity = Math.min(statementEnter, statementFade);

  const statementY = interpolate(frame, [0, 40], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Hook text enters with spring at frame 135
  const hookSpring = spring({
    frame: frame - 135,
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.8 },
    from: 0,
    to: 1,
  });

  const hookOpacity = interpolate(frame, [135, 155], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle flash on the pause moment
  const flashOpacity = interpolate(frame, [103, 108, 115], [0, 0.18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Orb color pulse tied to phases
  const orbShift = interpolate(frame, [105, 135], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0014 0%, #0d0020 50%, #050010 100%)",
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Ambient orbs */}
      <GradientOrb cx={20} cy={25} r={500} color1="rgba(120,40,200,0.7)" color2="rgba(80,0,160,0.3)" frame={frame} phaseOffset={0} />
      <GradientOrb cx={80} cy={70} r={420} color1="rgba(200,60,120,0.5)" color2="rgba(140,0,80,0.2)" frame={frame} phaseOffset={2} />
      <GradientOrb
        cx={50}
        cy={50}
        r={350}
        color1={`rgba(${Math.round(100 + orbShift * 60)},${Math.round(20 + orbShift * 80)},${Math.round(220 - orbShift * 60)},0.35)`}
        color2="transparent"
        frame={frame}
        phaseOffset={1}
      />

      {/* Particles */}
      {PARTICLES.map((p) => (
        <FloatingParticle key={p.id} {...p} frame={frame} />
      ))}

      {/* Thin horizontal accent line */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: interpolate(frame, [10, 50], [0, 680], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(180,120,255,0.4), rgba(255,100,180,0.4), transparent)",
          opacity: statementOpacity * 0.6,
        }}
      />

      {/* Flash on pause */}
      <AbsoluteFill
        style={{
          background: "white",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />

      {/* === STATEMENT TEXT === */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 100px",
          opacity: statementOpacity,
          transform: `translateY(${statementY}px)`,
        }}
      >
        <div style={{ textAlign: "center" }}>
          {/* Eyebrow */}
          <div
            style={{
              fontSize: 18,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(200,150,255,0.7)",
              marginBottom: 28,
              opacity: interpolate(frame, [15, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            fact
          </div>

          {/* Main statement */}
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.1,
              color: "white",
              textShadow: "0 0 60px rgba(160,80,255,0.5), 0 0 120px rgba(160,80,255,0.2)",
              letterSpacing: "-0.02em",
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.95)" }}>Most social media</span>
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #c084fc, #f472b6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              captions
            </span>{" "}
            <span style={{ color: "rgba(255,255,255,0.95)" }}>get ignored</span>
            <br />
            <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 58 }}>
              in the first{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #f472b6, #fb923c)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontStyle: "italic",
                }}
              >
                two seconds.
              </span>
            </span>
          </div>
        </div>
      </AbsoluteFill>

      {/* === HOOK REVEAL TEXT === */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 120px",
          opacity: hookOpacity,
          transform: `scale(${hookSpring})`,
        }}
      >
        {/* Arrow or decorator */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(200,150,255,0.6)",
            marginBottom: 20,
            letterSpacing: "0.2em",
          }}
        >
          ↑
        </div>

        {/* Label */}
        <div
          style={{
            fontSize: 20,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(200,150,255,0.65)",
            marginBottom: 24,
          }}
        >
          that right there was a
        </div>

        {/* Hook word */}
        <div
          style={{
            fontSize: 100,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            background: "linear-gradient(135deg, #c084fc 0%, #f472b6 50%, #fb923c 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "none",
            filter: "drop-shadow(0 0 40px rgba(200,80,255,0.5))",
          }}
        >
          statement hook.
        </div>

        {/* Underline accent */}
        <div
          style={{
            marginTop: 20,
            width: interpolate(frame, [155, 185], [0, 500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            height: 3,
            borderRadius: 2,
            background: "linear-gradient(90deg, #c084fc, #f472b6, #fb923c)",
            opacity: 0.7,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

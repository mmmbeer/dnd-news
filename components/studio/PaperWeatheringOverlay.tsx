import { weatheringOverlayForAge } from "@/lib/news/weathering";

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function between(rng: () => number, min: number, max: number) {
  return min + rng() * (max - min);
}

export function PaperWeatheringOverlay({ paperAge, enabled }: { paperAge: number; enabled: boolean }) {
  const overlay = weatheringOverlayForAge(paperAge);
  if (!enabled || !overlay) return null;

  const rng = seededRandom(overlay.level * 7919 + 173);
  const intensity = overlay.level / 25;

  const stains = Array.from({ length: overlay.stainCount }, (_, index) => {
    const cx = between(rng, 90, 910);
    const cy = between(rng, 90, 1160);
    const rx = between(rng, 48, 115) * (0.7 + intensity * 0.65);
    const ry = rx * between(rng, 0.62, 1.28);
    const rotation = between(rng, -24, 24);
    const strokeOpacity = 0.055 + intensity * 0.055;
    return (
      <g key={`stain-${index}`} transform={`rotate(${rotation} ${cx} ${cy})`}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#765d35" fillOpacity={0.008 + intensity * 0.014} stroke="#6f5634" strokeOpacity={strokeOpacity} strokeWidth={between(rng, 2.4, 6.2)} />
        <ellipse cx={cx + between(rng, -6, 6)} cy={cy + between(rng, -6, 6)} rx={rx * 0.82} ry={ry * 0.83} fill="none" stroke="#8a7045" strokeOpacity={strokeOpacity * 0.55} strokeWidth={between(rng, 1, 3)} />
      </g>
    );
  });

  const creases = Array.from({ length: overlay.creaseCount }, (_, index) => {
    const vertical = rng() > 0.42;
    const x1 = vertical ? between(rng, 110, 890) : between(rng, 20, 110);
    const y1 = vertical ? between(rng, 15, 170) : between(rng, 120, 1130);
    const x2 = vertical ? x1 + between(rng, -70, 70) : between(rng, 890, 980);
    const y2 = vertical ? between(rng, 1080, 1235) : y1 + between(rng, -80, 80);
    const cx1 = between(rng, 240, 760);
    const cy1 = between(rng, 260, 990);
    const cx2 = between(rng, 240, 760);
    const cy2 = between(rng, 260, 990);
    const path = `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${cx1.toFixed(1)} ${cy1.toFixed(1)}, ${cx2.toFixed(1)} ${cy2.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`;
    return (
      <g key={`crease-${index}`}>
        <path d={path} fill="none" stroke="#564934" strokeOpacity={0.04 + intensity * 0.055} strokeWidth={between(rng, 1.4, 3.2)} />
        <path d={path} fill="none" stroke="#fff7de" strokeOpacity={0.025 + intensity * 0.025} strokeWidth={between(rng, 0.6, 1.4)} transform={`translate(${between(rng, 1, 3)} ${between(rng, 1, 3)})`} />
      </g>
    );
  });

  const wrinkles = Array.from({ length: overlay.wrinkleCount }, (_, index) => {
    const x1 = between(rng, 20, 980);
    const y1 = between(rng, 20, 1230);
    const length = between(rng, 90, 330);
    const x2 = Math.max(12, Math.min(988, x1 + between(rng, -length, length)));
    const y2 = Math.max(12, Math.min(1238, y1 + between(rng, -length * 0.42, length * 0.42)));
    const mx = (x1 + x2) / 2 + between(rng, -55, 55);
    const my = (y1 + y2) / 2 + between(rng, -55, 55);
    return (
      <path
        key={`wrinkle-${index}`}
        d={`M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`}
        fill="none"
        stroke="#62523b"
        strokeOpacity={0.018 + intensity * 0.035}
        strokeWidth={between(rng, 0.55, 1.45)}
      />
    );
  });

  const speckles = Array.from({ length: overlay.speckleCount }, (_, index) => {
    const radius = between(rng, 0.7, 4.2) * (0.75 + intensity * 0.45);
    return (
      <ellipse
        key={`speck-${index}`}
        cx={between(rng, 10, 990)}
        cy={between(rng, 10, 1240)}
        rx={radius * between(rng, 0.6, 1.5)}
        ry={radius}
        fill="#5c4930"
        fillOpacity={between(rng, 0.018, 0.055) * (0.75 + intensity)}
      />
    );
  });

  return (
    <svg
      className="paper-weathering-overlay"
      data-weathering-overlay={overlay.id}
      viewBox="0 0 1000 1250"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 6,
        mixBlendMode: "multiply",
        opacity: overlay.opacity,
      }}
    >
      <rect x="5" y="5" width="990" height="1240" fill="none" stroke="#57462f" strokeOpacity={0.035 + intensity * 0.07} strokeWidth={4 + overlay.edgeWear * 9} />
      <path d="M 8 22 C 180 2 310 34 480 9 S 790 31 992 12" fill="none" stroke="#594730" strokeOpacity={0.025 + intensity * 0.05} strokeWidth={3 + overlay.edgeWear * 5} />
      <path d="M 12 1238 C 180 1215 340 1248 515 1226 S 805 1247 990 1224" fill="none" stroke="#594730" strokeOpacity={0.025 + intensity * 0.05} strokeWidth={3 + overlay.edgeWear * 5} />
      {stains}
      {creases}
      {wrinkles}
      {speckles}
    </svg>
  );
}

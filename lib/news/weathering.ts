export interface PaperWeatheringOverlayDefinition {
  id: string;
  level: number;
  stainCount: number;
  creaseCount: number;
  wrinkleCount: number;
  speckleCount: number;
  edgeWear: number;
  opacity: number;
}

export const paperWeatheringOverlays: PaperWeatheringOverlayDefinition[] = Array.from({ length: 25 }, (_, index) => {
  const level = index + 1;
  const intensity = level / 25;
  return {
    id: `weathering-${String(level).padStart(2, "0")}`,
    level,
    stainCount: 1 + Math.floor(level / 5),
    creaseCount: Math.floor((level + 2) / 4),
    wrinkleCount: 2 + Math.floor(level * 0.8),
    speckleCount: 8 + level * 3,
    edgeWear: 0.18 + intensity * 0.58,
    opacity: 0.26 + intensity * 0.5,
  };
});

export function weatheringLevelForAge(paperAge: number) {
  if (!Number.isFinite(paperAge) || paperAge <= 0) return 0;
  return Math.max(1, Math.min(25, Math.ceil(paperAge / 4)));
}

export function weatheringOverlayForAge(paperAge: number) {
  const level = weatheringLevelForAge(paperAge);
  return level ? paperWeatheringOverlays[level - 1] : null;
}

export function weatheringLabelForAge(paperAge: number) {
  const level = weatheringLevelForAge(paperAge);
  return level ? `Overlay ${String(level).padStart(2, "0")} of 25` : "No overlay at age 0";
}

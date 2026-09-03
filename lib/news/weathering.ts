export type PaperWeatheringRasterKind = "mark" | "texture";
export type PaperWeatheringBlendMode = "multiply" | "soft-light";

export interface PaperWeatheringRaster {
  id: string;
  label: string;
  src: string;
  kind: PaperWeatheringRasterKind;
  aspectRatio: number;
  blendMode: PaperWeatheringBlendMode;
  baseOpacity: number;
}

export interface PaperWeatheringOverlayDefinition {
  id: string;
  level: number;
  elementCount: number;
  opacity: number;
}

export const paperWeatheringRasters: PaperWeatheringRaster[] = [
  { id: "water-blotch", label: "Water blotch", src: "/weathering/mark-water-blotch.webp", kind: "mark", aspectRatio: 1, blendMode: "multiply", baseOpacity: 0.3 },
  { id: "cup-ring", label: "Cup ring", src: "/weathering/mark-cup-ring.webp", kind: "mark", aspectRatio: 1, blendMode: "multiply", baseOpacity: 0.27 },
  { id: "crumpled-patch", label: "Crumpled patch", src: "/weathering/mark-crumpled-patch.webp", kind: "mark", aspectRatio: 1, blendMode: "soft-light", baseOpacity: 0.34 },
  { id: "torn-crease", label: "Torn crease", src: "/weathering/mark-torn-crease.webp", kind: "mark", aspectRatio: 4 / 3, blendMode: "multiply", baseOpacity: 0.3 },
  { id: "spill-drips", label: "Spill drips", src: "/weathering/mark-spill-drips.webp", kind: "mark", aspectRatio: 3 / 4, blendMode: "multiply", baseOpacity: 0.26 },
  { id: "foxing-speckles", label: "Foxing speckles", src: "/weathering/mark-foxing-speckles.webp", kind: "mark", aspectRatio: 1, blendMode: "multiply", baseOpacity: 0.25 },
  { id: "soot-smudge", label: "Soot smudge", src: "/weathering/mark-soot-smudge.webp", kind: "mark", aspectRatio: 1, blendMode: "multiply", baseOpacity: 0.2 },
  { id: "water-bloom", label: "Water bloom", src: "/weathering/mark-water-bloom.webp", kind: "mark", aspectRatio: 1, blendMode: "multiply", baseOpacity: 0.27 },
  { id: "narrow-fold", label: "Narrow fold", src: "/weathering/mark-narrow-fold.webp", kind: "mark", aspectRatio: 4 / 3, blendMode: "soft-light", baseOpacity: 0.36 },
  { id: "ring-and-blotch", label: "Ring and blotch", src: "/weathering/mark-ring-and-blotch.webp", kind: "mark", aspectRatio: 1, blendMode: "multiply", baseOpacity: 0.25 },
  { id: "edge-stains", label: "Edge stains", src: "/weathering/texture-edge-stains.webp", kind: "texture", aspectRatio: 849 / 1200, blendMode: "multiply", baseOpacity: 0.13 },
  { id: "bottom-water-damage", label: "Bottom water damage", src: "/weathering/texture-bottom-water-damage.webp", kind: "texture", aspectRatio: 849 / 1200, blendMode: "multiply", baseOpacity: 0.13 },
  { id: "crumpled-sheet", label: "Crumpled sheet", src: "/weathering/texture-crumpled-sheet.webp", kind: "texture", aspectRatio: 849 / 1200, blendMode: "soft-light", baseOpacity: 0.2 },
  { id: "cross-folds", label: "Cross folds", src: "/weathering/texture-cross-folds.webp", kind: "texture", aspectRatio: 849 / 1200, blendMode: "multiply", baseOpacity: 0.12 },
  { id: "foxed-edges", label: "Foxed edges", src: "/weathering/texture-foxed-edges.webp", kind: "texture", aspectRatio: 849 / 1200, blendMode: "multiply", baseOpacity: 0.12 },
  { id: "rubbed-corners", label: "Rubbed corners", src: "/weathering/texture-rubbed-corners.webp", kind: "texture", aspectRatio: 849 / 1200, blendMode: "soft-light", baseOpacity: 0.18 },
  { id: "coffee-rings", label: "Coffee rings", src: "/weathering/texture-coffee-rings.webp", kind: "texture", aspectRatio: 849 / 1200, blendMode: "multiply", baseOpacity: 0.12 },
  { id: "worn-corners", label: "Worn corners", src: "/weathering/texture-worn-corners.webp", kind: "texture", aspectRatio: 849 / 1200, blendMode: "multiply", baseOpacity: 0.13 },
  { id: "quarter-folds", label: "Quarter folds", src: "/weathering/texture-quarter-folds.webp", kind: "texture", aspectRatio: 849 / 1200, blendMode: "soft-light", baseOpacity: 0.18 },
  { id: "diagonal-creases", label: "Diagonal creases", src: "/weathering/texture-diagonal-creases.webp", kind: "texture", aspectRatio: 849 / 1200, blendMode: "soft-light", baseOpacity: 0.18 },
];

export const paperWeatheringOverlays: PaperWeatheringOverlayDefinition[] = Array.from({ length: 25 }, (_, index) => {
  const level = index + 1;
  const intensity = level / 25;
  return {
    id: `weathering-${String(level).padStart(2, "0")}`,
    level,
    elementCount: 1 + Math.floor((level - 1) / 3),
    opacity: 0.55 + intensity * 0.45,
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

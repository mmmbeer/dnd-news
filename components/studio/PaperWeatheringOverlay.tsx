import Image from "next/image";
import {
  paperWeatheringRasters,
  weatheringOverlayForAge,
  type PaperWeatheringRaster,
} from "@/lib/news/weathering";

function seedFromString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

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

function shuffled<T>(values: T[], rng: () => number) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function selectRasters(level: number, count: number, rng: () => number) {
  const marks = shuffled(paperWeatheringRasters.filter((asset) => asset.kind === "mark"), rng);
  const textures = shuffled(paperWeatheringRasters.filter((asset) => asset.kind === "texture"), rng);
  const textureCount = Math.min(Math.floor(level / 7), 3, count - 1);
  return shuffled([...marks.slice(0, count - textureCount), ...textures.slice(0, textureCount)], rng);
}

function effectStyle(asset: PaperWeatheringRaster, level: number, opacity: number, rng: () => number) {
  const intensity = level / 25;
  const isTexture = asset.kind === "texture";
  const width = isTexture ? between(rng, 58, 112) : between(rng, 13, 39 + intensity * 8);
  const edgeRange = isTexture ? 12 : 4;
  const x = between(rng, -edgeRange, 100 + edgeRange);
  const y = between(rng, -edgeRange, 100 + edgeRange);
  const rotation = between(rng, isTexture ? -12 : -175, isTexture ? 12 : 175);
  const flip = rng() > 0.5 ? -1 : 1;
  const feather = isTexture
    ? "radial-gradient(ellipse 78% 76% at center, #000 46%, rgba(0,0,0,.94) 63%, transparent 100%)"
    : "radial-gradient(ellipse 72% 70% at center, #000 48%, rgba(0,0,0,.9) 68%, transparent 100%)";

  return {
    position: "absolute" as const,
    left: `${x}%`,
    top: `${y}%`,
    width: `${width}%`,
    aspectRatio: asset.aspectRatio,
    transform: `translate(-50%, -50%) rotate(${rotation.toFixed(2)}deg) scaleX(${flip})`,
    transformOrigin: "center",
    opacity: Math.min(1, asset.baseOpacity * opacity * between(rng, 0.72, 1.18)),
    mixBlendMode: asset.blendMode,
    maskImage: feather,
    WebkitMaskImage: feather,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
  };
}

export function PaperWeatheringOverlay({ paperAge, enabled, seed }: { paperAge: number; enabled: boolean; seed: string }) {
  const overlay = weatheringOverlayForAge(paperAge);
  if (!enabled || !overlay) return null;

  const rng = seededRandom(seedFromString(`${seed}:weathering:${overlay.level}`));
  const rasters = selectRasters(overlay.level, overlay.elementCount, rng);

  return (
    <div
      className="paper-weathering-overlay"
      data-weathering-overlay={overlay.id}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 6,
      }}
    >
      {rasters.map((asset, index) => (
        <span
          key={`${asset.id}-${index}`}
          data-weathering-effect={asset.id}
          data-weathering-kind={asset.kind}
          style={effectStyle(asset, overlay.level, overlay.opacity, rng)}
        >
          <Image
            src={asset.src}
            alt=""
            fill
            sizes={asset.kind === "texture" ? "100vw" : "40vw"}
            style={{ objectFit: "contain" }}
            draggable={false}
            unoptimized
          />
        </span>
      ))}
    </div>
  );
}

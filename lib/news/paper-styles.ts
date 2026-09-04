import type { ColorTheme, PaperColor } from "./types";

export interface ColorThemeOption {
  id: ColorTheme;
  label: string;
  color: string;
}

export interface PaperColorOption {
  id: PaperColor;
  label: string;
  color: string;
  edgeColor: string;
  weatheringOpacity: number;
  weatheringSaturation: number;
}

export const colorThemeOptions: ColorThemeOption[] = [
  { id: "charcoal", label: "Charcoal", color: "#20201e" },
  { id: "oxblood", label: "Oxblood", color: "#721c24" },
  { id: "rust", label: "Rust", color: "#7b321d" },
  { id: "sepia", label: "Sepia", color: "#604529" },
  { id: "navy", label: "Navy", color: "#193451" },
  { id: "royal", label: "Royal purple", color: "#3f315f" },
  { id: "plum", label: "Plum", color: "#59243e" },
  { id: "forest", label: "Forest", color: "#214c3a" },
  { id: "teal", label: "Teal", color: "#165158" },
  { id: "olive", label: "Olive", color: "#4e5125" },
];

export const paperColorOptions: PaperColorOption[] = [
  { id: "white", label: "White", color: "#ffffff", edgeColor: "rgba(92, 88, 73, 0.035)", weatheringOpacity: 1, weatheringSaturation: 1 },
  { id: "ivory", label: "Ivory", color: "#fbf7e9", edgeColor: "rgba(126, 103, 57, 0.045)", weatheringOpacity: 0.96, weatheringSaturation: 0.92 },
  { id: "parchment", label: "Parchment", color: "#f1e2bd", edgeColor: "rgba(126, 86, 34, 0.06)", weatheringOpacity: 0.82, weatheringSaturation: 0.76 },
  { id: "aged-parchment", label: "Aged parchment", color: "#e3cb96", edgeColor: "rgba(111, 71, 25, 0.075)", weatheringOpacity: 0.72, weatheringSaturation: 0.68 },
  { id: "mist-gray", label: "Mist gray", color: "#f1f2ef", edgeColor: "rgba(71, 79, 77, 0.04)", weatheringOpacity: 0.92, weatheringSaturation: 0.48 },
  { id: "newsprint", label: "Newsprint gray", color: "#e2e2dc", edgeColor: "rgba(63, 67, 64, 0.05)", weatheringOpacity: 0.86, weatheringSaturation: 0.4 },
  { id: "silver-gray", label: "Silver gray", color: "#d3d5d2", edgeColor: "rgba(48, 54, 52, 0.06)", weatheringOpacity: 0.82, weatheringSaturation: 0.34 },
  { id: "ash-gray", label: "Ash gray", color: "#c4c7c3", edgeColor: "rgba(41, 47, 45, 0.07)", weatheringOpacity: 0.78, weatheringSaturation: 0.28 },
];

const colorThemeMap = new Map(colorThemeOptions.map((option) => [option.id, option]));
const paperColorMap = new Map(paperColorOptions.map((option) => [option.id, option]));

export function colorThemeFor(id: ColorTheme | undefined) {
  return colorThemeMap.get(id ?? "charcoal") ?? colorThemeOptions[0];
}

export function paperColorFor(id: PaperColor | undefined) {
  return paperColorMap.get(id ?? "white") ?? paperColorOptions[0];
}

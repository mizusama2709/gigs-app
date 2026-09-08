export const CATEGORIES = [
  "photography",
  "cinematography",
  "editing",
  "design",
  "animation",
  "content",
] as const;

export type Category = (typeof CATEGORIES)[number];

// Grid brand: Gold is the one categorical accent the kit defines
// (oklch(72% .13 85)); the rest are harmonious tints at the same
// lightness/chroma, varying only hue, so a new category color never
// clashes with the brand.
export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  photography: { bg: "oklch(72% 0.13 85)", text: "#141414" },
  cinematography: { bg: "oklch(72% 0.11 35)", text: "#141414" },
  editing: { bg: "oklch(70% 0.1 250)", text: "#141414" },
  design: { bg: "oklch(70% 0.11 150)", text: "#141414" },
  animation: { bg: "oklch(70% 0.12 15)", text: "#141414" },
  content: { bg: "oklch(68% 0.09 280)", text: "#141414" },
};

export function categoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? { bg: "oklch(75% 0.02 85)", text: "#141414" };
}

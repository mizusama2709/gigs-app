export const CATEGORIES = [
  "photography",
  "cinematography",
  "editing",
  "design",
  "animation",
  "content",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  photography: { bg: "#FFC629", text: "#15140F" },
  cinematography: { bg: "#FF5C8A", text: "#15140F" },
  editing: { bg: "#8C6FF7", text: "#15140F" },
  design: { bg: "#33D17A", text: "#15140F" },
  animation: { bg: "#FF7A45", text: "#15140F" },
  content: { bg: "#4C6EF5", text: "#FFFDF7" },
};

export function categoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? { bg: "#B3AD9B", text: "#15140F" };
}

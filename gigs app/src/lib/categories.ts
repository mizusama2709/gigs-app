export const CATEGORIES = [
  "photography",
  "cinematography",
  "editing",
  "design",
  "animation",
  "content",
] as const;

export type Category = (typeof CATEGORIES)[number];

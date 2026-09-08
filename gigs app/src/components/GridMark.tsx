/** Grid brand mark: a bordered grid with one gold dot. Ported from the
 * Grid brand kit's logo artboard — stroke color adapts to its ground
 * (ink on paper, gold on dark), the dot always stays gold. */
export function GridMark({ size = 40, stroke = "currentColor" }: { size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <rect x="4" y="4" width="48" height="48" rx="6" fill="none" stroke={stroke} strokeWidth="3" />
      <line x1="4" y1="20.6" x2="52" y2="20.6" stroke={stroke} strokeWidth="1.6" />
      <line x1="4" y1="37.3" x2="52" y2="37.3" stroke={stroke} strokeWidth="1.6" />
      <line x1="20.6" y1="4" x2="20.6" y2="52" stroke={stroke} strokeWidth="1.6" />
      <line x1="37.3" y1="4" x2="37.3" y2="52" stroke={stroke} strokeWidth="1.6" />
      <circle cx="37.3" cy="20.6" r="4" fill="#C9A227" />
    </svg>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Grid brand card: flat, thin border, soft shadow (no folder-tab, no hard
 * offset shadow). `accentColor` draws a left-edge category stripe in place
 * of the old brutalist folder-tab.
 */
export function Card({
  accentColor,
  href,
  className = "",
  children,
}: {
  accentColor?: string;
  href?: string;
  className?: string;
  children: ReactNode;
}) {
  const cardClass = `block bg-surface border border-ink/10 rounded-xl shadow-sm ${className}`;
  const style = accentColor
    ? { borderLeftColor: accentColor, borderLeftWidth: 3 }
    : undefined;

  return href ? (
    <Link href={href} className={cardClass} style={style}>
      {children}
    </Link>
  ) : (
    <div className={cardClass} style={style}>
      {children}
    </div>
  );
}

export function CategoryBadge({
  category,
  bg,
  text,
  className = "",
}: {
  category: string;
  bg: string;
  text: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-block rounded-full font-medium text-[10.5px] px-2.5 py-1 capitalize ${className}`}
      style={{ backgroundColor: bg, color: text }}
    >
      {category}
    </span>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Shared "folder tab" card from the neo-brutalist design system: a colored
 * tab peeking above a thick-bordered, hard-shadowed card. Used for
 * freelancer/gig/job cards across Explore, profiles, jobs and dashboard.
 */
export function BrutalCard({
  tabColor,
  tabWidth = 96,
  href,
  className = "",
  children,
}: {
  tabColor?: string;
  tabWidth?: number;
  href?: string;
  className?: string;
  children: ReactNode;
}) {
  const cardClass = `relative block bg-surface border-[3.5px] border-ink rounded-2xl shadow-[5px_5px_0_var(--ink)] ${className}`;

  return (
    <div className="relative mt-2.5">
      {tabColor && (
        <div
          className="absolute -top-2.5 left-3.5 h-5 rounded-t-lg border-[3px] border-b-0 border-ink"
          style={{ width: tabWidth, backgroundColor: tabColor }}
        />
      )}
      {href ? (
        <Link href={href} className={cardClass}>
          {children}
        </Link>
      ) : (
        <div className={cardClass}>{children}</div>
      )}
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
      className={`inline-block rounded-full border-2 border-ink font-display font-bold text-[10.5px] px-2.5 py-1 capitalize ${className}`}
      style={{ backgroundColor: bg, color: text }}
    >
      {category}
    </span>
  );
}

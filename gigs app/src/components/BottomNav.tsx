"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/explore",
    label: "Explore",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2.25 : 1.75} stroke="currentColor" className="w-6 h-6">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/jobs",
    label: "Jobs",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2.25 : 1.75} stroke="currentColor" className="w-6 h-6">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  {
    href: "/dashboard",
    label: "Profile",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2.25 : 1.75} stroke="currentColor" className="w-6 h-6">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" />
      </svg>
    ),
  },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex bg-surface shadow-[0_-2px_12px_rgba(0,0,0,0.06)] z-20">
      {TABS.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[56px] py-2 text-xs ${
              active ? "text-accent font-semibold" : "text-gray-400"
            }`}
          >
            {tab.icon(active)}
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

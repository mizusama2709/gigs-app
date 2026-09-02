"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/explore", label: "Explore" },
  { href: "/jobs", label: "Jobs" },
  { href: "/dashboard", label: "Profile" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex border-t bg-[var(--background)] z-10">
      {TABS.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 flex items-center justify-center min-h-[44px] py-3 text-sm ${
              active ? "font-semibold" : "text-gray-500"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

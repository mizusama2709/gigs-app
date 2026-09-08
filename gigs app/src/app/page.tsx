import Link from "next/link";
import { GridMark } from "@/components/GridMark";

export default function Home() {
  return (
    <main className="max-w-sm sm:max-w-md mx-auto p-6 pt-10">
      <div
        className="relative overflow-hidden rounded-2xl px-7 py-10 mb-7"
        style={{ background: "linear-gradient(135deg, #141414, #3a3226)" }}
      >
        <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none">
          <defs>
            <pattern id="grid-dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1.2" cy="1.2" r="1.4" fill="rgba(201,162,39,.4)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-dots)" />
        </svg>
        <div className="relative flex flex-col items-center text-center gap-3">
          <GridMark size={44} stroke="#C9A227" />
          <div className="text-[30px] font-bold tracking-tight text-[#F7F4EC]">Grid</div>
          <p className="text-[13.5px] text-[#F7F4EC]/70">
            Find local creative talent, or book your next gig in Hyderabad.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href="/signup"
          className="bg-accent text-accent-foreground rounded-full min-h-[54px] flex items-center justify-center font-semibold text-[15px]"
        >
          Sign up
        </Link>
        <Link
          href="/login"
          className="bg-surface border border-ink/15 rounded-full min-h-[50px] flex items-center justify-center font-semibold text-[14px]"
        >
          Log in
        </Link>
        <Link
          href="/explore"
          className="text-center font-semibold text-[13px] text-ink/70 mt-1"
        >
          Explore freelancers →
        </Link>
      </div>
    </main>
  );
}

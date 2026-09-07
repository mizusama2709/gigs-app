import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-sm sm:max-w-md mx-auto p-6 pt-10">
      <div className="w-14 h-14 bg-accent border-[3.5px] border-ink rounded-2xl shadow-[4px_4px_0_var(--ink)] flex items-center justify-center mb-5">
        <svg width="30" height="30" viewBox="0 0 56 56">
          <rect x="4" y="4" width="48" height="48" rx="6" fill="none" stroke="var(--ink)" strokeWidth="3" />
          <line x1="4" y1="20.6" x2="52" y2="20.6" stroke="var(--ink)" strokeWidth="1.6" />
          <line x1="4" y1="37.3" x2="52" y2="37.3" stroke="var(--ink)" strokeWidth="1.6" />
          <line x1="20.6" y1="4" x2="20.6" y2="52" stroke="var(--ink)" strokeWidth="1.6" />
          <line x1="37.3" y1="4" x2="37.3" y2="52" stroke="var(--ink)" strokeWidth="1.6" />
          <circle cx="37.3" cy="20.6" r="4" fill="var(--ink)" />
        </svg>
      </div>

      <h1 className="font-display text-[28px] font-bold leading-tight tracking-tight mb-1.5">
        Grid
      </h1>
      <p className="text-[13.5px] text-muted mb-7">
        Find local creative talent, or book your next gig.
      </p>

      <div className="flex flex-col gap-3">
        <Link
          href="/signup"
          className="bg-accent border-[3.5px] border-ink rounded-full shadow-[5px_5px_0_var(--ink)] min-h-[54px] flex items-center justify-center font-display font-bold text-[15px]"
        >
          Sign up
        </Link>
        <Link
          href="/login"
          className="bg-surface border-[3px] border-ink rounded-full min-h-[50px] flex items-center justify-center font-display font-bold text-[14px]"
        >
          Log in
        </Link>
        <Link
          href="/explore"
          className="text-center font-display font-semibold text-[13px] text-ink/70 mt-1"
        >
          Explore freelancers →
        </Link>
      </div>
    </main>
  );
}

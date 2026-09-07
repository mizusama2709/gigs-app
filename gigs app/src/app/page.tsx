import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-sm sm:max-w-md mx-auto p-6 pt-10">
      <div className="w-14 h-14 bg-accent border-[3.5px] border-ink rounded-2xl shadow-[4px_4px_0_var(--ink)] flex items-center justify-center mb-5">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.4">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      </div>

      <h1 className="font-display text-[28px] font-bold leading-tight tracking-tight mb-1.5">
        Hyderabad Freelance Marketplace
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

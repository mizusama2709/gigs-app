import Link from "next/link";
import { signup } from "./actions";
import { PasswordInput } from "@/components/PasswordInput";

export default function SignupPage() {
  return (
    <main className="max-w-sm sm:max-w-md mx-auto p-6 pt-10">
      <div className="w-14 h-14 bg-accent border-[3.5px] border-ink rounded-2xl shadow-[4px_4px_0_var(--ink)] flex items-center justify-center mb-5">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.4">
          <circle cx="12" cy="8" r="3.5" />
          <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" />
          <path d="M19 8v4M17 10h4" />
        </svg>
      </div>

      <h1 className="font-display text-[28px] font-bold leading-tight tracking-tight mb-1.5">Create your account</h1>
      <p className="text-[13.5px] text-muted mb-7">Join Hyderabad&apos;s creative marketplace as a freelancer or client.</p>

      <form action={signup} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11.5px] font-bold">Name</span>
          <input
            name="name"
            required
            className="w-full bg-surface border-[3px] border-ink rounded-full px-[18px] py-[13px] shadow-[4px_4px_0_var(--ink)] text-[13.5px]"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11.5px] font-bold">Email</span>
          <input
            name="email"
            type="email"
            required
            className="w-full bg-surface border-[3px] border-ink rounded-full px-[18px] py-[13px] shadow-[4px_4px_0_var(--ink)] text-[13.5px]"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11.5px] font-bold">Password</span>
          <PasswordInput name="password" required minLength={8} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11.5px] font-bold">Phone (optional)</span>
          <input
            name="phone"
            className="w-full bg-surface border-[3px] border-ink rounded-full px-[18px] py-[13px] shadow-[4px_4px_0_var(--ink)] text-[13.5px]"
          />
        </label>

        <fieldset>
          <legend className="font-display text-[11.5px] font-bold mb-1.5">I am a</legend>
          <div className="flex gap-2.5">
            <label className="flex-1 flex items-center justify-center border-[3px] border-ink rounded-full min-h-[44px] font-display text-[13px] font-bold cursor-pointer has-[:checked]:bg-ink has-[:checked]:text-surface">
              <input type="radio" name="role" value="freelancer" required className="sr-only" />
              Freelancer
            </label>
            <label className="flex-1 flex items-center justify-center border-[3px] border-ink rounded-full min-h-[44px] font-display text-[13px] font-bold cursor-pointer has-[:checked]:bg-ink has-[:checked]:text-surface">
              <input type="radio" name="role" value="client" className="sr-only" />
              Client
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          className="mt-2 bg-accent border-[3.5px] border-ink rounded-full shadow-[5px_5px_0_var(--ink)] h-[54px] font-display font-bold text-[15px]"
        >
          Create account
        </button>
      </form>

      <p className="text-center text-[13px] text-ink/70 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-ink">
          Log in
        </Link>
      </p>
    </main>
  );
}

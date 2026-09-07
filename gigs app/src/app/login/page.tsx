import Link from "next/link";
import { signIn } from "@/auth";
import { PasswordInput } from "@/components/PasswordInput";

export default function LoginPage() {
  return (
    <main className="max-w-sm sm:max-w-md mx-auto p-6 pt-10">
      <div className="w-14 h-14 bg-accent border-[3.5px] border-ink rounded-2xl shadow-[4px_4px_0_var(--ink)] flex items-center justify-center mb-5">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.4">
          <circle cx="12" cy="8" r="3.5" />
          <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" />
        </svg>
      </div>

      <h1 className="font-display text-[28px] font-bold leading-tight tracking-tight mb-1.5">Welcome back</h1>
      <p className="text-[13.5px] text-muted mb-7">Log in to book or find your next gig in Hyderabad.</p>

      <form
        action={async (formData) => {
          "use server";
          await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirectTo: "/dashboard",
          });
        }}
        className="flex flex-col gap-4"
      >
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
          <PasswordInput name="password" required />
        </label>

        <button
          type="submit"
          className="mt-2 bg-accent border-[3.5px] border-ink rounded-full shadow-[5px_5px_0_var(--ink)] h-[54px] font-display font-bold text-[15px]"
        >
          Log in
        </button>
      </form>

      <p className="text-center text-[13px] text-ink/70 mt-6">
        New here?{" "}
        <Link href="/signup" className="font-bold text-ink">
          Sign up
        </Link>
      </p>
    </main>
  );
}

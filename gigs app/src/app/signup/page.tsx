import Link from "next/link";
import { signup } from "./actions";
import { PasswordInput } from "@/components/PasswordInput";
import { GridMark } from "@/components/GridMark";

export default function SignupPage() {
  return (
    <main className="max-w-sm sm:max-w-md mx-auto p-6 pt-10">
      <div className="w-14 h-14 border border-ink/15 rounded-xl flex items-center justify-center mb-5">
        <GridMark size={26} />
      </div>

      <h1 className="text-[28px] font-bold leading-tight tracking-tight mb-1.5">Create your account</h1>
      <p className="text-[13.5px] text-muted mb-7">Join Hyderabad&apos;s creative marketplace as a freelancer or client.</p>

      <form action={signup} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11.5px] font-semibold">Name</span>
          <input
            name="name"
            required
            className="w-full bg-surface border border-ink/15 rounded-full px-[18px] py-[13px] shadow-sm text-[13.5px]"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11.5px] font-semibold">Email</span>
          <input
            name="email"
            type="email"
            required
            className="w-full bg-surface border border-ink/15 rounded-full px-[18px] py-[13px] shadow-sm text-[13.5px]"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11.5px] font-semibold">Password</span>
          <PasswordInput name="password" required minLength={8} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11.5px] font-semibold">Phone (optional)</span>
          <input
            name="phone"
            className="w-full bg-surface border border-ink/15 rounded-full px-[18px] py-[13px] shadow-sm text-[13.5px]"
          />
        </label>

        <fieldset>
          <legend className="text-[11.5px] font-semibold mb-1.5">I am a</legend>
          <div className="flex gap-2.5">
            <label className="flex-1 flex items-center justify-center border border-ink/15 rounded-full min-h-[44px] text-[13px] font-medium cursor-pointer has-[:checked]:bg-ink has-[:checked]:text-surface has-[:checked]:border-ink">
              <input type="radio" name="role" value="freelancer" required className="sr-only" />
              Freelancer
            </label>
            <label className="flex-1 flex items-center justify-center border border-ink/15 rounded-full min-h-[44px] text-[13px] font-medium cursor-pointer has-[:checked]:bg-ink has-[:checked]:text-surface has-[:checked]:border-ink">
              <input type="radio" name="role" value="client" className="sr-only" />
              Client
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          className="mt-2 bg-accent text-accent-foreground rounded-full h-[54px] font-semibold text-[15px]"
        >
          Create account
        </button>
      </form>

      <p className="text-center text-[13px] text-ink/70 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-ink">
          Log in
        </Link>
      </p>
    </main>
  );
}

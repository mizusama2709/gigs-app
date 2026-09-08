import Link from "next/link";
import { signIn } from "@/auth";
import { PasswordInput } from "@/components/PasswordInput";
import { GridMark } from "@/components/GridMark";

export default function LoginPage() {
  return (
    <main className="max-w-sm sm:max-w-md mx-auto p-6 pt-10">
      <div className="w-14 h-14 border border-ink/15 rounded-xl flex items-center justify-center mb-5">
        <GridMark size={26} />
      </div>

      <h1 className="text-[28px] font-bold leading-tight tracking-tight mb-1.5">Welcome back</h1>
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
          <PasswordInput name="password" required />
        </label>

        <button
          type="submit"
          className="mt-2 bg-accent text-accent-foreground rounded-full h-[54px] font-semibold text-[15px]"
        >
          Log in
        </button>
      </form>

      <p className="text-center text-[13px] text-ink/70 mt-6">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-ink">
          Sign up
        </Link>
      </p>
    </main>
  );
}

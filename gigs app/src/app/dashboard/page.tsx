import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <main className="max-w-sm mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">
        Welcome, {session.user.name} ({session.user.role})
      </h1>
      {session.user.role === "freelancer" && (
        <Link
          href="/profile/edit"
          className="border p-2 min-h-[44px] flex items-center justify-center mb-3"
        >
          Edit profile
        </Link>
      )}
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button type="submit" className="border p-2 min-h-[44px] w-full">
          Log out
        </button>
      </form>
    </main>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-sm mx-auto p-8">
      <h1 className="text-xl font-semibold mb-4">Creative Freelance Marketplace</h1>
      <div className="flex flex-col gap-3">
        <Link href="/explore" className="border p-2 min-h-[44px] flex items-center justify-center">
          Explore freelancers
        </Link>
        <Link href="/signup" className="border p-2 min-h-[44px] flex items-center justify-center">
          Sign up
        </Link>
        <Link href="/login" className="border p-2 min-h-[44px] flex items-center justify-center">
          Log in
        </Link>
      </div>
    </main>
  );
}

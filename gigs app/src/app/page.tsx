import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-sm mx-auto p-8">
      <h1 className="text-xl font-semibold mb-4">Creative Freelance Marketplace</h1>
      <div className="flex gap-4">
        <Link href="/signup" className="border p-2">
          Sign up
        </Link>
        <Link href="/login" className="border p-2">
          Log in
        </Link>
      </div>
    </main>
  );
}

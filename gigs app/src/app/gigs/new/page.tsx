import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CATEGORIES } from "@/lib/categories";
import { createGig } from "./actions";

export default async function NewGigPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "freelancer") redirect("/explore");

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">List a gig</h1>
      <form action={createGig} className="flex flex-col gap-3">
        <input
          name="title"
          placeholder="Title"
          required
          className="border rounded-lg p-2 min-h-[44px]"
        />
        <textarea
          name="description"
          placeholder="Description"
          required
          rows={5}
          className="border rounded-lg p-2"
        />
        <select name="category" required className="border rounded-lg p-2 min-h-[44px] capitalize">
          <option value="">Select category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="capitalize">
              {c}
            </option>
          ))}
        </select>
        <div className="flex gap-3">
          <input
            name="rate"
            type="number"
            placeholder="Rate (₹)"
            required
            className="border rounded-lg p-2 min-h-[44px] w-1/2"
          />
          <select name="rate_type" required className="border rounded-lg p-2 min-h-[44px] w-1/2">
            <option value="">Rate type</option>
            <option value="fixed">Fixed</option>
            <option value="hourly">Hourly</option>
            <option value="per-day">Per day</option>
          </select>
        </div>
        <button type="submit" className="border rounded-lg p-2 min-h-[44px] font-semibold">
          List gig
        </button>
      </form>
    </main>
  );
}

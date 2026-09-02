import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CATEGORIES } from "@/lib/categories";
import { postJob } from "./actions";

export default async function NewJobPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "client") redirect("/jobs");

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Post a job</h1>
      <form action={postJob} className="flex flex-col gap-3">
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
            name="budget_min"
            type="number"
            placeholder="Budget min"
            className="border rounded-lg p-2 min-h-[44px] w-1/2"
          />
          <input
            name="budget_max"
            type="number"
            placeholder="Budget max"
            className="border rounded-lg p-2 min-h-[44px] w-1/2"
          />
        </div>
        <input
          name="timeline"
          placeholder="Timeline (e.g. 2 weeks)"
          className="border rounded-lg p-2 min-h-[44px]"
        />
        <button type="submit" className="border rounded-lg p-2 min-h-[44px] font-semibold">
          Post job
        </button>
      </form>
    </main>
  );
}

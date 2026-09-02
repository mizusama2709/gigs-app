import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";

type JobRow = {
  id: string;
  title: string;
  category: string;
  budget_min: number | null;
  budget_max: number | null;
  timeline: string | null;
};

function budgetLabel(job: JobRow) {
  if (job.budget_min && job.budget_max) return `₹${job.budget_min} - ₹${job.budget_max}`;
  if (job.budget_min) return `From ₹${job.budget_min}`;
  if (job.budget_max) return `Up to ₹${job.budget_max}`;
  return null;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  let query = supabase
    .from("jobs")
    .select("id, title, category, budget_min, budget_max, timeline")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (category) query = query.eq("category", category);

  const { data: jobs } = await query;

  return (
    <main className="max-w-md mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Jobs</h1>
        <Link
          href="/jobs/new"
          className="text-sm border rounded-lg px-3 min-h-[44px] flex items-center"
        >
          Post a job
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4">
        <Link
          href="/jobs"
          className={`shrink-0 rounded-full border px-3 min-h-[44px] flex items-center text-sm ${
            !category ? "font-semibold" : "text-gray-500"
          }`}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/jobs?category=${c}`}
            className={`shrink-0 rounded-full border px-3 min-h-[44px] flex items-center text-sm capitalize ${
              category === c ? "font-semibold" : "text-gray-500"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {(jobs as JobRow[] | null)?.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className="border rounded-lg p-3 min-h-[44px]"
          >
            <div className="font-medium">{job.title}</div>
            <div className="text-sm text-gray-500 capitalize">{job.category}</div>
            <div className="text-sm text-gray-500">
              {[budgetLabel(job), job.timeline].filter(Boolean).join(" · ")}
            </div>
          </Link>
        ))}
        {jobs?.length === 0 && (
          <p className="text-sm text-gray-500">No open jobs in this category.</p>
        )}
      </div>
    </main>
  );
}

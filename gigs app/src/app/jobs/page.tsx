import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";
import { budgetLabel } from "@/lib/format";

type JobRow = {
  id: string;
  title: string;
  category: string;
  budget_min: number | null;
  budget_max: number | null;
  timeline: string | null;
};

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
          className="text-sm bg-accent text-accent-foreground rounded-full px-4 min-h-[44px] flex items-center font-medium"
        >
          Post a job
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4">
        <Link
          href="/jobs"
          className={`shrink-0 rounded-full px-4 min-h-[44px] flex items-center text-sm font-medium ${
            !category ? "bg-accent text-accent-foreground" : "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400"
          }`}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/jobs?category=${c}`}
            className={`shrink-0 rounded-full px-4 min-h-[44px] flex items-center text-sm font-medium capitalize ${
              category === c ? "bg-accent text-accent-foreground" : "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400"
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
            className="rounded-xl shadow-sm bg-surface p-4"
          >
            <div className="font-medium mb-1">{job.title}</div>
            <span className="inline-block rounded-full bg-accent/10 text-accent text-xs font-medium px-2 py-0.5 capitalize mb-2">
              {job.category}
            </span>
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

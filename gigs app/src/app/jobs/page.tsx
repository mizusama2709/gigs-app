import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { CATEGORIES, categoryColor } from "@/lib/categories";
import { budgetLabel } from "@/lib/format";
import { Card, CategoryBadge } from "@/components/Card";

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
    <main className="max-w-md sm:max-w-xl lg:max-w-3xl mx-auto p-4 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[28px] font-bold tracking-tight leading-none">Jobs</h1>
        <Link
          href="/jobs/new"
          className="flex items-center gap-1.5 bg-accent text-accent-foreground rounded-full px-3.5 min-h-[40px] text-xs font-semibold"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Post
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 -mx-4 px-4">
        <Link
          href="/jobs"
          className={`shrink-0 rounded-full px-4 min-h-[40px] flex items-center text-xs font-semibold border border-ink/15 ${
            !category ? "bg-ink text-surface border-ink" : "bg-surface text-ink"
          }`}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/jobs?category=${c}`}
            className={`shrink-0 rounded-full px-4 min-h-[40px] flex items-center text-xs font-semibold capitalize border border-ink/15 ${
              category === c ? "bg-ink text-surface border-ink" : "bg-surface text-ink"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-3.5">
        {(jobs as JobRow[] | null)?.map((job) => {
          const color = categoryColor(job.category);
          return (
            <Card key={job.id} href={`/jobs/${job.id}`} accentColor={color.bg} className="p-3.5">
              <div className="font-semibold text-[14.5px] mb-1.5">{job.title}</div>
              <CategoryBadge category={job.category} bg={color.bg} text={color.text} className="mb-2" />
              <div className="text-xs text-muted">
                {[budgetLabel(job), job.timeline].filter(Boolean).join(" · ")}
              </div>
            </Card>
          );
        })}
        {jobs?.length === 0 && (
          <p className="text-sm text-muted">No open jobs in this category.</p>
        )}
      </div>
    </main>
  );
}

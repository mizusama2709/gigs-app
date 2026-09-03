export function firstOf<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export function budgetLabel(job: { budget_min: number | null; budget_max: number | null }) {
  if (job.budget_min && job.budget_max) return `₹${job.budget_min} - ₹${job.budget_max}`;
  if (job.budget_min) return `From ₹${job.budget_min}`;
  if (job.budget_max) return `Up to ₹${job.budget_max}`;
  return null;
}

const STATUS_COLORS: Record<string, string> = {
  open: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  requested: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-400",
  accepted: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  confirmed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  rejected: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-400",
  declined: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-400",
  closed: "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400",
};

export function statusColor(status: string) {
  return STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400";
}

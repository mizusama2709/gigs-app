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
  open: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  requested: "bg-sky-100 text-sky-800",
  accepted: "bg-emerald-100 text-emerald-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
  declined: "bg-rose-100 text-rose-800",
  closed: "bg-gray-200 text-gray-600",
};

export function statusColor(status: string) {
  return STATUS_COLORS[status] ?? "bg-gray-200 text-gray-600";
}

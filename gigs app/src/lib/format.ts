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

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { CATEGORIES, categoryColor } from "@/lib/categories";
import { firstOf } from "@/lib/format";
import { BrutalCard } from "@/components/BrutalCard";

type FreelancerRow = {
  user_id: string;
  categories: string[];
  location: string | null;
  avatar_url: string | null;
  portfolio_links: string[];
  users: { name: string } | { name: string }[] | null;
};

function nameOf(row: FreelancerRow) {
  return firstOf(row.users)?.name ?? "Freelancer";
}

function coverImage(row: FreelancerRow) {
  return row.portfolio_links?.[0] ?? row.avatar_url ?? null;
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  let query = supabase
    .from("freelancer_profiles")
    .select("user_id, categories, location, avatar_url, portfolio_links, users(name)");

  if (category) query = query.contains("categories", [category]);

  const { data: freelancers } = await query;

  return (
    <main className="max-w-md mx-auto p-4 pt-6">
      <h1 className="font-display text-[28px] font-bold tracking-tight leading-none">Explore</h1>
      <p className="text-[13px] text-muted mt-1 mb-4">Creative freelancers in Hyderabad</p>

      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 -mx-4 px-4">
        <Link
          href="/explore"
          className={`shrink-0 rounded-full px-4 min-h-[40px] flex items-center font-display text-xs font-bold border-[3px] border-ink ${
            !category ? "bg-ink text-surface" : "bg-surface text-ink"
          }`}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/explore?category=${c}`}
            className={`shrink-0 rounded-full px-4 min-h-[40px] flex items-center font-display text-xs font-bold capitalize border-[3px] border-ink ${
              category === c ? "bg-ink text-surface" : "bg-surface text-ink"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {(freelancers as FreelancerRow[] | null)?.map((f) => {
          const image = coverImage(f);
          const color = categoryColor(f.categories?.[0]);
          return (
            <BrutalCard key={f.user_id} href={`/freelancer/${f.user_id}`} tabColor={color.bg} tabWidth={70} className="p-2">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt={nameOf(f)} loading="lazy" className="w-full h-[130px] object-cover rounded-xl" />
              ) : (
                <div className="w-full h-[130px] rounded-xl bg-background flex items-center justify-center text-3xl font-display font-bold text-muted">
                  {nameOf(f).charAt(0).toUpperCase()}
                </div>
              )}
              <div className="font-display font-bold text-[13px] mt-2">{nameOf(f)}</div>
              {f.location && (
                <div className="flex items-center gap-1.5 mt-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.5">
                    <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21z" />
                    <circle cx="12" cy="9.5" r="2.3" />
                  </svg>
                  <span className="text-[10.5px] text-muted truncate">{f.location}</span>
                </div>
              )}
            </BrutalCard>
          );
        })}
      </div>
      {freelancers?.length === 0 && (
        <p className="text-sm text-muted">No freelancers yet in this category.</p>
      )}
    </main>
  );
}

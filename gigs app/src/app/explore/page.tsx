import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";
import { firstOf } from "@/lib/format";

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
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Explore</h1>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4">
        <Link
          href="/explore"
          className={`shrink-0 rounded-full px-4 min-h-[44px] flex items-center text-sm font-medium ${
            !category ? "bg-accent text-accent-foreground" : "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400"
          }`}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/explore?category=${c}`}
            className={`shrink-0 rounded-full px-4 min-h-[44px] flex items-center text-sm font-medium capitalize ${
              category === c ? "bg-accent text-accent-foreground" : "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="columns-2 gap-3">
        {(freelancers as FreelancerRow[] | null)?.map((f) => {
          const image = coverImage(f);
          return (
            <Link
              key={f.user_id}
              href={`/freelancer/${f.user_id}`}
              className="block break-inside-avoid mb-3 relative rounded-xl overflow-hidden shadow-sm bg-gray-100 dark:bg-neutral-800"
            >
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt={nameOf(f)} loading="lazy" className="w-full h-auto block" />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center text-3xl font-semibold text-gray-400">
                  {nameOf(f).charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-3 pt-8 bg-gradient-to-t from-black/70 to-transparent">
                <div className="text-white text-sm font-medium truncate">{nameOf(f)}</div>
                {f.location && <div className="text-white/80 text-xs truncate">{f.location}</div>}
              </div>
            </Link>
          );
        })}
      </div>
      {freelancers?.length === 0 && (
        <p className="text-sm text-gray-500">No freelancers yet in this category.</p>
      )}
    </main>
  );
}

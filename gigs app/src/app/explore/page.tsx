import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";

type FreelancerRow = {
  user_id: string;
  bio: string | null;
  categories: string[];
  location: string | null;
  avatar_url: string | null;
  users: { name: string } | { name: string }[] | null;
};

function nameOf(row: FreelancerRow) {
  const u = row.users;
  if (!u) return "Freelancer";
  return Array.isArray(u) ? u[0]?.name ?? "Freelancer" : u.name;
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  let query = supabase
    .from("freelancer_profiles")
    .select("user_id, bio, categories, location, avatar_url, users(name)");

  if (category) query = query.contains("categories", [category]);

  const { data: freelancers } = await query;

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Explore</h1>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4">
        <Link
          href="/explore"
          className={`shrink-0 rounded-full border px-3 min-h-[44px] flex items-center text-sm ${
            !category ? "font-semibold" : "text-gray-500"
          }`}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/explore?category=${c}`}
            className={`shrink-0 rounded-full border px-3 min-h-[44px] flex items-center text-sm capitalize ${
              category === c ? "font-semibold" : "text-gray-500"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {(freelancers as FreelancerRow[] | null)?.map((f) => (
          <Link
            key={f.user_id}
            href={`/freelancer/${f.user_id}`}
            className="border rounded-lg p-3 flex gap-3 items-center"
          >
            {f.avatar_url ? (
              <Image
                src={f.avatar_url}
                alt={nameOf(f)}
                width={56}
                height={56}
                className="rounded-full object-cover w-14 h-14 shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-200 shrink-0" />
            )}
            <div className="min-w-0">
              <div className="font-medium">{nameOf(f)}</div>
              {f.location && <div className="text-sm text-gray-500">{f.location}</div>}
              {f.categories?.length > 0 && (
                <div className="text-sm text-gray-500 truncate capitalize">
                  {f.categories.join(", ")}
                </div>
              )}
            </div>
          </Link>
        ))}
        {freelancers?.length === 0 && (
          <p className="text-sm text-gray-500">No freelancers yet in this category.</p>
        )}
      </div>
    </main>
  );
}

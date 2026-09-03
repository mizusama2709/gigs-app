import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { firstOf } from "@/lib/format";
import { deleteGig } from "@/app/gigs/[id]/actions";

function rateLabel(gig: { rate: number; rate_type: string }) {
  const suffix = gig.rate_type === "hourly" ? "/hr" : gig.rate_type === "per-day" ? "/day" : "";
  return `₹${gig.rate}${suffix}`;
}

export default async function FreelancerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const isOwner = session?.user?.id === id;

  const { data: profile } = await supabase
    .from("freelancer_profiles")
    .select("user_id, bio, categories, location, portfolio_links, avatar_url, users(name, email)")
    .eq("user_id", id)
    .single();

  if (!profile) notFound();

  const { data: gigs } = await supabase
    .from("gigs")
    .select("id, title, category, rate, rate_type")
    .eq("freelancer_id", id)
    .order("created_at", { ascending: false });

  const user = firstOf(profile.users);
  const name = user?.name ?? "Freelancer";
  const email = user?.email;

  return (
    <main className={`max-w-md mx-auto p-4 ${!isOwner ? "pb-28" : ""}`}>
      {profile.portfolio_links?.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4 -mx-4 px-4">
          {profile.portfolio_links.map((url: string) => (
            <div key={url} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800">
              <Image src={url} alt="Portfolio item" fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={name}
            width={64}
            height={64}
            className="rounded-full object-cover w-16 h-16 shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-neutral-800 shrink-0 flex items-center justify-center text-xl font-semibold text-gray-400">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-semibold truncate">{name}</h1>
          {profile.location && <p className="text-sm text-gray-500">{profile.location}</p>}
        </div>
      </div>

      {profile.bio && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{profile.bio}</p>}

      {profile.categories?.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {profile.categories.map((c: string) => (
            <span
              key={c}
              className="rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 px-3 py-1 text-xs font-medium capitalize"
            >
              {c}
            </span>
          ))}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-medium">Gigs</h2>
          {isOwner && (
            <Link href="/gigs/new" className="text-sm bg-gray-100 dark:bg-neutral-800 rounded-lg px-3 min-h-[44px] flex items-center font-medium">
              Add gig
            </Link>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {gigs?.map((gig) => (
            <div key={gig.id} className="rounded-xl shadow-sm bg-surface p-3">
              <Link href={`/gigs/${gig.id}`} className="block">
                <div className="font-medium">{gig.title}</div>
                <div className="text-sm text-gray-500 capitalize">{gig.category}</div>
                <div className="text-sm text-accent font-medium">{rateLabel(gig)}</div>
              </Link>
              {isOwner && (
                <div className="flex gap-2 mt-3">
                  <Link
                    href={`/gigs/${gig.id}/edit`}
                    className="bg-gray-100 dark:bg-neutral-800 rounded-lg px-3 min-h-[44px] flex items-center text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <form action={deleteGig.bind(null, gig.id)}>
                    <button className="bg-gray-100 dark:bg-neutral-800 rounded-lg px-3 min-h-[44px] text-sm font-medium">Delete</button>
                  </form>
                </div>
              )}
            </div>
          ))}
          {gigs?.length === 0 && <p className="text-sm text-gray-500">No gigs listed yet.</p>}
        </div>
      </div>

      {!isOwner && (
        <div className="fixed inset-x-0 bottom-16 z-10 p-3 bg-surface shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          <a
            href={`mailto:${email ?? ""}?subject=Booking inquiry for ${name}`}
            className="max-w-md mx-auto block text-center bg-accent text-accent-foreground rounded-xl min-h-[44px] flex items-center justify-center font-semibold"
          >
            Contact
          </a>
        </div>
      )}
    </main>
  );
}

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { firstOf } from "@/lib/format";
import { categoryColor } from "@/lib/categories";
import { BrutalCard, CategoryBadge } from "@/components/BrutalCard";
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
  const minRate = gigs?.reduce<number | null>(
    (min, g) => (min === null || g.rate < min ? g.rate : min),
    null
  );

  return (
    <main className={`max-w-md sm:max-w-xl lg:max-w-3xl mx-auto p-4 pt-6 ${!isOwner ? "pb-28" : ""}`}>
      {profile.portfolio_links?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-5">
          {profile.portfolio_links.map((url: string) => (
            <div key={url} className="relative aspect-square rounded-xl overflow-hidden border-[3px] border-ink bg-background">
              <Image src={url} alt="Portfolio item" fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mb-3.5">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={name}
            width={60}
            height={60}
            className="rounded-full object-cover w-[60px] h-[60px] shrink-0 border-[3px] border-ink"
          />
        ) : (
          <div className="w-[60px] h-[60px] rounded-full bg-background border-[3px] border-ink shrink-0 flex items-center justify-center text-xl font-display font-bold text-muted">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="font-display text-[21px] font-bold truncate">{name}</h1>
          {profile.location && <p className="text-[12.5px] text-muted">{profile.location}</p>}
        </div>
      </div>

      {profile.categories?.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-3.5">
          {profile.categories.map((c: string) => {
            const color = categoryColor(c);
            return <CategoryBadge key={c} category={c} bg={color.bg} text={color.text} />;
          })}
        </div>
      )}

      {profile.bio && <p className="text-[13px] leading-relaxed text-ink/80 mb-5">{profile.bio}</p>}

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="font-display font-bold text-[15px]">Gigs</h2>
          {isOwner && (
            <Link
              href="/gigs/new"
              className="text-xs font-display font-bold bg-surface border-[3px] border-ink rounded-full px-3.5 min-h-[36px] flex items-center shadow-[3px_3px_0_var(--ink)]"
            >
              Add gig
            </Link>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {gigs?.map((gig) => {
            const color = categoryColor(gig.category);
            return (
              <BrutalCard key={gig.id} tabColor={color.bg} tabWidth={100} className="p-3.5">
                <Link href={`/gigs/${gig.id}`} className="block">
                  <div className="font-display font-bold text-[14px]">{gig.title}</div>
                  <div className="text-[11.5px] text-muted capitalize my-0.5">{gig.category}</div>
                  <div className="font-display font-bold text-[14px]">{rateLabel(gig)}</div>
                </Link>
                {isOwner && (
                  <div className="flex gap-2 mt-3">
                    <Link
                      href={`/gigs/${gig.id}/edit`}
                      className="bg-background border-2 border-ink rounded-lg px-3 min-h-[40px] flex items-center text-xs font-display font-bold"
                    >
                      Edit
                    </Link>
                    <form action={deleteGig.bind(null, gig.id)}>
                      <button className="bg-background border-2 border-ink rounded-lg px-3 min-h-[40px] text-xs font-display font-bold">Delete</button>
                    </form>
                  </div>
                )}
              </BrutalCard>
            );
          })}
          {gigs?.length === 0 && <p className="text-sm text-muted">No gigs listed yet.</p>}
        </div>
      </div>

      {!isOwner && (
        <div className="fixed inset-x-0 bottom-16 lg:bottom-0 lg:left-24 z-10 p-3.5 bg-surface border-t-[3.5px] border-ink">
          <a
            href={`mailto:${email ?? ""}?subject=Booking inquiry for ${name}`}
            className="max-w-md sm:max-w-xl lg:max-w-3xl mx-auto block text-center bg-accent border-[3.5px] border-ink rounded-2xl shadow-[5px_5px_0_var(--ink)] min-h-[52px] flex items-center justify-center font-display font-bold text-[15px]"
          >
            Contact{minRate != null ? ` · from ₹${minRate}` : ""}
          </a>
        </div>
      )}
    </main>
  );
}

import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { firstOf } from "@/lib/format";

export default async function FreelancerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: profile } = await supabase
    .from("freelancer_profiles")
    .select("user_id, bio, categories, location, portfolio_links, avatar_url, users(name, email)")
    .eq("user_id", id)
    .single();

  if (!profile) notFound();

  const user = firstOf(profile.users);
  const name = user?.name ?? "Freelancer";
  const email = user?.email;

  return (
    <main className="max-w-md mx-auto p-4">
      <div className="flex items-center gap-3 mb-4">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={name}
            width={72}
            height={72}
            className="rounded-full object-cover w-18 h-18 shrink-0"
          />
        ) : (
          <div className="w-18 h-18 rounded-full bg-gray-200 shrink-0" />
        )}
        <div>
          <h1 className="text-xl font-semibold">{name}</h1>
          {profile.location && <p className="text-sm text-gray-500">{profile.location}</p>}
        </div>
      </div>

      {profile.categories?.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {profile.categories.map((c: string) => (
            <span
              key={c}
              className="shrink-0 rounded-full border px-3 py-1 text-sm capitalize"
            >
              {c}
            </span>
          ))}
        </div>
      )}

      {profile.bio && <p className="mb-6">{profile.bio}</p>}

      {profile.portfolio_links?.length > 0 && (
        <div>
          <h2 className="font-medium mb-2">Portfolio</h2>
          <div className="flex flex-col gap-3">
            {profile.portfolio_links.map((url: string) => (
              <Image
                key={url}
                src={url}
                alt="Portfolio item"
                width={400}
                height={300}
                className="w-full h-auto rounded-lg object-cover"
              />
            ))}
          </div>
        </div>
      )}

      <a
        href={`mailto:${email ?? ""}?subject=Booking inquiry for ${name}`}
        className="mt-6 block text-center border rounded-lg min-h-[44px] flex items-center justify-center"
      >
        Contact
      </a>
    </main>
  );
}

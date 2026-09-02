import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";
import { updateProfile } from "./actions";

export default async function EditProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "freelancer") redirect("/dashboard");

  const { data: profile } = await supabaseAdmin
    .from("freelancer_profiles")
    .select("bio, location, avatar_url, categories, portfolio_links")
    .eq("user_id", session.user.id)
    .single();

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Edit profile</h1>
      <form action={updateProfile} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          Bio
          <textarea
            name="bio"
            defaultValue={profile?.bio ?? ""}
            rows={4}
            className="w-full border p-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          Location
          <input
            name="location"
            defaultValue={profile?.location ?? ""}
            placeholder="e.g. Banjara Hills, Hyderabad"
            className="w-full border p-2 min-h-[44px]"
          />
        </label>
        <label className="flex flex-col gap-1">
          Avatar URL
          <input
            name="avatar_url"
            defaultValue={profile?.avatar_url ?? ""}
            className="w-full border p-2 min-h-[44px]"
          />
        </label>
        <label className="flex flex-col gap-1">
          Portfolio links (comma-separated image/video URLs)
          <textarea
            name="portfolio_links"
            defaultValue={(profile?.portfolio_links ?? []).join(", ")}
            rows={3}
            className="w-full border p-2"
          />
        </label>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1">Categories</legend>
          {CATEGORIES.map((c) => (
            <label key={c} className="flex items-center gap-2 capitalize min-h-[44px]">
              <input
                type="checkbox"
                name={`category_${c}`}
                defaultChecked={profile?.categories?.includes(c)}
              />
              {c}
            </label>
          ))}
        </fieldset>
        <button type="submit" className="border p-2 min-h-[44px]">
          Save
        </button>
      </form>
    </main>
  );
}

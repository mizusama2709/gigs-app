import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";
import { updateGig } from "../actions";

export default async function EditGigPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { data: gig } = await supabase
    .from("gigs")
    .select("id, freelancer_id, title, description, category, rate, rate_type")
    .eq("id", id)
    .single();

  if (!gig) notFound();
  if (gig.freelancer_id !== session.user.id) redirect(`/gigs/${id}`);

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Edit gig</h1>
      <form action={updateGig.bind(null, gig.id)} className="flex flex-col gap-3">
        <input
          name="title"
          defaultValue={gig.title}
          required
          className="border rounded-lg p-2 min-h-[44px]"
        />
        <textarea
          name="description"
          defaultValue={gig.description}
          required
          rows={5}
          className="border rounded-lg p-2"
        />
        <select
          name="category"
          required
          defaultValue={gig.category}
          className="border rounded-lg p-2 min-h-[44px] capitalize"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="capitalize">
              {c}
            </option>
          ))}
        </select>
        <div className="flex gap-3">
          <input
            name="rate"
            type="number"
            defaultValue={gig.rate}
            required
            className="border rounded-lg p-2 min-h-[44px] w-1/2"
          />
          <select
            name="rate_type"
            required
            defaultValue={gig.rate_type}
            className="border rounded-lg p-2 min-h-[44px] w-1/2"
          >
            <option value="fixed">Fixed</option>
            <option value="hourly">Hourly</option>
            <option value="per-day">Per day</option>
          </select>
        </div>
        <button type="submit" className="border rounded-lg p-2 min-h-[44px] font-semibold">
          Save
        </button>
      </form>
    </main>
  );
}

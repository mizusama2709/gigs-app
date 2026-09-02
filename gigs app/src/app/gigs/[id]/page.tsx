import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { firstOf } from "@/lib/format";
import { requestBooking, setBookingStatus } from "./actions";

function rateLabel(gig: { rate: number; rate_type: string }) {
  const suffix = gig.rate_type === "hourly" ? "/hr" : gig.rate_type === "per-day" ? "/day" : "";
  return `₹${gig.rate}${suffix}`;
}

export default async function GigDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const { data: gig } = await supabase
    .from("gigs")
    .select("id, freelancer_id, title, description, category, rate, rate_type")
    .eq("id", id)
    .single();

  if (!gig) notFound();

  const isOwner = session?.user?.role === "freelancer" && session.user.id === gig.freelancer_id;
  const isClient = session?.user?.role === "client";

  let myBooking: { status: string } | null = null;
  if (isClient) {
    const { data } = await supabaseAdmin
      .from("bookings")
      .select("status")
      .eq("gig_id", gig.id)
      .eq("client_id", session!.user.id)
      .maybeSingle();
    myBooking = data;
  }

  let requests:
    | { id: string; message: string | null; status: string; users: { name: string } | { name: string }[] | null }[]
    | null = null;
  if (isOwner) {
    const { data } = await supabaseAdmin
      .from("bookings")
      .select("id, message, status, users(name)")
      .eq("gig_id", gig.id)
      .order("created_at", { ascending: false });
    requests = data;
  }

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-1">{gig.title}</h1>
      <div className="text-sm text-gray-500 capitalize mb-3">{gig.category}</div>
      <div className="text-sm text-gray-500 mb-4">{rateLabel(gig)}</div>
      <p className="mb-6 whitespace-pre-wrap">{gig.description}</p>

      {isClient && (
        <div className="border-t pt-4">
          {myBooking ? (
            <p className="text-sm text-gray-500 capitalize">Booking {myBooking.status}</p>
          ) : (
            <form action={requestBooking.bind(null, gig.id)} className="flex flex-col gap-3">
              <textarea
                name="message"
                placeholder="Message (optional)"
                rows={3}
                className="border rounded-lg p-2"
              />
              <button type="submit" className="border rounded-lg p-2 min-h-[44px] font-semibold">
                Request booking
              </button>
            </form>
          )}
        </div>
      )}

      {isOwner && (
        <div className="border-t pt-4">
          <h2 className="font-medium mb-3">Booking requests</h2>
          <div className="flex flex-col gap-3">
            {requests?.map((r) => {
              const u = firstOf(r.users);
              return (
                <div key={r.id} className="border rounded-lg p-3">
                  <div className="font-medium">{u?.name ?? "Client"}</div>
                  {r.message && <p className="text-sm text-gray-500 mt-1">{r.message}</p>}
                  {r.status === "requested" ? (
                    <div className="flex gap-2 mt-3">
                      <form action={setBookingStatus.bind(null, gig.id, r.id, "confirmed")}>
                        <button className="border rounded-lg px-3 min-h-[44px]">Confirm</button>
                      </form>
                      <form action={setBookingStatus.bind(null, gig.id, r.id, "declined")}>
                        <button className="border rounded-lg px-3 min-h-[44px]">Decline</button>
                      </form>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2 capitalize">{r.status}</p>
                  )}
                </div>
              );
            })}
            {requests?.length === 0 && (
              <p className="text-sm text-gray-500">No booking requests yet.</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

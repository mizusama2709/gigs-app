import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { firstOf, statusColor } from "@/lib/format";
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

  const showBookBar = isClient && !myBooking;

  return (
    <main className={`max-w-md mx-auto p-4 ${showBookBar ? "pb-28" : ""}`}>
      <h1 className="text-xl font-semibold mb-2">{gig.title}</h1>
      <span className="inline-block rounded-full bg-accent/10 text-accent text-xs font-medium px-2 py-0.5 capitalize mb-3">
        {gig.category}
      </span>
      <div className="text-lg font-semibold text-accent mb-4">{rateLabel(gig)}</div>
      <p className="mb-6 whitespace-pre-wrap leading-relaxed">{gig.description}</p>

      {isClient && (
        <div>
          {myBooking ? (
            <div className="rounded-xl shadow-sm bg-surface p-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">Your booking</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColor(myBooking.status)}`}>
                {myBooking.status}
              </span>
            </div>
          ) : (
            <form id="book-form" action={requestBooking.bind(null, gig.id)}>
              <textarea
                name="message"
                placeholder="Message (optional)"
                rows={3}
                className="w-full rounded-xl bg-surface shadow-sm p-3"
              />
            </form>
          )}
        </div>
      )}

      {isOwner && (
        <div>
          <h2 className="font-medium mb-3">Booking requests</h2>
          <div className="flex flex-col gap-3">
            {requests?.map((r) => {
              const u = firstOf(r.users);
              return (
                <div key={r.id} className="rounded-xl shadow-sm bg-surface p-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="font-medium">{u?.name ?? "Client"}</div>
                    <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColor(r.status)}`}>
                      {r.status}
                    </span>
                  </div>
                  {r.message && <p className="text-sm text-gray-500 mt-1">{r.message}</p>}
                  {r.status === "requested" && (
                    <div className="flex gap-2 mt-3">
                      <form action={setBookingStatus.bind(null, gig.id, r.id, "confirmed")}>
                        <button className="bg-gray-100 dark:bg-neutral-800 rounded-lg px-3 min-h-[44px] text-sm font-medium">Confirm</button>
                      </form>
                      <form action={setBookingStatus.bind(null, gig.id, r.id, "declined")}>
                        <button className="bg-gray-100 dark:bg-neutral-800 rounded-lg px-3 min-h-[44px] text-sm font-medium">Decline</button>
                      </form>
                    </div>
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

      {showBookBar && (
        <div className="fixed inset-x-0 bottom-16 z-10 p-3 bg-surface shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          <button
            type="submit"
            form="book-form"
            className="max-w-md mx-auto block w-full bg-accent text-accent-foreground rounded-xl min-h-[44px] font-semibold"
          >
            Request booking
          </button>
        </div>
      )}
    </main>
  );
}

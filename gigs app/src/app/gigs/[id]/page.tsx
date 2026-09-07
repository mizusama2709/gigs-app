import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { firstOf, statusColor } from "@/lib/format";
import { categoryColor } from "@/lib/categories";
import { BrutalCard, CategoryBadge } from "@/components/BrutalCard";
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
  const color = categoryColor(gig.category);

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
    <main className={`max-w-md mx-auto p-4 pt-6 ${showBookBar ? "pb-28" : ""}`}>
      <CategoryBadge category={gig.category} bg={color.bg} text={color.text} className="mb-3" />
      <h1 className="font-display text-[22px] font-bold leading-tight mb-2">{gig.title}</h1>
      <div className="font-display text-[19px] font-bold mb-4">{rateLabel(gig)}</div>
      <p className="text-[13.5px] leading-relaxed text-ink/80 mb-5 whitespace-pre-wrap">{gig.description}</p>

      {isClient && (
        <div>
          {myBooking ? (
            <BrutalCard className="p-4 flex justify-between items-center">
              <span className="text-sm text-muted">Your booking</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColor(myBooking.status)}`}>
                {myBooking.status}
              </span>
            </BrutalCard>
          ) : (
            <form id="book-form" action={requestBooking.bind(null, gig.id)}>
              <textarea
                name="message"
                placeholder="Message (optional)"
                rows={3}
                className="w-full rounded-xl border-[3px] border-ink p-3 bg-surface text-sm"
              />
            </form>
          )}
        </div>
      )}

      {isOwner && (
        <div>
          <div className="font-display font-bold text-[15px] mb-2.5">Booking requests</div>
          <div className="flex flex-col gap-3">
            {requests?.map((r) => {
              const u = firstOf(r.users);
              return (
                <BrutalCard key={r.id} className="p-3.5">
                  <div className="flex justify-between items-start gap-2">
                    <div className="font-display font-bold text-[13.5px]">{u?.name ?? "Client"}</div>
                    <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColor(r.status)}`}>
                      {r.status}
                    </span>
                  </div>
                  {r.message && <p className="text-sm text-muted mt-1">{r.message}</p>}
                  {r.status === "requested" && (
                    <div className="flex gap-2 mt-3">
                      <form action={setBookingStatus.bind(null, gig.id, r.id, "confirmed")}>
                        <button className="bg-surface border-[3px] border-ink rounded-lg px-3 min-h-[44px] text-sm font-display font-bold shadow-[3px_3px_0_var(--ink)]">Confirm</button>
                      </form>
                      <form action={setBookingStatus.bind(null, gig.id, r.id, "declined")}>
                        <button className="bg-surface border-[3px] border-ink rounded-lg px-3 min-h-[44px] text-sm font-display font-bold shadow-[3px_3px_0_var(--ink)]">Decline</button>
                      </form>
                    </div>
                  )}
                </BrutalCard>
              );
            })}
            {requests?.length === 0 && (
              <p className="text-sm text-muted">No booking requests yet.</p>
            )}
          </div>
        </div>
      )}

      {showBookBar && (
        <div className="fixed inset-x-0 bottom-16 z-10 p-3.5 bg-surface border-t-[3.5px] border-ink">
          <button
            type="submit"
            form="book-form"
            className="max-w-md mx-auto block w-full bg-accent border-[3.5px] border-ink rounded-2xl shadow-[5px_5px_0_var(--ink)] min-h-[52px] font-display font-bold text-[15px]"
          >
            Request booking
          </button>
        </div>
      )}
    </main>
  );
}

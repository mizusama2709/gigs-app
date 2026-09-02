"use server";

import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";

async function requireOwnedGig(gigId: string, session: Session | null) {
  if (!session?.user || session.user.role !== "freelancer") throw new Error("Not authorized");

  const { data: gig } = await supabaseAdmin
    .from("gigs")
    .select("freelancer_id")
    .eq("id", gigId)
    .single();

  if (!gig || gig.freelancer_id !== session.user.id) throw new Error("Not authorized");
}

export async function updateGig(gigId: string, formData: FormData) {
  const session = await auth();
  await requireOwnedGig(gigId, session);

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const rate = Number(formData.get("rate") ?? 0);
  const rate_type = String(formData.get("rate_type") ?? "");

  if (!title || !description || !category || !rate) throw new Error("Missing required fields");
  if (!["fixed", "hourly", "per-day"].includes(rate_type)) throw new Error("Invalid rate type");

  const { error } = await supabaseAdmin
    .from("gigs")
    .update({ title, description, category, rate, rate_type })
    .eq("id", gigId);

  if (error) throw new Error(error.message);

  redirect(`/gigs/${gigId}`);
}

export async function deleteGig(gigId: string) {
  const session = await auth();
  await requireOwnedGig(gigId, session);

  const { error } = await supabaseAdmin.from("gigs").delete().eq("id", gigId);
  if (error) throw new Error(error.message);

  redirect(`/freelancer/${session!.user.id}`);
}

export async function requestBooking(gigId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "client") {
    throw new Error("Not authorized");
  }

  const { data: existing } = await supabaseAdmin
    .from("bookings")
    .select("id")
    .eq("gig_id", gigId)
    .eq("client_id", session.user.id)
    .maybeSingle();

  if (!existing) {
    const message = String(formData.get("message") ?? "").trim() || null;

    const { error } = await supabaseAdmin.from("bookings").insert({
      gig_id: gigId,
      client_id: session.user.id,
      message,
      status: "requested",
    });

    if (error) throw new Error(error.message);
  }

  revalidatePath(`/gigs/${gigId}`);
}

export async function setBookingStatus(
  gigId: string,
  bookingId: string,
  status: "confirmed" | "declined",
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "freelancer") {
    throw new Error("Not authorized");
  }

  const { data: gig } = await supabaseAdmin
    .from("gigs")
    .select("freelancer_id")
    .eq("id", gigId)
    .single();

  if (!gig || gig.freelancer_id !== session.user.id) throw new Error("Not authorized");

  const { error } = await supabaseAdmin
    .from("bookings")
    .update({ status })
    .eq("id", bookingId)
    .eq("gig_id", gigId);

  if (error) throw new Error(error.message);

  revalidatePath(`/gigs/${gigId}`);
}

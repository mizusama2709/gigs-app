"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function createGig(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "freelancer") {
    throw new Error("Not authorized");
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const rate = Number(formData.get("rate") ?? 0);
  const rate_type = String(formData.get("rate_type") ?? "");

  if (!title || !description || !category || !rate) throw new Error("Missing required fields");
  if (!["fixed", "hourly", "per-day"].includes(rate_type)) throw new Error("Invalid rate type");

  const { data, error } = await supabaseAdmin
    .from("gigs")
    .insert({
      freelancer_id: session.user.id,
      title,
      description,
      category,
      rate,
      rate_type,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  redirect(`/gigs/${data.id}`);
}

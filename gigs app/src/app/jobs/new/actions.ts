"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function postJob(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "client") {
    throw new Error("Not authorized");
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const budget_min = formData.get("budget_min") ? Number(formData.get("budget_min")) : null;
  const budget_max = formData.get("budget_max") ? Number(formData.get("budget_max")) : null;
  const timeline = String(formData.get("timeline") ?? "").trim() || null;

  if (!title || !description || !category) throw new Error("Missing required fields");

  const { data, error } = await supabaseAdmin
    .from("jobs")
    .insert({
      client_id: session.user.id,
      title,
      description,
      category,
      budget_min,
      budget_max,
      timeline,
      status: "open",
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  redirect(`/jobs/${data.id}`);
}

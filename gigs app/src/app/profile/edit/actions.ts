"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "freelancer") {
    throw new Error("Not authorized");
  }

  const bio = String(formData.get("bio") ?? "");
  const location = String(formData.get("location") ?? "");
  const avatar_url = String(formData.get("avatar_url") ?? "") || null;
  const categories = CATEGORIES.filter((c) => formData.get(`category_${c}`) === "on");
  const portfolio_links = String(formData.get("portfolio_links") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const { error } = await supabaseAdmin
    .from("freelancer_profiles")
    .update({ bio, location, avatar_url, categories, portfolio_links })
    .eq("user_id", session.user.id);

  if (error) throw new Error(error.message);

  redirect("/dashboard");
}

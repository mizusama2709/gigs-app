"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

export async function signup(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "");
  const role = String(formData.get("role") ?? "");
  const phone = String(formData.get("phone") ?? "") || null;

  if (!email || !password || !name || (role !== "freelancer" && role !== "client")) {
    throw new Error("Missing or invalid signup fields");
  }

  const password_hash = await bcrypt.hash(password, 10);

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .insert({ email, password_hash, role, name, phone })
    .select("id")
    .single();

  if (error || !user) {
    throw new Error(error?.message ?? "Could not create user");
  }

  if (role === "freelancer") {
    await supabaseAdmin.from("freelancer_profiles").insert({ user_id: user.id });
  } else {
    await supabaseAdmin.from("client_profiles").insert({ user_id: user.id, display_name: name });
  }

  redirect("/login");
}

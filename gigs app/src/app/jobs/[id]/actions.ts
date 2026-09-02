"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function applyToJob(jobId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "freelancer") {
    throw new Error("Not authorized");
  }

  const message = String(formData.get("message") ?? "").trim() || null;

  const { error } = await supabaseAdmin.from("job_applications").insert({
    job_id: jobId,
    freelancer_id: session.user.id,
    message,
    status: "pending",
  });

  // unique_violation on (job_id, freelancer_id) — already applied, ignore.
  if (error && error.code !== "23505") throw new Error(error.message);

  revalidatePath(`/jobs/${jobId}`);
}

export async function setApplicationStatus(
  jobId: string,
  applicationId: string,
  status: "accepted" | "rejected",
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "client") {
    throw new Error("Not authorized");
  }

  const { data: job } = await supabaseAdmin
    .from("jobs")
    .select("client_id")
    .eq("id", jobId)
    .single();

  if (!job || job.client_id !== session.user.id) throw new Error("Not authorized");

  const { error } = await supabaseAdmin
    .from("job_applications")
    .update({ status })
    .eq("id", applicationId)
    .eq("job_id", jobId);

  if (error) throw new Error(error.message);

  revalidatePath(`/jobs/${jobId}`);
}

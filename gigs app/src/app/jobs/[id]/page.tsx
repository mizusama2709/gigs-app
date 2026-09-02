import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { budgetLabel, firstOf } from "@/lib/format";
import { applyToJob, setApplicationStatus } from "./actions";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const { data: job } = await supabase
    .from("jobs")
    .select("id, client_id, title, description, category, budget_min, budget_max, timeline, status")
    .eq("id", id)
    .single();

  if (!job) notFound();

  const isOwner = session?.user?.role === "client" && session.user.id === job.client_id;
  const isFreelancer = session?.user?.role === "freelancer";

  let myApplication: { status: string } | null = null;
  if (isFreelancer) {
    const { data } = await supabaseAdmin
      .from("job_applications")
      .select("status")
      .eq("job_id", job.id)
      .eq("freelancer_id", session!.user.id)
      .maybeSingle();
    myApplication = data;
  }

  let applicants:
    | { id: string; message: string | null; status: string; users: { name: string } | { name: string }[] | null }[]
    | null = null;
  if (isOwner) {
    const { data } = await supabaseAdmin
      .from("job_applications")
      .select("id, message, status, users(name)")
      .eq("job_id", job.id)
      .order("created_at", { ascending: false });
    applicants = data;
  }

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-1">{job.title}</h1>
      <div className="text-sm text-gray-500 capitalize mb-3">{job.category}</div>
      <div className="text-sm text-gray-500 mb-4">
        {[budgetLabel(job), job.timeline].filter(Boolean).join(" · ")}
      </div>
      <p className="mb-6 whitespace-pre-wrap">{job.description}</p>

      {isFreelancer && (
        <div className="border-t pt-4">
          {myApplication ? (
            <p className="text-sm text-gray-500 capitalize">
              Application {myApplication.status}
            </p>
          ) : (
            <form action={applyToJob.bind(null, job.id)} className="flex flex-col gap-3">
              <textarea
                name="message"
                placeholder="Message (optional)"
                rows={3}
                className="border rounded-lg p-2"
              />
              <button type="submit" className="border rounded-lg p-2 min-h-[44px] font-semibold">
                Apply
              </button>
            </form>
          )}
        </div>
      )}

      {isOwner && (
        <div className="border-t pt-4">
          <h2 className="font-medium mb-3">Applicants</h2>
          <div className="flex flex-col gap-3">
            {applicants?.map((a) => {
              const u = firstOf(a.users);
              return (
                <div key={a.id} className="border rounded-lg p-3">
                  <div className="font-medium">{u?.name ?? "Freelancer"}</div>
                  {a.message && <p className="text-sm text-gray-500 mt-1">{a.message}</p>}
                  {a.status === "pending" ? (
                    <div className="flex gap-2 mt-3">
                      <form action={setApplicationStatus.bind(null, job.id, a.id, "accepted")}>
                        <button className="border rounded-lg px-3 min-h-[44px]">Accept</button>
                      </form>
                      <form action={setApplicationStatus.bind(null, job.id, a.id, "rejected")}>
                        <button className="border rounded-lg px-3 min-h-[44px]">Reject</button>
                      </form>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2 capitalize">{a.status}</p>
                  )}
                </div>
              );
            })}
            {applicants?.length === 0 && (
              <p className="text-sm text-gray-500">No applicants yet.</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

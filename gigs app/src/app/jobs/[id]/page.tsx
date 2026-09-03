import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { budgetLabel, firstOf, statusColor } from "@/lib/format";
import { applyToJob, setApplicationStatus } from "./actions";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const { data: job } = await supabase
    .from("jobs")
    .select("id, client_id, title, description, category, budget_min, budget_max, timeline, status, users(name)")
    .eq("id", id)
    .single();

  if (!job) notFound();

  const client = firstOf(job.users);
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

  const showApplyBar = isFreelancer && !myApplication;

  return (
    <main className={`max-w-md mx-auto p-4 ${showApplyBar ? "pb-28" : ""}`}>
      <h1 className="text-xl font-semibold mb-2">{job.title}</h1>
      <span className="inline-block rounded-full bg-accent/10 text-accent text-xs font-medium px-2 py-0.5 capitalize mb-4">
        {job.category}
      </span>
      <p className="mb-6 whitespace-pre-wrap leading-relaxed">{job.description}</p>

      <div className="rounded-xl shadow-sm bg-surface p-4 flex flex-col gap-2 mb-6">
        {client?.name && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Client</span>
            <span className="font-medium">{client.name}</span>
          </div>
        )}
        {budgetLabel(job) && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Budget</span>
            <span className="font-medium">{budgetLabel(job)}</span>
          </div>
        )}
        {job.timeline && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Timeline</span>
            <span className="font-medium">{job.timeline}</span>
          </div>
        )}
        <div className="flex justify-between text-sm items-center">
          <span className="text-gray-500">Status</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColor(job.status)}`}>
            {job.status}
          </span>
        </div>
      </div>

      {isFreelancer && (
        <div>
          {myApplication ? (
            <div className="rounded-xl shadow-sm bg-surface p-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">Your application</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColor(myApplication.status)}`}>
                {myApplication.status}
              </span>
            </div>
          ) : (
            <form id="apply-form" action={applyToJob.bind(null, job.id)}>
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
          <h2 className="font-medium mb-3">Applicants</h2>
          <div className="flex flex-col gap-3">
            {applicants?.map((a) => {
              const u = firstOf(a.users);
              return (
                <div key={a.id} className="rounded-xl shadow-sm bg-surface p-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="font-medium">{u?.name ?? "Freelancer"}</div>
                    <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColor(a.status)}`}>
                      {a.status}
                    </span>
                  </div>
                  {a.message && <p className="text-sm text-gray-500 mt-1">{a.message}</p>}
                  {a.status === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <form action={setApplicationStatus.bind(null, job.id, a.id, "accepted")}>
                        <button className="bg-gray-100 dark:bg-neutral-800 rounded-lg px-3 min-h-[44px] text-sm font-medium">Accept</button>
                      </form>
                      <form action={setApplicationStatus.bind(null, job.id, a.id, "rejected")}>
                        <button className="bg-gray-100 dark:bg-neutral-800 rounded-lg px-3 min-h-[44px] text-sm font-medium">Reject</button>
                      </form>
                    </div>
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

      {showApplyBar && (
        <div className="fixed inset-x-0 bottom-16 z-10 p-3 bg-surface shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          <button
            type="submit"
            form="apply-form"
            className="max-w-md mx-auto block w-full bg-accent text-accent-foreground rounded-xl min-h-[44px] font-semibold"
          >
            Apply
          </button>
        </div>
      )}
    </main>
  );
}

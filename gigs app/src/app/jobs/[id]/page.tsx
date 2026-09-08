import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { budgetLabel, firstOf, statusColor } from "@/lib/format";
import { categoryColor } from "@/lib/categories";
import { Card, CategoryBadge } from "@/components/Card";
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
  const color = categoryColor(job.category);

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
    <main className={`max-w-md sm:max-w-xl lg:max-w-3xl mx-auto p-4 pt-6 ${showApplyBar ? "pb-28" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <BackButton />
        <CategoryBadge category={job.category} bg={color.bg} text={color.text} />
      </div>

      <h1 className="text-[22px] font-bold leading-tight mb-3.5">{job.title}</h1>

      <div className="flex flex-col gap-2.5 mb-4">
        {budgetLabel(job) && (
          <div className="flex items-center gap-2.5">
            <span className="w-[30px] h-[30px] rounded-lg flex items-center justify-center shrink-0" style={{ background: "oklch(70% 0.11 150)" }}>
              <span className="font-bold text-sm">₹</span>
            </span>
            <span className="font-semibold text-sm">{budgetLabel(job)}</span>
          </div>
        )}
        {job.timeline && (
          <div className="flex items-center gap-2.5">
            <span className="w-[30px] h-[30px] rounded-lg flex items-center justify-center shrink-0" style={{ background: "oklch(70% 0.1 250)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6">
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M3 9h18M8 2v4M16 2v4" />
              </svg>
            </span>
            <span className="text-[13px]">{job.timeline}</span>
          </div>
        )}
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-muted">Status</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColor(job.status)}`}>
            {job.status}
          </span>
        </div>
      </div>

      <div className="h-px bg-ink/10 mb-4" />

      <div className="font-semibold text-[15px] mb-2">About this job</div>
      <p className="text-[13.5px] leading-relaxed text-ink/80 mb-5 whitespace-pre-wrap">{job.description}</p>

      {client?.name && (
        <>
          <div className="font-semibold text-[15px] mb-2">Posted by</div>
          <Card className="p-3.5 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full border border-ink/15 bg-background shrink-0 flex items-center justify-center font-semibold text-muted">
                {client.name.charAt(0).toUpperCase()}
              </div>
              <div className="font-semibold text-[13.5px]">{client.name}</div>
            </div>
          </Card>
        </>
      )}

      {isFreelancer && (
        <div>
          {myApplication ? (
            <Card className="p-4 flex justify-between items-center">
              <span className="text-sm text-muted">Your application</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColor(myApplication.status)}`}>
                {myApplication.status}
              </span>
            </Card>
          ) : (
            <form id="apply-form" action={applyToJob.bind(null, job.id)}>
              <textarea
                name="message"
                placeholder="Message (optional)"
                rows={3}
                className="w-full rounded-xl border border-ink/15 p-3 bg-surface text-sm"
              />
            </form>
          )}
        </div>
      )}

      {isOwner && (
        <div>
          <div className="font-semibold text-[15px] mb-2.5">Applicants</div>
          <div className="flex flex-col gap-3">
            {applicants?.map((a) => {
              const u = firstOf(a.users);
              return (
                <Card key={a.id} className="p-3.5">
                  <div className="flex justify-between items-start gap-2">
                    <div className="font-semibold text-[13.5px]">{u?.name ?? "Freelancer"}</div>
                    <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColor(a.status)}`}>
                      {a.status}
                    </span>
                  </div>
                  {a.message && <p className="text-sm text-muted mt-1">{a.message}</p>}
                  {a.status === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <form action={setApplicationStatus.bind(null, job.id, a.id, "accepted")}>
                        <button className="bg-background border border-ink/15 rounded-lg px-3 min-h-[44px] text-sm font-semibold">Accept</button>
                      </form>
                      <form action={setApplicationStatus.bind(null, job.id, a.id, "rejected")}>
                        <button className="bg-background border border-ink/15 rounded-lg px-3 min-h-[44px] text-sm font-semibold">Reject</button>
                      </form>
                    </div>
                  )}
                </Card>
              );
            })}
            {applicants?.length === 0 && (
              <p className="text-sm text-muted">No applicants yet.</p>
            )}
          </div>
        </div>
      )}

      {showApplyBar && (
        <div className="fixed inset-x-0 bottom-16 lg:bottom-0 lg:left-24 z-10 p-3.5 bg-surface border-t border-ink/10">
          <button
            type="submit"
            form="apply-form"
            className="max-w-md sm:max-w-xl lg:max-w-3xl mx-auto block w-full bg-accent text-accent-foreground rounded-2xl min-h-[52px] font-semibold text-[15px]"
          >
            Apply to this job
          </button>
        </div>
      )}
    </main>
  );
}

function BackButton() {
  return (
    <div className="w-10 h-10 border border-ink/15 rounded-xl bg-surface shadow-sm flex items-center justify-center">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.6">
        <path d="M15 19l-7-7 7-7" />
      </svg>
    </div>
  );
}

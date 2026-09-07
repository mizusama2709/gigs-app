import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { firstOf, statusColor } from "@/lib/format";
import { BrutalCard } from "@/components/BrutalCard";

type Application = {
  id: string;
  status: string;
  jobs: { id: string; title: string; category: string } | { id: string; title: string; category: string }[] | null;
};

type Job = { id: string; title: string; status: string };

type Booking = {
  id: string;
  status: string;
  gigs:
    | { id: string; title: string; users: { name: string } | { name: string }[] | null }
    | { id: string; title: string; users: { name: string } | { name: string }[] | null }[]
    | null;
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const isFreelancer = session.user.role === "freelancer";
  const isClient = session.user.role === "client";

  let applications: Application[] | null = null;
  if (isFreelancer) {
    const { data } = await supabase
      .from("job_applications")
      .select("id, status, jobs(id, title, category)")
      .eq("freelancer_id", session.user.id)
      .order("created_at", { ascending: false });
    applications = data;
  }

  let postedJobs: Job[] | null = null;
  let bookings: Booking[] | null = null;
  if (isClient) {
    const [{ data: jobsData }, { data: bookingsData }] = await Promise.all([
      supabase
        .from("jobs")
        .select("id, title, status")
        .eq("client_id", session.user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("bookings")
        .select("id, status, gigs(id, title, users(name))")
        .eq("client_id", session.user.id)
        .order("created_at", { ascending: false }),
    ]);
    postedJobs = jobsData;
    bookings = bookingsData;
  }

  const firstName = session.user.name?.split(" ")[0] ?? session.user.name;

  return (
    <main className="max-w-sm sm:max-w-lg lg:max-w-2xl mx-auto p-4 pt-6 pb-8">
      <div className="mb-5">
        <h1 className="font-display text-[24px] font-bold tracking-tight">Hey, {firstName}</h1>
        <p className="text-[12.5px] text-muted mt-0.5">
          {isFreelancer
            ? "Here's what's happening with your gigs and jobs."
            : "Here's what's happening with your jobs."}
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 -mx-4 px-4">
        {isFreelancer && (
          <>
            <Link
              href="/profile/edit"
              className="shrink-0 rounded-full bg-surface border-[3px] border-ink px-3.5 min-h-[40px] flex items-center font-display text-[11.5px] font-bold"
            >
              Edit profile
            </Link>
            <Link
              href={`/freelancer/${session.user.id}`}
              className="shrink-0 rounded-full bg-surface border-[3px] border-ink px-3.5 min-h-[40px] flex items-center font-display text-[11.5px] font-bold"
            >
              My gigs
            </Link>
            <Link
              href="/gigs/new"
              className="shrink-0 rounded-full bg-accent border-[3px] border-ink px-3.5 min-h-[40px] flex items-center font-display text-[11.5px] font-bold"
            >
              List a gig
            </Link>
          </>
        )}
        {isClient && (
          <>
            <Link
              href="/jobs/new"
              className="shrink-0 rounded-full bg-accent border-[3px] border-ink px-3.5 min-h-[40px] flex items-center font-display text-[11.5px] font-bold"
            >
              Post a job
            </Link>
            <Link
              href="/explore"
              className="shrink-0 rounded-full bg-surface border-[3px] border-ink px-3.5 min-h-[40px] flex items-center font-display text-[11.5px] font-bold"
            >
              Explore freelancers
            </Link>
          </>
        )}
      </div>

      {isFreelancer && (
        <>
          <h2 className="font-display font-bold text-[14px] mb-2">My applications</h2>
          <div className="flex flex-col gap-2.5 mb-6">
            {applications?.map((app) => {
              const job = firstOf(app.jobs);
              if (!job) return null;
              return (
                <BrutalCard key={app.id} href={`/jobs/${job.id}`} className="p-3 flex justify-between items-center gap-2">
                  <div className="min-w-0">
                    <div className="font-display font-bold text-[13px] truncate">{job.title}</div>
                    <div className="text-[11px] text-muted capitalize mt-0.5">{job.category}</div>
                  </div>
                  <span className={`shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full capitalize ${statusColor(app.status)}`}>
                    {app.status}
                  </span>
                </BrutalCard>
              );
            })}
            {applications?.length === 0 && (
              <p className="text-sm text-muted">No applications yet.</p>
            )}
          </div>
        </>
      )}

      {isClient && (
        <>
          <h2 className="font-display font-bold text-[14px] mb-2">My posted jobs</h2>
          <div className="flex flex-col gap-2.5 mb-6">
            {postedJobs?.map((job) => (
              <BrutalCard key={job.id} href={`/jobs/${job.id}`} className="p-3 flex justify-between items-center gap-2">
                <div className="font-display font-bold text-[13px] truncate">{job.title}</div>
                <span className={`shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full capitalize ${statusColor(job.status)}`}>
                  {job.status}
                </span>
              </BrutalCard>
            ))}
            {postedJobs?.length === 0 && (
              <p className="text-sm text-muted">No jobs posted yet.</p>
            )}
          </div>

          <h2 className="font-display font-bold text-[14px] mb-2">Booking requests</h2>
          <div className="flex flex-col gap-2.5 mb-6">
            {bookings?.map((booking) => {
              const gig = firstOf(booking.gigs);
              if (!gig) return null;
              const freelancer = firstOf(gig.users);
              return (
                <BrutalCard key={booking.id} href={`/gigs/${gig.id}`} className="p-3 flex justify-between items-center gap-2">
                  <div className="min-w-0">
                    <div className="font-display font-bold text-[13px] truncate">{gig.title}</div>
                    {freelancer && (
                      <div className="text-[11px] text-muted truncate mt-0.5">{freelancer.name}</div>
                    )}
                  </div>
                  <span className={`shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full capitalize ${statusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </BrutalCard>
              );
            })}
            {bookings?.length === 0 && (
              <p className="text-sm text-muted">No booking requests yet.</p>
            )}
          </div>
        </>
      )}

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="bg-surface border-[3px] border-ink rounded-xl p-2 min-h-[44px] w-full text-sm font-display font-bold shadow-[3px_3px_0_var(--ink)]"
        >
          Log out
        </button>
      </form>
    </main>
  );
}

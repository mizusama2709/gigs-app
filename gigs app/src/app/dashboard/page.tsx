import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { firstOf, statusColor } from "@/lib/format";

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
    <main className="max-w-sm mx-auto p-4">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold mb-1">Hey, {firstName}</h1>
        <p className="text-sm text-gray-500">
          {isFreelancer
            ? "Here's what's happening with your gigs."
            : "Here's what's happening with your jobs."}
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4">
        {isFreelancer && (
          <>
            <Link
              href="/profile/edit"
              className="shrink-0 rounded-full bg-gray-100 dark:bg-neutral-800 px-4 min-h-[44px] flex items-center text-sm font-medium"
            >
              Edit profile
            </Link>
            <Link
              href={`/freelancer/${session.user.id}`}
              className="shrink-0 rounded-full bg-gray-100 dark:bg-neutral-800 px-4 min-h-[44px] flex items-center text-sm font-medium"
            >
              My gigs
            </Link>
            <Link
              href="/gigs/new"
              className="shrink-0 rounded-full bg-accent text-accent-foreground px-4 min-h-[44px] flex items-center text-sm font-medium"
            >
              List a gig
            </Link>
          </>
        )}
        {isClient && (
          <>
            <Link
              href="/jobs/new"
              className="shrink-0 rounded-full bg-accent text-accent-foreground px-4 min-h-[44px] flex items-center text-sm font-medium"
            >
              Post a job
            </Link>
            <Link
              href="/explore"
              className="shrink-0 rounded-full bg-gray-100 dark:bg-neutral-800 px-4 min-h-[44px] flex items-center text-sm font-medium"
            >
              Explore freelancers
            </Link>
          </>
        )}
      </div>

      {isFreelancer && (
        <>
          <h2 className="font-medium mb-2">My applications</h2>
          <div className="flex flex-col gap-3 mb-6">
            {applications?.map((app) => {
              const job = firstOf(app.jobs);
              if (!job) return null;
              return (
                <Link
                  key={app.id}
                  href={`/jobs/${job.id}`}
                  className="rounded-xl shadow-sm bg-surface p-3 flex justify-between items-center gap-2"
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">{job.title}</div>
                    <div className="text-sm text-gray-500 capitalize">{job.category}</div>
                  </div>
                  <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColor(app.status)}`}>
                    {app.status}
                  </span>
                </Link>
              );
            })}
            {applications?.length === 0 && (
              <p className="text-sm text-gray-500">No applications yet.</p>
            )}
          </div>
        </>
      )}

      {isClient && (
        <>
          <h2 className="font-medium mb-2">My posted jobs</h2>
          <div className="flex flex-col gap-3 mb-6">
            {postedJobs?.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="rounded-xl shadow-sm bg-surface p-3 flex justify-between items-center gap-2"
              >
                <div className="font-medium truncate">{job.title}</div>
                <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColor(job.status)}`}>
                  {job.status}
                </span>
              </Link>
            ))}
            {postedJobs?.length === 0 && (
              <p className="text-sm text-gray-500">No jobs posted yet.</p>
            )}
          </div>

          <h2 className="font-medium mb-2">My booking requests</h2>
          <div className="flex flex-col gap-3 mb-6">
            {bookings?.map((booking) => {
              const gig = firstOf(booking.gigs);
              if (!gig) return null;
              const freelancer = firstOf(gig.users);
              return (
                <Link
                  key={booking.id}
                  href={`/gigs/${gig.id}`}
                  className="rounded-xl shadow-sm bg-surface p-3 flex justify-between items-center gap-2"
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">{gig.title}</div>
                    {freelancer && (
                      <div className="text-sm text-gray-500 truncate">{freelancer.name}</div>
                    )}
                  </div>
                  <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </Link>
              );
            })}
            {bookings?.length === 0 && (
              <p className="text-sm text-gray-500">No booking requests yet.</p>
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
        <button type="submit" className="bg-gray-100 dark:bg-neutral-800 rounded-xl p-2 min-h-[44px] w-full text-sm font-medium">
          Log out
        </button>
      </form>
    </main>
  );
}

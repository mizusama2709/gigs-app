import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { firstOf } from "@/lib/format";

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

  return (
    <main className="max-w-sm mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">
        Welcome, {session.user.name} ({session.user.role})
      </h1>

      {isFreelancer && (
        <>
          <div className="flex flex-col gap-3 mb-6">
            <Link
              href="/profile/edit"
              className="border rounded-lg p-2 min-h-[44px] flex items-center justify-center"
            >
              Edit profile
            </Link>
            <Link
              href={`/freelancer/${session.user.id}`}
              className="border rounded-lg p-2 min-h-[44px] flex items-center justify-center"
            >
              My gigs
            </Link>
          </div>

          <h2 className="font-medium mb-2">My applications</h2>
          <div className="flex flex-col gap-3 mb-6">
            {applications?.map((app) => {
              const job = firstOf(app.jobs);
              if (!job) return null;
              return (
                <Link
                  key={app.id}
                  href={`/jobs/${job.id}`}
                  className="border rounded-lg p-3 min-h-[44px]"
                >
                  <div className="font-medium">{job.title}</div>
                  <div className="text-sm text-gray-500 capitalize">{job.category}</div>
                  <div className="text-sm text-gray-500 capitalize">{app.status}</div>
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
                className="border rounded-lg p-3 min-h-[44px]"
              >
                <div className="font-medium">{job.title}</div>
                <div className="text-sm text-gray-500 capitalize">{job.status}</div>
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
                  className="border rounded-lg p-3 min-h-[44px]"
                >
                  <div className="font-medium">{gig.title}</div>
                  {freelancer && (
                    <div className="text-sm text-gray-500">{freelancer.name}</div>
                  )}
                  <div className="text-sm text-gray-500 capitalize">{booking.status}</div>
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
        <button type="submit" className="border p-2 min-h-[44px] w-full">
          Log out
        </button>
      </form>
    </main>
  );
}

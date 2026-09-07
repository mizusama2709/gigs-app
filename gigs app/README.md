# Grid

A two-sided marketplace connecting Hyderabad's creative freelancers — photographers, cinematographers, videographers, editors — with clients looking to hire for one-off jobs or recurring work.

Generic freelance platforms (Upwork, Fiverr) are global, saturated, and not built for local creative gigs. Grid is local-first: portfolio-driven discovery, job postings, and bookable gig listings for a single city.

## Features

- **Explore** — portfolio-first, Instagram-style discovery feed of freelancers, filterable by category
- **Job postings** — clients post a brief (project type, budget, timeline); freelancers apply
- **Bookable gigs** — freelancers list a service + rate as a mini storefront; clients book directly
- **Role-based auth** — freelancer and client accounts with distinct profile flows
- **Dashboards** — status-coded views for managing jobs, applications, and bookings

See [`prd-creative-freelance-marketplace.md`](./prd-creative-freelance-marketplace.md) for the full product spec and V1 scope.

## Tech stack

- [Next.js](https://nextjs.org) (App Router)
- [Supabase](https://supabase.com) — Postgres + auth adapter
- [Auth.js (NextAuth)](https://authjs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- TypeScript

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AUTH_SECRET=
```

## Project structure

```
src/app/
├── explore/        # freelancer discovery feed
├── jobs/            # job postings + applications
├── gigs/            # bookable gig listings
├── dashboard/        # role-based dashboards
├── freelancer/[id]/  # freelancer profile
├── login/ signup/    # auth
└── api/               # NextAuth route handlers
```

## Status

Early build — V1 scope is job postings, bookable gigs, and the explore feed for a single city (Hyderabad), with payments, reviews, and messaging deferred to later versions.

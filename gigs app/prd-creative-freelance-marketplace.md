# PRD: Creative Freelance Marketplace (Hyderabad) — v1

**Status:** Draft — not yet build-ready, open questions below
**Working name:** TBD

---

## Problem

Photographers, cinematographers, and other creative freelancers in Hyderabad don't have a dedicated place to find local work. Generic freelance platforms (Upwork, Fiverr) are global, saturated, and not built for local creative gigs — no sense of local rates, availability, or portfolio-first discovery. Clients (event organizers, small agencies, businesses, individuals) looking to hire local creative talent face the same gap in reverse: no focused way to browse and book vetted local freelancers.

## Why build this (dual goal)

1. **Learning goal (primary):** a personal experiment to build a full two-sided marketplace SaaS end-to-end with Claude Code — auth, two distinct user types, listings CRUD, a discovery/explore feed, deployment. This is the harder, more complete version of the "learn SaaS" goal than a simple wrapper project.
2. **Validation goal (secondary):** a real test of whether this specific gap (tier-2/3 city, creative-only, local) is real — you already have access to the freelancer side of this market through abhkfilms/Agenz.

## Target users

- **Freelancers:** photographers, cinematographers, videographers, editors, and adjacent creative freelancers based in Hyderabad
- **Clients:** individuals, event organizers, small businesses, and agencies looking to hire for one-off jobs or recurring creative work

## Core mechanics (v1)

1. **Job postings** — clients post a brief (project type, budget range, timeline), freelancers apply
2. **Bookable gig listings** — freelancers list a service + rate (like a mini storefront), clients book directly
3. **Explore page** — browsable, portfolio-first feed of freelancers (Instagram-style discovery), filterable by category

## V1 scope — IN

- Freelancer profile + portfolio (image/video links, category tags, base location)
- Client profile (lighter — no portfolio needed)
- Post a job (client)
- Apply to a job (freelancer)
- List a gig/service with rate (freelancer)
- Explore/browse freelancers by category
- Basic search/filter (category, price range)
- Auth with role selection (freelancer vs client)

## V1 scope — OUT (explicitly cut)

- **Payments/escrow** — no in-app money handling in v1; deals close off-platform once matched. This is the reversible starting point — adding Stripe later is trivial, but doing escrow/disputes/KYC correctly from day one is not something to rush into on a learning project.
- **Reviews/ratings** — v2
- **In-app messaging** — v2; v1 can just reveal contact info once a client/freelancer express interest
- **Multi-city** — Hyderabad only for v1
- **Mobile app** — web only for v1

## Success criteria

- **Learning:** working, deployed marketplace touching auth, two-sided data modeling, listings CRUD, discovery feed, and live deploy
- **Validation:** a handful of real Hyderabad creative freelancers list on it, and at least one real job posting or gig booking actually happens

## Open questions (resolve before build starts)

- Working name for the project
- Should the Explore page be public (SEO/discovery value, but exposes freelancer info to anyone) or gated behind login?

**Deliberately deferred:** Monetization model (commission, subscription, job-posting fee) — not in scope for v1 since there's no in-app payment handling yet, so it doesn't block the schema. Revisit once there's real usage to monetize.

## Proposed stack

Next.js + Postgres (Supabase) + Auth.js/Clerk + Vercel deploy. Stripe deferred until payments are actually in scope (v2+) — matches the earlier SaaS-learning stack discussion.

---
*Next step: resolve open questions above, then move to technical scoping / first Claude Code session.*

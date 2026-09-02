-- Creative Freelance Marketplace schema
-- Run in Supabase SQL editor or via `supabase db push`

create extension if not exists "pgcrypto";

create type user_role as enum ('freelancer', 'client');
create type job_status as enum ('open', 'closed');
create type application_status as enum ('pending', 'accepted', 'rejected');
create type rate_type as enum ('fixed', 'hourly', 'per-day');
create type booking_status as enum ('requested', 'confirmed', 'declined');

create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  role user_role not null,
  name text not null,
  phone text,
  created_at timestamptz not null default now()
);

create table freelancer_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  bio text,
  categories text[] not null default '{}',
  location text,
  portfolio_links text[] not null default '{}',
  avatar_url text
);

create table client_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  display_name text,
  avatar_url text
);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references users(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  budget_min integer,
  budget_max integer,
  timeline text,
  status job_status not null default 'open',
  created_at timestamptz not null default now()
);

create table job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  freelancer_id uuid not null references users(id) on delete cascade,
  message text,
  status application_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (job_id, freelancer_id)
);

create table gigs (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references users(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  rate integer not null,
  rate_type rate_type not null,
  created_at timestamptz not null default now()
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid not null references gigs(id) on delete cascade,
  client_id uuid not null references users(id) on delete cascade,
  message text,
  status booking_status not null default 'requested',
  created_at timestamptz not null default now(),
  unique (gig_id, client_id)
);

create index on jobs (category, status);
create index on gigs (category);
create index on job_applications (freelancer_id);
create index on bookings (client_id);

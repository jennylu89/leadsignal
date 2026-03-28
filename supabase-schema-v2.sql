-- LeadSignal Database Schema v2 — Job Listings Model
-- Run this in your Supabase SQL editor
-- NOTE: If you already ran v1, run the migration at the bottom instead

-- Drop old tables if migrating from v1
drop table if exists leads cascade;
drop table if exists companies cascade;
drop table if exists scrape_runs cascade;
drop function if exists update_updated_at cascade;

-- Job listings table
create table job_listings (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  company_name text not null,
  company_url text,
  description text,
  location text,
  job_type text default 'freelance' check (job_type in ('freelance', 'contract', 'part_time', 'full_time', 'unknown')),
  source text not null check (source in ('linkedin', 'indeed', 'dribbble', 'wellfound', 'weworkremotely', 'upwork', 'x2talent')),
  source_url text not null unique,
  posted_date timestamptz,
  score text default 'cool' check (score in ('hot', 'warm', 'cool')),
  tags jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Leads table (user interaction with job listings)
create table leads (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references job_listings(id) on delete cascade,
  status text default 'new' check (status in ('new', 'saved', 'dismissed', 'applied', 'replied')),
  notes text,
  updated_at timestamptz default now(),
  unique(job_id)
);

-- Scrape runs table
create table scrape_runs (
  id uuid default gen_random_uuid() primary key,
  source text not null,
  ran_at timestamptz default now(),
  leads_found integer default 0,
  status text default 'success' check (status in ('success', 'failed'))
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger job_listings_updated_at
  before update on job_listings
  for each row execute function update_updated_at();

create trigger leads_updated_at
  before update on leads
  for each row execute function update_updated_at();

-- Indexes
create index idx_jobs_score on job_listings(score);
create index idx_jobs_source on job_listings(source);
create index idx_jobs_job_type on job_listings(job_type);
create index idx_jobs_posted_date on job_listings(posted_date desc);
create index idx_jobs_created_at on job_listings(created_at desc);
create index idx_jobs_location on job_listings(location);
create index idx_leads_status on leads(status);
create index idx_leads_job_id on leads(job_id);

-- LeadSignal Database Schema
-- Run this in your Supabase SQL editor to set up the tables

-- Companies table
create table companies (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  url text,
  logo_url text,
  description text,
  industry text,
  stage text default 'unknown' check (stage in ('pre_seed', 'seed', 'series_a', 'series_b', 'series_c', 'growth', 'unknown')),
  funding_amount bigint,
  funded_date date,
  team_size integer,
  designer_count integer default 0,
  engineer_count integer default 0,
  source text not null,
  source_url text,
  score text default 'cool' check (score in ('hot', 'warm', 'cool')),
  signals jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Leads table (user interaction with companies)
create table leads (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references companies(id) on delete cascade,
  status text default 'new' check (status in ('new', 'saved', 'dismissed', 'contacted', 'replied')),
  notes text,
  outreach_angle text,
  updated_at timestamptz default now(),
  unique(company_id)
);

-- Scrape runs table (track scraper health)
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

create trigger companies_updated_at
  before update on companies
  for each row execute function update_updated_at();

create trigger leads_updated_at
  before update on leads
  for each row execute function update_updated_at();

-- Indexes for common queries
create index idx_companies_score on companies(score);
create index idx_companies_stage on companies(stage);
create index idx_companies_source on companies(source);
create index idx_companies_created_at on companies(created_at desc);
create index idx_leads_status on leads(status);
create index idx_leads_company_id on leads(company_id);

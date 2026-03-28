export type CompanyStage =
  | "pre_seed"
  | "seed"
  | "series_a"
  | "series_b"
  | "series_c"
  | "growth"
  | "unknown";

export type SignalType =
  | "just_funded"
  | "no_designer"
  | "hiring_engineers"
  | "hiring_first_designer"
  | "new_launch"
  | "accelerator_batch"
  | "technical_founders";

export type LeadScore = "hot" | "warm" | "cool";

export type LeadStatus = "new" | "saved" | "dismissed" | "contacted" | "replied";

export interface Company {
  id: string;
  name: string;
  url: string | null;
  logo_url: string | null;
  description: string | null;
  industry: string | null;
  stage: CompanyStage;
  funding_amount: number | null;
  funded_date: string | null;
  team_size: number | null;
  designer_count: number | null;
  engineer_count: number | null;
  source: string;
  source_url: string | null;
  score: LeadScore;
  signals: SignalType[];
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  company_id: string;
  status: LeadStatus;
  notes: string | null;
  outreach_angle: string | null;
  updated_at: string;
  company?: Company;
}

export interface ScrapeRun {
  id: string;
  source: string;
  ran_at: string;
  leads_found: number;
  status: "success" | "failed";
}

export type FilterState = {
  score: LeadScore | "all";
  stage: CompanyStage | "all";
  source: string | "all";
  search: string;
};

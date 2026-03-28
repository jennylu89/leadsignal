export type JobType =
  | "freelance"
  | "contract"
  | "part_time"
  | "full_time"
  | "unknown";

export type JobSource =
  | "linkedin"
  | "indeed"
  | "dribbble"
  | "wellfound"
  | "weworkremotely"
  | "upwork";

export type LeadScore = "hot" | "warm" | "cool";

export type LeadStatus = "new" | "saved" | "dismissed" | "applied" | "replied";

export interface JobListing {
  id: string;
  title: string;
  company_name: string;
  company_url: string | null;
  description: string | null;
  location: string | null;
  job_type: JobType;
  source: JobSource;
  source_url: string;
  posted_date: string | null;
  score: LeadScore;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  job_id: string;
  status: LeadStatus;
  notes: string | null;
  updated_at: string;
  job?: JobListing;
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
  jobType: JobType | "all";
  source: JobSource | "all";
  search: string;
};

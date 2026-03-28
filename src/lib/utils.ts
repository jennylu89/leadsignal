import { LeadScore, JobType, JobSource } from "@/types";

export function formatJobType(type: JobType): string {
  const map: Record<JobType, string> = {
    freelance: "Freelance",
    contract: "Contract",
    part_time: "Part-Time",
    full_time: "Full-Time",
    unknown: "Unknown",
  };
  return map[type];
}

export function formatSource(source: JobSource): string {
  const map: Record<JobSource, string> = {
    linkedin: "LinkedIn",
    indeed: "Indeed",
    dribbble: "Dribbble",
    wellfound: "Wellfound",
    weworkremotely: "We Work Remotely",
    upwork: "Upwork",
  };
  return map[source];
}

export function scoreColor(score: LeadScore): string {
  const map: Record<LeadScore, string> = {
    hot: "bg-red-100 text-red-700 border-red-200",
    warm: "bg-amber-100 text-amber-700 border-amber-200",
    cool: "bg-blue-100 text-blue-700 border-blue-200",
  };
  return map[score];
}

export function scoreIcon(score: LeadScore): string {
  const map: Record<LeadScore, string> = {
    hot: "🔥",
    warm: "🟡",
    cool: "🔵",
  };
  return map[score];
}

export function sourceIcon(source: JobSource): string {
  const map: Record<JobSource, string> = {
    linkedin: "💼",
    indeed: "🔍",
    dribbble: "🏀",
    wellfound: "🚀",
    weworkremotely: "🌍",
    upwork: "💚",
  };
  return map[source];
}

export function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Recently";
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

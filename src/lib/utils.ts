import { LeadScore, CompanyStage, SignalType } from "@/types";

export function formatFunding(amount: number | null): string {
  if (!amount) return "—";
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

export function formatStage(stage: CompanyStage): string {
  const map: Record<CompanyStage, string> = {
    pre_seed: "Pre-Seed",
    seed: "Seed",
    series_a: "Series A",
    series_b: "Series B",
    series_c: "Series C",
    growth: "Growth",
    unknown: "Unknown",
  };
  return map[stage];
}

export function formatSignal(signal: SignalType): string {
  const map: Record<SignalType, string> = {
    just_funded: "Just Funded",
    no_designer: "No Designer",
    hiring_engineers: "Hiring Engineers",
    hiring_first_designer: "Hiring 1st Designer",
    new_launch: "New Launch",
    accelerator_batch: "Accelerator Batch",
    technical_founders: "Technical Founders",
  };
  return map[signal];
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

export function timeAgo(dateStr: string): string {
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

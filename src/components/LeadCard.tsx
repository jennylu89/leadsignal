"use client";

import { Lead } from "@/types";
import {
  formatJobType,
  formatSource,
  scoreColor,
  scoreIcon,
  sourceIcon,
  timeAgo,
} from "@/lib/utils";

interface LeadCardProps {
  lead: Lead;
  onSave?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onSelect?: (id: string) => void;
}

export function LeadCard({ lead, onSave, onDismiss, onSelect }: LeadCardProps) {
  const job = lead.job!;

  return (
    <div
      className="border border-zinc-200 rounded-xl p-5 bg-white hover:border-zinc-300 hover:shadow-sm transition-all cursor-pointer"
      onClick={() => onSelect?.(lead.id)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-lg">{scoreIcon(job.score)}</span>
            <h3 className="font-semibold text-zinc-900">
              {job.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm font-medium text-zinc-700">
              {job.company_name}
            </span>
            {job.location && (
              <>
                <span className="text-zinc-300">·</span>
                <span className="text-sm text-zinc-500">{job.location}</span>
              </>
            )}
          </div>

          <p className="text-sm text-zinc-600 mt-2 line-clamp-2">
            {job.description}
          </p>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full border ${scoreColor(job.score)}`}
            >
              {job.score}
            </span>
            <span className="text-xs text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
              {formatJobType(job.job_type)}
            </span>
            <span className="text-xs text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
              {sourceIcon(job.source)} {formatSource(job.source)}
            </span>
            {job.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-violet-50 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-xs text-zinc-400">
            {timeAgo(job.posted_date)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave?.(lead.id);
          }}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
        >
          {lead.status === "saved" ? "Saved ✓" : "Save"}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss?.(lead.id);
          }}
          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
        >
          Dismiss
        </button>
        <a
          href={job.source_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors ml-auto"
        >
          View on {formatSource(job.source)} ↗
        </a>
      </div>
    </div>
  );
}

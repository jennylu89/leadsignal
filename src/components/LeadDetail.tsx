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

interface LeadDetailProps {
  lead: Lead;
  onClose: () => void;
  onSave?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export function LeadDetail({ lead, onClose, onSave, onDismiss }: LeadDetailProps) {
  const job = lead.job!;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-lg bg-white shadow-xl border-l border-zinc-200 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-zinc-200 p-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 pr-8">{job.title}</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Company & Location */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-zinc-900">
                {job.company_name}
              </span>
              {job.company_url && (
                <a
                  href={job.company_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-violet-600 hover:underline"
                >
                  website ↗
                </a>
              )}
            </div>
            {job.location && (
              <p className="text-sm text-zinc-500 mt-0.5">{job.location}</p>
            )}
          </div>

          {/* Score & Type */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl">{scoreIcon(job.score)}</span>
            <span
              className={`text-sm font-medium px-2.5 py-1 rounded-full border ${scoreColor(job.score)}`}
            >
              {job.score}
            </span>
            <span className="text-sm text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full">
              {formatJobType(job.job_type)}
            </span>
            <span className="text-sm text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full">
              {sourceIcon(job.source)} {formatSource(job.source)}
            </span>
            <span className="text-sm text-zinc-400">
              Posted {timeAgo(job.posted_date)}
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-zinc-700 mb-1">
              Job Description
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-medium text-zinc-700 mb-2">Tags</h3>
            <div className="flex gap-2 flex-wrap">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-violet-50 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Apply Link */}
          <div>
            <a
              href={job.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center text-sm font-medium px-4 py-3 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
            >
              View on {formatSource(job.source)} ↗
            </a>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-zinc-100">
            <button
              onClick={() => onSave?.(lead.id)}
              className="flex-1 text-sm font-medium px-4 py-2.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
            >
              {lead.status === "saved" ? "Saved ✓" : "Save Lead"}
            </button>
            <button
              onClick={() => onDismiss?.(lead.id)}
              className="flex-1 text-sm font-medium px-4 py-2.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

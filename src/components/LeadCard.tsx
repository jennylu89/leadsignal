"use client";

import { Lead } from "@/types";
import {
  formatFunding,
  formatStage,
  formatSignal,
  scoreColor,
  scoreIcon,
  timeAgo,
} from "@/lib/utils";

interface LeadCardProps {
  lead: Lead;
  onSave?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onSelect?: (id: string) => void;
}

export function LeadCard({ lead, onSave, onDismiss, onSelect }: LeadCardProps) {
  const company = lead.company!;

  return (
    <div
      className="border border-zinc-200 rounded-xl p-5 bg-white hover:border-zinc-300 hover:shadow-sm transition-all cursor-pointer"
      onClick={() => onSelect?.(lead.id)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">{scoreIcon(company.score)}</span>
            <h3 className="font-semibold text-zinc-900 truncate">
              {company.name}
            </h3>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full border ${scoreColor(company.score)}`}
            >
              {company.score}
            </span>
            {company.stage !== "unknown" && (
              <span className="text-xs text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                {formatStage(company.stage)}
              </span>
            )}
          </div>

          <p className="text-sm text-zinc-600 mt-2 line-clamp-2">
            {company.description}
          </p>

          <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
            {company.team_size && (
              <span>{company.team_size} employees</span>
            )}
            {company.designer_count !== null && (
              <span>
                {company.designer_count === 0
                  ? "0 designers ⚠️"
                  : `${company.designer_count} designers`}
              </span>
            )}
            {company.engineer_count !== null && company.engineer_count > 0 && (
              <span>{company.engineer_count} engineers</span>
            )}
            {company.funding_amount && (
              <span>{formatFunding(company.funding_amount)} raised</span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {company.signals.map((signal) => (
              <span
                key={signal}
                className="text-xs bg-violet-50 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-full"
              >
                {formatSignal(signal)}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-xs text-zinc-400">
            {timeAgo(company.created_at)}
          </span>
          <span className="text-xs text-zinc-400 capitalize">
            {company.source}
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
          Save
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
        {company.url && (
          <a
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors ml-auto"
          >
            Visit Website ↗
          </a>
        )}
      </div>
    </div>
  );
}

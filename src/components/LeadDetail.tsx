"use client";

import { Lead } from "@/types";
import {
  formatFunding,
  formatStage,
  formatSignal,
  scoreColor,
  scoreIcon,
} from "@/lib/utils";

interface LeadDetailProps {
  lead: Lead;
  onClose: () => void;
  onSave?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

const outreachTemplates: Record<string, string> = {
  just_funded:
    "Congrats on the raise! I help early-stage teams ship product design fast so you can move quickly before a full-time hire.",
  no_designer:
    "I noticed your team is engineering-heavy with no designer yet. I partner with technical teams to turn working products into something users love.",
  hiring_first_designer:
    "While you search for a full-time designer, I can keep design moving so your eng team isn't blocked.",
  accelerator_batch:
    "I've helped accelerator companies go from idea to launched product. Would love to help you ship a polished v1.",
  technical_founders:
    "As a fellow builder, I know how hard it is to wear the design hat on top of everything else. I can take that off your plate.",
  new_launch:
    "Congrats on the launch! I help early products level up their design and UX after the initial release — turning beta feedback into a polished experience.",
};

export function LeadDetail({ lead, onClose, onSave, onDismiss }: LeadDetailProps) {
  const company = lead.company!;

  const suggestedOutreach =
    company.signals
      .map((s) => outreachTemplates[s])
      .filter(Boolean)[0] || outreachTemplates["no_designer"];

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-lg bg-white shadow-xl border-l border-zinc-200 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-zinc-200 p-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900">{company.name}</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Score & Stage */}
          <div className="flex items-center gap-2">
            <span className="text-xl">{scoreIcon(company.score)}</span>
            <span
              className={`text-sm font-medium px-2.5 py-1 rounded-full border ${scoreColor(company.score)}`}
            >
              {company.score}
            </span>
            {company.stage !== "unknown" && (
              <span className="text-sm text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full">
                {formatStage(company.stage)}
              </span>
            )}
            {company.industry && (
              <span className="text-sm text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full">
                {company.industry}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-zinc-700 mb-1">About</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              {company.description}
            </p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-50 rounded-lg p-3">
              <p className="text-xs text-zinc-500">Team Size</p>
              <p className="text-lg font-bold text-zinc-900">
                {company.team_size || "—"}
              </p>
            </div>
            <div className="bg-zinc-50 rounded-lg p-3">
              <p className="text-xs text-zinc-500">Designers</p>
              <p className="text-lg font-bold text-zinc-900">
                {company.designer_count ?? "—"}
                {company.designer_count === 0 && (
                  <span className="text-red-500 text-sm ml-1">⚠️</span>
                )}
              </p>
            </div>
            <div className="bg-zinc-50 rounded-lg p-3">
              <p className="text-xs text-zinc-500">Engineers</p>
              <p className="text-lg font-bold text-zinc-900">
                {company.engineer_count || "—"}
              </p>
            </div>
            <div className="bg-zinc-50 rounded-lg p-3">
              <p className="text-xs text-zinc-500">Funding</p>
              <p className="text-lg font-bold text-zinc-900">
                {formatFunding(company.funding_amount)}
              </p>
            </div>
          </div>

          {/* Signals */}
          <div>
            <h3 className="text-sm font-medium text-zinc-700 mb-2">Signals</h3>
            <div className="flex gap-2 flex-wrap">
              {company.signals.map((signal) => (
                <span
                  key={signal}
                  className="text-xs bg-violet-50 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-full"
                >
                  {formatSignal(signal)}
                </span>
              ))}
            </div>
          </div>

          {/* Suggested Outreach */}
          <div>
            <h3 className="text-sm font-medium text-zinc-700 mb-2">
              Suggested Outreach
            </h3>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-sm text-emerald-800 leading-relaxed">
                &ldquo;{suggestedOutreach}&rdquo;
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-3">
            {company.url && (
              <a
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium px-4 py-2 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Website ↗
              </a>
            )}
            {company.source_url && (
              <a
                href={company.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium px-4 py-2 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                {company.source} ↗
              </a>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-zinc-100">
            <button
              onClick={() => onSave?.(lead.id)}
              className="flex-1 text-sm font-medium px-4 py-2.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
            >
              Save Lead
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

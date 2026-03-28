"use client";

import { FilterState } from "@/types";

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalCount: number;
  hotCount: number;
  onScrape?: () => void;
  isScraping?: boolean;
}

export function FilterBar({
  filters,
  onChange,
  totalCount,
  hotCount,
  onScrape,
  isScraping,
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <div>
          <span className="text-2xl font-bold text-zinc-900">{totalCount}</span>
          <span className="text-sm text-zinc-500 ml-1.5">jobs</span>
        </div>
        <div className="h-8 w-px bg-zinc-200" />
        <div>
          <span className="text-2xl font-bold text-red-600">{hotCount}</span>
          <span className="text-sm text-zinc-500 ml-1.5">hot</span>
        </div>
        {onScrape && (
          <>
            <div className="h-8 w-px bg-zinc-200" />
            <button
              onClick={onScrape}
              disabled={isScraping}
              className="text-xs font-medium px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isScraping ? "Scraping..." : "🔍 Scrape New Jobs"}
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search jobs..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="px-3 py-1.5 rounded-lg border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent w-56"
        />

        <select
          value={filters.score}
          onChange={(e) =>
            onChange({ ...filters, score: e.target.value as FilterState["score"] })
          }
          className="px-3 py-1.5 rounded-lg border border-zinc-200 text-sm text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
        >
          <option value="all">All Scores</option>
          <option value="hot">🔥 Hot</option>
          <option value="warm">🟡 Warm</option>
          <option value="cool">🔵 Cool</option>
        </select>

        <select
          value={filters.jobType}
          onChange={(e) =>
            onChange({
              ...filters,
              jobType: e.target.value as FilterState["jobType"],
            })
          }
          className="px-3 py-1.5 rounded-lg border border-zinc-200 text-sm text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
        >
          <option value="all">All Types</option>
          <option value="freelance">Freelance</option>
          <option value="contract">Contract</option>
          <option value="part_time">Part-Time</option>
          <option value="full_time">Full-Time</option>
        </select>

        <select
          value={filters.source}
          onChange={(e) =>
            onChange({ ...filters, source: e.target.value as FilterState["source"] })
          }
          className="px-3 py-1.5 rounded-lg border border-zinc-200 text-sm text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
        >
          <option value="all">All Sources</option>
          <option value="linkedin">💼 LinkedIn</option>
          <option value="indeed">🔍 Indeed</option>
          <option value="dribbble">🏀 Dribbble</option>
          <option value="wellfound">🚀 Wellfound</option>
          <option value="weworkremotely">🌍 We Work Remotely</option>
          <option value="upwork">💚 Upwork</option>
        </select>

        {(filters.score !== "all" ||
          filters.jobType !== "all" ||
          filters.source !== "all" ||
          filters.search) && (
          <button
            onClick={() =>
              onChange({
                score: "all",
                jobType: "all",
                source: "all",
                search: "",
              })
            }
            className="text-xs text-zinc-500 hover:text-zinc-700 underline"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import { FilterState } from "@/types";

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalCount: number;
  hotCount: number;
}

export function FilterBar({
  filters,
  onChange,
  totalCount,
  hotCount,
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <div>
          <span className="text-2xl font-bold text-zinc-900">{totalCount}</span>
          <span className="text-sm text-zinc-500 ml-1.5">leads</span>
        </div>
        <div className="h-8 w-px bg-zinc-200" />
        <div>
          <span className="text-2xl font-bold text-red-600">{hotCount}</span>
          <span className="text-sm text-zinc-500 ml-1.5">hot</span>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search companies..."
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
          value={filters.stage}
          onChange={(e) =>
            onChange({ ...filters, stage: e.target.value as FilterState["stage"] })
          }
          className="px-3 py-1.5 rounded-lg border border-zinc-200 text-sm text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
        >
          <option value="all">All Stages</option>
          <option value="pre_seed">Pre-Seed</option>
          <option value="seed">Seed</option>
          <option value="series_a">Series A</option>
          <option value="series_b">Series B</option>
          <option value="series_c">Series C</option>
        </select>

        <select
          value={filters.source}
          onChange={(e) => onChange({ ...filters, source: e.target.value })}
          className="px-3 py-1.5 rounded-lg border border-zinc-200 text-sm text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
        >
          <option value="all">All Sources</option>
          <option value="crunchbase">Crunchbase</option>
          <option value="producthunt">Product Hunt</option>
          <option value="yc">Y Combinator</option>
        </select>

        {(filters.score !== "all" ||
          filters.stage !== "all" ||
          filters.source !== "all" ||
          filters.search) && (
          <button
            onClick={() =>
              onChange({ score: "all", stage: "all", source: "all", search: "" })
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

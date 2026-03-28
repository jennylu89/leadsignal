"use client";

import { useState, useMemo } from "react";
import { mockLeads } from "@/lib/mock-data";
import { FilterState, Lead } from "@/types";
import { FilterBar } from "@/components/FilterBar";
import { LeadCard } from "@/components/LeadCard";
import { LeadDetail } from "@/components/LeadDetail";

export default function FeedPage() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [filters, setFilters] = useState<FilterState>({
    score: "all",
    stage: "all",
    source: "all",
    search: "",
  });
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => lead.status !== "dismissed")
      .filter((lead) => {
        const c = lead.company!;
        if (filters.score !== "all" && c.score !== filters.score) return false;
        if (filters.stage !== "all" && c.stage !== filters.stage) return false;
        if (filters.source !== "all" && c.source !== filters.source)
          return false;
        if (
          filters.search &&
          !c.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !c.description?.toLowerCase().includes(filters.search.toLowerCase()) &&
          !c.industry?.toLowerCase().includes(filters.search.toLowerCase())
        )
          return false;
        return true;
      })
      .sort((a, b) => {
        const scoreOrder = { hot: 0, warm: 1, cool: 2 };
        return (
          scoreOrder[a.company!.score] - scoreOrder[b.company!.score] ||
          new Date(b.company!.created_at).getTime() -
            new Date(a.company!.created_at).getTime()
        );
      });
  }, [leads, filters]);

  const hotCount = filteredLeads.filter(
    (l) => l.company!.score === "hot"
  ).length;

  const selectedLead = selectedLeadId
    ? leads.find((l) => l.id === selectedLeadId)
    : null;

  function updateLeadStatus(id: string, status: Lead["status"]) {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
    if (status === "dismissed") setSelectedLeadId(null);
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Lead Feed</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Companies that likely need freelance product design help
        </p>
      </div>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        totalCount={filteredLeads.length}
        hotCount={hotCount}
      />

      <div className="mt-6 space-y-3">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-zinc-400 text-lg">No leads match your filters</p>
            <button
              onClick={() =>
                setFilters({
                  score: "all",
                  stage: "all",
                  source: "all",
                  search: "",
                })
              }
              className="text-sm text-zinc-600 underline mt-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onSave={(id) => updateLeadStatus(id, "saved")}
              onDismiss={(id) => updateLeadStatus(id, "dismissed")}
              onSelect={setSelectedLeadId}
            />
          ))
        )}
      </div>

      {selectedLead && (
        <LeadDetail
          lead={selectedLead}
          onClose={() => setSelectedLeadId(null)}
          onSave={(id) => updateLeadStatus(id, "saved")}
          onDismiss={(id) => updateLeadStatus(id, "dismissed")}
        />
      )}
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { FilterState, Lead } from "@/types";
import { FilterBar } from "@/components/FilterBar";
import { LeadCard } from "@/components/LeadCard";
import { LeadDetail } from "@/components/LeadDetail";

export default function FeedPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    score: "all",
    jobType: "all",
    source: "all",
    search: "",
  });
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isScraping, setIsScraping] = useState(false);

  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => lead.status !== "dismissed")
      .filter((lead) => {
        const j = lead.job!;
        if (filters.score !== "all" && j.score !== filters.score) return false;
        if (filters.jobType !== "all" && j.job_type !== filters.jobType)
          return false;
        if (filters.source !== "all" && j.source !== filters.source)
          return false;
        if (
          filters.search &&
          !j.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !j.company_name
            .toLowerCase()
            .includes(filters.search.toLowerCase()) &&
          !j.description
            ?.toLowerCase()
            .includes(filters.search.toLowerCase())
        )
          return false;
        return true;
      })
      .sort((a, b) => {
        const scoreOrder = { hot: 0, warm: 1, cool: 2 };
        return (
          scoreOrder[a.job!.score] - scoreOrder[b.job!.score] ||
          new Date(b.job!.created_at).getTime() -
            new Date(a.job!.created_at).getTime()
        );
      });
  }, [leads, filters]);

  const hotCount = filteredLeads.filter((l) => l.job!.score === "hot").length;

  const selectedLead = selectedLeadId
    ? leads.find((l) => l.id === selectedLeadId)
    : null;

  function updateLeadStatus(id: string, status: Lead["status"]) {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
    if (status === "dismissed") setSelectedLeadId(null);
  }

  async function handleScrape() {
    setIsScraping(true);
    try {
      const res = await fetch("/api/scrape", { method: "POST" });
      const data = await res.json();
      if (data.leads) {
        setLeads((prev) => {
          const existingUrls = new Set(prev.map((l) => l.job?.source_url));
          const newLeads: Lead[] = data.leads
            .filter(
              (job: Lead["job"]) => job && !existingUrls.has(job.source_url)
            )
            .map((job: Lead["job"], i: number) => ({
              id: `scraped-${Date.now()}-${i}`,
              job_id: job!.id || `scraped-${i}`,
              status: "new" as const,
              notes: null,
              updated_at: new Date().toISOString(),
              job,
            }));
          return [...newLeads, ...prev];
        });
      }
    } catch {
      // scrape failed silently
    }
    setIsScraping(false);
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Job Feed</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Freelance product designer jobs posted in the last 7 days
        </p>
      </div>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        totalCount={filteredLeads.length}
        hotCount={hotCount}
        onScrape={handleScrape}
        isScraping={isScraping}
      />

      <div className="mt-6 space-y-3">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-zinc-400 text-lg">No jobs match your filters</p>
            <button
              onClick={() =>
                setFilters({
                  score: "all",
                  jobType: "all",
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

"use client";

import { useState } from "react";
import { Lead } from "@/types";
import { LeadCard } from "@/components/LeadCard";
import { LeadDetail } from "@/components/LeadDetail";

export default function SavedPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const savedLeads = leads.filter((l) => l.status === "saved");
  const appliedLeads = leads.filter(
    (l) => l.status === "applied" || l.status === "replied"
  );

  const selectedLead = selectedLeadId
    ? leads.find((l) => l.id === selectedLeadId)
    : null;

  function updateLeadStatus(id: string, status: Lead["status"]) {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Saved Jobs</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Jobs you&apos;re interested in pursuing
        </p>
      </div>

      {savedLeads.length === 0 && appliedLeads.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">⭐</p>
          <p className="text-zinc-400 text-lg">No saved jobs yet</p>
          <p className="text-sm text-zinc-400 mt-1">
            Save jobs from the feed to track them here
          </p>
        </div>
      ) : (
        <>
          {savedLeads.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">
                Saved ({savedLeads.length})
              </h2>
              <div className="space-y-3">
                {savedLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onDismiss={(id) => updateLeadStatus(id, "dismissed")}
                    onSelect={setSelectedLeadId}
                  />
                ))}
              </div>
            </div>
          )}

          {appliedLeads.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">
                Applied ({appliedLeads.length})
              </h2>
              <div className="space-y-3">
                {appliedLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onSelect={setSelectedLeadId}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

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

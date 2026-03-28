"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    industries: [] as string[],
    stages: [] as string[],
    minTeamSize: "",
    maxTeamSize: "",
    sources: ["crunchbase", "producthunt", "yc"],
    emailDigest: false,
    digestEmail: "",
  });

  const industries = [
    "AI / Machine Learning",
    "Developer Tools",
    "Fintech",
    "Health Tech",
    "Climate Tech",
    "SaaS / Collaboration",
    "Productivity",
    "E-commerce",
    "Education",
    "Other",
  ];

  const stages = [
    { value: "pre_seed", label: "Pre-Seed" },
    { value: "seed", label: "Seed" },
    { value: "series_a", label: "Series A" },
    { value: "series_b", label: "Series B" },
    { value: "series_c", label: "Series C" },
  ];

  const sources = [
    { value: "crunchbase", label: "Crunchbase" },
    { value: "producthunt", label: "Product Hunt" },
    { value: "yc", label: "Y Combinator" },
    { value: "hackernews", label: "Hacker News" },
  ];

  function toggleIndustry(industry: string) {
    setSettings((prev) => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter((i) => i !== industry)
        : [...prev.industries, industry],
    }));
  }

  function toggleStage(stage: string) {
    setSettings((prev) => ({
      ...prev,
      stages: prev.stages.includes(stage)
        ? prev.stages.filter((s) => s !== stage)
        : [...prev.stages, stage],
    }));
  }

  function toggleSource(source: string) {
    setSettings((prev) => ({
      ...prev,
      sources: prev.sources.includes(source)
        ? prev.sources.filter((s) => s !== source)
        : [...prev.sources, source],
    }));
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Configure your lead preferences
        </p>
      </div>

      <div className="space-y-8">
        {/* Industries */}
        <section>
          <h2 className="text-sm font-medium text-zinc-700 mb-3">
            Preferred Industries
          </h2>
          <p className="text-xs text-zinc-400 mb-3">
            Leave empty to see all industries
          </p>
          <div className="flex flex-wrap gap-2">
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => toggleIndustry(industry)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  settings.industries.includes(industry)
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </section>

        {/* Stages */}
        <section>
          <h2 className="text-sm font-medium text-zinc-700 mb-3">
            Company Stages
          </h2>
          <p className="text-xs text-zinc-400 mb-3">
            Which funding stages are you targeting?
          </p>
          <div className="flex flex-wrap gap-2">
            {stages.map((stage) => (
              <button
                key={stage.value}
                onClick={() => toggleStage(stage.value)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  settings.stages.includes(stage.value)
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                }`}
              >
                {stage.label}
              </button>
            ))}
          </div>
        </section>

        {/* Team Size */}
        <section>
          <h2 className="text-sm font-medium text-zinc-700 mb-3">Team Size</h2>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="Min"
              value={settings.minTeamSize}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, minTeamSize: e.target.value }))
              }
              className="w-24 px-3 py-1.5 rounded-lg border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            <span className="text-zinc-400 text-sm">to</span>
            <input
              type="number"
              placeholder="Max"
              value={settings.maxTeamSize}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, maxTeamSize: e.target.value }))
              }
              className="w-24 px-3 py-1.5 rounded-lg border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            <span className="text-xs text-zinc-400">employees</span>
          </div>
        </section>

        {/* Data Sources */}
        <section>
          <h2 className="text-sm font-medium text-zinc-700 mb-3">
            Data Sources
          </h2>
          <div className="space-y-2">
            {sources.map((source) => (
              <label
                key={source.value}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={settings.sources.includes(source.value)}
                  onChange={() => toggleSource(source.value)}
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                />
                <span className="text-sm text-zinc-700">{source.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Email Digest */}
        <section>
          <h2 className="text-sm font-medium text-zinc-700 mb-3">
            Email Digest
          </h2>
          <label className="flex items-center gap-3 cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={settings.emailDigest}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  emailDigest: e.target.checked,
                }))
              }
              className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
            />
            <span className="text-sm text-zinc-700">
              Send me a weekly email with new hot leads
            </span>
          </label>
          {settings.emailDigest && (
            <input
              type="email"
              placeholder="your@email.com"
              value={settings.digestEmail}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  digestEmail: e.target.value,
                }))
              }
              className="w-full max-w-xs px-3 py-1.5 rounded-lg border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          )}
        </section>

        {/* Supabase Connection */}
        <section className="border-t border-zinc-200 pt-8">
          <h2 className="text-sm font-medium text-zinc-700 mb-3">
            Database Connection
          </h2>
          <p className="text-xs text-zinc-400 mb-4">
            Connect your Supabase project to enable live data and scrapers.
            Currently running with mock data.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              Running in demo mode with mock data. Set{" "}
              <code className="bg-amber-100 px-1 py-0.5 rounded text-xs">
                NEXT_PUBLIC_SUPABASE_URL
              </code>{" "}
              and{" "}
              <code className="bg-amber-100 px-1 py-0.5 rounded text-xs">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>{" "}
              in your{" "}
              <code className="bg-amber-100 px-1 py-0.5 rounded text-xs">
                .env.local
              </code>{" "}
              to connect.
            </p>
          </div>
        </section>

        <button className="px-6 py-2.5 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );
}

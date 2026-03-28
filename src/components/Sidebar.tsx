"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Job Feed", icon: "📡" },
  { href: "/saved", label: "Saved", icon: "⭐" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

const externalBoards = [
  {
    label: "LinkedIn Freelance",
    url: "https://www.linkedin.com/jobs/freelance-product-designer-jobs",
    icon: "💼",
  },
  {
    label: "Indeed Freelance",
    url: "https://www.indeed.com/q-freelance-product-designer-jobs.html",
    icon: "🔍",
  },
  {
    label: "Wellfound Startups",
    url: "https://wellfound.com/role/r/product-designer",
    icon: "🚀",
  },
  {
    label: "Toptal Freelance",
    url: "https://www.toptal.com/freelance-jobs/designers/product-design",
    icon: "💎",
  },
  {
    label: "Contra Freelance",
    url: "https://contra.com/featured-jobs/freelance-ux-jobs",
    icon: "✨",
  },
  {
    label: "Dribbble Jobs",
    url: "https://dribbble.com/remote-product-design-jobs",
    icon: "🏀",
  },
  {
    label: "Thirdwork Contract",
    url: "https://www.thirdwork.xyz/careers/ui-ux-designer-contract-remote",
    icon: "🌐",
  },
  {
    label: "UIUXJobsBoard",
    url: "https://uiuxjobsboard.com/design-jobs/freelance",
    icon: "🎨",
  },
  {
    label: "X2Talent Board",
    url: "https://x2talentjobboard.notion.site/X2Talent-Job-Board-303dd4da463580669031d72da87b4806",
    icon: "📋",
  },
  {
    label: "YC Startups",
    url: "https://www.workatastartup.com/companies?role=design",
    icon: "🟧",
  },
  {
    label: "Pittsburgh UX",
    url: "https://www.ziprecruiter.com/Jobs/Freelance-Ux-Design/-in-Pittsburgh,PA",
    icon: "📍",
  },
  {
    label: "PGH Startups (Wellfound)",
    url: "https://wellfound.com/startups/location/pittsburgh",
    icon: "🏙️",
  },
  {
    label: "YC Jobs Pittsburgh",
    url: "https://www.ycombinator.com/jobs/location/pittsburgh",
    icon: "🟧",
  },
  {
    label: "Built In Pittsburgh",
    url: "https://builtin.com/companies/location/na/usa/pa/pittsburgh/startups",
    icon: "🏗️",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 border-r border-zinc-200 bg-white flex flex-col">
      <div className="p-5 border-b border-zinc-200">
        <h1 className="text-lg font-bold text-zinc-900 tracking-tight">
          ⚡ LeadSignal
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Freelance designer job finder
        </p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-zinc-100">
          <p className="px-3 text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
            External Boards
          </p>
          {externalBoards.map((board) => (
            <a
              key={board.url}
              href={board.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
            >
              <span className="text-base">{board.icon}</span>
              {board.label}
              <span className="text-xs text-zinc-400 ml-auto">↗</span>
            </a>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-zinc-200">
        <div className="rounded-lg bg-zinc-50 p-3">
          <p className="text-xs font-medium text-zinc-700">All your job boards</p>
          <p className="text-xs text-zinc-400 mt-1">One click away ↗</p>
        </div>
      </div>
    </aside>
  );
}

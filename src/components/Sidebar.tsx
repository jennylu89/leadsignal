"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Feed", icon: "📡" },
  { href: "/saved", label: "Saved", icon: "⭐" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
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
          Find clients before they post
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
      </nav>

      <div className="p-4 border-t border-zinc-200">
        <div className="rounded-lg bg-zinc-50 p-3">
          <p className="text-xs font-medium text-zinc-700">This Week</p>
          <p className="text-2xl font-bold text-zinc-900 mt-1">8</p>
          <p className="text-xs text-zinc-500">new leads found</p>
        </div>
      </div>
    </aside>
  );
}

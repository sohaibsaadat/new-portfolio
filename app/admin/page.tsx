"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ADMIN_NAV, adminRequest } from "./adminApi";

const DASHBOARD_SECTIONS = [
  { label: "Projects", endpoint: "get-all-project", href: "/admin/projects", key: "projects" },
  { label: "Skills", endpoint: "get-all-skills", href: "/admin/skills", key: "skills" },
];

export default function AdminOverview() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all(DASHBOARD_SECTIONS.map(async (section) => {
      const result = await adminRequest<Record<string, unknown>>(section.endpoint);
      const entries = result[section.key];
      return [section.key, Array.isArray(entries) ? entries.length : 0] as const;
    }))
      .then((entries) => setCounts(Object.fromEntries(entries)))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load dashboard."));
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm text-orange-300">Workspace</p><h1 className="mt-1 text-3xl font-semibold">Overview</h1><p className="mt-2 text-sm text-zinc-400">Manage the content displayed on your portfolio.</p></div>
        <Link href="/admin/projects" className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-orange-400">Add a project</Link>
      </div>
      {error && <p role="alert" className="mt-6 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {DASHBOARD_SECTIONS.map((section) => <Link key={section.key} href={section.href} className="rounded-2xl border border-white/10 bg-zinc-900 p-6 hover:border-orange-400/40">
          <p className="text-sm text-zinc-400">{section.label}</p><p className="mt-3 text-4xl font-semibold">{counts[section.key] ?? "—"}</p><p className="mt-3 text-sm text-orange-300">Manage {section.label.toLowerCase()} →</p>
        </Link>)}
        {ADMIN_NAV.slice(3).map((item) => <Link key={item.href} href={item.href} className="rounded-2xl border border-white/10 bg-zinc-900 p-6 hover:border-orange-400/40">
          <p className="text-sm text-zinc-400">Portfolio settings</p><p className="mt-3 text-xl font-semibold">{item.label}</p><p className="mt-3 text-sm text-orange-300">Edit {item.label.toLowerCase()} →</p>
        </Link>)}
      </div>
    </div>
  );
}
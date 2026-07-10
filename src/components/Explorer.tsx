"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Entry } from "@/lib/types";
import { ConfidenceBadge, StageBadge } from "@/components/badges";
import { hostOf } from "@/lib/format";

type ConfidenceFilter = "any" | "high" | "medium" | "independent";

interface Filters {
  q: string;
  region: string;
  country: string;
  industry: string;
  department: string;
  vendor: string;
  stage: string;
  confidence: ConfidenceFilter;
}

const EMPTY: Filters = {
  q: "",
  region: "",
  country: "",
  industry: "",
  department: "",
  vendor: "",
  stage: "",
  confidence: "any",
};

const MARKETING = new Set(["vendor_case_study", "press_release"]);

function uniqueValues(entries: Entry[], key: keyof Entry): string[] {
  return [...new Set(entries.map((e) => String(e[key])).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

function matches(e: Entry, f: Filters): boolean {
  if (f.region && e.region !== f.region) return false;
  if (f.country && e.company_country !== f.country) return false;
  if (f.industry && e.industry !== f.industry) return false;
  if (f.department && e.department !== f.department) return false;
  if (f.vendor && e.vendor !== f.vendor) return false;
  if (f.stage && e.deployment_stage !== f.stage) return false;
  if (f.confidence === "high" && e.confidence < 0.7) return false;
  if (f.confidence === "medium" && e.confidence < 0.5) return false;
  if (f.confidence === "independent" && e.sources.every((s) => MARKETING.has(s.source_type)))
    return false;
  if (f.q) {
    const hay = [e.company, e.solution_name, e.vendor, e.use_case, e.company_country, e.industry]
      .join(" ")
      .toLowerCase();
    if (!hay.includes(f.q.toLowerCase())) return false;
  }
  return true;
}

function Select({
  label,
  value,
  onChange,
  options,
  anyLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  anyLabel: string;
}) {
  return (
    <label className="flex min-w-36 flex-1 flex-col gap-1 sm:flex-none">
      <span className="kicker text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-lavender-line bg-paper px-2.5 py-2 text-sm text-ink outline-none transition-colors focus:border-mauve"
      >
        <option value="">{anyLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function Explorer({ entries }: { entries: Entry[] }) {
  const [f, setF] = useState<Filters>(EMPTY);
  const set = (patch: Partial<Filters>) => setF((prev) => ({ ...prev, ...patch }));

  const results = useMemo(
    () => entries.filter((e) => matches(e, f)).sort((a, b) => a.company.localeCompare(b.company)),
    [entries, f],
  );
  const active = JSON.stringify(f) !== JSON.stringify(EMPTY);
  const opt = (vals: string[]) => vals.map((v) => ({ value: v, label: v }));

  return (
    <div className="mt-8">
      {/* ===== Toolbar ===== */}
      <div className="rounded-2xl border border-lavender-line bg-lilac-soft p-4 md:p-5">
        <input
          type="search"
          value={f.q}
          onChange={(e) => set({ q: e.target.value })}
          placeholder="Search company, solution, vendor or use case…"
          aria-label="Search the index"
          className="w-full rounded-xl border border-lavender-line bg-paper px-4 py-3 text-[0.95rem] outline-none transition-colors placeholder:text-muted focus:border-mauve"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <Select label="Region" value={f.region} onChange={(v) => set({ region: v })} options={opt(uniqueValues(entries, "region"))} anyLabel="All regions" />
          <Select label="Country" value={f.country} onChange={(v) => set({ country: v })} options={opt(uniqueValues(entries, "company_country"))} anyLabel="All countries" />
          <Select label="Industry" value={f.industry} onChange={(v) => set({ industry: v })} options={opt(uniqueValues(entries, "industry"))} anyLabel="All industries" />
          <Select label="Department" value={f.department} onChange={(v) => set({ department: v })} options={opt(uniqueValues(entries, "department"))} anyLabel="All departments" />
          <Select label="Vendor" value={f.vendor} onChange={(v) => set({ vendor: v })} options={opt(uniqueValues(entries, "vendor"))} anyLabel="All vendors" />
          <Select
            label="Stage"
            value={f.stage}
            onChange={(v) => set({ stage: v })}
            options={[
              { value: "production", label: "In production" },
              { value: "pilot", label: "Pilot" },
              { value: "announced", label: "Announced" },
              { value: "unknown", label: "Unknown" },
            ]}
            anyLabel="All stages"
          />
          <Select
            label="Confidence"
            value={f.confidence}
            onChange={(v) => set({ confidence: v as ConfidenceFilter })}
            options={[
              { value: "high", label: "High (≥ 70%)" },
              { value: "medium", label: "Medium+ (≥ 50%)" },
              { value: "independent", label: "Independently sourced" },
            ]}
            anyLabel="Any confidence"
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-sm text-muted">
            <span className="font-bold text-ink">{results.length}</span>
            {" "}of {entries.length} deployments
          </p>
          {active && (
            <button
              onClick={() => setF(EMPTY)}
              className="text-sm font-bold text-mauve transition-colors hover:text-mauve-deep"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* ===== Results ===== */}
      {results.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-lavender-line p-12 text-center">
          {entries.length === 0 ? (
            <>
              <p className="text-lg font-bold">The catalog is empty right now.</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                The curation engine has not completed its first discovery run
                yet. Entries appear here automatically once verified deployments
                are found.
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-bold">No deployment matches these filters.</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                Your search and filters excluded every entry. Loosen a filter or
                clear everything to start over.
              </p>
              <button
                onClick={() => setF(EMPTY)}
                className="mt-5 rounded-full bg-mauve px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-mauve-deep"
              >
                Reset all filters
              </button>
            </>
          )}
        </div>
      ) : (
        <ul className="mt-8 grid gap-5 pb-4 md:grid-cols-2">
          {results.map((e) => (
            <li key={e.id}>
              <Link
                href={`/entry/${e.id}`}
                className="group flex h-full flex-col rounded-2xl border border-lavender-line bg-paper p-5 transition-all hover:-translate-y-0.5 hover:border-mauve hover:shadow-[0_10px_30px_-12px_rgb(124_58_237/0.35)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-extrabold leading-snug">{e.company}</p>
                    <p className="mt-0.5 text-sm font-bold text-mauve">
                      {e.solution_name}
                      {e.vendor && e.vendor !== e.solution_name && (
                        <span className="font-semibold text-muted"> · {e.vendor}</span>
                      )}
                    </p>
                  </div>
                  <span className="kicker shrink-0 rounded bg-lilac px-2 py-1 text-mauve-deep">
                    {e.region}
                  </span>
                </div>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-soft">
                  {e.use_case}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <StageBadge stage={e.deployment_stage} />
                  <ConfidenceBadge entry={e} />
                  <span className="ml-auto text-xs text-muted">
                    {e.sources.length} source{e.sources.length > 1 ? "s" : ""}
                    {e.sources[0] ? ` · ${hostOf(e.sources[0].url)}` : ""}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

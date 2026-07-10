import Link from "next/link";
import { getEntries, getStats } from "@/lib/data";
import { formatTimestamp } from "@/lib/format";
import Explorer from "@/components/Explorer";

export default function Home() {
  const entries = getEntries();
  const stats = getStats();

  return (
    <main>
      {/* ===== Hero — HUBFORUM-style violet night ===== */}
      <section className="relative overflow-hidden bg-mauve-night text-white">
        <div className="hero-glow absolute inset-0" aria-hidden />
        <div className="hero-grid absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-20 md:pb-24 md:pt-28">
          <p className="kicker text-mauve-bright">The living encyclopedia · updated autonomously</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-[1.02] tracking-tight md:text-6xl">
            AI agents at work,
            <br />
            <span className="text-mauve-bright">verified</span> company by company
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            Agentipedia catalogs real deployments of AI agents inside named
            companies, worldwide. Every entry names both the company and the
            exact solution, and links the sources that prove it. No source, no
            entry.
          </p>

          <div className="mt-10 flex flex-wrap items-end gap-x-12 gap-y-6">
            <div>
              <p className="text-5xl font-black text-mauve-glow md:text-6xl">{stats.entries}</p>
              <p className="kicker mt-1 text-white/60">verified deployments</p>
            </div>
            <div>
              <p className="text-5xl font-black text-mauve-glow md:text-6xl">{stats.countries}</p>
              <p className="kicker mt-1 text-white/60">countries</p>
            </div>
            <div>
              <p className="text-5xl font-black text-mauve-glow md:text-6xl">{stats.regions}</p>
              <p className="kicker mt-1 text-white/60">world regions</p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#index"
              className="rounded-full bg-mauve px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-mauve-deep"
            >
              Browse the index
            </a>
            <Link
              href="/methodology"
              className="rounded-full border border-white/25 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white/90 transition-colors hover:border-mauve-bright hover:text-mauve-glow"
            >
              How entries are verified
            </Link>
            <p className="text-xs text-white/50">
              Last updated:{" "}
              {stats.updatedAt ? formatTimestamp(stats.updatedAt) : "awaiting first curation run"}
            </p>
          </div>
        </div>
      </section>

      {/* ===== Index ===== */}
      <section id="index" className="mx-auto max-w-6xl scroll-mt-20 px-6 pt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="kicker text-mauve">Deployment index</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">
              Who runs what, where
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted">
            Search companies, solutions and vendors, or narrow by geography,
            industry, department, stage and confidence.
          </p>
        </div>
        <Explorer entries={entries} />
      </section>
    </main>
  );
}

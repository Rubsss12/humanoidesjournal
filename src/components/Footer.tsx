import Link from "next/link";
import { getStats } from "@/lib/data";
import { formatTimestamp } from "@/lib/format";

export default function Footer() {
  const stats = getStats();
  return (
    <footer className="mt-20 bg-mauve-night text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold uppercase tracking-[0.08em]">
            Agenti<span className="text-mauve-bright">pedia</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
            The living encyclopedia of AI agents at work. Real companies, named
            solutions, verified sources — worldwide.
          </p>
        </div>
        <div>
          <p className="kicker text-mauve-bright">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>
              <Link href="/" className="transition-colors hover:text-mauve-glow">Deployment index</Link>
            </li>
            <li>
              <Link href="/methodology" className="transition-colors hover:text-mauve-glow">
                Methodology &amp; sourcing standard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="kicker text-mauve-bright">Status</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>{stats.entries} verified deployments</li>
            <li>{stats.countries} countries · {stats.regions} regions</li>
            <li>
              Last updated:{" "}
              {stats.updatedAt ? formatTimestamp(stats.updatedAt) : "awaiting first curation run"}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-6 py-5 text-xs text-white/50">
          Updated autonomously by the Agentipedia curation engine. Entries that
          cannot name both the company and the exact solution are rejected —
          every rejection is logged.
        </p>
      </div>
    </footer>
  );
}

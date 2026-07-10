import type { Metadata } from "next";
import { getStats } from "@/lib/data";
import { formatTimestamp } from "@/lib/format";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "The two-field rule, the sourcing standard and the confidence policy behind every Agentipedia entry.",
};

export default function MethodologyPage() {
  const stats = getStats();
  return (
    <main className="mx-auto max-w-3xl px-6 pb-8 pt-12">
      <p className="kicker text-mauve">Methodology</p>
      <h1 className="mt-2 text-4xl font-black uppercase tracking-tight">
        How an entry earns its place
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">
        Agentipedia is curated by an autonomous engine that searches the live
        web, extracts candidate deployments and applies one strict rule. A
        smaller accurate encyclopedia beats a larger fabricated one, so the
        engine rejects anything it cannot verify — and logs every rejection.
      </p>

      <section className="mt-10 rounded-2xl border-2 border-mauve bg-lilac-soft p-6">
        <h2 className="text-xl font-black uppercase tracking-tight text-mauve-deep">
          The two-field rule
        </h2>
        <p className="mt-3 leading-relaxed">
          An entry exists only when a retrieved source names <strong>both</strong>:
        </p>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed">
          <li className="rounded-xl bg-paper p-4">
            <strong className="text-mauve-deep">1 · The company.</strong> A real,
            identifiable organization by its actual name — Klarna, JPMorgan,
            Rakuten, Air India. Never “a large retailer” or “a European bank”.
          </li>
          <li className="rounded-xl bg-paper p-4">
            <strong className="text-mauve-deep">2 · The named solution.</strong>{" "}
            A named product, platform or internally branded agent — Salesforce
            Agentforce, Sierra, Bank of America Erica, Mercado Libre Verdi on
            Gemini. Never “a chatbot” or “an LLM”.
          </li>
        </ol>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          If either field is missing, generic or unverifiable against a source
          the engine actually retrieved, the candidate is rejected. Rejections
          are recorded with a one-line reason in a public log
          (<code className="rounded bg-lilac px-1 py-0.5 text-xs">data/rejections.json</code>).
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-black uppercase tracking-tight">The sourcing standard</h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
          <li className="rounded-xl border border-lavender-line p-4">
            <strong className="text-ink">No source, no entry.</strong> Every entry
            traces to at least one source retrieved through live web search
            during a curation run. Cited URLs must have appeared in that run’s
            search results — a URL the run never saw is treated as fabricated
            and the candidate is rejected.
          </li>
          <li className="rounded-xl border border-lavender-line p-4">
            <strong className="text-ink">Empty beats invented.</strong> If a
            detail — vendor, department, metric, date — is not in a source, the
            field stays empty. Gaps are never filled with plausible guesses.
          </li>
          <li className="rounded-xl border border-lavender-line p-4">
            <strong className="text-ink">Claimed is not confirmed.</strong> Every
            source is typed: company official, earnings call, news media,
            conference talk, vendor case study, press release, or other. Vendor
            case studies and press releases are marketing — usable, but always
            labeled, and their metrics are shown as claims.
          </li>
          <li className="rounded-xl border border-lavender-line p-4">
            <strong className="text-ink">Conflicts stay visible.</strong> When
            sources disagree, both are kept and the confidence drops, with the
            conflict noted in the confidence reason.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-black uppercase tracking-tight">The confidence score</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Each entry carries a confidence between 0 and 1 with a written
          reason. Two hard policies apply:
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-soft">
          <li className="rounded-xl bg-warn-bg p-4 font-semibold text-warn">
            Entries whose only evidence is vendor marketing are capped at 50%,
            whatever the marketing says.
          </li>
          <li className="rounded-xl bg-ok-bg p-4 font-semibold text-ok">
            “Confirmed” (≥ 70%) requires at least one independent source —
            news media, an earnings call, a conference talk or an official
            company channel.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-black uppercase tracking-tight">How the site stays current</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          A scheduled curation run executes daily without human input: it
          generates fresh discovery queries across industries, regions and
          languages (the matrix rotates so non-English press is searched, not
          just US and EU coverage), searches the live web, applies the rule in
          deterministic code, deduplicates against the existing catalog — the
          same company plus the same solution is an update, never a second
          entry — and rebuilds this site. The data store
          (<code className="rounded bg-lilac px-1 py-0.5 text-xs">data/entries.json</code>)
          is the single source of truth, so any entry can be audited or
          corrected by hand.
        </p>
        <p className="mt-4 text-sm text-muted">
          Catalog now: {stats.entries} entries · {stats.countries} countries ·
          last updated{" "}
          {stats.updatedAt ? formatTimestamp(stats.updatedAt) : "— awaiting first run"}.
        </p>
      </section>

      <section className="mt-10 rounded-2xl border border-lavender-line p-6">
        <h2 className="text-xl font-black uppercase tracking-tight">Spotted an error?</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Every entry links its sources, so you can check any claim in one
          click. If a deployment was discontinued or a detail is wrong, correct
          the entry in{" "}
          <code className="rounded bg-lilac px-1 py-0.5 text-xs">data/entries.json</code>{" "}
          via a pull request — the store is designed to be audited by humans.
        </p>
      </section>
    </main>
  );
}

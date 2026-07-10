import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEntries, getEntry, isVendorSourced, SOURCE_TYPE_LABELS } from "@/lib/data";
import { ConfidenceBadge, StageBadge, SourceTypeChip } from "@/components/badges";
import { confidencePercent, formatDate, hostOf } from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return getEntries().map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const e = getEntry(id);
  if (!e) return {};
  return {
    title: `${e.company} × ${e.solution_name}`,
    description: e.use_case,
  };
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-lavender-line bg-lilac-soft px-4 py-3">
      <p className="kicker text-muted">{label}</p>
      <p className="mt-1 text-sm font-bold">{value || "—"}</p>
    </div>
  );
}

export default async function EntryPage({ params }: Props) {
  const { id } = await params;
  const entry = getEntry(id);
  if (!entry) notFound();

  return (
    <main className="mx-auto max-w-4xl px-6 pb-8 pt-10">
      <nav className="text-sm text-muted">
        <Link href="/" className="font-bold text-mauve transition-colors hover:text-mauve-deep">
          ← Back to the index
        </Link>
      </nav>

      <header className="mt-6">
        <p className="kicker text-mauve">
          {entry.region} · {entry.company_country}
        </p>
        <h1 className="mt-2 text-3xl font-black uppercase leading-tight tracking-tight md:text-4xl">
          {entry.company}
        </h1>
        <p className="mt-2 text-xl font-bold text-mauve-deep">
          {entry.solution_name}
          {entry.vendor && entry.vendor !== entry.solution_name && (
            <span className="text-muted"> · vendor: {entry.vendor}</span>
          )}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <StageBadge stage={entry.deployment_stage} />
          <ConfidenceBadge entry={entry} />
        </div>
      </header>

      <section className="mt-8">
        <p className="kicker text-muted">What the agent does</p>
        <p className="mt-2 text-lg leading-relaxed text-ink-soft">{entry.use_case}</p>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        <Fact label="Industry" value={entry.industry} />
        <Fact label="Department" value={entry.department} />
        <Fact label="Vendor" value={entry.vendor} />
        <Fact label="Country" value={entry.company_country} />
        <Fact label="Region" value={entry.region} />
        <Fact label="First catalogued" value={formatDate(entry.first_seen_date)} />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-black uppercase tracking-tight">Reported outcomes</h2>
        {entry.reported_outcomes.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            No measurable outcomes were reported in the sources. Fields stay
            empty rather than guessed.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {entry.reported_outcomes.map((o, i) => (
              <li
                key={i}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-lavender-line px-4 py-3"
              >
                <div>
                  <p className="text-sm font-bold">{o.metric}</p>
                  <p className="text-lg font-black text-mauve">{o.value}</p>
                </div>
                <div className="text-right">
                  <SourceTypeChip type={o.source_type} />
                  <p className="mt-1 text-[0.7rem] text-muted">
                    {o.source_type === "vendor_case_study" || o.source_type === "press_release"
                      ? "claimed, not independently confirmed"
                      : "as reported by this source type"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10 rounded-2xl border border-lavender-line bg-lilac-soft p-5">
        <h2 className="text-xl font-black uppercase tracking-tight">
          Confidence: {confidencePercent(entry.confidence)}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{entry.confidence_reason}</p>
        {isVendorSourced(entry) && (
          <p className="mt-3 rounded-lg bg-warn-bg px-3 py-2 text-sm font-semibold text-warn">
            All evidence for this entry comes from vendor marketing (case
            studies or press releases). Confidence is capped at 50% until an
            independent source confirms it.
          </p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-black uppercase tracking-tight">Sources</h2>
        <ul className="mt-4 space-y-3">
          {entry.sources.map((s, i) => (
            <li key={i} className="rounded-xl border border-lavender-line px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <SourceTypeChip type={s.source_type} />
                <span className="text-xs font-bold text-muted">{s.publisher}</span>
                <span className="ml-auto text-xs text-muted">
                  retrieved {formatDate(s.retrieved_date)}
                </span>
              </div>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 block font-bold text-mauve-deep underline-offset-4 transition-colors hover:text-mauve hover:underline"
              >
                {s.title}
              </a>
              <p className="text-xs text-muted">{hostOf(s.url)}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted">
          Source types explained on the{" "}
          <Link href="/methodology" className="font-bold text-mauve hover:underline">
            methodology page
          </Link>
          . Types: {Object.values(SOURCE_TYPE_LABELS).join(", ").toLowerCase()}.
        </p>
      </section>
    </main>
  );
}

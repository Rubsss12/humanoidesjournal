import type { DeploymentStage, Entry, SourceType } from "@/lib/types";
import { isVendorSourced, SOURCE_TYPE_LABELS, STAGE_LABELS, isMarketingType } from "@/lib/types";
import { confidencePercent } from "@/lib/format";

// Confidence semantics: >= 0.7 solid evidence, 0.5-0.7 reported but thinner,
// <= 0.5 usually vendor-marketing-capped. Vendor-only entries always show the
// caution treatment no matter the number.
export function ConfidenceBadge({ entry }: { entry: Entry }) {
  const vendor = isVendorSourced(entry);
  const c = entry.confidence;
  const tone = vendor
    ? "bg-warn-bg text-warn"
    : c >= 0.7
      ? "bg-ok-bg text-ok"
      : "bg-lilac text-mauve-deep";
  const label = vendor ? "Vendor-sourced" : c >= 0.7 ? "Confirmed" : "Reported";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-bold ${tone}`}
      title={entry.confidence_reason}
    >
      {label} · {confidencePercent(c)}
    </span>
  );
}

const STAGE_TONES: Record<DeploymentStage, string> = {
  production: "bg-mauve text-white",
  pilot: "bg-mauve-ink/10 text-mauve-ink",
  announced: "bg-lilac text-mauve-deep",
  unknown: "bg-ink/5 text-muted",
};

export function StageBadge({ stage }: { stage: DeploymentStage }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[0.7rem] font-bold ${STAGE_TONES[stage]}`}>
      {STAGE_LABELS[stage]}
    </span>
  );
}

export function SourceTypeChip({ type }: { type: SourceType }) {
  const marketing = isMarketingType(type);
  return (
    <span
      className={`inline-flex rounded px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ${
        marketing ? "bg-warn-bg text-warn" : "bg-lilac text-mauve-deep"
      }`}
    >
      {SOURCE_TYPE_LABELS[type]}
    </span>
  );
}

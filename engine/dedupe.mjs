// Deduplication: same company + same solution is the same deployment.
// A duplicate with genuinely new detail becomes an UPDATE of the existing
// entry (new sources / outcomes merged in), never a second entry.

import { normalizeName, normalizeUrl } from "./schema.mjs";

function key(company, solution) {
  const canon = (s) =>
    normalizeName(s)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/\b(inc|ltd|llc|sa|ag|gmbh|plc|corp|co|group|holdings?)\.?$/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  return `${canon(company)}::${canon(solution)}`;
}

export function entryKey(e) {
  return key(e.company, e.solution_name);
}

export function findExisting(entries, candidate) {
  const k = entryKey(candidate);
  return entries.find((e) => entryKey(e) === k) ?? null;
}

/**
 * Merge a duplicate candidate into the existing entry.
 * Returns { entry, changed, changes[] } — changed=false means the candidate
 * brought nothing new and is a pure duplicate.
 */
export function mergeUpdate(existing, candidate) {
  const changes = [];
  const merged = structuredClone(existing);

  const knownUrls = new Set(merged.sources.map((s) => normalizeUrl(s.url)));
  for (const s of candidate.sources ?? []) {
    if (!knownUrls.has(normalizeUrl(s.url))) {
      merged.sources.push(s);
      knownUrls.add(normalizeUrl(s.url));
      changes.push(`added source ${s.url}`);
    }
  }

  const outcomeKey = (o) => `${normalizeName(o.metric).toLowerCase()}::${normalizeName(String(o.value)).toLowerCase()}`;
  const knownOutcomes = new Set(merged.reported_outcomes.map(outcomeKey));
  for (const o of candidate.reported_outcomes ?? []) {
    if (!knownOutcomes.has(outcomeKey(o))) {
      merged.reported_outcomes.push(o);
      knownOutcomes.add(outcomeKey(o));
      changes.push(`added outcome "${o.metric}: ${o.value}"`);
    }
  }

  // Stage can only move forward in certainty: unknown/announced -> pilot -> production.
  const rank = { unknown: 0, announced: 1, pilot: 2, production: 3 };
  if (rank[candidate.deployment_stage] > rank[merged.deployment_stage]) {
    changes.push(`deployment_stage ${merged.deployment_stage} -> ${candidate.deployment_stage}`);
    merged.deployment_stage = candidate.deployment_stage;
  }

  // Fill fields we previously left empty (never overwrite non-empty ones).
  for (const f of ["vendor", "department", "industry", "company_country"]) {
    if (!normalizeName(merged[f]) && normalizeName(candidate[f])) {
      merged[f] = candidate[f];
      changes.push(`filled ${f}`);
    }
  }

  return { entry: merged, changed: changes.length > 0, changes };
}

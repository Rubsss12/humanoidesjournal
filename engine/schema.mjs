// Agentipedia data model + the one rule that governs every entry.
//
// An entry is valid only when BOTH are named and verifiable:
//   1. the company that deploys the agent (a real, identifiable organization), and
//   2. the specific named solution powering it.
// Everything in this module is deterministic code — the model that proposes
// candidates never gets to decide what enters the store.

export const REGIONS = [
  "North America",
  "Latin America",
  "Europe",
  "Middle East",
  "Africa",
  "South Asia",
  "East Asia",
  "Southeast Asia",
  "Oceania",
];

export const SOURCE_TYPES = [
  "company_official",
  "earnings_call",
  "news_media",
  "conference_talk",
  "vendor_case_study",
  "press_release",
  "other",
];

export const DEPLOYMENT_STAGES = ["pilot", "production", "announced", "unknown"];

// Source types that count as marketing. When an entry's evidence is ONLY
// marketing, confidence is capped at 0.5 and metrics stay "claimed".
export const MARKETING_SOURCE_TYPES = ["vendor_case_study", "press_release"];
export const VENDOR_CONFIDENCE_CAP = 0.5;

// Phrases that mark a company name as generic / anonymized. Matched against
// the normalized full name, not substrings of real brands.
const GENERIC_COMPANY_PATTERNS = [
  /^(a|an|the|one|some|several|many)\s/i,
  /\b(unnamed|undisclosed|anonymous|confidential|stealth)\b/i,
  /\b(leading|major|large|big|global|top|fortune\s*\d+)\s+(retailer|bank|insurer|airline|telco|telecom|company|brand|manufacturer|firm|enterprise|player|operator)s?\b/i,
  /^(retailer|bank|insurer|airline|telco|company|enterprise|client|customer|organization|organisation)s?$/i,
];

// Solution names that are generic technology descriptions, not named products.
// Compared as the WHOLE normalized name (a real product containing one of
// these words, e.g. "Bank of America Erica", is fine).
const GENERIC_SOLUTION_NAMES = new Set([
  "chatbot", "a chatbot", "ai chatbot", "bot", "voicebot", "voice bot",
  "ai", "an ai", "gen ai", "genai", "generative ai", "artificial intelligence",
  "llm", "an llm", "large language model", "foundation model",
  "ai agent", "an ai agent", "ai agents", "agent", "agents", "agentic ai",
  "autonomous agent", "autonomous agents", "multi-agent system",
  "ai assistant", "virtual assistant", "digital assistant", "assistant",
  "conversational ai", "copilot", "a copilot", "ai copilot",
  "machine learning", "ml model", "custom model", "custom llm",
  "in-house ai", "in-house tool", "internal tool", "internal ai",
  "proprietary ai", "proprietary model", "automation", "rpa",
  "customer service ai", "support bot", "ai platform", "ai solution",
  "ai system", "ai tool",
]);

const GENERIC_SOLUTION_PATTERNS = [
  /^(an?|the|its|their|own|new)\s+(ai|genai|generative|internal|in-house|proprietary|custom|conversational|virtual|autonomous)\b/i,
  /^(unnamed|undisclosed|unspecified|internal|in-house|homegrown|custom-built)\b/i,
];

export function normalizeName(s) {
  return String(s ?? "").trim().replace(/\s+/g, " ");
}

export function isGenericCompany(name) {
  const n = normalizeName(name);
  if (n.length < 2) return true;
  return GENERIC_COMPANY_PATTERNS.some((re) => re.test(n));
}

export function isGenericSolution(name) {
  const n = normalizeName(name).toLowerCase();
  if (n.length < 2) return true;
  if (GENERIC_SOLUTION_NAMES.has(n)) return true;
  return GENERIC_SOLUTION_PATTERNS.some((re) => re.test(n));
}

export function isValidHttpUrl(u) {
  try {
    const url = new URL(String(u));
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

// Normalize a URL for comparing "cited" against "actually retrieved".
export function normalizeUrl(u) {
  try {
    const url = new URL(String(u));
    url.hash = "";
    for (const p of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|mc_cid|mc_eid|ref$)/.test(p)) url.searchParams.delete(p);
    }
    let s = url.toString();
    if (s.endsWith("/")) s = s.slice(0, -1);
    return s.toLowerCase();
  } catch {
    return String(u).trim().toLowerCase();
  }
}

export function slugify(s) {
  return normalizeName(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function makeEntryId(company, solution) {
  return `${slugify(company)}--${slugify(solution)}`;
}

function isIsoDate(s) {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
}

/**
 * Validate a candidate entry against the rule and the schema.
 * @param {object} e - candidate entry
 * @param {object} [opts]
 * @param {Set<string>|null} [opts.retrievedUrls] - normalized URLs actually
 *   retrieved by live search during this run. When provided, every cited
 *   source URL must be in this set — a citation the run never saw is treated
 *   as fabricated and rejects the entry.
 * @returns {{ok: boolean, errors: string[]}}
 */
export function validateEntry(e, opts = {}) {
  const errors = [];
  const retrievedUrls = opts.retrievedUrls ?? null;

  if (!e || typeof e !== "object") return { ok: false, errors: ["not an object"] };

  // --- The rule, field 1: a real, named company ---
  const company = normalizeName(e.company);
  if (!company) errors.push("company missing");
  else if (isGenericCompany(company)) errors.push(`company "${company}" is generic/anonymized, not a named organization`);

  // --- The rule, field 2: a specific named solution ---
  const solution = normalizeName(e.solution_name);
  if (!solution) errors.push("solution_name missing");
  else if (isGenericSolution(solution)) errors.push(`solution_name "${solution}" is a generic technology description, not a named product`);

  // --- Geography ---
  if (!REGIONS.includes(e.region)) errors.push(`region "${e.region}" not one of: ${REGIONS.join(", ")}`);
  if (!normalizeName(e.company_country)) errors.push("company_country missing");

  // --- Descriptive fields (use_case required; others may stay empty rather than guessed) ---
  if (!normalizeName(e.use_case)) errors.push("use_case missing");
  if (typeof e.vendor !== "string") errors.push("vendor must be a string (may be empty when unknown)");
  if (typeof e.department !== "string") errors.push("department must be a string (may be empty)");
  if (typeof e.industry !== "string") errors.push("industry must be a string (may be empty)");
  if (!DEPLOYMENT_STAGES.includes(e.deployment_stage)) errors.push(`deployment_stage "${e.deployment_stage}" not one of: ${DEPLOYMENT_STAGES.join(", ")}`);

  // --- Evidence: no source, no entry ---
  if (!Array.isArray(e.sources) || e.sources.length === 0) {
    errors.push("no sources — no source, no entry");
  } else {
    e.sources.forEach((s, i) => {
      if (!isValidHttpUrl(s?.url)) errors.push(`sources[${i}].url invalid`);
      else if (retrievedUrls && !retrievedUrls.has(normalizeUrl(s.url))) {
        errors.push(`sources[${i}].url was not retrieved by live search this run (possible fabrication): ${s.url}`);
      }
      if (!normalizeName(s?.title)) errors.push(`sources[${i}].title missing`);
      if (!normalizeName(s?.publisher)) errors.push(`sources[${i}].publisher missing`);
      if (!SOURCE_TYPES.includes(s?.source_type)) errors.push(`sources[${i}].source_type "${s?.source_type}" invalid`);
      if (!isIsoDate(s?.retrieved_date)) errors.push(`sources[${i}].retrieved_date must be YYYY-MM-DD`);
    });
  }

  // --- Outcomes: optional, but each one must carry its provenance ---
  if (!Array.isArray(e.reported_outcomes)) {
    errors.push("reported_outcomes must be an array (empty when none reported)");
  } else {
    e.reported_outcomes.forEach((o, i) => {
      if (!normalizeName(o?.metric)) errors.push(`reported_outcomes[${i}].metric missing`);
      if (!normalizeName(String(o?.value ?? ""))) errors.push(`reported_outcomes[${i}].value missing`);
      if (!SOURCE_TYPES.includes(o?.source_type)) errors.push(`reported_outcomes[${i}].source_type invalid`);
    });
  }

  // --- Dates, confidence ---
  if (!isIsoDate(e.first_seen_date)) errors.push("first_seen_date must be YYYY-MM-DD");
  if (typeof e.confidence !== "number" || e.confidence < 0 || e.confidence > 1) {
    errors.push("confidence must be a number in [0,1]");
  } else if (onlyMarketingSources(e) && e.confidence > VENDOR_CONFIDENCE_CAP) {
    errors.push(`confidence ${e.confidence} exceeds ${VENDOR_CONFIDENCE_CAP} but every source is vendor marketing`);
  }
  if (!normalizeName(e.confidence_reason)) errors.push("confidence_reason missing");

  // --- id ---
  const expectedId = makeEntryId(company || "x", solution || "x");
  if (e.id !== expectedId) errors.push(`id must be "${expectedId}" (company+solution slug), got "${e.id}"`);

  return { ok: errors.length === 0, errors };
}

export function onlyMarketingSources(e) {
  return Array.isArray(e.sources) && e.sources.length > 0 &&
    e.sources.every((s) => MARKETING_SOURCE_TYPES.includes(s?.source_type));
}

// Enforce the marketing cap instead of rejecting: called before validation on
// engine-extracted candidates so an otherwise-good vendor-sourced entry is
// kept at capped confidence rather than thrown away.
export function applyConfidencePolicy(e) {
  if (typeof e.confidence === "number" && onlyMarketingSources(e) && e.confidence > VENDOR_CONFIDENCE_CAP) {
    return {
      ...e,
      confidence: VENDOR_CONFIDENCE_CAP,
      confidence_reason: normalizeName(
        `${e.confidence_reason ?? ""} Capped at ${VENDOR_CONFIDENCE_CAP}: only vendor marketing sources.`,
      ),
    };
  }
  return e;
}

#!/usr/bin/env node
// Agentipedia curation engine.
//
// One run: generate discovery queries -> search the live web (Anthropic
// web_search server tool) -> extract candidate entries -> enforce the rule in
// deterministic code -> dedupe/update -> append to data/entries.json and log
// every rejection in data/rejections.json. Fully autonomous: it never asks a
// human anything; when in doubt a candidate is rejected and the reason logged.
//
// Usage:
//   ANTHROPIC_API_KEY=... node engine/curate.mjs [--dry-run] [--queries 10]
//                         [--date YYYY-MM-DD] [--batch-size 3] [--max-uses 5]

import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import {
  REGIONS, SOURCE_TYPES, DEPLOYMENT_STAGES,
  validateEntry, applyConfidencePolicy, makeEntryId,
  normalizeName, normalizeUrl, VENDOR_CONFIDENCE_CAP,
} from "./schema.mjs";
import { findExisting, mergeUpdate } from "./dedupe.mjs";
import { generateQueries } from "./queries.mjs";

const ROOT = path.join(import.meta.dirname, "..");
const ENTRIES_PATH = path.join(ROOT, "data", "entries.json");
const REJECTIONS_PATH = path.join(ROOT, "data", "rejections.json");

const MODEL = process.env.AGENTIPEDIA_MODEL || "claude-opus-4-8";
const MAX_CONTINUATIONS = 6;

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}
const DRY_RUN = process.argv.includes("--dry-run");
const RUN_DATE = arg("date", new Date().toISOString().slice(0, 10));
const N_QUERIES = Number(arg("queries", 10));
const BATCH_SIZE = Number(arg("batch-size", 3));
const MAX_USES = Number(arg("max-uses", 5));

const SYSTEM_PROMPT = `You are the research stage of Agentipedia, an encyclopedia of real-world AI agent deployments inside named companies.

You will receive web search queries. Use the web_search tool to run them (and focused follow-ups) and extract candidate catalog entries from what the searches ACTUALLY return.

THE RULE — a candidate is only worth reporting when the retrieved text names BOTH:
1. the company deploying or using the agent — a real, identifiable organization by its actual name (Klarna, JPMorgan, Rakuten, Air India), never "a large retailer" or "a European bank";
2. the specific named solution powering it — a named product, platform or internally branded agent (Salesforce Agentforce, Sierra, Bank of America Erica, Mercado Libre Verdi on Gemini), never "a chatbot" or "an LLM".

ANTI-FABRICATION (absolute):
- Only report what the retrieved search results actually say. Never add companies, product names, metrics, dates or quotes from your own memory.
- Every source URL you cite must be a URL that appeared in this conversation's search results. Never construct or guess a URL.
- If a detail (vendor, department, industry, country, metric) is not in the retrieved text, leave that field as an empty string "" or omit the outcome. Do not fill gaps with plausible values.
- Vendor case studies and press releases are marketing: classify their source_type accordingly and keep confidence at or below ${VENDOR_CONFIDENCE_CAP} when they are the only evidence.
- If sources conflict, include both sources and lower the confidence, noting the conflict in confidence_reason.
- When unsure whether a candidate meets the rule, still report it with your doubts in confidence_reason and a low confidence — the pipeline applies the rule strictly and logs the rejection, which is valuable.

After searching, reply with ONE fenced \`\`\`json code block containing an array of candidate objects, each shaped exactly like:
{
  "company": "…",
  "company_country": "…",
  "region": one of ${JSON.stringify(REGIONS)},
  "solution_name": "…",
  "vendor": "…",
  "use_case": "one clear sentence, in your own words, of what the agent does for the company",
  "department": "…",
  "industry": "…",
  "deployment_stage": one of ${JSON.stringify(DEPLOYMENT_STAGES)},
  "reported_outcomes": [{ "metric": "…", "value": "…", "source_type": one of ${JSON.stringify(SOURCE_TYPES)} }],
  "sources": [{ "url": "…", "title": "…", "publisher": "…", "source_type": one of ${JSON.stringify(SOURCE_TYPES)} }],
  "confidence": 0.0-1.0,
  "confidence_reason": "one sentence: why this confidence, and what the evidence is"
}
Return [] if the searches surfaced nothing that satisfies the rule. No prose after the JSON block.`;

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function saveJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n");
}

function extractJsonArray(text) {
  const fenced = [...text.matchAll(/```json\s*([\s\S]*?)```/g)];
  const raw = fenced.length ? fenced[fenced.length - 1][1] : text.slice(text.indexOf("["));
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function collectRetrievedUrls(content, into) {
  for (const block of content) {
    if (block.type === "web_search_tool_result") {
      // On error, content is an object with error_code instead of a list.
      if (Array.isArray(block.content)) {
        for (const r of block.content) if (r?.url) into.add(normalizeUrl(r.url));
      }
    }
    if (block.type === "text" && Array.isArray(block.citations)) {
      for (const c of block.citations) if (c?.url) into.add(normalizeUrl(c.url));
    }
  }
}

async function researchBatch(client, queries, retrievedUrls) {
  const tools = [{ type: "web_search_20260209", name: "web_search", max_uses: MAX_USES }];
  let messages = [{
    role: "user",
    content: `Run these discovery queries and extract candidates:\n${queries.map((q) => `- ${q}`).join("\n")}`,
  }];

  let finalText = "";
  for (let turn = 0; turn <= MAX_CONTINUATIONS; turn++) {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      tools,
      messages,
    });
    const message = await stream.finalMessage();
    collectRetrievedUrls(message.content, retrievedUrls);

    if (message.stop_reason === "pause_turn") {
      // Server-side tool loop paused; resend to let it resume.
      messages = [...messages, { role: "assistant", content: message.content }];
      continue;
    }
    finalText = message.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
    break;
  }
  return extractJsonArray(finalText) ?? [];
}

function shapeCandidate(raw) {
  // Engine owns id, dates and string coercion — the model never sets them.
  const sources = (Array.isArray(raw.sources) ? raw.sources : []).map((s) => ({
    url: String(s?.url ?? ""),
    title: normalizeName(s?.title),
    publisher: normalizeName(s?.publisher),
    source_type: s?.source_type,
    retrieved_date: RUN_DATE,
  }));
  return applyConfidencePolicy({
    id: makeEntryId(raw.company ?? "", raw.solution_name ?? ""),
    company: normalizeName(raw.company),
    company_country: normalizeName(raw.company_country),
    region: raw.region,
    solution_name: normalizeName(raw.solution_name),
    vendor: normalizeName(raw.vendor ?? ""),
    use_case: normalizeName(raw.use_case),
    department: normalizeName(raw.department ?? ""),
    industry: normalizeName(raw.industry ?? ""),
    deployment_stage: raw.deployment_stage ?? "unknown",
    reported_outcomes: Array.isArray(raw.reported_outcomes)
      ? raw.reported_outcomes.map((o) => ({
          metric: normalizeName(o?.metric),
          value: normalizeName(String(o?.value ?? "")),
          source_type: o?.source_type,
        }))
      : [],
    first_seen_date: RUN_DATE,
    sources,
    confidence: typeof raw.confidence === "number" ? raw.confidence : NaN,
    confidence_reason: normalizeName(raw.confidence_reason),
  });
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(
      "curate: ANTHROPIC_API_KEY is not set.\n" +
      "The engine needs an Anthropic API key with web_search enabled.\n" +
      "Locally: export ANTHROPIC_API_KEY=...  |  GitHub Actions: add it as a repository secret named ANTHROPIC_API_KEY.",
    );
    process.exit(2);
  }
  const client = new Anthropic();

  const store = loadJson(ENTRIES_PATH);
  const rejectionLog = loadJson(REJECTIONS_PATH);
  const queries = generateQueries(RUN_DATE, N_QUERIES);
  console.log(`curate: run ${RUN_DATE} — model ${MODEL} — ${queries.length} queries`);
  queries.forEach((q) => console.log(`  · ${q}`));

  const retrievedUrls = new Set();
  const candidates = [];
  for (let i = 0; i < queries.length; i += BATCH_SIZE) {
    const batch = queries.slice(i, i + BATCH_SIZE);
    try {
      const found = await researchBatch(client, batch, retrievedUrls);
      console.log(`curate: batch ${1 + i / BATCH_SIZE} -> ${found.length} candidate(s)`);
      candidates.push(...found);
    } catch (err) {
      // A failed batch never kills the run — skip it and keep curating.
      console.error(`curate: batch failed (${err?.constructor?.name}): ${err?.message}`);
    }
  }

  const run = {
    run_id: `run-${RUN_DATE}-${Date.now().toString(36)}`,
    date: RUN_DATE,
    operator: "engine",
    model: MODEL,
    queries,
    candidates_seen: candidates.length,
    accepted: 0,
    updated: 0,
    rejections: [],
  };

  for (const raw of candidates) {
    const candidate = shapeCandidate(raw);
    const label = `${candidate.company || "?"} / ${candidate.solution_name || "?"}`;
    const { ok, errors } = validateEntry(candidate, { retrievedUrls });
    if (!ok) {
      run.rejections.push({ candidate: label, reason: errors[0], all_errors: errors });
      console.log(`  ✗ reject ${label}: ${errors[0]}`);
      continue;
    }
    const existing = findExisting(store.entries, candidate);
    if (existing) {
      const { entry, changed, changes } = mergeUpdate(existing, candidate);
      if (changed) {
        store.entries[store.entries.indexOf(existing)] = entry;
        run.updated++;
        console.log(`  ↻ update ${label}: ${changes.join("; ")}`);
      } else {
        run.rejections.push({ candidate: label, reason: "duplicate of existing entry, no new detail" });
        console.log(`  ✗ reject ${label}: duplicate, no new detail`);
      }
      continue;
    }
    store.entries.push(candidate);
    run.accepted++;
    console.log(`  ✓ accept ${label}`);
  }

  store.entries.sort((a, b) => a.id.localeCompare(b.id));
  store.updated_at = new Date().toISOString();
  rejectionLog.runs.push(run);

  console.log(`curate: done — ${run.accepted} new, ${run.updated} updated, ${run.rejections.length} rejected`);
  if (DRY_RUN) {
    console.log("curate: --dry-run, not writing files");
    return;
  }
  saveJson(ENTRIES_PATH, store);
  saveJson(REJECTIONS_PATH, rejectionLog);
  console.log(`curate: wrote ${path.relative(ROOT, ENTRIES_PATH)} (${store.entries.length} entries) and rejection log`);
}

main().catch((err) => {
  console.error("curate: fatal:", err);
  process.exit(1);
});

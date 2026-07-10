#!/usr/bin/env node
// Validates the whole store against the schema and the rule.
// Runs in CI before every build and blocks anything invalid from shipping.
// Exit code 0 = store is clean, 1 = at least one entry violates the rule.

import fs from "node:fs";
import path from "node:path";
import { validateEntry } from "./schema.mjs";
import { entryKey } from "./dedupe.mjs";

const ROOT = path.join(import.meta.dirname, "..");
const store = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "entries.json"), "utf8"));

let failures = 0;
const seen = new Map();

for (const e of store.entries) {
  const { ok, errors } = validateEntry(e);
  if (!ok) {
    failures++;
    console.error(`✗ ${e.id ?? "(no id)"}:`);
    for (const err of errors) console.error(`    - ${err}`);
  }
  const k = entryKey(e);
  if (seen.has(k)) {
    failures++;
    console.error(`✗ duplicate pair: "${e.id}" duplicates "${seen.get(k)}"`);
  } else {
    seen.set(k, e.id);
  }
}

if (store.entries.length > 0 && !store.updated_at) {
  failures++;
  console.error("✗ store has entries but no updated_at timestamp");
}

if (failures) {
  console.error(`validate: ${failures} problem(s) in ${store.entries.length} entries`);
  process.exit(1);
}
console.log(`validate: OK — ${store.entries.length} entries, all pass the rule`);

// Server-only store access (reads data/entries.json from disk at build time).
import fs from "node:fs";
import path from "node:path";
import type { Entry, Store } from "./types";

export type * from "./types";
export { isVendorSourced, isMarketingType, SOURCE_TYPE_LABELS, STAGE_LABELS } from "./types";

let cache: Store | null = null;

export function getStore(): Store {
  if (cache) return cache;
  const raw = fs.readFileSync(path.join(process.cwd(), "data", "entries.json"), "utf8");
  cache = JSON.parse(raw) as Store;
  return cache;
}

export function getEntries(): Entry[] {
  return getStore().entries;
}

export function getEntry(id: string): Entry | undefined {
  return getEntries().find((e) => e.id === id);
}

export function getStats() {
  const entries = getEntries();
  return {
    entries: entries.length,
    countries: new Set(entries.map((e) => e.company_country).filter(Boolean)).size,
    regions: new Set(entries.map((e) => e.region)).size,
    vendors: new Set(entries.map((e) => e.vendor).filter(Boolean)).size,
    updatedAt: getStore().updated_at,
  };
}

// Client-safe types and pure helpers — no Node imports here.

export type SourceType =
  | "company_official"
  | "earnings_call"
  | "news_media"
  | "conference_talk"
  | "vendor_case_study"
  | "press_release"
  | "other";

export type DeploymentStage = "pilot" | "production" | "announced" | "unknown";

export interface Outcome {
  metric: string;
  value: string;
  source_type: SourceType;
}

export interface Source {
  url: string;
  title: string;
  publisher: string;
  source_type: SourceType;
  retrieved_date: string;
}

export interface Entry {
  id: string;
  company: string;
  company_country: string;
  region: string;
  solution_name: string;
  vendor: string;
  use_case: string;
  department: string;
  industry: string;
  deployment_stage: DeploymentStage;
  reported_outcomes: Outcome[];
  first_seen_date: string;
  sources: Source[];
  confidence: number;
  confidence_reason: string;
}

export interface Store {
  updated_at: string | null;
  entries: Entry[];
}

const MARKETING_TYPES: SourceType[] = ["vendor_case_study", "press_release"];

export function isVendorSourced(entry: Entry): boolean {
  return entry.sources.length > 0 && entry.sources.every((s) => MARKETING_TYPES.includes(s.source_type));
}

export function isMarketingType(t: SourceType): boolean {
  return MARKETING_TYPES.includes(t);
}

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  company_official: "Company official",
  earnings_call: "Earnings call",
  news_media: "News media",
  conference_talk: "Conference talk",
  vendor_case_study: "Vendor case study",
  press_release: "Press release",
  other: "Other",
};

export const STAGE_LABELS: Record<DeploymentStage, string> = {
  production: "In production",
  pilot: "Pilot",
  announced: "Announced",
  unknown: "Stage unknown",
};

// Discovery query generation. Each run gets a deterministic slice of a large
// region x industry x language matrix, keyed on the run date, so consecutive
// daily runs sweep different corners of the world instead of re-searching the
// same English-language ground.

import { REGIONS } from "./schema.mjs";

const INDUSTRIES = [
  "banking", "insurance", "retail", "e-commerce", "telecom", "airline",
  "healthcare", "pharma", "manufacturing", "automotive", "energy", "utilities",
  "logistics", "government", "education", "hospitality", "media", "mining",
  "agriculture", "real estate",
];

const DEPARTMENTS = [
  "customer service", "sales", "marketing", "software engineering", "HR",
  "finance", "procurement", "supply chain", "legal", "IT operations",
];

// Non-English probes so the catalog is not skewed toward US/EU coverage.
// Each template mentions "named company" semantics in its own language.
const LOCAL_TEMPLATES = {
  "Latin America": [
    'empresa implementa agente de IA atención al cliente resultados',
    'empresa brasileira agente de IA "inteligência artificial" atendimento resultados',
  ],
  Europe: [
    'entreprise déploie agent IA service client résultats',
    'Unternehmen setzt KI-Agent ein Kundenservice Ergebnisse',
    'azienda agente IA servizio clienti risultati',
  ],
  "Middle East": [
    'شركة تطلق مساعد ذكاء اصطناعي خدمة العملاء',
    'bank UAE Saudi AI agent deployment named assistant',
  ],
  "East Asia": [
    '企業 AIエージェント 導入 事例 コールセンター',
    '기업 AI 에이전트 도입 사례',
    '企业 部署 AI智能体 客服 案例',
  ],
  "South Asia": [
    'India company deploys named AI agent customer service results',
  ],
  "Southeast Asia": [
    'perusahaan Indonesia meluncurkan asisten AI layanan pelanggan',
    'Singapore Thailand Vietnam company AI agent deployment named',
  ],
  Africa: [
    'African bank telecom launches AI assistant name customers',
  ],
  Oceania: [
    'Australia New Zealand company AI agent deployment named assistant results',
  ],
  "North America": [],
};

const ANGLES = [
  (region, industry) => `${industry} company in ${region} deploys named AI agent platform production results`,
  (region, industry) => `"${industry}" ${region} "AI agent" customer deployment case named company 2025 2026`,
  (region) => `${region} enterprise AI agent deployment announcement named product`,
  (_region, industry, dept) => `${industry} ${dept} AI agent named solution rollout company`,
];

// Vendor-anchored probes: searching by agent platform surfaces named customers.
const VENDOR_PROBES = [
  "Salesforce Agentforce customer deployed",
  "Sierra AI agent customer company",
  "Decagon AI agent customer",
  "Microsoft Copilot Studio agent enterprise customer deployment",
  "Google Gemini enterprise agent deployment named company",
  "OpenAI enterprise customer AI agent deployment",
  "Anthropic Claude enterprise customer agent deployment",
  "ServiceNow AI agents customer live",
  "Ada CX AI agent customer",
  "Cognigy AI agent airline customer",
  "Parloa AI agent customer",
  "Devin Cognition AI software engineer enterprise customer",
];

function hashDate(dateStr) {
  let h = 0;
  for (const c of String(dateStr)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

/**
 * Deterministic query slice for a run.
 * @param {string} dateStr YYYY-MM-DD of the run
 * @param {number} n how many queries to produce
 */
export function generateQueries(dateStr, n = 10) {
  const seed = hashDate(dateStr);
  const queries = [];
  const pick = (arr, i) => arr[(seed + i * 7) % arr.length];

  // 1) Region-led queries — walk regions starting at a date-dependent offset.
  for (let i = 0; queries.length < Math.ceil(n * 0.5); i++) {
    const region = REGIONS[(seed + i) % REGIONS.length];
    const industry = pick(INDUSTRIES, i);
    const dept = pick(DEPARTMENTS, i + 3);
    const angle = ANGLES[(seed + i) % ANGLES.length];
    queries.push(angle(region, industry, dept));
    const local = LOCAL_TEMPLATES[region];
    if (local?.length && queries.length < Math.ceil(n * 0.5)) {
      queries.push(local[(seed + i) % local.length]);
    }
  }

  // 2) Vendor-anchored probes.
  for (let i = 0; queries.length < Math.ceil(n * 0.8); i++) {
    queries.push(pick(VENDOR_PROBES, i + 11));
  }

  // 3) Freshness probes.
  const year = new Date(dateStr).getFullYear();
  queries.push(`company launches named AI agent ${year} announcement customers`);
  queries.push(`earnings call AI agents deployment named company ${year}`);

  return [...new Set(queries)].slice(0, n);
}

# Agentipedia

The living encyclopedia of AI agents at work: a public, self-updating catalog
of real deployments of AI agents inside **named companies**, worldwide. Every
entry names both the company and the exact solution powering it, and links the
retrieved sources that prove it. **No source, no entry.**

Built with **Next.js 16** (App Router, static export) and **Tailwind CSS v4**.
The data store is a single JSON file; an autonomous curation engine keeps it
current.

## The one rule

An entry is valid only when both fields are named and verified against a
retrieved source:

1. **The company** — a real, identifiable organization by its actual name
   (Klarna, JPMorgan, Rakuten, Air India), never “a large retailer”.
2. **The named solution** — a named product, platform or internally branded
   agent (Salesforce Agentforce, Sierra, Bank of America Erica), never
   “a chatbot”.

If either is missing, generic, or unverifiable, the candidate is rejected and
the rejection is logged with a one-line reason.

## Layout

```
data/
  entries.json      the store — single source of truth, human-auditable
  rejections.json   every curation run with every rejection and its reason
engine/
  schema.mjs        data model + the rule, enforced in deterministic code
  dedupe.mjs        same company + same solution = update, never a duplicate
  queries.mjs       rotating discovery-query matrix (regions × industries × languages)
  curate.mjs        the autonomous run: live web search -> extract -> validate -> write
  validate.mjs      validates the whole store; runs in CI before every build
src/                the website (reads data/entries.json at build time)
.github/workflows/
  curate.yml        daily schedule: curate -> validate -> rebuild -> commit
  ci.yml            store validation + lint + build on every PR
```

## Run the site

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export in ./out — deploy on any static host
```

## Run the curation engine

```bash
export ANTHROPIC_API_KEY=sk-ant-...   # needs web_search access
npm run curate                        # one discovery run, writes data/
npm run curate -- --dry-run           # same, but writes nothing
npm run validate                      # check the whole store against the rule
```

The engine uses the Anthropic API (`claude-opus-4-8` by default, override with
`AGENTIPEDIA_MODEL`) with the `web_search` server tool. Model output is only
ever a *candidate*: deterministic code recomputes ids, dates and confidence
caps, verifies that every cited URL was actually retrieved by the run’s live
searches, applies the rule, dedupes, and logs rejections. The engine never
pauses to ask a human anything.

### Schedule

`.github/workflows/curate.yml` runs daily at 05:17 UTC (and on demand via
*Run workflow*). Add the repository secret **`ANTHROPIC_API_KEY`** to enable
it. Optionally set the repository variable `DEPLOY_PAGES=true` (with GitHub
Pages configured to deploy from Actions) to publish `./out` after each run;
for project pages set `NEXT_BASE_PATH=/<repo>` in the build step.

## Design

The interface follows the HUB Institute / HUBFORUM Paris look: mauve and
violet on clean light backgrounds, dark violet hero, confident uppercase
typography (Archivo), generous whitespace. All colors live in CSS variables at
the top of `src/app/globals.css` — swap the exact brand mauve in one place.

## Correcting an entry

The store is designed to be audited: edit `data/entries.json` in a pull
request. CI re-validates every entry against the rule before anything ships.

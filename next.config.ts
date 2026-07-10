import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: the store (data/entries.json) is read at build time and
  // `next build` emits ./out, deployable on any static host. The scheduled
  // curation workflow rebuilds after each discovery run.
  output: "export",
  // Emit every route as <route>/index.html so the export works on any
  // static file server without extension-rewrite rules.
  trailingSlash: true,
  // Set NEXT_BASE_PATH (e.g. "/agentipedia") when serving from a sub-path
  // such as GitHub Pages project sites.
  basePath: process.env.NEXT_BASE_PATH || "",
};

export default nextConfig;

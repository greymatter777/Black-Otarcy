// validate-checkers.mjs
// Teste les 10 checkers sur 3 URLs réelles avant tout déploiement.
// Exécuter avec : npx tsx validate-checkers.mjs
// Un checker défaillant = 3 endpoints qui retournent des scores faux.

import {
  checkCrawlersIA,
  checkSchemaOrg,
  checkEEAT,
  checkFAQGlossaire,
  checkLlmsTxt,
  checkMetaOnpage,
  checkWikidata,
  checkSitemap,
  checkOpenGraph,
  checkHTTPS,
} from "./src/lib/checkers.ts";

const URLS = [
  "https://anthropic.com",    // site bien configuré — score attendu > 70
  "https://otarcy.app",       // ton propre site
  "https://httpbin.org/html", // page HTML minimaliste — score attendu faible
];

async function fetchWithTimeout(url, ms = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

console.log("\n╔══════════════════════════════════════════════╗");
console.log("║     OTARCY — Validation des 10 checkers     ║");
console.log("╚══════════════════════════════════════════════╝");

for (const url of URLS) {
  console.log(`\n── ${url} ──`);
  try {
    const [htmlRes, robotsRes] = await Promise.all([
      fetchWithTimeout(url),
      fetchWithTimeout(new URL(url).origin + "/robots.txt").catch(() => null),
    ]);

    const html = await htmlRes.text();
    const robots = robotsRes?.ok ? await robotsRes.text() : "";

    const sync = {
      https:       checkHTTPS(url),
      crawlers_ia: checkCrawlersIA(robots),
      schema_org:  checkSchemaOrg(html),
      eeat:        checkEEAT(html),
      faq:         checkFAQGlossaire(html),
      meta_onpage: checkMetaOnpage(html),
      wikidata:    checkWikidata(html),
      open_graph:  checkOpenGraph(html),
    };

    const async_ = {
      llms_txt: await checkLlmsTxt(url),
      sitemap:  await checkSitemap(url, html),
    };

    const all = { ...sync, ...async_ };

    let total = 0;
    for (const [nom, r] of Object.entries(all)) {
      const icon = r.statut === "ok" ? "✅" : r.statut === "warn" ? "⚠️ " : "🔴";
      console.log(`  ${icon} ${nom.padEnd(14)} ${String(r.points).padStart(2)}/${r.max} — ${r.detail}`);
      total += r.points;
    }

    const niveau =
      total <= 30 ? "CRITIQUE" :
      total <= 55 ? "FAIBLE" :
      total <= 75 ? "MOYEN" :
      total <= 90 ? "BON" : "EXCELLENT";

    console.log(`\n  ── SCORE : ${total}/100 — ${niveau}`);

  } catch (e) {
    console.error(`  ERREUR : ${e.message}`);
  }
}

console.log("\n╔══════════════════════════════════════════════╗");
console.log("║  Si anthropic.com < 70 : corriger checkers  ║");
console.log("║  Si tout OK : passer à l'étape 1            ║");
console.log("╚══════════════════════════════════════════════╝\n");

// api/score.ts
// POST /api/score — Plan free
// Checkers inlinés — Vercel ne résout pas les imports relatifs hors /api/
// Auth optionnelle — accessible sans compte.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CheckResult {
  statut: "ok" | "warn" | "ko";
  points: number;
  max: number;
  detail: string;
  impact: string;
}

// ─── Helpers inlinés ─────────────────────────────────────────────────────────

async function fetchWithTimeout(url: string, ms = 8000): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Invalid protocol");
    return parsed.href;
  } catch {
    throw new Error("URL invalide");
  }
}

const rateLimitStore = new Map<string, number[]>();
function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (rateLimitStore.get(key) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= max) return false;
  rateLimitStore.set(key, [...timestamps, now]);
  return true;
}

function getNiveau(score: number): string {
  if (score <= 30) return "critique";
  if (score <= 55) return "faible";
  if (score <= 75) return "moyen";
  if (score <= 90) return "bon";
  return "excellent";
}

// ─── 1. Crawlers IA — 15 pts ──────────────────────────────────────────────────

function checkCrawlersIA(robotsTxt: string): CheckResult {
  const MAX = 15;
  if (!robotsTxt || robotsTxt.trim().length === 0) {
    return { statut: "ko", points: 0, max: MAX, detail: "Fichier robots.txt absent ou inaccessible.", impact: "Les crawlers IA ne peuvent pas vérifier les autorisations d'accès." };
  }
  const bots = ["GPTBot", "ClaudeBot", "PerplexityBot", "Googlebot-Extended", "OAI-SearchBot"];
  const blocked: string[] = [];
  const lines = robotsTxt.split("\n").map((l) => l.trim());
  let currentAgents: string[] = [];
  for (const line of lines) {
    if (line.toLowerCase().startsWith("user-agent:")) {
      const agent = line.split(":")[1]?.trim() ?? "";
      currentAgents = agent === "*" ? [...bots] : [agent];
    } else if (line.toLowerCase().startsWith("disallow:")) {
      const path = line.split(":").slice(1).join(":").trim();
      if (path === "/" || path === "") {
        for (const bot of currentAgents) {
          if (bots.includes(bot) && !blocked.includes(bot)) blocked.push(bot);
        }
      }
    } else if (line === "") {
      currentAgents = [];
    }
  }
  if (blocked.length === 0) return { statut: "ok", points: 15, max: MAX, detail: "Tous les crawlers IA sont autorisés.", impact: "Votre contenu est indexable par GPTBot, ClaudeBot et Perplexity." };
  if (blocked.length <= 2) return { statut: "warn", points: 7, max: MAX, detail: `${blocked.join(", ")} ${blocked.length > 1 ? "sont bloqués" : "est bloqué"} dans robots.txt.`, impact: "Certaines IAs ne peuvent pas crawler votre site." };
  return { statut: "ko", points: 0, max: MAX, detail: `${blocked.join(", ")} sont bloqués dans robots.txt.`, impact: "Les IAs majeures ne peuvent pas indexer votre contenu." };
}

// ─── 2. Schema.org — 15 pts ───────────────────────────────────────────────────

function checkSchemaOrg(html: string): CheckResult {
  const MAX = 15;
  const scriptRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const schemas: any[] = [];
  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed)) schemas.push(...parsed);
      else schemas.push(parsed);
    } catch { }
  }
  if (schemas.length === 0) return { statut: "ko", points: 0, max: MAX, detail: "Aucun Schema.org détecté (JSON-LD).", impact: "Les IAs ne peuvent pas identifier votre entité ni votre activité." };
  const types = schemas.map((s) => s["@type"]).filter(Boolean).map((t) => (Array.isArray(t) ? t : [t])).flat();
  const hasOrg = types.some((t) => ["Organization", "LocalBusiness", "SoftwareApplication"].includes(t));
  const hasWeb = types.some((t) => ["WebSite", "WebPage"].includes(t));
  const hasSameAs = schemas.some((s) => s.sameAs && (Array.isArray(s.sameAs) ? s.sameAs.length > 0 : true));
  if (hasOrg && hasWeb && hasSameAs) return { statut: "ok", points: 15, max: MAX, detail: `Types détectés : ${[...new Set(types)].join(", ")}. sameAs présent.`, impact: "Entité bien définie pour les IAs avec signaux d'autorité." };
  if (hasOrg || hasWeb) return { statut: "warn", points: 8, max: MAX, detail: `Types détectés : ${[...new Set(types)].join(", ")}. sameAs manquant.`, impact: "Entité partiellement définie — ajouter sameAs (Wikidata, GBP)." };
  return { statut: "warn", points: 4, max: MAX, detail: `Schema présent mais types insuffisants : ${[...new Set(types)].join(", ")}.`, impact: "Ajouter Organization ou WebSite pour être reconnu comme entité." };
}

// ─── 3. E-E-A-T — 15 pts ─────────────────────────────────────────────────────

function checkEEAT(html: string): CheckResult {
  const MAX = 15;
  const htmlLower = html.toLowerCase();
  let score = 0;
  const found: string[] = [];
  const missing: string[] = [];
  const signals = [
    { name: "Page À propos", patterns: ["/about", "/a-propos", "/qui-sommes-nous", ">about<", ">à propos<"], pts: 3 },
    { name: "Mentions auteur", patterns: ["author", "auteur", "rédigé par", "written by", "fondateur", "founder"], pts: 3 },
    { name: "Contact", patterns: ["contact", "mailto:", "nous contacter", "contactez"], pts: 3 },
    { name: "CGV / Mentions légales", patterns: ["cgv", "mentions légales", "conditions générales", "terms", "legal"], pts: 3 },
    { name: "Politique de confidentialité", patterns: ["politique de confidentialité", "privacy policy", "rgpd", "gdpr", "données personnelles"], pts: 3 },
  ];
  for (const signal of signals) {
    if (signal.patterns.some((p) => htmlLower.includes(p))) { score += signal.pts; found.push(signal.name); }
    else missing.push(signal.name);
  }
  if (score >= 12) return { statut: "ok", points: score, max: MAX, detail: `Signaux E-E-A-T détectés : ${found.join(", ")}.`, impact: "Crédibilité forte — les IAs vous perçoivent comme une source fiable." };
  if (score >= 6) return { statut: "warn", points: score, max: MAX, detail: `Présents : ${found.join(", ")}. Manquants : ${missing.join(", ")}.`, impact: "Crédibilité partielle — compléter les signaux manquants." };
  return { statut: "ko", points: score, max: MAX, detail: `Peu de signaux E-E-A-T. Manquants : ${missing.join(", ")}.`, impact: "Les IAs ne peuvent pas évaluer votre expertise et fiabilité." };
}

// ─── 4. FAQ / Glossaire — 10 pts ─────────────────────────────────────────────

function checkFAQGlossaire(html: string): CheckResult {
  const MAX = 10;
  const htmlLower = html.toLowerCase();
  const hasFAQSchema = html.includes('"FAQPage"') || html.includes("'FAQPage'");
  const hasFAQSection = htmlLower.includes("faq") || htmlLower.includes("foire aux questions") || htmlLower.includes("questions fréquentes") || html.includes("<details") || html.includes("<summary");
  const hasGlossaire = htmlLower.includes("glossaire") || htmlLower.includes("glossary") || htmlLower.includes("lexique");
  if (hasFAQSchema && hasFAQSection) return { statut: "ok", points: 10, max: MAX, detail: "Section FAQ détectée avec schema FAQPage JSON-LD.", impact: "Les IAs extraient directement vos Q&A pour leurs réponses." };
  if (hasFAQSection || hasGlossaire) return { statut: "warn", points: 5, max: MAX, detail: hasFAQSection ? "Section FAQ détectée mais schema FAQPage manquant." : "Glossaire détecté mais aucune FAQ structurée.", impact: "Ajouter le schema FAQPage en JSON-LD pour maximiser l'extraction IA." };
  return { statut: "ko", points: 0, max: MAX, detail: "Aucune FAQ ni glossaire détecté.", impact: "Les IAs ne peuvent pas extraire de Q&A depuis votre site." };
}

// ─── 5. llms.txt — 10 pts ────────────────────────────────────────────────────

async function checkLlmsTxt(url: string): Promise<CheckResult> {
  const MAX = 10;
  try {
    const origin = new URL(url).origin;
    const res = await fetchWithTimeout(`${origin}/llms.txt`, 6000);
    if (!res.ok) return { statut: "ko", points: 0, max: MAX, detail: "Fichier llms.txt absent (404).", impact: "Les LLMs n'ont pas de guide structuré pour comprendre votre site." };
    const text = await res.text();
    if (text.trim().length > 100) return { statut: "ok", points: 10, max: MAX, detail: "llms.txt présent et renseigné.", impact: "Les LLMs disposent d'un guide explicite sur votre activité." };
    return { statut: "warn", points: 3, max: MAX, detail: "llms.txt présent mais contenu insuffisant (< 100 caractères).", impact: "Enrichir llms.txt avec la description de votre activité et vos pages clés." };
  } catch {
    return { statut: "ko", points: 0, max: MAX, detail: "llms.txt inaccessible ou timeout.", impact: "Les LLMs n'ont pas de guide structuré pour comprendre votre site." };
  }
}

// ─── 6. Meta / On-page — 10 pts ──────────────────────────────────────────────

function checkMetaOnpage(html: string): CheckResult {
  const MAX = 10;
  let score = 0;
  const found: string[] = [];
  const missing: string[] = [];
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch?.[1]?.trim() ?? "";
  if (title.length >= 30) { score += 3; found.push("Title optimisé"); } else missing.push("Title manquant ou trop court");
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const desc = descMatch?.[1]?.trim() ?? "";
  if (desc.length >= 80) { score += 3; found.push("Meta description"); } else missing.push("Meta description manquante ou trop courte");
  if (/<h1[^>]*>[\s\S]*?<\/h1>/i.test(html)) { score += 2; found.push("H1 présent"); } else missing.push("H1 absent");
  const htmlLower = html.toLowerCase();
  const hasKeywords = ["ia", "intelligence artificielle", "ai", "seo", "geo", "llm", "chatgpt", "perplexity"].some(k => htmlLower.includes(k));
  if (hasKeywords) { score += 2; found.push("Mots-clés métier détectés"); } else missing.push("Mots-clés métier absents");
  if (score >= 8) return { statut: "ok", points: score, max: MAX, detail: found.join(", ") + ".", impact: "Bon signal on-page pour les IAs et les moteurs de recherche." };
  if (score >= 4) return { statut: "warn", points: score, max: MAX, detail: `Présents : ${found.join(", ")}. Manquants : ${missing.join(", ")}.`, impact: "Optimiser les éléments manquants pour améliorer la compréhension IA." };
  return { statut: "ko", points: score, max: MAX, detail: `Éléments manquants : ${missing.join(", ")}.`, impact: "Les IAs ont du mal à comprendre l'objet de votre page principale." };
}

// ─── 7. Wikidata — 10 pts ────────────────────────────────────────────────────

function checkWikidata(html: string): CheckResult {
  const MAX = 10;
  const hasWikidata = html.includes("wikidata.org/wiki/Q") || html.includes("wikidata.org/entity/Q") || /Q\d{5,}/.test(html);
  if (hasWikidata) return { statut: "ok", points: 10, max: MAX, detail: "Référence Wikidata détectée dans le Schema.org sameAs.", impact: "Votre entité est ancrée dans le graphe de connaissance mondial." };
  return { statut: "ko", points: 0, max: MAX, detail: "Aucune référence Wikidata détectée.", impact: "Créer une entrée Wikidata et l'ajouter au sameAs Schema.org." };
}

// ─── 8. Sitemap — 5 pts ──────────────────────────────────────────────────────

async function checkSitemap(url: string, html: string): Promise<CheckResult> {
  const MAX = 5;
  const hasSitemapLink = html.includes('rel="sitemap"') || html.includes("sitemap.xml") || html.includes("/sitemap");
  try {
    const origin = new URL(url).origin;
    const res = await fetchWithTimeout(`${origin}/sitemap.xml`, 6000);
    if (res.ok) return { statut: "ok", points: 5, max: MAX, detail: "sitemap.xml trouvé et accessible.", impact: "Les crawlers IA peuvent découvrir toutes vos pages facilement." };
  } catch { }
  if (hasSitemapLink) return { statut: "warn", points: 2, max: MAX, detail: "Référence sitemap dans le HTML mais sitemap.xml inaccessible.", impact: "Vérifier que le sitemap.xml est bien déployé et accessible." };
  return { statut: "ko", points: 0, max: MAX, detail: "Aucun sitemap.xml détecté.", impact: "Les crawlers IA ne peuvent pas découvrir l'ensemble de vos pages." };
}

// ─── 9. Open Graph — 5 pts ───────────────────────────────────────────────────

function checkOpenGraph(html: string): CheckResult {
  const MAX = 5;
  const hasTitle = html.includes('property="og:title"') || html.includes("property='og:title'");
  const hasDesc = html.includes('property="og:description"') || html.includes("property='og:description'");
  const hasImage = html.includes('property="og:image"') || html.includes("property='og:image'");
  const count = [hasTitle, hasDesc, hasImage].filter(Boolean).length;
  if (count === 3) return { statut: "ok", points: 5, max: MAX, detail: "og:title, og:description et og:image présents.", impact: "Partage et prévisualisation optimisés sur les plateformes sociales et IA." };
  if (count >= 1) {
    const missing = [!hasTitle && "og:title", !hasDesc && "og:description", !hasImage && "og:image"].filter(Boolean);
    return { statut: "warn", points: 2, max: MAX, detail: `Open Graph partiel. Manquants : ${missing.join(", ")}.`, impact: "Compléter les balises Open Graph manquantes." };
  }
  return { statut: "ko", points: 0, max: MAX, detail: "Aucune balise Open Graph détectée.", impact: "Les IAs et réseaux sociaux ne peuvent pas prévisualiser votre site." };
}

// ─── 10. HTTPS — 5 pts ───────────────────────────────────────────────────────

function checkHTTPS(url: string): CheckResult {
  const MAX = 5;
  if (url.startsWith("https://")) return { statut: "ok", points: 5, max: MAX, detail: "HTTPS activé.", impact: "Signal de confiance pour les IAs et les moteurs de recherche." };
  return { statut: "ko", points: 0, max: MAX, detail: "Site en HTTP non sécurisé.", impact: "HTTPS est un signal de confiance fondamental — migrer immédiatement." };
}

// ─── Handler principal ────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || "unknown";
  if (!checkRateLimit(ip, 10, 60_000)) {
    return res.status(429).json({ error: "Trop de requêtes. Réessayez dans une minute." });
  }

  const { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL manquante ou invalide." });
  }

  let cleanUrl: string;
  try {
    cleanUrl = sanitizeUrl(url.trim());
  } catch {
    return res.status(422).json({ error: "URL invalide. Vérifiez le format (ex: https://exemple.fr)." });
  }

  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (token) {
    try {
      const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) await supabase.rpc("increment_audit_count", { user_id: user.id });
    } catch { }
  }

  let html = "";
  let robotsTxt = "";

  try {
    const origin = new URL(cleanUrl).origin;
    const [htmlRes, robotsRes] = await Promise.all([
      fetchWithTimeout(cleanUrl, 10_000),
      fetchWithTimeout(`${origin}/robots.txt`, 6_000).catch(() => null),
    ]);
    if (!htmlRes.ok) return res.status(422).json({ error: "Impossible d'accéder à cette URL." });
    html = await htmlRes.text();
    robotsTxt = robotsRes?.ok ? await robotsRes.text() : "";
  } catch (e: any) {
    if (e.name === "AbortError") return res.status(422).json({ error: "Timeout — le site met trop de temps à répondre." });
    return res.status(422).json({ error: "Impossible d'accéder à cette URL." });
  }

  const [llmsTxtResult, sitemapResult] = await Promise.all([
    checkLlmsTxt(cleanUrl),
    checkSitemap(cleanUrl, html),
  ]);

  const criteres = [
    { nom: "crawlers_ia",   ...checkCrawlersIA(robotsTxt) },
    { nom: "schema_org",    ...checkSchemaOrg(html) },
    { nom: "eeat",          ...checkEEAT(html) },
    { nom: "faq_glossaire", ...checkFAQGlossaire(html) },
    { nom: "llms_txt",      ...llmsTxtResult },
    { nom: "meta_onpage",   ...checkMetaOnpage(html) },
    { nom: "wikidata",      ...checkWikidata(html) },
    { nom: "sitemap",       ...sitemapResult },
    { nom: "open_graph",    ...checkOpenGraph(html) },
    { nom: "https",         ...checkHTTPS(cleanUrl) },
  ];

  const score = criteres.reduce((acc, c) => acc + c.points, 0);

  return res.status(200).json({
    score,
    niveau: getNiveau(score),
    url: cleanUrl,
    criteres: criteres.map(({ nom, statut, points, max }) => ({ nom, statut, points, max })),
  });
}

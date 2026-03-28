// api/score.ts
// POST /api/score — Plan free
// Retourne le score global + statuts sans détail.
// Auth optionnelle — accessible sans compte.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
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
} from "../src/lib/checkers";

// ─── Helpers inlinés (Vercel ne résout pas les imports relatifs hors /api/) ───

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

// ─── Handler principal ────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "https://otarcy.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });

  // Rate limit par IP — 10 requêtes par minute
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || "unknown";
  if (!checkRateLimit(ip, 10, 60_000)) {
    return res.status(429).json({ error: "Trop de requêtes. Réessayez dans une minute." });
  }

  // Validation URL
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

  // Auth optionnelle — si token présent, incrémenter le compteur
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (token) {
    try {
      const supabase = createClient(
        process.env.VITE_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
      );
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        await supabase.rpc("increment_audit_count", { user_id: user.id });
      }
    } catch {
      // Auth échouée — on continue quand même (plan free)
    }
  }

  // Fetch HTML + robots.txt en parallèle
  let html = "";
  let robotsTxt = "";

  try {
    const origin = new URL(cleanUrl).origin;
    const [htmlRes, robotsRes] = await Promise.all([
      fetchWithTimeout(cleanUrl, 10_000),
      fetchWithTimeout(`${origin}/robots.txt`, 6_000).catch(() => null),
    ]);

    if (!htmlRes.ok) {
      return res.status(422).json({ error: "Impossible d'accéder à cette URL." });
    }

    html = await htmlRes.text();
    robotsTxt = robotsRes?.ok ? await robotsRes.text() : "";
  } catch (e: any) {
    if (e.name === "AbortError") {
      return res.status(422).json({ error: "Timeout — le site met trop de temps à répondre." });
    }
    return res.status(422).json({ error: "Impossible d'accéder à cette URL." });
  }

  // Lancer les vérificateurs synchrones + asynchrones en parallèle
  const [llmsTxtResult, sitemapResult] = await Promise.all([
    checkLlmsTxt(cleanUrl),
    checkSitemap(cleanUrl, html),
  ]);

  const criteres = [
    { nom: "crawlers_ia",  ...checkCrawlersIA(robotsTxt) },
    { nom: "schema_org",   ...checkSchemaOrg(html) },
    { nom: "eeat",         ...checkEEAT(html) },
    { nom: "faq_glossaire",...checkFAQGlossaire(html) },
    { nom: "llms_txt",     ...llmsTxtResult },
    { nom: "meta_onpage",  ...checkMetaOnpage(html) },
    { nom: "wikidata",     ...checkWikidata(html) },
    { nom: "sitemap",      ...sitemapResult },
    { nom: "open_graph",   ...checkOpenGraph(html) },
    { nom: "https",        ...checkHTTPS(cleanUrl) },
  ];

  const score = criteres.reduce((acc, c) => acc + c.points, 0);
  const niveau = getNiveau(score);

  // Payload plan free — statut uniquement, pas de détail
  return res.status(200).json({
    score,
    niveau,
    url: cleanUrl,
    criteres: criteres.map(({ nom, statut, points, max }) => ({
      nom,
      statut,
      points,
      max,
    })),
  });
}

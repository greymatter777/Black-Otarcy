// api/audit.ts
// POST /api/audit — Plan pro et agency
// Retourne le détail complet + quick wins + plan long terme.
// Utilise Claude API uniquement pour la synthèse — pas pour la vérification.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
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

async function verifySupabaseAuth(req: VercelRequest): Promise<{ userId: string; email: string } | null> {
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) return null;
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
  const { data: { user } } = await supabase.auth.getUser(token);
  return user ? { userId: user.id, email: user.email! } : null;
}

function getNiveau(score: number): string {
  if (score <= 30) return "critique";
  if (score <= 55) return "faible";
  if (score <= 75) return "moyen";
  if (score <= 90) return "bon";
  return "excellent";
}

const TITRES: Record<string, string> = {
  crawlers_ia:   "Accès crawlers IA",
  schema_org:    "Schema.org",
  eeat:          "E-E-A-T",
  faq_glossaire: "FAQ / Glossaire",
  llms_txt:      "llms.txt",
  meta_onpage:   "Meta / On-page",
  wikidata:      "Wikidata",
  sitemap:       "Sitemap",
  open_graph:    "Open Graph",
  https:         "HTTPS",
};

// ─── Synthèse Claude API ──────────────────────────────────────────────────────

async function genererSynthese(url: string, criteres: any[]): Promise<{
  quick_wins: any[];
  plan_long_terme: any[];
}> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const critiquesList = criteres
    .filter((c) => c.statut !== "ok")
    .map((c) => `- ${c.titre} (${c.statut}) : ${c.detail} — ${c.impact}`)
    .join("\n");

  const prompt = `Tu es un expert en visibilité IA pour les PME françaises.

Site analysé : ${url}

Critères à améliorer :
${critiquesList}

Génère une réponse JSON strictement dans ce format, sans markdown, sans explication :
{
  "quick_wins": [
    {
      "numero": 1,
      "titre": "Action courte et concrète",
      "description": "Explication en 1-2 phrases. Très actionnable.",
      "impact": "élevé",
      "effort": "15 min",
      "categorie": "Technique"
    }
  ],
  "plan_long_terme": [
    {
      "phase": "Semaine 1-2",
      "titre": "Titre de la phase",
      "actions": "Actions concrètes à réaliser durant cette phase."
    }
  ]
}

Règles :
- Maximum 5 quick wins, triés par impact décroissant
- Exactement 3 phases dans le plan long terme : "Semaine 1-2", "Semaine 3-4", "Mois 2-3"
- impact doit être : "élevé", "moyen" ou "faible"
- effort doit être une durée réaliste : "5 min", "30 min", "1h", "2h", "1 jour"
- categorie doit être : "Technique", "Contenu", "Autorité" ou "Structurel"
- Répondre UNIQUEMENT avec le JSON, rien d'autre`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return {
      quick_wins: [],
      plan_long_terme: [
        { phase: "Semaine 1-2", titre: "Signaux techniques", actions: "Corriger les critères bloquants identifiés." },
        { phase: "Semaine 3-4", titre: "Contenu structuré", actions: "Ajouter FAQ, glossaire et signaux E-E-A-T." },
        { phase: "Mois 2-3",    titre: "Autorité et citations", actions: "Obtenir des citations externes et créer une entrée Wikidata." },
      ],
    };
  }
}

// ─── Handler principal ────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "https://otarcy.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });

  // Rate limit — 5 audits par minute
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || "unknown";
  if (!checkRateLimit(ip, 5, 60_000)) {
    return res.status(429).json({ error: "Trop de requêtes. Réessayez dans une minute." });
  }

  // Auth requise
  const auth = await verifySupabaseAuth(req);
  if (!auth) {
    return res.status(401).json({ error: "Authentification requise." });
  }

  // Vérification plan
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
  const { data: userData } = await supabase
    .from("users")
    .select("plan, audits_count, audits_limit")
    .eq("id", auth.userId)
    .single();

  if (!userData || !["pro", "agency"].includes(userData.plan)) {
    return res.status(403).json({ error: "Plan Essentiel ou Expert requis." });
  }

  if (userData.audits_limit !== -1 && userData.audits_count >= userData.audits_limit) {
    return res.status(403).json({ error: "Limite d'audits atteinte pour ce mois." });
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

  // Fetch HTML + robots.txt
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

  // Vérificateurs en parallèle
  const [llmsTxtResult, sitemapResult] = await Promise.all([
    checkLlmsTxt(cleanUrl),
    checkSitemap(cleanUrl, html),
  ]);

  const criteres = [
    { nom: "crawlers_ia",   titre: TITRES["crawlers_ia"],   ...checkCrawlersIA(robotsTxt) },
    { nom: "schema_org",    titre: TITRES["schema_org"],    ...checkSchemaOrg(html) },
    { nom: "eeat",          titre: TITRES["eeat"],          ...checkEEAT(html) },
    { nom: "faq_glossaire", titre: TITRES["faq_glossaire"], ...checkFAQGlossaire(html) },
    { nom: "llms_txt",      titre: TITRES["llms_txt"],      ...llmsTxtResult },
    { nom: "meta_onpage",   titre: TITRES["meta_onpage"],   ...checkMetaOnpage(html) },
    { nom: "wikidata",      titre: TITRES["wikidata"],      ...checkWikidata(html) },
    { nom: "sitemap",       titre: TITRES["sitemap"],       ...sitemapResult },
    { nom: "open_graph",    titre: TITRES["open_graph"],    ...checkOpenGraph(html) },
    { nom: "https",         titre: TITRES["https"],         ...checkHTTPS(cleanUrl) },
  ];

  const score = criteres.reduce((acc, c) => acc + c.points, 0);
  const niveau = getNiveau(score);

  // Synthèse Claude API
  const { quick_wins, plan_long_terme } = await genererSynthese(cleanUrl, criteres);

  // Incrémenter le compteur d'audits
  await supabase.rpc("increment_audit_count", { user_id: auth.userId });

  return res.status(200).json({
    score,
    niveau,
    url: cleanUrl,
    criteres,
    quick_wins,
    plan_long_terme,
  });
}

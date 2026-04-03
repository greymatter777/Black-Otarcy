import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

async function verifySupabaseAuth(req: VercelRequest): Promise<{ userId: string; email: string } | null> {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.replace("Bearer ", "").trim();
  const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return { userId: user.id, email: user.email ?? "" };
}

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(key: string, limit: number, windowMs = 60_000): { allowed: boolean } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || now > entry.resetAt) { rateLimitStore.set(key, { count: 1, resetAt: now + windowMs }); return { allowed: true }; }
  if (entry.count >= limit) return { allowed: false };
  entry.count++;
  return { allowed: true };
}

function sanitizeBrand(input: unknown): { valid: boolean; value: string; error?: string } {
  if (typeof input !== "string") return { valid: false, value: "", error: "Nom de marque invalide." };
  let clean = input.replace(/<[^>]*>/g, "").replace(/[\x00-\x1F\x7F]/g, "").trim();
  const injectionPatterns = [/ignore previous instructions/i, /ignore all instructions/i, /you are now/i, /act as/i, /jailbreak/i, /system:/i];
  for (const p of injectionPatterns) { if (p.test(clean)) return { valid: false, value: "", error: "Nom de marque invalide." }; }
  if (!clean) return { valid: false, value: "", error: "Le nom de la marque est requis." };
  if (clean.length > 100) return { valid: false, value: "", error: "100 caractères max." };
  return { valid: true, value: clean };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const auth = await verifySupabaseAuth(req);
  if (!auth) return res.status(401).json({ error: "Non authentifié." });
  const { userId } = auth;

  const { allowed } = checkRateLimit(`aio:${userId}`, 5, 60_000);
  if (!allowed) return res.status(429).json({ error: "Trop de requêtes. Attendez une minute." });

  const { valid, value: brand, error: sanitizeError } = sanitizeBrand(req.body?.brand);
  if (!valid) return res.status(400).json({ error: sanitizeError });

  const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
  const { data: user } = await supabase.from("users").select("*").eq("id", userId).single();
  if (!user) return res.status(404).json({ error: "Utilisateur introuvable." });
  if (user.plan === "free") return res.status(403).json({ error: "Réservé aux plans Pro et Agence." });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Configuration serveur manquante." });
  const isAgency = user.plan === "agency";

  const prompt = `Tu es un expert en AIO (AI Optimization). Effectue un audit AIO complet de la marque "${brand}".
Réponds UNIQUEMENT en JSON valide :
{
  "aio_score": <1-100>,
  "ai_perception": { "notoriete_ia": <0-100>, "sentiment": "<positif|neutre|négatif>", "niveau_detail": "<élevé|moyen|faible>", "citation_spontanee": <true|false>, "resume": "<2-3 phrases>" },
  "visibilite": { "sujets_associes": ["<s1>","<s2>","<s3>"], "concurrents_mieux_positionnes": ["<c1>","<c2>","<c3>"], "gaps_contenu": ["<g1>","<g2>","<g3>"] },
  "plan_optimisation": {
    "actions_prioritaires": [{"action":"<a>","impact":"<élevé|moyen|faible>","delai":"<court|moyen|long terme>"},{"action":"<a>","impact":"<élevé|moyen|faible>","delai":"<court|moyen|long terme>"},{"action":"<a>","impact":"<élevé|moyen|faible>","delai":"<court|moyen|long terme>"}],
    "strategie_contenu": ["<r1>","<r2>","<r3>"],
    "strategie_citations": ["<r1>","<r2>"]${isAgency ? `,
    "strategie_marketing_ia": ["<r1>","<r2>","<r3>"],
    "quick_wins": ["<q1>","<q2>","<q3>"]` : ""}
  }
}`;

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }], temperature: 0.7, max_tokens: 2000 }),
    });
    if (!groqRes.ok) return res.status(502).json({ error: "Erreur IA." });
    const groqData = await groqRes.json();
    const rawContent = groqData.choices?.[0]?.message?.content ?? "";
    let parsed: any;
    try { parsed = JSON.parse(rawContent.replace(/```json|```/g, "").trim()); }
    catch { return res.status(500).json({ error: "Réponse IA invalide." }); }

    if (req.body?.auditId) {
      await supabase.from("audits").update({ aio: parsed }).eq("id", req.body.auditId).eq("user_id", userId);
    }
    return res.status(200).json({ ...parsed, plan: user.plan });
  } catch (err: any) {
    return res.status(500).json({ error: "Erreur serveur.", debug: err?.message });
  }
}

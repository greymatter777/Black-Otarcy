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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const auth = await verifySupabaseAuth(req);
  if (!auth) return res.status(401).json({ error: "Non authentifié." });

  const { allowed } = checkRateLimit(`guide:${auth.userId}`, 20, 60_000);
  if (!allowed) return res.status(429).json({ error: "Trop de requêtes." });

  const { recommendation, brand } = req.body;
  if (!recommendation || typeof recommendation !== "string") return res.status(400).json({ error: "Recommandation manquante." });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Configuration manquante." });

  const prompt = `Tu es un expert en branding et marketing digital. 
Pour la marque "${brand ?? "cette marque"}", la recommandation suivante a été identifiée :
"${recommendation}"

Génère un guide d'action concret et actionnable.
Réponds UNIQUEMENT en JSON valide :
{
  "titre": "<titre court du guide>",
  "etapes": [
    { "numero": 1, "action": "<action concrète>", "detail": "<explication pratique en 1-2 phrases>" },
    { "numero": 2, "action": "<action concrète>", "detail": "<explication pratique en 1-2 phrases>" },
    { "numero": 3, "action": "<action concrète>", "detail": "<explication pratique en 1-2 phrases>" },
    { "numero": 4, "action": "<action concrète>", "detail": "<explication pratique en 1-2 phrases>" }
  ],
  "duree_estimee": "<ex: 2-3 heures>",
  "impact": "<élevé|moyen|faible>"
}`;

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }], temperature: 0.7, max_tokens: 800 }),
    });

    if (!groqRes.ok) return res.status(502).json({ error: "Erreur IA." });
    const groqData = await groqRes.json();
    const rawContent = groqData.choices?.[0]?.message?.content ?? "";

    let parsed: any;
    try { parsed = JSON.parse(rawContent.replace(/```json|```/g, "").trim()); }
    catch { return res.status(500).json({ error: "Réponse IA invalide." }); }

    return res.status(200).json(parsed);
  } catch (err: any) {
    return res.status(500).json({ error: "Erreur serveur.", debug: err?.message });
  }
}

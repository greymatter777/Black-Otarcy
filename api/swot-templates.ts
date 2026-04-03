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

  const { allowed } = checkRateLimit(`swot-templates:${auth.userId}`, 10, 60_000);
  if (!allowed) return res.status(429).json({ error: "Trop de requêtes." });

  const { brand, strengths, opportunities } = req.body;
  if (!brand || !strengths || !opportunities) return res.status(400).json({ error: "Données manquantes." });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Configuration manquante." });

  const prompt = `Tu es un expert en personal branding et stratégie LinkedIn.
La marque "${brand}" a les forces suivantes : ${strengths.join(", ")}.
Et les opportunités suivantes : ${opportunities.join(", ")}.

Génère 3 templates de posts LinkedIn percutants, prêts à publier, qui valorisent ces forces et opportunités.
Chaque template doit être différent dans son format et son angle d'attaque.

Réponds UNIQUEMENT en JSON valide :
{
  "templates": [
    {
      "numero": 1,
      "angle": "<angle du post ex: Storytelling force>",
      "format": "<format : Histoire|Liste|Question|Constat|Témoignage>",
      "accroche": "<première ligne accrocheuse, max 15 mots>",
      "contenu": "<corps du post 80-120 mots avec emojis, espaces aérés, naturel>",
      "hashtags": ["<h1>", "<h2>", "<h3>"],
      "conseil": "<conseil d'utilisation en 1 phrase>"
    },
    { "numero": 2, "angle": "", "format": "", "accroche": "", "contenu": "", "hashtags": [], "conseil": "" },
    { "numero": 3, "angle": "", "format": "", "accroche": "", "contenu": "", "hashtags": [], "conseil": "" }
  ]
}`;

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }], temperature: 0.85, max_tokens: 2000 }),
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

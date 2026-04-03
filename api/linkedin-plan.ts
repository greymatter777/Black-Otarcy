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

  const { allowed } = checkRateLimit(`linkedin:${auth.userId}`, 10, 60_000);
  if (!allowed) return res.status(429).json({ error: "Trop de requêtes." });

  const { brand, aio_score, gaps_contenu, sujets_associes, actions_prioritaires } = req.body;
  if (!brand) return res.status(400).json({ error: "Données manquantes." });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Configuration manquante." });

  const prompt = `Tu es un expert en stratégie de contenu LinkedIn et en AIO (AI Optimization).
La marque "${brand}" a un score AIO de ${aio_score}/100.
Gaps de contenu identifiés : ${gaps_contenu?.join(", ") ?? "non spécifiés"}.
Sujets associés à la marque : ${sujets_associes?.join(", ") ?? "non spécifiés"}.
Actions prioritaires : ${actions_prioritaires?.map((a: any) => a.action).join(", ") ?? "non spécifiées"}.

Génère un plan de contenu LinkedIn de 5 posts prêts à publier pour améliorer la visibilité de "${brand}" auprès des IAs.
Chaque post doit être concret, engageant, optimisé pour être cité par les IAs.

Réponds UNIQUEMENT en JSON valide :
{
  "posts": [
    {
      "numero": 1,
      "theme": "<thème court>",
      "type": "<type : Storytelling|Éducatif|Preuve sociale|Tendance|Conseil pratique>",
      "accroche": "<première ligne percutante, max 15 mots>",
      "contenu": "<corps du post, 100-150 mots, avec emojis, naturel et humain>",
      "hashtags": ["<hashtag1>", "<hashtag2>", "<hashtag3>"],
      "objectif_aio": "<pourquoi ce post améliore ta visibilité IA en 1 phrase>"
    },
    { "numero": 2, "theme": "", "type": "", "accroche": "", "contenu": "", "hashtags": [], "objectif_aio": "" },
    { "numero": 3, "theme": "", "type": "", "accroche": "", "contenu": "", "hashtags": [], "objectif_aio": "" },
    { "numero": 4, "theme": "", "type": "", "accroche": "", "contenu": "", "hashtags": [], "objectif_aio": "" },
    { "numero": 5, "theme": "", "type": "", "accroche": "", "contenu": "", "hashtags": [], "objectif_aio": "" }
  ]
}`;

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }], temperature: 0.8, max_tokens: 2500 }),
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

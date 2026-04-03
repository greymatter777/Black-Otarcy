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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const auth = await verifySupabaseAuth(req);
  if (!auth) return res.status(401).json({ error: "Non authentifié." });
  const { userId, email } = auth;

  const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
  let { data: user } = await supabase.from("users").select("*").eq("id", userId).single();

  if (!user) {
    await supabase.from("users").insert({ id: userId, email, plan: "free", audits_used: 0, audits_limit: 3 });
    const { data } = await supabase.from("users").select("*").eq("id", userId).single();
    user = data;
  }
  if (!user) return res.status(500).json({ error: "Erreur serveur." });

  return res.status(200).json({
    auditsLeft: user.audits_limit === -1 ? 999 : Math.max(0, user.audits_limit - user.audits_used),
    auditsUsed: user.audits_used, auditsLimit: user.audits_limit,
    plan: user.plan, email: user.email,
  });
}

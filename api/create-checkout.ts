import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
const PRICE_IDS: Record<string, string> = {
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  agency: process.env.STRIPE_AGENCY_PRICE_ID!,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const auth = await verifySupabaseAuth(req);
  if (!auth) return res.status(401).json({ error: "Non authentifié." });

  const { allowed } = checkRateLimit(`checkout:${auth.userId}`, 5, 60_000);
  if (!allowed) return res.status(429).json({ error: "Trop de tentatives." });

  const { plan } = req.body;
  if (!plan || !["pro", "agency"].includes(plan) || !PRICE_IDS[plan])
    return res.status(400).json({ error: "Plan invalide." });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      ...(auth.email ? { customer_email: auth.email } : {}),
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      metadata: { user_id: auth.userId, plan },
      success_url: "https://otarcy.app/?success=true",
      cancel_url: "https://otarcy.app/pricing?canceled=true",
    });
    return res.status(200).json({ url: session.url });
  } catch {
    return res.status(500).json({ error: "Erreur paiement." });
  }
}

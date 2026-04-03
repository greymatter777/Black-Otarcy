// api/newsletter.ts
// Endpoint : POST /api/newsletter
// Payload  : { email: string }
// Env vars : RESEND_API_KEY, RESEND_NEWSLETTER_AUDIENCE_ID
//
// ⚠️  Créer une NOUVELLE audience dans Resend dédiée à la newsletter
//     (séparée de l'audience leads existante RESEND_AUDIENCE_ID)
//     Nommer : "Le Brief AIO — Newsletter"
//     Copier l'ID dans RESEND_NEWSLETTER_AUDIENCE_ID sur Vercel

import type { VercelRequest, VercelResponse } from "@vercel/node";

// ─── Rate limit simple en mémoire ────────────────────────────────────────────
const rateMap = new Map<string, { count: number; ts: number }>();
function checkRateLimit(ip: string, max = 3, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.ts > windowMs) {
    rateMap.set(ip, { count: 1, ts: now });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

// ─── Validation email basique ─────────────────────────────────────────────────
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ─── Handler principal ────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Rate limit
  const ip = (req.headers["x-forwarded-for"] as string) || "unknown";
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: "Trop de requêtes. Réessayez dans une minute." });
  }

  const { email } = req.body || {};
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: "Adresse email invalide." });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const AUDIENCE_ID = process.env.RESEND_NEWSLETTER_AUDIENCE_ID;

  if (!RESEND_API_KEY || !AUDIENCE_ID) {
    console.error("Missing env: RESEND_API_KEY or RESEND_NEWSLETTER_AUDIENCE_ID");
    return res.status(500).json({ error: "Configuration serveur manquante." });
  }

  try {
    // 1. Ajouter le contact à l'audience newsletter Resend
    const contactRes = await fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        audience_id: AUDIENCE_ID,
        unsubscribed: false,
      }),
    });

    const contactData = await contactRes.json();

    // Resend renvoie 409 si le contact existe déjà — on le traite comme un succès
    if (!contactRes.ok && contactRes.status !== 409) {
      console.error("Resend contact error:", contactData);
      return res.status(500).json({ error: "Impossible d'enregistrer l'inscription." });
    }

    // 2. Email de confirmation à l'abonné
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Le Brief AIO <onboarding@resend.dev>",
        // ⚠️ Remplacer par votre domaine vérifié dans Resend
        // En attendant : "onboarding@resend.dev" fonctionne en test
        to: [email.trim().toLowerCase()],
        subject: "Bienvenue dans Le Brief AIO ✦",
        html: confirmationEmailHtml(email.trim()),
      }),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Newsletter endpoint error:", err);
    return res.status(500).json({ error: "Erreur serveur." });
  }
}

// ─── Email de confirmation ────────────────────────────────────────────────────
function confirmationEmailHtml(email: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Bienvenue dans Le Brief AIO</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Courier New',monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" style="max-width:560px;background:#111;border:1px solid #1e1e1e;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 24px;border-bottom:1px solid #1e1e1e;">
              <span style="font-size:11px;letter-spacing:0.15em;color:#a3e635;text-transform:uppercase;">Otarcy</span>
              <h1 style="margin:8px 0 0;font-size:24px;font-weight:700;color:#f0f0f0;letter-spacing:-0.02em;">
                Le Brief <em style="color:#a3e635;">AIO</em>
              </h1>
              <p style="margin:4px 0 0;font-size:11px;color:#444;text-transform:uppercase;letter-spacing:0.1em;">
                Chaque dimanche matin
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 20px;font-size:15px;color:#aaa;line-height:1.7;">
                Inscription confirmée. 👋
              </p>
              <p style="margin:0 0 20px;font-size:14px;color:#666;line-height:1.7;">
                Dès dimanche, vous recevrez votre premier Brief AIO — 5 minutes pour comprendre 
                comment les intelligences artificielles perçoivent les marques et ce que ça change 
                pour votre visibilité.
              </p>
              <div style="border-left:2px solid #a3e635;padding:12px 16px;margin:24px 0;background:#0d0d0d;">
                <p style="margin:0;font-size:13px;color:#888;line-height:1.6;">
                  Au programme chaque semaine :<br/>
                  <span style="color:#a3e635;">→</span> Synthèse des actus AIO<br/>
                  <span style="color:#a3e635;">→</span> 1 marque analysée sous l'angle IA<br/>
                  <span style="color:#a3e635;">→</span> 1 action concrète à implémenter
                </p>
              </div>
              <p style="margin:24px 0 0;font-size:13px;color:#444;line-height:1.6;">
                En attendant, testez gratuitement l'audit AIO de votre marque sur 
                <a href="https://otarcy.app" style="color:#a3e635;text-decoration:none;">otarcy.app</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px;border-top:1px solid #1a1a1a;">
              <p style="margin:0;font-size:11px;color:#333;line-height:1.6;">
                Vous recevez cet email car vous vous êtes inscrit(e) sur otarcy.fr.<br/>
                <a href="https://otarcy.app/unsubscribe?email=${encodeURIComponent(email)}"
                   style="color:#444;text-decoration:underline;">Se désabonner</a>
                &nbsp;·&nbsp; Otarcy France — Bordeaux
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

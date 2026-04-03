// api/digest.ts
// Endpoint  : POST /api/digest
// Sécurité  : header Authorization: Bearer <DIGEST_SECRET>
// Déclenché : GitHub Actions (cron samedi 20h00 Paris)
//
// Env vars nécessaires :
//   DIGEST_SECRET               — token secret partagé avec GitHub Actions
//   GROQ_API_KEY                — déjà présent
//   RESEND_API_KEY              — déjà présent
//   RESEND_NEWSLETTER_AUDIENCE_ID — déjà présent (liste abonnés)
//   DIGEST_RECIPIENT_EMAIL      — ton email perso (ex: toi@gmail.com)

import type { VercelRequest, VercelResponse } from "@vercel/node";

// ─── Sources RSS AIO / AI ──────────────────────────────────────────────────────
const RSS_SOURCES = [
  { name: "Search Engine Journal — AI", url: "https://www.searchenginejournal.com/category/seo/feed/" },
  { name: "The Rundown AI", url: "https://www.therundown.ai/rss" },
  { name: "Ben's Bites", url: "https://bensbites.beehiiv.com/feed" },
  { name: "AI Snack", url: "https://aisnack.substack.com/feed" },
  { name: "Marketing AI Institute", url: "https://www.marketingaiinstitute.com/blog/rss.xml" },
  { name: "Maginative", url: "https://maginative.com/feed/" },
];

// ─── Types ─────────────────────────────────────────────────────────────────────
interface RssItem {
  source: string;
  title: string;
  link: string;
  pubDate: string;
  snippet: string;
}

interface DigestResult {
  raw: RssItem[];
  summary_fr: string;
  newsletter_html: string;
  edition_number?: number;
  date_label: string;
}

// ─── Fetch + parse RSS (sans librairie externe) ────────────────────────────────
async function fetchRssFeed(source: { name: string; url: string }): Promise<RssItem[]> {
  try {
    const res = await fetch(source.url, {
      headers: { "User-Agent": "Otarcy-Digest-Bot/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const xml = await res.text();

    // Parse minimal XML sans DOM
    const items: RssItem[] = [];
    const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);

    for (const match of itemMatches) {
      const block = match[1];
      const title = extractTag(block, "title");
      const link = extractTag(block, "link") || extractAttr(block, "guid");
      const pubDate = extractTag(block, "pubDate");
      const description = extractTag(block, "description");

      if (!title || !link) continue;

      // Filtrer les articles AIO/AI pertinents
      const relevant = isAioRelevant(title + " " + description);
      if (!relevant) continue;

      items.push({
        source: source.name,
        title: cleanText(title),
        link: cleanText(link),
        pubDate: pubDate || "",
        snippet: cleanText(description).slice(0, 300),
      });

      if (items.length >= 3) break; // Max 3 items par source
    }

    return items;
  } catch {
    return [];
  }
}

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, "i"));
  return match ? match[1].trim() : "";
}

function extractAttr(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? match[1].trim() : "";
}

function cleanText(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function isAioRelevant(text: string): boolean {
  const keywords = [
    "ai", "artificial intelligence", "llm", "chatgpt", "claude", "gemini", "perplexity",
    "search", "seo", "aio", "generative", "openai", "google ai", "bing ai", "copilot",
    "optimization", "visibility", "brand", "content", "marketing", "ranking",
  ];
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

// ─── Résumé + éditorialisation via Groq ───────────────────────────────────────
async function generateDigest(items: RssItem[], groqKey: string): Promise<{ summary_fr: string; newsletter_html: string }> {
  const articlesText = items
    .map((item, i) => `[${i + 1}] ${item.source}\nTitre: ${item.title}\nLien: ${item.link}\nExtrait: ${item.snippet}`)
    .join("\n\n");

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const prompt = `Tu es l'éditeur du "Brief AIO" — la newsletter française de référence sur l'AI Optimization pour les PME.

Voici les articles de la semaine collectés automatiquement :

${articlesText}

Génère EXACTEMENT le JSON suivant (sans markdown, sans commentaires) :

{
  "summary_fr": "Résumé brut en français pour l'éditeur — 3-4 paragraphes, style analytique, liste les faits clés de chaque article pertinent avec la source. Maximum 500 mots.",
  "titre_edition": "Titre accrocheur pour cette édition du Brief AIO (max 10 mots)",
  "actu_semaine": [
    {
      "titre": "Titre de l'actu (max 8 mots)",
      "source": "Nom de la source",
      "analyse": "Analyse en 3-4 phrases : les faits, ce que ça change pour les PME françaises, le lien avec l'AIO",
      "implication": "1 phrase — la conséquence concrète pour une marque française"
    }
  ],
  "action_semaine": {
    "titre": "Titre de l'action (max 8 mots)",
    "contexte": "1-2 phrases de contexte lié aux actus de la semaine",
    "etapes": ["étape 1", "étape 2", "étape 3"],
    "impact": "1 phrase sur l'impact attendu"
  }
}

Sélectionne les 2-3 actus les plus importantes pour les PME françaises. Style éditorial : direct, factuel, orienté action.
Date de l'édition : ${today}`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${groqKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 2000,
      temperature: 0.4,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`Groq error: ${res.status}`);
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || "";

  let parsed: any;
  try {
    const clean = raw.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(clean);
  } catch {
    // Fallback si le JSON est malformé
    return {
      summary_fr: raw,
      newsletter_html: buildFallbackHtml(items, today),
    };
  }

  return {
    summary_fr: parsed.summary_fr || raw,
    newsletter_html: buildNewsletterHtml(parsed, today),
  };
}

// ─── Template HTML Newsletter abonnés ─────────────────────────────────────────
function buildNewsletterHtml(data: any, dateLabel: string): string {
  const actus = (data.actu_semaine || []).slice(0, 3);
  const action = data.action_semaine || {};

  const actusHtml = actus
    .map(
      (a: any, i: number) => `
    <tr>
      <td style="padding:${i > 0 ? "24px 36px 0" : "0 36px"};">
        ${i > 0 ? '<div style="height:1px;background:#1a1a1a;margin-bottom:24px;"></div>' : ""}
        <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.2em;color:#a3e635;text-transform:uppercase;font-family:\'Courier New\',monospace;">
          ${String(i + 1).padStart(2, "0")} — Actu
        </p>
        <h3 style="margin:0 0 10px;font-size:16px;font-weight:700;color:#e0e0e0;line-height:1.3;font-family:\'Courier New\',monospace;">
          ${a.titre || ""}
        </h3>
        <p style="margin:0 0 10px;font-size:11px;color:#444;text-transform:uppercase;letter-spacing:0.1em;font-family:\'Courier New\',monospace;">
          Source : ${a.source || ""}
        </p>
        <p style="margin:0 0 12px;font-size:13px;color:#777;line-height:1.8;font-family:\'Courier New\',monospace;">
          ${a.analyse || ""}
        </p>
        <div style="border-left:2px solid #a3e635;padding:10px 14px;background:#0d0d0d;">
          <p style="margin:0;font-size:12px;color:#888;line-height:1.7;font-family:\'Courier New\',monospace;">
            <span style="color:#a3e635;font-weight:700;">Pour votre marque →</span> ${a.implication || ""}
          </p>
        </div>
      </td>
    </tr>`
    )
    .join("");

  const etapesHtml = (action.etapes || [])
    .map(
      (e: string, i: number) =>
        `<p style="margin:0 0 8px;font-size:12px;color:#888;line-height:1.7;font-family:\'Courier New\',monospace;">
      <span style="color:#a3e635;">→</span> ${e}
    </p>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Le Brief AIO — ${dateLabel}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Courier New',monospace;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;min-height:100vh;">
  <tr>
    <td align="center" style="padding:40px 16px 60px;">
      <table width="100%" style="max-width:580px;">

        <!-- Header bande -->
        <tr>
          <td style="padding-bottom:32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td><span style="font-size:10px;letter-spacing:0.2em;color:#a3e635;text-transform:uppercase;">Otarcy — AI Optimization</span></td>
                <td align="right"><span style="font-size:10px;letter-spacing:0.1em;color:#333;text-transform:uppercase;">${dateLabel}</span></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Masthead -->
        <tr>
          <td style="background:#111;border:1px solid #1e1e1e;padding:40px 36px 32px;">
            <div style="border-bottom:1px solid #1e1e1e;padding-bottom:28px;margin-bottom:28px;">
              <h1 style="margin:0;font-size:32px;font-weight:700;color:#f0f0f0;line-height:1.1;letter-spacing:-0.03em;">
                Le Brief <em style="color:#a3e635;font-style:italic;">AIO</em>
              </h1>
              <p style="margin:8px 0 0;font-size:13px;color:#555;line-height:1.6;">
                La veille AI Optimization pour les marques françaises
              </p>
            </div>
            <h2 style="margin:0;font-size:20px;font-weight:700;color:#f0f0f0;line-height:1.2;letter-spacing:-0.02em;">
              ${data.titre_edition || "Veille AIO de la semaine"}
            </h2>
          </td>
        </tr>

        <!-- Séparateur vert -->
        <tr><td style="height:2px;background:linear-gradient(90deg,#a3e635,transparent);"></td></tr>

        <!-- Actus -->
        <tr>
          <td style="background:#111;border:1px solid #1e1e1e;border-top:none;padding:32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:0 36px 24px;">
                  <p style="margin:0;font-size:10px;letter-spacing:0.2em;color:#a3e635;text-transform:uppercase;">
                    Cette semaine
                  </p>
                </td>
              </tr>
              ${actusHtml}
            </table>
          </td>
        </tr>

        <!-- Séparateur -->
        <tr><td style="height:1px;background:#1a1a1a;"></td></tr>

        <!-- Action de la semaine -->
        <tr>
          <td style="background:#0f0f0f;border:1px solid #1e1e1e;border-top:none;padding:32px 36px;">
            <p style="margin:0 0 16px;font-size:10px;letter-spacing:0.2em;color:#a3e635;text-transform:uppercase;">
              Action de la semaine
            </p>
            <h3 style="margin:0 0 10px;font-size:16px;font-weight:700;color:#e0e0e0;line-height:1.3;">
              ${action.titre || ""}
            </h3>
            <p style="margin:0 0 16px;font-size:13px;color:#777;line-height:1.8;">
              ${action.contexte || ""}
            </p>
            ${etapesHtml}
            ${action.impact ? `<div style="border-left:2px solid #333;padding:10px 14px;background:#0a0a0a;margin-top:16px;">
              <p style="margin:0;font-size:12px;color:#666;line-height:1.7;font-style:italic;">${action.impact}</p>
            </div>` : ""}
          </td>
        </tr>

        <!-- CTA -->
        <tr><td style="height:1px;background:linear-gradient(90deg,transparent,#a3e635,transparent);"></td></tr>
        <tr>
          <td style="background:#0d1a00;border:1px solid #1e3000;border-top:none;padding:28px 36px;text-align:center;">
            <p style="margin:0 0 12px;font-size:11px;color:#5a7a2a;text-transform:uppercase;letter-spacing:0.15em;">
              Découvrez votre score AIO gratuitement
            </p>
            <a href="https://otarcy.app/#audit"
               style="display:inline-block;background:#a3e635;color:#0a0a0a;padding:12px 28px;font-size:12px;font-weight:700;font-family:'Courier New',monospace;text-decoration:none;letter-spacing:0.05em;text-transform:uppercase;">
              Auditer ma marque →
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 0 0;">
            <p style="margin:0 0 6px;font-size:11px;color:#2a2a2a;line-height:1.6;">
              <strong style="color:#333;">Le Brief AIO</strong> par Otarcy France — Bordeaux, Gironde
            </p>
            <p style="margin:0;font-size:11px;color:#222;line-height:1.6;">
              <a href="https://otarcy.app" style="color:#333;text-decoration:none;">otarcy.app</a>
              &nbsp;·&nbsp;
              <a href="https://www.linkedin.com/company/otarcy-france" style="color:#333;text-decoration:none;">LinkedIn</a>
              &nbsp;·&nbsp;
              <a href="https://otarcy.app/unsubscribe" style="color:#2a2a2a;text-decoration:underline;">Se désabonner</a>
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

function buildFallbackHtml(items: RssItem[], dateLabel: string): string {
  return `<p>Digest du ${dateLabel} — ${items.length} articles collectés. Résumé IA indisponible cette semaine.</p>`;
}

// ─── Email digest brut pour l'éditeur ─────────────────────────────────────────
function buildEditorEmailHtml(summary: string, items: RssItem[], dateLabel: string): string {
  const itemsHtml = items
    .map(
      (item) =>
        `<tr>
      <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;">
        <p style="margin:0 0 4px;font-size:11px;color:#a3e635;font-family:'Courier New',monospace;">${item.source}</p>
        <a href="${item.link}" style="color:#e0e0e0;font-size:13px;font-family:'Courier New',monospace;text-decoration:none;">${item.title}</a>
        <p style="margin:6px 0 0;font-size:11px;color:#555;font-family:'Courier New',monospace;line-height:1.6;">${item.snippet}</p>
      </td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"/><title>Brief AIO — Digest éditeur ${dateLabel}</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" style="max-width:620px;">

          <tr>
            <td style="background:#111;border:1px solid #a3e635;padding:24px 28px;margin-bottom:24px;">
              <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.2em;color:#a3e635;text-transform:uppercase;font-family:'Courier New',monospace;">
                ⚙ Digest éditeur — usage interne
              </p>
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#f0f0f0;font-family:'Courier New',monospace;">
                Brief AIO — ${dateLabel}
              </h1>
              <p style="margin:8px 0 0;font-size:12px;color:#555;font-family:'Courier New',monospace;">
                ${items.length} articles collectés · Résumé IA ci-dessous · Version abonnés envoyée séparément
              </p>
            </td>
          </tr>

          <!-- Résumé IA -->
          <tr>
            <td style="background:#0d0d0d;border:1px solid #1e1e1e;border-top:none;padding:24px 28px;">
              <p style="margin:0 0 14px;font-size:10px;letter-spacing:0.15em;color:#a3e635;text-transform:uppercase;font-family:'Courier New',monospace;">
                Résumé IA (Groq)
              </p>
              <p style="margin:0;font-size:13px;color:#aaa;line-height:1.8;font-family:'Courier New',monospace;white-space:pre-wrap;">${summary}</p>
            </td>
          </tr>

          <!-- Articles bruts -->
          <tr>
            <td style="background:#0a0a0a;border:1px solid #1e1e1e;border-top:none;padding:24px 28px;">
              <p style="margin:0 0 16px;font-size:10px;letter-spacing:0.15em;color:#555;text-transform:uppercase;font-family:'Courier New',monospace;">
                Sources collectées
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemsHtml}
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Récupère tous les abonnés de l'audience Resend ───────────────────────────
async function getNewsletterContacts(audienceId: string, resendKey: string): Promise<string[]> {
  try {
    const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      headers: { Authorization: `Bearer ${resendKey}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || [])
      .filter((c: any) => !c.unsubscribed)
      .map((c: any) => c.email as string);
  } catch {
    return [];
  }
}

// ─── Envoi Resend ──────────────────────────────────────────────────────────────
async function sendEmail(params: {
  resendKey: string;
  to: string | string[];
  subject: string;
  html: string;
}) {
  const payload = {
    from: "Le Brief AIO <onboarding@resend.dev>",
    to: Array.isArray(params.to) ? params.to : [params.to],
    subject: params.subject,
    html: params.html,
  };
  console.log("[digest] sendEmail to:", JSON.stringify(payload.to), "subject:", params.subject);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  console.log("[digest] Resend response:", res.status, JSON.stringify(data));
  return res.ok;
}

// ─── Handler principal ─────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Auth par secret partagé
  const authHeader = req.headers["authorization"] || "";
  const secret = authHeader.replace("Bearer ", "").trim();
  if (!secret || secret !== process.env.DIGEST_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY!;
  const RESEND_API_KEY = process.env.RESEND_API_KEY!;
  const AUDIENCE_ID = process.env.RESEND_NEWSLETTER_AUDIENCE_ID!;
  const EDITOR_EMAIL = process.env.DIGEST_RECIPIENT_EMAIL!;

  if (!GROQ_API_KEY || !RESEND_API_KEY || !AUDIENCE_ID || !EDITOR_EMAIL) {
    return res.status(500).json({ error: "Missing env vars" });
  }

  try {
    // 1. Scrape toutes les sources RSS en parallèle
    console.log("[digest] Fetching RSS feeds...");
    const feedResults = await Promise.all(RSS_SOURCES.map(fetchRssFeed));
    const allItems = feedResults.flat();
    console.log(`[digest] ${allItems.length} articles collectés`);

    if (allItems.length === 0) {
      return res.status(200).json({ ok: true, message: "Aucun article collecté, digest annulé." });
    }

    // 2. Générer le résumé + la newsletter via Groq
    console.log("[digest] Generating digest via Groq...");
    const { summary_fr, newsletter_html } = await generateDigest(allItems, GROQ_API_KEY);

    const dateLabel = new Date().toLocaleDateString("fr-FR", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

    // 3. Email éditeur (digest brut)
    console.log("[digest] Sending editor digest...");
    const editorHtml = buildEditorEmailHtml(summary_fr, allItems, dateLabel);
    await sendEmail({
      resendKey: RESEND_API_KEY,
      to: EDITOR_EMAIL,
      subject: `⚙ Brief AIO — Digest éditeur ${dateLabel}`,
      html: editorHtml,
    });

    // 4. Récupérer les abonnés et envoyer la newsletter
    // Délai de 1s pour respecter le rate limit Resend (2 req/s)
    await new Promise((r) => setTimeout(r, 1000));
    console.log("[digest] Fetching subscribers...");
    const subscribers = await getNewsletterContacts(AUDIENCE_ID, RESEND_API_KEY);
    console.log(`[digest] ${subscribers.length} abonnés`);

    if (subscribers.length > 0) {
      // Resend limite à 50 destinataires par appel — on batch
      const BATCH_SIZE = 50;
      for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
        const batch = subscribers.slice(i, i + BATCH_SIZE);
        await sendEmail({
          resendKey: RESEND_API_KEY,
          to: batch,
          subject: `Le Brief AIO — ${dateLabel}`,
          html: newsletter_html,
        });
        // Délai entre chaque batch
        if (i + BATCH_SIZE < subscribers.length) {
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    }

    console.log("[digest] Done.");
    return res.status(200).json({
      ok: true,
      articles_collected: allItems.length,
      subscribers_notified: subscribers.length,
    });
  } catch (err: any) {
    console.error("[digest] Error:", err);
    return res.status(500).json({ error: err.message || "Erreur serveur" });
  }
}

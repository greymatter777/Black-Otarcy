---
name: vercel-api
description: Patterns et conventions pour créer ou modifier des fonctions serverless Vercel dans le projet Otarcy. Utiliser cette skill dès qu'on touche à un fichier dans /api/, qu'on crée un nouvel endpoint, qu'on ajoute un fetch externe, ou qu'on gère l'auth Supabase côté serveur. Déclencher aussi pour tout ajout de variable d'environnement, gestion CORS, retry logic, ou timeout. Ne jamais écrire une fonction API sans avoir lu cette skill.
---

# vercel-api

Conventions battle-tested pour les fonctions serverless Vercel d'Otarcy.
Chaque pattern ici existe parce qu'un problème réel l'a rendu nécessaire en production.

---

## Règles absolues — NE PAS DÉROGER

1. **JAMAIS d'import relatif hors `/api/`** — Vercel ne résout pas `../src/lib/` au runtime. Tout helper doit être inliné dans le fichier API.
2. **TOUJOURS `sanitizeUrl()`** sur toute URL entrante avant `new URL()`
3. **TOUJOURS `fetchWithTimeout()`** sur tout fetch externe — jamais de `fetch()` nu
4. **TOUJOURS le retry pattern** sur le fetch principal du site cible
5. **TOUJOURS les headers CORS** en tête de chaque handler
6. **JAMAIS hardcoder une URL** — toujours `process.env.VITE_SUPABASE_URL` etc.
7. **JAMAIS logger les clés API ou tokens JWT**
8. **Score toujours calculé côté serveur** — jamais côté client
9. **Les checkers ne font jamais d'appel LLM** — parsing HTML uniquement

---

## Structure d'un fichier API — anatomie complète

```typescript
import type { VercelRequest, VercelResponse } from "@vercel/node";
// imports node uniquement — pas d'imports relatifs src/

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. CORS — toujours en premier
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  // 2. Méthode
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // 3. Auth (si endpoint protégé)
  const user = await verifySupabaseAuth(req);
  if (!user) return res.status(401).json({ error: "Non authentifié" });

  // 4. Body
  const { url: rawUrl } = req.body;
  if (!rawUrl) return res.status(400).json({ error: "URL manquante" });

  // 5. Sanitize + validation
  const normalizedUrl = sanitizeUrl(rawUrl);
  try { new URL(normalizedUrl); }
  catch { return res.status(400).json({ error: "URL invalide" }); }

  // 6. Fetch avec retry
  // ... voir pattern complet ci-dessous

  // 7. Réponse
  return res.status(200).json({ ... });
}

// Helpers inlinés en bas du fichier
```

---

## Helpers — code exact à copier dans chaque fichier API

### sanitizeUrl()
```typescript
function sanitizeUrl(raw: string): string {
  let url = raw.trim().replace(/[\u00A0\u200B\uFEFF\u00AD]/g, "");
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  url = url.replace(/\s+/g, "");
  return url;
}
```
**Pourquoi** : les URLs collées depuis un navigateur contiennent souvent des caractères invisibles (espace insécable, zero-width space) qui font planter `new URL()`. L'ajout automatique de `https://` évite les erreurs utilisateur.

### fetchWithTimeout()
```typescript
async function fetchWithTimeout(url: string, ms = 15000): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
      },
    });
  } finally {
    clearTimeout(t);
  }
}
```
**Pourquoi** : timeout à 15s car certains sites sont lents. User-Agent Chrome réaliste pour éviter les 403 anti-bot. `redirect: "follow"` pour gérer les redirections HTTP→HTTPS automatiquement.

### Retry pattern — fetch principal
```typescript
let response: Response;
try {
  response = await fetchWithTimeout(normalizedUrl);
  if (response.status === 403 || response.status === 406) {
    response = await fetchWithTimeout(normalizedUrl.replace(/^http:\/\//i, "https://"));
  }
} catch (err: any) {
  const urlObj = new URL(normalizedUrl);
  if (!urlObj.hostname.startsWith("www.")) {
    const wwwUrl = normalizedUrl.replace(urlObj.hostname, "www." + urlObj.hostname);
    try {
      response = await fetchWithTimeout(wwwUrl);
    } catch {
      return res.status(422).json({ error: "Impossible d'accéder à cette URL. Vérifiez qu'elle est accessible publiquement." });
    }
  } else {
    return res.status(422).json({ error: "Impossible d'accéder à cette URL. Vérifiez qu'elle est accessible publiquement." });
  }
}
```
**Pourquoi** : 403/406 → retry https (souvent un problème de protocole). Erreur réseau → retry avec `www.` (beaucoup de PME françaises n'ont pas de redirect www→apex).

### CORS headers
```typescript
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
if (req.method === "OPTIONS") return res.status(200).end();
```
**Pourquoi** : Vercel serverless ne gère pas le preflight OPTIONS automatiquement. Sans ça, tous les appels depuis le front échouent en CORS.

### verifySupabaseAuth() — endpoints protégés uniquement
```typescript
async function verifySupabaseAuth(req: VercelRequest): Promise<{ userId: string; email: string } | null> {
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) return null;
  const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
  const { data: { user } } = await supabase.auth.getUser(token);
  return user ? { userId: user.id, email: user.email! } : null;
}
```
**Pourquoi** : inliné car Vercel ne résout pas les imports relatifs. Utilise `SUPABASE_SERVICE_KEY` (pas la clé anon) pour vérifier le token côté serveur.

---

## Gestion des erreurs — codes de retour standards

```typescript
// URL manquante
res.status(400).json({ error: "URL manquante" })

// URL invalide (ne passe pas new URL())
res.status(400).json({ error: "URL invalide" })

// Non authentifié
res.status(401).json({ error: "Non authentifié" })

// Plan insuffisant
res.status(403).json({ error: "Plan insuffisant" })

// Site inaccessible (après retry)
res.status(422).json({ error: "Impossible d'accéder à cette URL. Vérifiez qu'elle est accessible publiquement." })

// Méthode non autorisée
res.status(405).json({ error: "Method not allowed" })
```

---

## Variables d'environnement disponibles

### Existantes — ne pas modifier
```
GROQ_API_KEY
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY
STRIPE_SECRET_KEY
STRIPE_PRO_PRICE_ID
STRIPE_AGENCY_PRICE_ID
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY
RESEND_AUDIENCE_ID
RESEND_NEWSLETTER_AUDIENCE_ID
DIGEST_SECRET
DIGEST_RECIPIENT_EMAIL
```

### À ajouter (pas encore actives)
```
ANTHROPIC_API_KEY     → synthèse quick wins dans api/audit.ts
OPENROUTER_API_KEY    → workflow 2 dans api/llm-perception.ts
```

---

## Endpoints existants — ne pas casser

| Fichier | Route | Auth | Plan |
|---------|-------|------|------|
| api/score.ts | POST /api/score | Non | free |
| api/audit.ts | POST /api/audit | Oui | pro + agency |
| api/newsletter.ts | — | — | — |
| api/digest.ts | — | — | — |
| api/webhook.ts | — | — | Stripe — critique |
| api/create-checkout.ts | — | — | Stripe — critique |
| api/history.ts | — | — | — |
| api/user-status.ts | — | — | — |

**Ne jamais modifier** : newsletter, digest, webhook, create-checkout.

---

## Prochain endpoint à créer — api/llm-perception.ts

```
Route   : POST /api/llm-perception
Auth    : oui (plan agency)
Payload : { url: string, brand: string }
Clé     : OPENROUTER_API_KEY
Endpoint OpenRouter : https://openrouter.ai/api/v1/chat/completions
```

Modèles à appeler en parallèle :
```
anthropic/claude-sonnet-4-20250514
openai/gpt-4o
perplexity/sonar
google/gemini-2.0-flash-001
```

Requête standardisée par LLM :
```
"Que sais-tu de la marque [brand] (site : [url]) ?"
```

Payload sortant :
```json
{
  "brand": "Exemple PME",
  "score_perception": 25,
  "llms": [
    {
      "nom": "ChatGPT",
      "statut": "inconnue",
      "verbatim": "Je n'ai pas d'informations sur cette marque...",
      "ton": "neutre",
      "citation_directe": false,
      "sources_mentionnees": 0
    }
  ],
  "delta": [
    {
      "titre": "Proposition de valeur non retransmise",
      "description": "Aucune IA ne restitue votre positionnement principal."
    }
  ]
}
```

**Pattern d'appel parallèle** :
```typescript
const results = await Promise.allSettled(
  models.map(model => callOpenRouter(model, brand, url))
);
```
Utiliser `Promise.allSettled` (pas `Promise.all`) pour que l'échec d'un LLM n'annule pas les autres.

---

## Checklist avant de livrer un endpoint

- [ ] CORS headers en premier
- [ ] sanitizeUrl() appelé sur toute URL entrante
- [ ] fetchWithTimeout() utilisé — jamais fetch() nu
- [ ] Retry pattern présent sur le fetch du site cible
- [ ] Aucun import relatif hors /api/
- [ ] Tous les helpers inlinés dans le fichier
- [ ] Variables d'environnement via process.env uniquement
- [ ] Aucune clé API ou token loggé
- [ ] Codes d'erreur HTTP cohérents avec le tableau ci-dessus

# CLAUDE.md — Otarcy

Instructions pour Claude Code. Lire entièrement avant de modifier quoi que ce soit.

---

## Identité du projet

- **Produit** : Otarcy — outil de diagnostic de présence IA
- **Positionnement** : Self-service, bouton → résultat immédiat, PME française
- **Site** : https://otarcy.app
- **Repo** : https://github.com/greymatter777/Black-Otarcy
- **Stack** : React 18 + TypeScript, Vite, Vercel (serverless), Supabase (auth + db), Stripe, Resend, Groq

---

## Ce que fait Otarcy (nouveau modèle — priorité absolue)

Otarcy vérifie objectivement si une marque ou un site est visible pour les IAs.
Il ne génère pas de texte marketing. Il **constate** des faits techniques.

### 3 plans

| Plan | Nom | Prix | Ce qu'il déverrouille |
|------|-----|------|----------------------|
| free | Découverte | 0€ | Score global + liste critères (statut visible, pas de détail) |
| pro | Essentiel | 19€/mois | Workflow 1 complet : détail par critère + quick wins + plan long terme |
| agency | Expert | 99€/mois | Workflow 1 + Workflow 2 : perception réelle des LLMs |

---

## Architecture des nouveaux endpoints

### À créer — dans l'ordre

**1. `api/score.ts` — POST /api/score (plan free)**

Payload entrant :
```json
{ "url": "https://exemple.fr" }
```

Logique :
- Fetch le HTML brut de l'URL soumise (un seul appel)
- Fetch le robots.txt de l'URL (`/robots.txt`)
- Lancer en parallèle les 10 vérificateurs (voir section "Vérificateurs")
- Agréger les scores
- Retourner uniquement le score global + statuts (ok / warn / ko) sans détail

Payload sortant :
```json
{
  "score": 34,
  "niveau": "faible",
  "criteres": [
    { "nom": "crawlers_ia", "statut": "ko", "points": 0, "max": 15 },
    { "nom": "schema_org", "statut": "ok", "points": 12, "max": 15 },
    { "nom": "eeat", "statut": "warn", "points": 7, "max": 15 },
    { "nom": "faq_glossaire", "statut": "ko", "points": 0, "max": 10 },
    { "nom": "llms_txt", "statut": "ko", "points": 0, "max": 10 },
    { "nom": "meta_onpage", "statut": "warn", "points": 8, "max": 10 },
    { "nom": "wikidata", "statut": "ko", "points": 0, "max": 10 },
    { "nom": "sitemap", "statut": "ok", "points": 5, "max": 5 },
    { "nom": "open_graph", "statut": "warn", "points": 3, "max": 5 },
    { "nom": "https", "statut": "ok", "points": 5, "max": 5 }
  ]
}
```

Niveaux de score :
- 0-30 → "critique"
- 31-55 → "faible"
- 56-75 → "moyen"
- 76-90 → "bon"
- 91-100 → "excellent"

---

**2. `api/audit.ts` — POST /api/audit (plan pro — remplace l'ancien audit)**

Payload entrant :
```json
{ "url": "https://exemple.fr" }
```

Logique :
- Reprend les mêmes 10 vérificateurs que /api/score
- Retourne le détail complet de chaque critère
- Génère les quick wins (liste priorisée par impact/effort)
- Génère le plan long terme (3 phases)
- Utilise Claude API (claude-sonnet-4-20250514) uniquement pour la synthèse des quick wins et du plan — pas pour la vérification des critères (qui reste 100% technique)

Payload sortant :
```json
{
  "score": 34,
  "niveau": "faible",
  "url": "https://exemple.fr",
  "criteres": [
    {
      "nom": "crawlers_ia",
      "statut": "ko",
      "points": 0,
      "max": 15,
      "titre": "Accès crawlers IA",
      "detail": "GPTBot et ClaudeBot sont bloqués dans votre robots.txt.",
      "impact": "Les IAs ne peuvent pas crawler votre site."
    }
  ],
  "quick_wins": [
    {
      "numero": 1,
      "titre": "Débloquer GPTBot et ClaudeBot dans robots.txt",
      "description": "Supprimer les règles Disallow pour GPTBot, ClaudeBot, PerplexityBot.",
      "impact": "élevé",
      "effort": "5 min",
      "categorie": "Technique"
    }
  ],
  "plan_long_terme": [
    {
      "phase": "Semaine 1-2",
      "titre": "Signaux techniques",
      "actions": "Débloquer crawlers IA, créer llms.txt, compléter sameAs Schema.org."
    }
  ]
}
```

---

**3. `api/llm-perception.ts` — POST /api/llm-perception (plan agency)**

Payload entrant :
```json
{ "url": "https://exemple.fr", "brand": "Nom de la marque" }
```

Logique :
- Appels parallèles via OpenRouter à 4 LLMs (Claude, GPT-4o, Perplexity, Gemini)
- Requête standardisée pour chaque LLM :
  `"Que sais-tu de la marque [brand] (site : [url]) ? Décris ce que tu connais de cette entreprise, ses produits et son positionnement. Si tu ne la connais pas, dis-le clairement."`
- Analyse de chaque réponse : citation directe / mention indirecte / inconnue
- Extraction du verbatim brut
- Calcul du delta entre le positionnement réel et ce que les LLMs retiennent

Clé API : `OPENROUTER_API_KEY` (variable Vercel à ajouter)
Endpoint OpenRouter : `https://openrouter.ai/api/v1/chat/completions`
Modèles à utiliser :
- Claude : `anthropic/claude-sonnet-4-20250514`
- GPT : `openai/gpt-4o`
- Perplexity : `perplexity/sonar`
- Gemini : `google/gemini-2.0-flash-001`

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

---

## Les 10 vérificateurs — Workflow 1

Chaque vérificateur est une fonction pure TypeScript :
`check[Nom](html: string, robotsTxt?: string, url?: string): { statut: 'ok'|'warn'|'ko', points: number, detail: string, impact: string }`

### 1. `checkCrawlersIA(robotsTxt: string)` — 15 pts
Chercher dans robots.txt les User-agent : GPTBot, ClaudeBot, PerplexityBot, Googlebot-Extended, OAI-SearchBot.
- Tous autorisés → ok (15 pts)
- 1-2 bloqués → warn (7 pts)
- Tous bloqués ou robots.txt absent → ko (0 pts)

### 2. `checkSchemaOrg(html: string)` — 15 pts
Parser tous les `<script type="application/ld+json">`.
- Organization + WebSite + sameAs rempli → ok (15 pts)
- Organization seul ou WebSite seul → warn (8 pts)
- Aucun schema → ko (0 pts)
- Ne pas pénaliser les schemas dépréciés (HowTo déprécié sept 2023, FAQ restreint août 2023)

### 3. `checkEEAT(html: string)` — 15 pts
Détecter : page À propos (`/about`, `/a-propos`), mentions auteur, email de contact, page CGV ou mentions légales, politique de confidentialité.
- 4-5 signaux → ok (15 pts)
- 2-3 signaux → warn (8 pts)
- 0-1 signal → ko (0 pts)

### 4. `checkFAQGlossaire(html: string)` — 10 pts
Détecter : schema FAQPage en JSON-LD, balises `<details>/<summary>`, sections avec pattern question/réponse, mot "glossaire" ou "faq" dans les liens ou titres.
- FAQ + schema FAQPage → ok (10 pts)
- FAQ sans schema ou glossaire seul → warn (5 pts)
- Rien → ko (0 pts)

### 5. `checkLlmsTxt(url: string)` — 10 pts
Fetch `[url]/llms.txt`.
- Présent et contenu > 100 caractères → ok (10 pts)
- Présent mais vide → warn (3 pts)
- Absent (404) → ko (0 pts)

### 6. `checkMetaOnpage(html: string)` — 10 pts
Vérifier : `<title>` non vide et > 30 chars, `<meta name="description">` non vide et > 80 chars, balise H1 présente, mots-clés métier dans le title ou H1.
- Tout présent et optimisé → ok (10 pts)
- Partiellement rempli → warn (5 pts)
- Title ou description absents → ko (0 pts)

### 7. `checkWikidata(html: string)` — 10 pts
Chercher dans le HTML ou Schema.org sameAs une URL `wikidata.org/wiki/Q`.
- QID Wikidata détecté dans sameAs → ok (10 pts)
- Non détecté → ko (0 pts)

### 8. `checkSitemap(url: string)` — 5 pts
Fetch `[url]/sitemap.xml` ou chercher `<link rel="sitemap">` dans le HTML.
- Sitemap trouvé et non vide → ok (5 pts)
- Absent → ko (0 pts)

### 9. `checkOpenGraph(html: string)` — 5 pts
Chercher `<meta property="og:title">`, `og:description`, `og:image`.
- Les 3 présents → ok (5 pts)
- 1-2 présents → warn (2 pts)
- Aucun → ko (0 pts)

### 10. `checkHTTPS(url: string)` — 5 pts
Vérifier que l'URL commence par `https://`.
- HTTPS → ok (5 pts)
- HTTP → ko (0 pts)

---

## Conventions techniques — NE PAS DÉROGER

### Helpers inlinés dans chaque fichier API
Vercel ne résout pas les imports relatifs hors `/api/` au runtime.
Copier ces 3 fonctions dans chaque nouveau fichier API :

```typescript
async function verifySupabaseAuth(req: any): Promise<{ userId: string; email: string } | null> {
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) return null;
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
  const { data: { user } } = await supabase.auth.getUser(token);
  return user ? { userId: user.id, email: user.email! } : null;
}

function checkRateLimit(store: Map<string, number[]>, key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (store.get(key) || []).filter((t: number) => now - t < windowMs);
  if (timestamps.length >= max) return false;
  store.set(key, [...timestamps, now]);
  return true;
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
```

### CORS — header obligatoire sur chaque endpoint
```typescript
res.setHeader("Access-Control-Allow-Origin", "https://otarcy.app");
res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
if (req.method === "OPTIONS") return res.status(200).end();
```

### Vérification du plan utilisateur
```typescript
const { data: userData } = await supabase
  .from("users")
  .select("plan, audits_count, audits_limit")
  .eq("id", auth.userId)
  .single();

// Plan requis pour /api/audit : "pro" ou "agency"
// Plan requis pour /api/llm-perception : "agency"
// /api/score : tous les plans (authentification optionnelle)
```

### Build Vercel
```json
"build": "node --experimental-vm-modules node_modules/vite/bin/vite.js build && node prerender.mjs"
```

Ne pas modifier ce script de build.

---

## Variables d'environnement Vercel

### Existantes — ne pas toucher
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

### À ajouter pour le nouveau moteur
```
OPENROUTER_API_KEY        ← clé OpenRouter pour le workflow 2
ANTHROPIC_API_KEY         ← clé Anthropic pour la synthèse des quick wins
```

---

## Design system — règles absolues

Fichier de référence : `otarcy-design-system.md`

Règles critiques à respecter dans tout nouveau composant :
- **Jamais de className Tailwind** — tout en inline style
- **Jamais de border-radius** sauf `borderRadius: "2px"` sur les barres
- **Jamais de box-shadow**
- **Polices** : `'Bebas Neue'` pour titres/scores, `'Raleway'` pour tout le reste
- **Couleurs** : `#a3e635` vert accent, `#f97316` orange warning, `#ef4444` rouge erreur, `#60a5fa` bleu info
- **Fond** : `#0a0a0a` principal, `#0f0f0f` cartes, `#161616` cartes intérieures
- **fontWeight 300** sur le corps de texte, **600** sur les CTA
- Animations : `useReveal()` pour les entrées scroll — `className="reveal"`

---

## Pages frontend à créer

### `src/pages/ScoreResult.tsx` — résultat plan free
Route : `/score` (protégée — auth requise)
Affiche :
- Score circulaire dominant avec chiffre en Bebas Neue
- Grille des 10 critères avec statut (ok/warn/ko) — détail verrouillé
- CTA "Débloquer l'analyse complète →" vers `/pricing`

### `src/pages/AuditResult.tsx` — résultat plan pro (remplace AioReport.tsx)
Route : `/audit` (protégée — plan pro ou agency)
Affiche :
- Score global + barres par catégorie
- Détail complet de chaque critère
- Section quick wins (bordure orange)
- Plan long terme 3 phases (bordure bleue)
- CTA vers plan Expert si plan = pro

### `src/pages/PerceptionResult.tsx` — résultat plan agency
Route : `/perception` (protégée — plan agency uniquement)
Affiche :
- Résumé perception par LLM (tableau statuts)
- Cartes verbatim brut par LLM (bordure colorée selon statut)
- Section delta (ce que vous émettez vs ce que les IAs retiennent)

---

## Ce qu'il ne faut pas toucher

- `api/newsletter.ts` — fonctionnel
- `api/digest.ts` — fonctionnel
- `api/webhook.ts` — Stripe webhook, critique
- `api/create-checkout.ts` — Stripe checkout, critique
- `api/history.ts` — historique audits
- `api/user-status.ts` — vérification plan utilisateur
- `src/lib/auth.tsx` — AuthProvider, ne pas modifier
- `src/lib/useAuthFetch.ts` — authFetch(), ne pas modifier
- `prerender.mjs` — script de prerendering, ne pas modifier
- `.github/workflows/digest.yml` — cron newsletter, ne pas modifier
- Toutes les pages publiques existantes (Index, Pricing, Glossaire, Faq, Blog)

---

## Ordre d'exécution des tâches

Respecter cet ordre strictement — ne pas sauter d'étape.

```
ÉTAPE 1 — Créer les 10 fonctions vérificateurs
  → src/lib/checkers.ts
  → Chaque fonction testable indépendamment

ÉTAPE 2 — Créer api/score.ts
  → Utilise les 10 vérificateurs
  → Auth optionnelle (plan free accessible sans compte)
  → Tester avec curl avant de passer à l'étape suivante

ÉTAPE 3 — Créer api/audit.ts (remplace l'ancien)
  → Réutilise les vérificateurs
  → Ajoute la synthèse Claude API pour quick wins
  → Auth requise, plan pro ou agency

ÉTAPE 4 — Créer api/llm-perception.ts
  → 4 appels OpenRouter en parallèle
  → Auth requise, plan agency uniquement
  → Tester les coûts réels avant de déployer

ÉTAPE 5 — Créer ScoreResult.tsx
  → Layout vue gratuite (score + critères verrouillés)

ÉTAPE 6 — Créer AuditResult.tsx
  → Layout vue Essentiel (détail + quick wins + plan)

ÉTAPE 7 — Créer PerceptionResult.tsx
  → Layout vue Expert (verbatim LLMs + delta)

ÉTAPE 8 — Mettre à jour App.tsx
  → Ajouter les nouvelles routes
  → Rediriger /aio-report vers /audit

ÉTAPE 9 — Mettre à jour Index.tsx
  → Remplacer le champ "nom de marque" par un champ URL
  → Conserver le design existant, changer uniquement le contenu du champ
```

---

## Notes importantes

- Ne jamais hardcoder une URL — toujours utiliser `process.env.VITE_SUPABASE_URL` etc.
- Ne jamais logger les clés API ou tokens JWT dans la console
- Les vérificateurs ne font jamais d'appel LLM — ils parsent du HTML et du texte uniquement
- Le score est toujours calculé côté serveur, jamais côté client
- En cas de fetch échoué sur l'URL soumise, retourner une erreur claire : `{ error: "Impossible d'accéder à cette URL" }`
- Tester chaque endpoint avec curl avant de créer le composant React correspondant

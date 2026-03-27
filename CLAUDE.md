# CLAUDE.md — Otarcy

Instructions pour Claude Code. Lire entièrement avant de modifier quoi que ce soit.

---

## ⚠ Amendements — Lire avant toute chose

Trois correctifs ont été intégrés à ce document suite à une revue d'architecture. Ils sont signalés par `⚠` à chaque point d'impact et ont le même statut que les conventions techniques existantes.

| # | Correctif | Impact |
|---|-----------|--------|
| 1 | Validation locale des checkers obligatoire avant tout endpoint | Étape 0 + script fourni |
| 2 | `fetchWithTimeout()` obligatoire sur tout fetch externe | Nouveau helper à copier |
| 3 | Champ `brand` pour `llm-perception.ts` — décision UX requise avant étape 7 | Index.tsx + PerceptionResult.tsx |

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

> ⚠ **Correctif 2** — Tout fetch externe utilise `fetchWithTimeout()`. Voir section "Conventions techniques".

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

> ⚠ **Correctif 2** — Tout fetch externe utilise `fetchWithTimeout()`. Voir section "Conventions techniques".

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

> ⚠ **Correctif 3** — Le champ `brand` n'est pas collecté par le flow score/audit. Décision UX requise avant l'étape 7 : ajouter un champ "Nom de votre marque" visible uniquement si `plan = agency` sur `Index.tsx`. Implémenter à l'étape 9, avant de finaliser `PerceptionResult.tsx`.

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

> ⚠ **Correctif 1** — Chaque vérificateur doit être testé indépendamment avant toute intégration dans les endpoints. Exécuter le script `validate-checkers.mjs` (section dédiée en fin de document) sur 3 URLs réelles avant de passer à l'étape 2.

Chaque vérificateur est une fonction pure TypeScript :
`check[Nom](html: string, robotsTxt?: string, url?: string): { statut: 'ok'|'warn'|'ko', points: number, detail: string, impact: string }`

Les vérificateurs ne font jamais d'appel LLM — ils parsent exclusivement du HTML et du texte brut.

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
Fetch `[url]/llms.txt` via `fetchWithTimeout()`.
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
Fetch `[url]/sitemap.xml` via `fetchWithTimeout()` ou chercher `<link rel="sitemap">` dans le HTML.
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
Copier ces **4 fonctions** dans chaque nouveau fichier API :

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

### ⚠ Correctif 2 — `fetchWithTimeout()` obligatoire sur tout fetch externe

Vercel Functions timeout à 10s (hobby) ou 30s (pro). Sans `AbortController`, un fetch bloquant fait timeout l'endpoint entier. **Jamais utiliser `fetch()` nu sur une URL externe.**

```typescript
async function fetchWithTimeout(url: string, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "OtarcyBot/1.0 (+https://otarcy.app)" },
    });
    return res;
  } catch (err: any) {
    if (err.name === "AbortError") throw new Error("Timeout : URL trop lente (>8s)");
    throw new Error("Impossible d'accéder à cette URL");
  } finally {
    clearTimeout(timer);
  }
}
```

Usage dans les endpoints (score.ts, audit.ts) :
```typescript
// Fetch du HTML cible
const htmlRes = await fetchWithTimeout(sanitizeUrl(url));
if (!htmlRes.ok) return res.status(422).json({ error: "Impossible d'accéder à cette URL" });
const html = await htmlRes.text();

// Fetch robots.txt (échec silencieux accepté)
const origin = new URL(url).origin;
const robotsRes = await fetchWithTimeout(`${origin}/robots.txt`).catch(() => null);
const robotsTxt = robotsRes?.ok ? await robotsRes.text() : "";
```

Usage dans les checkers qui fetch (`checkLlmsTxt`, `checkSitemap`) :
```typescript
// Remplacer fetch() par fetchWithTimeout()
const res = await fetchWithTimeout(`${url}/llms.txt`);
if (!res.ok) return { statut: "ko", points: 0, detail: "Absent (404)", impact: "..." };
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

Le dossier `design-ref/` contient 3 fichiers HTML de référence pixel-perfect. Les parser avant de générer tout composant React.

| Fichier | Correspond à | Route cible |
|---------|-------------|-------------|
| `score-free.html` | ScoreResult.tsx — vue plan free | /score |
| `audit-essentiel.html` | AuditResult.tsx — vue plan pro | /audit |
| `perception-expert.html` | PerceptionResult.tsx — vue agency | /perception |

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
Référence visuelle : `design-ref/score-free.html`
Affiche :
- Score circulaire dominant (SVG ring) avec chiffre en Bebas Neue
- Grille des 10 critères avec statut (ok/warn/ko) — détail verrouillé (dashed border)
- CTA "Débloquer l'analyse complète →" vers `/pricing`

### `src/pages/AuditResult.tsx` — résultat plan pro (remplace AioReport.tsx)
Route : `/audit` (protégée — plan pro ou agency)
Référence visuelle : `design-ref/audit-essentiel.html`
Affiche :
- Score global + barres par catégorie
- Détail complet de chaque critère
- Section quick wins (bordure gauche orange `#f97316`)
- Plan long terme 3 phases (bordure gauche bleue `#60a5fa`)
- CTA vers plan Expert si plan = pro

### `src/pages/PerceptionResult.tsx` — résultat plan agency
Route : `/perception` (protégée — plan agency uniquement)
Référence visuelle : `design-ref/perception-expert.html`
Affiche :
- Résumé perception par LLM (tableau statuts)
- Cartes verbatim brut par LLM (bordure colorée selon statut)
- Section delta (ce que vous émettez vs ce que les IAs retiennent)

> ⚠ **Correctif 3** — Cette page consomme `api/llm-perception.ts` qui exige `{ url, brand }`. Vérifier que le champ `brand` est collecté côté `Index.tsx` avant de finaliser cette page.

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
ÉTAPE 0 — ⚠ Correctif 1 : valider les checkers en isolation
  → node validate-checkers.mjs (script fourni ci-dessous)
  → Tester sur 3 URLs réelles : bon / moyen / vide
  → Ne pas passer à l'étape 1 si un résultat est incohérent

ÉTAPE 1 — Créer les 10 fonctions vérificateurs
  → src/lib/checkers.ts
  → Chaque fonction testable indépendamment

ÉTAPE 2 — Créer api/score.ts
  → Utilise les 10 vérificateurs
  → Auth optionnelle (plan free accessible sans compte)
  → Utilise fetchWithTimeout() pour tous les fetch externes
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
  → Référence : design-ref/score-free.html

ÉTAPE 6 — Créer AuditResult.tsx
  → Layout vue Essentiel (détail + quick wins + plan)
  → Référence : design-ref/audit-essentiel.html

ÉTAPE 7 — Créer PerceptionResult.tsx
  → Layout vue Expert (verbatim LLMs + delta)
  → Référence : design-ref/perception-expert.html
  → ⚠ Correctif 3 : vérifier que le champ brand est disponible avant cette étape

ÉTAPE 8 — Mettre à jour App.tsx
  → Ajouter les nouvelles routes
  → Rediriger /aio-report vers /audit

ÉTAPE 9 — Mettre à jour Index.tsx
  → Remplacer le champ "nom de marque" par un champ URL
  → ⚠ Correctif 3 : ajouter un champ "Nom de votre marque" visible si plan = agency
  → Conserver le design existant, changer uniquement le contenu des champs
```

---

## Script de validation locale — Étape 0

Créer ce fichier à la racine du projet. Exécuter avec `node validate-checkers.mjs` avant de commencer l'étape 1.

```javascript
// validate-checkers.mjs
// Teste les 10 checkers sur 3 URLs réelles avant tout déploiement.
// Un checker défaillant = 3 endpoints qui retournent des scores faux.

import {
  checkCrawlersIA, checkSchemaOrg, checkEEAT,
  checkFAQGlossaire, checkLlmsTxt, checkMetaOnpage,
  checkWikidata, checkSitemap, checkOpenGraph, checkHTTPS
} from "./src/lib/checkers.ts";

const URLS = [
  "https://anthropic.com",     // site bien configuré — score attendu > 70
  "https://exemple-pme.fr",    // remplacer par une URL réelle à tester
  "https://httpbin.org/html",  // page HTML minimaliste — score attendu faible
];

async function fetchWithTimeout(url, ms = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

for (const url of URLS) {
  console.log(`\n── ${url} ──`);
  try {
    const [htmlRes, robotsRes] = await Promise.all([
      fetchWithTimeout(url),
      fetchWithTimeout(new URL(url).origin + "/robots.txt").catch(() => null),
    ]);
    const html = await htmlRes.text();
    const robots = robotsRes?.ok ? await robotsRes.text() : "";

    const results = {
      https:       checkHTTPS(url),
      crawlers_ia: checkCrawlersIA(robots),
      schema_org:  checkSchemaOrg(html),
      eeat:        checkEEAT(html),
      faq:         checkFAQGlossaire(html),
      meta_onpage: checkMetaOnpage(html),
      wikidata:    checkWikidata(html),
      open_graph:  checkOpenGraph(html),
    };

    // Ces deux checkers font leur propre fetch interne
    results.llms_txt = await checkLlmsTxt(url);
    results.sitemap  = await checkSitemap(url, html);

    let total = 0;
    for (const [nom, r] of Object.entries(results)) {
      const icon = r.statut === "ok" ? "✅" : r.statut === "warn" ? "⚠️ " : "🔴";
      console.log(`  ${icon} ${nom.padEnd(14)} ${String(r.points).padStart(2)}/${r.max ?? "?"} — ${r.detail}`);
      total += r.points;
    }
    console.log(`  ── SCORE : ${total}/100`);
  } catch (e) {
    console.error(`  ERREUR : ${e.message}`);
  }
}
```

Résultat attendu pour `anthropic.com` : score > 70, majorité des checkers en ✅. Si ce n'est pas le cas, corriger le checker défaillant avant de continuer.

---

## Notes importantes

- Ne jamais hardcoder une URL — toujours utiliser `process.env.VITE_SUPABASE_URL` etc.
- Ne jamais logger les clés API ou tokens JWT dans la console
- Les vérificateurs ne font jamais d'appel LLM — ils parsent du HTML et du texte uniquement
- Le score est toujours calculé côté serveur, jamais côté client
- En cas de fetch échoué sur l'URL soumise, retourner une erreur claire : `{ error: "Impossible d'accéder à cette URL" }` avec status 422
- **Jamais `fetch()` nu sur une URL externe** — toujours `fetchWithTimeout()` — Correctif 2
- Tester chaque endpoint avec curl avant de créer le composant React correspondant
- `api/llm-perception.ts` : ne tester avec de vraies clés OpenRouter qu'une seule fois avant déploiement pour éviter de brûler des crédits sur des tests d'intégration

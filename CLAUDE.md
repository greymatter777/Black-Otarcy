# CLAUDE.md — Otarcy

Instructions pour Claude Code. Lire entièrement avant de modifier quoi que ce soit.

---

## ⚠ Amendements — Lire avant toute chose

| # | Correctif | Impact |
|---|-----------|--------|
| 1 | Validation locale des checkers obligatoire avant tout endpoint | Étape 0 + script fourni |
| 2 | `fetchWithTimeout()` obligatoire sur tout fetch externe | Helper inliné dans chaque fichier API |
| 3 | Champ `brand` pour `llm-perception.ts` — collecté via sessionStorage | Index.tsx + PerceptionResult.tsx |
| 4 | Checkers inlinés dans chaque fichier API | Vercel ne résout pas les imports relatifs hors /api/ |

---

## État d'avancement — Session 31/03/2026

| Étape | Fichier | Statut |
|-------|---------|--------|
| 0 | validate-checkers.mjs | ✅ Validé — scores cohérents sur 3 URLs |
| 1 | src/lib/checkers.ts | ✅ Créé |
| 2 | api/score.ts | ✅ Testé en prod — retourne score + critères |
| 3 | api/audit.ts | ✅ Créé + déployé + fix audits_used |
| 4 | api/llm-perception.ts | ⬜ En attente — nécessite OPENROUTER_API_KEY |
| 5 | src/pages/ScoreResult.tsx | ✅ Créé + déployé |
| 6 | src/pages/AuditResult.tsx | ✅ Créé + déployé |
| 7 | src/pages/PerceptionResult.tsx | ✅ Créé + déployé |
| 8 | src/App.tsx | ✅ Routes /score /audit /perception + redirects secteurs → /pricing |
| 9 | src/pages/Index.tsx | ✅ Messaging pivot + suppression dropdown secteurs |

**Prochaine étape : Étape 4 — api/llm-perception.ts (bloquée sur OPENROUTER_API_KEY)**

---

## Identité du projet

- **Produit** : Otarcy — outil de diagnostic de présence IA
- **Positionnement** : Self-service, bouton → résultat immédiat, PME française
- **Site** : https://otarcy.app (suspendu temporairement — vérification Namecheap en cours)
- **URL Vercel** : https://blackotarcyweb.vercel.app (fonctionnelle)
- **Repo** : https://github.com/greymatter777/Black-Otarcy
- **Stack** : React 18 + TypeScript, Vite, Vercel (serverless), Supabase (auth + db), Stripe, Resend, Groq, @anthropic-ai/sdk

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

## Architecture des endpoints

### ✅ Opérationnels

**`api/score.ts` — POST /api/score (plan free)**
- Auth optionnelle
- Checkers inlinés
- Retourne : `{ score, niveau, url, criteres[] }` — statuts uniquement, pas de détail

**`api/audit.ts` — POST /api/audit (plan pro + agency)**
- Auth requise — plan pro ou agency
- Checkers inlinés
- Synthèse via Claude API (ANTHROPIC_API_KEY) — fallback si clé absente
- Retourne : `{ score, niveau, url, criteres[], quick_wins[], plan_long_terme[] }`

### ⬜ À créer

**`api/llm-perception.ts` — POST /api/llm-perception (plan agency)**

Payload entrant :
```json
{ "url": "https://exemple.fr", "brand": "Nom de la marque" }
```

Logique :
- Appels parallèles via OpenRouter à 4 LLMs
- Requête standardisée : `"Que sais-tu de la marque [brand] (site : [url]) ?"`
- Analyse : citation directe / mention indirecte / inconnue
- Extraction verbatim brut + calcul delta

Clé API : `OPENROUTER_API_KEY`
Endpoint : `https://openrouter.ai/api/v1/chat/completions`
Modèles :
- `anthropic/claude-sonnet-4-20250514`
- `openai/gpt-4o`
- `perplexity/sonar`
- `google/gemini-2.0-flash-001`

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

## Les 10 vérificateurs — scoring

**IMPORTANT : inlinés dans chaque fichier API — pas importés depuis src/lib/**

| Checker | Max | ok | warn | ko |
|---------|-----|----|------|----|
| checkCrawlersIA | 15 | Tous autorisés | 1-2 bloqués | Tous bloqués / absent |
| checkSchemaOrg | 15 | Org+Web+sameAs | Org ou Web seul | Aucun schema |
| checkEEAT | 15 | ≥ 4 signaux | 2-3 signaux | 0-1 signal |
| checkFAQGlossaire | 10 | FAQ + FAQPage schema | FAQ sans schema | Aucun |
| checkLlmsTxt | 10 | Présent > 100 chars | Présent vide | Absent |
| checkMetaOnpage | 10 | ≥ 8/10 | 4-7/10 | < 4/10 |
| checkWikidata | 10 | QID détecté | — | Non détecté |
| checkSitemap | 5 | sitemap.xml ok | Référence sans fichier | Absent |
| checkOpenGraph | 5 | 3 balises og | 1-2 balises | Aucune |
| checkHTTPS | 5 | https:// | — | http:// |

Niveaux : 0-30 critique / 31-55 faible / 56-75 moyen / 76-90 bon / 91-100 excellent

---

## Conventions techniques — NE PAS DÉROGER

### ⚠ Checkers inlinés dans chaque fichier API
Vercel ne résout pas les imports relatifs hors `/api/` au runtime.
Ne jamais écrire `import { checkSchemaOrg } from "../src/lib/checkers"` dans un fichier API.
Copier les fonctions directement dans le fichier.

### fetchWithTimeout — obligatoire sur tout fetch externe
```typescript
async function fetchWithTimeout(url: string, ms = 8000): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}
```

### CORS — header obligatoire sur chaque endpoint
```typescript
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
if (req.method === "OPTIONS") return res.status(200).end();
```

### verifySupabaseAuth — inliné dans chaque fichier API auth-required
```typescript
async function verifySupabaseAuth(req: VercelRequest): Promise<{ userId: string; email: string } | null> {
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) return null;
  const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
  const { data: { user } } = await supabase.auth.getUser(token);
  return user ? { userId: user.id, email: user.email! } : null;
}
```

### sessionStorage — flow de navigation
```typescript
// Dans Index.tsx — avant redirection
sessionStorage.setItem("otarcy_audit_url", url);
sessionStorage.setItem("otarcy_brand", brand); // uniquement si plan = agency

// Dans ScoreResult / AuditResult / PerceptionResult
const url = sessionStorage.getItem("otarcy_audit_url");
const brand = sessionStorage.getItem("otarcy_brand");
```

### Logique de redirection selon le plan
```typescript
if (plan === "free") navigate("/score");
else if (plan === "pro") navigate("/audit");
else if (plan === "agency") navigate("/audit"); // /perception disponible depuis AuditResult
```

### Build Vercel
```json
"build": "node --experimental-vm-modules node_modules/vite/bin/vite.js build && node prerender.mjs"
```
Ne pas modifier.

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

### À ajouter
```
ANTHROPIC_API_KEY     ← synthèse quick wins dans api/audit.ts
OPENROUTER_API_KEY    ← workflow 2 dans api/llm-perception.ts
```

---

## Design system — règles absolues

Fichier de référence : `otarcy-design-system.md`
Référence HTML pixel-perfect : `design-ref/`

| Fichier | Composant | Route |
|---------|-----------|-------|
| design-ref/score-free.html | ScoreResult.tsx | /score |
| design-ref/audit-essentiel.html | AuditResult.tsx | /audit |
| design-ref/perception-expert.html | PerceptionResult.tsx | /perception |

Règles critiques :
- **Jamais de className Tailwind** — tout en inline style
- **Jamais de border-radius** sauf `borderRadius: "2px"` sur les barres
- **Jamais de box-shadow**
- **Polices** : `'Bebas Neue'` titres/scores, `'Raleway'` tout le reste
- **Couleurs** : `#a3e635` vert, `#f97316` orange, `#ef4444` rouge, `#60a5fa` bleu
- **Fonds** : `#0a0a0a` principal, `#0f0f0f` cartes, `#161616` cartes intérieures
- **fontWeight 300** corps, **600** CTA
- Animations scroll : `className="reveal"` + `useReveal()`

---

## Modifications session 31/03/2026

### Pages secteurs dépubliées
- `src/App.tsx` : imports AioCoaching/Ecommerce/Immobilier/Restauration/Rh/Sante supprimés
- 6 routes remplacées par `<Navigate to="/pricing" replace />` — fichiers conservés sur disque
- `src/pages/Index.tsx` : dropdown SECTEURS supprimé (desktop + mobile) + tableau `secteurLinks` supprimé

### Messaging pivot — alignement "diagnostic de présence IA"
- `src/pages/Index.tsx` : Hero, WhyAio, About, Footer — toutes les occurrences "AIO" / "AI Optimization" reformulées
- `src/pages/Pricing.tsx` : H1, noms de plans (Essentiel/Expert), features et CTAs mis à jour
- Plans free/pro/agency : descriptions alignées sur les 10 vérificateurs techniques

### Fix technique
- `api/audit.ts` : `audits_count` → `audits_used` (alignement avec le nom réel de la colonne Supabase, cohérent avec `api/user-status.ts`)

---

## Ce qu'il ne faut pas toucher

- `api/newsletter.ts` — fonctionnel
- `api/digest.ts` — fonctionnel
- `api/webhook.ts` — Stripe webhook, critique
- `api/create-checkout.ts` — Stripe checkout, critique
- `api/history.ts` — historique audits
- `api/user-status.ts` — vérification plan utilisateur
- `src/lib/auth.tsx` — AuthProvider
- `src/lib/useAuthFetch.ts` — authFetch()
- `prerender.mjs` — prerendering
- `.github/workflows/digest.yml` — cron newsletter
- Toutes les pages publiques (Index, Pricing, Glossaire, Faq, Blog)

---

## Notes importantes

- Ne jamais hardcoder une URL — toujours `process.env.VITE_SUPABASE_URL` etc.
- Ne jamais logger les clés API ou tokens JWT
- Les vérificateurs ne font jamais d'appel LLM — parsing HTML uniquement
- Le score est toujours calculé côté serveur, jamais côté client
- Fetch échoué → `{ error: "Impossible d'accéder à cette URL" }` status 422
- `api/llm-perception.ts` : tester une seule fois avec vraies clés avant déploiement

## Session 30/03/2026 — Pivot stratégique + Nouveau moteur

### Décisions stratégiques arrêtées

**Pivot produit :**
- Otarcy abandonne le positionnement "audit marketing AIO" (générique, hallucinant sur les petites marques)
- Nouveau positionnement : **outil de diagnostic de présence IA** — vérifie des signaux techniques concrets
- Le moteur ne génère plus de texte marketing — il **constate** des faits : Schema.org présent ou absent, FAQ détectée ou non, crawlers IA autorisés ou bloqués, etc.
- Concurrent direct identifié : AI Labs Audit (francophone, agences) — Otarcy se différencie sur le self-service et le prix accessible PME

**Nouveau modèle tarifaire :**
- Plan Découverte (0€) : score global + statuts des critères, pas de détail
- Plan Essentiel (19€/mois) : Workflow 1 complet — détail + quick wins + plan long terme
- Plan Expert (99€/mois) : Workflow 1 + Workflow 2 — perception réelle des LLMs via OpenRouter

**Architecture moteur :**
- Workflow 1 : 10 vérificateurs techniques (parsing HTML, zéro LLM) — checkCrawlersIA, checkSchemaOrg, checkEEAT, checkFAQGlossaire, checkLlmsTxt, checkMetaOnpage, checkWikidata, checkSitemap, checkOpenGraph, checkHTTPS
- Workflow 2 : 4 appels API parallèles (Claude, GPT, Perplexity, Gemini) via OpenRouter — perception réelle + verbatim + delta

**Contrainte technique découverte :**
- Vercel ne résout pas les imports relatifs hors `/api/` au runtime
- Solution : checkers inlinés dans chaque fichier API (pas d'import depuis src/lib/)

**DNS otarcy.app :**
- Domaine suspendu le 28/03/2026 — vérification email Namecheap non faite avant deadline
- Vérification effectuée — réactivation sous 24-48h
- URL Vercel fonctionnelle : https://blackotarcyweb.vercel.app
- IP Vercel pour otarcy.app : 216.198.79.1 (spécifique au projet, pas l'IP générique 76.76.21.21)

### Fichiers créés session 30/03/2026

| Fichier | Statut |
|---------|--------|
| CLAUDE.md | ✅ Créé + mis à jour |
| design-ref/score-free.html | ✅ Référence visuelle plan free |
| design-ref/audit-essentiel.html | ✅ Référence visuelle plan pro |
| design-ref/perception-expert.html | ✅ Référence visuelle plan agency |
| validate-checkers.mjs | ✅ Script validation locale |
| src/lib/checkers.ts | ✅ 10 vérificateurs (pour usage local uniquement) |
| api/score.ts | ✅ Testé en prod — score 59/100 sur blackotarcyweb.vercel.app |
| api/audit.ts | ✅ Déployé — checkers inlinés + synthèse Claude API |
| src/pages/ScoreResult.tsx | ✅ Vue plan free |
| src/pages/AuditResult.tsx | ✅ Vue plan pro |
| src/pages/PerceptionResult.tsx | ✅ Vue plan agency |

---

## Session 31/03/2026 — UX, messaging pivot, fix technique

### Modifications effectuées

| Fichier | Modification |
|---------|-------------|
| src/App.tsx | ✅ Routes /score /audit /perception + 6 redirects secteurs → /pricing |
| src/pages/Index.tsx | ✅ Messaging pivot complet + suppression dropdown secteurs |
| src/pages/Pricing.tsx | ✅ Noms plans, features, CTAs alignés nouveau positionnement |
| api/audit.ts | ✅ Fix : `audits_count` → `audits_used` (cohérence colonne Supabase) |

### Détail des changements

**Pages secteurs dépubliées :**
- `src/App.tsx` : imports AioCoaching/Ecommerce/Immobilier/Restauration/Rh/Sante supprimés
- 6 routes remplacées par `<Navigate to="/pricing" replace />` — fichiers conservés sur disque
- `src/pages/Index.tsx` : dropdown SECTEURS supprimé (desktop + mobile) + tableau `secteurLinks` supprimé

**Messaging pivot :**
- `src/pages/Index.tsx` : toutes les occurrences "AIO" / "AI Optimization" reformulées en "diagnostic de présence IA"
- `src/pages/Pricing.tsx` : H1, noms de plans (Essentiel/Expert), features et CTAs mis à jour
- Plans free/pro/agency : descriptions alignées sur les 10 vérificateurs techniques

### Leçons techniques retenues

- Ne jamais utiliser `import` depuis `src/` dans les fichiers `api/` sur Vercel
- PowerShell Windows : utiliser `Invoke-RestMethod` pas `curl`, attention au header `Expect: 100-continue`
- `vercel dev` sur Windows + Node 24 : problèmes de compatibilité — préférer tester directement en prod
- DNS Namecheap : IP Vercel spécifique au projet (vérifier dans Vercel → Domains → DNS Change Recommended)
- `@anthropic-ai/sdk` à installer manuellement si absent du package.json : `npm install @anthropic-ai/sdk`

---

## Session 01/04/2026 — Nettoyage home + robustesse fetch

### Modifications effectuées

| Fichier | Modification |
|---------|-------------|
| src/pages/Index.tsx | ✅ Navbar nettoyée, barre URL dans Hero, WhyAio/AboutSection/AuditSection supprimés |
| src/pages/About.tsx | ✅ Créé — page publique /about avec AboutSection + WhyAio |
| src/App.tsx | ✅ Route /about ajoutée |
| api/score.ts | ✅ fetchWithTimeout amélioré + sanitizeUrl + retry www./https |
| api/audit.ts | ✅ fetchWithTimeout amélioré + sanitizeUrl + retry www./https |
| src/pages/ScoreResult.tsx | ✅ friendlyError() + isProtectedSite() + ProtectedSiteState ajoutés |
| src/pages/AuditResult.tsx | ✅ friendlyError() + isProtectedSite() + ProtectedSiteState ajoutés |

### Détail des changements

**Navbar :**
- Liens "DIAGNOSTIC" et "AUDIT" supprimés (redondants avec la barre URL du Hero)
- Lien "À PROPOS" : ancre `#about` → route `/about`
- 4 liens restants : À PROPOS, NEWSLETTER, TARIFS, BLOG

**Hero :**
- Les deux boutons "Lancer le diagnostic" et "Voir comment ça marche" remplacés par la barre URL directement dans le Hero
- Composant Hero : prop `searchBar: React.ReactNode` ajoutée
- États `brand`, `error` supprimés du composant Index (orphelins après suppression AuditSection)
- Comportement : non connecté → bouton "Commencer →" redirige vers /login ; connecté → "Analyser →" lance l'analyse

**Page About :**
- `src/pages/About.tsx` créé — contient Navbar (copie), AboutSection (.01 — À propos), WhyAio (.02 — Comment ça marche), Footer (copie)
- Note : Navbar et Footer sont copiés dans About.tsx — à refactoriser dans `src/components/` lors d'une prochaine session de nettoyage

**Robustesse fetch (api/score.ts + api/audit.ts) :**
- `fetchWithTimeout` : timeout 8s → 15s, User-Agent Chrome réaliste, `redirect: "follow"`, headers Accept complets
- `sanitizeUrl()` : strip caractères invisibles (copy-paste), ajout `https://` si protocole absent, strip espaces internes
- Retry automatique : 403/406 → retry https ; erreur réseau → retry sur `www.` si absent
- Messages d'erreur : `friendlyError()` dans ScoreResult et AuditResult pour messages lisibles côté utilisateur

**État "Site protégé" (ScoreResult + AuditResult) :**
- `isProtectedSite()` détecte les protections WAF/Cloudflare via mots-clés
- `ProtectedSiteState` : bouclier SVG vert 96×112px, titre "SITE PROTÉGÉ", message explicatif, bouton retry vers "/"
- Testé : decathlon.fr → bouclier ✅ — sites PME → analyse complète ✅
- Décision produit : les sites enterprise protégés sont hors périmètre Otarcy — documenté dans le composant

### Reste à faire

1. **Étape 4 — `api/llm-perception.ts`** : bloquée sur `OPENROUTER_API_KEY` — créer l'endpoint dès que la clé est disponible
2. **`ANTHROPIC_API_KEY`** : ajouter dans Vercel pour activer la synthèse Claude dans `api/audit.ts` (fallback actif sans elle)
3. **Dashboard** : toujours sur l'ancien modèle brand/score-sur-10 — à aligner sur le nouveau modèle URL/score-sur-100
4. **Pages secteurs** (`AioCoaching.tsx` etc.) : fichiers toujours sur disque, routes redirigées — supprimer lors d'un nettoyage
5. **Refacto Navbar/Footer** : actuellement copiés dans About.tsx — extraire dans `src/components/Navbar.tsx` et `src/components/Footer.tsx`
6. **index.html** : meta tags et Schema.org encore sur l'ancien positionnement AIO — à mettre à jour
7. **DNS otarcy.app** : vérifier que la réactivation est effective

### Leçons techniques retenues

- `/clear` dans Claude Code entre chaque étape — évite la compaction forcée et la consommation excessive de tokens
- Sessions Claude Code courtes et ciblées : une session = un fichier ou une action précise
- Le CLAUDE.md est le filet de sécurité — le tenir à jour permet de /clear sans perdre le contexte projet
- Sites PME français : beaucoup répondent uniquement sur `www.` — le retry est indispensable
- Copy-paste d'URL : les caractères invisibles Unicode (u00A0, u200B, uFEFF) causent des échecs silencieux — toujours sanitizer

---

## Session 03/04/2026 — Pause stratégique : création des skills Claude Code

### Contexte

Session hors code — réflexion et mise en place de l'infrastructure de skills pour maximiser l'efficacité de Claude Code sur les prochaines sessions. Inspiré par une présentation sur l'architecture agents IA (paradigme CPU/OS/Applications appliqué aux LLMs).

### Principe retenu

Une skill = des décisions résolues, pas des conseils génériques. Chaque règle dans une skill doit pouvoir être justifiée par "ça vient de là, ça a résolu ce problème". Sources : code en production, doc officielle des outils, bugs corrigés.

### Skills créées

| Skill | Chemin | Contenu clé |
|-------|--------|-------------|
| react-otarcy | `.claude/skills/react-otarcy/SKILL.md` | Design system complet — palette, typographie, 6 types de boutons, composants récurrents, 8 règles absolues, checklist de livraison |
| vercel-api | `.claude/skills/vercel-api/SKILL.md` | Patterns API battle-tested — sanitizeUrl, fetchWithTimeout, retry pattern, CORS, verifySupabaseAuth, structure complète d'un endpoint, tableau des endpoints existants |
| supabase-otarcy | `.claude/skills/supabase-otarcy/SKILL.md` | Deux clients Supabase (anon vs service key), AuthProvider, schéma table users, patterns de requêtes exacts, gestion quota audits_used, sessionStorage flow |

### CLAUDE.md mis à jour

- Section `## Skills disponibles` ajoutée — tableau des 3 skills avec conditions de déclenchement
- Section `## Design system` allégée — renvoi vers la skill au lieu de dupliquer les règles
- Section `## Conventions techniques` allégée — renvoi vers les skills pour les specs complètes

### Leçons retenues

- L'architecture skills (dossier avec SKILL.md + ressources) transforme chaque décision technique en procédure réutilisable
- Différence skill médiocre / skill elite : la skill elite ne donne pas de conseils, elle donne du code exact justifié par un problème réel
- Source la plus précieuse pour construire une skill : le code en production existant, pas la théorie
- La divulgation progressive (Claude ne charge la skill que quand pertinent) évite la saturation du contexte

---

## Session 03/04/2026 — Dashboard nouveau modèle + nettoyage URLs

### Modifications effectuées

| Fichier | Modification |
|---------|-------------|
| api/audit.ts | ✅ Insert Supabase table `audits` après genererSynthese() |
| api/history.ts | ✅ CORS `"*"` (était blackotarcyweb.vercel.app) |
| src/pages/Dashboard.tsx | ✅ Réécrit — AuditRecord URL/score-100, criteres/quick_wins/plan_long_terme |
| src/pages/Blog.tsx | ✅ URLs Schema.org → otarcy.app |
| src/pages/BlogPost.tsx | ✅ URLs Schema.org → otarcy.app |
| src/lib/exportPDF.ts | ✅ Footer PDF → otarcy.app |
| src/pages/Index.tsx | ✅ Lien Instagram mis à jour |
| src/pages/About.tsx | ✅ Lien Instagram mis à jour |
| api/* (8 endpoints) | ✅ CORS headers → `"*"`, URLs non-CORS → otarcy.app |

### Décisions techniques

- **Dashboard** : extraction hostname via IIFE try/catch sur toute occurrence (`AuditCard`, `AuditDetail`, stat "Dernier site") — protège contre les URLs malformées ou null
- **Filtre chargement** : `.filter((a) => a.url)` — ignore les anciennes entrées Supabase de l'ancien modèle (champ `brand` sans `url`)
- **CORS** : tous les endpoints passés à `"*"` — cohérence totale, plus de risque de blocage cross-origin au changement de domaine

### Reste à faire — mis à jour session 07/04

1. **Étape 4 — `api/llm-perception.ts`** : bloquée sur `OPENROUTER_API_KEY`
2. **`ANTHROPIC_API_KEY`** : ajouter dans Vercel pour activer la synthèse Claude dans `api/audit.ts`
3. ~~Dashboard~~ ✅ Réécrit session 03/04
4. **Pages secteurs** : supprimer les fichiers devenus orphelins (`AioCoaching.tsx` etc.)
5. **Refacto Navbar/Footer** : extraire dans `src/components/`
6. **index.html** : meta tags et Schema.org à mettre à jour
7. **`.claude/skills/supabase-otarcy/SKILL.md`** : note CORS user-status.ts obsolète (encore `blackotarcyweb.vercel.app`) — à corriger
8. **DNS otarcy.app** : vérifier réactivation

---

## Session 07/04/2026 — ThemeToggle + migration CSS variables

- `ThemeContext` + CSS variables dark/light créés (`src/lib/ThemeContext.tsx`)
- Script anti-flash ajouté dans `index.html`
- `ThemeToggle` créé (`src/components/ThemeToggle.tsx`) — toggle switch lune/soleil
- Intégré dans `Index.tsx` : desktop (avant auth) + mobile overlay (avant bloc auth)
- Intégré dans `About.tsx` : desktop (avant auth) + mobile overlay (avant bloc auth)
- `SideLeft` et `SideRight` masqués en mode light (`if (theme === "light") return null`)
- Migration couleurs : 153 occurrences hardcodées → variables CSS (`var(--bg-primary)`, `var(--accent)`, etc.) dans `Index.tsx` + `About.tsx` — handlers hover et attributs SVG intacts

---

## Session 09/04/2026 — Refacto Navbar/Footer + skill blog-writer-aio

### Modifications effectuées

| Fichier | Modification |
|---------|-------------|
| src/components/Navbar.tsx | ✅ Extrait en composant partagé — ThemeToggle intégré, desktop + mobile |
| src/components/Footer.tsx | ✅ Extrait en composant partagé |
| src/pages/Index.tsx | ✅ Utilise Navbar + Footer depuis src/components/ |
| src/pages/About.tsx | ✅ Utilise Navbar + Footer depuis src/components/ |
| .claude/skills/blog-writer-aio/SKILL.md | ✅ Skill créée — rédacteur web AIO/GEO/SEO |
| .claude/skills/OKLM/SKILL.md | ✅ Skill créée — mise à jour CLAUDE.md + context.md |

### Reste à faire — mis à jour session 09/04

1. **Étape 4 — `api/llm-perception.ts`** : bloquée sur `OPENROUTER_API_KEY`
2. **`ANTHROPIC_API_KEY`** : ajouter dans Vercel pour activer la synthèse Claude dans `api/audit.ts`
3. **Pages secteurs** : supprimer les fichiers devenus orphelins (`AioCoaching.tsx` etc.)
4. ~~index.html~~ ✅ Done — meta tags, OG, Schema.org repositionnés session 09/04
5. ~~Refacto Navbar/Footer~~ ✅ Done session 09/04
6. **DNS otarcy.app** : vérifier réactivation

---

## Session 09/04/2026 — Pages légales + repositionnement index.html

### Modifications effectuées

| Fichier | Modification |
|---------|-------------|
| index.html | ✅ Titre, meta description, OG, Schema.org repositionnés — "diagnostic de présence IA" par URL |
| src/pages/Contact.tsx | ✅ Créé — page légale Contact |
| src/pages/CGV.tsx | ✅ Créé — Conditions Générales de Vente |
| src/pages/MentionsLegales.tsx | ✅ Créé — Mentions légales |
| src/pages/RGPD.tsx | ✅ Créé — Politique RGPD |
| src/pages/Faq.tsx | ✅ Enrichie — signaux E-E-A-T ajoutés |
| src/App.tsx | ✅ Routes /contact /cgv /mentions-legales /rgpd ajoutées |

### Décisions techniques

- **E-E-A-T dans la FAQ** : signaux Expertise/Autorité/Fiabilité ajoutés pour améliorer la crédibilité aux yeux des crawlers IA
- **index.html** : Schema.org WebSite avec SearchAction + Organization mis à jour — URL cible otarcy.app
- Pages légales créées avec Navbar + Footer partagés (src/components/)

### Reste à faire

1. **Étape 4 — `api/llm-perception.ts`** : bloquée sur `OPENROUTER_API_KEY`
2. **`ANTHROPIC_API_KEY`** : ajouter dans Vercel
3. **Pages secteurs orphelines** : supprimer `AioCoaching.tsx`, `Ecommerce.tsx`, `Immobilier.tsx`, `Restauration.tsx`, `Rh.tsx`, `Sante.tsx`
4. **DNS otarcy.app** : vérifier réactivation

---

## Session 09/04/2026 (suite) — Schema.org statique + fix @graph

### Modifications effectuées

| Fichier | Modification |
|---------|-------------|
| index.html | ✅ Organization : `logo` ajouté, description mise à jour, Instagram `/otarcy.app/` corrigé |
| index.html | ✅ WebSite : `potentialAction` SearchAction ajouté |
| index.html | ✅ Bloc FAQPage JSON-LD statique ajouté — 10 Q/R extraites de Faq.tsx |
| src/pages/Index.tsx | ✅ useEffect faq-schema supprimé (remplacé par bloc statique index.html) |
| api/audit.ts | ✅ checkSchemaOrg : désimbrication @graph corrigée |
| api/score.ts | ✅ checkSchemaOrg : désimbrication @graph corrigée |

### Décisions techniques

- **FAQPage statique** : `curl https://otarcy.app | grep FAQPage` confirmé en prod — crawlers sans JS peuvent lire le schema
- **@graph fix** : sites utilisant `@graph` (pattern courant) scoraient faussement `warn` sur `schema_org` — fix appliqué dans les deux endpoints
- **Validation curl** : `grep -o '"@type": *"[^"]*"'` — 10 types Schema.org confirmés dans le HTML statique

---

## Sessions 11-15/04/2026 — Dashboard polissage UI + CriteriaDonut refonte complète

### Modifications effectuées

| Fichier | Modification |
|---------|-------------|
| src/pages/Dashboard.tsx | ✅ Layout ROW1/ROW2 — évolution+critères côte à côte, donut pleine largeur |
| src/pages/Dashboard.tsx | ✅ Animations fade-in cascade (`anim-delay-1` à `6`) sur tous les blocs |
| src/pages/Dashboard.tsx | ✅ Barres critères animées — `animated` state, `transitionDelay: idx*60ms`, reset au changement d'URL |
| src/pages/Dashboard.tsx | ✅ ScoreEvolutionChart : H=220, `preserveAspectRatio="none"`, `minHeight: 320` |
| src/pages/Dashboard.tsx | ✅ CriteriaDonut : triple arc concentrique 200×200 — score global / technique / contenu |
| src/index.css | ✅ `@keyframes fadeSlideIn` + `.anim-delay-1` à `.anim-delay-6` |
| .claude/skills/ui-ux-otarcy/SKILL.md | ✅ Skill UI/UX créée — référentiel complet décisions visuelles + composants |

### Décisions techniques retenues

- **CriteriaDonut triple arc** : architecture sémantique > architecture par critère individuel — 3 axes lisibles (global/tech/contenu) au lieu de 10 arcs illisibles
- `groupScore(keywords)` : `includes()` sur `c.nom.toLowerCase()` — robuste aux variations de nommage BDD
- `ScoreEvolutionChart` : `preserveAspectRatio="none"` + `height: "100%"` force le SVG à remplir son flex container
- Animations : CSS pur, `animation-delay` en classes utilitaires — performant, zéro dépendance
- Barres : `width: animated ? "x%" : "0%"` + `transitionDelay` par index — cascade naturelle, reset propre sur changement d'URL

### Reste à faire — mis à jour 15/04/2026

1. **Étape 4 — `api/llm-perception.ts`** : bloquée sur `OPENROUTER_API_KEY`
2. **`ANTHROPIC_API_KEY`** : ajouter dans Vercel pour activer la synthèse Claude dans `api/audit.ts`
3. **Pages secteurs orphelines** : supprimer `AioCoaching.tsx`, `Ecommerce.tsx`, `Immobilier.tsx`, `Restauration.tsx`, `Rh.tsx`, `Sante.tsx`
4. **DNS otarcy.app** : vérifier réactivation

---

## Session 09/04/2026 (suite 3) — Dashboard polissage UI

### Modifications effectuées

| Fichier | Modification |
|---------|-------------|
| src/pages/Dashboard.tsx | ✅ onMouseEnter/Leave supprimés sur AuditCard |
| src/pages/Dashboard.tsx | ✅ ScoreRing : viewBox dynamique, strokeWidth fixe, overflow visible, antialiasing |
| src/pages/Dashboard.tsx | ✅ AuditCard textes : WebkitFontSmoothing + textRendering |
| src/pages/Dashboard.tsx | ✅ Liste : gap 1px + background séparateur, cartes en var(--bg-page) |

### Décisions techniques

- **Hover supprimé** : les effets `onMouseEnter/Leave` hardcodant `#1c1c1c`/`#4a4a4a` cassaient le thème light — supprimés sans remplacement
- **ScoreRing final** : `viewBox` dynamique aligné sur `size`, `r = (size/2) - strokeWidth - 1` pour éviter le clipping, `overflow: "visible"` — pas de `scale()` hack
- **Gap séparateur** : `gap: "1px"` + `background` sur le wrapper remplace les `border` individuels — rendu plus propre, compatible thème light

---

## Session 10/04/2026 — Dashboard two-column layout + nouveaux composants

### Modifications effectuées

| Fichier | Modification |
|---------|-------------|
| src/pages/Dashboard.tsx | ✅ Entièrement refondu — architecture two-column (sidebar + main) |
| src/pages/Dashboard.tsx | ✅ Sidebar : navigation par URL, quota bar, avatar user |
| src/pages/Dashboard.tsx | ✅ Main : KPIs contextuels, ScoreEvolutionChart, CriteriaDonut, barres critères, historique filtré |
| src/pages/Dashboard.tsx | ✅ SkeletonRow, MiniSparkline, ScoreEvolutionChart, CriteriaDonut — nouveaux composants |
| index.css | ✅ Animation skeleton-pulse ajoutée |

### Décisions techniques

- **Architecture two-column** : sidebar fixe à gauche liste les URLs uniques analysées — clic → filtre la zone principale sur cette URL
- **Navigation contextuelle** : selectedUrl contrôle l'affichage — KPIs, graphique, donut, barres et historique filtré s'affichent pour l'URL active
- **AuditDetail modal** : conservée sans modification — inchangée
- **Squelettes** : `SkeletonRow` avec animation CSS `skeleton-pulse` — placeholder homogène pendant le fetch Supabase

### Reste à faire

1. **Étape 4 — `api/llm-perception.ts`** : bloquée sur `OPENROUTER_API_KEY`
2. **`ANTHROPIC_API_KEY`** : ajouter dans Vercel
3. **Pages secteurs orphelines** : supprimer `AioCoaching.tsx`, `Ecommerce.tsx`, `Immobilier.tsx`, `Restauration.tsx`, `Rh.tsx`, `Sante.tsx`
4. **DNS otarcy.app** : vérifier réactivation

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

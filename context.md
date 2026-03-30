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

### Fichiers créés cette session

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

### Reste à faire (session suivante)

1. Étape 8 : mettre à jour `src/App.tsx` — ajouter routes /score /audit /perception + redirect /aio-report → /audit
2. Étape 9 : mettre à jour `src/pages/Index.tsx` — champ URL + sessionStorage + redirection selon plan
3. Étape 4 (différée) : `api/llm-perception.ts` — nécessite OPENROUTER_API_KEY
4. Ajouter `ANTHROPIC_API_KEY` dans Vercel dès que crédits disponibles
5. Attendre réactivation DNS otarcy.app (24-48h)

### Leçons techniques retenues

- Ne jamais utiliser `import` depuis `src/` dans les fichiers `api/` sur Vercel
- PowerShell Windows : utiliser `Invoke-RestMethod` pas `curl`, attention au header `Expect: 100-continue`
- `vercel dev` sur Windows + Node 24 : problèmes de compatibilité — préférer tester directement en prod
- DNS Namecheap : IP Vercel spécifique au projet (vérifier dans Vercel → Domains → DNS Change Recommended)
- `@anthropic-ai/sdk` à installer manuellement si absent du package.json : `npm install @anthropic-ai/sdk`

---
name: supabase-otarcy
description: Patterns et conventions Supabase pour le projet Otarcy. Utiliser cette skill dès qu'on interagit avec la base de données, l'authentification utilisateur, les tables users ou audits, ou les variables d'environnement Supabase. Déclencher aussi pour tout ajout de colonne, nouvelle requête, vérification de plan, ou gestion des quotas d'audits. Ne jamais écrire une requête Supabase sans avoir lu cette skill.
---

# supabase-otarcy

Conventions et patterns Supabase battle-tested pour Otarcy.
Tout ce qui est ici vient du code en production — rien n'est théorique.

---

## Règles absolues — NE PAS DÉROGER

1. **Deux clients Supabase distincts** — `supabase` (anon, côté front) et `createClient` avec `SUPABASE_SERVICE_KEY` (côté API serveur)
2. **JAMAIS la clé anon dans les fichiers `/api/`** — toujours `SUPABASE_SERVICE_KEY` côté serveur
3. **JAMAIS la clé service dans le front** — toujours `VITE_SUPABASE_ANON_KEY` côté client
4. **Colonne audits : `audits_used`** — pas `audits_count` (erreur corrigée en prod le 01/04/2026)
5. **upsert utilisateur au premier accès** — vérifier si l'user existe, créer si absent
6. **`audits_limit === -1` = illimité** — toujours gérer ce cas avant le calcul du quota
7. **CORS sur `/api/user-status.ts`** : `Access-Control-Allow-Origin: *` (comme tous les autres endpoints)

---

## Architecture — deux contextes d'usage

### Côté front (React) — client anon
```typescript
// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

Utilisé dans :
- `src/lib/auth.tsx` — AuthProvider, session, signOut
- `src/lib/useAuthFetch.ts` — authFetch() avec token JWT

### Côté serveur (API Vercel) — client service
```typescript
// Inliné dans chaque fichier /api/
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);
```

**Pourquoi** : la clé service bypasse le RLS et permet de lire/écrire n'importe quelle ligne. Elle ne doit jamais être exposée côté client.

---

## Auth côté front — AuthProvider

```typescript
// src/lib/auth.tsx — ne pas modifier
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

// Hook à utiliser dans les composants
export const useAuth = () => useContext(AuthContext);

// Usage dans un composant
const { user, session, loading, signOut } = useAuth();
```

Le `AuthProvider` wrape toute l'app dans `src/main.tsx`. Il expose :
- `user` — objet User Supabase (null si non connecté)
- `session` — objet Session avec le JWT
- `loading` — true pendant la vérification initiale
- `signOut()` — déconnexion

---

## Auth côté serveur — verifySupabaseAuth()

Pattern exact à inliner dans chaque fichier API protégé :

```typescript
async function verifySupabaseAuth(req: VercelRequest): Promise<{ userId: string; email: string } | null> {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.replace("Bearer ", "").trim();
  const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return { userId: user.id, email: user.email ?? "" };
}
```

Usage dans le handler :
```typescript
const auth = await verifySupabaseAuth(req);
if (!auth) return res.status(401).json({ error: "Non authentifié." });
const { userId, email } = auth;
```

---

## Schéma table `users`

| Colonne | Type | Valeur par défaut | Notes |
|---------|------|-------------------|-------|
| id | uuid | — | = auth.user.id Supabase |
| email | text | — | |
| plan | text | `"free"` | `"free"` / `"pro"` / `"agency"` |
| audits_used | int | `0` | ⚠ pas `audits_count` |
| audits_limit | int | `3` | `-1` = illimité |

---

## Patterns de requêtes — code exact

### Lire un utilisateur
```typescript
const { data: user } = await supabase
  .from("users")
  .select("*")
  .eq("id", userId)
  .single();
```

### Créer un utilisateur au premier accès
```typescript
if (!user) {
  await supabase.from("users").insert({
    id: userId,
    email,
    plan: "free",
    audits_used: 0,
    audits_limit: 3,
  });
  const { data } = await supabase.from("users").select("*").eq("id", userId).single();
  user = data;
}
if (!user) return res.status(500).json({ error: "Erreur serveur." });
```

### Incrémenter audits_used
```typescript
await supabase
  .from("users")
  .update({ audits_used: user.audits_used + 1 })
  .eq("id", userId);
```

### Vérifier le quota avant d'autoriser un audit
```typescript
const auditsLeft = user.audits_limit === -1
  ? 999
  : Math.max(0, user.audits_limit - user.audits_used);

if (auditsLeft <= 0) {
  return res.status(403).json({ error: "Quota d'audits épuisé." });
}
```

### Vérifier le plan
```typescript
if (!["pro", "agency"].includes(user.plan)) {
  return res.status(403).json({ error: "Plan insuffisant" });
}
```

---

## Payload de réponse — api/user-status.ts

```typescript
return res.status(200).json({
  auditsLeft: user.audits_limit === -1 ? 999 : Math.max(0, user.audits_limit - user.audits_used),
  auditsUsed: user.audits_used,
  auditsLimit: user.audits_limit,
  plan: user.plan,
  email: user.email,
});
```

---

## sessionStorage — flow de navigation entre pages

```typescript
// Dans Index.tsx — avant redirection vers le résultat
sessionStorage.setItem("otarcy_audit_url", url);
sessionStorage.setItem("otarcy_brand", brand); // uniquement si plan = agency

// Dans ScoreResult / AuditResult / PerceptionResult — au montage
const url = sessionStorage.getItem("otarcy_audit_url");
const brand = sessionStorage.getItem("otarcy_brand");
```

---

## Variables d'environnement Supabase

| Variable | Contexte | Usage |
|----------|----------|-------|
| `VITE_SUPABASE_URL` | front + serveur | URL du projet Supabase |
| `VITE_SUPABASE_ANON_KEY` | front uniquement | Client public RLS |
| `SUPABASE_SERVICE_KEY` | serveur uniquement | Client admin bypass RLS |

---

## Logique de redirection selon le plan

```typescript
if (plan === "free") navigate("/score");
else if (plan === "pro") navigate("/audit");
else if (plan === "agency") navigate("/audit"); // /perception accessible depuis AuditResult
```

---

## Fichiers à ne pas modifier

- `src/lib/auth.tsx` — AuthProvider et useAuth()
- `src/lib/useAuthFetch.ts` — authFetch() avec token JWT
- `api/user-status.ts` — endpoint de vérification du plan

---

## Checklist avant de livrer un endpoint avec Supabase

- [ ] `SUPABASE_SERVICE_KEY` utilisée côté serveur (jamais la clé anon)
- [ ] `verifySupabaseAuth()` inlinée dans le fichier (pas importée)
- [ ] Colonne `audits_used` utilisée (pas `audits_count`)
- [ ] Cas `audits_limit === -1` géré avant le calcul du quota
- [ ] Upsert utilisateur au premier accès si nécessaire
- [ ] Aucune clé ou token loggé dans la console

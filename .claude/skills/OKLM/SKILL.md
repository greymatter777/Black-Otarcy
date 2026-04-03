# Skill — OKLM

## Déclencheur

Quand l'utilisateur écrit le mot `OKLM` (en majuscules, seul ou dans une phrase), cette skill s'active immédiatement.

## Ce que tu dois faire

1. **Relire l'intégralité de la session en cours** — identifier de façon autonome tout ce qui a été accompli, décidé, modifié ou appris. Prioriser : fichiers modifiés, décisions architecturales, étapes validées, problèmes résolus, prochaines étapes identifiées.

2. **Lire `CLAUDE.md` et `context.md` avant d'écrire** — comparer l'état actuel des fichiers avec ce qui vient de changer. N'intervenir que sur les deltas réels.

3. **Mettre à jour `CLAUDE.md`** — ajouter ou modifier uniquement les sections impactées. Conserver la structure existante mot pour mot sur les sections non touchées.

4. **Mettre à jour `context.md`** — refléter l'état actuel du projet : avancement, décisions prises, prochaines étapes. Remplacer ce qui est obsolète, ajouter ce qui est nouveau.

5. **Confirmer en une ligne** — une fois les deux fichiers mis à jour, afficher uniquement :
   `✓ CLAUDE.md et context.md mis à jour.`

## Règles strictes

- Ne jamais demander de confirmation avant d'agir — agir directement.
- Ne jamais réécrire ce qui n'a pas changé.
- Ne jamais supprimer du contenu existant sauf s'il est explicitement obsolète.
- Ne jamais reformuler les sections stables avec d'autres mots.
- La confirmation finale doit tenir en une seule ligne — pas de résumé, pas de liste de ce qui a changé.

## Localisation des fichiers

- `CLAUDE.md` — à la racine du projet
- `context.md` — à la racine du projet

Si l'un des deux fichiers n'existe pas, le créer avec une structure minimale cohérente avec le projet en cours.

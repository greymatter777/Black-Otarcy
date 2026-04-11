---
name: otarcy-ui-ux
description: >
  Senior UI/UX design skill for the Otarcy SaaS project. Triggers on ANY task involving
  visual design, interface modifications, component creation, page layouts, design reviews,
  or UX improvements for Otarcy. This skill must activate whenever the user mentions:
  designing a page, modifying a visual, creating a component, reviewing an interface,
  improving the UX, building a dashboard, creating a landing page, working on onboarding,
  pricing pages, authentication screens, empty states, or any other UI/UX work — even if
  the user doesn't explicitly say "UI/UX design". The goal is to produce premium-quality
  SaaS interfaces that feel designed by a senior product designer, every single time.
---

# Otarcy UI/UX — Référentiel Design Senior

Tu agis en tant que **designer UI/UX senior et ingénieur frontend** pour Otarcy, un SaaS B2B professionnel.
Ton rôle : apporter une qualité de design premium à chaque interaction visuelle — du composant isolé à la page complète.

**Lis ce fichier EN ENTIER avant de toucher une seule ligne de code ou de prendre la moindre décision visuelle.**
Ce skill encode des décisions réelles issues du code de production — pas des guidelines théoriques.

---

## 0. Règles absolues (non négociables)

Violations bloquantes — aucune exception, aucun contexte ne justifie de déroger :

1. **Inline styles uniquement** — zéro `className` Tailwind, zéro CSS module, zéro styled-components
2. **Zéro `border-radius`** — sauf `borderRadius: "2px"` sur les barres de progression KPI
3. **Zéro `box-shadow`** — la profondeur vient exclusivement des couleurs de fond
4. **Deux polices uniquement** — `'Bebas Neue'` et `'Raleway'`, jamais Inter, Geist ou system fonts
5. **`fontFamily` toujours déclaré explicitement** en inline style — jamais hérité du parent
6. **`textTransform: "uppercase"`** sur tous les labels, boutons, badges — sans exception
7. **`fontWeight: 300`** sur le corps de texte Raleway / **`600`** sur les CTA uniquement
8. **Transitions 0.2s–0.8s** selon le type (voir Section 9) — jamais au-delà de 1s
9. **CSS variables** pour toutes les couleurs thème-sensibles — hardcodé uniquement pour les états sémantiques fixes

---

## 1. Philosophie design Otarcy

L'esthétique Otarcy est **sombre, minimale, typographique**. Chaque décision d'interface répond à trois questions :

- **Est-ce clair ?** L'utilisateur ne doit jamais se demander quoi faire ensuite.
- **Est-ce cohérent ?** Ce qui se ressemble se comporte pareil.
- **Est-ce premium ?** Le niveau de détail signale confiance et professionnalisme.

### Les 7 principes du dark SaaS de référence

**1. Speed & Clarity first**
Chaque section répond à une question utilisateur précise. Hero = proposition de valeur en < 6 mots + CTA visible sans scroll. Zéro élément décoratif sans fonction narrative.

**2. Typographie comme architecture**
La typographie EST le layout. Les tailles créent la hiérarchie, pas les boîtes. Contraste brutal entre titre (Bebas Neue, très grand) et corps (Raleway, très petit). Les labels de section (0.58rem uppercase, letterSpacing 0.3em) agissent comme des panneaux de navigation dans la page.

**3. Profondeur par les fonds, jamais par les effets**
Pas de gradient, pas de glow, pas de blur décoratif. Profondeur construite avec 4–5 niveaux de noir. Les bordures `#2a2a2a` sont les seuls séparateurs — une seule épaisseur : `1px solid`. L'accent vert `#a3e635` utilisé avec parcimonie : max 2–3 éléments par écran.

**4. Conversion-focused**
CTA primaire toujours visible dans le viewport. Plan recommandé visuellement distinct (border accent vert). Chaque section se termine par une micro-action. Les KPI sont placés avant le corps de texte pour ancrer la crédibilité.

**5. Modulaire et composable**
Chaque composant est autonome — il peut être sorti de son contexte sans casser. Pattern récurrent : label section → titre Bebas → corps Raleway → action. Aucune carte sans fallback visuel propre.

**6. Micro-interactions précises**
Hover = changement de couleur uniquement (`border-color`, `color`, `opacity`) — jamais de déplacement ou de scale. Feedback visuel immédiat : bouton copié → vert, item actif sidebar → border vert.

**7. Densité d'information contrôlée**
Dashboard : haute densité (sidebar compacte + cartes compactes). Landing : faible densité (espaces généreux, une idée par section). Ne jamais mélanger les deux densités sur une même page.

---

## 2. Stack technique (obligatoire)

```
Framework       → React 18 + TypeScript
Build           → Vite
Routing         → React Router
Styling         → Inline styles UNIQUEMENT (style={{}})
Fonts           → Google Fonts : Bebas Neue + Raleway
Theme           → ThemeContext (src/lib/ThemeContext.tsx) → useTheme()
                  CSS custom properties sur :root / [data-theme="dark"] / [data-theme="light"]
                  data-theme appliqué sur document.documentElement
Animations      → CSS transitions inline + useState/useEffect (pas de lib externe)
Reveal scroll   → useReveal() hook + className="reveal" (src/lib/useReveal.ts)
Skeletons       → className="skeleton-pulse" (défini dans index.css)
Charts          → SVG vanilla — pas de Recharts, Chart.js, Tremor ou autre lib
```

**Bibliothèques interdites dans ce projet :** Tailwind, shadcn/ui, Radix, Tremor, Framer Motion, Lucide, styled-components, emotion, MUI, Ant Design.

---

## 3. Système de thème — CSS Variables

### Utilisation obligatoire (couleurs thème-sensibles)

```tsx
// Fonds
background: "var(--bg-primary)"    // #0a0a0a dark  / #f5f5f0 light
background: "var(--bg-page)"       // #0f0f0f dark  / #f5f5f0 light
background: "var(--bg-hero)"       // #161616 dark  / #eeede8 light
background: "var(--bg-nav)"        // rgba(15,15,15,0.97) dark / rgba(255,255,255,0.97) light
background: "var(--bg-input-nl)"   // #111 dark / #ffffff light

// Bordures
border: "1px solid var(--border-1)"  // #1a1a1a dark / #e8e8e2 light
border: "1px solid var(--border-2)"  // #2a2a2a dark / #d4d4cc light
border: "1px solid var(--border-3)"  // #3a3a3a dark / #c0c0b8 light

// Texte
color: "var(--text-1)"   // #f0f0f0 dark / #0f0f0a light  → texte principal
color: "var(--text-2)"   // #7a7a7a dark / #6a6a62 light  → texte secondaire
color: "var(--text-3)"   // #4a4a4a dark / #b0b0a8 light  → texte inactif
color: "var(--text-4)"   // #d4d4d4 dark / #2a2a22 light  → corps contenu
color: "var(--text-5)"   // #e8e8e8 dark / #1a1a12 light  → texte hover

// Accent
color: "var(--accent)"      // #a3e635 dark / #7ab82a light
color: "var(--accent-fg)"   // #0f0f0f dark / #ffffff light
```

### Couleurs hardcodées (états sémantiques fixes — ne changent pas avec le thème)

```
#a3e635   vert Otarcy  — accent, CTA, succès, score bon/excellent
#60a5fa   bleu         — structure, features, opportunités, LinkedIn
#f97316   orange       — warnings, Quick Wins, score moyen, menaces
#ef4444   rouge        — erreurs, score critique, hover déconnexion
```

---

## 4. Palette complète (référence dark mode)

```
Fonds — du plus sombre au plus clair
#080808   fond sidebar dashboard
#0a0a0a   fond page principal, sections hero, CTA box
#0d0d0d   fond item actif sidebar
#0f0f0f   fond cartes standard
#111111   fond item liste au hover
#161616   fond cartes intérieures / nested

Bordures & séparateurs
#1a1a1a   séparateurs légers, grilles graphiques
#2a2a2a   bordures standard, tracks barres KPI
#3a3a3a   bordures boutons ghost, états désactivés

Texte — du plus discret au plus lisible
#4a4a4a   texte inactif, labels footer, hints
#7a7a7a   texte secondaire, subtitles, légendes graphiques
#a0a0a0   labels KPI
#d4d4d4   corps recommandations, contenu cartes
#e8e8e8   texte au hover
#f0f0f0   texte principal, titres
```

---

## 5. Typographie — échelle complète

### Bebas Neue — titres, scores, numéros

```
clamp(5rem, 14vw, 11rem)    → H1 hero landing
clamp(2.5rem, 5vw, 4.5rem)  → H2 section landing
clamp(2rem, 4vw, 3rem)      → Titre page dashboard (hostname)
3.5rem                       → Stats hero (chiffres clés)
2.2rem / 2rem                → Stats KPI dashboard
1.4rem                       → Hostname AuditCard
1.3rem / 1.2rem / 1.1rem     → Titres cartes larges
1rem                         → Titres cartes standard
0.95rem                      → Titre critère modal
0.9rem / 0.88rem             → Titres sections dashboard
0.85rem                      → Numéros feature (01, 02...), scores barres
0.82rem                      → Petit titre chart, score ring
```

### Raleway — corps, boutons, labels, meta

```
0.88rem   → paragraphe intro (lineHeight 1.9)
0.82rem   → tagline hero (letterSpacing 0.22em)
0.78rem   → corps recommandation (lineHeight 1.6, fontWeight 300)
0.76rem   → corps standard (lineHeight 1.7, fontWeight 300)
0.72rem   → corps secondaire, messages erreur
0.70rem   → labels navbar
0.68rem   → nom utilisateur sidebar
0.66rem   → boutons CTA (letterSpacing 0.22em, fontWeight 600)
0.65rem   → labels section accentués (letterSpacing 0.3em)
0.62rem   → petits liens, mentions légales
0.60rem   → footer, labels discrets, déconnexion
0.58rem   → micro-labels uppercase (letterSpacing 0.3em)
0.56rem   → date audit, audit count sidebar
0.54rem   → labels KPI dashboard, hints, quota label
0.52rem   → labels sidebar section, url-date, micro-meta
0.50rem   → badge NEW, tag URL actif
```

---

## 6. Espacement & Layout

```
Layout dashboard        → grid-template-columns: "260px 1fr"
Sidebar padding         → 32px 20px
Main content padding    → 40px 44px 80px
paddingTop main         → 57px (hauteur navbar fixe)
Landing section padding → 100px 60px
maxWidth landing        → 860px centré (margin: 0 auto)
maxWidth modal          → 760px

Gap cartes              → 16px standard / 12px compact
marginBottom cartes     → 16px entre cartes / 32px entre blocs
Padding carte standard  → 24px
Padding carte large     → 28px / 32px
Gap sidebar URL items   → 6px
Gap sidebar sections    → 24px
```

---

## 7. Bordures & Fonds — patterns exacts

```tsx
// Carte standard
{ border: "1px solid var(--border-2)", background: "var(--bg-hero)" }

// Carte intérieure (nested)
{ border: "1px solid var(--border-2)", background: "#161616" }

// Carte accentuée vert
{ border: "1px solid var(--border-2)", borderLeft: "2px solid #a3e635", background: "var(--bg-hero)" }

// Carte accentuée bleue
{ border: "1px solid var(--border-2)", borderLeft: "2px solid #60a5fa", background: "var(--bg-hero)" }

// Carte accentuée orange
{ border: "1px solid var(--border-2)", borderLeft: "2px solid #f97316", background: "var(--bg-hero)" }

// CTA box
{ border: "1px solid #a3e635", background: "#0a0a0a" }

// Item actif sidebar
{ border: "1px solid var(--accent)", background: "#0d0d0d" }

// Item inactif sidebar
{ border: "1px solid var(--border-2)", background: "transparent" }

// Locked / désactivé
{ border: "1px dashed var(--border-2)" }

// Séparateur horizontal
{ borderTop: "1px solid var(--border-2)" }
```

---

## 8. Boutons — code exact à copier

### CTA primaire (vert plein)
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase",
  padding: "13px 32px",
  background: "var(--accent)", color: "var(--accent-fg)",
  fontWeight: 600, transition: "opacity 0.2s",
  border: "none", cursor: "pointer",
}}
onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
```

### Bouton ghost (contour)
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase",
  padding: "13px 32px",
  border: "1px solid var(--border-3)", background: "transparent", color: "var(--text-2)",
  cursor: "pointer", transition: "border-color 0.3s, color 0.3s",
}}
onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--text-5)"; e.currentTarget.style.color = "var(--text-5)"; }}
onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-3)"; e.currentTarget.style.color = "var(--text-2)"; }}
```

### Bouton action compact (→ Comment faire ?)
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase",
  padding: "4px 10px",
  border: "1px solid var(--border-3)", background: "transparent", color: "var(--text-2)",
  cursor: "pointer", transition: "color 0.2s, border-color 0.2s",
}}
onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a3e635"; e.currentTarget.style.color = "#a3e635"; }}
onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-3)"; e.currentTarget.style.color = "var(--text-2)"; }}
```

### Bouton toggle ouvert/fermé
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase",
  padding: "10px 20px",
  border: "1px solid #a3e635",
  background: isOpen ? "#a3e635" : "transparent",
  color: isOpen ? "#0f0f0f" : "#a3e635",
  cursor: "pointer", transition: "all 0.2s",
}}
```

### Bouton copier (feedback vert au clic)
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase",
  padding: "3px 8px",
  border: "1px solid var(--border-2)",
  background: copied ? "#a3e635" : "transparent",
  color: copied ? "#0f0f0f" : "var(--text-2)",
  cursor: "pointer", transition: "all 0.2s",
}}
```

### Bouton déconnexion (rouge au hover)
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
  color: "var(--text-3)", background: "transparent", border: "none", cursor: "pointer",
  transition: "color 0.3s",
}}
onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}
```

---

## 9. Animations & Transitions

### Tableau de référence

```
Reveal scroll (landing)   → opacity 0→1 + translateY(20px→0), 0.7s ease
                            className="reveal" → .visible via IntersectionObserver (useReveal hook)

Barres KPI (mount)        → width 0→x% sur 0.7s cubic-bezier(.22,1,.36,1)
                            Stagger : transition-delay index * 80ms

KPI cards (mount)         → opacity 0→1 + translateY(8px→0) sur 0.5s ease
                            Stagger : transition-delay index * 120ms

Score ring SVG            → stroke-dashoffset animé sur 1s cubic-bezier(.22,1,.36,1)

Hover bouton              → color / border-color / opacity sur 0.2s–0.3s

Sidebar item hover        → background sur 0.2s

Skeleton                  → opacity pulse 1.5s ease-in-out infinite

Quota bar                 → width sur 0.6s ease
```

### Pattern mount animation (dashboard — copier ce pattern exactement)

```tsx
const [animated, setAnimated] = useState(false);

useEffect(() => {
  setAnimated(false);
  const t = setTimeout(() => setAnimated(true), 80);
  return () => clearTimeout(t);
}, [triggerValue]); // triggerValue = selectedUrl ou équivalent

// Sur une barre de critère
style={{
  width: animated ? `${(points / max) * 100}%` : "0%",
  transition: `width 0.7s cubic-bezier(.22,1,.36,1) ${index * 80}ms`,
}}

// Sur une KPI card
style={{
  opacity: animated ? 1 : 0,
  transform: animated ? "translateY(0)" : "translateY(8px)",
  transition: `opacity 0.5s ease ${index * 120}ms, transform 0.5s ease ${index * 120}ms`,
}}
```

### CSS requis dans index.css

```css
.reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }
@keyframes skeleton-pulse { 0%{opacity:1} 50%{opacity:0.4} 100%{opacity:1} }
.skeleton-pulse { animation: skeleton-pulse 1.5s ease-in-out infinite; }
```

---

## 10. Labels & Micro-textes — patterns exacts

### Label de section standard
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.58rem", letterSpacing: "0.3em",
  color: "var(--text-2)", textTransform: "uppercase", marginBottom: "14px",
}}
```

### Label section accentué vert (.02 — Pourquoi l'AIO ?)
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.65rem", letterSpacing: "0.3em",
  color: "var(--accent)", textTransform: "uppercase",
  marginBottom: "16px", fontWeight: 500,
}}
```

### Badge statut audit (niveau)
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.55rem", letterSpacing: "0.1em",
  color: niveauColor(audit.niveau),
  padding: "2px 8px",
  border: `1px solid ${niveauColor(audit.niveau)}`,
  textTransform: "uppercase",
}}
```

### Badge NEW
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.5rem", letterSpacing: "0.15em",
  color: "var(--accent)", border: "1px solid var(--accent)",
  padding: "1px 5px", textTransform: "uppercase",
  verticalAlign: "middle", marginLeft: "8px",
}}
```

### Numéro de feature (01, 02...)
```tsx
style={{
  fontFamily: "'Bebas Neue', sans-serif",
  fontSize: "0.85rem", letterSpacing: "0.15em",
  color: "#a3e635", // ou #60a5fa, #f97316 selon contexte
  marginBottom: "10px",
}}
```

---

## 11. Composants récurrents — code exact

### Ligne avec flèche (recommandations, SWOT)
```tsx
<div style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
  <span style={{ color: "var(--accent)", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }}>→</span>
  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "var(--text-4)", lineHeight: 1.6, fontWeight: 300 }}>
    {item}
  </p>
</div>
```

### Carte section standard
```tsx
<div style={{ padding: "24px", border: "1px solid var(--border-2)", background: "var(--bg-hero)", marginBottom: "16px" }}>
  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "14px" }}>
    TITRE SECTION
  </p>
  {/* contenu */}
</div>
```

### Carte accentuée (guide d'action, template)
```tsx
<div style={{
  marginTop: "12px", padding: "20px",
  background: "#161616",
  border: "1px solid var(--border-2)",
  borderLeft: "2px solid var(--accent)", // ou #60a5fa, #f97316
}}>
  {/* contenu */}
</div>
```

### Header de carte avec action à droite
```tsx
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "var(--text-1)" }}>
    TITRE
  </p>
  <div style={{ display: "flex", gap: "8px" }}>
    {/* badges ou boutons */}
  </div>
</div>
```

### Barre de progression KPI (avec animation mount)
```tsx
<div style={{ height: 2, background: "var(--border-2)", borderRadius: 2 }}>
  <div style={{
    height: 2,
    width: animated ? `${(value / max) * 100}%` : "0%",
    background: "var(--accent)",
    borderRadius: 2,
    transition: `width 0.7s cubic-bezier(.22,1,.36,1) ${index * 80}ms`,
  }} />
</div>
```

### Avatar initiales (sidebar)
```tsx
<div style={{
  width: 36, height: 36, borderRadius: "50%",
  background: "#1a1a1a", border: "1px solid #2a2a2a",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.7rem", color: "#7a7a7a",
  flexShrink: 0,
}}>
  {displayName.charAt(0).toUpperCase()}
</div>
```

### Skeleton loading
```tsx
<div className="skeleton-pulse" style={{ height: 11, width: 130, background: "#161616" }} />
<div className="skeleton-pulse" style={{ height: 8, width: 80, background: "#161616", marginTop: 5 }} />
```

### Footer note / conseil
```tsx
<p style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.62rem", color: "var(--text-3)",
  fontStyle: "italic",
  borderTop: "1px solid var(--border-2)", paddingTop: "8px",
}}>
  💡 {conseil}
</p>
```

---

## 12. Fonctions utilitaires — copier telles quelles

Ces fonctions sont utilisées dans plusieurs composants. Ne jamais les réinventer.

```tsx
function niveauColor(niveau: string): string {
  switch (niveau) {
    case "critique": return "#ef4444";
    case "faible":   return "#f97316";
    case "moyen":    return "var(--text-1)";
    case "bon":      return "var(--accent)";
    case "excellent":return "var(--accent)";
    default:         return "var(--text-2)";
  }
}

function statutColor(statut: "ok" | "warn" | "ko"): string {
  return statut === "ok" ? "var(--accent)" : statut === "warn" ? "#f97316" : "#ef4444";
}
```

---

## 13. Graphiques SVG — spécifications exactes

Tous les graphiques sont en SVG vanilla. Aucune bibliothèque externe.

### ScoreEvolutionChart
```
viewBox             → "0 0 620 130", preserveAspectRatio="xMidYMid meet"
Padding             → padL=28, padR=20, padT=14, padB=22
Grilles horizontales → stroke="#1a1a1a", strokeWidth=1, à y=0, 50, 100
Labels Y            → fill="#3a3a3a", fontSize=8, fontFamily="Raleway"
Ligne principale    → stroke="#a3e635", strokeWidth=1.5, strokeLinejoin="round"
Area gradient       → linearGradient #a3e635 opacity 0.12 → 0
Points              → r=3, fill="#0f0f0f", stroke="#a3e635", strokeWidth=1.5
Dernier point       → r=4, fill="#a3e635" (mis en avant)
Labels X (dates)    → fill="#4a4a4a", fontSize=9, Raleway — dernier en "#a3e635"
Labels scores       → fill="#7a7a7a", fontSize=9, Bebas Neue — dernier en "#a3e635"
```

### CriteriaDonut (160px — version redesignée)
```
SVG                 → 160×160, cx=80, cy=80, r=58, strokeWidth=14
Track               → stroke="#1a1a1a"
Segments            → strokeDasharray : (c.max / total) * (2 * Math.PI * 58)
                      Gap entre segments : soustraire 2 du dash pour respiration visuelle
Rotation offset     → strokeDashoffset commence à -(circumference / 4) pour départ en haut
Couleurs par index  → ["#a3e635","#60a5fa","#f97316","#7a7a7a","#4a4a4a","#d4d4d4","#ef4444","#f0f0f0","#a0a0a0","#3a3a3a"]
Centre score        → Bebas Neue fontSize=28, fill="#f0f0f0"
Centre sous-label   → Raleway fontSize=9, fill="#4a4a4a", texte "/100 pts"
Légende             → grille 2 colonnes à droite du SVG, gap 8px, score coloré en Bebas Neue 0.78rem
```

### MiniSparkline (inline dans historique)
```
Barres              → width=4, gap=2, alignItems="flex-end", height conteneur=22px
Hauteur             → (score / max) * 100% du conteneur
Couleur             → dernière barre "#a3e635", précédentes "#2a2a2a"
Nombre de barres    → 4 derniers audits (slice(-4))
```

### ScoreRing (composant réutilisable)
```tsx
// Paramètres : size (défaut 70), score (0–100)
// strokeWidth = 4, r = (size/2) - strokeWidth - 1
// Couleur stroke : score ≥ 76 → "#a3e635" | ≥ 56 → "var(--text-1)" | < 56 → "#ef4444"
// strokeDashoffset animé : transition "stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)"
// Score centré : Bebas Neue size*0.28px | "/100" : Raleway size*0.13px color var(--text-2)
```

---

## 14. Patterns par type de page

### Dashboard / Analytics
- Layout : `grid-template-columns: "260px 1fr"`, sidebar sticky `top: 57px`
- KPIs en grille 3 colonnes, gap 12px — animés au mount (stagger 120ms)
- Barres de critères animées au mount (stagger 80ms) — jamais statiques
- Sidebar : URL list avec item actif `border: "1px solid var(--accent)"` + `background: "#0d0d0d"`
- Hover liste historique : `background: "#111"` via onMouseEnter/Leave
- Skeleton rows sur tous les états de chargement

### Landing / Marketing
- Label de section `.01 — ...` en vert accent avant chaque H2
- H1 Bebas Neue `clamp(5rem, 14vw, 11rem)`, tagline Raleway 0.82rem letterSpacing 0.22em
- maxWidth 860px centré, sections `100px 60px` padding
- Au moins 2 CTA sections (mi-page + footer)
- Densité faible — une idée par section

### Authentication
- Fond `var(--bg-primary)` (#0a0a0a)
- Logo OT/AR centré en haut (Bebas Neue stacked)
- Carte centrée maxWidth 400px, padding 40px
- Erreurs inline sous le champ concerné — jamais d'alert banner
- Un seul CTA full-width

### Pricing
- 3 tiers, plan recommandé avec `border: "1px solid #a3e635"`
- Prix en Bebas Neue 3.5rem, fréquence en Raleway 0.70rem
- CTA vert plein sur le plan recommandé, ghost sur les autres

### Empty States
- Structure : icône (→ ou SVG minimaliste) + titre Bebas Neue + corps Raleway 0.76rem + CTA
- Ton : utile et orienté action — jamais froid
- Toujours présent sur chaque liste, tableau, vue de données

---

## 15. Process par type de tâche

### Créer un nouveau composant ou une page

1. **Définir l'objectif utilisateur** — Qu'est-ce que l'utilisateur cherche à accomplir ? Le dire avant de designer.
2. **Identifier le type de page** — Dashboard, landing, auth, pricing, empty state ?
3. **Établir la hiérarchie** — Action primaire, action secondaire, contenu de support.
4. **Choisir le pattern de layout** — Sidebar + contenu, carte centrée, grille pleine largeur.
5. **Construire en inline styles** — Sections 7–13 comme référence. Zéro Tailwind.
6. **Appliquer la checklist** (Section 16) avant de livrer.

### Modifier un composant existant

1. **Lire le composant en entier** — Identifier ce qui fonctionne avant de toucher quoi que ce soit.
2. **Diagnostiquer le problème UX** — Visuel ? Flow ? Hiérarchie ? Le nommer précisément.
3. **Proposer la correction avec rationale** — Pourquoi ce changement améliore l'expérience.
4. **Appliquer et vérifier** — Confirmer que la correction ne casse pas les éléments adjacents.

### Auditer une interface

Structurer la sortie :

**Critique** (bloque la complétion de tâche ou détruit la confiance)
**Problèmes UX** (friction, confusion, incohérence)
**Polish visuel** (espacement, typographie, couleur, alignement)
**Quick wins** (corrections faciles, impact élevé)

Être spécifique : nommer l'élément exact, décrire le problème, expliquer pourquoi ça compte, proposer le fix.

---

## 16. Checklist qualité — appliquer avant chaque livraison

**Stack**
- [ ] Zéro className Tailwind (sauf `reveal`, `skeleton-pulse`)
- [ ] Toutes les couleurs thème-sensibles en CSS variables
- [ ] Uniquement Bebas Neue et Raleway, `fontFamily` déclaré sur chaque élément texte
- [ ] Zéro `border-radius` sauf `2px` sur les barres KPI
- [ ] Zéro `box-shadow`

**Structure**
- [ ] Objectif utilisateur lisible depuis le layout — action primaire évidente
- [ ] Hiérarchie visuelle cohérente (Bebas titres, Raleway corps)
- [ ] Label de page présent (pattern `.04 — Dashboard`)

**Composants**
- [ ] Hover states sur tous les éléments cliquables (onMouseEnter/Leave)
- [ ] Skeleton sur tous les états de chargement
- [ ] Empty state sur toutes les listes et vues de données
- [ ] `textTransform: "uppercase"` sur tous les labels, boutons, badges
- [ ] `fontWeight: 300` sur le corps Raleway

**Animations**
- [ ] Barres et KPIs animés au mount — jamais statiques
- [ ] Stagger delay appliqué (80ms barres, 120ms cards)
- [ ] Transitions ≤ 0.8s (mount) / ≤ 0.4s (interactions)
- [ ] `cubic-bezier(.22,1,.36,1)` sur les animations de données

**Accessibilité**
- [ ] Contraste suffisant sur fond sombre (vérifier sur #0f0f0f)
- [ ] Éléments interactifs navigables au clavier
- [ ] HTML sémantique : `<nav>`, `<main>`, `<aside>`, `<button>` — pas de `<div>` cliquable nu

---

## 17. Standards de communication

À chaque livraison de travail UI/UX, inclure :

1. **Ce qui a été construit** — 1–2 phrases décrivant le livrable
2. **Décisions design** — 2–3 choix clés et leur justification
3. **Ce qu'il faut regarder en premier** — L'élément le plus important à valider
4. **Prochaines étapes** — Ce qui doit être designé/construit ensuite dans ce flow

Exemple :
> "Voici le CriteriaDonut redesigné. Le SVG passe à 160px avec légende en grille 2 colonnes — élimine le problème de lisibilité à 0.58rem. Les scores utilisent Bebas Neue 0.78rem coloré par critère pour la hiérarchie visuelle. Prochaine étape : animer les segments au mount via stroke-dashoffset avec stagger 60ms par segment."

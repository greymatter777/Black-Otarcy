# Skill — UI/UX Otarcy
# Source : design system production + patterns top 1% Framer (Arthur Duchesne, 82K+ vues, $5k/mois)

Lis ce fichier AVANT de créer ou modifier tout composant, page, ou élément visuel.
Ce skill encode des décisions réelles — pas des guidelines théoriques.

---

## Règles absolues

1. **Inline styles uniquement** — zéro className Tailwind, zéro CSS module
2. **Zéro border-radius** — sauf `borderRadius: "2px"` sur les barres de progression KPI
3. **Zéro box-shadow** — la profondeur vient des couleurs de fond uniquement
4. **Zéro autre police** que Bebas Neue et Raleway
5. **Transitions 0.2s–0.4s max** — jamais plus
6. **textTransform uppercase** — tous les labels, boutons, badges sans exception
7. **fontWeight 300** corps de texte Raleway / **600** CTA uniquement
8. **Toujours déclarer fontFamily explicitement** en inline style — jamais hériter

---

## Principes du top 1% (Arthur Duchesne — Framer, 82K+ vues)

Ces principes sont extraits de l'analyse de ses templates dark SaaS les plus performants.
Ils s'appliquent à Otarcy directement.

### 1. Speed & Clarity first
> "Built for speed, clarity, and conversion" — tagline Éther.design

- Chaque section répond à une question utilisateur précise avant de descendre
- Hero = valeur proposition en < 6 mots + CTA visible sans scroll
- Zéro élément décoratif sans fonction narrative

### 2. Bold typography comme architecture
- La typographie EST le layout — les tailles créent la hiérarchie, pas les boîtes
- Contraste brutal entre titre (Bebas Neue, très grand) et corps (Raleway, très petit)
- Les labels de section (0.58rem uppercase, letterSpacing 0.3em) agissent comme des "panneaux de navigation" dans la page

### 3. Dark design = profondeur par les fonds, pas les effets
- Pas de gradient, pas de glow, pas de blur décoratif
- Profondeur construite avec 4–5 niveaux de noir : `#080808` → `#0a0a0a` → `#0f0f0f` → `#161616`
- Les bordures `#2a2a2a` sont les seuls séparateurs — une seule épaisseur : `1px solid`
- L'accent vert `#a3e635` est utilisé avec parcimonie : max 2–3 éléments par écran

### 4. Conversion-focused layout
- CTA primaire toujours visible dans le viewport — jamais caché
- Plan/Pricing : mettre en avant le plan recommandé visuellement (border accent vert)
- Chaque section se termine par une micro-action (lien, bouton, ou flèche)
- Les KPI (chiffres clés) placés avant le corps de texte pour ancrer la crédibilité

### 5. Modular & composable
- Chaque composant est autonome — il peut être sorti de son contexte sans casser
- Pattern récurrent : label section → titre Bebas → corps Raleway → action
- Les cartes n'ont pas d'état "vide" — toujours un fallback visuel propre

### 6. Micro-interactions précises
- Hover = changement de couleur uniquement (border-color, color) — jamais de déplacement
- Transitions sur `color`, `border-color`, `opacity` uniquement
- Feedback visuel immédiat : bouton copié → vert, item actif sidebar → border vert

### 7. Information density contrôlée
- Dashboard : haute densité (sidebar compacte + cartes compactes)
- Landing : faible densité (espaces généreux, une idée par section)
- Ne jamais mélanger les deux densités sur une même page

---

## Polices

```
'Bebas Neue'  → titres, scores, numéros, labels Bebas, stats KPI
'Raleway'     → corps, boutons, labels secondaires, meta, dates
```

Toujours déclarer `fontFamily` explicitement en inline style.

---

## Palette complète

```
Fonds (du plus sombre au plus clair)
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

Texte (du plus discret au plus lisible)
#3a3a3a   hints très discrets (usage exceptionnel)
#4a4a4a   texte inactif, labels de footer, hints
#7a7a7a   texte secondaire, subtitles, légendes graphiques
#a0a0a0   labels KPI
#d4d4d4   corps recommandations, contenu cards
#e8e8e8   texte au hover
#f0f0f0   texte principal, titres

Accents sémantiques (jamais décor — toujours signification)
#a3e635   vert Otarcy — accent primaire, CTA, succès, score bon/excellent
#60a5fa   bleu — structure, features, opportunités, LinkedIn
#f97316   orange — warnings, Quick Wins, score moyen, menaces
#ef4444   rouge — erreurs, score critique, déconnexion hover
```

### CSS variables thème dark/light
Utiliser systématiquement les variables CSS là où elles existent :
```
var(--bg-page)      var(--bg-hero)     var(--bg-nav)
var(--border-2)     var(--border-3)
var(--text-1)       var(--text-2)      var(--text-3)     var(--text-4)    var(--text-5)
var(--accent)       var(--accent-fg)
```
Couleurs hardcodées réservées aux états sémantiques fixes (scores, statuts) qui ne changent pas avec le thème.

---

## Typographie — échelle complète

### Bebas Neue
```
clamp(5rem, 14vw, 11rem)    H1 hero landing
clamp(2.5rem, 5vw, 4.5rem)  H2 section landing
clamp(2rem, 4vw, 3rem)      Titre page dashboard
3.5rem                       Stats hero (chiffres clés)
2.2rem / 2rem                Stats KPI
1.4rem                       Hostname AuditCard
1.3rem / 1.2rem / 1.1rem     Titres cartes larges
1rem                         Titres cartes standard
0.95rem                      Titre critère modal
0.9rem / 0.88rem             Titres sections dashboard
0.85rem                      Numéros feature, scores barres
0.82rem                      Petit titre chart, score ring
```

### Raleway
```
0.88rem   paragraphe intro (lineHeight 1.9)
0.82rem   tagline hero (letterSpacing 0.22em)
0.78rem   corps recommandation (lineHeight 1.6, fontWeight 300)
0.76rem   corps standard (lineHeight 1.7, fontWeight 300)
0.72rem   corps secondaire, messages erreur
0.70rem   labels navbar
0.68rem   nom user sidebar
0.66rem   boutons CTA (letterSpacing 0.22em, fontWeight 600)
0.65rem   labels section accentués (letterSpacing 0.3em)
0.62rem   petits liens, mentions légales
0.60rem   footer, labels discrets, déconnexion
0.58rem   micro-labels uppercase (letterSpacing 0.3em)
0.56rem   date audit, audit count sidebar
0.54rem   labels KPI dashboard, hints, quota label
0.52rem   labels sidebar section, url-date, micro-meta
0.50rem   badge NEW, tag URL actif
```

---

## Espacement & Layout

```
Layout dashboard        → grid 260px sidebar + 1fr main
Sidebar padding         → 32px 20px
Main padding            → 40px 44px 80px
Landing section padding → 100px 60px
maxWidth landing        → 860px centré (margin: 0 auto)
maxWidth modal          → 760px

Gap cartes              → 16px standard, 12px compact
marginBottom cartes     → 16px entre cartes, 32px entre blocs
Padding carte standard  → 24px
Padding carte large     → 28px / 32px
Gap sidebar items       → 6px entre URL items, 24px entre sections
```

---

## Bordures & Fonds — patterns

```
Carte standard          → border: "1px solid #2a2a2a", background: var(--bg-hero)
Carte intérieure        → border: "1px solid #2a2a2a", background: "#161616"
Accentuée vert          → borderLeft: "2px solid #a3e635"
Accentuée bleue         → borderLeft: "2px solid #60a5fa"
Accentuée orange        → borderLeft: "2px solid #f97316"
CTA box                 → border: "1px solid #a3e635", background: "#0a0a0a"
Item actif sidebar      → border: "1px solid var(--accent)", background: "#0d0d0d"
Item inactif sidebar    → border: "1px solid #2a2a2a", background: "transparent"
Locked/grisé            → border: "1px dashed #2a2a2a"
Séparateur horizontal   → borderTop: "1px solid #2a2a2a"
Séparateur grille       → background: "#2a2a2a" (gap: 1px entre items)
```

---

## Boutons — code exact

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
  border: "1px solid #3a3a3a", background: "transparent", color: "#7a7a7a",
  cursor: "pointer", transition: "border-color 0.3s, color 0.3s",
}}
onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.color = "#e8e8e8"; }}
onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3a3a"; e.currentTarget.style.color = "#7a7a7a"; }}
```

### Bouton action compact
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase",
  padding: "4px 10px",
  border: "1px solid #3a3a3a", background: "transparent", color: "#7a7a7a",
  cursor: "pointer", transition: "color 0.2s, border-color 0.2s",
}}
onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a3e635"; e.currentTarget.style.color = "#a3e635"; }}
onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3a3a"; e.currentTarget.style.color = "#7a7a7a"; }}
```

### Bouton toggle (ouvert/fermé)
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

### Bouton copier (feedback vert)
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase",
  padding: "3px 8px",
  border: "1px solid #3a3a3a",
  background: copied ? "#a3e635" : "transparent",
  color: copied ? "#0f0f0f" : "#7a7a7a",
  cursor: "pointer", transition: "all 0.2s",
}}
```

### Bouton déconnexion (rouge hover)
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
  color: "#4a4a4a", background: "transparent", border: "none", cursor: "pointer",
  transition: "color 0.3s",
}}
onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}
```

---

## Labels & micro-textes — patterns

### Label section standard
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.58rem", letterSpacing: "0.3em",
  color: "var(--text-2)", textTransform: "uppercase", marginBottom: "14px",
}}
```

### Label section accentué vert
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.65rem", letterSpacing: "0.3em",
  color: "var(--accent)", textTransform: "uppercase",
  marginBottom: "16px", fontWeight: 500,
}}
```

### Badge statut (niveau audit)
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

---

## Composants récurrents — code exact

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

### Carte accentuée
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

### Header carte avec action droite
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

### Barre de progression KPI
```tsx
<div style={{ height: 2, background: "#2a2a2a", borderRadius: 2 }}>
  <div style={{
    height: 2,
    width: `${(value / max) * 100}%`,
    background: "var(--accent)",
    borderRadius: 2,
    transition: "width 0.8s ease",
  }} />
</div>
```

### Skeleton loading
```tsx
// CSS dans index.css :
// @keyframes skeleton-pulse { 0%{opacity:1} 50%{opacity:0.4} 100%{opacity:1} }
// .skeleton-pulse { animation: skeleton-pulse 1.5s ease-in-out infinite; }

<div className="skeleton-pulse" style={{ height: 11, width: 130, background: "#161616" }} />
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

### Score ring SVG
```tsx
// Paramètres : size (défaut 70), score (0-100)
// Couleur : ≥76 → #a3e635 | ≥56 → var(--text-1) | <56 → #ef4444
// strokeDashoffset animé pour l'entrée
```

---

## Animations & transitions

```
Reveal scroll       → opacity 0→1 + translateY(20px→0) sur 0.7s ease
                      className="reveal" → .visible via IntersectionObserver
Barre KPI           → width 0→x% sur 0.8s ease (au montage)
Hover bouton        → color/border-color sur 0.2s–0.3s
Sidebar item        → border-color sur 0.2s
Score ring          → stroke-dashoffset sur 1s cubic-bezier(.22,1,.36,1)
Skeleton            → opacity pulse 1.5s ease-in-out infinite
Quota bar           → width sur 0.6s ease
```

CSS requis dans `index.css` :
```css
.reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }
@keyframes skeleton-pulse { 0%{opacity:1} 50%{opacity:0.4} 100%{opacity:1} }
.skeleton-pulse { animation: skeleton-pulse 1.5s ease-in-out infinite; }
```

---

## Graphiques SVG (internes — pas de lib externe)

### ScoreEvolutionChart
- SVG viewBox `0 0 620 130`, `preserveAspectRatio="xMidYMid meet"`
- Grilles horizontales : `stroke="#1a1a1a"` à y=0, 50, 100
- Ligne : `stroke="#a3e635"` strokeWidth 1.5, strokeLinejoin "round"
- Area fill : gradient linéaire #a3e635 opacity 0.12 → 0
- Points : cercle r=3 fill `#0f0f0f` stroke `#a3e635` — dernier point r=4 fill `#a3e635`
- Labels Y : fill `#3a3a3a`, fontSize 8
- Labels X + scores : Bebas Neue fontSize 9–10, dernier en `#a3e635`

### CriteriaDonut
- SVG 78×78, cercle r=28, strokeWidth=9
- Track : `stroke="#1a1a1a"`
- Segments : strokeDasharray calculé depuis (max_critere/total)*circonférence
- Couleurs par index : `["#a3e635", "#60a5fa", "#f97316", "#4a4a4a", "#7a7a7a"]`
- Centre : score Bebas 14px `#f0f0f0` + `/max` Raleway 6px `#4a4a4a`

### MiniSparkline (inline dans liste)
- Barres width=4, height=% du max, gap=2, alignItems flex-end
- Dernière barre : `#a3e635` — précédentes : `#2a2a2a`
- Hauteur conteneur : 22px

---

## Niveaux de score — couleurs sémantiques

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

## Checklist avant de soumettre un composant

- [ ] Toutes les couleurs utilisent les CSS variables ou la palette définie
- [ ] Aucun `borderRadius` sauf `2px` sur les barres
- [ ] Toutes les polices déclarées explicitement
- [ ] `textTransform: "uppercase"` sur chaque label/bouton/badge
- [ ] `fontWeight: 300` sur le corps de texte Raleway
- [ ] Skeleton présent sur tous les états de chargement
- [ ] Hover states sur tous les éléments cliquables
- [ ] Transitions ≤ 0.4s
- [ ] Aucun box-shadow
- [ ] fallback visuel propre si données vides

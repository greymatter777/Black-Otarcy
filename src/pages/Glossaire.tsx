import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ─── HOOK REVEAL ──────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.05 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── TERMES ───────────────────────────────────────────────────────────────────
const TERMES = [
  {
    lettre: "A",
    items: [
      { terme: "AIO (AI Optimization)", definition: "Discipline qui consiste à optimiser la visibilité d'une marque, d'une entreprise ou d'un contenu dans les réponses générées par les intelligences artificielles conversationnelles. L'AIO est à ChatGPT ce que le SEO est à Google." },
      { terme: "AI Optimization", definition: "Terme anglais désignant l'AIO. Processus d'optimisation des signaux numériques d'une marque pour être mieux compris, mémorisé et cité par les modèles de langage (LLM)." },
      { terme: "Audit AIO", definition: "Analyse complète de la visibilité d'une marque auprès des intelligences artificielles. Un audit AIO produit un score, une analyse des forces et faiblesses, et un plan d'action priorisé." },
      { terme: "Autorité thématique", definition: "Niveau de confiance qu'un LLM accorde à une source sur un sujet donné. Plus une marque publie du contenu de référence sur un sujet, plus son autorité thématique sur ce sujet est forte aux yeux des IAs." },
    ]
  },
  {
    lettre: "C",
    items: [
      { terme: "Citation IA", definition: "Fait pour une IA de mentionner ou recommander une marque dans sa réponse à une requête utilisateur. Les citations IA sont l'équivalent des clics organiques Google dans l'écosystème AIO." },
      { terme: "Cohérence des signaux", definition: "Alignement entre les informations publiées sur une marque à travers ses différentes sources (site web, LinkedIn, presse, annuaires). Un LLM construit sa représentation d'une marque en croisant ces sources — l'incohérence crée du flou." },
      { terme: "Contenu crawlable", definition: "Contenu textuel accessible directement dans le HTML d'une page, sans nécessiter l'exécution de JavaScript. Les LLMs crawlent les pages en mode statique — un contenu rendu uniquement par JS peut ne pas être indexé." },
    ]
  },
  {
    lettre: "E",
    items: [
      { terme: "Entité nommée", definition: "Concept, personne, organisation ou lieu identifié de façon non ambiguë par un LLM. Otarcy est une entité nommée. Plus une entité est cohérente et présente dans de nombreuses sources, plus elle est solide dans le modèle." },
      { terme: "E-E-A-T", definition: "Experience, Expertise, Authoritativeness, Trustworthiness. Signaux de qualité initialement définis par Google, désormais utilisés par les LLMs pour évaluer la fiabilité d'une source. Fondamental pour l'AIO." },
    ]
  },
  {
    lettre: "G",
    items: [
      { terme: "Génération augmentée par récupération (RAG)", definition: "Technique par laquelle un LLM récupère des informations externes en temps réel avant de générer sa réponse. Perplexity et ChatGPT avec recherche web utilisent le RAG — votre contenu doit être optimisé pour être sélectionné." },
      { terme: "Gaps de contenu", definition: "Sujets ou questions liés à votre marque ou secteur pour lesquels vous ne produisez pas de contenu. Un gap de contenu = une opportunité de citation IA manquée." },
    ]
  },
  {
    lettre: "L",
    items: [
      { terme: "LLM (Large Language Model)", definition: "Modèle de langage de grande taille entraîné sur d'immenses corpus de textes. ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google) et Llama (Meta) sont des LLMs. Ils constituent le moteur des IAs conversationnelles." },
      { terme: "LLM Visibility", definition: "Mesure de la présence et de la qualité de représentation d'une marque dans les réponses des LLMs. L'AIO vise à maximiser la LLM Visibility." },
    ]
  },
  {
    lettre: "P",
    items: [
      { terme: "Perplexity", definition: "Moteur de recherche basé sur l'IA qui génère des réponses avec citations directes de sources web. Avec 15M+ d'utilisateurs actifs en 2025, Perplexity est un canal d'acquisition critique pour les marques optimisées AIO." },
      { terme: "Phrase de positionnement AIO-ready", definition: "Phrase courte et précise décrivant une marque en une seule affirmation vérifiable. Format recommandé : « [Marque] est [catégorie] qui aide [client] à [résultat] grâce à [différenciateur], basé(e) à [lieu]. » Cette phrase doit être identique sur toutes les sources." },
      { terme: "PME (Petite et Moyenne Entreprise)", definition: "Entreprise de 5 à 250 employés. Cible principale d'Otarcy. Les PME sont les premières victimes de l'invisibilité IA — elles n'ont ni les ressources des grands groupes ni la notoriété naturelle des startups médiatisées." },
    ]
  },
  {
    lettre: "R",
    items: [
      { terme: "Référencement IA", definition: "Terme français désignant l'AIO. Ensemble des pratiques visant à améliorer la position et la fréquence de citation d'une marque dans les réponses des intelligences artificielles." },
      { terme: "RAG (voir Génération augmentée par récupération)", definition: "Voir Génération augmentée par récupération." },
    ]
  },
  {
    lettre: "S",
    items: [
      { terme: "Schema.org", definition: "Vocabulaire de balisage structuré (JSON-LD) permettant de communiquer explicitement aux moteurs de recherche et aux LLMs la nature d'une entité. Un balisage Schema.org Organization indique à une IA : voici qui est cette entreprise, ce qu'elle fait, où elle est basée." },
      { terme: "Score AIO", definition: "Indicateur chiffré (sur 10 chez Otarcy) mesurant la visibilité et la qualité de représentation d'une marque auprès des IAs. Calculé en analysant la clarté de positionnement, la cohérence des sources, la densité de contenu et la présence multi-plateformes." },
      { terme: "SEO (Search Engine Optimization)", definition: "Discipline d'optimisation pour les moteurs de recherche traditionnels, principalement Google. Le SEO optimise pour les algorithmes de classement de liens — l'AIO optimise pour la compréhension sémantique des LLMs. Les deux sont complémentaires." },
      { terme: "SWOT AIO", definition: "Analyse Strengths / Weaknesses / Opportunities / Threats appliquée à la visibilité IA d'une marque. Otarcy génère automatiquement un SWOT AIO à partir de l'audit de marque." },
    ]
  },
  {
    lettre: "V",
    items: [
      { terme: "Visibilité IA", definition: "Capacité d'une marque à apparaître dans les réponses générées par les intelligences artificielles lorsqu'un utilisateur pose une question liée à son secteur, ses produits ou ses services." },
      { terme: "Vectorisation", definition: "Processus par lequel un LLM transforme un texte en représentation numérique (vecteur) pour le stocker dans sa mémoire. Un contenu bien structuré, avec des entités claires et des affirmations précises, se vectorise mieux et est plus facilement récupéré." },
    ]
  },
];

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function Glossaire() {
  const [recherche, setRecherche] = useState("");
  const [lettreActive, setLettreActive] = useState<string | null>(null);
  useReveal();

  const lettres = TERMES.map((g) => g.lettre);

  const termesFiltres = recherche
    ? TERMES.map((g) => ({
        ...g,
        items: g.items.filter(
          (item) =>
            item.terme.toLowerCase().includes(recherche.toLowerCase()) ||
            item.definition.toLowerCase().includes(recherche.toLowerCase())
        ),
      })).filter((g) => g.items.length > 0)
    : lettreActive
    ? TERMES.filter((g) => g.lettre === lettreActive)
    : TERMES;

  const totalTermes = TERMES.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>

      {/* Schema.org DefinedTermSet */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            "@id": "https://otarcy.app/glossaire#termset",
            "name": "Glossaire AIO — Otarcy",
            "description": "Glossaire complet des termes de l'AI Optimization (AIO) par Otarcy, la référence française du référencement IA pour les PME.",
            "url": "https://otarcy.app/glossaire",
            "inLanguage": "fr",
            "publisher": {
              "@type": "Organization",
              "name": "Otarcy",
              "url": "https://otarcy.app"
            },
            "hasDefinedTerm": TERMES.flatMap((g) =>
              g.items.map((item) => ({
                "@type": "DefinedTerm",
                "name": item.terme,
                "description": item.definition,
                "inDefinedTermSet": "https://otarcy.app/glossaire#termset",
              }))
            ),
          }),
        }}
      />

      <Navbar />

      {/* ── HERO ── */}
      <section style={{ paddingTop: "140px", paddingBottom: "60px", padding: "140px 60px 60px", borderBottom: "1px solid var(--border-1)" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }}>
            Ressource — Glossaire
          </p>
          <h1 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "0.06em", color: "var(--text-1)", lineHeight: 0.95, marginBottom: "24px" }}>
            GLOSSAIRE AIO
          </h1>
          <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.9, fontWeight: 300, maxWidth: "580px", marginBottom: "0" }}>
            {totalTermes} termes essentiels pour comprendre l'AI Optimization et optimiser la visibilité de votre marque auprès de ChatGPT, Claude, Gemini et Perplexity.
          </p>
        </div>
      </section>

      {/* ── RECHERCHE + FILTRE ── */}
      <section style={{ padding: "40px 60px", borderBottom: "1px solid var(--border-1)", background: "var(--bg-page)" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>

          {/* Barre de recherche */}
          <div style={{ display: "flex", border: "1px solid var(--border-2)", marginBottom: "24px", background: "var(--bg-input-nl)" }}>
            <span style={{ padding: "12px 16px", color: "var(--text-3)", fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem" }}>⌕</span>
            <input
              type="text"
              placeholder="Rechercher un terme..."
              value={recherche}
              onChange={(e) => { setRecherche(e.target.value); setLettreActive(null); }}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                padding: "12px 0", color: "var(--text-1)", fontSize: "0.76rem",
                fontFamily: "'Raleway', sans-serif", caretColor: "var(--accent)",
              }}
            />
            {recherche && (
              <button type="button" onClick={() => setRecherche("")}
                style={{ padding: "12px 16px", background: "transparent", border: "none", color: "var(--text-3)", cursor: "pointer", fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem" }}>
                ✕
              </button>
            )}
          </div>

          {/* Filtre par lettre */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button type="button"
              onClick={() => { setLettreActive(null); setRecherche(""); }}
              style={{
                fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.15em",
                padding: "4px 12px", border: "1px solid", cursor: "pointer", transition: "all 0.2s",
                background: !lettreActive && !recherche ? "var(--accent)" : "transparent",
                borderColor: !lettreActive && !recherche ? "var(--accent)" : "var(--border-3)",
                color: !lettreActive && !recherche ? "var(--bg-primary)" : "var(--text-2)",
              }}>
              TOUS
            </button>
            {lettres.map((l) => (
              <button key={l} type="button"
                onClick={() => { setLettreActive(l === lettreActive ? null : l); setRecherche(""); }}
                style={{
                  fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.1em",
                  padding: "2px 10px", border: "1px solid", cursor: "pointer", transition: "all 0.2s",
                  background: lettreActive === l ? "var(--accent)" : "transparent",
                  borderColor: lettreActive === l ? "var(--accent)" : "var(--border-3)",
                  color: lettreActive === l ? "var(--bg-primary)" : "var(--text-2)",
                }}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── TERMES ── */}
      <section style={{ padding: "60px 60px 100px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>

          {termesFiltres.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "var(--text-3)" }}>
                Aucun terme trouvé pour « {recherche} »
              </p>
            </div>
          ) : (
            termesFiltres.map((groupe) => (
              <div key={groupe.lettre} className="reveal" style={{ marginBottom: "48px" }}>
                {/* Lettre */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", color: "var(--accent)", lineHeight: 1 }}>
                    {groupe.lettre}
                  </span>
                  <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, var(--border-2) 0%, transparent 100%)" }} />
                </div>

                {/* Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-1)" }}>
                  {groupe.items.map((item, i) => (
                    <div key={i} style={{ background: "var(--bg-page)", padding: "20px 24px" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#111"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#0f0f0f"; }}
                    >
                      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "var(--text-1)", fontWeight: 600, marginBottom: "8px", letterSpacing: "0.02em" }}>
                        {item.terme}
                      </p>
                      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "var(--text-2)", lineHeight: 1.8, fontWeight: 300 }}>
                        {item.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {/* CTA bas de page */}
          <div className="reveal" style={{ marginTop: "60px", padding: "32px", border: "1px solid var(--accent)", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
            <div>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.08em", color: "var(--text-1)", marginBottom: "6px" }}>
                TESTEZ VOTRE SCORE AIO
              </p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "var(--text-2)", fontWeight: 300 }}>
                Découvrez comment ChatGPT, Claude et Gemini perçoivent votre marque.
              </p>
            </div>
            <Link to="/#audit"
              style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "12px 28px", background: "var(--accent)", color: "var(--bg-page)", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Auditer ma marque →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

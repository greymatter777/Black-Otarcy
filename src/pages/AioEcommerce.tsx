import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ─── Schema.org JSON-LD ───────────────────────────────────────────────────────
const schemaJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Pourquoi mon e-commerce n'apparaît-il pas dans les recommandations de ChatGPT ou Perplexity ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les IAs comme ChatGPT et Perplexity privilégient les marques e-commerce qui ont une identité claire, des avis clients structurés, des descriptions produits riches en entités sémantiques et un Schema.org Product ou Organization bien renseigné. Un site techniquement performant mais pauvre en signaux AIO reste invisible dans les réponses des intelligences artificielles.",
          },
        },
        {
          "@type": "Question",
          name: "Qu'est-ce que l'AIO pour un e-commerce ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "L'AI Optimization (AIO) pour un e-commerce consiste à structurer les fiches produits, les pages catégories, les avis clients et l'identité de marque pour être reconnu et cité par les IAs génératives. Quand un utilisateur demande à ChatGPT 'quelle est la meilleure marque de X ?', une boutique AIO-optimisée a une chance d'apparaître dans la réponse.",
          },
        },
        {
          "@type": "Question",
          name: "Quels sont les signaux AIO prioritaires pour un e-commerce ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les signaux AIO prioritaires pour un e-commerce sont : un Schema.org Product avec prix, disponibilité et avis, une page marque structurée en Q&A, des descriptions produits avec entités sémantiques explicites (matière, origine, usage, différenciateur), des avis clients avec résultats concrets, et une présence cohérente sur les plateformes que les IAs crawlent (site, LinkedIn, presse spécialisée).",
          },
        },
        {
          "@type": "Question",
          name: "L'AIO remplace-t-il le SEO pour un e-commerce ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non, l'AIO complète le SEO sans le remplacer. Le SEO optimise pour Google, l'AIO optimise pour les IAs génératives. En 2025-2026, de plus en plus d'acheteurs utilisent ChatGPT ou Perplexity pour se renseigner avant d'acheter. Un e-commerce sans stratégie AIO perd ces prospects au profit de concurrents mieux structurés.",
          },
        },
      ],
    },
    {
      "@type": "WebPage",
      name: "AIO pour les E-commerces — Otarcy",
      description:
        "Guide complet d'AI Optimization pour les boutiques e-commerce. Apparaissez dans les recommandations de ChatGPT, Perplexity et Claude quand vos clients cherchent vos produits.",
      url: "https://otarcy.app/aio-ecommerce",
      publisher: {
        "@type": "Organization",
        name: "Otarcy",
        url: "https://otarcy.app",
      },
    },
  ],
};

// ─── Hook reveal ─────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) (e.target as HTMLElement).classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const problemSignals = [
  {
    icon: "🛒",
    color: "#f97316",
    titre: "Fiches produits riches visuellement, pauvres sémantiquement",
    description:
      "Des photos soignées et un design pro ne suffisent pas aux IAs. ChatGPT a besoin d'entités textuelles explicites : matière, origine, usage, différenciateur. Sans ça, votre produit est inexistant dans ses réponses.",
  },
  {
    icon: "⭐",
    color: "#60a5fa",
    titre: "Avis clients non structurés pour les IAs",
    description:
      "Vos avis sont sur Trustpilot ou Google mais rarement balisés en Schema.org Review sur votre site. Résultat : les IAs ne peuvent pas les lire et ne peuvent pas vous citer comme marque de confiance.",
  },
  {
    icon: "🏷️",
    color: "#ef4444",
    titre: "Identité de marque floue pour les moteurs d'IA",
    description:
      "Quand un client demande à Perplexity 'quelle marque de X choisir ?', l'IA cherche une entité claire avec positionnement, valeurs et preuves. Une boutique sans page marque structurée ne sera jamais citée.",
  },
];

const quickWins = [
  {
    numero: "01",
    titre: "Structurer vos fiches produits avec Schema.org Product",
    detail:
      "Ajoutez un JSON-LD Product sur chaque fiche : nom, description, prix, disponibilité, marque, avis agrégés. C'est le signal le plus direct pour que ChatGPT cite vos produits dans ses recommandations.",
    duree: "2-4h",
    impact: "Très élevé",
    impactColor: "var(--accent)",
  },
  {
    numero: "02",
    titre: "Créer une page Marque structurée en Q&A",
    detail:
      "Une page dédiée qui répond explicitement à : Qui êtes-vous ? Qu'est-ce qui vous différencie ? Pour qui ? Fabriqué où ? Avec quoi ? Les IAs utilisent ces pages pour construire leurs réponses sur votre secteur.",
    duree: "3h",
    impact: "Élevé",
    impactColor: "var(--accent)",
  },
  {
    numero: "03",
    titre: "Réécrire les descriptions produits avec entités sémantiques",
    detail:
      "Chaque description doit nommer explicitement : matière, origine géographique, usage principal, cas d'usage secondaires, différenciateur vs concurrents. Les IAs lisent le texte — donnez-leur les entités dont elles ont besoin.",
    duree: "1h/produit",
    impact: "Élevé",
    impactColor: "var(--accent)",
  },
  {
    numero: "04",
    titre: "Intégrer vos avis en Schema.org Review sur votre site",
    detail:
      "Ne laissez pas vos avis uniquement sur des plateformes tierces. Intégrez-les sur votre site avec le balisage Schema.org Review et AggregateRating. Les IAs peuvent alors les lire et les citer comme preuves sociales.",
    duree: "2h",
    impact: "Moyen",
    impactColor: "#f97316",
  },
  {
    numero: "05",
    titre: "Créer du contenu blog orienté questions acheteurs",
    detail:
      "Identifiez les questions que vos clients posent à ChatGPT avant d'acheter (ex: 'quelle différence entre X et Y ?', 'comment choisir un bon Z ?'). Créez un article pour chacune. Vous devenez la source que l'IA cite.",
    duree: "3h/article",
    impact: "Très élevé",
    impactColor: "var(--accent)",
  },
];

const faqItems = [
  {
    question: "Pourquoi mon e-commerce n'apparaît pas dans les recommandations IA ?",
    reponse:
      "Les IAs comme ChatGPT et Perplexity privilégient les marques e-commerce qui ont une identité claire, des avis clients structurés, des descriptions produits riches en entités sémantiques et un Schema.org Product bien renseigné. Un site techniquement performant mais pauvre en signaux AIO reste invisible dans les réponses des intelligences artificielles.",
  },
  {
    question: "Qu'est-ce que l'AIO pour un e-commerce ?",
    reponse:
      "L'AI Optimization pour un e-commerce consiste à structurer les fiches produits, les pages catégories, les avis clients et l'identité de marque pour être reconnu et cité par les IAs génératives. Quand un utilisateur demande à ChatGPT 'quelle est la meilleure marque de X ?', une boutique AIO-optimisée a une chance d'apparaître dans la réponse.",
  },
  {
    question: "Quels signaux AIO sont prioritaires pour un e-commerce ?",
    reponse:
      "Les signaux AIO prioritaires : un Schema.org Product avec prix, disponibilité et avis, une page marque structurée en Q&A, des descriptions produits avec entités sémantiques explicites (matière, origine, usage, différenciateur), des avis clients avec résultats concrets, et une présence cohérente sur les plateformes que les IAs crawlent.",
  },
  {
    question: "L'AIO remplace-t-il le SEO pour un e-commerce ?",
    reponse:
      "Non, l'AIO complète le SEO sans le remplacer. Le SEO optimise pour Google, l'AIO optimise pour les IAs génératives. En 2025-2026, de plus en plus d'acheteurs utilisent ChatGPT ou Perplexity pour se renseigner avant d'acheter. Un e-commerce sans stratégie AIO perd ces prospects au profit de concurrents mieux structurés.",
  },
];

const auditExemple = {
  marque: "Atelier Lumin — Bougies artisanales françaises",
  score: 2.8,
  lacunes: [
    "Aucun Schema.org Product sur les fiches",
    "Descriptions produits sans entités sémantiques",
    "Avis Trustpilot non intégrés sur le site",
    "Aucune page marque structurée",
  ],
  apresOptimisation: 6.9,
  actionsRealisees: [
    "Schema.org Product sur les 12 fiches phares",
    "Descriptions réécrites avec entités (cire végétale française, Grasse, durée de combustion...)",
    "Schema.org Review intégré sur le site",
    "Page Marque en Q&A (6 questions / réponses)",
  ],
};

const autresSecteurs = [
  { label: "Coaching", to: "/aio-coaching" },
  { label: "Immobilier", to: "/aio-immobilier" },
  { label: "Restauration", to: "/aio-restauration" },
  { label: "Conseil RH", to: "/aio-rh" },
  { label: "Santé & Bien-être", to: "/aio-sante" },
];

// ─── Composant FAQ accordion ──────────────────────────────────────────────────
function FaqAccordion({ items }: { items: typeof faqItems }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} style={{ borderTop: "1px solid var(--border-2)", padding: "16px 0" }}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                gap: "16px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.82rem",
                  color: "var(--text-1)",
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                {item.question}
              </span>
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.2rem",
                  color: isOpen ? "var(--accent)" : "var(--text-3)",
                  flexShrink: 0,
                  transition: "color 0.2s",
                }}
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <p
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.78rem",
                  color: "var(--text-4)",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  marginTop: "12px",
                  paddingRight: "24px",
                }}
              >
                {item.reponse}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function AioEcommerce() {
  useReveal();

  return (
    <div
      style={{
        background: "var(--bg-primary)",
        minHeight: "100vh",
        color: "var(--text-1)",
        fontFamily: "'Raleway', sans-serif",
      }}
    >
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      <Navbar />

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 60px 80px", maxWidth: "860px", margin: "0 auto" }}>
        <p
          className="reveal"
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.3em",
            color: "var(--accent)",
            textTransform: "uppercase",
            marginBottom: "24px",
            fontWeight: 500,
          }}
        >
          Secteur — E-commerce
        </p>

        <h1
          className="reveal"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
            letterSpacing: "0.04em",
            lineHeight: 1.05,
            color: "var(--text-1)",
            marginBottom: "32px",
          }}
        >
          AIO pour les
          <br />
          <span style={{ color: "var(--accent)" }}>E-commerces</span>
        </h1>

        <p
          className="reveal"
          style={{
            fontSize: "0.88rem",
            color: "var(--text-4)",
            lineHeight: 1.9,
            fontWeight: 300,
            maxWidth: "600px",
            marginBottom: "40px",
          }}
        >
          Vos clients ne cherchent plus seulement sur Google. Ils demandent
          directement à ChatGPT ou Perplexity : "quelle est la meilleure marque
          de X ?" Si votre boutique n'est pas structurée pour les IAs, vous
          n'existez pas dans leur réponse — et votre concurrent si.
        </p>

        <div className="reveal" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link to="/#audit">
            <button
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.66rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                padding: "13px 32px",
                background: "var(--accent)",
                color: "var(--bg-page)",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Auditer ma boutique →
            </button>
          </Link>
          <Link to="/glossaire">
            <button
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.66rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                padding: "13px 32px",
                border: "1px solid var(--border-3)",
                background: "transparent",
                color: "var(--text-2)",
                cursor: "pointer",
                transition: "border-color 0.3s, color 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--text-5)";
                e.currentTarget.style.color = "var(--text-5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-3)";
                e.currentTarget.style.color = "var(--text-2)";
              }}
            >
              Glossaire AIO
            </button>
          </Link>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "60px",
          maxWidth: "860px",
          margin: "0 auto",
          borderTop: "1px solid var(--border-2)",
          borderBottom: "1px solid var(--border-2)",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            { chiffre: "61%", label: "des acheteurs consultent une IA avant d'acheter en ligne" },
            { chiffre: "4×", label: "plus de chances d'être cité avec Schema.org Product actif" },
            { chiffre: "8 sem.", label: "pour doubler son score AIO avec les bons ajustements" },
          ].map((stat, i) => (
            <div
              key={i}
              className="reveal"
              style={{ padding: "24px", border: "1px solid var(--border-2)", background: "var(--bg-page)" }}
            >
              <p
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "3.5rem",
                  color: "var(--accent)",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                {stat.chiffre}
              </p>
              <p style={{ fontSize: "0.72rem", color: "var(--text-2)", lineHeight: 1.5, fontWeight: 300 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROBLÈME ────────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 60px", maxWidth: "860px", margin: "0 auto" }}>
        <p
          className="reveal"
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.3em",
            color: "var(--accent)",
            textTransform: "uppercase",
            marginBottom: "16px",
            fontWeight: 500,
          }}
        >
          .01 — Le problème
        </p>
        <h2
          className="reveal"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            letterSpacing: "0.04em",
            color: "var(--text-1)",
            marginBottom: "48px",
            lineHeight: 1.1,
          }}
        >
          Pourquoi les IAs ignorent
          <br />
          la plupart des boutiques
        </h2>

        <div style={{ display: "grid", gap: "16px" }}>
          {problemSignals.map((item, i) => (
            <div
              key={i}
              className="reveal"
              style={{
                padding: "28px",
                border: "1px solid var(--border-2)",
                background: "var(--bg-page)",
                borderLeft: `2px solid ${item.color}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "1.1rem",
                      letterSpacing: "0.06em",
                      color: "var(--text-1)",
                      marginBottom: "10px",
                    }}
                  >
                    {item.titre}
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-4)", lineHeight: 1.7, fontWeight: 300 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AUDIT EXEMPLE ───────────────────────────────────────────────── */}
      <section style={{ padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }}>
        <p
          className="reveal"
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.3em",
            color: "var(--accent)",
            textTransform: "uppercase",
            marginBottom: "16px",
            fontWeight: 500,
          }}
        >
          .02 — Exemple concret
        </p>
        <h2
          className="reveal"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            letterSpacing: "0.04em",
            color: "var(--text-1)",
            marginBottom: "40px",
            lineHeight: 1.1,
          }}
        >
          Un audit réel,
          <br />
          avant et après AIO
        </h2>

        <div className="reveal" style={{ padding: "28px", border: "1px solid var(--border-2)", background: "var(--bg-page)" }}>
          <p
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "0.58rem",
              letterSpacing: "0.3em",
              color: "var(--text-2)",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Cas anonymisé — {auditExemple.marque}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div
              style={{
                padding: "20px",
                background: "var(--bg-hero)",
                border: "1px solid var(--border-2)",
                borderLeft: "2px solid #ef4444",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "var(--text-1)" }}>
                  AVANT
                </p>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#ef4444" }}>
                  {auditExemple.score}
                  <span style={{ fontSize: "0.9rem", color: "var(--text-3)" }}>/10</span>
                </p>
              </div>
              {auditExemple.lacunes.map((l, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }}>
                  <span style={{ color: "#ef4444", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }}>✕</span>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-2)", lineHeight: 1.5, fontWeight: 300 }}>
                    {l}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                padding: "20px",
                background: "var(--bg-hero)",
                border: "1px solid var(--border-2)",
                borderLeft: "2px solid var(--accent)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "var(--text-1)" }}>
                  APRÈS
                </p>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "var(--accent)" }}>
                  {auditExemple.apresOptimisation}
                  <span style={{ fontSize: "0.9rem", color: "var(--text-3)" }}>/10</span>
                </p>
              </div>
              {auditExemple.actionsRealisees.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }}>
                  <span style={{ color: "var(--accent)", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }}>→</span>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-4)", lineHeight: 1.5, fontWeight: 300 }}>
                    {a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "0.62rem",
              color: "var(--text-3)",
              fontStyle: "italic",
              borderTop: "1px solid var(--border-2)",
              paddingTop: "14px",
              marginTop: "16px",
            }}
          >
            💡 Résultat obtenu en 6 semaines avec les quick wins ci-dessous. Données issues d'un audit Otarcy réel, marque anonymisée.
          </p>
        </div>
      </section>

      {/* ── QUICK WINS ──────────────────────────────────────────────────── */}
      <section style={{ padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }}>
        <p
          className="reveal"
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.3em",
            color: "var(--accent)",
            textTransform: "uppercase",
            marginBottom: "16px",
            fontWeight: 500,
          }}
        >
          .03 — Quick Wins
        </p>
        <h2
          className="reveal"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            letterSpacing: "0.04em",
            color: "var(--text-1)",
            marginBottom: "40px",
            lineHeight: 1.1,
          }}
        >
          5 actions concrètes
          <br />
          pour être recommandé par les IAs
        </h2>

        <div style={{ display: "grid", gap: "16px" }}>
          {quickWins.map((qw, i) => (
            <div
              key={i}
              className="reveal"
              style={{ padding: "24px", border: "1px solid var(--border-2)", background: "var(--bg-page)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "0.85rem",
                      letterSpacing: "0.15em",
                      color: "var(--accent)",
                    }}
                  >
                    {qw.numero}
                  </span>
                  <p
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "1.1rem",
                      letterSpacing: "0.06em",
                      color: "var(--text-1)",
                    }}
                  >
                    {qw.titre}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <span
                    style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: "0.58rem",
                      letterSpacing: "0.1em",
                      color: "var(--text-2)",
                      padding: "2px 8px",
                      border: "1px solid var(--border-2)",
                    }}
                  >
                    {qw.duree}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: "0.58rem",
                      letterSpacing: "0.1em",
                      color: qw.impactColor,
                      padding: "2px 8px",
                      border: `1px solid ${qw.impactColor}`,
                    }}
                  >
                    {qw.impact}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-4)", lineHeight: 1.7, fontWeight: 300 }}>
                {qw.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }}>
        <p
          className="reveal"
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.3em",
            color: "var(--accent)",
            textTransform: "uppercase",
            marginBottom: "16px",
            fontWeight: 500,
          }}
        >
          .04 — Questions fréquentes
        </p>
        <h2
          className="reveal"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            letterSpacing: "0.04em",
            color: "var(--text-1)",
            marginBottom: "40px",
            lineHeight: 1.1,
          }}
        >
          AIO & E-commerce —
          <br />
          tout ce qu'il faut savoir
        </h2>

        <div
          className="reveal"
          style={{ padding: "24px 28px", border: "1px solid var(--border-2)", background: "var(--bg-page)" }}
        >
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────────────── */}
      <section style={{ padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }}>
        <div
          className="reveal"
          style={{ padding: "48px", border: "1px solid var(--accent)", background: "var(--bg-primary)" }}
        >
          <p
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              color: "var(--accent)",
              textTransform: "uppercase",
              marginBottom: "16px",
              fontWeight: 500,
            }}
          >
            Passez à l'action
          </p>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "0.04em",
              color: "var(--text-1)",
              marginBottom: "16px",
              lineHeight: 1.1,
            }}
          >
            Découvrez le score AIO
            <br />
            de votre boutique
          </h2>
          <p
            style={{
              fontSize: "0.78rem",
              color: "var(--text-2)",
              lineHeight: 1.7,
              fontWeight: 300,
              marginBottom: "32px",
              maxWidth: "480px",
            }}
          >
            Otarcy analyse votre e-commerce et vous donne un score AIO + des
            recommandations concrètes pour apparaître dans les réponses de
            ChatGPT, Perplexity et Claude quand vos clients cherchent vos
            produits.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link to="/#audit">
              <button
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.66rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  padding: "13px 32px",
                  background: "var(--accent)",
                  color: "var(--bg-page)",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Lancer mon audit gratuit →
              </button>
            </Link>
            <Link to="/pricing">
              <button
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.66rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  padding: "13px 32px",
                  border: "1px solid var(--border-3)",
                  background: "transparent",
                  color: "var(--text-2)",
                  cursor: "pointer",
                  transition: "border-color 0.3s, color 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--text-5)";
                  e.currentTarget.style.color = "var(--text-5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-3)";
                  e.currentTarget.style.color = "var(--text-2)";
                }}
              >
                Voir les offres
              </button>
            </Link>
          </div>
        </div>

        {/* Liens secteurs connexes */}
        <div className="reveal" style={{ marginTop: "40px" }}>
          <p
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "0.58rem",
              letterSpacing: "0.3em",
              color: "var(--text-3)",
              textTransform: "uppercase",
              marginBottom: "14px",
            }}
          >
            Autres secteurs
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {autresSecteurs.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.62rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--text-3)",
                  padding: "6px 14px",
                  border: "1px solid var(--border-2)",
                  textDecoration: "none",
                  transition: "color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-3)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-2)";
                }}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

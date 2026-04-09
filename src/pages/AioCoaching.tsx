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
          name: "Pourquoi les coachs et formateurs sont-ils invisibles auprès des IAs comme ChatGPT ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les coachs et formateurs publient beaucoup sur les réseaux sociaux mais structurent rarement leur contenu pour les moteurs d'IA. ChatGPT, Perplexity et Claude cherchent des entités claires, des données structurées et des preuves d'autorité thématique. Sans ces signaux, même un expert reconnu reste invisible dans les réponses des IAs.",
          },
        },
        {
          "@type": "Question",
          name: "Qu'est-ce que l'AIO pour un coach ou un formateur ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "L'AI Optimization (AIO) pour le coaching consiste à structurer sa marque personnelle, ses offres et son contenu pour être reconnu et cité par les intelligences artificielles génératives. Cela inclut la structuration des données Schema.org, la création de contenu en Q&A explicite, et l'optimisation de la présence sur les plateformes que les IAs crawlent.",
          },
        },
        {
          "@type": "Question",
          name: "Quels sont les signaux AIO les plus importants pour un professionnel du coaching ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les signaux AIO prioritaires pour un coach ou formateur sont : une page À propos structurée en Q&A avec entités nommées, des témoignages clients avec résultats chiffrés, un Schema.org Person ou Organization bien renseigné, une présence cohérente sur LinkedIn avec publications régulières et structurées, et un site web avec contenu long-form optimisé pour les questions que posent les clients aux IAs.",
          },
        },
        {
          "@type": "Question",
          name: "En combien de temps un coach peut-il améliorer son score AIO ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Avec les bons ajustements, un professionnel du coaching peut voir une amélioration mesurable de son score AIO en 4 à 8 semaines. Les quick wins comme la structuration de la page À propos, l'ajout de Schema.org et la restructuration des posts LinkedIn produisent des résultats en moins de 2 semaines.",
          },
        },
      ],
    },
    {
      "@type": "WebPage",
      name: "AIO pour les Coachs et Formateurs — Otarcy",
      description:
        "Guide complet d'AI Optimization pour les coachs, formateurs et consultants. Devenez visible auprès de ChatGPT, Perplexity et Claude.",
      url: "https://otarcy.app/aio-coaching",
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
    icon: "⚡",
    color: "#f97316",
    titre: "Contenu abondant, structure absente",
    description:
      "Les coachs publient quotidiennement mais leur contenu est optimisé pour l'algorithme Instagram ou LinkedIn — pas pour les IAs. Résultat : zéro citation dans ChatGPT malgré des années d'expertise.",
  },
  {
    icon: "🔍",
    color: "#60a5fa",
    titre: "Marque personnelle non balisée",
    description:
      "ChatGPT cherche des entités claires : nom, spécialité, résultats mesurables, zone géographique. Sans ces balises structurées, votre expertise reste invisible pour les moteurs d'IA.",
  },
  {
    icon: "🏆",
    color: "#ef4444",
    titre: "Concurrence des grandes plateformes",
    description:
      "Udemy, Malt, LinkedIn Learning — ces plateformes sont massivement citées par les IAs. Un coach indépendant sans stratégie AIO perd systématiquement face à elles.",
  },
];

const quickWins = [
  {
    numero: "01",
    titre: "Restructurer votre page À propos en Q&A",
    detail:
      "Remplacez le storytelling classique par des questions/réponses explicites : Qui êtes-vous ? Quelle est votre spécialité ? Quels résultats avez-vous produits ? Les IAs adorent le format Q&A structuré.",
    duree: "2h",
    impact: "Élevé",
    impactColor: "var(--accent)",
  },
  {
    numero: "02",
    titre: "Ajouter Schema.org Person sur votre site",
    detail:
      "Intégrez un JSON-LD avec votre nom, spécialité, ville, liens LinkedIn et résultats clients. Ce balisage est directement consommé par ChatGPT, Perplexity et Claude pour identifier votre autorité.",
    duree: "1h",
    impact: "Élevé",
    impactColor: "var(--accent)",
  },
  {
    numero: "03",
    titre: "Créer une page Résultats clients structurée",
    detail:
      "Pas de témoignages génériques — des études de cas avec contexte, transformation et résultats chiffrés. Format : Avant / Après / Durée / Méthode. Les IAs citent les preuves concrètes.",
    duree: "3h",
    impact: "Très élevé",
    impactColor: "var(--accent)",
  },
  {
    numero: "04",
    titre: "Optimiser vos posts LinkedIn pour l'AIO",
    detail:
      "Intégrez vos entités clés dans chaque post : votre nom complet, votre spécialité, votre méthode propriétaire. Les IAs crawlent LinkedIn — un post bien structuré renforce votre autorité thématique.",
    duree: "30min/post",
    impact: "Moyen",
    impactColor: "#f97316",
  },
  {
    numero: "05",
    titre: "Créer une FAQ dédiée à votre méthode",
    detail:
      "Une page FAQ avec Schema.org FAQPage répond exactement aux questions que vos futurs clients posent à ChatGPT. C'est le raccourci le plus direct pour apparaître dans les réponses des IAs.",
    duree: "2h",
    impact: "Très élevé",
    impactColor: "var(--accent)",
  },
];

const faqItems = [
  {
    question: "Pourquoi les coachs sont-ils invisibles auprès des IAs ?",
    reponse:
      "Les coachs et formateurs publient beaucoup sur les réseaux sociaux mais structurent rarement leur contenu pour les moteurs d'IA. ChatGPT, Perplexity et Claude cherchent des entités claires, des données structurées et des preuves d'autorité thématique. Sans ces signaux, même un expert reconnu reste invisible dans les réponses des IAs.",
  },
  {
    question: "Qu'est-ce que l'AIO pour un coach ou formateur ?",
    reponse:
      "L'AI Optimization (AIO) pour le coaching consiste à structurer sa marque personnelle, ses offres et son contenu pour être reconnu et cité par les intelligences artificielles génératives. Cela inclut la structuration des données (Schema.org), la création de contenu en Q&A explicite, et l'optimisation de la présence sur les plateformes que les IAs crawlent.",
  },
  {
    question: "Quels signaux AIO sont prioritaires pour un coach ?",
    reponse:
      "Les signaux AIO prioritaires : une page À propos structurée en Q&A avec entités nommées, des témoignages clients avec résultats chiffrés, un Schema.org Person ou Organization bien renseigné, une présence cohérente sur LinkedIn avec publications régulières et structurées, et un site web avec contenu long-form optimisé pour les questions que posent vos clients aux IAs.",
  },
  {
    question: "En combien de temps peut-on améliorer son score AIO ?",
    reponse:
      "Avec les bons ajustements, un professionnel du coaching peut voir une amélioration mesurable de son score AIO en 4 à 8 semaines. Les quick wins — structuration de la page À propos, ajout de Schema.org, restructuration des posts LinkedIn — produisent des résultats en moins de 2 semaines.",
  },
];

const auditExemple = {
  marque: "Marie Coaching — Coach en leadership",
  score: 3.2,
  lacunes: [
    "Aucun Schema.org Person sur le site",
    "Page À propos en storytelling non structuré",
    "Témoignages clients sans résultats chiffrés",
    "Posts LinkedIn sans entités nommées récurrentes",
  ],
  apresOptimisation: 7.1,
  actionsRealisees: [
    "Ajout Schema.org Person + Organization",
    "Refonte page À propos en Q&A (5 questions)",
    "3 études de cas Avant/Après avec métriques",
    "Template LinkedIn avec entités systématiques",
  ],
};

const autresSecteurs = [
  { label: "E-commerce", to: "/aio-ecommerce" },
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
          <div
            key={i}
            style={{ borderTop: "1px solid var(--border-2)", padding: "16px 0" }}
          >
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
export default function AioCoaching() {
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
          Secteur — Coaching & Formation
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
          AIO pour les Coachs
          <br />
          <span style={{ color: "var(--accent)" }}>&amp; Formateurs</span>
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
          Vous publiez chaque jour. Vous avez des clients satisfaits. Pourtant,
          quand un prospect demande à ChatGPT ou Perplexity de lui recommander
          un coach, votre nom n'apparaît pas. Ce guide explique pourquoi — et
          comment changer ça avec l'AI Optimization.
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
              Auditer ma marque →
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
            { chiffre: "94%", label: "des coachs absents des réponses IA en 2024" },
            { chiffre: "3×", label: "plus de leads pour une marque AIO-optimisée" },
            { chiffre: "6 sem.", label: "pour voir des résultats avec les bons ajustements" },
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
          la plupart des coachs
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
            {/* Avant */}
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

            {/* Après */}
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
            💡 Résultat obtenu en 5 semaines avec les quick wins ci-dessous. Données issues d'un audit Otarcy réel, marque anonymisée.
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
          pour être cité par les IAs
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
          AIO & Coaching —
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
            Découvrez votre score AIO
            <br />
            en 30 secondes
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
            Otarcy analyse votre marque et vous donne un score AIO + des
            recommandations concrètes pour apparaître dans les réponses de
            ChatGPT, Perplexity et Claude.
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

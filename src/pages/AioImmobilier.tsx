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
          name: "Pourquoi une agence immobilière est-elle invisible auprès de ChatGPT ou Perplexity ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les agences immobilières sont souvent bien référencées sur Google Maps mais absentes des réponses des IAs génératives. ChatGPT et Perplexity cherchent des entités structurées : spécialité géographique, type de biens, avis clients avec résultats chiffrés, et balisage Schema.org RealEstateAgent. Sans ces signaux, une agence locale reste invisible quand un acheteur ou vendeur pose une question à une IA.",
          },
        },
        {
          "@type": "Question",
          name: "Qu'est-ce que l'AIO pour une agence immobilière ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "L'AI Optimization (AIO) pour l'immobilier consiste à structurer l'identité de l'agence, ses zones d'expertise, ses résultats (biens vendus, délais, prix obtenus) et son contenu pour être reconnu et cité par les intelligences artificielles. Quand un acheteur demande à ChatGPT 'quelle agence immobilière choisir à Bordeaux ?', une agence AIO-optimisée a une chance d'apparaître dans la réponse.",
          },
        },
        {
          "@type": "Question",
          name: "Quels sont les signaux AIO prioritaires pour un professionnel de l'immobilier ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les signaux AIO prioritaires pour une agence immobilière sont : un Schema.org RealEstateAgent avec zone géographique et spécialité, une page À propos structurée en Q&A avec résultats chiffrés (nombre de ventes, délai moyen, taux de réussite), des avis clients avec contexte (type de bien, commune, résultat), et du contenu local structuré sur les quartiers et marchés où l'agence opère.",
          },
        },
        {
          "@type": "Question",
          name: "L'AIO est-il pertinent pour un agent immobilier indépendant ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui, l'AIO est particulièrement stratégique pour les agents indépendants et les petites agences. Les grands réseaux (Century 21, Orpi, IAD) ont des équipes SEO mais sont rarement optimisés pour les IAs. Un agent indépendant bien structuré pour l'AIO peut apparaître avant eux dans les réponses de ChatGPT sur sa zone géographique.",
          },
        },
      ],
    },
    {
      "@type": "WebPage",
      name: "AIO pour les Agences Immobilières — Otarcy",
      description:
        "Guide complet d'AI Optimization pour les agences immobilières et agents indépendants. Apparaissez dans les recommandations de ChatGPT, Perplexity et Claude quand vos clients cherchent une agence.",
      url: "https://otarcy.app/aio-immobilier",
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
    icon: "📍",
    color: "#f97316",
    titre: "Présence locale forte, signal IA inexistant",
    description:
      "Une agence peut être n°1 sur Google Maps et totaliser 200 avis cinq étoiles — et pourtant être totalement absente des réponses de ChatGPT. Google Maps et les IAs génératives ne lisent pas les mêmes signaux.",
  },
  {
    icon: "📋",
    color: "#60a5fa",
    titre: "Résultats non structurés pour les moteurs d'IA",
    description:
      "\"15 ans d'expérience\" et \"des centaines de ventes\" ne suffisent pas aux IAs. Elles cherchent des entités précises : nombre de transactions, délai moyen de vente, taux de concrétisation, zone géographique nommée explicitement.",
  },
  {
    icon: "🏘️",
    color: "#ef4444",
    titre: "Contenu local absent ou non balisé",
    description:
      "Les IAs citent les experts locaux qui produisent du contenu structuré sur leur marché. Une agence sans page dédiée à ses quartiers, sans analyse de marché et sans Schema.org RealEstateAgent ne sera jamais recommandée.",
  },
];

const quickWins = [
  {
    numero: "01",
    titre: "Ajouter Schema.org RealEstateAgent sur votre site",
    detail:
      "Intégrez un JSON-LD avec votre nom d'agence, zone géographique d'intervention, spécialité (résidentiel, commercial, luxe, location), coordonnées et lien vers vos avis. C'est le signal de base qu'attendent ChatGPT et Perplexity pour identifier un professionnel de l'immobilier.",
    duree: "1h",
    impact: "Très élevé",
    impactColor: "var(--accent)",
  },
  {
    numero: "02",
    titre: "Structurer vos résultats en données explicites",
    detail:
      "Créez une section Résultats chiffrés sur votre site : nombre de biens vendus, délai moyen de vente, prix moyen obtenu vs estimation initiale, taux de réussite. Ces données sont exactement ce que les IAs recherchent pour recommander une agence fiable.",
    duree: "2h",
    impact: "Très élevé",
    impactColor: "var(--accent)",
  },
  {
    numero: "03",
    titre: "Créer des pages quartier structurées",
    detail:
      "Une page par quartier ou commune où vous opérez, avec : prix au m² actuels, types de biens disponibles, tendances du marché local, et votre expertise spécifique sur cette zone. Ces pages font de vous la référence locale que les IAs citent.",
    duree: "2h/page",
    impact: "Élevé",
    impactColor: "var(--accent)",
  },
  {
    numero: "04",
    titre: "Réécrire vos avis clients avec contexte structuré",
    detail:
      "Intégrez sur votre site des avis avec Schema.org Review incluant : type de bien, commune, résultat obtenu (vendu en X jours, au prix demandé). Un avis contextualisé vaut dix fois plus qu'un témoignage générique aux yeux des IAs.",
    duree: "2h",
    impact: "Élevé",
    impactColor: "var(--accent)",
  },
  {
    numero: "05",
    titre: "Publier des analyses de marché local régulières",
    detail:
      "Un article mensuel sur le marché immobilier de votre zone (prix, tendances, délais) positionne votre agence comme source d'autorité. Les IAs citent les experts qui produisent des données locales vérifiables et régulièrement mises à jour.",
    duree: "3h/mois",
    impact: "Moyen",
    impactColor: "#f97316",
  },
];

const faqItems = [
  {
    question: "Pourquoi une agence immobilière est-elle invisible auprès des IAs ?",
    reponse:
      "Les agences immobilières sont souvent bien référencées sur Google Maps mais absentes des réponses des IAs génératives. ChatGPT et Perplexity cherchent des entités structurées : spécialité géographique, type de biens, avis clients avec résultats chiffrés, et balisage Schema.org RealEstateAgent. Sans ces signaux, une agence locale reste invisible quand un acheteur ou vendeur pose une question à une IA.",
  },
  {
    question: "Qu'est-ce que l'AIO pour une agence immobilière ?",
    reponse:
      "L'AI Optimization pour l'immobilier consiste à structurer l'identité de l'agence, ses zones d'expertise, ses résultats (biens vendus, délais, prix obtenus) et son contenu pour être reconnu et cité par les intelligences artificielles. Quand un acheteur demande à ChatGPT 'quelle agence immobilière choisir à Bordeaux ?', une agence AIO-optimisée a une chance d'apparaître dans la réponse.",
  },
  {
    question: "Quels signaux AIO sont prioritaires pour un professionnel de l'immobilier ?",
    reponse:
      "Les signaux AIO prioritaires : un Schema.org RealEstateAgent avec zone géographique et spécialité, une page À propos en Q&A avec résultats chiffrés (nombre de ventes, délai moyen, taux de réussite), des avis clients avec contexte (type de bien, commune, résultat), et du contenu local structuré sur les marchés où l'agence opère.",
  },
  {
    question: "L'AIO est-il pertinent pour un agent indépendant ?",
    reponse:
      "Oui, l'AIO est particulièrement stratégique pour les agents indépendants et les petites agences. Les grands réseaux ont des équipes SEO mais sont rarement optimisés pour les IAs. Un agent indépendant bien structuré pour l'AIO peut apparaître avant eux dans les réponses de ChatGPT sur sa zone géographique.",
  },
];

const auditExemple = {
  marque: "Agence Meridiem — Immobilier résidentiel Bordeaux Rive Droite",
  score: 2.4,
  lacunes: [
    "Aucun Schema.org RealEstateAgent",
    "Résultats présentés en prose non structurée",
    "Aucune page par quartier d'intervention",
    "Avis Google non intégrés sur le site",
  ],
  apresOptimisation: 7.4,
  actionsRealisees: [
    "Schema.org RealEstateAgent + LocalBusiness",
    "Section résultats chiffrés (247 ventes, 38j délai moyen)",
    "5 pages quartier (Cenon, Lormont, Floirac, Artigues, Carbon-Blanc)",
    "Schema.org Review sur 18 avis contextualisés",
  ],
};

const autresSecteurs = [
  { label: "Coaching", to: "/aio-coaching" },
  { label: "E-commerce", to: "/aio-ecommerce" },
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
export default function AioImmobilier() {
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
          Secteur — Immobilier
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
          AIO pour les Agences
          <br />
          <span style={{ color: "var(--accent)" }}>Immobilières</span>
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
          Vos acheteurs et vendeurs consultent désormais ChatGPT avant de
          contacter une agence. Ils posent des questions comme "quelle agence
          immobilière choisir à Lyon ?" ou "quel est le délai moyen pour vendre
          un appartement à Bordeaux ?". Si vous n'êtes pas structuré pour les
          IAs, un concurrent le sera.
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
              Auditer mon agence →
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
            { chiffre: "78%", label: "des acheteurs immobiliers recherchent en ligne avant de contacter une agence" },
            { chiffre: "5×", label: "plus de demandes entrantes pour une agence citée par les IAs locales" },
            { chiffre: "4 sem.", label: "pour voir les premiers résultats AIO avec Schema.org RealEstateAgent" },
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
          la plupart des agences
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
            💡 Résultat obtenu en 4 semaines. L'agence est désormais citée par Perplexity sur 3 requêtes locales clés. Données issues d'un audit Otarcy réel, marque anonymisée.
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
          pour dominer votre marché local
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
          AIO & Immobilier —
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
            de votre agence
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
            Otarcy analyse votre agence et vous donne un score AIO + des
            recommandations concrètes pour apparaître dans les réponses de
            ChatGPT, Perplexity et Claude quand vos clients cherchent un
            professionnel de l'immobilier dans votre zone.
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

        {/* Liens secteurs */}
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

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const schemaJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Pourquoi un cabinet de conseil RH ou de recrutement est-il invisible auprès de ChatGPT ou Perplexity ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les cabinets RH ont souvent un site institutionnel bien conçu mais pauvre en signaux AIO. ChatGPT et Perplexity cherchent des entités précises : spécialité RH, secteurs couverts, taille d'entreprises ciblées, résultats mesurables (délais de recrutement, taux de rétention, nombre de placements). Sans ces données structurées, même un cabinet reconnu reste absent des réponses des IAs quand un DRH ou dirigeant pose une question sur le recrutement.",
          },
        },
        {
          "@type": "Question",
          name: "Qu'est-ce que l'AIO pour un cabinet RH ou un recruteur indépendant ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "L'AI Optimization pour le conseil RH consiste à structurer l'expertise du cabinet, ses spécialités (recrutement cadres, formation, QVCT, outplacement), ses résultats et son positionnement pour être reconnu et cité par les intelligences artificielles génératives. Quand un DRH demande à ChatGPT 'quel cabinet RH choisir pour recruter des profils tech à Paris ?', un cabinet AIO-optimisé a une chance d'apparaître dans la réponse.",
          },
        },
        {
          "@type": "Question",
          name: "Quels sont les signaux AIO prioritaires pour un professionnel RH ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les signaux AIO prioritaires pour un cabinet RH sont : un Schema.org ProfessionalService avec spécialités et secteurs couverts, une page expertise structurée en Q&A avec résultats chiffrés (délai moyen, taux de rétention à 12 mois, nombre de placements), des études de cas clients anonymisées, et du contenu thématique sur les enjeux RH actuels (IA et recrutement, marché de l'emploi, retention des talents).",
          },
        },
        {
          "@type": "Question",
          name: "L'AIO est-il pertinent pour un recruteur indépendant ou un RH freelance ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui, l'AIO est particulièrement stratégique pour les indépendants RH. Les grands cabinets comme Michael Page ou Hays dominent Google mais investissent peu dans l'AIO. Un recruteur indépendant bien structuré pour les IAs peut apparaître en priorité dans les réponses de ChatGPT sur sa niche sectorielle ou géographique, là où les grands réseaux sont trop généralistes pour être cités.",
          },
        },
      ],
    },
    {
      "@type": "WebPage",
      name: "AIO pour les Cabinets RH et Recruteurs — Otarcy",
      description: "Guide complet d'AI Optimization pour les cabinets de conseil RH, recruteurs et DRH. Apparaissez dans les recommandations de ChatGPT, Perplexity et Claude quand vos clients cherchent un expert RH.",
      url: "https://otarcy.app/aio-rh",
      publisher: { "@type": "Organization", name: "Otarcy", url: "https://otarcy.app" },
    },
  ],
};

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) (e.target as HTMLElement).classList.add("visible"); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const problemSignals = [
  {
    icon: "📊", color: "#f97316",
    titre: "Expertise réelle, données invisibles pour les IAs",
    description: "\"15 ans d'expérience en recrutement\" ne suffit pas à ChatGPT. Les IAs cherchent des données précises et vérifiables : délai moyen de placement, taux de rétention à 12 mois, secteurs couverts nommés explicitement, taille d'entreprises ciblées. Sans ces chiffres structurés, votre expertise est opaque pour les moteurs d'IA.",
  },
  {
    icon: "🎯", color: "#60a5fa",
    titre: "Positionnement trop généraliste pour être cité",
    description: "Les IAs citent les experts de niche, pas les généralistes. Un cabinet qui couvre 'tous les secteurs' et 'tous les profils' ne sera jamais cité par ChatGPT sur une requête précise. Le positionnement sectoriel ou fonctionnel est un signal AIO majeur.",
  },
  {
    icon: "📝", color: "#ef4444",
    titre: "Contenu institutionnel non consommable par les IAs",
    description: "Les brochures PDF, les plaquettes commerciales et les slides de présentation sont illisibles pour les IAs. ChatGPT a besoin de contenu textuel structuré sur votre site : études de cas, articles thématiques, FAQ sur vos méthodes. Sans ça, votre cabinet n'existe pas pour les moteurs d'IA.",
  },
];

const quickWins = [
  {
    numero: "01", titre: "Ajouter Schema.org ProfessionalService avec spécialités",
    detail: "Intégrez un JSON-LD ProfessionalService avec : nom du cabinet, spécialités RH (recrutement, formation, QVCT, outplacement), secteurs couverts, zone géographique et résultats clés. C'est le signal de base qu'attendent ChatGPT et Perplexity pour identifier et recommander un expert RH.",
    duree: "1h", impact: "Très élevé", impactColor: "var(--accent)",
  },
  {
    numero: "02", titre: "Publier vos résultats en données structurées",
    detail: "Créez une page Résultats avec données explicites : délai moyen de placement par profil, taux de rétention à 12 mois, nombre de recrutements réalisés, secteurs les plus représentés. Ces chiffres sont exactement ce que les IAs recherchent pour recommander un cabinet crédible.",
    duree: "2h", impact: "Très élevé", impactColor: "var(--accent)",
  },
  {
    numero: "03", titre: "Structurer votre expertise en Q&A thématiques",
    detail: "Une page par spécialité RH : recrutement tech, recrutement commercial, QVCT, outplacement, bilan de compétences. Format Q&A pour chacune : Qu'est-ce que c'est ? Pour qui ? Quelle méthode ? Quels résultats ? Les IAs citent les experts qui structurent leur savoir de façon explicite.",
    duree: "2h/page", impact: "Élevé", impactColor: "var(--accent)",
  },
  {
    numero: "04", titre: "Publier des études de cas clients anonymisées",
    detail: "Pas de témoignages génériques — des cas concrets avec contexte (secteur, taille entreprise, problématique), approche déployée et résultats mesurables (délai, coût par recrutement, taux d'acceptation). Les IAs citent les preuves concrètes, pas les promesses marketing.",
    duree: "2h/cas", impact: "Élevé", impactColor: "var(--accent)",
  },
  {
    numero: "05", titre: "Produire du contenu sur les enjeux RH actuels",
    detail: "Articles structurés sur : IA et recrutement, marché de l'emploi par secteur, retention des talents, diversité & inclusion, télétravail et culture d'entreprise. Ces sujets sont massivement demandés aux IAs par les DRH — vous devenez la source qu'elles citent.",
    duree: "3h/article", impact: "Moyen", impactColor: "#f97316",
  },
];

const faqItems = [
  {
    question: "Pourquoi mon cabinet RH est-il invisible auprès des IAs ?",
    reponse: "Les cabinets RH ont souvent un site institutionnel bien conçu mais pauvre en signaux AIO. ChatGPT et Perplexity cherchent des entités précises : spécialité RH, secteurs couverts, taille d'entreprises ciblées, résultats mesurables. Sans ces données structurées, même un cabinet reconnu reste absent des réponses des IAs.",
  },
  {
    question: "Qu'est-ce que l'AIO pour un cabinet RH ?",
    reponse: "L'AI Optimization pour le conseil RH consiste à structurer l'expertise du cabinet, ses spécialités, ses résultats et son positionnement pour être reconnu et cité par les intelligences artificielles. Quand un DRH demande à ChatGPT 'quel cabinet RH choisir pour recruter des profils tech à Paris ?', un cabinet AIO-optimisé a une chance d'apparaître dans la réponse.",
  },
  {
    question: "Quels signaux AIO sont prioritaires pour un professionnel RH ?",
    reponse: "Les signaux AIO prioritaires : un Schema.org ProfessionalService avec spécialités et secteurs couverts, une page expertise en Q&A avec résultats chiffrés (délai moyen, taux de rétention à 12 mois, nombre de placements), des études de cas clients anonymisées, et du contenu thématique sur les enjeux RH actuels.",
  },
  {
    question: "L'AIO est-il pertinent pour un recruteur indépendant ?",
    reponse: "Oui, particulièrement stratégique pour les indépendants RH. Les grands cabinets comme Michael Page ou Hays dominent Google mais investissent peu dans l'AIO. Un recruteur indépendant bien structuré peut apparaître en priorité dans les réponses de ChatGPT sur sa niche sectorielle ou géographique, là où les grands réseaux sont trop généralistes pour être cités.",
  },
];

const auditExemple = {
  marque: "Nexus RH — Cabinet de recrutement cadres tech & digital, Bordeaux",
  score: 2.6,
  lacunes: [
    "Aucun Schema.org ProfessionalService",
    "Résultats présentés en texte non structuré",
    "Aucune étude de cas publiée sur le site",
    "Contenu uniquement commercial, zéro contenu thématique",
  ],
  apresOptimisation: 7.3,
  actionsRealisees: [
    "Schema.org ProfessionalService + spécialités tech/digital",
    "Page Résultats : 340 placements, 38j délai moyen, 91% rétention 12 mois",
    "4 études de cas anonymisées (CTO, Lead Dev, Product Manager, Data...)",
    "6 articles thématiques (IA et recrutement, salaires tech 2025...)",
  ],
};

const autresSecteurs = [
  { label: "Coaching", to: "/aio-coaching" },
  { label: "E-commerce", to: "/aio-ecommerce" },
  { label: "Immobilier", to: "/aio-immobilier" },
  { label: "Restauration", to: "/aio-restauration" },
  { label: "Santé & Bien-être", to: "/aio-sante" },
];

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
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", gap: "16px" }}
            >
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "var(--text-1)", fontWeight: 500, lineHeight: 1.5 }}>{item.question}</span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", color: isOpen ? "var(--accent)" : "var(--text-3)", flexShrink: 0, transition: "color 0.2s" }}>{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "var(--text-4)", lineHeight: 1.7, fontWeight: 300, marginTop: "12px", paddingRight: "24px" }}>{item.reponse}</p>}
          </div>
        );
      })}
    </div>
  );
}

export default function AioRh() {
  useReveal();
  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "var(--text-1)", fontFamily: "'Raleway', sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />

      <Navbar />

      {/* HERO */}
      <section style={{ padding: "100px 60px 80px", maxWidth: "860px", margin: "0 auto" }}>
        <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "24px", fontWeight: 500 }}>
          Secteur — Conseil RH & Recrutement
        </p>
        <h1 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.8rem, 7vw, 5.5rem)", letterSpacing: "0.04em", lineHeight: 1.05, color: "var(--text-1)", marginBottom: "32px" }}>
          AIO pour les Cabinets<br /><span style={{ color: "var(--accent)" }}>RH & Recruteurs</span>
        </h1>
        <p className="reveal" style={{ fontSize: "0.88rem", color: "var(--text-4)", lineHeight: 1.9, fontWeight: 300, maxWidth: "600px", marginBottom: "40px" }}>
          Les DRH et dirigeants consultent ChatGPT avant de choisir un cabinet RH. Ils posent des questions comme "quel recruteur spécialisé en profils tech choisir ?" ou "comment améliorer la rétention des talents ?". Si votre expertise n'est pas structurée pour les IAs, vous n'existez pas dans leur réponse.
        </p>
        <div className="reveal" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link to="/#audit">
            <button
              style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", background: "var(--accent)", color: "var(--bg-page)", fontWeight: 600, border: "none", cursor: "pointer", transition: "opacity 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Auditer mon cabinet →
            </button>
          </Link>
          <Link to="/glossaire">
            <button
              style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", border: "1px solid var(--border-3)", background: "transparent", color: "var(--text-2)", cursor: "pointer", transition: "border-color 0.3s, color 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.color = "#e8e8e8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3a3a"; e.currentTarget.style.color = "#7a7a7a"; }}
            >
              Glossaire AIO
            </button>
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: "60px", maxWidth: "860px", margin: "0 auto", borderTop: "1px solid var(--border-2)", borderBottom: "1px solid var(--border-2)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            { chiffre: "71%", label: "des DRH utilisent une IA pour se renseigner avant de sélectionner un cabinet" },
            { chiffre: "4×", label: "plus de demandes entrantes pour un cabinet cité par les IAs sur sa niche" },
            { chiffre: "5 sem.", label: "pour apparaître dans les réponses IA sur votre spécialité RH" },
          ].map((stat, i) => (
            <div key={i} className="reveal" style={{ padding: "24px", border: "1px solid var(--border-2)", background: "var(--bg-page)" }}>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", color: "var(--accent)", lineHeight: 1, marginBottom: "8px" }}>{stat.chiffre}</p>
              <p style={{ fontSize: "0.72rem", color: "var(--text-2)", lineHeight: 1.5, fontWeight: 300 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLÈME */}
      <section style={{ padding: "100px 60px", maxWidth: "860px", margin: "0 auto" }}>
        <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }}>.01 — Le problème</p>
        <h2 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.04em", color: "var(--text-1)", marginBottom: "48px", lineHeight: 1.1 }}>
          Pourquoi les IAs ignorent<br />la plupart des cabinets RH
        </h2>
        <div style={{ display: "grid", gap: "16px" }}>
          {problemSignals.map((item, i) => (
            <div key={i} className="reveal" style={{ padding: "28px", border: "1px solid var(--border-2)", background: "var(--bg-page)", borderLeft: `2px solid ${item.color}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.06em", color: "var(--text-1)", marginBottom: "10px" }}>{item.titre}</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-4)", lineHeight: 1.7, fontWeight: 300 }}>{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AUDIT EXEMPLE */}
      <section style={{ padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }}>
        <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }}>.02 — Exemple concret</p>
        <h2 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.04em", color: "var(--text-1)", marginBottom: "40px", lineHeight: 1.1 }}>
          Un audit réel,<br />avant et après AIO
        </h2>
        <div className="reveal" style={{ padding: "28px", border: "1px solid var(--border-2)", background: "var(--bg-page)" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "20px" }}>Cas anonymisé — {auditExemple.marque}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ padding: "20px", background: "var(--bg-hero)", border: "1px solid var(--border-2)", borderLeft: "2px solid #ef4444" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "var(--text-1)" }}>AVANT</p>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#ef4444" }}>{auditExemple.score}<span style={{ fontSize: "0.9rem", color: "var(--text-3)" }}>/10</span></p>
              </div>
              {auditExemple.lacunes.map((l, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }}>
                  <span style={{ color: "#ef4444", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }}>✕</span>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-2)", lineHeight: 1.5, fontWeight: 300 }}>{l}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: "20px", background: "var(--bg-hero)", border: "1px solid var(--border-2)", borderLeft: "2px solid var(--accent)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "var(--text-1)" }}>APRÈS</p>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "var(--accent)" }}>{auditExemple.apresOptimisation}<span style={{ fontSize: "0.9rem", color: "var(--text-3)" }}>/10</span></p>
              </div>
              {auditExemple.actionsRealisees.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }}>
                  <span style={{ color: "var(--accent)", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }}>→</span>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-4)", lineHeight: 1.5, fontWeight: 300 }}>{a}</p>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "var(--text-3)", fontStyle: "italic", borderTop: "1px solid var(--border-2)", paddingTop: "14px", marginTop: "16px" }}>
            💡 Résultat obtenu en 5 semaines. Le cabinet est désormais cité par Perplexity sur 4 requêtes RH tech en Nouvelle-Aquitaine. Données issues d'un audit Otarcy réel, marque anonymisée.
          </p>
        </div>
      </section>

      {/* QUICK WINS */}
      <section style={{ padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }}>
        <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }}>.03 — Quick Wins</p>
        <h2 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.04em", color: "var(--text-1)", marginBottom: "40px", lineHeight: 1.1 }}>
          5 actions concrètes<br />pour être le cabinet que les IAs citent
        </h2>
        <div style={{ display: "grid", gap: "16px" }}>
          {quickWins.map((qw, i) => (
            <div key={i} className="reveal" style={{ padding: "24px", border: "1px solid var(--border-2)", background: "var(--bg-page)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", letterSpacing: "0.15em", color: "var(--accent)" }}>{qw.numero}</span>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.06em", color: "var(--text-1)" }}>{qw.titre}</p>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: "var(--text-2)", padding: "2px 8px", border: "1px solid var(--border-2)" }}>{qw.duree}</span>
                  <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: qw.impactColor, padding: "2px 8px", border: `1px solid ${qw.impactColor}` }}>{qw.impact}</span>
                </div>
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-4)", lineHeight: 1.7, fontWeight: 300 }}>{qw.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }}>
        <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }}>.04 — Questions fréquentes</p>
        <h2 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.04em", color: "var(--text-1)", marginBottom: "40px", lineHeight: 1.1 }}>
          AIO & Conseil RH —<br />tout ce qu'il faut savoir
        </h2>
        <div className="reveal" style={{ padding: "24px 28px", border: "1px solid var(--border-2)", background: "var(--bg-page)" }}>
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }}>
        <div className="reveal" style={{ padding: "48px", border: "1px solid var(--accent)", background: "var(--bg-primary)" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }}>Passez à l'action</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "0.04em", color: "var(--text-1)", marginBottom: "16px", lineHeight: 1.1 }}>
            Découvrez le score AIO<br />de votre cabinet RH
          </h2>
          <p style={{ fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.7, fontWeight: 300, marginBottom: "32px", maxWidth: "480px" }}>
            Otarcy analyse votre cabinet et vous donne un score AIO + des recommandations concrètes pour apparaître dans les réponses de ChatGPT, Perplexity et Claude quand vos clients cherchent un expert RH.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link to="/#audit">
              <button
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", background: "var(--accent)", color: "var(--bg-page)", fontWeight: 600, border: "none", cursor: "pointer", transition: "opacity 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Lancer mon audit gratuit →
              </button>
            </Link>
            <Link to="/pricing">
              <button
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", border: "1px solid var(--border-3)", background: "transparent", color: "var(--text-2)", cursor: "pointer", transition: "border-color 0.3s, color 0.3s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.color = "#e8e8e8"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3a3a"; e.currentTarget.style.color = "#7a7a7a"; }}
              >
                Voir les offres
              </button>
            </Link>
          </div>
        </div>

        <div className="reveal" style={{ marginTop: "40px" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-3)", textTransform: "uppercase", marginBottom: "14px" }}>Autres secteurs</p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {autresSecteurs.map((s) => (
              <Link key={s.to} to={s.to}
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-3)", padding: "6px 14px", border: "1px solid var(--border-2)", textDecoration: "none", transition: "color 0.2s, border-color 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#a3e635"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#a3e635"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#4a4a4a"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2a2a2a"; }}
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

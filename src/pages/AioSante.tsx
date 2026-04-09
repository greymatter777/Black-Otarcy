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
          name: "Pourquoi un professionnel de santé ou du bien-être est-il invisible auprès de ChatGPT ou Perplexity ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les professionnels de santé et du bien-être ont souvent une forte réputation locale mais une présence digitale peu structurée pour les IAs. ChatGPT et Perplexity cherchent des entités précises : spécialité, approche thérapeutique, formations et certifications, localisation, et types de problématiques traitées. Sans ces signaux structurés sur leur site, même un praticien reconnu reste absent des réponses des IAs.",
          },
        },
        {
          "@type": "Question",
          name: "Qu'est-ce que l'AIO pour un professionnel de santé ou du bien-être ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "L'AI Optimization pour la santé et le bien-être consiste à structurer l'identité du praticien, ses spécialités, ses approches et ses résultats pour être reconnu et cité par les intelligences artificielles génératives. Quand un patient demande à ChatGPT 'quel ostéopathe choisir à Lyon pour des douleurs chroniques ?', un praticien AIO-optimisé a une chance d'apparaître dans la réponse.",
          },
        },
        {
          "@type": "Question",
          name: "Quels sont les signaux AIO prioritaires pour un professionnel de santé ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les signaux AIO prioritaires pour un professionnel de santé ou du bien-être sont : un Schema.org MedicalBusiness ou HealthAndBeautyBusiness avec spécialité et localisation, une page À propos structurée en Q&A avec formations, certifications et approches nommées explicitement, une FAQ sur les problématiques traitées, et du contenu éducatif sur les pathologies ou sujets couverts.",
          },
        },
        {
          "@type": "Question",
          name: "L'AIO est-il compatible avec les règles déontologiques des professionnels de santé ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui, l'AIO pour la santé reste dans le cadre déontologique en structurant des informations factuelles : formations, certifications, spécialités, localisation, approches thérapeutiques reconnues. Il ne s'agit pas de faire des promesses de guérison ou des comparaisons entre praticiens, mais de rendre visible une expertise déjà existante auprès des moteurs d'IA.",
          },
        },
      ],
    },
    {
      "@type": "WebPage",
      name: "AIO pour les Professionnels de Santé et du Bien-être — Otarcy",
      description: "Guide complet d'AI Optimization pour les professionnels de santé, thérapeutes et coachs bien-être. Apparaissez dans les recommandations de ChatGPT, Perplexity et Claude quand vos patients cherchent un praticien.",
      url: "https://otarcy.app/aio-sante",
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
    icon: "🔬", color: "#f97316",
    titre: "Formations et certifications non lisibles par les IAs",
    description: "Un ostéopathe DO, un psychologue EMDR certifié ou un naturopathe FENAHMAN — ces qualifications sont clés pour vos patients mais souvent absentes des signaux que lisent ChatGPT et Perplexity. Sans balisage structuré, vos certifications n'existent pas pour les moteurs d'IA.",
  },
  {
    icon: "🩺", color: "#60a5fa",
    titre: "Problématiques traitées non nommées explicitement",
    description: "Les IAs répondent à des requêtes précises : 'thérapeute spécialisé en burn-out', 'kiné spécialisé sport', 'naturopathe pour troubles digestifs'. Si vos spécialités ne sont pas nommées explicitement sur votre site avec le bon vocabulaire, vous n'apparaissez sur aucune de ces requêtes.",
  },
  {
    icon: "📋", color: "#ef4444",
    titre: "Contenu trop institutionnel, trop peu éducatif",
    description: "Un site vitrine avec tarifs et prise de rendez-vous ne suffit pas aux IAs. Elles citent les praticiens qui produisent du contenu éducatif sur leurs spécialités : articles sur les pathologies, FAQ sur les approches, explication des méthodes. C'est ce contenu qui vous positionne comme référence.",
  },
];

const quickWins = [
  {
    numero: "01", titre: "Ajouter Schema.org MedicalBusiness sur votre site",
    detail: "Intégrez un JSON-LD MedicalBusiness (ou HealthAndBeautyBusiness selon votre activité) avec : spécialité médicale ou thérapeutique, formations et certifications nommées, localisation, et types de consultations proposées. C'est le signal de base qu'attendent les IAs pour identifier un professionnel de santé.",
    duree: "1h", impact: "Très élevé", impactColor: "var(--accent)",
  },
  {
    numero: "02", titre: "Structurer vos spécialités et approches en Q&A",
    detail: "Pour chaque spécialité ou approche que vous pratiquez (EMDR, TCC, ostéopathie crânienne, naturopathie, etc.) : une page dédiée en Q&A. Qu'est-ce que c'est ? Pour quelles problématiques ? Comment se déroule une séance ? Quels résultats attendus ? Les IAs utilisent ces pages pour répondre aux questions de vos futurs patients.",
    duree: "2h/approche", impact: "Très élevé", impactColor: "var(--accent)",
  },
  {
    numero: "03", titre: "Créer une FAQ sur les pathologies et problématiques traitées",
    detail: "Listez explicitement les problématiques que vous prenez en charge : anxiété, burn-out, douleurs chroniques, troubles du sommeil, TCA, etc. Une page FAQ avec Schema.org FAQPage répond directement aux questions que vos patients posent aux IAs avant de consulter.",
    duree: "2h", impact: "Élevé", impactColor: "var(--accent)",
  },
  {
    numero: "04", titre: "Nommer vos formations et certifications avec entités complètes",
    detail: "Ne mentionnez pas juste 'certifié EMDR' — nommez l'organisme de formation, l'année, le niveau. Ces entités précises sont ce que ChatGPT vérifie pour évaluer la crédibilité d'un praticien. Un Schema.org Person avec educationalCredential structuré est un signal AIO majeur.",
    duree: "1h", impact: "Élevé", impactColor: "var(--accent)",
  },
  {
    numero: "05", titre: "Publier du contenu éducatif sur vos thématiques",
    detail: "Articles accessibles sur les pathologies que vous traitez, les mécanismes en jeu, les approches possibles. Ce contenu éducatif positionne votre site comme référence thématique — les IAs le citent quand vos patients cherchent à comprendre leur problématique avant de consulter.",
    duree: "3h/article", impact: "Moyen", impactColor: "#f97316",
  },
];

const faqItems = [
  {
    question: "Pourquoi un professionnel de santé est-il invisible auprès des IAs ?",
    reponse: "Les professionnels de santé ont souvent une forte réputation locale mais une présence digitale peu structurée pour les IAs. ChatGPT et Perplexity cherchent des entités précises : spécialité, approche thérapeutique, formations et certifications, localisation, et types de problématiques traitées. Sans ces signaux structurés, même un praticien reconnu reste absent des réponses des IAs.",
  },
  {
    question: "Qu'est-ce que l'AIO pour un professionnel de santé ou du bien-être ?",
    reponse: "L'AI Optimization pour la santé et le bien-être consiste à structurer l'identité du praticien, ses spécialités, ses approches et son expertise pour être reconnu et cité par les IAs. Quand un patient demande à ChatGPT 'quel ostéopathe choisir à Lyon pour des douleurs chroniques ?', un praticien AIO-optimisé a une chance d'apparaître dans la réponse.",
  },
  {
    question: "Quels signaux AIO sont prioritaires pour un professionnel de santé ?",
    reponse: "Les signaux AIO prioritaires : un Schema.org MedicalBusiness avec spécialité et localisation, une page À propos en Q&A avec formations et certifications nommées explicitement, une FAQ sur les problématiques traitées avec Schema.org FAQPage, et du contenu éducatif sur les pathologies ou sujets couverts.",
  },
  {
    question: "L'AIO est-il compatible avec les règles déontologiques ?",
    reponse: "Oui, l'AIO pour la santé reste dans le cadre déontologique en structurant des informations factuelles : formations, certifications, spécialités, localisation, approches thérapeutiques reconnues. Il ne s'agit pas de faire des promesses de guérison ou des comparaisons entre praticiens, mais de rendre visible une expertise déjà existante auprès des moteurs d'IA.",
  },
];

const auditExemple = {
  marque: "Cabinet Solis — Psychologue & Thérapeute EMDR, Bordeaux",
  score: 2.3,
  lacunes: [
    "Aucun Schema.org MedicalBusiness sur le site",
    "Certifications EMDR mentionnées sans entités structurées",
    "Aucune page dédiée aux problématiques traitées",
    "Zéro contenu éducatif — site purement vitrine",
  ],
  apresOptimisation: 7.5,
  actionsRealisees: [
    "Schema.org MedicalBusiness + Person avec certifications",
    "3 pages approches (EMDR, TCC, thérapie brève) en Q&A",
    "FAQ 12 questions sur burn-out, anxiété, trauma, deuil",
    "5 articles éducatifs sur les pathologies traitées",
  ],
};

const autresSecteurs = [
  { label: "Coaching", to: "/aio-coaching" },
  { label: "E-commerce", to: "/aio-ecommerce" },
  { label: "Immobilier", to: "/aio-immobilier" },
  { label: "Restauration", to: "/aio-restauration" },
  { label: "Conseil RH", to: "/aio-rh" },
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

export default function AioSante() {
  useReveal();
  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "var(--text-1)", fontFamily: "'Raleway', sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />

      <Navbar />

      {/* HERO */}
      <section style={{ padding: "100px 60px 80px", maxWidth: "860px", margin: "0 auto" }}>
        <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "24px", fontWeight: 500 }}>
          Secteur — Santé & Bien-être
        </p>
        <h1 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.8rem, 7vw, 5.5rem)", letterSpacing: "0.04em", lineHeight: 1.05, color: "var(--text-1)", marginBottom: "32px" }}>
          AIO pour les Pros<br /><span style={{ color: "var(--accent)" }}>de Santé & Bien-être</span>
        </h1>
        <p className="reveal" style={{ fontSize: "0.88rem", color: "var(--text-4)", lineHeight: 1.9, fontWeight: 300, maxWidth: "600px", marginBottom: "40px" }}>
          Vos patients cherchent "thérapeute spécialisé en burn-out à Nantes" ou "ostéopathe pour douleurs chroniques" directement dans ChatGPT avant même d'ouvrir PagesJaunes. Si vos spécialités et certifications ne sont pas structurées pour les IAs, un confrère moins qualifié mais mieux optimisé vous devancera.
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
            { chiffre: "67%", label: "des patients recherchent un praticien en ligne avant de prendre rendez-vous" },
            { chiffre: "5×", label: "plus de prises de contact pour un praticien cité par les IAs sur sa spécialité" },
            { chiffre: "4 sem.", label: "pour apparaître dans les réponses IA sur votre spécialité avec Schema.org" },
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
          Pourquoi les IAs ignorent<br />la plupart des praticiens
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
            💡 Résultat obtenu en 4 semaines. Le cabinet est désormais cité par ChatGPT sur 6 requêtes locales liées au burn-out et à l'EMDR. Données issues d'un audit Otarcy réel, marque anonymisée.
          </p>
        </div>
      </section>

      {/* QUICK WINS */}
      <section style={{ padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }}>
        <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }}>.03 — Quick Wins</p>
        <h2 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.04em", color: "var(--text-1)", marginBottom: "40px", lineHeight: 1.1 }}>
          5 actions concrètes<br />pour être le praticien que les IAs recommandent
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
          AIO & Santé —<br />tout ce qu'il faut savoir
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
            Découvrez le score AIO<br />de votre cabinet
          </h2>
          <p style={{ fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.7, fontWeight: 300, marginBottom: "32px", maxWidth: "480px" }}>
            Otarcy analyse votre cabinet et vous donne un score AIO + des recommandations concrètes pour apparaître dans les réponses de ChatGPT, Perplexity et Claude quand vos patients cherchent un praticien dans votre spécialité.
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

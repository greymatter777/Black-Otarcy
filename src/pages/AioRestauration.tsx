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
          name: "Pourquoi un restaurant n'apparaît-il pas dans les recommandations de ChatGPT ou Perplexity ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La plupart des restaurants sont bien référencés sur Google Maps et TripAdvisor, mais ces plateformes ne suffisent pas aux IAs génératives. ChatGPT et Perplexity cherchent des entités structurées sur votre propre site : type de cuisine, spécialités nommées, ambiance, localisation précise, et balisage Schema.org Restaurant.",
          },
        },
        {
          "@type": "Question",
          name: "Qu'est-ce que l'AIO pour un restaurant ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "L'AI Optimization pour la restauration consiste à structurer l'identité du restaurant, sa carte, ses spécialités et son ambiance pour être reconnu et cité par les intelligences artificielles. Quand un touriste demande à ChatGPT 'quel est le meilleur restaurant de fruits de mer à La Rochelle ?', un restaurant AIO-optimisé a une chance d'apparaître dans la réponse.",
          },
        },
        {
          "@type": "Question",
          name: "Quels sont les signaux AIO prioritaires pour un restaurant ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les signaux AIO prioritaires pour un restaurant sont : un Schema.org Restaurant avec type de cuisine, spécialités, horaires et localisation, une page À propos structurée en Q&A (origine du chef, concept, fournisseurs locaux), des avis clients avec plats mentionnés explicitement, et du contenu sur les occasions de visite.",
          },
        },
        {
          "@type": "Question",
          name: "TripAdvisor et Google Maps suffisent-ils pour être recommandé par les IAs ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non. TripAdvisor et Google Maps sont des plateformes tierces que les IAs consultent mais ne privilégient pas comme sources d'autorité. Pour être cité en priorité, un restaurant doit avoir ses propres signaux AIO sur son site : Schema.org Restaurant, contenu structuré sur ses spécialités, et FAQ répondant aux questions que les clients posent aux IAs avant de réserver.",
          },
        },
      ],
    },
    {
      "@type": "WebPage",
      name: "AIO pour les Restaurants — Otarcy",
      description: "Guide complet d'AI Optimization pour les restaurants. Apparaissez dans les recommandations de ChatGPT, Perplexity et Claude quand vos clients cherchent où manger.",
      url: "https://otarcy.app/aio-restauration",
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
    icon: "🗺️", color: "#f97316",
    titre: "Google Maps ≠ visibilité IA",
    description: "500 avis cinq étoiles sur Google Maps ne garantissent aucune citation dans ChatGPT. Les IAs génératives lisent le contenu structuré de votre site — pas les plateformes tierces. Un restaurant sans signaux AIO propres reste invisible.",
  },
  {
    icon: "🍽️", color: "#60a5fa",
    titre: "Carte et spécialités illisibles par les IAs",
    description: "Votre PDF de menu ou votre image de carte est illisible pour ChatGPT. Les IAs ont besoin d'entités textuelles explicites : noms de plats, ingrédients clés, origine des produits, régimes compatibles. Sans ça, votre identité culinaire n'existe pas pour elles.",
  },
  {
    icon: "👨‍🍳", color: "#ef4444",
    titre: "Concept et histoire non structurés",
    description: "\"Restaurant familial depuis 1987\" ou \"cuisine du marché\" ne suffisent pas. Les IAs cherchent des entités précises : nom du chef, formation, inspiration culinaire, fournisseurs locaux nommés, concept en Q&A. C'est ce qui vous rend mémorable pour une IA.",
  },
];

const quickWins = [
  {
    numero: "01", titre: "Ajouter Schema.org Restaurant sur votre site",
    detail: "Intégrez un JSON-LD Restaurant avec : nom, type de cuisine, adresse précise, horaires, fourchette de prix, menu URL et lien vers vos avis. C'est le signal de base qu'attendent ChatGPT et Perplexity pour identifier et recommander un restaurant.",
    duree: "1h", impact: "Très élevé", impactColor: "var(--accent)",
  },
  {
    numero: "02", titre: "Publier votre carte en HTML structuré",
    detail: "Remplacez le PDF ou l'image de menu par une page HTML avec vos plats nommés, ingrédients principaux, origine des produits et mentions allergènes. Les IAs lisent le texte — une carte en HTML balisé est un signal AIO majeur.",
    duree: "3h", impact: "Très élevé", impactColor: "var(--accent)",
  },
  {
    numero: "03", titre: "Créer une page Concept & Histoire en Q&A",
    detail: "Répondez explicitement à : Qui est le chef ? Quelle est son histoire ? D'où viennent vos produits ? Pour quelle occasion venir ? Quelle est votre différence avec les autres restaurants du quartier ? Ces réponses sont exactement ce que les IAs utilisent pour construire leurs recommandations.",
    duree: "2h", impact: "Élevé", impactColor: "var(--accent)",
  },
  {
    numero: "04", titre: "Structurer vos avis avec plats mentionnés",
    detail: "Intégrez sur votre site des avis Schema.org Review qui citent des plats spécifiques, l'occasion de visite et le ressenti. Un avis qui dit 'le risotto aux truffes était exceptionnel pour notre anniversaire' vaut dix fois plus qu'une note générique pour les IAs.",
    duree: "2h", impact: "Élevé", impactColor: "var(--accent)",
  },
  {
    numero: "05", titre: "Créer des pages par occasion de visite",
    detail: "Une page par cas d'usage : repas d'affaires, dîner romantique, brunch en famille, groupe, séminaire. Les IAs répondent souvent à des requêtes d'occasion ('meilleur restaurant pour un anniversaire à Lyon'). Chaque page vous positionne sur une intention différente.",
    duree: "2h/page", impact: "Moyen", impactColor: "#f97316",
  },
];

const faqItems = [
  {
    question: "Pourquoi mon restaurant n'apparaît pas dans les recommandations IA ?",
    reponse: "La plupart des restaurants sont bien référencés sur Google Maps et TripAdvisor, mais ces plateformes ne suffisent pas aux IAs génératives. ChatGPT et Perplexity cherchent des entités structurées sur votre propre site : type de cuisine, spécialités nommées, ambiance, localisation précise, et balisage Schema.org Restaurant.",
  },
  {
    question: "Qu'est-ce que l'AIO pour un restaurant ?",
    reponse: "L'AI Optimization pour la restauration consiste à structurer l'identité du restaurant, sa carte, ses spécialités et son ambiance pour être reconnu et cité par les IAs. Quand un touriste demande à ChatGPT 'quel est le meilleur restaurant de fruits de mer à La Rochelle ?', un restaurant AIO-optimisé a une chance d'apparaître dans la réponse.",
  },
  {
    question: "Quels signaux AIO sont prioritaires pour un restaurant ?",
    reponse: "Les signaux AIO prioritaires : un Schema.org Restaurant avec type de cuisine, spécialités, horaires et localisation, une page À propos en Q&A (origine du chef, concept, fournisseurs locaux), des avis clients avec plats mentionnés explicitement, et du contenu sur les occasions de visite.",
  },
  {
    question: "TripAdvisor et Google Maps suffisent-ils pour les IAs ?",
    reponse: "Non. TripAdvisor et Google Maps sont des plateformes tierces que les IAs consultent mais ne privilégient pas comme sources d'autorité. Pour être cité en priorité, un restaurant doit avoir ses propres signaux AIO sur son site : Schema.org Restaurant, contenu structuré sur ses spécialités, et FAQ répondant aux questions que les clients posent aux IAs avant de réserver.",
  },
];

const auditExemple = {
  marque: "La Table du Fleuve — Cuisine gastronomique bordelaise",
  score: 2.1,
  lacunes: ["Aucun Schema.org Restaurant sur le site", "Menu uniquement en PDF non lisible par les IAs", "Page À propos en texte non structuré", "Avis Google Maps non intégrés sur le site"],
  apresOptimisation: 7.6,
  actionsRealisees: ["Schema.org Restaurant + Menu + Chef", "Carte en HTML avec plats, ingrédients et origine produits", "Page Concept en Q&A (chef, fournisseurs girondins, concept)", "6 pages occasions (anniversaire, affaires, romantique...)"],
};

const autresSecteurs = [
  { label: "Coaching", to: "/aio-coaching" },
  { label: "E-commerce", to: "/aio-ecommerce" },
  { label: "Immobilier", to: "/aio-immobilier" },
  { label: "Conseil RH", to: "/aio-rh" },
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

export default function AioRestauration() {
  useReveal();
  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "var(--text-1)", fontFamily: "'Raleway', sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />

      <Navbar />

      {/* HERO */}
      <section style={{ padding: "100px 60px 80px", maxWidth: "860px", margin: "0 auto" }}>
        <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "24px", fontWeight: 500 }}>
          Secteur — Restauration
        </p>
        <h1 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.8rem, 7vw, 5.5rem)", letterSpacing: "0.04em", lineHeight: 1.05, color: "var(--text-1)", marginBottom: "32px" }}>
          AIO pour les<br /><span style={{ color: "var(--accent)" }}>Restaurants</span>
        </h1>
        <p className="reveal" style={{ fontSize: "0.88rem", color: "var(--text-4)", lineHeight: 1.9, fontWeight: 300, maxWidth: "600px", marginBottom: "40px" }}>
          Vos clients demandent à ChatGPT "où manger une bonne cuisine italienne à Nantes ?" avant même d'ouvrir Google Maps. Si votre restaurant n'est pas structuré pour les IAs, vous n'existez pas dans leur réponse — et le restaurant d'en face peut vous y devancer.
        </p>
        <div className="reveal" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link to="/#audit">
            <button style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", background: "#a3e635", color: "#0f0f0f", fontWeight: 600, border: "none", cursor: "pointer", transition: "opacity 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")} onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
              Auditer mon restaurant →
            </button>
          </Link>
          <Link to="/glossaire">
            <button style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", border: "1px solid #3a3a3a", background: "transparent", color: "#7a7a7a", cursor: "pointer", transition: "border-color 0.3s, color 0.3s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.color = "#e8e8e8"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3a3a"; e.currentTarget.style.color = "#7a7a7a"; }}>
              Glossaire AIO
            </button>
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: "60px", maxWidth: "860px", margin: "0 auto", borderTop: "1px solid var(--border-2)", borderBottom: "1px solid var(--border-2)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            { chiffre: "54%", label: "des clients cherchent un restaurant via IA ou assistant vocal en 2025" },
            { chiffre: "6×", label: "plus de réservations directes pour un restaurant cité par les IAs locales" },
            { chiffre: "3 sem.", label: "pour apparaître dans les réponses IA locales avec Schema.org Restaurant" },
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
          Pourquoi les IAs ignorent<br />la plupart des restaurants
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
            💡 Résultat obtenu en 3 semaines. Le restaurant est désormais cité par ChatGPT sur 5 requêtes locales. Données issues d'un audit Otarcy réel, marque anonymisée.
          </p>
        </div>
      </section>

      {/* QUICK WINS */}
      <section style={{ padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }}>
        <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }}>.03 — Quick Wins</p>
        <h2 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.04em", color: "var(--text-1)", marginBottom: "40px", lineHeight: 1.1 }}>
          5 actions concrètes<br />pour remplir vos tables via les IAs
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
          AIO & Restauration —<br />tout ce qu'il faut savoir
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
            Découvrez le score AIO<br />de votre restaurant
          </h2>
          <p style={{ fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.7, fontWeight: 300, marginBottom: "32px", maxWidth: "480px" }}>
            Otarcy analyse votre restaurant et vous donne un score AIO + des recommandations concrètes pour apparaître dans les réponses de ChatGPT, Perplexity et Claude quand vos clients cherchent où manger.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link to="/#audit">
              <button style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", background: "#a3e635", color: "#0f0f0f", fontWeight: 600, border: "none", cursor: "pointer", transition: "opacity 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")} onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
                Lancer mon audit gratuit →
              </button>
            </Link>
            <Link to="/pricing">
              <button style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", border: "1px solid #3a3a3a", background: "transparent", color: "#7a7a7a", cursor: "pointer", transition: "border-color 0.3s, color 0.3s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.color = "#e8e8e8"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3a3a"; e.currentTarget.style.color = "#7a7a7a"; }}>
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

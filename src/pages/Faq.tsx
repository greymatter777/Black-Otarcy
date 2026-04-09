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

// ─── QUESTIONS ────────────────────────────────────────────────────────────────
const FAQ = [
  {
    categorie: "Le diagnostic",
    couleur: "var(--accent)",
    questions: [
      {
        q: "Qu'est-ce que le diagnostic de présence IA ?",
        r: "Le diagnostic de présence IA vérifie si les signaux techniques que les IAs utilisent pour détecter et citer un site sont en place : Schema.org, crawlers IA autorisés, llms.txt, FAQ structurée, E-E-A-T, Wikidata, Open Graph, HTTPS, Sitemap, Meta tags. Chaque critère est vérifié par parsing HTML — aucune estimation.",
      },
      {
        q: "Comment est calculé le score /100 ?",
        r: "Le score est calculé côté serveur en vérifiant 10 critères techniques. Chaque critère a un poids défini (ex : Accès crawlers IA 15 pts, Schema.org 15 pts, E-E-A-T 15 pts). Le total est normalisé sur 100.",
      },
      {
        q: "Combien de temps dure un audit ?",
        r: "Entre 5 et 15 secondes selon la taille et la complexité du site analysé.",
      },
      {
        q: "Mon site doit-il être en français ?",
        r: "Non. Otarcy analyse les signaux techniques qui sont indépendants de la langue du contenu.",
      },
    ],
  },
  {
    categorie: "Les critères",
    couleur: "#60a5fa",
    questions: [
      {
        q: "Qu'est-ce que le llms.txt ?",
        r: "Le llms.txt est un fichier texte placé à la racine de votre site (comme robots.txt) qui donne aux LLMs des instructions explicites sur votre activité, vos services et votre positionnement. Son absence prive les IAs d'un contexte structuré sur votre marque.",
      },
      {
        q: "Qu'est-ce que le E-E-A-T et pourquoi est-ce important ?",
        r: "E-E-A-T signifie Experience, Expertise, Authoritativeness, Trustworthiness. Ce sont les signaux que les IAs utilisent pour évaluer la crédibilité d'un site : page À propos, mentions légales, CGV, politique de confidentialité, page contact. Leur absence réduit la confiance accordée par les modèles.",
      },
      {
        q: "Pourquoi Schema.org est-il critique ?",
        r: "Schema.org est un vocabulaire structuré que les IAs lisent pour comprendre ce qu'est votre organisation, votre produit, vos prix et votre localisation. Sans lui, les IAs doivent inférer ces informations — avec un risque d'erreur élevé.",
      },
    ],
  },
  {
    categorie: "Plans & compte",
    couleur: "#f97316",
    questions: [
      {
        q: "Quelle est la différence entre les plans ?",
        r: "Le plan Gratuit donne accès à 1 audit avec score global. Le plan Essentiel (19€/mois) donne accès aux audits illimités avec détail par critère et plan d'action. Le plan Expert (99€/mois) inclut en plus la perception réelle par ChatGPT, Claude et Perplexity.",
      },
      {
        q: "Puis-je analyser le site d'un client ?",
        r: "Oui. Otarcy analyse n'importe quelle URL publique — votre propre site ou celui d'un client ou concurrent.",
      },
      {
        q: "Comment résilier mon abonnement ?",
        r: "La résiliation se fait à tout moment depuis votre dashboard, sans engagement ni frais.",
      },
    ],
  },
];

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function Faq() {
  const [ouvert, setOuvert] = useState<string | null>(null);
  useReveal();

  const totalQuestions = FAQ.reduce((acc, cat) => acc + cat.questions.length, 0);

  const toggle = (key: string) => setOuvert(ouvert === key ? null : key);

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>

      {/* Schema.org FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": "https://otarcy.app/faq",
            "name": "FAQ AIO — Otarcy",
            "description": "Questions fréquentes sur l'AI Optimization (AIO), Otarcy et la visibilité des marques dans les IAs.",
            "url": "https://otarcy.app/faq",
            "inLanguage": "fr",
            "publisher": {
              "@type": "Organization",
              "name": "Otarcy",
              "url": "https://otarcy.app"
            },
            "mainEntity": FAQ.flatMap((cat) =>
              cat.questions.map((item) => ({
                "@type": "Question",
                "name": item.q,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": item.r,
                },
              }))
            ),
          }),
        }}
      />

      <Navbar />

      {/* ── HERO ── */}
      <section style={{ paddingTop: "140px", padding: "140px 60px 60px", borderBottom: "1px solid var(--border-1)" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }}>
            Ressource — FAQ
          </p>
          <h1 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "0.06em", color: "var(--text-1)", lineHeight: 0.95, marginBottom: "24px" }}>
            QUESTIONS FRÉQUENTES
          </h1>
          <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.9, fontWeight: 300, maxWidth: "580px" }}>
            {totalQuestions} questions sur le diagnostic de présence IA, les critères techniques vérifiés et les plans Otarcy.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "60px 60px 100px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>

          {FAQ.map((categorie, ci) => (
            <div key={ci} className="reveal" style={{ marginBottom: "56px" }}>

              {/* Titre catégorie */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                <div style={{ width: "3px", height: "24px", background: categorie.couleur, flexShrink: 0 }} />
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: categorie.couleur, textTransform: "uppercase", fontWeight: 500 }}>
                  {categorie.categorie}
                </p>
              </div>

              {/* Questions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-1)" }}>
                {categorie.questions.map((item, qi) => {
                  const key = `${ci}-${qi}`;
                  const isOpen = ouvert === key;
                  return (
                    <div key={qi} style={{ background: isOpen ? "var(--bg-primary)" : "var(--bg-page)", transition: "background 0.2s" }}>
                      <button
                        type="button"
                        onClick={() => toggle(key)}
                        style={{
                          width: "100%", textAlign: "left", background: "transparent",
                          border: "none", cursor: "pointer", padding: "20px 24px",
                          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                          gap: "16px",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget.parentElement as HTMLDivElement).style.background = "var(--bg-primary)"; }}
                        onMouseLeave={(e) => { if (!isOpen) (e.currentTarget.parentElement as HTMLDivElement).style.background = "var(--bg-page)"; }}
                      >
                        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "var(--text-1)", fontWeight: 600, lineHeight: 1.5, margin: 0, flex: 1 }}>
                          {item.q}
                        </p>
                        <span style={{ color: "var(--accent)", fontSize: "0.85rem", flexShrink: 0, display: "inline-block", marginTop: "2px", fontFamily: "'Raleway', sans-serif", fontWeight: 400 }}>
                          {isOpen ? "↓" : "→"}
                        </span>
                      </button>

                      {/* Animation hauteur via grid trick */}
                      <div style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.28s ease", overflow: "hidden" }}>
                        <div style={{ minHeight: 0 }}>
                          <div style={{ padding: "0 24px 24px", borderTop: "1px solid var(--border-1)" }}>
                            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "var(--text-2)", lineHeight: 1.7, fontWeight: 300, margin: "16px 0 0 0" }}>
                              {item.r}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Liens vers ressources */}
          <div className="reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "48px" }}>
            <Link to="/glossaire" style={{ textDecoration: "none", padding: "24px", border: "1px solid var(--border-2)", background: "var(--bg-page)", display: "block", transition: "border-color 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#a3e635"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2a2a2a"; }}
            >
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.08em", color: "var(--accent)", marginBottom: "8px" }}>GLOSSAIRE AIO →</p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-2)", fontWeight: 300, lineHeight: 1.6 }}>
                Tous les termes essentiels de l'AI Optimization définis clairement.
              </p>
            </Link>
            <Link to="/pricing" style={{ textDecoration: "none", padding: "24px", border: "1px solid var(--border-2)", background: "var(--bg-page)", display: "block", transition: "border-color 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#60a5fa"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2a2a2a"; }}
            >
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.08em", color: "#60a5fa", marginBottom: "8px" }}>TARIFS →</p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-2)", fontWeight: 300, lineHeight: 1.6 }}>
                Comparez les plans Gratuit, Essentiel et Expert.
              </p>
            </Link>
          </div>

          {/* CTA */}
          <div className="reveal" style={{ padding: "32px", border: "1px solid var(--accent)", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
            <div>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.08em", color: "var(--text-1)", marginBottom: "6px" }}>
                PRÊT POUR LE DIAGNOSTIC ?
              </p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "var(--text-2)", fontWeight: 300 }}>
                1 audit gratuit — sans carte bancaire.
              </p>
            </div>
            <Link to="/"
              style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "12px 28px", background: "var(--accent)", color: "var(--bg-page)", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Lancer le diagnostic →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

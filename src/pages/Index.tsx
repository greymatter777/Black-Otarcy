import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../lib/useAuthFetch";
import { useTheme } from "../lib/ThemeContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ─── HOOK: Scroll Reveal ──────────────────────────────
function useReveal(deps: any[] = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.05 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ─── SIDE ELEMENTS ────────────────────────────────────
const SideLeft = () => {
  const { theme } = useTheme();
  if (theme === "light") return null;
  return (
    <div className="side-elements" style={{ position: "fixed", left: "20px", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "18px", zIndex: 50 }}>
      <a href="https://www.linkedin.com/company/otarcy-france" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      </a>
      <a href="https://www.instagram.com/otarcy.app/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      </a>
    </div>
  );
};

const SideRight = () => {
  const { theme } = useTheme();
  if (theme === "light") return null;
  return (
    <div className="side-elements" style={{ position: "fixed", right: "18px", top: "50%", transform: "translateY(-50%) rotate(90deg)", zIndex: 50 }}>
      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.35em", color: "var(--text-3)", fontWeight: 500, textTransform: "uppercase" }}>SCROLL</span>
    </div>
  );
};

// ─── HERO ─────────────────────────────────────────────
const Hero: React.FC<{ isSignedIn: boolean; onSignIn: () => void; searchBar: React.ReactNode }> = ({ isSignedIn, searchBar }) => (
  <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "var(--bg-hero)", position: "relative", padding: "0 60px" }}>
    <span style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--text-3)" }}>.01</span>

    <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "24px", fontWeight: 500 }}>
      Diagnostic de présence IA
    </p>
    <h1 className="reveal otarcytitle" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(5rem, 14vw, 11rem)", letterSpacing: "0.04em", color: "var(--text-1)", lineHeight: 0.9, textTransform: "uppercase" }}>
      OTARCY
    </h1>
    <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", letterSpacing: "0.22em", color: "var(--text-2)", marginTop: "28px", textTransform: "uppercase", fontWeight: 300, maxWidth: "520px" }}>
      Votre site est-il visible pour les IAs ?
    </p>
    <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", letterSpacing: "0.15em", color: "var(--text-3)", marginTop: "12px", fontWeight: 300 }}>
      ChatGPT · Claude · Gemini · Perplexity
    </p>

    <div className="reveal" style={{ marginTop: "40px", width: "100%", maxWidth: "540px" }}>
      {searchBar}
    </div>
  </section>
);

// ─── NEWSLETTER SECTION ───────────────────────────────
const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setErrorMsg("Adresse email invalide.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur");
      setStatus("success");
      setEmail("");
    } catch (err: any) {
      setErrorMsg(err.message || "Une erreur est survenue.");
      setStatus("error");
    }
  };

  return (
    <section
      id="newsletter"
      style={{
        background: "var(--bg-primary)",
        borderTop: "1px solid var(--border-1)",
        borderBottom: "1px solid var(--border-1)",
        padding: "80px 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        {/* Label section */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", fontFamily: "'Raleway', sans-serif", fontWeight: 500 }}>
            .04 — Newsletter
          </span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, var(--accent) 0%, transparent 100%)" }} />
        </div>

        {/* Titre */}
        <h2 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.06em", color: "var(--text-1)", lineHeight: 0.95, margin: "0 0 10px 0" }}>
          LE BRIEF{" "}
          <em style={{ color: "var(--accent)", fontStyle: "italic" }}>AIO</em>
        </h2>

        {/* Cadence */}
        <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--text-3)", textTransform: "uppercase", margin: "0 0 20px 0" }}>
          Chaque dimanche matin — 5 min de veille AIO
        </p>

        {/* Description */}
        <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "var(--text-2)", lineHeight: 1.9, fontWeight: 300, margin: "0 0 36px 0", maxWidth: "520px" }}>
          Les dernières évolutions de l'AI Optimization, les marques qui gagnent de la visibilité auprès de ChatGPT, Claude et Perplexity — et ce que ça change concrètement pour votre stratégie.
        </p>

        {/* Bullets */}
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            "1 synthèse des actus AIO de la semaine",
            "1 marque analysée sous l'angle IA",
            "1 action concrète à implémenter",
          ].map((item, i) => (
            <li key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "var(--text-2)", fontWeight: 300 }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
              {item}
            </li>
          ))}
        </ul>

        {/* Formulaire */}
        {status === "success" ? (
          <div style={{ border: "1px solid var(--accent)", padding: "20px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ color: "var(--accent)", fontSize: "18px" }}>✓</span>
            <div>
              <p style={{ fontFamily: "'Raleway', sans-serif", color: "var(--accent)", margin: 0, fontSize: "0.76rem", fontWeight: 600, letterSpacing: "0.05em" }}>Inscription confirmée</p>
              <p style={{ fontFamily: "'Raleway', sans-serif", color: "var(--text-3)", margin: "4px 0 0 0", fontSize: "0.68rem", letterSpacing: "0.05em" }}>Prochain Brief AIO — dimanche matin dans votre boîte.</p>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", border: "1px solid var(--border-2)" }}>
              <input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={{
                  flex: 1, background: "var(--bg-input-nl)", border: "none", outline: "none",
                  padding: "13px 16px", color: "var(--text-1)", fontSize: "0.76rem",
                  fontFamily: "'Raleway', sans-serif", caretColor: "var(--accent)",
                }}
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={status === "loading"}
                style={{
                  background: status === "loading" ? "#1a2a0a" : "var(--accent)",
                  border: "none", padding: "13px 24px", color: "var(--bg-primary)",
                  fontSize: "0.66rem", fontWeight: 700, fontFamily: "'Raleway', sans-serif",
                  letterSpacing: "0.22em", cursor: status === "loading" ? "wait" : "pointer",
                  textTransform: "uppercase", transition: "opacity 0.2s", whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => { if (status !== "loading") e.currentTarget.style.opacity = "0.85"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                {status === "loading" ? "..." : "S'abonner →"}
              </button>
            </div>

            {status === "error" && (
              <p style={{ fontFamily: "'Raleway', sans-serif", color: "#ef4444", fontSize: "0.68rem", margin: "8px 0 0 0", letterSpacing: "0.05em" }}>{errorMsg}</p>
            )}

            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "var(--accent)", margin: "12px 0 0 0", letterSpacing: "0.1em" }}>
              Gratuit. Aucun spam. Désabonnement en 1 clic.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};


// ─── PAGE ─────────────────────────────────────────────
const Index = () => {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [userPlan, setUserPlan] = useState<string>("free");

  const { user } = useAuth();
  const navigate = useNavigate();
  const isSignedIn = !!user;

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "faq-schema";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Qu'est-ce que le diagnostic de présence IA ?",
          "acceptedAnswer": { "@type": "Answer", "text": "Le diagnostic de présence IA vérifie si les signaux techniques que les IAs utilisent pour détecter et citer un site sont en place : Schema.org, crawlers IA autorisés, llms.txt, FAQ structurée, E-E-A-T, Wikidata, Open Graph, HTTPS, Sitemap, Meta tags. Chaque critère est vérifié par parsing HTML — aucune estimation." }
        },
        {
          "@type": "Question",
          "name": "Comment est calculé le score /100 ?",
          "acceptedAnswer": { "@type": "Answer", "text": "Le score est calculé côté serveur en vérifiant 10 critères techniques. Chaque critère a un poids défini (ex : Accès crawlers IA 15 pts, Schema.org 15 pts, E-E-A-T 15 pts). Le total est normalisé sur 100." }
        },
        {
          "@type": "Question",
          "name": "Combien de temps dure un audit ?",
          "acceptedAnswer": { "@type": "Answer", "text": "Entre 5 et 15 secondes selon la taille et la complexité du site analysé." }
        },
        {
          "@type": "Question",
          "name": "Mon site doit-il être en français ?",
          "acceptedAnswer": { "@type": "Answer", "text": "Non. Otarcy analyse les signaux techniques qui sont indépendants de la langue du contenu." }
        },
        {
          "@type": "Question",
          "name": "Qu'est-ce que le llms.txt ?",
          "acceptedAnswer": { "@type": "Answer", "text": "Le llms.txt est un fichier texte placé à la racine de votre site (comme robots.txt) qui donne aux LLMs des instructions explicites sur votre activité, vos services et votre positionnement. Son absence prive les IAs d'un contexte structuré sur votre marque." }
        },
        {
          "@type": "Question",
          "name": "Qu'est-ce que le E-E-A-T et pourquoi est-ce important ?",
          "acceptedAnswer": { "@type": "Answer", "text": "E-E-A-T signifie Experience, Expertise, Authoritativeness, Trustworthiness. Ce sont les signaux que les IAs utilisent pour évaluer la crédibilité d'un site : page À propos, mentions légales, CGV, politique de confidentialité, page contact. Leur absence réduit la confiance accordée par les modèles." }
        },
        {
          "@type": "Question",
          "name": "Pourquoi Schema.org est-il critique ?",
          "acceptedAnswer": { "@type": "Answer", "text": "Schema.org est un vocabulaire structuré que les IAs lisent pour comprendre ce qu'est votre organisation, votre produit, vos prix et votre localisation. Sans lui, les IAs doivent inférer ces informations — avec un risque d'erreur élevé." }
        },
        {
          "@type": "Question",
          "name": "Quelle est la différence entre les plans ?",
          "acceptedAnswer": { "@type": "Answer", "text": "Le plan Gratuit donne accès à 1 audit avec score global. Le plan Essentiel (19€/mois) donne accès aux audits illimités avec détail par critère et plan d'action. Le plan Expert (99€/mois) inclut en plus la perception réelle par ChatGPT, Claude et Perplexity." }
        },
        {
          "@type": "Question",
          "name": "Puis-je analyser le site d'un client ?",
          "acceptedAnswer": { "@type": "Answer", "text": "Oui. Otarcy analyse n'importe quelle URL publique — votre propre site ou celui d'un client ou concurrent." }
        },
        {
          "@type": "Question",
          "name": "Comment résilier mon abonnement ?",
          "acceptedAnswer": { "@type": "Answer", "text": "La résiliation se fait à tout moment depuis votre dashboard, sans engagement ni frais." }
        }
      ]
    });
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById("faq-schema");
      if (el) el.remove();
    };
  }, []);

  useEffect(() => {
    if (isSignedIn && user) {
      authFetch("/api/user-status")
        .then((r) => r.json())
        .then((d) => { setUserPlan(d.plan ?? "free"); })
        .catch(() => {});
    }
  }, [isSignedIn, user]);

  const handleSubmit = () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl || !isSignedIn) return;

    try {
      new URL(trimmedUrl);
    } catch {
      return;
    }

    setLoading(true);
    sessionStorage.setItem("otarcy_audit_url", trimmedUrl);
    sessionStorage.removeItem("otarcy_brand");

    if (userPlan === "free") navigate("/score");
    else if (userPlan === "pro") navigate("/audit");
    else if (userPlan === "agency") navigate("/audit");
    else navigate("/score");
  };

  useReveal([]);

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh" }}>
      <Navbar />
      <SideLeft />
      <SideRight />
      <Hero
        isSignedIn={!!isSignedIn}
        onSignIn={() => navigate("/login")}
        searchBar={
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex" }}>
              <input
                type="url"
                placeholder="https://votre-site.fr"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && isSignedIn && handleSubmit()}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "1px solid var(--border-2)",
                  borderRight: "none",
                  padding: "13px 18px",
                  color: "var(--text-1)",
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.76rem",
                  letterSpacing: "0.08em",
                  outline: "none",
                  caretColor: "var(--accent)",
                }}
              />
              <button
                type="button"
                onClick={isSignedIn ? handleSubmit : () => navigate("/login")}
                disabled={loading}
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.66rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  padding: "13px 28px",
                  background: loading ? "#555" : "var(--accent)",
                  color: "var(--bg-page)",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  transition: "opacity 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.85"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                {loading ? "Analyse…" : isSignedIn ? "Analyser →" : "Commencer →"}
              </button>
            </div>
            {!isSignedIn && (
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.15em", color: "var(--text-3)", textAlign: "center" }}>
                3 audits offerts — sans carte bancaire
              </p>
            )}
          </div>
        }
      />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;

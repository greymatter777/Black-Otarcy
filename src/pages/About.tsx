import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

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

// ─── NAV ──────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { label: "À PROPOS", to: "/about" },
    { label: "NEWSLETTER", to: "#newsletter" },
    { label: "TARIFS", to: "/pricing" },
    { label: "BLOG", to: "/blog" },
  ];

  const handleScrollLink = (id: string) => {
    setMobileOpen(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <>
      <style>{`
        .nav-desktop { display: flex; }
        .nav-hamburger { display: none; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 24px",
        background: scrolled ? "rgba(15,15,15,0.97)" : "rgba(15,15,15,0.6)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        transition: "background 0.4s",
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", flexDirection: "column", lineHeight: 0.9, textDecoration: "none" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#f0f0f0" }}>OT</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#7a7a7a" }}>CY</span>
        </Link>

        {/* ── DESKTOP NAV ── */}
        <div className="nav-desktop" style={{ gap: "28px", alignItems: "center" }}>
          {navLinks.map((item) => (
            item.to.startsWith("#") ? (
              <button key={item.label} type="button"
                onClick={() => handleScrollLink(item.to.replace("#", ""))}
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#7a7a7a", fontWeight: 500, background: "transparent", border: "none", cursor: "pointer", transition: "color 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
              >{item.label}</button>
            ) : (
              <Link key={item.label} to={item.to}
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#7a7a7a", fontWeight: 500, textDecoration: "none", transition: "color 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0f0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
              >{item.label}</Link>
            )
          ))}

          {/* Auth desktop */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Link to="/dashboard"
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.15em", color: "#7a7a7a", textDecoration: "none", transition: "color 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
              >{user?.user_metadata?.full_name ?? user?.email}</Link>
              <button type="button" onClick={() => signOut().then(() => navigate("/login"))}
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4a4a4a", background: "transparent", border: "none", cursor: "pointer", transition: "color 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}
              >Déconnexion</button>
            </div>
          ) : (
            <button type="button" onClick={() => navigate("/login")}
              style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "7px 16px", border: "1px solid #3a3a3a", background: "transparent", color: "#e8e8e8", cursor: "pointer", transition: "border-color 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e8e8e8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3a3a"; }}
            >Connexion</button>
          )}
        </div>

        {/* ── HAMBURGER BUTTON (mobile uniquement) ── */}
        <button
          className="nav-hamburger"
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          style={{ flexDirection: "column", gap: "5px", background: "transparent", border: "none", cursor: "pointer", padding: "4px", zIndex: 110 }}
          aria-label="Menu"
        >
          <span style={{ display: "block", width: "22px", height: "1.5px", background: mobileOpen ? "#a3e635" : "#e8e8e8", transition: "transform 0.3s, opacity 0.3s", transform: mobileOpen ? "translateY(6.5px) rotate(45deg)" : "none" }} />
          <span style={{ display: "block", width: "22px", height: "1.5px", background: "#e8e8e8", transition: "opacity 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: "22px", height: "1.5px", background: mobileOpen ? "#a3e635" : "#e8e8e8", transition: "transform 0.3s, opacity 0.3s", transform: mobileOpen ? "translateY(-6.5px) rotate(-45deg)" : "none" }} />
        </button>
      </nav>

      {/* ── MOBILE MENU OVERLAY ── */}
      {mobileOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "#0a0a0a", zIndex: 99,
          display: "flex", flexDirection: "column",
          padding: "100px 32px 48px",
          overflowY: "auto",
        }}>
          {navLinks.map((item) => (
            item.to.startsWith("#") ? (
              <button key={item.label} type="button"
                onClick={() => handleScrollLink(item.to.replace("#", ""))}
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.8rem", letterSpacing: "0.25em", color: "#7a7a7a", fontWeight: 500, background: "transparent", border: "none", borderBottom: "1px solid #1a1a1a", cursor: "pointer", padding: "18px 0", textAlign: "left", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
              >{item.label}</button>
            ) : (
              <Link key={item.label} to={item.to}
                onClick={() => setMobileOpen(false)}
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.8rem", letterSpacing: "0.25em", color: "#7a7a7a", fontWeight: 500, textDecoration: "none", borderBottom: "1px solid #1a1a1a", padding: "18px 0", display: "block", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0f0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
              >{item.label}</Link>
            )
          ))}

          {/* Auth mobile */}
          <div style={{ marginTop: "32px" }}>
            {user ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                  style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", letterSpacing: "0.15em", color: "#7a7a7a", textDecoration: "none" }}
                >{user?.user_metadata?.full_name ?? user?.email}</Link>
                <button type="button" onClick={() => { setMobileOpen(false); signOut().then(() => navigate("/login")); }}
                  style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", background: "transparent", border: "1px solid #3a1a1a", padding: "10px 16px", cursor: "pointer", textAlign: "left" }}
                >Déconnexion</button>
              </div>
            ) : (
              <button type="button" onClick={() => { setMobileOpen(false); navigate("/login"); }}
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "12px 24px", border: "1px solid #3a3a3a", background: "transparent", color: "#e8e8e8", cursor: "pointer", width: "100%" }}
              >Connexion</button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ background: "#0a0a0a", borderTop: "1px solid #1a1a1a", padding: "60px 60px 40px" }}>
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "40px", marginBottom: "48px" }}>

        {/* Colonne 1 — Identité */}
        <div>
          <div style={{ marginBottom: "20px" }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.15em", color: "#f0f0f0", display: "block", lineHeight: 0.9 }}>OT</span>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.15em", color: "#7a7a7a", display: "block", lineHeight: 0.9 }}>CY</span>
          </div>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#4a4a4a", lineHeight: 1.8, fontWeight: 300, maxWidth: "200px" }}>
            Le diagnostic de présence IA pour les PME.
          </p>
          <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
            <a href="https://www.linkedin.com/company/otarcy-france" target="_blank" rel="noopener noreferrer" style={{ display: "flex" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                onMouseEnter={(e) => ((e.currentTarget as SVGElement).style.stroke = "#a3e635")}
                onMouseLeave={(e) => ((e.currentTarget as SVGElement).style.stroke = "#4a4a4a")}
              >
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a href="https://www.instagram.com/otarcy.app/" target="_blank" rel="noopener noreferrer" style={{ display: "flex" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                onMouseEnter={(e) => ((e.currentTarget as SVGElement).style.stroke = "#a3e635")}
                onMouseLeave={(e) => ((e.currentTarget as SVGElement).style.stroke = "#4a4a4a")}
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>

        {/* Colonne 2 — Produit */}
        <div>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#3a3a3a", textTransform: "uppercase", marginBottom: "16px" }}>
            Produit
          </p>
          {[
            { label: "Diagnostic IA", to: "#audit", scroll: true },
            { label: "Tarifs", to: "/pricing", scroll: false },
            { label: "Dashboard", to: "/dashboard", scroll: false },
          ].map((item) => (
            item.scroll ? (
              <button key={item.label} type="button"
                onClick={() => document.getElementById("audit")?.scrollIntoView({ behavior: "smooth" })}
                style={{ display: "block", fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#4a4a4a", background: "transparent", border: "none", cursor: "pointer", padding: "0 0 10px 0", letterSpacing: "0.05em", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0f0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}
              >{item.label}</button>
            ) : (
              <Link key={item.label} to={item.to}
                style={{ display: "block", fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#4a4a4a", textDecoration: "none", marginBottom: "10px", letterSpacing: "0.05em", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0f0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}
              >{item.label}</Link>
            )
          ))}
        </div>

        {/* Colonne 3 — Ressources */}
        <div>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#3a3a3a", textTransform: "uppercase", marginBottom: "16px" }}>
            Ressources
          </p>
          {[
            { label: "Glossaire AIO", to: "/glossaire", scroll: false },
            { label: "FAQ", to: "/faq", scroll: false },
            { label: "Newsletter", to: "#newsletter", scroll: true },
          ].map((item) => (
            item.scroll ? (
              <button key={item.label} type="button"
                onClick={() => document.getElementById("newsletter")?.scrollIntoView({ behavior: "smooth" })}
                style={{ display: "block", fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#4a4a4a", background: "transparent", border: "none", cursor: "pointer", padding: "0 0 10px 0", letterSpacing: "0.05em", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#a3e635")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}
              >{item.label}</button>
            ) : (
              <Link key={item.label} to={item.to}
                style={{ display: "block", fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#4a4a4a", textDecoration: "none", marginBottom: "10px", letterSpacing: "0.05em", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#a3e635")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}
              >{item.label}</Link>
            )
          ))}
        </div>

      </div>

      {/* Bas de footer */}
      <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "#2a2a2a", letterSpacing: "0.05em" }}>
          © 2025 Otarcy France — Bordeaux, Gironde
        </p>
      </div>
    </div>
  </footer>
);

// ─── SECTION À PROPOS ─────────────────────────────────
const AboutSection = () => (
  <section id="about" style={{ padding: "100px 60px", background: "#0f0f0f", borderTop: "1px solid #1a1a1a" }}>
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>

      <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }}>
        .01 — À propos
      </p>
      <h2 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "0.06em", color: "#f0f0f0", marginBottom: "24px", lineHeight: 0.95 }}>
        QU'EST-CE QU'OTARCY ?
      </h2>
      <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.88rem", color: "#7a7a7a", lineHeight: 1.9, fontWeight: 300, maxWidth: "600px", marginBottom: "64px" }}>
        Otarcy est un outil de diagnostic de présence IA conçu pour les PME, startups et indépendants qui veulent savoir si leur site est visible pour ChatGPT, Claude, Gemini et Perplexity.
      </p>

      {/* Bloc Qui / Quoi / Pourquoi — format questions/réponses lisible par les IAs */}
      <div className="reveal" style={{ marginBottom: "48px", padding: "32px", border: "1px solid #2a2a2a", background: "#0a0a0a" }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "28px" }}>
          Définition
        </p>
        {[
          {
            q: "Qu'est-ce que le diagnostic de présence IA ?",
            a: "Le diagnostic de présence IA vérifie si les signaux techniques que les intelligences artificielles utilisent pour détecter et citer une marque sont en place sur votre site : Schema.org, crawlers IA autorisés, llms.txt, FAQ structurée, E-E-A-T, Wikidata, Open Graph… Ces signaux sont vérifiés par parsing HTML — aucune estimation, uniquement des faits.",
          },
          {
            q: "À qui s'adresse Otarcy ?",
            a: "Otarcy s'adresse aux fondateurs, responsables marketing et équipes de PME ou startups déjà présents en ligne mais qui ne savent pas si leur site est correctement configuré pour être détecté par les IAs conversationnelles.",
          },
          {
            q: "Comment fonctionne Otarcy concrètement ?",
            a: "L'utilisateur entre l'URL de son site. Otarcy vérifie en quelques secondes 10 critères techniques, calcule un score /100 côté serveur, et selon le plan, détaille les critères, propose des quick wins et interroge 4 LLMs sur la perception réelle de la marque.",
          },
        ].map((item, i) => (
          <div key={i} style={{ marginBottom: i < 2 ? "28px" : 0, paddingBottom: i < 2 ? "28px" : 0, borderBottom: i < 2 ? "1px solid #1a1a1a" : "none" }}>
            <div style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "flex-start" }}>
              <span style={{ color: "#a3e635", fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", flexShrink: 0, marginTop: "2px" }}>Q</span>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#f0f0f0", lineHeight: 1.6, fontWeight: 600 }}>{item.q}</p>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", paddingLeft: "4px" }}>
              <span style={{ color: "#7a7a7a", fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", flexShrink: 0, marginTop: "2px" }}>A</span>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#7a7a7a", lineHeight: 1.7, fontWeight: 300 }}>{item.a}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Valeurs / Positionnement */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "48px" }}>
        {[
          {
            num: "01",
            title: "Accessible",
            desc: "Entrez une URL — obtenez un score et des résultats en quelques secondes, sans configuration ni expertise technique.",
            color: "#a3e635",
          },
          {
            num: "02",
            title: "Actionnable",
            desc: "Chaque critère manquant est accompagné d'un quick win : ce qui bloque, pourquoi, et comment corriger.",
            color: "#60a5fa",
          },
          {
            num: "03",
            title: "Conçu pour les PME",
            desc: "Un outil positionné entre le diagnostic gratuit et les solutions enterprise, pensé pour les équipes sans ressources dédiées à la présence IA.",
            color: "#f97316",
          },
        ].map((f) => (
          <div key={f.num} className="reveal" style={{ padding: "28px", border: "1px solid #1a1a1a", background: "#0f0f0f" }}>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", letterSpacing: "0.15em", color: f.color, marginBottom: "10px" }}>{f.num}</p>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem", letterSpacing: "0.08em", color: "#f0f0f0", marginBottom: "10px" }}>{f.title}</p>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#7a7a7a", lineHeight: 1.7, fontWeight: 300 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Contexte & Origine */}
      <div className="reveal" style={{ padding: "28px 32px", border: "1px solid #2a2a2a", background: "#0a0a0a", borderLeft: "2px solid #a3e635" }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "16px" }}>
          Contexte & Origine
        </p>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.8, fontWeight: 300, marginBottom: "16px" }}>
          Otarcy est né d'un constat simple : en 2024-2025, les IAs conversationnelles ont capturé une part croissante des requêtes commerciales, mais aucune solution accessible n'existait pour vérifier objectivement si un site était correctement configuré pour être détecté et cité par ces modèles.
        </p>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.8, fontWeight: 300 }}>
          Développé et lancé en France, Otarcy est aujourd'hui la première solution française de diagnostic de présence IA pour les PME — un segment laissé de côté par les solutions enterprise comme Semrush ou BrightEdge.
        </p>
      </div>

    </div>
  </section>
);

// ─── SECTION COMMENT ÇA MARCHE ────────────────────────
const WhyAio = () => (
  <section style={{ padding: "100px 60px", background: "#0a0a0a", borderTop: "1px solid #1a1a1a" }}>
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px" }}>
        .02 — Comment ça marche ?
      </p>
      <h2 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "0.06em", color: "#f0f0f0", marginBottom: "24px", lineHeight: 0.95 }}>
        10 VÉRIFICATEURS<br />TECHNIQUES
      </h2>
      <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.88rem", color: "#7a7a7a", lineHeight: 1.9, fontWeight: 300, maxWidth: "580px", marginBottom: "64px" }}>
        Otarcy analyse l'URL de votre site et vérifie les signaux concrets que les IAs utilisent pour détecter, comprendre et citer une marque. Aucune estimation — uniquement des faits techniques.
      </p>

      {/* Chiffres clés */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1px", background: "#1a1a1a", marginBottom: "64px" }}>
        {[
          { stat: "10", desc: "critères techniques vérifiés : Schema.org, crawlers IA, llms.txt, E-E-A-T, FAQ, Wikidata…" },
          { stat: "/100", desc: "score de présence calculé côté serveur, par parsing HTML — aucun LLM impliqué" },
          { stat: "4", desc: "LLMs interrogés en parallèle sur le plan Expert : Claude, GPT-4o, Gemini, Perplexity" },
        ].map((item, i) => (
          <div key={i} className="reveal" style={{ padding: "40px 28px", background: "#0a0a0a" }}>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", color: "#a3e635", letterSpacing: "0.04em", lineHeight: 1, marginBottom: "12px" }}>{item.stat}</p>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#7a7a7a", lineHeight: 1.7, fontWeight: 300 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Ce qu'Otarcy fait */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
        {[
          { num: "01", title: "Score /100", desc: "Vérification des signaux techniques : Schema.org, crawlers IA, llms.txt, HTTPS, Open Graph, Sitemap…", color: "#a3e635" },
          { num: "02", title: "Détail & quick wins", desc: "Statut de chaque critère, points perdus identifiés, actions prioritaires classées par impact.", color: "#60a5fa" },
          { num: "03", title: "Perception LLMs", desc: "4 LLMs interrogés en direct sur votre marque — verbatim brut, analyse delta, lacunes détectées.", color: "#f97316" },
        ].map((f) => (
          <div key={f.num} className="reveal" style={{ padding: "28px", border: "1px solid #1a1a1a", background: "#0f0f0f" }}>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", letterSpacing: "0.15em", color: f.color, marginBottom: "10px" }}>{f.num}</p>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem", letterSpacing: "0.08em", color: "#f0f0f0", marginBottom: "10px" }}>{f.title}</p>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#7a7a7a", lineHeight: 1.7, fontWeight: 300 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="reveal" style={{ marginTop: "48px", textAlign: "center" }}>
        <Link to="/"
          style={{ display: "inline-block", fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 36px", background: "#a3e635", color: "#0f0f0f", textDecoration: "none", fontWeight: 600, transition: "opacity 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Lancer le diagnostic →
        </Link>
      </div>
    </div>
  </section>
);

// ─── PAGE ─────────────────────────────────────────────
export default function About() {
  useReveal([]);
  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ paddingTop: "80px" }}>
        <AboutSection />
        <WhyAio />
      </div>
      <Footer />
    </div>
  );
}

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
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

// ─── SECTION À PROPOS ─────────────────────────────────
const AboutSection = () => (
  <section id="about" style={{ padding: "100px 60px", background: "var(--bg-page)", borderTop: "1px solid var(--border-1)" }}>
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>

      <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }}>
        .01 — À propos
      </p>
      <h2 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "0.06em", color: "var(--text-1)", marginBottom: "24px", lineHeight: 0.95 }}>
        QU'EST-CE QU'OTARCY ?
      </h2>
      <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.9, fontWeight: 300, maxWidth: "600px", marginBottom: "64px" }}>
        Otarcy est un outil de diagnostic de présence IA conçu pour les PME, startups et indépendants qui veulent savoir si leur site est visible pour ChatGPT, Claude, Gemini et Perplexity.
      </p>

      {/* Bloc Qui / Quoi / Pourquoi — format questions/réponses lisible par les IAs */}
      <div className="reveal" style={{ marginBottom: "48px", padding: "32px", border: "1px solid var(--border-2)", background: "var(--bg-primary)" }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "28px" }}>
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
          <div key={i} style={{ marginBottom: i < 2 ? "28px" : 0, paddingBottom: i < 2 ? "28px" : 0, borderBottom: i < 2 ? "1px solid var(--border-1)" : "none" }}>
            <div style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "flex-start" }}>
              <span style={{ color: "var(--accent)", fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", flexShrink: 0, marginTop: "2px" }}>Q</span>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "var(--text-1)", lineHeight: 1.6, fontWeight: 600 }}>{item.q}</p>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", paddingLeft: "4px" }}>
              <span style={{ color: "var(--text-2)", fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", flexShrink: 0, marginTop: "2px" }}>A</span>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "var(--text-2)", lineHeight: 1.7, fontWeight: 300 }}>{item.a}</p>
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
            color: "var(--accent)",
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
          <div key={f.num} className="reveal" style={{ padding: "28px", border: "1px solid var(--border-1)", background: "var(--bg-page)" }}>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", letterSpacing: "0.15em", color: f.color, marginBottom: "10px" }}>{f.num}</p>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem", letterSpacing: "0.08em", color: "var(--text-1)", marginBottom: "10px" }}>{f.title}</p>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "var(--text-2)", lineHeight: 1.7, fontWeight: 300 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Contexte & Origine */}
      <div className="reveal" style={{ padding: "28px 32px", border: "1px solid var(--border-2)", background: "var(--bg-primary)", borderLeft: "2px solid var(--accent)" }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "16px" }}>
          Contexte & Origine
        </p>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "var(--text-4)", lineHeight: 1.8, fontWeight: 300, marginBottom: "16px" }}>
          Otarcy est né d'un constat simple : en 2024-2025, les IAs conversationnelles ont capturé une part croissante des requêtes commerciales, mais aucune solution accessible n'existait pour vérifier objectivement si un site était correctement configuré pour être détecté et cité par ces modèles.
        </p>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "var(--text-4)", lineHeight: 1.8, fontWeight: 300 }}>
          Développé et lancé en France, Otarcy est aujourd'hui la première solution française de diagnostic de présence IA pour les PME — un segment laissé de côté par les solutions enterprise comme Semrush ou BrightEdge.
        </p>
      </div>

    </div>
  </section>
);

// ─── SECTION COMMENT ÇA MARCHE ────────────────────────
const WhyAio = () => (
  <section style={{ padding: "100px 60px", background: "var(--bg-primary)", borderTop: "1px solid var(--border-1)" }}>
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "16px" }}>
        .02 — Comment ça marche ?
      </p>
      <h2 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "0.06em", color: "var(--text-1)", marginBottom: "24px", lineHeight: 0.95 }}>
        10 VÉRIFICATEURS<br />TECHNIQUES
      </h2>
      <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.9, fontWeight: 300, maxWidth: "580px", marginBottom: "64px" }}>
        Otarcy analyse l'URL de votre site et vérifie les signaux concrets que les IAs utilisent pour détecter, comprendre et citer une marque. Aucune estimation — uniquement des faits techniques.
      </p>

      {/* Chiffres clés */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1px", background: "var(--border-1)", marginBottom: "64px" }}>
        {[
          { stat: "10", desc: "critères techniques vérifiés : Schema.org, crawlers IA, llms.txt, E-E-A-T, FAQ, Wikidata…" },
          { stat: "/100", desc: "score de présence calculé côté serveur, par parsing HTML — aucun LLM impliqué" },
          { stat: "4", desc: "LLMs interrogés en parallèle sur le plan Expert : Claude, GPT-4o, Gemini, Perplexity" },
        ].map((item, i) => (
          <div key={i} className="reveal" style={{ padding: "40px 28px", background: "var(--bg-primary)" }}>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", color: "var(--accent)", letterSpacing: "0.04em", lineHeight: 1, marginBottom: "12px" }}>{item.stat}</p>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "var(--text-2)", lineHeight: 1.7, fontWeight: 300 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Ce qu'Otarcy fait */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
        {[
          { num: "01", title: "Score /100", desc: "Vérification des signaux techniques : Schema.org, crawlers IA, llms.txt, HTTPS, Open Graph, Sitemap…", color: "var(--accent)" },
          { num: "02", title: "Détail & quick wins", desc: "Statut de chaque critère, points perdus identifiés, actions prioritaires classées par impact.", color: "#60a5fa" },
          { num: "03", title: "Perception LLMs", desc: "4 LLMs interrogés en direct sur votre marque — verbatim brut, analyse delta, lacunes détectées.", color: "#f97316" },
        ].map((f) => (
          <div key={f.num} className="reveal" style={{ padding: "28px", border: "1px solid var(--border-1)", background: "var(--bg-page)" }}>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", letterSpacing: "0.15em", color: f.color, marginBottom: "10px" }}>{f.num}</p>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem", letterSpacing: "0.08em", color: "var(--text-1)", marginBottom: "10px" }}>{f.title}</p>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "var(--text-2)", lineHeight: 1.7, fontWeight: 300 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="reveal" style={{ marginTop: "48px", textAlign: "center" }}>
        <Link to="/"
          style={{ display: "inline-block", fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 36px", background: "var(--accent)", color: "var(--bg-page)", textDecoration: "none", fontWeight: 600, transition: "opacity 0.2s" }}
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
    <div style={{ background: "var(--bg-page)", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ paddingTop: "80px" }}>
        <AboutSection />
        <WhyAio />
      </div>
      <Footer />
    </div>
  );
}

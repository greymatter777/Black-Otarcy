import React, { useEffect } from "react";
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

// ─── SECTION POLITIQUE DE CONFIDENTIALITÉ ────────────
const ConfidentialiteSection = () => (
  <section style={{ padding: "100px 60px", background: "var(--bg-page)", borderTop: "1px solid var(--border-1)" }}>
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>

      <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }}>
        .01 — Politique de confidentialité
      </p>
      <h2 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "0.06em", color: "var(--text-1)", marginBottom: "16px", lineHeight: 0.95 }}>
        DONNÉES & CONFIDENTIALITÉ
      </h2>
      <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.9, fontWeight: 300, maxWidth: "600px", marginBottom: "48px" }}>
        Otarcy est conforme au Règlement Général sur la Protection des Données (RGPD). Vos données ne sont jamais revendues ni partagées à des tiers à des fins commerciales.
      </p>

      {[
        {
          label: "1. Données collectées",
          content: (
            <ul style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.9, fontWeight: 300, paddingLeft: "16px", margin: 0 }}>
              <li><strong style={{ color: "var(--text-1)", fontWeight: 600 }}>Email</strong> — utilisé pour l'authentification et les communications transactionnelles</li>
              <li><strong style={{ color: "var(--text-1)", fontWeight: 600 }}>URLs analysées</strong> — enregistrées dans la base de données pour constituer l'historique d'audit</li>
              <li><strong style={{ color: "var(--text-1)", fontWeight: 600 }}>Données de paiement</strong> — traitées exclusivement par Stripe ; Otarcy ne stocke aucune donnée bancaire</li>
            </ul>
          ),
        },
        {
          label: "2. Utilisation des données",
          content: (
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.8, fontWeight: 300 }}>
              Les données collectées sont utilisées pour la fourniture du service d'audit et l'envoi d'emails transactionnels (confirmation de compte, résultats, factures) via <strong style={{ color: "var(--text-1)", fontWeight: 600 }}>Resend</strong>. Aucun envoi marketing sans consentement explicite.
            </p>
          ),
        },
        {
          label: "3. Hébergement & sous-traitants",
          content: (
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.8, fontWeight: 300 }}>
              <strong style={{ color: "var(--text-1)", fontWeight: 600 }}>Vercel</strong> — hébergement des fonctions serverless (États-Unis, données de transit uniquement)<br />
              <strong style={{ color: "var(--text-1)", fontWeight: 600 }}>Supabase</strong> — base de données (Union Européenne) — emails, historique d'audits, informations de compte
            </p>
          ),
        },
        {
          label: "4. Durée de conservation",
          content: (
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.8, fontWeight: 300 }}>
              Les données sont conservées pendant la durée d'utilisation du service. En cas de résiliation de compte, les données peuvent être supprimées sur demande adressée à <a href="mailto:contact@otarcy.app" style={{ color: "var(--accent)", textDecoration: "none" }}>contact@otarcy.app</a>.
            </p>
          ),
        },
        {
          label: "5. Vos droits (RGPD)",
          content: (
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.8, fontWeight: 300 }}>
              Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ces droits, contactez : <a href="mailto:contact@otarcy.app" style={{ color: "var(--accent)", textDecoration: "none" }}>contact@otarcy.app</a>
            </p>
          ),
        },
      ].map((item, i) => (
        <div key={i} className="reveal" style={{ marginBottom: "16px", padding: "28px 32px", border: "1px solid var(--border-2)", background: "var(--bg-primary)" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "14px" }}>
            {item.label}
          </p>
          {item.content}
        </div>
      ))}

    </div>
  </section>
);

// ─── PAGE ─────────────────────────────────────────────
export default function PolitiqueConfidentialite() {
  useReveal([]);
  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ paddingTop: "80px" }}>
        <ConfidentialiteSection />
      </div>
      <Footer />
    </div>
  );
}

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

// ─── SECTION CGV ──────────────────────────────────────
const CGVSection = () => (
  <section style={{ padding: "100px 60px", background: "var(--bg-page)", borderTop: "1px solid var(--border-1)" }}>
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>

      <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }}>
        .01 — Conditions générales de vente
      </p>
      <h2 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "0.06em", color: "var(--text-1)", marginBottom: "16px", lineHeight: 0.95 }}>
        CONDITIONS DE VENTE
      </h2>
      <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.9, fontWeight: 300, maxWidth: "600px", marginBottom: "48px" }}>
        Les présentes conditions régissent l'accès et l'utilisation du service Otarcy. En souscrivant à un plan payant, vous acceptez les présentes conditions.
      </p>

      {[
        {
          label: "1. Éditeur",
          content: (
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.8, fontWeight: 300 }}>
              <strong style={{ color: "var(--text-1)", fontWeight: 600 }}>Otarcy</strong> — Cédric Sessou, France<br />
              Contact : <a href="mailto:contact@otarcy.app" style={{ color: "var(--accent)", textDecoration: "none" }}>contact@otarcy.app</a>
            </p>
          ),
        },
        {
          label: "2. Produits & tarifs",
          content: (
            <ul style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.9, fontWeight: 300, paddingLeft: "16px", margin: 0 }}>
              <li><strong style={{ color: "var(--text-1)", fontWeight: 600 }}>Gratuit</strong> — 0 €/mois — 1 diagnostic sans carte bancaire</li>
              <li><strong style={{ color: "var(--text-1)", fontWeight: 600 }}>Essentiel</strong> — 19 €/mois — Audits illimités avec rapport complet et plan d'action</li>
              <li><strong style={{ color: "var(--text-1)", fontWeight: 600 }}>Expert</strong> — 99 €/mois — Diagnostic avancé avec perception IA réelle par ChatGPT, Claude et Perplexity</li>
            </ul>
          ),
        },
        {
          label: "3. Paiement",
          content: (
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.8, fontWeight: 300 }}>
              Le paiement est sécurisé via <strong style={{ color: "var(--text-1)", fontWeight: 600 }}>Stripe</strong>. Otarcy ne stocke aucune donnée bancaire. Les abonnements sont facturés mensuellement, à date anniversaire de souscription.
            </p>
          ),
        },
        {
          label: "4. Droit de rétractation",
          content: (
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.8, fontWeight: 300 }}>
              Conformément au droit européen de la consommation, tout nouvel abonné dispose d'un droit de rétractation de <strong style={{ color: "var(--text-1)", fontWeight: 600 }}>14 jours</strong> à compter de la date de souscription. Pour exercer ce droit, contactez <a href="mailto:contact@otarcy.app" style={{ color: "var(--accent)", textDecoration: "none" }}>contact@otarcy.app</a>.
            </p>
          ),
        },
        {
          label: "5. Résiliation",
          content: (
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.8, fontWeight: 300 }}>
              La résiliation d'un abonnement est possible à tout moment depuis le dashboard utilisateur. L'accès aux fonctionnalités payantes reste actif jusqu'à la fin de la période de facturation en cours.
            </p>
          ),
        },
        {
          label: "6. Contact",
          content: (
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.8, fontWeight: 300 }}>
              Pour toute question relative à une commande ou à la facturation :<br />
              <a href="mailto:contact@otarcy.app" style={{ color: "var(--accent)", textDecoration: "none" }}>contact@otarcy.app</a>
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
export default function CGV() {
  useReveal([]);
  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ paddingTop: "80px" }}>
        <CGVSection />
      </div>
      <Footer />
    </div>
  );
}

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

// ─── SECTION MENTIONS LÉGALES ─────────────────────────
const MentionsSection = () => (
  <section style={{ padding: "100px 60px", background: "var(--bg-page)", borderTop: "1px solid var(--border-1)" }}>
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>

      <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }}>
        .01 — Mentions légales
      </p>
      <h2 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "0.06em", color: "var(--text-1)", marginBottom: "48px", lineHeight: 0.95 }}>
        MENTIONS LÉGALES
      </h2>

      {[
        {
          label: "Éditeur du site",
          content: (
            <>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.8, fontWeight: 300 }}>
                <strong style={{ color: "var(--text-1)", fontWeight: 600 }}>Otarcy</strong><br />
                Responsable de publication : Cédric Sessou<br />
                Pays : France<br />
                Contact : <a href="mailto:contact@otarcy.app" style={{ color: "var(--accent)", textDecoration: "none" }}>contact@otarcy.app</a>
              </p>
            </>
          ),
        },
        {
          label: "Hébergement",
          content: (
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.8, fontWeight: 300 }}>
              <strong style={{ color: "var(--text-1)", fontWeight: 600 }}>Vercel Inc.</strong><br />
              340 Pine Street Suite 701<br />
              San Francisco, CA 94104<br />
              États-Unis
            </p>
          ),
        },
        {
          label: "Propriété intellectuelle",
          content: (
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.8, fontWeight: 300 }}>
              L'ensemble du contenu présent sur le site otarcy.app — textes, visuels, interface, code, marque — est protégé par le droit de la propriété intellectuelle. Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation écrite préalable d'Otarcy est strictement interdite.
            </p>
          ),
        },
        {
          label: "Contact",
          content: (
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.8, fontWeight: 300 }}>
              Pour toute question relative au site ou à son contenu :<br />
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
export default function MentionsLegales() {
  useReveal([]);
  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ paddingTop: "80px" }}>
        <MentionsSection />
      </div>
      <Footer />
    </div>
  );
}

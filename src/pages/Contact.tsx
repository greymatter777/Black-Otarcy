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

// ─── SECTION CONTACT ──────────────────────────────────
const ContactSection = () => (
  <section style={{ padding: "100px 60px", background: "var(--bg-page)", borderTop: "1px solid var(--border-1)" }}>
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>

      <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }}>
        .01 — Contact
      </p>
      <h2 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "0.06em", color: "var(--text-1)", marginBottom: "16px", lineHeight: 0.95 }}>
        NOUS CONTACTER
      </h2>
      <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.9, fontWeight: 300, maxWidth: "600px", marginBottom: "48px" }}>
        Une question sur un audit, un diagnostic ou votre compte ? Nous répondons sous 48h ouvrées. Pour toute question relative à un audit, merci de préciser l'URL analysée dans votre message.
      </p>

      {/* Infos de contact */}
      <div className="reveal" style={{ marginBottom: "16px", padding: "28px 32px", border: "1px solid var(--border-2)", background: "var(--bg-primary)" }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "20px" }}>
          Coordonnées
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
          {[
            { label: "Email général", value: "contact@otarcy.app", href: "mailto:contact@otarcy.app" },
            { label: "Support technique", value: "support@otarcy.app", href: "mailto:support@otarcy.app" },
            { label: "Adresse", value: "France", href: null },
            { label: "Temps de réponse", value: "Sous 48h ouvrées", href: null },
          ].map((item, i) => (
            <div key={i}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.25em", color: "var(--text-3)", textTransform: "uppercase", marginBottom: "6px" }}>
                {item.label}
              </p>
              {item.href ? (
                <a href={item.href} style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "var(--accent)", fontWeight: 500, textDecoration: "none" }}>
                  {item.value}
                </a>
              ) : (
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "var(--text-1)", fontWeight: 400, margin: 0 }}>
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Note audit */}
      <div className="reveal" style={{ marginBottom: "48px", padding: "20px 32px", border: "1px solid var(--border-1)", background: "var(--bg-page)", borderLeft: "2px solid var(--accent)" }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "var(--text-2)", lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
          <strong style={{ color: "var(--text-1)", fontWeight: 600 }}>Note :</strong> pour toute question sur un audit ou un diagnostic, merci de préciser l'URL analysée dans votre message. Cela nous permettra de vous répondre plus efficacement.
        </p>
      </div>

      {/* CTA boutons */}
      <div className="reveal" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <a
          href="mailto:contact@otarcy.app"
          style={{ display: "inline-block", fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 36px", background: "transparent", color: "var(--text-1)", textDecoration: "none", fontWeight: 600, border: "1px solid var(--border-2)", transition: "border-color 0.2s, color 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.color = "var(--text-1)"; }}
        >
          contact@otarcy.app →
        </a>
        <a
          href="mailto:support@otarcy.app"
          style={{ display: "inline-block", fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 36px", background: "transparent", color: "var(--text-1)", textDecoration: "none", fontWeight: 600, border: "1px solid var(--border-2)", transition: "border-color 0.2s, color 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.color = "var(--text-1)"; }}
        >
          support@otarcy.app →
        </a>
      </div>

    </div>
  </section>
);

// ─── PAGE ─────────────────────────────────────────────
export default function Contact() {
  useReveal([]);
  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ paddingTop: "80px" }}>
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
}

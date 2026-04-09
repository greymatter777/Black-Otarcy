import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer style={{ background: "var(--bg-primary)", borderTop: "1px solid var(--border-1)", padding: "60px 60px 40px" }}>
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "40px", marginBottom: "48px" }}>

        {/* Colonne 1 — Identité */}
        <div>
          <div style={{ marginBottom: "20px" }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.15em", color: "var(--text-1)", display: "block", lineHeight: 0.9 }}>OT</span>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.15em", color: "var(--text-2)", display: "block", lineHeight: 0.9 }}>CY</span>
          </div>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-3)", lineHeight: 1.8, fontWeight: 300, maxWidth: "200px" }}>
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
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--border-3)", textTransform: "uppercase", marginBottom: "16px" }}>
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
                style={{ display: "block", fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-3)", background: "transparent", border: "none", cursor: "pointer", padding: "0 0 10px 0", letterSpacing: "0.05em", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0f0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}
              >{item.label}</button>
            ) : (
              <Link key={item.label} to={item.to}
                style={{ display: "block", fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-3)", textDecoration: "none", marginBottom: "10px", letterSpacing: "0.05em", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0f0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}
              >{item.label}</Link>
            )
          ))}
        </div>

        {/* Colonne 3 — Ressources */}
        <div>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--border-3)", textTransform: "uppercase", marginBottom: "16px" }}>
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
                style={{ display: "block", fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-3)", background: "transparent", border: "none", cursor: "pointer", padding: "0 0 10px 0", letterSpacing: "0.05em", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#a3e635")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}
              >{item.label}</button>
            ) : (
              <Link key={item.label} to={item.to}
                style={{ display: "block", fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-3)", textDecoration: "none", marginBottom: "10px", letterSpacing: "0.05em", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#a3e635")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}
              >{item.label}</Link>
            )
          ))}
        </div>

      </div>

      {/* Bas de footer */}
      <div style={{ borderTop: "1px solid var(--border-1)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "var(--border-2)", letterSpacing: "0.05em" }}>
          © 2025 Otarcy France — Bordeaux, Gironde
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;

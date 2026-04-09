// src/pages/ScoreResult.tsx
// Vue plan free — score global + critères verrouillés
// Référence visuelle : design-ref/score-free.html
// DA : Bebas Neue + Raleway, inline styles uniquement, zéro Tailwind, zéro border-radius

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { authFetch } from "../lib/useAuthFetch";

interface Critere {
  nom: string;
  statut: "ok" | "warn" | "ko";
  points: number;
  max: number;
}

interface ScoreData {
  score: number;
  niveau: string;
  url: string;
  criteres: Critere[];
}

const LABELS: Record<string, string> = {
  crawlers_ia:   "Crawlers IA",
  schema_org:    "Schema.org",
  eeat:          "E-E-A-T",
  faq_glossaire: "FAQ / Glossaire",
  llms_txt:      "llms.txt",
  meta_onpage:   "Meta / On-page",
  wikidata:      "Wikidata",
  sitemap:       "Sitemap",
  open_graph:    "Open Graph",
  https:         "HTTPS",
};

const LOCKED = ["eeat", "wikidata", "llms_txt", "faq_glossaire"];

const NIVEAU_COLOR: Record<string, string> = {
  critique: "#ef4444",
  faible:   "#f97316",
  moyen:    "#f97316",
  bon:      "var(--accent)",
  excellent:"var(--accent)",
};

export default function ScoreResult() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const url = sessionStorage.getItem("otarcy_audit_url");
    if (!url) { navigate("/"); return; }

    authFetch("/api/score", {
      method: "POST",
      body: JSON.stringify({ url }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.error) setError(json.error);
        else setData(json);
      })
      .catch(() => setError("Une erreur est survenue. Réessayez."))
      .finally(() => setLoading(false));
  }, []);

  // Calcul arc SVG pour le ring
  function buildArc(score: number) {
    const r = 54;
    const circ = 2 * Math.PI * r;
    const fill = (score / 100) * circ;
    return { circ, fill };
  }

  const friendlyError = (msg: string) => {
    if (msg.includes("Impossible d'accéder"))
      return "Ce site n'est pas accessible publiquement ou bloque les analyses automatiques.";
    if (msg.includes("timeout") || msg.includes("trop de temps"))
      return "Le site met trop de temps à répondre. Réessayez dans quelques instants.";
    return msg;
  };

  const isProtectedSite = (msg: string): boolean => {
    const lower = msg.toLowerCase();
    return (
      lower.includes("protégé") ||
      lower.includes("bloque") ||
      lower.includes("anti-bot") ||
      lower.includes("cloudflare") ||
      lower.includes("waf") ||
      lower.includes("403") ||
      lower.includes("406") ||
      lower.includes("accessible")
    );
  };

  const ProtectedSiteState: React.FC<{ url: string; onRetry: () => void }> = ({ url, onRetry }) => (
    <div style={{
      minHeight: "100vh", background: "var(--bg-primary)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "60px 24px",
    }}>
      <div style={{
        width: "100%", maxWidth: "560px",
        background: "var(--bg-page)", border: "1px solid var(--border-2)",
        padding: "32px",
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
          <svg width="96" height="112" viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 2L4 10V26C4 37.05 12.8 47.37 24 50C35.2 47.37 44 37.05 44 26V10L24 2Z" fill="#0f0f0f" stroke="#a3e635" strokeWidth="1.5"/>
            <path d="M24 2L4 10V26C4 37.05 12.8 47.37 24 50C35.2 47.37 44 37.05 44 26V10L24 2Z" fill="#a3e635" fillOpacity="0.06"/>
            <polyline points="16,27 21,32 32,20" stroke="#a3e635" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" fill="none"/>
          </svg>
        </div>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "12px", textAlign: "center" }}>
          Résultat de l'analyse
        </p>
        <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", letterSpacing: "0.1em", color: "var(--accent)", textAlign: "center", marginBottom: "8px" }}>
          SITE PROTÉGÉ
        </p>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.12em", color: "var(--text-3)", textAlign: "center", marginBottom: "20px", fontWeight: 300 }}>
          {url}
        </p>
        <div style={{ borderTop: "1px solid var(--border-1)", margin: "20px 0" }} />
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "var(--text-2)", lineHeight: 1.7, fontWeight: 300, textAlign: "center", maxWidth: "360px", margin: "0 auto 20px" }}>
          Ce site utilise une protection anti-bot active. L'analyse automatique est bloquée — ce qui est courant sur les grands groupes.
        </p>
        <div style={{ background: "var(--bg-card-inner)", border: "1px solid var(--border-2)", borderLeft: "2px solid var(--accent)", padding: "14px 16px", marginBottom: "20px" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.25em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "6px" }}>
            Ce que ça signifie
          </p>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-4)", lineHeight: 1.6, fontWeight: 300 }}>
            Une protection de type Cloudflare ou WAF bloque les requêtes automatiques avant même l'accès au HTML. Otarcy cible les PME et sites sans protection enterprise — ce cas de figure est hors périmètre.
          </p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          style={{
            display: "block", width: "100%",
            fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem",
            letterSpacing: "0.22em", textTransform: "uppercase",
            padding: "13px 32px", border: "1px solid var(--border-3)",
            background: "transparent", color: "var(--text-2)",
            cursor: "pointer", transition: "border-color 0.3s, color 0.3s",
            boxSizing: "border-box",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.color = "#e8e8e8"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3a3a"; e.currentTarget.style.color = "#7a7a7a"; }}
        >
          Analyser une autre URL →
        </button>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "var(--border-3)", textAlign: "center", marginTop: "14px", fontWeight: 300, letterSpacing: "0.05em" }}>
          Essayez avec l'URL de votre propre site
        </p>
      </div>
    </div>
  );

  if (loading) return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "var(--text-2)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        Analyse en cours...
      </p>
    </div>
  );

  if (error) {
    if (isProtectedSite(error)) {
      return <ProtectedSiteState url={sessionStorage.getItem("otarcy_audit_url") ?? ""} onRetry={() => navigate("/")} />;
    }
    return (
      <div style={{ background: "var(--bg-primary)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ padding: "24px", border: "1px solid #ef4444", background: "var(--bg-page)", maxWidth: "400px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#ef4444", marginBottom: "16px" }}>{friendlyError(error)}</p>
          <button onClick={() => navigate("/")} style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "10px 24px", background: "transparent", border: "1px solid var(--border-3)", color: "var(--text-2)", cursor: "pointer" }}>
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { circ, fill } = buildArc(data.score);
  const niveauColor = NIVEAU_COLOR[data.niveau] || "#f97316";
  const niveauLabel = data.niveau.charAt(0).toUpperCase() + data.niveau.slice(1);

  const visibles = data.criteres.filter((c) => !LOCKED.includes(c.nom));
  const locked = data.criteres.filter((c) => LOCKED.includes(c.nom));
  const nbProblemes = data.criteres.filter((c) => c.statut !== "ok").length;

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", fontFamily: "'Raleway', sans-serif" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 60px" }}>

        {/* Label section */}
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", fontWeight: 500, marginBottom: "16px" }}>
          .01 — Score de visibilité IA
        </p>

        {/* URL row */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.1em", color: "var(--text-2)", padding: "4px 10px", border: "1px solid var(--border-2)", textTransform: "uppercase" }}>
            URL analysée
          </span>
          <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.70rem", color: "#a0a0a0", letterSpacing: "0.05em" }}>
            {data.url}
          </span>
        </div>

        {/* Score card */}
        <div style={{ padding: "32px 24px", border: "1px solid var(--border-2)", background: "var(--bg-page)", marginBottom: "16px", textAlign: "center" }}>
          {/* Ring SVG */}
          <div style={{ width: "140px", height: "140px", margin: "0 auto 24px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="140" height="140" viewBox="0 0 140 140" style={{ position: "absolute", top: 0, left: 0 }}>
              <circle cx="70" cy="70" r="54" fill="none" stroke="#2a2a2a" strokeWidth="4" />
              <circle
                cx="70" cy="70" r="54"
                fill="none"
                stroke={niveauColor}
                strokeWidth="4"
                strokeDasharray={`${fill} ${circ}`}
                strokeDashoffset={circ * 0.25}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
              />
            </svg>
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", color: "var(--text-1)", lineHeight: 1 }}>
                {data.score}
              </span>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: "var(--text-2)", textTransform: "uppercase" }}>
                / 100
              </span>
            </div>
          </div>

          <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", color: niveauColor, letterSpacing: "0.1em", marginBottom: "8px" }}>
            Visibilité {niveauLabel}
          </p>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-2)", fontWeight: 300, lineHeight: 1.7 }}>
            Votre marque est peu visible pour les IAs.<br />Plusieurs signaux critiques sont manquants.
          </p>
        </div>

        {/* Critères card */}
        <div style={{ padding: "24px", border: "1px solid var(--border-2)", background: "var(--bg-page)", marginBottom: "16px" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "14px" }}>
            Critères vérifiés
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {visibles.map((c) => (
              <div key={c.nom} style={{ padding: "14px 16px", border: "1px solid var(--border-2)", background: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.70rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#a0a0a0" }}>
                  {LABELS[c.nom]}
                </span>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: c.statut === "ok" ? "#a3e635" : c.statut === "warn" ? "#f97316" : "#ef4444", flexShrink: 0 }} />
              </div>
            ))}
            {locked.map((c) => (
              <div key={c.nom} style={{ padding: "14px 16px", border: "1px dashed var(--border-2)", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 0.45 }}>
                <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.70rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#a0a0a0" }}>
                  {LABELS[c.nom]}
                </span>
                <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", color: "var(--border-3)" }}>⚿</span>
              </div>
            ))}
          </div>

          {/* Légende */}
          <div style={{ display: "flex", gap: "16px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border-2)" }}>
            {[
              { label: "Présent", color: "var(--accent)" },
              { label: "Partiel", color: "#f97316" },
              { label: "Absent", color: "#ef4444" },
              { label: "Verrouillé", color: "var(--border-2)" },
            ].map(({ label, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, flexShrink: 0, display: "inline-block" }} />
                <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.60rem", color: "var(--text-2)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ border: "1px solid var(--accent)", background: "var(--bg-primary)", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "var(--text-4)", lineHeight: 1.7, fontWeight: 300, maxWidth: "480px" }}>
            <strong style={{ color: "var(--text-1)", fontWeight: 500 }}>{nbProblemes} critère{nbProblemes > 1 ? "s" : ""} à corriger.</strong>{" "}
            Découvrez le détail complet, les quick wins et votre plan d'action personnalisé.
          </p>
          <button
            onClick={() => navigate("/pricing")}
            style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", background: "var(--accent)", color: "var(--accent-fg)", fontWeight: 600, border: "none", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "opacity 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Débloquer l'analyse →
          </button>
        </div>

      </div>
    </div>
  );
}

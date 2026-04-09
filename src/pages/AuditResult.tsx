// src/pages/AuditResult.tsx
// Vue plan pro — détail complet + quick wins + plan long terme
// Référence visuelle : design-ref/audit-essentiel.html
// DA : Bebas Neue + Raleway, inline styles uniquement, zéro Tailwind, zéro border-radius

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { authFetch } from "../lib/useAuthFetch";

interface Critere {
  nom: string;
  titre: string;
  statut: "ok" | "warn" | "ko";
  points: number;
  max: number;
  detail: string;
  impact: string;
}

interface QuickWin {
  numero: number;
  titre: string;
  description: string;
  impact: string;
  effort: string;
  categorie: string;
}

interface PlanPhase {
  phase: string;
  titre: string;
  actions: string;
}

interface AuditData {
  score: number;
  niveau: string;
  url: string;
  criteres: Critere[];
  quick_wins: QuickWin[];
  plan_long_terme: PlanPhase[];
}

const NIVEAU_COLOR: Record<string, string> = {
  critique: "#ef4444",
  faible:   "#f97316",
  moyen:    "#f97316",
  bon:      "var(--accent)",
  excellent:"var(--accent)",
};

const STATUT_COLOR: Record<string, string> = {
  ok:   "var(--accent)",
  warn: "#f97316",
  ko:   "#ef4444",
};

export default function AuditResult() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const url = sessionStorage.getItem("otarcy_audit_url");
    if (!url) { navigate("/"); return; }

    authFetch("/api/audit", {
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

  const niveauColor = NIVEAU_COLOR[data.niveau] || "#f97316";
  const niveauLabel = data.niveau.charAt(0).toUpperCase() + data.niveau.slice(1);

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", fontFamily: "'Raleway', sans-serif" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 60px" }}>

        {/* Label section */}
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", fontWeight: 500, marginBottom: "16px" }}>
          .02 — Analyse complète
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

        {/* Score + barres */}
        <div style={{ padding: "24px", border: "1px solid var(--border-2)", background: "var(--bg-page)", marginBottom: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

            {/* Score global */}
            <div>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "14px" }}>Score global</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", color: "var(--text-1)", lineHeight: 1 }}>{data.score}</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", color: "var(--text-2)" }}>/100</span>
              </div>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", color: niveauColor, letterSpacing: "0.1em", marginBottom: "6px" }}>
                Visibilité {niveauLabel}
              </p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-2)", fontWeight: 300, lineHeight: 1.7 }}>
                {data.criteres.filter(c => c.statut !== "ok").length} critère{data.criteres.filter(c => c.statut !== "ok").length > 1 ? "s" : ""} à corriger en priorité.
              </p>
            </div>

            {/* Barres par catégorie */}
            <div>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "14px" }}>Par catégorie</p>
              {data.criteres.map((c) => {
                const pct = Math.round((c.points / c.max) * 100);
                const color = STATUT_COLOR[c.statut];
                return (
                  <div key={c.nom} style={{ marginBottom: "11px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.70rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#a0a0a0" }}>{c.titre}</span>
                      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.9rem", letterSpacing: "0.1em", color }}>{c.points}/{c.max}</span>
                    </div>
                    <div style={{ height: "2px", background: "var(--border-2)", borderRadius: "2px" }}>
                      <div style={{ height: "2px", width: `${pct}%`, background: color, borderRadius: "2px" }} />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Détail critères */}
        <div style={{ padding: "24px", border: "1px solid var(--border-2)", background: "var(--bg-page)", marginBottom: "16px" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "14px" }}>
            Détail par critère
          </p>
          {data.criteres.map((c) => (
            <div key={c.nom} style={{ padding: "14px 16px", border: "1px solid var(--border-2)", background: "var(--bg-page)", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.70rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-4)", fontWeight: 500 }}>
                  {c.titre}
                </span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.9rem", letterSpacing: "0.1em", color: STATUT_COLOR[c.statut] }}>
                  {c.points} / {c.max}
                </span>
              </div>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-2)", fontWeight: 300, lineHeight: 1.6, marginBottom: "4px" }}>
                {c.detail}
              </p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.70rem", color: "var(--text-3)", fontWeight: 300, lineHeight: 1.6, fontStyle: "italic" }}>
                {c.impact}
              </p>
            </div>
          ))}
        </div>

        {/* Quick wins */}
        {data.quick_wins.length > 0 && (
          <div style={{ padding: "24px", border: "1px solid var(--border-2)", background: "var(--bg-page)", marginBottom: "16px" }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "14px" }}>
              Quick wins — actions immédiates
            </p>
            {data.quick_wins.map((qw) => (
              <div key={qw.numero} style={{ padding: "16px 20px", background: "var(--bg-card-inner)", border: "1px solid var(--border-2)", borderLeft: "2px solid #f97316", marginBottom: "8px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", color: "#f97316", letterSpacing: "0.15em", flexShrink: 0, marginTop: "1px" }}>
                  {String(qw.numero).padStart(2, "0")}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-1)", fontWeight: 500, marginBottom: "4px", letterSpacing: "0.05em" }}>
                    {qw.titre}
                  </p>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.70rem", color: "var(--text-2)", fontWeight: 300, lineHeight: 1.6, marginBottom: "8px" }}>
                    {qw.description}
                  </p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#f97316", padding: "2px 8px", border: "1px solid #f97316", textTransform: "uppercase" }}>
                      Impact {qw.impact}
                    </span>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: "var(--text-2)", padding: "2px 8px", border: "1px solid var(--border-2)", textTransform: "uppercase" }}>
                      {qw.effort}
                    </span>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: "var(--text-2)", padding: "2px 8px", border: "1px solid var(--border-2)", textTransform: "uppercase" }}>
                      {qw.categorie}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Plan long terme */}
        <div style={{ padding: "24px", border: "1px solid var(--border-2)", background: "var(--bg-page)", marginBottom: "16px" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "14px" }}>
            Plan long terme
          </p>
          {data.plan_long_terme.map((phase) => (
            <div key={phase.phase} style={{ padding: "16px 20px", background: "var(--bg-card-inner)", border: "1px solid var(--border-2)", borderLeft: "2px solid #60a5fa", marginBottom: "8px" }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#60a5fa", fontWeight: 500, marginBottom: "4px", letterSpacing: "0.05em" }}>
                {phase.phase} — {phase.titre}
              </p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.70rem", color: "var(--text-2)", fontWeight: 300, lineHeight: 1.6 }}>
                {phase.actions}
              </p>
            </div>
          ))}
        </div>

        {/* CTA upgrade vers Expert si plan = pro */}
        <div style={{ border: "1px solid var(--accent)", background: "var(--bg-primary)", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "var(--text-4)", lineHeight: 1.7, fontWeight: 300, maxWidth: "480px" }}>
            Vous voulez savoir ce que <strong style={{ color: "var(--text-1)", fontWeight: 500 }}>ChatGPT, Claude et Perplexity</strong> disent réellement de votre marque aujourd'hui ?
          </p>
          <button
            onClick={() => navigate("/pricing")}
            style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", background: "var(--accent)", color: "var(--accent-fg)", fontWeight: 600, border: "none", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "opacity 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Voir la perception IA →
          </button>
        </div>

      </div>
    </div>
  );
}

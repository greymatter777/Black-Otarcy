// src/pages/AuditResult.tsx
// Vue plan pro — détail complet + quick wins + plan long terme
// Référence visuelle : design-ref/audit-essentiel.html
// DA : Bebas Neue + Raleway, inline styles uniquement, zéro Tailwind, zéro border-radius

import { useEffect, useState } from "react";
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
  bon:      "#a3e635",
  excellent:"#a3e635",
};

const STATUT_COLOR: Record<string, string> = {
  ok:   "#a3e635",
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

  if (loading) return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#7a7a7a", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        Analyse en cours...
      </p>
    </div>
  );

  if (error) return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ padding: "24px", border: "1px solid #ef4444", background: "#0f0f0f", maxWidth: "400px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#ef4444", marginBottom: "16px" }}>{error}</p>
        <button onClick={() => navigate("/")} style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "10px 24px", background: "transparent", border: "1px solid #3a3a3a", color: "#7a7a7a", cursor: "pointer" }}>
          ← Retour
        </button>
      </div>
    </div>
  );

  if (!data) return null;

  const niveauColor = NIVEAU_COLOR[data.niveau] || "#f97316";
  const niveauLabel = data.niveau.charAt(0).toUpperCase() + data.niveau.slice(1);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Raleway', sans-serif" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 60px" }}>

        {/* Label section */}
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", fontWeight: 500, marginBottom: "16px" }}>
          .02 — Analyse complète
        </p>

        {/* URL row */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.1em", color: "#7a7a7a", padding: "4px 10px", border: "1px solid #2a2a2a", textTransform: "uppercase" }}>
            URL analysée
          </span>
          <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.70rem", color: "#a0a0a0", letterSpacing: "0.05em" }}>
            {data.url}
          </span>
        </div>

        {/* Score + barres */}
        <div style={{ padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f", marginBottom: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

            {/* Score global */}
            <div>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "14px" }}>Score global</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", color: "#f0f0f0", lineHeight: 1 }}>{data.score}</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", color: "#7a7a7a" }}>/100</span>
              </div>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", color: niveauColor, letterSpacing: "0.1em", marginBottom: "6px" }}>
                Visibilité {niveauLabel}
              </p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", fontWeight: 300, lineHeight: 1.7 }}>
                {data.criteres.filter(c => c.statut !== "ok").length} critère{data.criteres.filter(c => c.statut !== "ok").length > 1 ? "s" : ""} à corriger en priorité.
              </p>
            </div>

            {/* Barres par catégorie */}
            <div>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "14px" }}>Par catégorie</p>
              {data.criteres.map((c) => {
                const pct = Math.round((c.points / c.max) * 100);
                const color = STATUT_COLOR[c.statut];
                return (
                  <div key={c.nom} style={{ marginBottom: "11px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.70rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#a0a0a0" }}>{c.titre}</span>
                      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.9rem", letterSpacing: "0.1em", color }}>{c.points}/{c.max}</span>
                    </div>
                    <div style={{ height: "2px", background: "#2a2a2a", borderRadius: "2px" }}>
                      <div style={{ height: "2px", width: `${pct}%`, background: color, borderRadius: "2px" }} />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Détail critères */}
        <div style={{ padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f", marginBottom: "16px" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "14px" }}>
            Détail par critère
          </p>
          {data.criteres.map((c) => (
            <div key={c.nom} style={{ padding: "14px 16px", border: "1px solid #2a2a2a", background: "#0f0f0f", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.70rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#d4d4d4", fontWeight: 500 }}>
                  {c.titre}
                </span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.9rem", letterSpacing: "0.1em", color: STATUT_COLOR[c.statut] }}>
                  {c.points} / {c.max}
                </span>
              </div>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", fontWeight: 300, lineHeight: 1.6, marginBottom: "4px" }}>
                {c.detail}
              </p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.70rem", color: "#4a4a4a", fontWeight: 300, lineHeight: 1.6, fontStyle: "italic" }}>
                {c.impact}
              </p>
            </div>
          ))}
        </div>

        {/* Quick wins */}
        {data.quick_wins.length > 0 && (
          <div style={{ padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f", marginBottom: "16px" }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "14px" }}>
              Quick wins — actions immédiates
            </p>
            {data.quick_wins.map((qw) => (
              <div key={qw.numero} style={{ padding: "16px 20px", background: "#161616", border: "1px solid #2a2a2a", borderLeft: "2px solid #f97316", marginBottom: "8px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", color: "#f97316", letterSpacing: "0.15em", flexShrink: 0, marginTop: "1px" }}>
                  {String(qw.numero).padStart(2, "0")}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#f0f0f0", fontWeight: 500, marginBottom: "4px", letterSpacing: "0.05em" }}>
                    {qw.titre}
                  </p>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.70rem", color: "#7a7a7a", fontWeight: 300, lineHeight: 1.6, marginBottom: "8px" }}>
                    {qw.description}
                  </p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#f97316", padding: "2px 8px", border: "1px solid #f97316", textTransform: "uppercase" }}>
                      Impact {qw.impact}
                    </span>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#7a7a7a", padding: "2px 8px", border: "1px solid #2a2a2a", textTransform: "uppercase" }}>
                      {qw.effort}
                    </span>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#7a7a7a", padding: "2px 8px", border: "1px solid #2a2a2a", textTransform: "uppercase" }}>
                      {qw.categorie}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Plan long terme */}
        <div style={{ padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f", marginBottom: "16px" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "14px" }}>
            Plan long terme
          </p>
          {data.plan_long_terme.map((phase) => (
            <div key={phase.phase} style={{ padding: "16px 20px", background: "#161616", border: "1px solid #2a2a2a", borderLeft: "2px solid #60a5fa", marginBottom: "8px" }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#60a5fa", fontWeight: 500, marginBottom: "4px", letterSpacing: "0.05em" }}>
                {phase.phase} — {phase.titre}
              </p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.70rem", color: "#7a7a7a", fontWeight: 300, lineHeight: 1.6 }}>
                {phase.actions}
              </p>
            </div>
          ))}
        </div>

        {/* CTA upgrade vers Expert si plan = pro */}
        <div style={{ border: "1px solid #a3e635", background: "#0a0a0a", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#d4d4d4", lineHeight: 1.7, fontWeight: 300, maxWidth: "480px" }}>
            Vous voulez savoir ce que <strong style={{ color: "#f0f0f0", fontWeight: 500 }}>ChatGPT, Claude et Perplexity</strong> disent réellement de votre marque aujourd'hui ?
          </p>
          <button
            onClick={() => navigate("/pricing")}
            style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", background: "#a3e635", color: "#0f0f0f", fontWeight: 600, border: "none", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "opacity 0.2s" }}
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

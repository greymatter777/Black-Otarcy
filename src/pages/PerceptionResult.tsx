// src/pages/PerceptionResult.tsx
// Vue plan agency — perception réelle des LLMs
// Référence visuelle : design-ref/perception-expert.html
// DA : Bebas Neue + Raleway, inline styles uniquement, zéro Tailwind, zéro border-radius

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../lib/useAuthFetch";

interface LLMResult {
  nom: string;
  statut: "citee" | "indirecte" | "inconnue";
  verbatim: string;
  ton: string;
  citation_directe: boolean;
  sources_mentionnees: number;
}

interface DeltaItem {
  titre: string;
  description: string;
}

interface PerceptionData {
  brand: string;
  score_perception: number;
  llms: LLMResult[];
  delta: DeltaItem[];
}

const STATUT_BADGE: Record<string, { label: string; color: string }> = {
  citee:      { label: "Citée",             color: "var(--accent)" },
  indirecte:  { label: "Mention indirecte", color: "#f97316" },
  inconnue:   { label: "Inconnue",          color: "#ef4444" },
};

const VERBATIM_BORDER: Record<string, string> = {
  citee:     "var(--accent)",
  indirecte: "#f97316",
  inconnue:  "#ef4444",
};

export default function PerceptionResult() {
  const navigate = useNavigate();
  const [data, setData] = useState<PerceptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const url = sessionStorage.getItem("otarcy_audit_url");
    const brand = sessionStorage.getItem("otarcy_brand");
    if (!url || !brand) { navigate("/"); return; }

    authFetch("/api/llm-perception", {
      method: "POST",
      body: JSON.stringify({ url, brand }),
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
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "var(--text-2)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "8px" }}>
          Interrogation des IAs en cours...
        </p>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", color: "var(--text-3)", fontWeight: 300 }}>
          ChatGPT, Claude, Perplexity et Gemini sont consultés simultanément
        </p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ padding: "24px", border: "1px solid #ef4444", background: "var(--bg-page)", maxWidth: "400px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#ef4444", marginBottom: "16px" }}>{error}</p>
        <button onClick={() => navigate("/")} style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "10px 24px", background: "transparent", border: "1px solid var(--border-3)", color: "var(--text-2)", cursor: "pointer" }}>
          ← Retour
        </button>
      </div>
    </div>
  );

  if (!data) return null;

  const citees = data.llms.filter(l => l.statut === "citee").length;

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", fontFamily: "'Raleway', sans-serif" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 60px" }}>

        {/* Label section */}
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", fontWeight: 500, marginBottom: "16px" }}>
          .03 — Perception IA en temps réel
        </p>

        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.1em", color: "var(--text-2)", padding: "4px 10px", border: "1px solid var(--border-2)", textTransform: "uppercase" }}>
            Marque analysée
          </span>
          <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.70rem", color: "#a0a0a0", letterSpacing: "0.05em" }}>
            {data.brand}
          </span>
        </div>

        {/* Score + résumé */}
        <div style={{ padding: "24px", border: "1px solid var(--border-2)", background: "var(--bg-page)", marginBottom: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

            {/* Score perception */}
            <div>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "14px" }}>Score de visibilité IA</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", color: "var(--text-1)", lineHeight: 1 }}>{data.score_perception}</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", color: "var(--text-2)" }}>/100</span>
              </div>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", color: citees >= 3 ? "#a3e635" : citees >= 1 ? "#f97316" : "#ef4444", letterSpacing: "0.1em", marginBottom: "6px" }}>
                {citees >= 3 ? "Bonne visibilité" : citees >= 1 ? "Visibilité partielle" : "Peu visible"}
              </p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.70rem", color: "var(--text-2)", fontWeight: 300, lineHeight: 1.7 }}>
                Connue par {citees} IA{citees > 1 ? "s" : ""} sur {data.llms.length} interrogées.
              </p>
            </div>

            {/* Résumé par LLM */}
            <div>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "14px" }}>Résumé par IA</p>
              {data.llms.map((llm) => {
                const badge = STATUT_BADGE[llm.statut];
                return (
                  <div key={llm.nom} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "var(--bg-page)", border: "1px solid var(--border-2)", marginBottom: "6px" }}>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.70rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#a0a0a0" }}>
                      {llm.nom}
                    </span>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", padding: "3px 10px", border: `1px solid ${badge.color}`, color: badge.color, textTransform: "uppercase" }}>
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Verbatim brut */}
        <div style={{ padding: "24px", border: "1px solid var(--border-2)", background: "var(--bg-page)", marginBottom: "16px" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "14px" }}>
            Réponses brutes des IAs
          </p>
          {data.llms.map((llm) => {
            const badge = STATUT_BADGE[llm.statut];
            const borderColor = VERBATIM_BORDER[llm.statut];
            return (
              <div key={llm.nom} style={{ padding: "20px", background: "var(--bg-card-inner)", border: "1px solid var(--border-2)", marginBottom: "12px" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.1em", color: "var(--text-1)" }}>
                    {llm.nom}
                  </span>
                  <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", padding: "3px 10px", border: `1px solid ${badge.color}`, color: badge.color, textTransform: "uppercase" }}>
                    {badge.label}
                  </span>
                </div>

                {/* Verbatim */}
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-2)", fontWeight: 300, lineHeight: 1.7, fontStyle: "italic", padding: "12px 16px", background: "var(--bg-page)", borderLeft: `2px solid ${borderColor}`, marginBottom: "14px" }}>
                  "{llm.verbatim}"
                </div>

                {/* Meta */}
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.15em", color: "var(--text-3)", textTransform: "uppercase" }}>Ton</span>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.1em", color: "#a0a0a0", textTransform: "uppercase" }}>{llm.ton}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.15em", color: "var(--text-3)", textTransform: "uppercase" }}>Citation directe</span>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.1em", color: "#a0a0a0", textTransform: "uppercase" }}>{llm.citation_directe ? "Oui" : "Aucune"}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.15em", color: "var(--text-3)", textTransform: "uppercase" }}>Sources</span>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.1em", color: "#a0a0a0", textTransform: "uppercase" }}>{llm.sources_mentionnees}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Delta */}
        {data.delta.length > 0 && (
          <div style={{ padding: "24px", border: "1px solid var(--border-2)", background: "var(--bg-page)", marginBottom: "16px" }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "14px" }}>
              Delta — ce que vous émettez vs ce que les IAs retiennent
            </p>
            {data.delta.map((item, i) => (
              <div key={i} style={{ padding: "16px 20px", background: "var(--bg-card-inner)", border: "1px solid var(--border-2)", borderLeft: "2px solid #60a5fa", marginBottom: "8px" }}>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#60a5fa", fontWeight: 500, marginBottom: "5px", letterSpacing: "0.05em" }}>
                  {item.titre}
                </p>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.70rem", color: "var(--text-2)", fontWeight: 300, lineHeight: 1.6 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Retour */}
        <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "8px" }}>
          <button
            onClick={() => navigate("/audit")}
            style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "10px 24px", background: "transparent", border: "1px solid var(--border-3)", color: "var(--text-2)", cursor: "pointer", transition: "border-color 0.3s, color 0.3s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.color = "#e8e8e8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3a3a"; e.currentTarget.style.color = "#7a7a7a"; }}
          >
            ← Retour à l'analyse
          </button>
        </div>

      </div>
    </div>
  );
}

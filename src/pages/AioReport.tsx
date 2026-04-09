import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../lib/useAuthFetch";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


// ─── TYPES ────────────────────────────────────────────
interface AioAction {
  action: string;
  impact: string;
  delai: string;
}

interface AioData {
  aio_score: number;
  ai_perception: {
    notoriete_ia: number;
    sentiment: string;
    niveau_detail: string;
    citation_spontanee: boolean;
    resume: string;
  };
  visibilite: {
    sujets_associes: string[];
    concurrents_mieux_positionnes: string[];
    gaps_contenu: string[];
  };
  plan_optimisation: {
    actions_prioritaires: AioAction[];
    strategie_contenu: string[];
    strategie_citations: string[];
    strategie_marketing_ia?: string[];
    quick_wins?: string[];
  };
  plan: string;
}

// ─── SCORE CIRCLE ─────────────────────────────────────
const AioScoreCircle: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 70 ? "var(--accent)" : score >= 40 ? "#f97316" : "#ef4444";
  const label = score >= 70 ? "Bonne visibilité IA" : score >= 40 ? "Visibilité moyenne" : "Faible visibilité IA";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "32px", padding: "36px", border: "1px solid var(--border-2)", background: "var(--bg-hero)", marginBottom: "32px" }}>
      <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
        <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="60" cy="60" r="50" fill="none" stroke="#2a2a2a" strokeWidth="6" />
          <circle
            cx="60" cy="60" r="50" fill="none"
            stroke={color} strokeWidth="6"
            strokeDasharray={2 * Math.PI * 50}
            strokeDashoffset={2 * Math.PI * 50 * (1 - score / 100)}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.2rem", color: "var(--text-1)", lineHeight: 1 }}>{score}</span>
          <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.55rem", color: "var(--text-2)", letterSpacing: "0.1em" }}>/100</span>
        </div>
      </div>
      <div>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "8px" }}>
          Score AIO
        </p>
        <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", letterSpacing: "0.06em", color, marginBottom: "8px" }}>
          {label}
        </p>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: "var(--text-2)", textTransform: "uppercase" }}>
          Optimisation IA — llama-3.3-70b
        </p>
      </div>
    </div>
  );
};

// ─── IMPACT BADGE ─────────────────────────────────────
const ImpactBadge: React.FC<{ impact: string }> = ({ impact }) => {
  const colors: Record<string, string> = { "élevé": "var(--accent)", "moyen": "#f97316", "faible": "var(--text-2)" };
  const color = colors[impact.toLowerCase()] ?? "var(--text-2)";
  return (
    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.55rem", letterSpacing: "0.2em", color, border: `1px solid ${color}`, padding: "2px 8px", textTransform: "uppercase", flexShrink: 0 }}>
      {impact}
    </span>
  );
};

// ─── CARD SECTION ─────────────────────────────────────
const CardSection: React.FC<{ title: string; items: string[]; symbol: string; color: string }> = ({ title, items, symbol, color }) => (
  <div style={{ padding: "24px", border: "1px solid var(--border-2)", background: "var(--bg-hero)" }}>
    <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "16px" }}>{title}</p>
    {items.map((item, i) => (
      <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
        <span style={{ color, fontSize: "0.7rem", flexShrink: 0, marginTop: "2px" }}>{symbol}</span>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "var(--text-4)", lineHeight: 1.6, fontWeight: 300 }}>{item}</p>
      </div>
    ))}
  </div>
);

// ─── PAGE AIO REPORT ──────────────────────────────────
const AioReport: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isSignedIn = !!user;

  const [brandName, setBrandName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AioData | null>(null);
  const [linkedinPlan, setLinkedinPlan] = useState<any | null>(null);
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  const [linkedinOpen, setLinkedinOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleLinkedinPlan = async () => {
    if (!report) return;
    if (linkedinPlan) { setLinkedinOpen(!linkedinOpen); return; }
    setLinkedinLoading(true);
    setLinkedinOpen(true);
    try {
      const res = await authFetch("/api/linkedin-plan", {
        method: "POST",
        body: JSON.stringify({
          brand: brandName,
          aio_score: report.aio_score,
          gaps_contenu: report.visibilite.gaps_contenu,
          sujets_associes: report.visibilite.sujets_associes,
          actions_prioritaires: report.plan_optimisation.actions_prioritaires,
        }),
      });
      const data = await res.json();
      setLinkedinPlan(data);
    } catch {
      setLinkedinPlan(null);
    } finally {
      setLinkedinLoading(false);
    }
  };

  const copyPost = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleGenerate = async () => {
    if (!brandName.trim()) return;
    if (!isSignedIn) { navigate("/login"); return; }

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const res = await authFetch("/api/aio-report", {
        method: "POST",
        body: JSON.stringify({ brand: brandName.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de la génération.");
      setReport(data as AioData);

      setTimeout(() => {
        document.getElementById("aio-results")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } catch (err: any) {
      setError(err.message ?? "Erreur inattendue.");
    } finally {
      setLoading(false);
    }
  };

  const sentimentColor = (s: string) =>
    s === "positif" ? "var(--accent)" : s === "négatif" ? "#ef4444" : "var(--text-1)";

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh" }}>

      <Navbar />

      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "var(--bg-hero)", padding: "0 60px" }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "24px" }}>
          AI Optimization
        </p>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(4rem, 12vw, 9rem)", letterSpacing: "0.04em", color: "var(--text-1)", lineHeight: 0.9, textTransform: "uppercase", marginBottom: "16px" }}>
          AIO AUDIT
        </h1>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", letterSpacing: "0.2em", color: "var(--text-2)", marginBottom: "12px", fontWeight: 300 }}>
          Analysez comment les IAs perçoivent votre marque
        </p>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.68rem", letterSpacing: "0.15em", color: "var(--text-3)", marginBottom: "32px", fontWeight: 300 }}>
          ChatGPT · Claude · Gemini · Perplexity
        </p>

        {isSignedIn ? (
          <div style={{ display: "flex", gap: "12px", maxWidth: "520px", width: "100%" }}>
            <input
              type="text"
              placeholder="Entrez le nom de votre marque"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              style={{ flex: 1, background: "transparent", border: "1px solid var(--text-3)", padding: "10px 14px", color: "var(--text-1)", fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", letterSpacing: "0.08em", outline: "none" }}
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "10px 18px", border: "none", background: loading ? "#555" : "var(--text-5)", color: "var(--bg-page)", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, whiteSpace: "nowrap" }}
            >
              {loading ? "ANALYSE EN COURS..." : "Générer le rapport"}
            </button>
          </div>
        ) : (
          <button onClick={() => navigate("/login")} style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "12px 32px", border: "none", background: "var(--text-5)", color: "var(--bg-page)", cursor: "pointer" }}>
            Connexion pour accéder
          </button>
        )}

        {error && (
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#ef4444", marginTop: "16px" }}>⚠ {error}</p>
        )}

        {!isSignedIn && (
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "var(--text-3)", marginTop: "14px", letterSpacing: "0.15em" }}>
            Disponible — Plans Pro et Agence
          </p>
        )}
      </section>

      {/* Résultats */}
      {report && (
        <section id="aio-results" style={{ padding: "80px 60px", background: "var(--bg-page)" }}>
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>

            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "12px" }}>
              .02 — Rapport AIO
            </p>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.06em", color: "var(--text-1)", marginBottom: "48px" }}>
              {brandName.toUpperCase()} — VISIBILITÉ IA
            </h2>

            {/* Score AIO */}
            <AioScoreCircle score={report.aio_score} />

            {/* Perception IA */}
            <div style={{ padding: "28px", border: "1px solid var(--border-2)", background: "var(--bg-hero)", marginBottom: "32px" }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "20px" }}>Perception par les IAs</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" }}>
                {[
                  { label: "Notoriété IA", value: `${report.ai_perception.notoriete_ia}/100` },
                  { label: "Sentiment", value: report.ai_perception.sentiment, color: sentimentColor(report.ai_perception.sentiment) },
                  { label: "Niveau de détail", value: report.ai_perception.niveau_detail },
                  { label: "Citation spontanée", value: report.ai_perception.citation_spontanee ? "Oui ✓" : "Non ✗", color: report.ai_perception.citation_spontanee ? "var(--accent)" : "#ef4444" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "16px", border: "1px solid var(--border-2)", background: "var(--bg-page)" }}>
                    <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "6px" }}>{item.label}</p>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", color: item.color ?? "var(--text-1)", letterSpacing: "0.06em", textTransform: "capitalize" }}>{item.value}</p>
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "var(--text-4)", lineHeight: 1.85, fontWeight: 300 }}>
                {report.ai_perception.resume}
              </p>
            </div>

            {/* Visibilité */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "32px" }}>
              <CardSection title="Sujets associés" items={report.visibilite.sujets_associes} symbol="→" color="#60a5fa" />
              <CardSection title="Concurrents mieux positionnés" items={report.visibilite.concurrents_mieux_positionnes} symbol="↑" color="#f97316" />
              <CardSection title="Gaps de contenu" items={report.visibilite.gaps_contenu} symbol="!" color="#ef4444" />
            </div>

            {/* Actions prioritaires */}
            <div style={{ marginBottom: "32px" }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "16px" }}>
                Actions prioritaires
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {report.plan_optimisation.actions_prioritaires.map((action, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px", border: "1px solid var(--border-2)", background: "var(--bg-hero)" }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "var(--border-2)", flexShrink: 0, width: "24px" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.8rem", color: "var(--text-4)", lineHeight: 1.6, fontWeight: 300, flex: 1 }}>{action.action}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end", flexShrink: 0 }}>
                      <ImpactBadge impact={action.impact} />
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.55rem", letterSpacing: "0.15em", color: "var(--text-3)", textTransform: "uppercase" }}>{action.delai}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stratégie contenu + citations */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
              <CardSection title="Stratégie de contenu" items={report.plan_optimisation.strategie_contenu} symbol="→" color="var(--accent)" />
              <CardSection title="Stratégie de citations" items={report.plan_optimisation.strategie_citations} symbol="→" color="#60a5fa" />
            </div>

            {/* Agence uniquement */}
            {report.plan === "agency" && report.plan_optimisation.strategie_marketing_ia && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
                <CardSection title="Stratégie marketing IA" items={report.plan_optimisation.strategie_marketing_ia} symbol="↑" color="#f97316" />
                {report.plan_optimisation.quick_wins && (
                  <CardSection title="Quick Wins" items={report.plan_optimisation.quick_wins} symbol="⚡" color="var(--accent)" />
                )}
              </div>
            )}

            {/* CTA upgrade si Pro */}
            {report.plan === "pro" && (
              <div style={{ padding: "24px 28px", border: "1px dashed var(--border-2)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
                <div>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.08em", color: "var(--text-3)", marginBottom: "4px" }}>STRATÉGIE MARKETING IA + QUICK WINS</p>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-3)", fontWeight: 300 }}>Disponible avec le plan Agence</p>
                </div>
                <Link to="/pricing" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "10px 20px", border: "1px solid var(--border-3)", color: "var(--text-2)", textDecoration: "none", whiteSpace: "nowrap" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.color = "#e8e8e8"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3a3a"; e.currentTarget.style.color = "#7a7a7a"; }}
                >
                  Passer Agence →
                </Link>
              </div>
            )}

            {/* ─── PLAN LINKEDIN ─────────────────────────── */}
            <div style={{ marginTop: "32px", padding: "28px", border: "1px solid var(--border-2)", background: "var(--bg-page)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: linkedinOpen ? "24px" : "0" }}>
                <div>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", letterSpacing: "0.08em", color: "var(--text-1)", marginBottom: "4px" }}>
                    PLAN DE CONTENU LINKEDIN
                  </p>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-2)", fontWeight: 300 }}>
                    5 posts prêts à publier pour améliorer ta visibilité IA
                  </p>
                </div>
                <button onClick={handleLinkedinPlan} disabled={linkedinLoading}
                  style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "10px 20px", border: "1px solid var(--accent)", background: linkedinOpen ? "var(--accent)" : "transparent", color: linkedinOpen ? "var(--bg-page)" : "var(--accent)", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s", opacity: linkedinLoading ? 0.7 : 1 }}>
                  {linkedinLoading ? "Génération..." : linkedinOpen ? "↑ Fermer" : "Générer →"}
                </button>
              </div>

              {linkedinOpen && (
                <div>
                  {linkedinLoading ? (
                    <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-2)", letterSpacing: "0.1em" }}>Génération de tes 5 posts LinkedIn...</p>
                  ) : linkedinPlan?.posts ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {linkedinPlan.posts.map((post: any, i: number) => (
                        <div key={i} style={{ padding: "20px", border: "1px solid var(--border-2)", background: "var(--bg-hero)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", color: "var(--accent)" }}>0{post.numero}</span>
                              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: "var(--text-2)", textTransform: "uppercase" }}>{post.type}</span>
                            </div>
                            <button onClick={() => copyPost(`${post.accroche}

${post.contenu}

${post.hashtags.map((h: string) => `#${h.replace("#","")}`).join(" ")}`, i)}
                              style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "4px 10px", border: "1px solid var(--border-3)", background: copiedIndex === i ? "var(--accent)" : "transparent", color: copiedIndex === i ? "var(--bg-page)" : "var(--text-2)", cursor: "pointer", transition: "all 0.2s" }}>
                              {copiedIndex === i ? "Copié ✓" : "Copier"}
                            </button>
                          </div>
                          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "var(--text-1)", fontWeight: 600, marginBottom: "8px", lineHeight: 1.5 }}>{post.accroche}</p>
                          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "var(--text-4)", lineHeight: 1.8, fontWeight: 300, marginBottom: "12px", whiteSpace: "pre-wrap" }}>{post.contenu}</p>
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                            {post.hashtags.map((h: string, j: number) => (
                              <span key={j} style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "#60a5fa", letterSpacing: "0.05em" }}>#{h.replace("#","")}</span>
                            ))}
                          </div>
                          <div style={{ borderTop: "1px solid var(--border-2)", paddingTop: "10px" }}>
                            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "var(--text-3)", fontStyle: "italic" }}>💡 {post.objectif_aio}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#ef4444" }}>Erreur lors de la génération. Réessayez.</p>
                  )}
                </div>
              )}
            </div>

          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default AioReport;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { authFetch } from "../lib/useAuthFetch";

interface AuditRecord {
  id: string;
  url: string;
  score: number;
  niveau: string;
  criteres: { nom: string; titre: string; statut: "ok" | "warn" | "ko"; points: number; max: number; detail: string; impact: string }[];
  quick_wins: { numero: number; titre: string; description: string; impact: string; effort: string; categorie: string }[];
  plan_long_terme: { phase: string; titre: string; actions: string }[];
  created_at: string;
}

function niveauColor(niveau: string): string {
  switch (niveau) {
    case "critique": return "#ef4444";
    case "faible":   return "#f97316";
    case "moyen":    return "#f0f0f0";
    case "bon":      return "#a3e635";
    case "excellent":return "#a3e635";
    default:         return "#7a7a7a";
  }
}

const ScoreRing: React.FC<{ score: number; size?: number }> = ({ score, size = 70 }) => {
  const radius = size * 0.38;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 76 ? "#a3e635" : score >= 56 ? "#f0f0f0" : "#ef4444";
  const center = size / 2;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#2a2a2a" strokeWidth="3" />
        <circle cx={center} cy={center} r={radius} fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={circumference} strokeDashoffset={circumference - progress}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: `${size * 0.28}px`, color: "#f0f0f0", lineHeight: 1 }}>{score}</span>
        <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: `${size * 0.12}px`, color: "#7a7a7a" }}>/100</span>
      </div>
    </div>
  );
};

const AuditCard: React.FC<{ audit: AuditRecord; onClick: () => void }> = ({ audit, onClick }) => {
  const date = new Date(audit.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const hostname = (() => { try { return new URL(audit.url).hostname; } catch { return audit.url ?? "URL inconnue"; } })();
  return (
    <div onClick={onClick} style={{ padding: "24px 28px", border: "1px solid #2a2a2a", background: "#161616", cursor: "pointer", transition: "border-color 0.25s, background 0.25s", display: "flex", alignItems: "center", gap: "24px" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#4a4a4a"; (e.currentTarget as HTMLDivElement).style.background = "#1c1c1c"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#2a2a2a"; (e.currentTarget as HTMLDivElement).style.background = "#161616"; }}>
      <ScoreRing score={audit.score} size={64} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.08em", color: "#f0f0f0", marginBottom: "4px" }}>{hostname.toUpperCase()}</h3>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", letterSpacing: "0.1em", marginBottom: "8px" }}>{date}</p>
        <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: niveauColor(audit.niveau), padding: "2px 8px", border: `1px solid ${niveauColor(audit.niveau)}`, textTransform: "uppercase" }}>
          {audit.niveau}
        </span>
      </div>
      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#4a4a4a", flexShrink: 0 }}>→</span>
    </div>
  );
};

const statutColor = (statut: "ok" | "warn" | "ko") =>
  statut === "ok" ? "#a3e635" : statut === "warn" ? "#f97316" : "#ef4444";

const AuditDetail: React.FC<{ audit: AuditRecord; onClose: () => void }> = ({ audit, onClose }) => {
  const date = new Date(audit.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const hostname = (() => { try { return new URL(audit.url).hostname; } catch { return audit.url ?? "URL inconnue"; } })();

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={onClose}>
      <div style={{ background: "#161616", border: "1px solid #2a2a2a", maxWidth: "760px", width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "40px" }} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
          <div>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "6px" }}>{date}</p>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem", letterSpacing: "0.08em", color: "#f0f0f0", marginBottom: "6px" }}>{hostname.toUpperCase()}</h2>
            <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: niveauColor(audit.niveau), padding: "2px 8px", border: `1px solid ${niveauColor(audit.niveau)}`, textTransform: "uppercase" }}>
              {audit.niveau}
            </span>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#7a7a7a", cursor: "pointer", fontSize: "1.2rem", padding: "4px" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0f0")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}>✕</button>
        </div>

        {/* Score block */}
        <div style={{ display: "flex", gap: "28px", alignItems: "center", marginBottom: "32px", padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f" }}>
          <ScoreRing score={audit.score} size={90} />
          <div>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.25em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "4px" }}>Score global</p>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: niveauColor(audit.niveau), letterSpacing: "0.08em" }}>{audit.score} / 100</p>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#a0a0a0", marginTop: "4px", fontWeight: 300 }}>{audit.url}</p>
          </div>
        </div>

        {/* Critères */}
        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "14px" }}>Critères analysés</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
            {audit.criteres.map((c) => (
              <div key={c.nom} style={{ padding: "16px", border: "1px solid #2a2a2a", background: "#0f0f0f", borderLeft: `2px solid ${statutColor(c.statut)}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.95rem", letterSpacing: "0.06em", color: "#f0f0f0" }}>{c.titre.toUpperCase()}</p>
                  <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.08em", color: statutColor(c.statut), textTransform: "uppercase" }}>{c.statut}</span>
                </div>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", color: statutColor(c.statut), marginBottom: "6px" }}>{c.points} / {c.max} pts</p>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#a0a0a0", lineHeight: 1.6, fontWeight: 300 }}>{c.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick wins */}
        {audit.quick_wins && audit.quick_wins.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "14px" }}>Quick Wins</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {audit.quick_wins.map((qw) => (
                <div key={qw.numero} style={{ padding: "18px", border: "1px solid #2a2a2a", background: "#0f0f0f", borderLeft: "2px solid #f97316" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.06em", color: "#f0f0f0" }}>
                      <span style={{ color: "#f97316", marginRight: "8px" }}>{String(qw.numero).padStart(2, "0")}</span>
                      {qw.titre.toUpperCase()}
                    </p>
                    <div style={{ display: "flex", gap: "6px", flexShrink: 0, marginLeft: "12px" }}>
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.08em", color: "#7a7a7a", padding: "2px 8px", border: "1px solid #2a2a2a", textTransform: "uppercase" }}>{qw.impact}</span>
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.08em", color: "#7a7a7a", padding: "2px 8px", border: "1px solid #2a2a2a", textTransform: "uppercase" }}>{qw.effort}</span>
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.08em", color: "#60a5fa", padding: "2px 8px", border: "1px solid #2a2a2a", textTransform: "uppercase" }}>{qw.categorie}</span>
                    </div>
                  </div>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#a0a0a0", lineHeight: 1.6, fontWeight: 300 }}>{qw.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Plan long terme */}
        {audit.plan_long_terme && audit.plan_long_terme.length > 0 && (
          <div>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "14px" }}>Plan long terme</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {audit.plan_long_terme.map((phase, i) => (
                <div key={i} style={{ padding: "18px", border: "1px solid #2a2a2a", background: "#0f0f0f", borderLeft: "2px solid #60a5fa" }}>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: "#60a5fa", textTransform: "uppercase", marginBottom: "4px" }}>{phase.phase}</p>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.06em", color: "#f0f0f0", marginBottom: "6px" }}>{phase.titre.toUpperCase()}</p>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#a0a0a0", lineHeight: 1.6, fontWeight: 300 }}>{phase.actions}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AuditRecord | null>(null);
  const [plan, setPlan] = useState<string>("free");
  const [auditsLeft, setAuditsLeft] = useState<number>(0);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }

    authFetch("/api/history")
      .then((r) => r.json())
      .then((d) => setAudits((d.audits ?? []).filter((a: AuditRecord) => a.url)))
      .catch(console.error)
      .finally(() => setLoading(false));

    authFetch("/api/user-status")
      .then((r) => r.json())
      .then((d) => { setPlan(d.plan ?? "free"); setAuditsLeft(d.auditsLeft ?? 0); })
      .catch(console.error);
  }, [user, navigate]);

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? "";

  const scoreMoyen = audits.length > 0
    ? (audits.reduce((acc, a) => acc + a.score, 0) / audits.length).toFixed(0) + "/100"
    : "—";

  const dernierSite = audits[0]?.url
    ? (() => { try { return new URL(audits[0].url).hostname; } catch { return audits[0].url ?? "URL inconnue"; } })()
    : "—";

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh" }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 36px", background: "rgba(15,15,15,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <Link to="/" style={{ display: "flex", flexDirection: "column", lineHeight: 0.9, textDecoration: "none" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#f0f0f0" }}>OT</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#7a7a7a" }}>AR</span>
        </Link>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Link to="/" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#7a7a7a", textDecoration: "none", fontWeight: 500 }} onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")} onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}>DIAGNOSTIC</Link>
          <Link to="/pricing" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#7a7a7a", textDecoration: "none", fontWeight: 500 }} onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")} onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}>TARIFS</Link>
          <button onClick={() => signOut().then(() => navigate("/login"))} style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4a4a4a", background: "transparent", border: "none", cursor: "pointer", transition: "color 0.3s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")} onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}>Déconnexion</button>
        </div>
      </nav>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "120px 40px 80px" }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "12px" }}>.04 — Dashboard</p>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", letterSpacing: "0.06em", color: "#f0f0f0", marginBottom: "8px" }}>MES AUDITS</h1>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", marginBottom: "48px", letterSpacing: "0.1em" }}>
          {displayName} — Plan <span style={{ color: "#f0f0f0", textTransform: "capitalize" }}>{plan}</span>
          {plan === "free" && (<span> · {auditsLeft} audit{auditsLeft > 1 ? "s" : ""} restant{auditsLeft > 1 ? "s" : ""} · <Link to="/pricing" style={{ color: "#a3e635", textDecoration: "none" }}>Passer au Pro</Link></span>)}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "48px" }}>
          {[
            { label: "Audits total", value: audits.length },
            { label: "Score moyen", value: scoreMoyen },
            { label: "Dernier site", value: dernierSite.toUpperCase() },
          ].map((stat, i) => (
            <div key={i} style={{ padding: "20px", border: "1px solid #2a2a2a", background: "#161616" }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.25em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "8px" }}>{stat.label}</p>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#f0f0f0", letterSpacing: "0.06em" }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#7a7a7a", letterSpacing: "0.15em" }}>Chargement...</p>
        ) : audits.length === 0 ? (
          <div style={{ padding: "48px", border: "1px solid #2a2a2a", textAlign: "center" }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#7a7a7a", marginBottom: "16px" }}>Aucun audit pour le moment</p>
            <Link to="/" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#e8e8e8", textDecoration: "none", padding: "10px 20px", border: "1px solid #3a3a3a" }}>Lancer mon premier diagnostic →</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {audits.map((audit) => (<AuditCard key={audit.id} audit={audit} onClick={() => setSelected(audit)} />))}
          </div>
        )}
      </div>
      {selected && <AuditDetail audit={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default Dashboard;

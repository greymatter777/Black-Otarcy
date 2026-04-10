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
    case "moyen":    return "var(--text-1)";
    case "bon":      return "var(--accent)";
    case "excellent":return "var(--accent)";
    default:         return "var(--text-2)";
  }
}

const ScoreRing: React.FC<{ score: number; size?: number }> = ({ score, size = 70 }) => {
  const strokeWidth = 4;
  const r = (size / 2) - strokeWidth - 1;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 76 ? "#a3e635" : score >= 56 ? "#f0f0f0" : "#ef4444";

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)", display: "block", overflow: "visible" }}
      >
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2a2a2a" strokeWidth={strokeWidth} />
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: `${size * 0.28}px`, color: "var(--text-1)", lineHeight: 1, WebkitFontSmoothing: "antialiased" }}>{score}</span>
        <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: `${size * 0.13}px`, color: "var(--text-2)", WebkitFontSmoothing: "antialiased" }}>/100</span>
      </div>
    </div>
  );
};

const AuditCard: React.FC<{ audit: AuditRecord; onClick: () => void }> = ({ audit, onClick }) => {
  const date = new Date(audit.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const hostname = (() => { try { return new URL(audit.url).hostname; } catch { return audit.url ?? "URL inconnue"; } })();
  return (
    <div onClick={onClick} style={{ padding: "24px 28px", background: "var(--bg-page)", cursor: "pointer", display: "flex", alignItems: "center", gap: "24px" }}>
      <ScoreRing score={audit.score} size={64} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.08em", color: "var(--text-1)", marginBottom: "4px", WebkitFontSmoothing: "antialiased", textRendering: "geometricPrecision" }}>{hostname.toUpperCase()}</h3>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-2)", letterSpacing: "0.1em", marginBottom: "8px", WebkitFontSmoothing: "antialiased", textRendering: "geometricPrecision" }}>{date}</p>
        <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: niveauColor(audit.niveau), padding: "2px 8px", border: `1px solid ${niveauColor(audit.niveau)}`, textTransform: "uppercase" }}>
          {audit.niveau}
        </span>
      </div>
      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: "var(--text-3)", flexShrink: 0 }}>→</span>
    </div>
  );
};

const statutColor = (statut: "ok" | "warn" | "ko") =>
  statut === "ok" ? "var(--accent)" : statut === "warn" ? "#f97316" : "#ef4444";

const AuditDetail: React.FC<{ audit: AuditRecord; onClose: () => void }> = ({ audit, onClose }) => {
  const date = new Date(audit.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const hostname = (() => { try { return new URL(audit.url).hostname; } catch { return audit.url ?? "URL inconnue"; } })();

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={onClose}>
      <div style={{ background: "var(--bg-hero)", border: "1px solid var(--border-2)", maxWidth: "760px", width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "40px" }} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
          <div>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "6px" }}>{date}</p>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem", letterSpacing: "0.08em", color: "var(--text-1)", marginBottom: "6px" }}>{hostname.toUpperCase()}</h2>
            <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: niveauColor(audit.niveau), padding: "2px 8px", border: `1px solid ${niveauColor(audit.niveau)}`, textTransform: "uppercase" }}>
              {audit.niveau}
            </span>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--text-2)", cursor: "pointer", fontSize: "1.2rem", padding: "4px" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0f0")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}>✕</button>
        </div>

        {/* Score block */}
        <div style={{ display: "flex", gap: "28px", alignItems: "center", marginBottom: "32px", padding: "24px", border: "1px solid var(--border-2)", background: "var(--bg-page)" }}>
          <ScoreRing score={audit.score} size={90} />
          <div>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.25em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "4px" }}>Score global</p>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: niveauColor(audit.niveau), letterSpacing: "0.08em" }}>{audit.score} / 100</p>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#a0a0a0", marginTop: "4px", fontWeight: 300 }}>{audit.url}</p>
          </div>
        </div>

        {/* Critères */}
        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "14px" }}>Critères analysés</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
            {audit.criteres.map((c) => (
              <div key={c.nom} style={{ padding: "16px", border: "1px solid var(--border-2)", background: "var(--bg-page)", borderLeft: `2px solid ${statutColor(c.statut)}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.95rem", letterSpacing: "0.06em", color: "var(--text-1)" }}>{c.titre.toUpperCase()}</p>
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
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "14px" }}>Quick Wins</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {audit.quick_wins.map((qw) => (
                <div key={qw.numero} style={{ padding: "18px", border: "1px solid var(--border-2)", background: "var(--bg-page)", borderLeft: "2px solid #f97316" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.06em", color: "var(--text-1)" }}>
                      <span style={{ color: "#f97316", marginRight: "8px" }}>{String(qw.numero).padStart(2, "0")}</span>
                      {qw.titre.toUpperCase()}
                    </p>
                    <div style={{ display: "flex", gap: "6px", flexShrink: 0, marginLeft: "12px" }}>
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.08em", color: "var(--text-2)", padding: "2px 8px", border: "1px solid var(--border-2)", textTransform: "uppercase" }}>{qw.impact}</span>
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.08em", color: "var(--text-2)", padding: "2px 8px", border: "1px solid var(--border-2)", textTransform: "uppercase" }}>{qw.effort}</span>
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.08em", color: "#60a5fa", padding: "2px 8px", border: "1px solid var(--border-2)", textTransform: "uppercase" }}>{qw.categorie}</span>
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
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "14px" }}>Plan long terme</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {audit.plan_long_terme.map((phase, i) => (
                <div key={i} style={{ padding: "18px", border: "1px solid var(--border-2)", background: "var(--bg-page)", borderLeft: "2px solid #60a5fa" }}>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: "#60a5fa", textTransform: "uppercase", marginBottom: "4px" }}>{phase.phase}</p>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.06em", color: "var(--text-1)", marginBottom: "6px" }}>{phase.titre.toUpperCase()}</p>
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

const SkeletonRow: React.FC = () => (
  <div style={{ padding: "12px 18px", display: "flex", alignItems: "center", gap: "14px", borderBottom: "1px solid #1a1a1a" }}>
    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#161616", flexShrink: 0 }} className="skeleton-pulse" />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ height: 11, width: 130, background: "#161616" }} className="skeleton-pulse" />
      <div style={{ height: 8, width: 80, background: "#161616" }} className="skeleton-pulse" />
    </div>
  </div>
);

const MiniSparkline: React.FC<{ scores: number[] }> = ({ scores }) => {
  const max = Math.max(...scores, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 22, flexShrink: 0 }}>
      {scores.slice(-4).map((s, i, arr) => (
        <div key={i} style={{ width: 4, height: `${(s / max) * 100}%`, background: i === arr.length - 1 ? "#a3e635" : "#2a2a2a" }} />
      ))}
    </div>
  );
};

const ScoreEvolutionChart: React.FC<{ audits: AuditRecord[] }> = ({ audits }) => {
  const sorted = [...audits].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const W = 620, H = 130, padL = 28, padR = 20, padT = 14, padB = 22;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const toX = (i: number) => padL + (i / Math.max(sorted.length - 1, 1)) * innerW;
  const toY = (s: number) => padT + innerH - (s / 100) * innerH;
  const pts = sorted.map((a, i) => ({ x: toX(i), y: toY(a.score), score: a.score, date: new Date(a.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) }));
  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
  const area = `M${pts[0]?.x ?? 0},${pts[0]?.y ?? padT} ` + pts.map(p => `L${p.x},${p.y}`).join(" ") + ` L${pts[pts.length-1]?.x ?? W},${H - padB} L${pts[0]?.x ?? 0},${H - padB} Z`;

  if (sorted.length < 2) return (
    <div style={{ height: 130, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.68rem", color: "#4a4a4a" }}>Auditez ce site plusieurs fois pour voir l'évolution.</p>
    </div>
  );

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="evGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a3e635" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[100, 50, 0].map(v => (
        <g key={v}>
          <line x1={padL} y1={toY(v)} x2={W - padR} y2={toY(v)} stroke="#1a1a1a" strokeWidth="1" />
          <text x={padL - 4} y={toY(v) + 3} fill="#3a3a3a" fontSize="8" fontFamily="Raleway,sans-serif" textAnchor="end">{v}</text>
        </g>
      ))}
      <path d={area} fill="url(#evGrad)" />
      <polyline points={polyline} fill="none" stroke="#a3e635" strokeWidth="1.5" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={i === pts.length - 1 ? 4 : 3} fill={i === pts.length - 1 ? "#a3e635" : "#0f0f0f"} stroke="#a3e635" strokeWidth="1.5" />
          <text x={p.x} y={H - padB + 12} fill={i === pts.length - 1 ? "#a3e635" : "#4a4a4a"} fontSize="9" fontFamily="Raleway,sans-serif" textAnchor="middle">{p.date}</text>
          <text x={p.x} y={p.y - 7} fill={i === pts.length - 1 ? "#a3e635" : "#7a7a7a"} fontSize="9" fontFamily="Bebas Neue,sans-serif" textAnchor="middle">{p.score}</text>
        </g>
      ))}
    </svg>
  );
};

const CriteriaDonut: React.FC<{ criteres: AuditRecord["criteres"] }> = ({ criteres }) => {
  const total = criteres.reduce((acc, c) => acc + c.max, 0) || 1;
  const colors = ["#a3e635", "#60a5fa", "#f97316", "#4a4a4a", "#7a7a7a"];
  const circumference = 2 * Math.PI * 28;
  let offset = 0;
  const score = criteres.reduce((acc, c) => acc + c.points, 0);
  const maxScore = criteres.reduce((acc, c) => acc + c.max, 0);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <svg width="78" height="78" viewBox="0 0 78 78" style={{ flexShrink: 0 }}>
        <circle cx="39" cy="39" r="28" fill="none" stroke="#1a1a1a" strokeWidth="9" />
        {criteres.map((c, i) => {
          const dash = (c.max / total) * circumference;
          const el = (
            <circle key={c.nom} cx="39" cy="39" r="28" fill="none"
              stroke={colors[i % colors.length]} strokeWidth="9"
              strokeDasharray={`${dash} ${circumference}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 39 39)" />
          );
          offset += dash;
          return el;
        })}
        <text x="39" y="36" textAnchor="middle" fontFamily="Bebas Neue, sans-serif" fontSize="14" fill="#f0f0f0">{score}</text>
        <text x="39" y="45" textAnchor="middle" fontFamily="Raleway, sans-serif" fontSize="6" fill="#4a4a4a">/{maxScore}</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {criteres.map((c, i) => (
          <div key={c.nom} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", color: "#7a7a7a", letterSpacing: "0.05em" }}>
            <span style={{ width: 7, height: 7, background: colors[i % colors.length], flexShrink: 0 }} />
            {c.titre} · {Math.round((c.max / total) * 100)}%
          </div>
        ))}
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
    <div style={{ background: "var(--bg-page)", minHeight: "100vh" }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 36px", background: "var(--bg-nav)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <Link to="/" style={{ display: "flex", flexDirection: "column", lineHeight: 0.9, textDecoration: "none" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "var(--text-1)" }}>OT</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "var(--text-2)" }}>AR</span>
        </Link>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Link to="/" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "var(--text-2)", textDecoration: "none", fontWeight: 500 }} onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")} onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}>DIAGNOSTIC</Link>
          <Link to="/pricing" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "var(--text-2)", textDecoration: "none", fontWeight: 500 }} onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")} onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}>TARIFS</Link>
          <button onClick={() => signOut().then(() => navigate("/login"))} style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-3)", background: "transparent", border: "none", cursor: "pointer", transition: "color 0.3s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")} onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}>Déconnexion</button>
        </div>
      </nav>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "120px 40px 80px" }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "12px" }}>.04 — Dashboard</p>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", letterSpacing: "0.06em", color: "var(--text-1)", marginBottom: "8px" }}>MES AUDITS</h1>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-2)", marginBottom: "48px", letterSpacing: "0.1em" }}>
          {displayName} — Plan <span style={{ color: "var(--text-1)", textTransform: "capitalize" }}>{plan}</span>
          {plan === "free" && (<span> · {auditsLeft} audit{auditsLeft > 1 ? "s" : ""} restant{auditsLeft > 1 ? "s" : ""} · <Link to="/pricing" style={{ color: "var(--accent)", textDecoration: "none" }}>Passer au Pro</Link></span>)}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "48px" }}>
          {[
            { label: "Audits total", value: audits.length },
            { label: "Score moyen", value: scoreMoyen },
            { label: "Dernier site", value: dernierSite.toUpperCase() },
          ].map((stat, i) => (
            <div key={i} style={{ padding: "20px", border: "1px solid var(--border-2)", background: "var(--bg-hero)" }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.25em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "8px" }}>{stat.label}</p>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "var(--text-1)", letterSpacing: "0.06em" }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "var(--text-2)", letterSpacing: "0.15em" }}>Chargement...</p>
        ) : audits.length === 0 ? (
          <div style={{ padding: "48px", border: "1px solid var(--border-2)", textAlign: "center" }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "var(--text-2)", marginBottom: "16px" }}>Aucun audit pour le moment</p>
            <Link to="/" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-5)", textDecoration: "none", padding: "10px 20px", border: "1px solid var(--border-3)" }}>Lancer mon premier diagnostic →</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#2a2a2a" }}>
            {audits.map((audit) => (<AuditCard key={audit.id} audit={audit} onClick={() => setSelected(audit)} />))}
          </div>
        )}
      </div>
      {selected && <AuditDetail audit={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default Dashboard;

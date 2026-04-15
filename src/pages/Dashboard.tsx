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
  const W = 620, H = 220, padL = 28, padR = 20, padT = 20, padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const toX = (i: number) => padL + (i / Math.max(sorted.length - 1, 1)) * innerW;
  const toY = (s: number) => padT + innerH - (s / 100) * innerH;
  const pts = sorted.map((a, i) => ({ x: toX(i), y: toY(a.score), score: a.score, date: new Date(a.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) }));
  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
  const area = `M${pts[0]?.x ?? 0},${pts[0]?.y ?? padT} ` + pts.map(p => `L${p.x},${p.y}`).join(" ") + ` L${pts[pts.length-1]?.x ?? W},${H - padB} L${pts[0]?.x ?? 0},${H - padB} Z`;

  if (sorted.length < 2) return (
    <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.68rem", color: "#4a4a4a" }}>Auditez ce site plusieurs fois pour voir l'évolution.</p>
    </div>
  );

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ overflow: "visible", width: "100%", height: "100%" }}>
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

const CRITERE_COLOR = (nom: string): string => {
  if (nom.includes("crawler")) return "#a3e635";
  if (nom.includes("schema"))  return "#60a5fa";
  if (nom.includes("eeat"))    return "#f97316";
  if (nom.includes("faq"))     return "#818cf8";
  if (nom.includes("llm"))     return "#34d399";
  if (nom.includes("meta"))    return "#fb923c";
  if (nom.includes("wikidata"))return "#38bdf8";
  if (nom.includes("sitemap")) return "#a78bfa";
  if (nom.includes("open_graph") || nom.includes("og")) return "#f472b6";
  if (nom.includes("https"))   return "#4ade80";
  return "#7a7a7a";
};

const CRITERE_OPACITY = (_nom: string): number => 1;

const CriteriaDonut: React.FC<{ criteres: AuditRecord["criteres"]; score: number }> = ({ criteres, score }) => {
  const CX = 350, CY = 125;
  const BASE_R = 90, STEP = 8, SW = 5;

  const annotated = criteres.map((c, i) => {
    const r = BASE_R - i * STEP;
    const pct = c.points / Math.max(c.max, 1);
    const circ = 2 * Math.PI * r;
    const dash = circ * pct;
    const midAngleDeg = -90 + (pct * 360) / 2;
    const midAngleRad = midAngleDeg * Math.PI / 180;
    const px = CX + r * Math.cos(midAngleRad);
    const py = CY + r * Math.sin(midAngleRad);
    const side = Math.cos(midAngleRad) < 0 ? "left" : "right";
    return { ...c, r, pct, circ, dash, px, py, side };
  });

  const left: typeof annotated = [];
  const right: typeof annotated = [];
  for (const item of annotated) {
    let s = item.side;
    if (s === "left"  && left.length  >= 5) s = "right";
    if (s === "right" && right.length >= 5) s = "left";
    if (s === "left") left.push(item);
    else right.push(item);
  }

  const LABEL_YS = [28, 65, 102, 140, 177];
  const LEFT_X  = 240;
  const RIGHT_X = 460;

  return (
    <svg viewBox="0 0 700 250" width="100%" style={{ display: "block", overflow: "visible" }}>

      {/* Tracks */}
      {criteres.map((c, i) => (
        <circle key={`track-${c.nom}`}
          cx={CX} cy={CY} r={BASE_R - i * STEP}
          fill="none" stroke="#1a1a1a" strokeWidth={SW}
        />
      ))}

      {/* Arcs */}
      {annotated.map((c) => (
        <circle key={`arc-${c.nom}`}
          cx={CX} cy={CY} r={c.r}
          fill="none"
          stroke={CRITERE_COLOR(c.nom.toLowerCase())}
          strokeWidth={SW}
          strokeOpacity={CRITERE_OPACITY(c.nom.toLowerCase())}
          strokeDasharray={`${c.dash} ${c.circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${CX} ${CY})`}
        />
      ))}

      {/* Score centre */}
      <text x={CX} y={119}
        textAnchor="middle"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize="24"
        fill="#f0f0f0"
      >{score}</text>
      <text x={CX} y={133}
        textAnchor="middle"
        fontFamily="'Raleway', sans-serif"
        fontSize="8"
        fill="#4a4a4a"
        letterSpacing="1"
      >/100</text>

      {/* Labels GAUCHE */}
      {left.map((c, j) => {
        const ly = LABEL_YS[j];
        const color = CRITERE_COLOR(c.nom.toLowerCase());
        return (
          <g key={`ll-${c.nom}`}>
            <line x1={LEFT_X + 6} y1={ly} x2={c.px} y2={c.py}
              stroke={color} strokeWidth={0.7} strokeOpacity={0.3}
            />
            <text x={LEFT_X} y={ly + 4}
              textAnchor="end"
              fontFamily="'Raleway', sans-serif"
              fontSize="8.5"
              fill={color}
            >{c.titre}</text>
            <text x={LEFT_X - 52} y={ly + 4}
              textAnchor="end"
              fontFamily="'Bebas Neue', sans-serif"
              fontSize="9"
              fill={color}
              opacity={0.6}
            >{Math.round(c.pct * 100)}%</text>
          </g>
        );
      })}

      {/* Labels DROITE */}
      {right.map((c, j) => {
        const ly = LABEL_YS[j];
        const color = CRITERE_COLOR(c.nom.toLowerCase());
        return (
          <g key={`rl-${c.nom}`}>
            <line x1={RIGHT_X - 6} y1={ly} x2={c.px} y2={c.py}
              stroke={color} strokeWidth={0.7} strokeOpacity={0.3}
            />
            <text x={RIGHT_X} y={ly + 4}
              textAnchor="start"
              fontFamily="'Raleway', sans-serif"
              fontSize="8.5"
              fill={color}
            >{c.titre}</text>
            <text x={RIGHT_X + 52} y={ly + 4}
              textAnchor="start"
              fontFamily="'Bebas Neue', sans-serif"
              fontSize="9"
              fill={color}
              opacity={0.6}
            >{Math.round(c.pct * 100)}%</text>
          </g>
        );
      })}

    </svg>
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
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [animated, setAnimated] = useState(false);

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

  useEffect(() => {
    const urlList = Object.keys(audits.reduce((acc, a) => {
      let host = a.url;
      try { host = new URL(a.url).hostname; } catch {}
      acc[host] = true;
      return acc;
    }, {} as Record<string, true>));
    if (urlList.length > 0 && !selectedUrl) setSelectedUrl(urlList[0]);
  }, [audits.length]);

  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, [selectedUrl]);

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? "";

  // Grouper les audits par hostname
  const auditsByUrl = audits.reduce((acc, a) => {
    let host = a.url;
    try { host = new URL(a.url).hostname; } catch {}
    if (!acc[host]) acc[host] = [];
    acc[host].push(a);
    return acc;
  }, {} as Record<string, AuditRecord[]>);

  const urlList = Object.keys(auditsByUrl);
  const filteredAudits = selectedUrl ? (auditsByUrl[selectedUrl] ?? []) : [];
  const latestAudit = filteredAudits.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] ?? null;
  const progression = filteredAudits.length >= 2 && latestAudit
    ? latestAudit.score - [...filteredAudits].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0].score
    : null;

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", fontFamily: "'Raleway', sans-serif" }}>
      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 32px", background: "var(--bg-nav)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <Link to="/" style={{ display: "flex", flexDirection: "column", lineHeight: 0.9, textDecoration: "none" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.15em", color: "var(--text-1)" }}>OT</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.15em", color: "var(--text-2)" }}>AR</span>
        </Link>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Link to="/" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", color: "var(--text-2)", textDecoration: "none" }} onMouseEnter={e => e.currentTarget.style.color="#e8e8e8"} onMouseLeave={e => e.currentTarget.style.color="var(--text-2)"}>DIAGNOSTIC</Link>
          <Link to="/pricing" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", color: "var(--text-2)", textDecoration: "none" }} onMouseEnter={e => e.currentTarget.style.color="#e8e8e8"} onMouseLeave={e => e.currentTarget.style.color="var(--text-2)"}>TARIFS</Link>
          <Link to="/" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", padding: "8px 18px", background: "var(--accent)", color: "#0f0f0f", fontWeight: 600, textDecoration: "none" }}>+ AUDIT</Link>
          <button onClick={() => signOut().then(() => navigate("/login"))} style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-3)", background: "transparent", border: "none", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.color="#ef4444"} onMouseLeave={e => e.currentTarget.style.color="var(--text-3)"}>Déconnexion</button>
        </div>
      </nav>

      {/* TWO-COLUMN LAYOUT */}
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "100vh", paddingTop: 57 }}>

        {/* SIDEBAR */}
        <aside style={{ background: "#080808", borderRight: "1px solid #1a1a1a", padding: "32px 20px", display: "flex", flexDirection: "column", gap: 24, position: "sticky", top: 57, height: "calc(100vh - 57px)", overflowY: "auto" }}>
          {/* User block */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1a1a1a", border: "1px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.7rem", color: "#7a7a7a", flexShrink: 0 }}>
                {(displayName.charAt(0) || "U").toUpperCase()}
              </div>
              <div>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.68rem", color: "var(--text-1)", letterSpacing: "0.05em" }}>{displayName}</p>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.54rem", color: "var(--text-2)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Plan <span style={{ color: "var(--accent)" }}>{plan}</span></p>
              </div>
            </div>
            {/* Quota bar */}
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.52rem", letterSpacing: "0.3em", color: "#3a3a3a", textTransform: "uppercase", marginBottom: 6 }}>Quota</p>
            <div style={{ height: 2, background: "#2a2a2a" }}>
              {plan === "free" && <div style={{ height: 2, background: "var(--accent)", borderRadius: 2, width: `${Math.max(0, Math.min(100, ((3 - auditsLeft) / 3) * 100))}%`, transition: "width 0.6s ease" }} />}
              {plan !== "free" && <div style={{ height: 2, background: "var(--accent)", borderRadius: 2, width: "100%" }} />}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.54rem", color: "#4a4a4a" }}>{plan === "free" ? `${auditsLeft} restant${auditsLeft > 1 ? "s" : ""}` : "Illimité"}</span>
              {plan === "free" && <Link to="/pricing" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.54rem", color: "var(--accent)", textDecoration: "none" }}>Upgrade →</Link>}
            </div>
          </div>

          {/* URL list */}
          <div className="anim-delay-1" style={{ flex: 1 }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.52rem", letterSpacing: "0.3em", color: "#3a3a3a", textTransform: "uppercase", marginBottom: 10 }}>URLs auditées</p>
            {loading ? (
              [1,2,3].map(i => <div key={i} className="skeleton-pulse" style={{ height: 52, background: "#161616", marginBottom: 6 }} />)
            ) : urlList.length === 0 ? (
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "#3a3a3a" }}>Aucun audit</p>
            ) : (
              urlList.map(url => {
                const urlAudits = auditsByUrl[url];
                const latest = [...urlAudits].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
                const isActive = selectedUrl === url;
                return (
                  <div key={url} onClick={() => setSelectedUrl(url)} style={{ padding: "10px 12px", border: `1px solid ${isActive ? "var(--accent)" : "#2a2a2a"}`, background: isActive ? "#0d0d0d" : "transparent", marginBottom: 6, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "border-color 0.2s" }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "var(--text-4)", letterSpacing: "0.05em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 150 }}>{url}</p>
                      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.52rem", color: "#4a4a4a", letterSpacing: "0.08em", marginTop: 2 }}>{urlAudits.length} audit{urlAudits.length > 1 ? "s" : ""}</p>
                    </div>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", color: niveauColor(latest.niveau), flexShrink: 0, marginLeft: 8 }}>{latest.score}</span>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer sidebar */}
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.52rem", letterSpacing: "0.15em", color: "#3a3a3a", textTransform: "uppercase", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.color="#ef4444"} onMouseLeave={e => e.currentTarget.style.color="#3a3a3a"} onClick={() => signOut().then(() => navigate("/login"))}>Déconnexion</p>
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ padding: "40px 44px 80px", overflowY: "auto" }}>
          {!selectedUrl || urlList.length === 0 ? (
            /* Empty state */
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", textAlign: "center" }}>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#2a2a2a", letterSpacing: "0.1em", marginBottom: 16 }}>AUCUN AUDIT</p>
              <Link to="/" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#f0f0f0", textDecoration: "none", padding: "12px 28px", border: "1px solid #3a3a3a" }}>Lancer mon premier diagnostic →</Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                <div>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: 6 }}>.04 — Dashboard</p>
                  <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "0.06em", color: "var(--text-1)", lineHeight: 1 }}>{selectedUrl?.toUpperCase()}</h1>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", color: "#4a4a4a", letterSpacing: "0.1em", marginTop: 4 }}>{filteredAudits.length} audit{filteredAudits.length > 1 ? "s" : ""} · dernier le {latestAudit ? new Date(latestAudit.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "—"}</p>
                </div>
                <Link to="/" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "10px 22px", background: "var(--accent)", color: "#0f0f0f", fontWeight: 600, textDecoration: "none", flexShrink: 0 }}>Relancer →</Link>
              </div>

              {/* KPI row */}
              <div className="anim-delay-2" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
                {[
                  { label: "Score actuel", value: latestAudit ? `${latestAudit.score}` : "—", unit: "/100", color: latestAudit ? niveauColor(latestAudit.niveau) : "var(--text-2)", hint: latestAudit?.niveau ?? "" },
                  { label: "Progression", value: progression !== null ? `${progression > 0 ? "+" : ""}${progression}` : "—", unit: " pts", color: progression !== null ? (progression >= 0 ? "var(--accent)" : "#ef4444") : "var(--text-2)", hint: `sur ${filteredAudits.length} audits` },
                  { label: "Quick Wins", value: latestAudit?.quick_wins?.length ?? "—", unit: "", color: "#f97316", hint: "actions identifiées" },
                ].map((k, i) => (
                  <div key={i} style={{ background: "var(--bg-hero)", border: "1px solid var(--border-2)", padding: "16px 18px" }}>
                    <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.54rem", letterSpacing: "0.25em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: 6 }}>{k.label}</p>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: k.color as string, lineHeight: 1 }}>{k.value}<span style={{ fontSize: "0.9rem", color: "var(--text-2)" }}>{k.unit}</span></p>
                    <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.54rem", color: "#3a3a3a", marginTop: 4 }}>{k.hint}</p>
                  </div>
                ))}
              </div>

              {/* ROW 1 : Évolution + Critères Détail — 1fr 1fr */}
              {latestAudit && latestAudit.criteres && latestAudit.criteres.length > 0 && (
                <div className="anim-delay-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>

                  {/* Évolution du score */}
                  <div style={{ background: "var(--bg-hero)", border: "1px solid var(--border-2)", padding: "18px 20px", display: "flex", flexDirection: "column", minHeight: 320 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.82rem", letterSpacing: "0.1em", color: "var(--text-1)" }}>ÉVOLUTION DU SCORE</p>
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.5rem", letterSpacing: "0.15em", color: "var(--accent)", border: "1px solid var(--accent)", padding: "2px 6px", textTransform: "uppercase" }}>{selectedUrl}</span>
                    </div>
                    <ScoreEvolutionChart audits={filteredAudits} />
                  </div>

                  {/* Critères Détail */}
                  <div className="anim-delay-4" style={{ background: "var(--bg-hero)", border: "1px solid var(--border-2)", padding: "18px 20px", overflowY: "auto" }}>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.82rem", letterSpacing: "0.1em", color: "var(--text-1)", marginBottom: 4 }}>CRITÈRES DÉTAIL</p>
                    <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.54rem", color: "#4a4a4a", letterSpacing: "0.1em", marginBottom: 14 }}>Scores par critère</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {latestAudit.criteres.map((c, idx) => (
                        <div key={c.nom}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                            <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", color: "var(--text-2)", letterSpacing: "0.05em" }}>{c.titre}</span>
                            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.78rem", color: statutColor(c.statut) }}>{c.points}/{c.max}</span>
                          </div>
                          <div style={{ height: 2, background: "#2a2a2a", borderRadius: 2 }}>
                            <div style={{ height: 2, width: animated ? `${(c.points / Math.max(c.max, 1)) * 100}%` : "0%", background: statutColor(c.statut), borderRadius: 2, transition: "width 0.8s ease-out", transitionDelay: `${idx * 60}ms` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ROW 2 : Répartition critères — pleine largeur */}
              {latestAudit && latestAudit.criteres && latestAudit.criteres.length > 0 && (
                <div className="anim-delay-5" style={{ background: "var(--bg-hero)", border: "1px solid var(--border-2)", padding: "20px 24px", marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.82rem", letterSpacing: "0.1em", color: "var(--text-1)", marginBottom: 4 }}>RÉPARTITION CRITÈRES</p>
                      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.54rem", color: "#4a4a4a", letterSpacing: "0.1em" }}>
                        Dernier audit · {new Date(latestAudit.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.2rem", color: "var(--text-1)", lineHeight: 1, letterSpacing: "0.02em" }}>
                        {latestAudit.score}<span style={{ fontSize: "0.9rem", color: "#3a3a3a", letterSpacing: "0.1em" }}> /100</span>
                      </p>
                      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.52rem", color: "var(--accent)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 2 }}>Score AIO</p>
                    </div>
                  </div>
                  <CriteriaDonut criteres={latestAudit.criteres} score={latestAudit.score} />
                </div>
              )}

              {/* Audit history */}
              <div className="anim-delay-6" style={{ background: "var(--bg-hero)", border: "1px solid var(--border-2)" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.88rem", letterSpacing: "0.1em", color: "var(--text-1)" }}>HISTORIQUE</p>
                  <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.54rem", letterSpacing: "0.15em", color: "#4a4a4a", textTransform: "uppercase" }}>{filteredAudits.length} entrée{filteredAudits.length > 1 ? "s" : ""}</span>
                </div>
                {loading ? (
                  [1,2,3].map(i => <SkeletonRow key={i} />)
                ) : (
                  [...filteredAudits].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(audit => {
                    const scores = [...(auditsByUrl[selectedUrl ?? ""] ?? [])].sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map(a => a.score);
                    const date = new Date(audit.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
                    return (
                      <div key={audit.id} onClick={() => setSelected(audit)} style={{ padding: "12px 18px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid #1a1a1a", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.background="#111"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                        <div style={{ width: 38, height: 38, borderRadius: "50%", border: `2px solid ${niveauColor(audit.niveau)}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.82rem", color: niveauColor(audit.niveau), flexShrink: 0 }}>{audit.score}</div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.88rem", letterSpacing: "0.08em", color: "var(--text-1)" }}>{date}</p>
                          <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.52rem", letterSpacing: "0.1em", color: niveauColor(audit.niveau), padding: "1px 6px", border: `1px solid ${niveauColor(audit.niveau)}`, textTransform: "uppercase" }}>{audit.niveau}</span>
                        </div>
                        <MiniSparkline scores={scores} />
                        <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", color: "#3a3a3a", marginLeft: 8 }}>→</span>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {selected && <AuditDetail audit={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default Dashboard;

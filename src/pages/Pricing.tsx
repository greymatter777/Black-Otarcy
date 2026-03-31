import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { authFetch } from "../lib/useAuthFetch";

const plans = [
  {
    id: "free",
    name: "Découverte",
    badge: null,
    price: "0€",
    period: "",
    description: "Pour tester Otarcy",
    features: ["Score global /100", "Statut des 10 critères techniques", "Résultat immédiat"],
    locked: [],
    cta: "Commencer gratuitement",
    highlighted: false,
    color: "#7a7a7a",
  },
  {
    id: "pro",
    name: "Essentiel",
    badge: "POPULAIRE",
    price: "19€",
    period: "/ mois",
    description: "Pour les entrepreneurs & freelances",
    features: ["Détail des 10 critères", "Quick wins priorisés", "Plan d'action long terme"],
    locked: [],
    cta: "Passer à l'Essentiel",
    highlighted: true,
    color: "#a3e635",
  },
  {
    id: "agency",
    name: "Expert",
    badge: null,
    price: "99€",
    period: "/ mois",
    description: "Pour les agences & consultants",
    features: ["Tout l'Essentiel", "Perception réelle par 4 LLMs", "Verbatim brut + analyse delta"],
    locked: [],
    cta: "Passer à l'Expert",
    highlighted: false,
    color: "#60a5fa",
  },
];

const Pricing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    if (planId === "free") return;
    if (!user) { navigate("/login"); return; }

    setLoadingPlan(planId);
    setError(null);

    try {
      const res = await authFetch("/api/create-checkout", {
        method: "POST",
        body: JSON.stringify({ plan: planId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur paiement.");
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message ?? "Une erreur s'est produite.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh", padding: "120px 40px 80px" }}>
      <Link to="/" style={{ position: "fixed", top: "28px", left: "36px", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#f0f0f0", textDecoration: "none", display: "flex", flexDirection: "column", lineHeight: 0.9 }}>
        <span>OT</span>
        <span style={{ color: "#7a7a7a" }}>AR</span>
      </Link>

      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "12px" }}>.03 — Tarifs</p>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 7vw, 5.5rem)", letterSpacing: "0.06em", color: "#f0f0f0", marginBottom: "16px" }}>DIAGNOSTIQUEZ VOTRE<br />PRÉSENCE IA</h1>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "#7a7a7a", marginBottom: "64px", fontWeight: 300, letterSpacing: "0.1em" }}>Sans engagement — résiliez à tout moment</p>

        {error && (
          <div style={{ padding: "14px 20px", background: "#1a0a0a", border: "1px solid #3a1a1a", marginBottom: "32px" }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#ef4444" }}>⚠ {error}</p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
          {plans.map((plan) => (
            <div key={plan.id} style={{ padding: "36px 28px", border: plan.highlighted ? `1px solid ${plan.color}` : "1px solid #2a2a2a", background: plan.highlighted ? "#161616" : "#0f0f0f", position: "relative", transition: "border-color 0.3s" }}>
              {plan.badge && (
                <div style={{ position: "absolute", top: "-1px", left: "28px", background: plan.color, padding: "3px 10px" }}>
                  <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.55rem", letterSpacing: "0.25em", color: "#0f0f0f", fontWeight: 600 }}>{plan.badge}</span>
                </div>
              )}
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.3em", color: plan.color, textTransform: "uppercase", marginBottom: "8px", fontWeight: 600 }}>{plan.name}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "8px" }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", color: "#f0f0f0", lineHeight: 1 }}>{plan.price}</span>
                <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#7a7a7a" }}>{plan.period}</span>
              </div>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", marginBottom: "28px", fontWeight: 300 }}>{plan.description}</p>
              <div style={{ marginBottom: "24px" }}>
                {plan.features.map((feature, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
                    <span style={{ color: plan.color, fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }}>+</span>
                    <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#d4d4d4", lineHeight: 1.5, fontWeight: 300 }}>{feature}</p>
                  </div>
                ))}
                {plan.locked.map((feature, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
                    <span style={{ color: "#3a3a3a", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }}>×</span>
                    <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#3a3a3a", lineHeight: 1.5, fontWeight: 300 }}>{feature}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => handleUpgrade(plan.id)} disabled={loadingPlan === plan.id || plan.id === "free"}
                style={{ width: "100%", fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "12px", border: plan.highlighted ? "none" : "1px solid #3a3a3a", background: plan.highlighted ? plan.color : "transparent", color: plan.highlighted ? "#0f0f0f" : "#e8e8e8", cursor: plan.id === "free" ? "default" : "pointer", opacity: loadingPlan === plan.id ? 0.7 : 1, fontWeight: plan.highlighted ? 600 : 400, transition: "background 0.25s, opacity 0.2s" }}>
                {loadingPlan === plan.id ? "REDIRECTION..." : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.15em", color: "#4a4a4a", marginTop: "48px", textAlign: "center" }}>
          Paiement sécurisé par Stripe — Sans carte pour le plan gratuit
        </p>
      </div>
    </div>
  );
};

export default Pricing;

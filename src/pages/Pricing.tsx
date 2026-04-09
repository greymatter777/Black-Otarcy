import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { authFetch } from "../lib/useAuthFetch";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
    color: "var(--text-2)",
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
    color: "var(--accent)",
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
    <div style={{ background: "var(--bg-page)", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "120px 40px 80px" }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "12px" }}>.03 — Tarifs</p>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 7vw, 5.5rem)", letterSpacing: "0.06em", color: "var(--text-1)", marginBottom: "16px" }}>DIAGNOSTIQUEZ VOTRE<br />PRÉSENCE IA</h1>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "var(--text-2)", marginBottom: "64px", fontWeight: 300, letterSpacing: "0.1em" }}>Sans engagement — résiliez à tout moment</p>

        {error && (
          <div style={{ padding: "14px 20px", background: "#1a0a0a", border: "1px solid #3a1a1a", marginBottom: "32px" }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#ef4444" }}>⚠ {error}</p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
          {plans.map((plan) => (
            <div key={plan.id} style={{ padding: "36px 28px", border: plan.highlighted ? `1px solid ${plan.color}` : "1px solid var(--border-2)", background: plan.highlighted ? "var(--bg-hero)" : "var(--bg-page)", position: "relative", transition: "border-color 0.3s" }}>
              {plan.badge && (
                <div style={{ position: "absolute", top: "-1px", left: "28px", background: plan.color, padding: "3px 10px" }}>
                  <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.55rem", letterSpacing: "0.25em", color: "var(--bg-page)", fontWeight: 600 }}>{plan.badge}</span>
                </div>
              )}
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.3em", color: plan.color, textTransform: "uppercase", marginBottom: "8px", fontWeight: 600 }}>{plan.name}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "8px" }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", color: "var(--text-1)", lineHeight: 1 }}>{plan.price}</span>
                <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "var(--text-2)" }}>{plan.period}</span>
              </div>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "var(--text-2)", marginBottom: "28px", fontWeight: 300 }}>{plan.description}</p>
              <div style={{ marginBottom: "24px" }}>
                {plan.features.map((feature, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
                    <span style={{ color: plan.color, fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }}>+</span>
                    <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "var(--text-4)", lineHeight: 1.5, fontWeight: 300 }}>{feature}</p>
                  </div>
                ))}
                {plan.locked.map((feature, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
                    <span style={{ color: "var(--border-3)", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }}>×</span>
                    <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "var(--border-3)", lineHeight: 1.5, fontWeight: 300 }}>{feature}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => handleUpgrade(plan.id)} disabled={loadingPlan === plan.id || plan.id === "free"}
                style={{ width: "100%", fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "12px", border: plan.highlighted ? "none" : "1px solid var(--border-3)", background: plan.highlighted ? plan.color : "transparent", color: plan.highlighted ? "var(--bg-page)" : "var(--text-5)", cursor: plan.id === "free" ? "default" : "pointer", opacity: loadingPlan === plan.id ? 0.7 : 1, fontWeight: plan.highlighted ? 600 : 400, transition: "background 0.25s, opacity 0.2s" }}>
                {loadingPlan === plan.id ? "REDIRECTION..." : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-3)", marginTop: "48px", textAlign: "center" }}>
          Paiement sécurisé par Stripe — Sans carte pour le plan gratuit
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;

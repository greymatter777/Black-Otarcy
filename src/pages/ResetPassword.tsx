import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    // Supabase envoie le token dans l'URL hash — il est géré automatiquement
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // L'utilisateur est en mode reset — on laisse le formulaire s'afficher
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    if (password !== confirm) {
      setMessage({ type: "error", text: "Les mots de passe ne correspondent pas." });
      return;
    }
    if (password.length < 8) {
      setMessage({ type: "error", text: "Le mot de passe doit faire au moins 8 caractères." });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Mot de passe mis à jour ! Redirection..." });
      setTimeout(() => navigate("/"), 2000);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg-primary)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", padding: "24px",
    }}>
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px", pointerEvents: "none",
      }} />
      <div style={{
        position: "relative", zIndex: 1, width: "100%", maxWidth: "420px",
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px", padding: "40px 36px", backdropFilter: "blur(20px)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "48px", height: "48px",
            background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            borderRadius: "12px", marginBottom: "16px",
            fontSize: "20px", fontWeight: "800", color: "#fff",
          }}>OT</div>
          <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: "700", margin: "0 0 4px" }}>Nouveau mot de passe</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 }}>Choisis un mot de passe sécurisé</p>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: "13px", marginBottom: "6px" }}>Nouveau mot de passe</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
            style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: "13px", marginBottom: "6px" }}>Confirmer</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••"
            style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
        </div>

        {message && (
          <div style={{
            padding: "12px 14px", borderRadius: "10px", marginBottom: "16px", fontSize: "13px",
            background: message.type === "error" ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
            border: `1px solid ${message.type === "error" ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
            color: message.type === "error" ? "#f87171" : "#4ade80",
          }}>{message.text}</div>
        )}

        <button onClick={handleReset} disabled={loading} style={{
          width: "100%", padding: "13px",
          background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
          border: "none", borderRadius: "10px",
          color: "#fff", fontSize: "15px", fontWeight: "600",
          cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
        }}>
          {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
        </button>
      </div>
    </div>
  );
}

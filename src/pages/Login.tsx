import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Mode = "login" | "register" | "forgot";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handleEmail = async () => {
    setLoading(true);
    setMessage(null);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
      } else if (mode === "register") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({ type: "success", text: "Vérifie ta boîte mail pour confirmer ton compte." });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage({ type: "success", text: "Email de réinitialisation envoyé." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message ?? "Une erreur est survenue." });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) setMessage({ type: "error", text: error.message });
    setLoading(false);
  };

  const handleMagicLink = async () => {
    if (!email) { setMessage({ type: "error", text: "Entre ton email d'abord." }); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    if (error) setMessage({ type: "error", text: error.message });
    else setMessage({ type: "success", text: "Magic link envoyé ! Vérifie ta boîte mail." });
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      padding: "24px",
    }}>


      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: "420px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px",
        padding: "40px 36px",
        backdropFilter: "blur(20px)",
      }}>
        {/* Retour */}
        <div style={{ marginBottom: "24px" }}>
          <a href="/" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textDecoration: "none", textTransform: "uppercase" }}>← Retour</a>
        </div>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "48px", height: "48px",
            background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            borderRadius: "12px", marginBottom: "16px",
            fontSize: "20px", fontWeight: "800", color: "#fff", letterSpacing: "-1px",
          }}>OT</div>
          <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: "700", margin: "0 0 4px", letterSpacing: "-0.5px" }}>
            {mode === "login" ? "Bienvenue" : mode === "register" ? "Créer un compte" : "Mot de passe oublié"}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 }}>
            {mode === "login" ? "Connecte-toi à Otarcy" : mode === "register" ? "Rejoins Otarcy" : "On t'envoie un email"}
          </p>
        </div>

        {/* OAuth buttons */}
        {mode !== "forgot" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
            <button onClick={() => handleOAuth("google")} disabled={loading} style={oauthBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continuer avec Google
            </button>
            <button onClick={() => handleOAuth("github")} disabled={loading} style={oauthBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              Continuer avec GitHub
            </button>
          </div>
        )}

        {/* Separator */}
        {mode !== "forgot" && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>ou</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
          </div>
        )}

        {/* Email field */}
        <div style={{ marginBottom: "12px" }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="toi@exemple.com"
            style={inputStyle}
            onKeyDown={e => e.key === "Enter" && handleEmail()}
          />
        </div>

        {/* Password field */}
        {mode !== "forgot" && (
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Mot de passe</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              onKeyDown={e => e.key === "Enter" && handleEmail()}
            />
          </div>
        )}

        {/* Message */}
        {message && (
          <div style={{
            padding: "12px 14px", borderRadius: "10px", marginBottom: "16px", fontSize: "13px",
            background: message.type === "error" ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
            border: `1px solid ${message.type === "error" ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
            color: message.type === "error" ? "#f87171" : "#4ade80",
          }}>{message.text}</div>
        )}

        {/* Main CTA */}
        <button onClick={handleEmail} disabled={loading} style={{
          width: "100%", padding: "13px",
          background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
          border: "none", borderRadius: "10px",
          color: "#fff", fontSize: "15px", fontWeight: "600",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          marginBottom: "12px",
          transition: "opacity 0.2s",
        }}>
          {loading ? "Chargement..." : mode === "login" ? "Se connecter" : mode === "register" ? "Créer le compte" : "Envoyer le lien"}
        </button>

        {/* Magic link */}
        {mode === "login" && (
          <button onClick={handleMagicLink} disabled={loading} style={{
            width: "100%", padding: "12px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            color: "rgba(255,255,255,0.6)", fontSize: "14px",
            cursor: "pointer", marginBottom: "20px",
            transition: "border-color 0.2s",
          }}>
            ✉️ Connexion par magic link
          </button>
        )}

        {/* Footer links */}
        <div style={{ textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
          {mode === "login" && (
            <>
              <button onClick={() => { setMode("forgot"); setMessage(null); }} style={linkBtn}>Mot de passe oublié ?</button>
              <span style={{ margin: "0 8px" }}>·</span>
              <button onClick={() => { setMode("register"); setMessage(null); }} style={linkBtn}>Créer un compte</button>
            </>
          )}
          {mode === "register" && (
            <button onClick={() => { setMode("login"); setMessage(null); }} style={linkBtn}>Déjà un compte ? Se connecter</button>
          )}
          {mode === "forgot" && (
            <button onClick={() => { setMode("login"); setMessage(null); }} style={linkBtn}>← Retour à la connexion</button>
          )}
        </div>
      </div>
    </div>
  );
}

const oauthBtn: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
  width: "100%", padding: "12px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  color: "rgba(255,255,255,0.85)", fontSize: "14px", fontWeight: "500",
  cursor: "pointer",
  transition: "background 0.2s, border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block", color: "rgba(255,255,255,0.5)", fontSize: "13px",
  marginBottom: "6px", fontWeight: "500",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  color: "#fff", fontSize: "14px",
  outline: "none", boxSizing: "border-box",
};

const linkBtn: React.CSSProperties = {
  background: "none", border: "none",
  color: "rgba(139,92,246,0.9)", fontSize: "13px",
  cursor: "pointer", padding: 0,
};

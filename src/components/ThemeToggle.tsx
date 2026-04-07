import React from "react";
import { useTheme } from "../lib/ThemeContext";

interface ThemeToggleProps {
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {showLabel && (
        <span style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: "0.60rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--text-2)",
        }}>
          Thème
        </span>
      )}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
        style={{
          width: "44px",
          height: "24px",
          borderRadius: "12px",
          border: "1px solid var(--border-2)",
          background: isDark ? "#161616" : "#f0f0eb",
          position: "relative",
          cursor: "pointer",
          padding: 0,
          flexShrink: 0,
          transition: "background 0.25s ease, border-color 0.25s ease",
        }}
      >
        <div style={{
          position: "absolute",
          top: "3px",
          left: isDark ? "3px" : "23px",
          width: "18px",
          height: "18px",
          borderRadius: "9px",
          background: "var(--accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "left 0.25s ease",
        }}>
          {isDark ? (
            // Lune
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M8.5 5.8A3.5 3.5 0 015.2 1.5a3.5 3.5 0 100 7 3.5 3.5 0 003.3-2.7z" fill="#0f0f0f"/>
            </svg>
          ) : (
            // Soleil
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="2" fill="#ffffff"/>
              <line x1="5" y1="1" x2="5" y2="2.2" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="5" y1="7.8" x2="5" y2="9" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="1" y1="5" x2="2.2" y2="5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="7.8" y1="5" x2="9" y2="5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="2.5" y1="2.5" x2="3.3" y2="3.3" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="6.7" y1="6.7" x2="7.5" y2="7.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="7.5" y1="2.5" x2="6.7" y2="3.3" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="3.3" y1="6.7" x2="2.5" y2="7.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          )}
        </div>
      </button>
    </div>
  );
};

export default ThemeToggle;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { label: "À PROPOS", to: "/about" },
    { label: "NEWSLETTER", to: "#newsletter" },
    { label: "TARIFS", to: "/pricing" },
    { label: "BLOG", to: "/blog" },
  ];

  const handleScrollLink = (id: string) => {
    setMobileOpen(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <>
      <style>{`
        .nav-desktop { display: flex; }
        .nav-hamburger { display: none; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 24px",
        background: scrolled ? "var(--bg-nav)" : "var(--bg-nav)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        transition: "background 0.4s",
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", flexDirection: "column", lineHeight: 0.9, textDecoration: "none" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "var(--text-1)" }}>OT</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "var(--text-2)" }}>CY</span>
        </Link>

        {/* ── DESKTOP NAV ── */}
        <div className="nav-desktop" style={{ gap: "28px", alignItems: "center" }}>
          {navLinks.map((item) => (
            item.to.startsWith("#") ? (
              <button key={item.label} type="button"
                onClick={() => handleScrollLink(item.to.replace("#", ""))}
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "var(--text-2)", fontWeight: 500, background: "transparent", border: "none", cursor: "pointer", transition: "color 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
              >{item.label}</button>
            ) : (
              <Link key={item.label} to={item.to}
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "var(--text-2)", fontWeight: 500, textDecoration: "none", transition: "color 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0f0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
              >{item.label}</Link>
            )
          ))}

          {/* Auth desktop */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <ThemeToggle />
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <Link to="/dashboard"
                  style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.15em", color: "var(--text-2)", textDecoration: "none", transition: "color 0.3s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
                >{user?.user_metadata?.full_name ?? user?.email}</Link>
                <button type="button" onClick={() => signOut().then(() => navigate("/login"))}
                  style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-3)", background: "transparent", border: "none", cursor: "pointer", transition: "color 0.3s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}
                >Déconnexion</button>
              </div>
            ) : (
              <button type="button" onClick={() => navigate("/login")}
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "7px 16px", border: "1px solid var(--border-3)", background: "transparent", color: "var(--text-5)", cursor: "pointer", transition: "border-color 0.3s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e8e8e8"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3a3a"; }}
              >Connexion</button>
            )}
          </div>
        </div>

        {/* ── HAMBURGER BUTTON (mobile uniquement) ── */}
        <button
          className="nav-hamburger"
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          style={{ flexDirection: "column", gap: "5px", background: "transparent", border: "none", cursor: "pointer", padding: "4px", zIndex: 110 }}
          aria-label="Menu"
        >
          <span style={{ display: "block", width: "22px", height: "1.5px", background: mobileOpen ? "var(--accent)" : "var(--text-5)", transition: "transform 0.3s, opacity 0.3s", transform: mobileOpen ? "translateY(6.5px) rotate(45deg)" : "none" }} />
          <span style={{ display: "block", width: "22px", height: "1.5px", background: "var(--text-5)", transition: "opacity 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: "22px", height: "1.5px", background: mobileOpen ? "var(--accent)" : "var(--text-5)", transition: "transform 0.3s, opacity 0.3s", transform: mobileOpen ? "translateY(-6.5px) rotate(-45deg)" : "none" }} />
        </button>
      </nav>

      {/* ── MOBILE MENU OVERLAY ── */}
      {mobileOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "var(--bg-primary)", zIndex: 99,
          display: "flex", flexDirection: "column",
          padding: "100px 32px 48px",
          overflowY: "auto",
        }}>
          {navLinks.map((item) => (
            item.to.startsWith("#") ? (
              <button key={item.label} type="button"
                onClick={() => handleScrollLink(item.to.replace("#", ""))}
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.8rem", letterSpacing: "0.25em", color: "var(--text-2)", fontWeight: 500, background: "transparent", border: "none", borderBottom: "1px solid var(--border-1)", cursor: "pointer", padding: "18px 0", textAlign: "left", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
              >{item.label}</button>
            ) : (
              <Link key={item.label} to={item.to}
                onClick={() => setMobileOpen(false)}
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.8rem", letterSpacing: "0.25em", color: "var(--text-2)", fontWeight: 500, textDecoration: "none", borderBottom: "1px solid var(--border-1)", padding: "18px 0", display: "block", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0f0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
              >{item.label}</Link>
            )
          ))}

          <div style={{ padding: "18px 0", borderBottom: "1px solid var(--border-1)" }}>
            <ThemeToggle showLabel={true} />
          </div>

          {/* Auth mobile */}
          <div style={{ marginTop: "32px" }}>
            {user ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                  style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", letterSpacing: "0.15em", color: "var(--text-2)", textDecoration: "none" }}
                >{user?.user_metadata?.full_name ?? user?.email}</Link>
                <button type="button" onClick={() => { setMobileOpen(false); signOut().then(() => navigate("/login")); }}
                  style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", background: "transparent", border: "1px solid #3a1a1a", padding: "10px 16px", cursor: "pointer", textAlign: "left" }}
                >Déconnexion</button>
              </div>
            ) : (
              <button type="button" onClick={() => { setMobileOpen(false); navigate("/login"); }}
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "12px 24px", border: "1px solid var(--border-3)", background: "transparent", color: "var(--text-5)", cursor: "pointer", width: "100%" }}
              >Connexion</button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// ─── HOOK REVEAL ──────────────────────────────────────────────────────────────
function useReveal(dep?: unknown) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.05 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [dep]);
}

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  read_time: number;
  published_at: string;
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useReveal(loading);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const res = await fetch(
          `${supabaseUrl}/rest/v1/blog_posts?published=eq.true&order=published_at.desc&select=id,slug,title,excerpt,category,read_time,published_at`,
          { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPosts(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>

      {/* Schema.org Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": "https://otarcy.app/blog#blog",
            "name": "Blog AIO — Otarcy",
            "description": "Articles de référence sur l'AI Optimization (AIO) pour les PME françaises. Stratégies, guides et analyses par Otarcy.",
            "url": "https://otarcy.app/blog",
            "inLanguage": "fr",
            "publisher": {
              "@type": "Organization",
              "name": "Otarcy",
              "url": "https://otarcy.app"
            }
          })
        }}
      />

      {/* ── NAVBAR RETOUR ── */}
      <nav style={{ padding: "20px 60px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.15em", color: "#f0f0f0", textDecoration: "none" }}>
          OT/<span style={{ color: "#a3e635" }}>CY</span>
        </Link>
        <Link to="/" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.2em", color: "#7a7a7a", textDecoration: "none", textTransform: "uppercase" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#a3e635")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
        >
          ← Retour
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: "80px 60px 60px", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.25em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px" }}>
            .01 — Blog
          </p>
          <h1 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "0.06em", color: "#f0f0f0", lineHeight: 0.95, marginBottom: "24px" }}>
            RESSOURCES AIO
          </h1>
          <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.88rem", color: "#7a7a7a", lineHeight: 1.9, fontWeight: 300, maxWidth: "580px" }}>
            Guides, analyses et stratégies pour optimiser la visibilité de votre marque auprès de ChatGPT, Perplexity, Claude et Gemini.
          </p>
        </div>
      </section>

      {/* ── ARTICLES ── */}
      <section style={{ padding: "60px 60px 100px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>

          {loading && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#4a4a4a" }}>Chargement des articles...</p>
            </div>
          )}

          {error && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#4a4a4a" }}>Impossible de charger les articles.</p>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#4a4a4a" }}>Aucun article publié pour le moment.</p>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#1a1a1a" }}>
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <article
                    style={{ background: "#0f0f0f", padding: "32px 28px", cursor: "pointer", transition: "background 0.2s", display: "block" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#111"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#0f0f0f"; }}
                  >
                    {/* Meta */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", color: "#a3e635", textTransform: "uppercase" }}>
                        {post.category}
                      </span>
                      <span style={{ width: "1px", height: "10px", background: "#2a2a2a" }} />
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "#4a4a4a" }}>
                        {post.read_time} min de lecture
                      </span>
                      <span style={{ width: "1px", height: "10px", background: "#2a2a2a" }} />
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "#4a4a4a" }}>
                        {formatDate(post.published_at)}
                      </span>
                    </div>

                    {/* Titre */}
                    <h2 style={{ fontFamily: "'Raleway', sans-serif", fontSize: "1rem", color: "#f0f0f0", fontWeight: 600, marginBottom: "10px", lineHeight: 1.4, letterSpacing: "0.01em" }}>
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#7a7a7a", lineHeight: 1.8, fontWeight: 300, marginBottom: "16px" }}>
                      {post.excerpt}
                    </p>

                    {/* CTA */}
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", color: "#a3e635", textTransform: "uppercase" }}>
                      Lire l'article →
                    </span>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* CTA bas de page */}
          <div className="reveal" style={{ marginTop: "60px", padding: "32px", border: "1px solid #a3e635", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
            <div>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.08em", color: "#f0f0f0", marginBottom: "6px" }}>
                TESTEZ VOTRE SCORE AIO
              </p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#7a7a7a", fontWeight: 300 }}>
                Découvrez comment ChatGPT, Claude et Gemini perçoivent votre marque.
              </p>
            </div>
            <Link to="/#audit"
              style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "12px 28px", background: "#a3e635", color: "#0f0f0f", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Auditer ma marque →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

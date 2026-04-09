import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>

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

      <Navbar />

      {/* ── HERO ── */}
      <section style={{ padding: "80px 60px 60px", borderBottom: "1px solid var(--border-1)" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.25em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "16px" }}>
            .01 — Blog
          </p>
          <h1 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "0.06em", color: "var(--text-1)", lineHeight: 0.95, marginBottom: "24px" }}>
            RESSOURCES AIO
          </h1>
          <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.9, fontWeight: 300, maxWidth: "580px" }}>
            Guides, analyses et stratégies pour optimiser la visibilité de votre marque auprès de ChatGPT, Perplexity, Claude et Gemini.
          </p>
        </div>
      </section>

      {/* ── ARTICLES ── */}
      <section style={{ padding: "60px 60px 100px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>

          {loading && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "var(--text-3)" }}>Chargement des articles...</p>
            </div>
          )}

          {error && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "var(--text-3)" }}>Impossible de charger les articles.</p>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "var(--text-3)" }}>Aucun article publié pour le moment.</p>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-1)" }}>
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <article
                    style={{ background: "var(--bg-page)", padding: "32px 28px", cursor: "pointer", transition: "background 0.2s", display: "block" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#111"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#0f0f0f"; }}
                  >
                    {/* Meta */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", color: "var(--accent)", textTransform: "uppercase" }}>
                        {post.category}
                      </span>
                      <span style={{ width: "1px", height: "10px", background: "var(--border-2)" }} />
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "var(--text-3)" }}>
                        {post.read_time} min de lecture
                      </span>
                      <span style={{ width: "1px", height: "10px", background: "var(--border-2)" }} />
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "var(--text-3)" }}>
                        {formatDate(post.published_at)}
                      </span>
                    </div>

                    {/* Titre */}
                    <h2 style={{ fontFamily: "'Raleway', sans-serif", fontSize: "1rem", color: "var(--text-1)", fontWeight: 600, marginBottom: "10px", lineHeight: 1.4, letterSpacing: "0.01em" }}>
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "var(--text-2)", lineHeight: 1.8, fontWeight: 300, marginBottom: "16px" }}>
                      {post.excerpt}
                    </p>

                    {/* CTA */}
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", color: "var(--accent)", textTransform: "uppercase" }}>
                      Lire l'article →
                    </span>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* CTA bas de page */}
          <div className="reveal" style={{ marginTop: "60px", padding: "32px", border: "1px solid var(--accent)", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
            <div>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.08em", color: "var(--text-1)", marginBottom: "6px" }}>
                TESTEZ VOTRE SCORE AIO
              </p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "var(--text-2)", fontWeight: 300 }}>
                Découvrez comment ChatGPT, Claude et Gemini perçoivent votre marque.
              </p>
            </div>
            <Link to="/#audit"
              style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "12px 28px", background: "var(--accent)", color: "var(--bg-page)", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Auditer ma marque →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

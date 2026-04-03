import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";

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
  content: string;
  category: string;
  read_time: number;
  published_at: string;
  published: boolean;
}

// ─── RENDU MARKDOWN LÉGER ─────────────────────────────────────────────────────
// Pas de dépendance externe — rendu des éléments essentiels : ##, ###, **, listes, paragraphes
function renderContent(content: string): JSX.Element[] {
  const lines = content.split("\n");
  const elements: JSX.Element[] = [];
  let key = 0;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // H2
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.06em", color: "#f0f0f0", marginTop: "48px", marginBottom: "16px", lineHeight: 1.1 }}>
          {line.replace("## ", "")}
        </h2>
      );
      i++; continue;
    }

    // H3
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.88rem", fontWeight: 700, color: "#a3e635", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "32px", marginBottom: "12px" }}>
          {line.replace("### ", "")}
        </h3>
      );
      i++; continue;
    }

    // Liste à puces
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].replace("- ", ""));
        i++;
      }
      elements.push(
        <ul key={key++} style={{ margin: "16px 0 16px 0", padding: 0, listStyle: "none" }}>
          {items.map((item, idx) => (
            <li key={idx} style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
              <span style={{ color: "#a3e635", fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.8rem", marginTop: "3px", flexShrink: 0 }}>→</span>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "#c0c0c0", lineHeight: 1.8, fontWeight: 300 }}
                dangerouslySetInnerHTML={{ __html: renderInline(item) }}
              />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ligne vide
    if (line.trim() === "") { i++; continue; }

    // Paragraphe normal
    elements.push(
      <p key={key++} style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.88rem", color: "#c0c0c0", lineHeight: 2, fontWeight: 300, marginBottom: "20px" }}
        dangerouslySetInnerHTML={{ __html: renderInline(line) }}
      />
    );
    i++;
  }

  return elements;
}

// Rendu inline : **gras**, ''italique''
function renderInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#f0f0f0;font-weight:600">$1</strong>')
    .replace(/''(.+?)''/g, '<em>$1</em>');
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  useReveal(post);

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const res = await fetch(
          `${supabaseUrl}/rest/v1/blog_posts?slug=eq.${slug}&published=eq.true&limit=1`,
          { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!data || data.length === 0) { setNotFound(true); return; }
        setPost(data[0]);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  if (notFound) return <Navigate to="/blog" replace />;

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>

      {/* Schema.org Article — injecté dès que le post est chargé */}
      {post && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "@id": `https://otarcy.app/blog/${post.slug}`,
              "headline": post.title,
              "description": post.excerpt,
              "datePublished": post.published_at,
              "dateModified": post.published_at,
              "inLanguage": "fr",
              "url": `https://otarcy.app/blog/${post.slug}`,
              "author": {
                "@type": "Organization",
                "name": "Otarcy",
                "url": "https://otarcy.app"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Otarcy",
                "url": "https://otarcy.app",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://otarcy.app/favicon.png"
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://otarcy.app/blog/${post.slug}`
              },
              "articleSection": post.category,
              "keywords": "AIO, AI Optimization, SEO, référencement IA, PME, ChatGPT, Perplexity, Otarcy"
            })
          }}
        />
      )}

      {/* ── NAVBAR ── */}
      <nav style={{ padding: "20px 60px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.15em", color: "#f0f0f0", textDecoration: "none" }}>
          OT/<span style={{ color: "#a3e635" }}>CY</span>
        </Link>
        <Link to="/blog" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.2em", color: "#7a7a7a", textDecoration: "none", textTransform: "uppercase" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#a3e635")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
        >
          ← Blog
        </Link>
      </nav>

      {/* ── LOADING ── */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#4a4a4a" }}>Chargement...</p>
        </div>
      )}

      {/* ── ARTICLE ── */}
      {!loading && post && (
        <>
          {/* Hero article */}
          <section style={{ padding: "80px 60px 60px", borderBottom: "1px solid #1a1a1a" }}>
            <div style={{ maxWidth: "720px", margin: "0 auto" }}>

              {/* Meta */}
              <div className="reveal" style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
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
              <h1 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "0.04em", color: "#f0f0f0", lineHeight: 1, marginBottom: "24px" }}>
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.95rem", color: "#7a7a7a", lineHeight: 1.9, fontWeight: 300, borderLeft: "2px solid #a3e635", paddingLeft: "20px" }}>
                {post.excerpt}
              </p>
            </div>
          </section>

          {/* Contenu */}
          <section style={{ padding: "60px 60px 100px" }}>
            <div style={{ maxWidth: "720px", margin: "0 auto" }}>
              {renderContent(post.content)}

              {/* Séparateur */}
              <div style={{ height: "1px", background: "linear-gradient(90deg, #a3e635 0%, transparent 100%)", margin: "60px 0 48px" }} />

              {/* CTA final */}
              <div className="reveal" style={{ padding: "32px", border: "1px solid #a3e635", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
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

              {/* Retour blog */}
              <div style={{ marginTop: "32px", textAlign: "center" }}>
                <Link to="/blog"
                  style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.2em", color: "#4a4a4a", textDecoration: "none", textTransform: "uppercase" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#a3e635")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}
                >
                  ← Tous les articles
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

import jsPDF from "jspdf";

interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface KpiData {
  notoriete: number;
  coherence: number;
  digital: number;
  contenu: number;
}

interface AuditData {
  brand: string;
  score: number;
  analysis: string;
  recommendations: string[];
  swot?: SwotData | null;
  kpis?: KpiData | null;
  created_at?: string;
  userEmail?: string;
}

export function exportAuditPDF(audit: AuditData) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const H = 297;
  let y = 0;
  let page = 1;

  // ─── COULEURS ────────────────────────────────────────
  const BLACK: [number, number, number] = [15, 15, 15];
  const DARK: [number, number, number] = [22, 22, 22];
  const WHITE: [number, number, number] = [240, 240, 240];
  const MUTED: [number, number, number] = [122, 122, 122];
  const DIM: [number, number, number] = [74, 74, 74];
  const GREEN: [number, number, number] = [163, 230, 53];
  const RED: [number, number, number] = [239, 68, 68];
  const BLUE: [number, number, number] = [96, 165, 250];
  const ORANGE: [number, number, number] = [249, 115, 22];
  const scoreColor: [number, number, number] = audit.score >= 7 ? GREEN : audit.score >= 5 ? WHITE : RED;

  // ─── HELPERS ─────────────────────────────────────────
  const fillPage = () => {
    doc.setFillColor(...BLACK);
    doc.rect(0, 0, W, H, "F");
  };

  const addFooter = () => {
    doc.setFillColor(...DARK);
    doc.rect(0, H - 18, W, 18, "F");
    doc.setDrawColor(...DIM);
    doc.setLineWidth(0.2);
    doc.line(14, H - 18, W - 14, H - 18);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...DIM);
    doc.text("OTARCY — AIO Brand Audit", 14, H - 9);
    doc.text(`Page ${page}`, W / 2, H - 9, { align: "center" });
    doc.text("otarcy.app", W - 14, H - 9, { align: "right" });
  };

  const newPage = () => {
    addFooter();
    doc.addPage();
    page++;
    fillPage();
    y = 24;
  };

  const checkPageBreak = (needed: number) => {
    if (y + needed > H - 24) newPage();
  };

  const sectionHeader = (label: string) => {
    checkPageBreak(16);
    doc.setFillColor(...DARK);
    doc.rect(14, y - 2, W - 28, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED);
    doc.text(label, 18, y + 5);
    doc.setDrawColor(...DIM);
    doc.setLineWidth(0.2);
    doc.line(14, y + 8, W - 14, y + 8);
    y += 14;
  };

  const kpiBar = (label: string, value: number, color: [number, number, number]) => {
    checkPageBreak(14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(label, 14, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...WHITE);
    doc.text(`${value}`, W - 14, y, { align: "right" });
    // Track bg
    doc.setFillColor(...DIM);
    doc.rect(14, y + 2, W - 28, 2, "F");
    // Track fill
    doc.setFillColor(...color);
    doc.rect(14, y + 2, (W - 28) * (value / 100), 2, "F");
    y += 10;
  };

  // ─── PAGE 1 ───────────────────────────────────────────
  fillPage();

  // Header band
  doc.setFillColor(...DARK);
  doc.rect(0, 0, W, 52, "F");

  // Logo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...WHITE);
  doc.text("OT", 14, 18);
  doc.setTextColor(...MUTED);
  doc.text("AR", 14, 26);
  doc.setDrawColor(...DIM);
  doc.setLineWidth(0.3);
  doc.line(34, 10, 34, 34);

  // Titre
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("AIO BRAND AUDIT", 40, 17);
  doc.setFontSize(20);
  doc.setTextColor(...WHITE);
  doc.text(audit.brand.toUpperCase(), 40, 28);

  const date = audit.created_at
    ? new Date(audit.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...DIM);
  doc.text(date, 40, 36);
  if (audit.userEmail) doc.text(audit.userEmail, 40, 42);

  // Score cercle
  const cx = 182, cy = 26, r = 16;
  doc.setDrawColor(...DIM);
  doc.setLineWidth(1.5);
  doc.circle(cx, cy, r, "S");
  doc.setDrawColor(...scoreColor);
  doc.setLineWidth(2);
  const segments = 36;
  const filled = Math.round((audit.score / 10) * segments);
  for (let i = 0; i < filled; i++) {
    const a1 = ((i / segments) * 360 - 90) * (Math.PI / 180);
    const a2 = (((i + 1) / segments) * 360 - 90) * (Math.PI / 180);
    doc.line(cx + r * Math.cos(a1), cy + r * Math.sin(a1), cx + r * Math.cos(a2), cy + r * Math.sin(a2));
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...WHITE);
  doc.text(`${audit.score}`, cx - (audit.score >= 10 ? 5 : 3), cy + 3);
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text("/10", cx - 2, cy + 9);

  y = 62;

  // ─── 1. SCORE DE MARQUE ──────────────────────────────
  sectionHeader("SCORE DE MARQUE");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(212, 212, 212);
  const analysisLines = doc.splitTextToSize(audit.analysis, W - 28);
  doc.text(analysisLines, 14, y);
  y += analysisLines.length * 5.5 + 14;

  // ─── 2. KPI DE MARQUE ────────────────────────────────
  if (audit.kpis) {
    checkPageBreak(60);
    sectionHeader("KPI DE MARQUE");
    kpiBar("Notoriété", audit.kpis.notoriete, GREEN);
    kpiBar("Cohérence", audit.kpis.coherence, BLUE);
    kpiBar("Présence digitale", audit.kpis.digital, ORANGE);
    kpiBar("Qualité de contenu", audit.kpis.contenu, WHITE);
    y += 8;
  }

  // ─── 3. ANALYSE SWOT ─────────────────────────────────
  if (audit.swot) {
    checkPageBreak(20);
    sectionHeader("ANALYSE SWOT");

    const swotQuadrants = [
      { label: "FORCES", items: audit.swot.strengths, color: GREEN, symbol: "+" },
      { label: "FAIBLESSES", items: audit.swot.weaknesses, color: RED, symbol: "−" },
      { label: "OPPORTUNITÉS", items: audit.swot.opportunities, color: BLUE, symbol: "↑" },
      { label: "MENACES", items: audit.swot.threats, color: ORANGE, symbol: "!" },
    ];

    const halfW = (W - 28 - 6) / 2;

    for (let row = 0; row < 2; row++) {
      const q1 = swotQuadrants[row * 2];
      const q2 = swotQuadrants[row * 2 + 1];
      const startY = y;

      const renderSwotCol = (q: typeof q1, xStart: number) => {
        let cy2 = startY;
        doc.setFillColor(...DARK);
        doc.rect(xStart, cy2 - 2, halfW, 10, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.5);
        doc.setTextColor(...q.color);
        doc.text(`${q.symbol} ${q.label}`, xStart + 4, cy2 + 5);
        cy2 += 14;
        q.items.forEach((item) => {
          const lines = doc.splitTextToSize(item, halfW - 10);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(...q.color);
          doc.text(q.symbol, xStart + 2, cy2);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(212, 212, 212);
          doc.text(lines, xStart + 8, cy2);
          cy2 += lines.length * 4.8 + 4;
        });
        return cy2;
      };

      const endY1 = renderSwotCol(q1, 14);
      const endY2 = renderSwotCol(q2, 14 + halfW + 6);
      y = Math.max(endY1, endY2) + 10;
      checkPageBreak(10);
    }

    y += 6;
  }

  // ─── 4. RECOMMANDATIONS ──────────────────────────────
  checkPageBreak(20);
  sectionHeader("RECOMMANDATIONS");
  audit.recommendations.forEach((item) => {
    const lines = doc.splitTextToSize(item, W - 34);
    checkPageBreak(lines.length * 4.8 + 8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...WHITE);
    doc.text("→", 14, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(212, 212, 212);
    doc.text(lines, 22, y);
    y += lines.length * 4.8 + 5;
  });

  y += 8;

  // ─── FOOTER ──────────────────────────────────────────
  addFooter();

  const filename = `otarcy-audit-${audit.brand.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

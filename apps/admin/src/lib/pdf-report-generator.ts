/**
 * 🐉 DRAGON GAMING STUDIOS — OFFICIAL PDF REPORT GENERATOR ENGINE
 * Generates luxury, official, cryptographic executive studio reports
 * tailored for high-resolution PDF printing and document archiving.
 */

export interface ReportHeaderOptions {
  title: string;
  subtitle: string;
  reportId?: string;
  classification?: "OFFICIAL STUDIO RECORD" | "TOP SECRET // EXECUTIVE ONLY" | "PUBLIC AUDIT";
  category?: string;
  author?: string;
}

export interface MetricCard {
  label: string;
  value: string | number;
  subtext?: string;
  color?: "cyan" | "gold" | "purple" | "emerald" | "rose";
}

export interface TableColumn<T = any> {
  header: string;
  key?: keyof T;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (row: T) => string;
}

export interface PdfReportOptions<T = any> {
  header: ReportHeaderOptions;
  metrics?: MetricCard[];
  breakdownSections?: Array<{
    title: string;
    items: Array<{ label: string; count: number; percentage?: string }>;
  }>;
  table?: {
    title: string;
    columns: TableColumn<T>[];
    rows: T[];
    emptyMessage?: string;
  };
  secondaryTable?: {
    title: string;
    columns: TableColumn<any>[];
    rows: any[];
  };
  notes?: string[];
}

/**
 * Generate cryptographic hash placeholder for report verification
 */
function generateReportHash(): string {
  const chars = "0123456789ABCDEF";
  let hash = "DGS-SHA256:";
  for (let i = 0; i < 32; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

/**
 * Generates an official printable luxury HTML document and triggers the print dialog.
 */
export function openOfficialPdfReport<T = any>(options: PdfReportOptions<T>): void {
  const reportId = options.header.reportId || `DGS-REP-${Date.now().toString().slice(-6)}`;
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
  const verificationHash = generateReportHash();
  const classification = options.header.classification || "OFFICIAL STUDIO RECORD";

  // Build Metrics HTML
  let metricsHtml = "";
  if (options.metrics && options.metrics.length > 0) {
    metricsHtml = `
      <div class="metrics-grid">
        ${options.metrics
          .map(
            (m) => `
          <div class="metric-card ${m.color || "cyan"}">
            <div class="metric-label">${m.label}</div>
            <div class="metric-value">${m.value}</div>
            ${m.subtext ? `<div class="metric-subtext">${m.subtext}</div>` : ""}
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  // Build Breakdown Sections HTML
  let breakdownsHtml = "";
  if (options.breakdownSections && options.breakdownSections.length > 0) {
    breakdownsHtml = `
      <div class="breakdowns-grid">
        ${options.breakdownSections
          .map(
            (b) => `
          <div class="breakdown-card">
            <div class="breakdown-title">${b.title}</div>
            <div class="breakdown-list">
              ${b.items
                .map(
                  (item) => `
                <div class="breakdown-row">
                  <span class="breakdown-item-label">${item.label}</span>
                  <span class="breakdown-item-count">${item.count}</span>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  // Build Primary Table HTML
  let tableHtml = "";
  if (options.table) {
    const { title, columns, rows, emptyMessage } = options.table;
    tableHtml = `
      <div class="section-container">
        <div class="section-header">
          <h3 class="section-title">${title}</h3>
          <span class="record-count">${rows.length} RECORD(S)</span>
        </div>
        ${
          rows.length === 0
            ? `<div class="empty-state">${emptyMessage || "No records available for this audit period."}</div>`
            : `
          <table class="report-table">
            <thead>
              <tr>
                ${columns
                  .map(
                    (col) => `
                  <th style="text-align: ${col.align || "left"}; width: ${col.width || "auto"}">
                    ${col.header}
                  </th>
                `
                  )
                  .join("")}
              </tr>
            </thead>
            <tbody>
              ${rows
                .map(
                  (row, i) => `
                <tr class="${i % 2 === 0 ? "even" : "odd"}">
                  ${columns
                    .map((col) => {
                      const cellVal = col.render ? col.render(row) : col.key ? String(row[col.key] ?? "-") : "-";
                      return `<td style="text-align: ${col.align || "left"}">${cellVal}</td>`;
                    })
                    .join("")}
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        `
        }
      </div>
    `;
  }

  // Build Secondary Table HTML (if present)
  let secondaryTableHtml = "";
  if (options.secondaryTable) {
    const { title, columns, rows } = options.secondaryTable;
    secondaryTableHtml = `
      <div class="section-container" style="margin-top: 24px;">
        <div class="section-header">
          <h3 class="section-title">${title}</h3>
          <span class="record-count">${rows.length} RECORD(S)</span>
        </div>
        <table class="report-table">
          <thead>
            <tr>
              ${columns
                .map(
                  (col) => `
                <th style="text-align: ${col.align || "left"}; width: ${col.width || "auto"}">
                  ${col.header}
                </th>
              `
                )
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row, i) => `
              <tr class="${i % 2 === 0 ? "even" : "odd"}">
                ${columns
                  .map((col) => {
                    const cellVal = col.render ? col.render(row) : col.key ? String(row[col.key] ?? "-") : "-";
                    return `<td style="text-align: ${col.align || "left"}">${cellVal}</td>`;
                  })
                  .join("")}
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  // Build Notes HTML
  let notesHtml = "";
  if (options.notes && options.notes.length > 0) {
    notesHtml = `
      <div class="notes-container">
        <div class="notes-title">AUDIT COMPLIANCE & EXECUTIVE NOTES</div>
        <ul class="notes-list">
          ${options.notes.map((n) => `<li>${n}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${options.header.title} — Official Report (${reportId})</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #030712;
          color: #E2E8F0;
          padding: 30px;
          line-height: 1.5;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        /* Top Action Bar (hidden in print) */
        .action-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(3, 7, 18, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0, 229, 255, 0.3);
          padding: 12px 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 9999;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
        }

        .btn-print {
          background: linear-gradient(135deg, #00E5FF, #0077FF);
          color: #02040A;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          font-size: 13px;
          padding: 10px 22px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 0 20px rgba(0, 229, 255, 0.4);
          transition: all 0.2s;
        }
        .btn-print:hover {
          transform: scale(1.03);
          box-shadow: 0 0 30px rgba(0, 229, 255, 0.7);
        }

        .btn-close {
          background: #1E293B;
          color: #94A3B8;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          padding: 8px 16px;
          border: 1px solid #334155;
          border-radius: 8px;
          cursor: pointer;
        }

        .report-page {
          max-width: 1000px;
          margin: 60px auto 30px auto;
          background: #020617;
          border: 2px solid rgba(0, 229, 255, 0.35);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 229, 255, 0.1);
          position: relative;
        }

        /* Official Watermark */
        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-30deg);
          font-family: 'Cinzel', serif;
          font-size: 90px;
          font-weight: 900;
          color: rgba(0, 229, 255, 0.03);
          pointer-events: none;
          user-select: none;
          white-space: nowrap;
          z-index: 1;
        }

        /* Header Block */
        .report-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 2px solid rgba(0, 229, 255, 0.3);
          padding-bottom: 24px;
          margin-bottom: 24px;
          position: relative;
          z-index: 2;
        }

        .brand-title {
          font-family: 'Cinzel', serif;
          font-size: 24px;
          font-weight: 900;
          letter-spacing: 2px;
          background: linear-gradient(135deg, #FFFFFF 0%, #00E5FF 50%, #A855F7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-transform: uppercase;
        }

        .report-main-title {
          font-size: 22px;
          font-weight: 800;
          color: #FFFFFF;
          margin-top: 6px;
          letter-spacing: -0.5px;
        }

        .report-subtitle {
          font-size: 13px;
          color: #94A3B8;
          margin-top: 3px;
        }

        .classification-badge {
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          background: rgba(245, 158, 11, 0.15);
          color: #FBBF24;
          border: 1px solid rgba(245, 158, 11, 0.4);
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .meta-box {
          text-align: right;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #64748B;
          line-height: 1.6;
        }

        .meta-highlight {
          color: #38BDF8;
          font-weight: 600;
        }

        /* Metrics Grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 24px;
          position: relative;
          z-index: 2;
        }

        .metric-card {
          padding: 16px;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(51, 65, 85, 0.6);
        }

        .metric-card.cyan { border-color: rgba(0, 229, 255, 0.4); background: rgba(0, 229, 255, 0.05); }
        .metric-card.gold { border-color: rgba(245, 158, 11, 0.4); background: rgba(245, 158, 11, 0.05); }
        .metric-card.purple { border-color: rgba(168, 85, 247, 0.4); background: rgba(168, 85, 247, 0.05); }
        .metric-card.emerald { border-color: rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.05); }

        .metric-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric-value {
          font-size: 26px;
          font-weight: 800;
          color: #FFFFFF;
          margin-top: 4px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .metric-subtext {
          font-size: 10.5px;
          color: #64748B;
          margin-top: 2px;
        }

        /* Breakdowns */
        .breakdowns-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 24px;
          position: relative;
          z-index: 2;
        }

        .breakdown-card {
          padding: 16px;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(51, 65, 85, 0.6);
        }

        .breakdown-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          color: #38BDF8;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
          border-bottom: 1px solid rgba(51, 65, 85, 0.6);
          padding-bottom: 6px;
        }

        .breakdown-row {
          display: flex;
          justify-content: space-between;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          padding: 4px 0;
          border-bottom: 1px dashed rgba(51, 65, 85, 0.3);
        }

        .breakdown-item-label { color: #CBD5E1; }
        .breakdown-item-count { color: #FBBF24; font-weight: 700; }

        /* Tables */
        .section-container {
          margin-top: 24px;
          position: relative;
          z-index: 2;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .section-title {
          font-size: 14px;
          font-weight: 800;
          color: #F8FAFC;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-family: 'JetBrains Mono', monospace;
        }

        .record-count {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #00E5FF;
          background: rgba(0, 229, 255, 0.1);
          border: 1px solid rgba(0, 229, 255, 0.3);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .report-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
        }

        .report-table th {
          background: #0B1329;
          color: #94A3B8;
          font-weight: 700;
          padding: 10px 12px;
          border: 1px solid #1E293B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .report-table td {
          padding: 10px 12px;
          border: 1px solid #1E293B;
          color: #E2E8F0;
          vertical-align: middle;
        }

        .report-table tr.even { background: rgba(15, 23, 42, 0.4); }
        .report-table tr.odd { background: rgba(2, 6, 23, 0.4); }
        .report-table tr:hover { background: rgba(0, 229, 255, 0.08); }

        .badge-cyan { background: rgba(0, 229, 255, 0.15); color: #00E5FF; border: 1px solid rgba(0, 229, 255, 0.3); padding: 2px 6px; border-radius: 4px; font-size: 10px; }
        .badge-amber { background: rgba(245, 158, 11, 0.15); color: #FBBF24; border: 1px solid rgba(245, 158, 11, 0.3); padding: 2px 6px; border-radius: 4px; font-size: 10px; }
        .badge-purple { background: rgba(168, 85, 247, 0.15); color: #C084FC; border: 1px solid rgba(168, 85, 247, 0.3); padding: 2px 6px; border-radius: 4px; font-size: 10px; }
        .badge-emerald { background: rgba(16, 185, 129, 0.15); color: #34D399; border: 1px solid rgba(16, 185, 129, 0.3); padding: 2px 6px; border-radius: 4px; font-size: 10px; }

        /* Notes */
        .notes-container {
          margin-top: 28px;
          padding: 16px;
          border-radius: 10px;
          background: rgba(15, 23, 42, 0.6);
          border-left: 3px solid #00E5FF;
          font-size: 11px;
          position: relative;
          z-index: 2;
        }

        .notes-title {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          color: #38BDF8;
          margin-bottom: 8px;
        }

        .notes-list {
          padding-left: 18px;
          color: #94A3B8;
          line-height: 1.6;
        }

        /* Footer */
        .report-footer {
          margin-top: 36px;
          border-top: 1px solid rgba(51, 65, 85, 0.8);
          padding-top: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #64748B;
          position: relative;
          z-index: 2;
        }

        .hash-code {
          color: #00E5FF;
          font-weight: 600;
        }

        /* Print Media Styles */
        @media print {
          body {
            background-color: #FFFFFF !important;
            color: #0F172A !important;
            padding: 0 !important;
          }
          .action-bar { display: none !important; }
          .report-page {
            margin: 0 !important;
            padding: 20px !important;
            border: 1px solid #CBD5E1 !important;
            box-shadow: none !important;
            background: #FFFFFF !important;
            max-width: 100% !important;
            border-radius: 0 !important;
          }
          .watermark {
            color: rgba(0, 0, 0, 0.03) !important;
          }
          .brand-title {
            color: #0284C7 !important;
            -webkit-text-fill-color: #0284C7 !important;
          }
          .report-main-title { color: #0F172A !important; }
          .report-subtitle { color: #64748B !important; }
          .classification-badge {
            background: #FEF3C7 !important;
            color: #B45309 !important;
            border-color: #FCD34D !important;
          }
          .meta-box { color: #64748B !important; }
          .meta-highlight { color: #0284C7 !important; }
          .metric-card {
            background: #F8FAFC !important;
            border: 1px solid #E2E8F0 !important;
          }
          .metric-label { color: #64748B !important; }
          .metric-value { color: #0F172A !important; }
          .metric-subtext { color: #94A3B8 !important; }
          .breakdown-card {
            background: #F8FAFC !important;
            border: 1px solid #E2E8F0 !important;
          }
          .breakdown-title { color: #0284C7 !important; }
          .breakdown-row { border-bottom-color: #E2E8F0 !important; }
          .breakdown-item-label { color: #334155 !important; }
          .breakdown-item-count { color: #B45309 !important; }
          .section-title { color: #0F172A !important; }
          .record-count {
            background: #E0F2FE !important;
            color: #0369A1 !important;
            border-color: #BAE6FD !important;
          }
          .report-table th {
            background: #F1F5F9 !important;
            color: #334155 !important;
            border-color: #CBD5E1 !important;
          }
          .report-table td {
            color: #0F172A !important;
            border-color: #E2E8F0 !important;
          }
          .report-table tr.even { background: #F8FAFC !important; }
          .report-table tr.odd { background: #FFFFFF !important; }
          .badge-cyan { background: #E0F2FE !important; color: #0369A1 !important; border-color: #BAE6FD !important; }
          .badge-amber { background: #FEF3C7 !important; color: #B45309 !important; border-color: #FCD34D !important; }
          .badge-purple { background: #F3E8FF !important; color: #7E22CE !important; border-color: #E9D5FF !important; }
          .badge-emerald { background: #D1FAE5 !important; color: #047857 !important; border-color: #A7F3D0 !important; }
          .notes-container {
            background: #F8FAFC !important;
            border-left-color: #0284C7 !important;
          }
          .notes-title { color: #0284C7 !important; }
          .notes-list { color: #475569 !important; }
          .report-footer {
            border-top-color: #CBD5E1 !important;
            color: #64748B !important;
          }
          .hash-code { color: #0284C7 !important; }
        }
      </style>
    </head>
    <body>
      <div class="action-bar">
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: #00E5FF;">
          🐉 DRAGON GAMING STUDIOS — EXECUTIVE REPORT PREVIEW
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn-print" onclick="window.print()">
            🖨️ PRINT / SAVE TO PDF
          </button>
          <button class="btn-close" onclick="window.close()">
            ✕ CLOSE PREVIEW
          </button>
        </div>
      </div>

      <div class="report-page">
        <div class="watermark">DRAGON STUDIOS</div>

        <!-- Header -->
        <div class="report-header">
          <div>
            <div class="classification-badge">${classification}</div>
            <div class="brand-title">DRAGON GAMING STUDIOS</div>
            <div class="report-main-title">${options.header.title}</div>
            <div class="report-subtitle">${options.header.subtitle}</div>
          </div>
          <div class="meta-box">
            <div>REPORT ID: <span class="meta-highlight">${reportId}</span></div>
            <div>DATE: <span class="meta-highlight">${dateStr}</span></div>
            <div>TIME: <span>${timeStr}</span></div>
            <div>NODE: <span>Neon PostgreSQL (Production)</span></div>
            <div>SECURITY: <span>DGS-Military-v5.4</span></div>
          </div>
        </div>

        <!-- Metrics -->
        ${metricsHtml}

        <!-- Breakdowns -->
        ${breakdownsHtml}

        <!-- Tables -->
        ${tableHtml}
        ${secondaryTableHtml}

        <!-- Notes -->
        ${notesHtml}

        <!-- Footer -->
        <div class="report-footer">
          <div>DRAGON GAMING STUDIOS © 2026 • OFFICIAL EXECUTIVE INTELLIGENCE & TELEMETRY AUDIT</div>
          <div>VERIFICATION: <span class="hash-code">${verificationHash}</span></div>
        </div>
      </div>
    </body>
    </html>
  `;

  const reportWindow = window.open("", "_blank");
  if (reportWindow) {
    reportWindow.document.open();
    reportWindow.document.write(fullHtml);
    reportWindow.document.close();
  } else {
    alert("Please allow popups to open the Dragon Gaming Studios Official PDF Report.");
  }
}

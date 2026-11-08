import { useState } from "react";
import FileText from "icon:file-text";
import Download from "icon:download";
import ArrowLeft from "icon:arrow-left";
import { Badge } from "../components/ui/Badge.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { demoReports } from "../lib/demoData.js";

const typeVariant = {
  "Market Intelligence": "signal",
  "Consumer Intelligence": "pulse",
  "Discoverability Intelligence": "glow",
};

const sectionIcons = {
  Signals: "⚡",
  Trends: "📈",
  Audience: "👥",
  Opportunity: "🎯",
  Competition: "🔬",
  Content: "✍️",
};

function ReportDetail({ report, onBack }) {
  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Reports
      </button>

      {/* Print-ready wrapper */}
      <div className="print:bg-white print:text-black">
        <Card className="p-8 space-y-8 print:shadow-none print:border-0">
          {/* Report Header */}
          <div className="border-b border-border pb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-display text-xs font-bold tracking-widest text-signal uppercase">
                    GLORYUS INTELLIGENCE
                  </span>
                  <Badge variant={typeVariant[report.type] || "default"} size="xs">
                    {report.type}
                  </Badge>
                </div>
                <h1 className="font-display text-2xl font-bold text-primary leading-snug">
                  {report.title}
                </h1>
                <p className="text-sm text-muted mt-1">
                  Published {new Date(report.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 print:hidden"
                onClick={() => window.print()}
              >
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Sections covered */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(sectionIcons).map(([section, icon]) => (
              <span key={section} className="flex items-center gap-1 text-xs bg-surface border border-border rounded-full px-2.5 py-1 text-secondary">
                {icon} {section}
              </span>
            ))}
          </div>

          {/* Executive Summary */}
          <Section title="Executive Summary" accent="signal">
            <p className="text-sm text-secondary leading-relaxed">{report.executiveSummary}</p>
          </Section>

          {/* Signals */}
          {report.signals?.length > 0 && (
            <Section title="⚡ Signals" accent="signal">
              <ul className="space-y-2">
                {report.signals.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-secondary">
                    <span className="text-signal mt-0.5 shrink-0">•</span>{s}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Trend Analysis */}
          {report.trendAnalysis && (
            <Section title="📈 Trend Analysis" accent="glow">
              <p className="text-sm text-secondary leading-relaxed">{report.trendAnalysis}</p>
            </Section>
          )}

          {/* Audience */}
          {report.audience && (
            <Section title="👥 Audience" accent="pulse">
              <p className="text-sm text-secondary leading-relaxed">{report.audience}</p>
            </Section>
          )}

          {/* Opportunity */}
          {report.opportunity && (
            <Section title="🎯 Opportunity" accent="signal">
              <div className="bg-signal/5 border border-signal/20 rounded-lg px-4 py-3">
                <p className="text-sm text-primary leading-relaxed">{report.opportunity}</p>
              </div>
            </Section>
          )}

          {/* Competition */}
          {report.competition && (
            <Section title="🔬 Competition" accent="amber">
              <p className="text-sm text-secondary leading-relaxed">{report.competition}</p>
            </Section>
          )}

          {/* Content Opportunities */}
          {report.contentOpportunities?.length > 0 && (
            <Section title="✍️ Content Opportunities" accent="glow">
              <ul className="space-y-2">
                {report.contentOpportunities.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-secondary">
                    <span className="text-glow mt-0.5 shrink-0">→</span>{c}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Recommended Research */}
          {report.recommendedResearch?.length > 0 && (
            <Section title="Recommended Research" accent="pulse">
              <ul className="space-y-2">
                {report.recommendedResearch.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-secondary">
                    <span className="text-pulse mt-0.5 shrink-0">◈</span>{r}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Sources */}
          {report.sources?.length > 0 && (
            <Section title="Sources" accent="default">
              <div className="flex flex-wrap gap-2">
                {report.sources.map((s, i) => (
                  <span key={i} className="text-xs bg-border text-secondary px-2.5 py-1 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </Card>
      </div>
    </div>
  );
}

function Section({ title, children, accent }) {
  const accentMap = {
    signal: "border-signal/30",
    pulse: "border-pulse/30",
    glow: "border-glow/30",
    amber: "border-amber/30",
    default: "border-border",
  };
  return (
    <div className={`border-l-2 ${accentMap[accent] || accentMap.default} pl-4`}>
      <h2 className="font-display font-semibold text-primary mb-2">{title}</h2>
      {children}
    </div>
  );
}

export default function Reports() {
  const [openReport, setOpenReport] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (openReport) {
    return (
      <div className="min-h-screen bg-void text-primary font-body px-4 py-8 max-w-4xl mx-auto">
        <ReportDetail report={openReport} onBack={() => setOpenReport(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void text-primary font-body px-4 py-8 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Intelligence Reports</h1>
          <p className="text-secondary mt-1">Professional analysis ready to share</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateForm(!showCreateForm)}>
          <FileText className="w-4 h-4" />
          Generate New Report
        </Button>
      </div>

      {/* Create Report Form */}
      {showCreateForm && (
        <Card className="p-6">
          <h2 className="font-display text-lg font-semibold mb-4">New Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-muted uppercase tracking-wide mb-1.5 block">Report Type</label>
              <select className="w-full bg-surface border border-border text-primary text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-signal/50">
                {["Trend", "Audience", "Competitive", "Opportunity", "Full Intelligence"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted uppercase tracking-wide mb-1.5 block">Focus Area</label>
              <input
                placeholder="e.g. Adaptogenic Beverages"
                className="w-full bg-surface border border-border text-primary text-sm rounded-lg px-4 py-2.5 placeholder:text-muted focus:outline-none focus:border-signal/50"
              />
            </div>
          </div>
          <Button variant="primary" onClick={() => { setShowCreateForm(false); setOpenReport(demoReports[0]); }}>
            Generate Report
          </Button>
        </Card>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        {demoReports.map((report) => (
          <Card key={report.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant={typeVariant[report.type] || "default"} size="sm">
                    {report.type}
                  </Badge>
                  <span className="text-xs text-muted">
                    {new Date(report.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </div>

                <h2 className="font-display font-bold text-primary text-lg leading-snug mb-2">
                  {report.title}
                </h2>

                <p className="text-sm text-secondary line-clamp-2 mb-3">
                  {report.executiveSummary}
                </p>

                {/* Sections covered */}
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(sectionIcons).map(([section, icon]) => (
                    <span key={section} className="text-xs text-muted bg-surface border border-border rounded px-1.5 py-0.5">
                      {icon} {section}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <Button variant="primary" size="sm" onClick={() => setOpenReport(report)}>
                  View Report
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Download className="w-3.5 h-3.5" />
                  Export
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Badge } from "../components/ui/Badge.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { RadarChart } from "../components/ui/MiniChart.jsx";
import { demoDiscoverabilityData } from "../lib/demoData.js";
import Search from "icon:search";
import Zap from "icon:zap";
import CheckCircle from "icon:check-circle";
import AlertTriangle from "icon:alert-triangle";
import Loader from "icon:loader";

const d = demoDiscoverabilityData;

const DIMENSIONS = [
  { key: "brandClarity", label: "Brand Clarity", score: d.brandClarity, desc: "How clearly your brand identity is understood by AI models" },
  { key: "topicRelevance", label: "Topic Relevance", score: d.topicRelevance, desc: "Alignment of your content with your core topic clusters" },
  { key: "contentDepth", label: "Content Depth", score: d.contentDepth, desc: "Average depth and word count of your published content" },
  { key: "questionCoverage", label: "Question Coverage", score: d.questionCoverage, desc: "How many audience questions your content explicitly answers" },
  { key: "semanticRelevance", label: "Semantic Relevance", score: d.semanticRelevance, desc: "Consistency of entity language across all your content" },
  { key: "aiReadability", label: "AI Readability", score: d.aiReadability, desc: "Structured markup and formatting for AI crawlers" },
  { key: "entityConsistency", label: "Entity Consistency", score: d.entityConsistency, desc: "Consistent mention of brand, product, and ingredient names" },
  { key: "socialSearchReadiness", label: "Social Search", score: d.socialSearchReadiness, desc: "Optimization of social captions for TikTok and AI search indexing" },
];

const RADAR_LABELS = DIMENSIONS.map((d) => d.label.split(" ")[0]);
const RADAR_SCORES = DIMENSIONS.map((d) => d.score);

function scoreColor(s) {
  if (s >= 70) return { text: "text-glow", bg: "bg-glow", bar: "bg-glow" };
  if (s >= 50) return { text: "text-amber", bg: "bg-amber", bar: "bg-amber" };
  return { text: "text-hot", bg: "bg-hot", bar: "bg-hot" };
}

const PRIORITY_VARIANT = { high: "hot", medium: "amber", low: "glow" };

function ArcRing({ score }) {
  const r = 80;
  const c = 2 * Math.PI * r;
  const fill = (score / 100) * c * 0.75; // 270 degree arc
  return (
    <svg width="200" height="160" viewBox="0 0 200 160">
      <circle cx="100" cy="120" r={r} fill="none" stroke="#1E293B" strokeWidth="12"
        strokeDasharray={`${c * 0.75} ${c * 0.25}`}
        strokeDashoffset={c * 0.125}
        strokeLinecap="round"
      />
      <circle cx="100" cy="120" r={r} fill="none" stroke="#00D4FF" strokeWidth="12"
        strokeDasharray={`${fill} ${c}`}
        strokeDashoffset={c * 0.125}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
      <text x="100" y="108" textAnchor="middle" fill="#00D4FF" fontSize="40" fontFamily="Syne" fontWeight="700">{score}</text>
      <text x="100" y="130" textAnchor="middle" fill="#64748B" fontSize="12" fontFamily="DM Sans">out of 100</text>
    </svg>
  );
}

export default function AiDiscoverability() {
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  function handleAnalyze(e) {
    e.preventDefault();
    if (!url.trim()) return;
    setAnalyzing(true);
    setTimeout(() => { setAnalyzing(false); setAnalyzed(true); }, 2200);
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">AI/Social Discoverability</h1>
        <p className="text-secondary font-body mt-1">How visible is your brand to AI and search?</p>
      </div>

      {/* Demo Analysis CTA */}
      <Card className="p-5 border-signal/20">
        <div className="flex items-center gap-2 mb-3">
          <Search size={16} className="text-signal" />
          <h2 className="font-display text-base font-bold text-primary">Demo Analysis</h2>
          <Badge variant="amber" size="xs">Demo Mode</Badge>
        </div>
        <p className="text-xs text-muted font-body mb-4">Enter your brand or website URL to run a discoverability analysis. This demo reveals the sample scores below.</p>
        <form onSubmit={handleAnalyze} className="flex gap-2 flex-wrap">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourbrand.com or @handle"
            className="flex-1 min-w-[200px] px-4 py-2 bg-panel border border-border rounded-lg text-sm font-body text-primary placeholder:text-muted focus:outline-hidden focus:border-signal/50 transition-colors"
          />
          <Button variant="primary" size="md" type="submit" disabled={analyzing}>
            {analyzing ? <Loader size={14} className="animate-spin" /> : <Zap size={14} />}
            {analyzing ? "Analyzing…" : "Run Analysis"}
          </Button>
        </form>
        {analyzed && (
          <div className="mt-3 flex items-center gap-2 text-xs text-glow font-body">
            <CheckCircle size={13} />
            Analysis complete — showing demo results for <span className="font-mono">{url}</span>
          </div>
        )}
      </Card>

      {/* Overall Score Hero */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <ArcRing score={d.overallScore} />
            <div className="text-center space-y-1">
              <Badge variant="amber" size="md">Needs Improvement</Badge>
              <p className="text-xs text-muted font-body">Industry avg: <span className="text-secondary">71/100</span></p>
              <p className="text-xs text-muted font-body">You are <span className="text-hot font-semibold">14 points</span> below average</p>
            </div>
          </div>

          {/* Radar */}
          <div className="flex flex-col items-center gap-2">
            <RadarChart scores={RADAR_SCORES} labels={RADAR_LABELS} size={240} />
            <p className="text-xs text-muted font-body text-center">8-dimension discoverability profile</p>
          </div>

          {/* Quick summary */}
          <div className="flex-1 space-y-3">
            <h2 className="font-display text-lg font-bold text-primary">Discoverability Overview</h2>
            <div className="space-y-2">
              {DIMENSIONS.map((dim) => {
                const c = scoreColor(dim.score);
                return (
                  <div key={dim.key} className="flex items-center gap-3">
                    <span className="text-xs font-body text-secondary w-32 flex-shrink-0">{dim.label}</span>
                    <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${dim.score}%` }} />
                    </div>
                    <span className={`text-xs font-mono font-bold w-8 text-right ${c.text}`}>{dim.score}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* 8 Dimension Score Cards */}
      <div>
        <h2 className="font-display text-base font-bold text-primary mb-4">Dimension Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DIMENSIONS.map((dim) => {
            const c = scoreColor(dim.score);
            return (
              <Card key={dim.key} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs font-body text-secondary leading-snug">{dim.label}</span>
                  <span className={`font-display text-2xl font-bold ${c.text}`}>{dim.score}</span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${dim.score}%` }} />
                </div>
                <p className="text-[10px] font-body text-muted leading-snug">{dim.desc}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h2 className="font-display text-base font-bold text-primary mb-4">Action Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {d.recommendations.map((rec, i) => (
            <Card key={i} className="p-4 space-y-2 hover:shadow-glow-signal transition-all duration-300">
              <div className="flex items-center gap-2">
                <Badge variant={PRIORITY_VARIANT[rec.priority] || "default"} size="xs">{rec.priority} priority</Badge>
                <span className="text-xs font-body text-muted">{rec.area}</span>
              </div>
              <p className="text-sm font-body text-secondary leading-relaxed">{rec.action}</p>
              <div className="flex items-center gap-1.5 text-xs font-mono text-glow">
                <Zap size={11} />
                {rec.impact}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Strengths & Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={16} className="text-glow" />
            <h3 className="font-display text-sm font-bold text-glow">Strengths</h3>
          </div>
          <ul className="space-y-2">
            {d.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs font-body text-secondary">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-glow flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-hot" />
            <h3 className="font-display text-sm font-bold text-hot">Gaps</h3>
          </div>
          <ul className="space-y-2">
            {d.gaps.map((g, i) => (
              <li key={i} className="flex items-start gap-2 text-xs font-body text-secondary">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-hot flex-shrink-0" />
                {g}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

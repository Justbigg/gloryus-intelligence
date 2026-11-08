import { useState } from "react";
import { Link } from "react-router";
import { Badge } from "../components/ui/Badge.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { RadarChart, SparkLine } from "../components/ui/MiniChart.jsx";
import {
  demoTrends,
  demoSocialSignals,
  demoOpportunities,
  demoAudiences,
  demoCompetitors,
  demoContentIdeas,
  demoDiscoverabilityData,
} from "../lib/demoData.js";
import TrendingUp from "icon:trending-up";
import Zap from "icon:zap";
import Users from "icon:users";
import Target from "icon:target";
import FileText from "icon:file-text";
import BarChart2 from "icon:bar-chart-2";
import Search from "icon:search";
import RefreshCw from "icon:refresh-cw";
import Sparkles from "icon:sparkles";
import MessageSquare from "icon:message-square";
import ArrowRight from "icon:arrow-right";
import Globe from "icon:globe";
import ChevronRight from "icon:chevron-right";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function trendBadge(status) {
  const map = { emerging: "emerging", accelerating: "accelerating", mainstream: "mainstream", saturated: "saturated", declining: "declining" };
  return map[status] || "default";
}

function platformColor(platform) {
  const map = {
    TikTok: "hot",
    Instagram: "pulse",
    YouTube: "amber",
    Reddit: "glow",
    Twitter: "signal",
    Pinterest: "hot",
  };
  return map[platform] || "default";
}

function sentimentDot(sentiment) {
  if (sentiment === "positive") return "bg-glow";
  if (sentiment === "negative") return "bg-hot";
  return "bg-amber";
}

// ─── SVG Ring ────────────────────────────────────────────────────────────────
function RingScore({ score, size = 120, color = "#00D4FF" }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  return (
    <svg width={size} height={size} className="block" aria-label={`Score: ${score}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1E293B" strokeWidth="8" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth="8"
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="#F8FAFC" fontSize="22" fontFamily="JetBrains Mono" fontWeight="700">
        {score}
      </text>
    </svg>
  );
}

// ─── Radar data for trends ────────────────────────────────────────────────────
const radarLabels = ["Velocity", "Momentum", "Interest", "Content", "Social", "Search", "Region", "Sentiment"];
const radarScores = [87, 82, 79, 44, 91, 76, 68, 72];

// ─── Period filters ──────────────────────────────────────────────────────────
const periods = ["Today", "Week", "Month", "Quarter"];

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [period, setPeriod] = useState("Week");
  const [search, setSearch] = useState("");

  const discov = demoDiscoverabilityData;
  const subScores = [
    { label: "Brand Clarity", value: discov.brandClarity, color: "#00D4FF" },
    { label: "Topic Relevance", value: discov.topicRelevance, color: "#7C3AED" },
    { label: "Content Depth", value: discov.contentDepth, color: "#10B981" },
    { label: "Question Coverage", value: discov.questionCoverage, color: "#F59E0B" },
  ];

  return (
    <div className="min-h-screen bg-void text-primary font-body">
      {/* ── TOP BAR ── */}
      <div className="sticky top-0 z-10 bg-void/95 backdrop-blur border-b border-border px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-xl text-primary">Intelligence Command Center</h1>
            <p className="text-secondary text-xs mt-0.5">Real-time signals across your market landscape</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Period filters */}
            <div className="flex gap-1 bg-panel rounded-lg p-1 border border-border">
              {periods.map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-md text-xs font-body transition-all ${
                    period === p ? "bg-signal text-void font-semibold" : "text-secondary hover:text-primary"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search signals…"
                className="bg-panel border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-primary placeholder:text-muted focus:outline-none focus:border-signal transition-colors w-44"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── WIDGET GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {/* ── 1. TREND RADAR MINI ── */}
        <Card className="p-5 col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-signal" />
              <span className="font-display text-sm text-primary">Trend Overview</span>
            </div>
            <Badge variant="signal" size="xs">Live</Badge>
          </div>
          <div className="flex justify-center mb-4">
            <RadarChart scores={radarScores} labels={radarLabels} size={180} />
          </div>
          <div className="space-y-2">
            <p className="font-mono text-[10px] text-muted tracking-wider mb-2">TOP EMERGING TRENDS</p>
            {demoTrends.filter(t => t.status === "accelerating" || t.status === "emerging").slice(0, 3).map((t) => (
              <div key={t.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-surface/50 hover:bg-surface transition-colors">
                <span className="text-xs text-secondary truncate flex-1 mr-2">{t.name}</span>
                <Badge variant={trendBadge(t.status)} size="xs">{t.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* ── 2. SOCIAL SIGNALS ── */}
        <Card className="p-5 col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-pulse" />
              <span className="font-display text-sm text-primary">Social Signals</span>
            </div>
            <span className="font-mono text-[10px] text-muted">{period}</span>
          </div>
          <div className="space-y-3">
            {demoSocialSignals.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-start gap-3">
                <Badge variant={platformColor(s.platform)} size="xs" className="mt-0.5 shrink-0">{s.platform}</Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-primary truncate mb-1">{s.keyword}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-signal transition-all duration-700"
                        style={{ width: `${s.engagementScore}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-muted shrink-0">{s.engagementScore}</span>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${sentimentDot(s.sentiment)}`} title={s.sentiment} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ── 3. AI DISCOVERABILITY SCORE ── */}
        <Card className="p-5 col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-glow" />
              <span className="font-display text-sm text-primary">AI Discoverability</span>
            </div>
            <Badge variant="amber" size="xs">Needs Work</Badge>
          </div>
          <div className="flex justify-center mb-4">
            <RingScore score={discov.overallScore} size={120} color="#00D4FF" />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {subScores.map((sc) => (
              <div key={sc.label} className="bg-surface rounded-lg p-2.5">
                <p className="font-mono text-[10px] text-muted mb-1">{sc.label.toUpperCase()}</p>
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-base" style={{ color: sc.color }}>{sc.value}</span>
                  <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${sc.value}%`, backgroundColor: sc.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full justify-center">
            Improve Score <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </Card>

        {/* ── 4. PRODUCT OPPORTUNITIES ── */}
        <Card className="p-5 col-span-1 md:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-amber" />
              <span className="font-display text-sm text-primary">Product Opportunities</span>
            </div>
            <Badge variant="glow" size="xs">{demoOpportunities.length} Found</Badge>
          </div>
          <div className="space-y-3">
            {demoOpportunities.slice(0, 4).map((o) => (
              <div key={o.id} className="p-3 rounded-lg bg-surface border border-border hover:border-signal/30 transition-all group cursor-pointer">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-xs text-primary font-body leading-tight flex-1">{o.title}</p>
                  <Badge variant={o.confidence >= 80 ? "glow" : o.confidence >= 65 ? "signal" : "amber"} size="xs">
                    {o.confidence}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={o.competition === "low" ? "glow" : o.competition === "medium" ? "amber" : "hot"} size="xs">
                    {o.competition} competition
                  </Badge>
                  <button className="text-signal text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                    View <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ── 5. AUDIENCE SIGNALS ── */}
        <Card className="p-5 col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-signal" />
              <span className="font-display text-sm text-primary">Audience Signals</span>
            </div>
          </div>
          <div className="space-y-4">
            {demoAudiences.slice(0, 3).map((a) => (
              <div key={a.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm text-primary font-body">{a.name}</p>
                  <span className="font-mono text-[10px] text-muted">{a.ageRange}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {a.platforms.slice(0, 3).map((p) => (
                    <Badge key={p} variant={platformColor(p)} size="xs">{p}</Badge>
                  ))}
                </div>
                <p className="text-xs text-muted leading-relaxed line-clamp-2">{a.coreDesire || a.values?.[0] || "High-value consumer profile"}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* ── 6. COMPETITOR ACTIVITY ── */}
        <Card className="p-5 col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-hot" />
              <span className="font-display text-sm text-primary">Competitor Activity</span>
            </div>
          </div>
          <div className="space-y-4">
            {demoCompetitors.slice(0, 3).map((c) => (
              <div key={c.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm text-primary font-body">{c.name}</p>
                  <Badge variant="default" size="xs">{c.industry}</Badge>
                </div>
                {c.positioningStrengths && (
                  <p className="text-xs text-muted mb-1.5 leading-snug">{c.positioningStrengths[0]}</p>
                )}
                {c.contentThemes && (
                  <div className="flex flex-wrap gap-1">
                    {c.contentThemes.slice(0, 2).map((theme) => (
                      <span key={theme} className="font-mono text-[9px] text-muted bg-surface px-1.5 py-0.5 rounded">{theme}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* ── 7. CONTENT IDEAS ── */}
        <Card className="p-5 col-span-1 md:col-span-2 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-pulse" />
              <span className="font-display text-sm text-primary">Content Ideas</span>
            </div>
            <Badge variant="pulse" size="xs">AI Generated</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {demoContentIdeas.slice(0, 4).map((idea) => (
              <div key={idea.id} className="p-3 rounded-lg bg-surface border border-border hover:border-pulse/30 transition-all group cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={platformColor(idea.platform)} size="xs">{idea.platform}</Badge>
                  <span className="font-mono text-[9px] text-muted">{idea.format}</span>
                </div>
                <p className="text-xs text-primary leading-snug mb-2">{idea.title}</p>
                {idea.estimatedReach && (
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3 text-glow" />
                    <span className="font-mono text-[10px] text-glow">{idea.estimatedReach}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* ── 8. QUICK ACTIONS ── */}
        <Card className="p-5 col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-signal" />
            <span className="font-display text-sm text-primary">Quick Actions</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: RefreshCw, label: "Run Analysis", to: "/trends", color: "text-signal", bg: "bg-signal/10 hover:bg-signal/20 border-signal/20" },
              { icon: FileText, label: "Generate Report", to: "/reports", color: "text-pulse", bg: "bg-pulse/10 hover:bg-pulse/20 border-pulse/20" },
              { icon: TrendingUp, label: "View Trends", to: "/trends", color: "text-glow", bg: "bg-glow/10 hover:bg-glow/20 border-glow/20" },
              { icon: Sparkles, label: "Ask AI Assistant", to: "/assistant", color: "text-amber", bg: "bg-amber/10 hover:bg-amber/20 border-amber/20" },
            ].map(({ icon: Icon, label, to, color, bg }) => (
              <Link
                key={label}
                to={to}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${bg}`}
              >
                <Icon className={`w-5 h-5 ${color}`} />
                <span className={`text-xs font-body text-center leading-tight ${color}`}>{label}</span>
              </Link>
            ))}
          </div>

          {/* Sparkline mini chart */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="font-mono text-[10px] text-muted mb-2">SIGNAL ACTIVITY (7D)</p>
            <SparkLine data={[42, 58, 61, 54, 79, 83, 91]} color="#00D4FF" width={240} height={40} />
          </div>
        </Card>

      </div>
    </div>
  );
}

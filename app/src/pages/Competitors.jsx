import { useState } from "react";
import Search from "icon:search";
import Calendar from "icon:calendar";
import TrendingUp from "icon:trending-up";
import Plus from "icon:plus";
import BarChart2 from "icon:bar-chart-2";
import { Badge } from "../components/ui/Badge.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { demoCompetitors } from "../lib/demoData.js";

const strengthVariant = { strong: "glow", moderate: "amber", weak: "hot" };

const gapOpportunities = [
  {
    gap: "Clinical Transparency in Supplements",
    description:
      "No competitor leads with third-party Certificate of Analysis (COA) as a primary brand message. Significant trust gap for skeptical consumers.",
    potential: "High",
  },
  {
    gap: "Protocol Education Content",
    description:
      "Competitors publish product content but avoid detailed protocol-building education. First mover in 'how to build your stack' content can own the category.",
    potential: "High",
  },
  {
    gap: "Gen Z Functional Beverages",
    description:
      "Existing players skew Millennial in messaging. Gen Z sustainable-wellness crossover positioning is largely unclaimed.",
    potential: "Medium",
  },
];

// Competitor plot coordinates for SVG (visibility, innovation)
const plotData = [
  { id: "c1", name: "Four Sigmatic", x: 310, y: 80, strength: "strong" },
  { id: "c2", name: "Beam Organics", x: 270, y: 120, strength: "strong" },
  { id: "c3", name: "Vivobarefoot", x: 180, y: 160, strength: "moderate" },
  { id: "c4", name: "The RealReal", x: 340, y: 200, strength: "strong" },
  { id: "c5", name: "Levels Health", x: 200, y: 60, strength: "strong" },
  { id: "c6", name: "Patagonia", x: 360, y: 140, strength: "strong" },
  { id: "c7", name: "Lomi", x: 140, y: 220, strength: "moderate" },
  { id: "c8", name: "Thrive Market", x: 320, y: 250, strength: "strong" },
];

const dotColor = { strong: "#10B981", moderate: "#F59E0B", weak: "#EF4444" };

export default function Competitors() {
  const [search, setSearch] = useState("");

  const filtered = demoCompetitors.filter(
    (c) =>
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-void text-primary font-body px-4 py-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-bold text-primary">
          Competitor Intelligence
        </h1>
        <p className="text-secondary">
          Tracking competitor positioning and signals
        </p>
      </div>

      {/* Tracking Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search competitors…"
            className="w-full pl-9 pr-4 py-2 text-sm bg-panel border border-border rounded-lg text-primary placeholder:text-muted focus:outline-none focus:border-signal/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled className="opacity-50 cursor-not-allowed">
            <Plus className="w-4 h-4" />
            Add Competitor
          </Button>
          <Badge variant="amber" size="xs">Coming Soon</Badge>
        </div>
      </div>

      {/* Competitor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((c) => (
          <Card key={c.id} className="p-5 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold text-primary leading-tight">
                  {c.name}
                </h2>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <Badge variant="default">{c.industry}</Badge>
                  <Badge variant={strengthVariant[c.strength] || "default"}>
                    {c.strength.charAt(0).toUpperCase() + c.strength.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Positioning */}
            <p className="text-sm text-secondary italic">"{c.positioning}"</p>

            {/* Content Themes */}
            <div>
              <p className="text-xs text-muted uppercase tracking-wide mb-1.5">Content Themes</p>
              <div className="flex flex-wrap gap-1">
                {c.contentThemes.map((t, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-border text-secondary">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Campaign Themes */}
            <div>
              <p className="text-xs text-muted uppercase tracking-wide mb-1.5">Campaign Themes</p>
              <div className="flex flex-wrap gap-1">
                {c.campaignThemes.map((t, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-signal/10 text-signal">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Posting Pattern */}
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-muted mt-0.5 shrink-0" />
              <p className="text-xs text-secondary">{c.postingPattern}</p>
            </div>

            {/* Recent Launches */}
            <div>
              <p className="text-xs text-muted uppercase tracking-wide mb-1.5">Recent Launches</p>
              <ul className="space-y-1">
                {c.recentLaunches.map((l, i) => (
                  <li key={i} className="text-xs text-secondary flex items-start gap-1.5">
                    <span className="text-glow mt-0.5">•</span>
                    {l}
                  </li>
                ))}
              </ul>
            </div>

            {/* Messaging Changes */}
            <div className="rounded-lg bg-pulse/10 border border-pulse/20 px-3 py-2">
              <p className="text-xs text-purple-300">{c.messagingChanges}</p>
            </div>

            {/* Action */}
            <Button variant="outline" size="sm" className="self-start mt-auto">
              <BarChart2 className="w-3.5 h-3.5" />
              Deep Analysis
            </Button>
          </Card>
        ))}
      </div>

      {/* Competitive Landscape Map */}
      <Card className="p-6">
        <h2 className="font-display text-xl font-semibold mb-1">
          Competitive Landscape Map
        </h2>
        <p className="text-sm text-secondary mb-4">
          Positioning by Visibility vs. Innovation — dot size reflects positioning strength
        </p>
        <div className="overflow-x-auto">
          <svg
            viewBox="0 0 440 310"
            width="440"
            height="310"
            className="max-w-full"
            style={{ background: "transparent" }}
          >
            {/* Axes */}
            <line x1="40" y1="270" x2="420" y2="270" stroke="#334155" strokeWidth="1" />
            <line x1="40" y1="270" x2="40" y2="20" stroke="#334155" strokeWidth="1" />
            {/* Axis labels */}
            <text x="230" y="298" textAnchor="middle" fontSize="11" fill="#64748B" fontFamily="DM Sans, sans-serif">
              Visibility →
            </text>
            <text x="16" y="150" textAnchor="middle" fontSize="11" fill="#64748B" fontFamily="DM Sans, sans-serif"
              transform="rotate(-90 16 150)">
              Innovation →
            </text>
            {/* Grid */}
            {[80, 140, 200, 260].map((y) => (
              <line key={y} x1="40" y1={y} x2="420" y2={y} stroke="#1E293B" strokeWidth="0.5" strokeDasharray="4 4" />
            ))}
            {[120, 200, 280, 360].map((x) => (
              <line key={x} x1={x} y1="20" x2={x} y2="270" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="4 4" />
            ))}
            {/* Dots */}
            {plotData.map((d) => (
              <g key={d.id}>
                <circle
                  cx={d.x}
                  cy={d.y}
                  r={d.strength === "strong" ? 9 : d.strength === "moderate" ? 7 : 5}
                  fill={dotColor[d.strength]}
                  fillOpacity={0.7}
                  stroke={dotColor[d.strength]}
                  strokeWidth="1.5"
                />
                <text
                  x={d.x}
                  y={d.y - 13}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#94A3B8"
                  fontFamily="DM Sans, sans-serif"
                >
                  {d.name}
                </text>
              </g>
            ))}
            {/* Legend */}
            {[
              { label: "Strong", color: "#10B981", x: 320 },
              { label: "Moderate", color: "#F59E0B", x: 365 },
            ].map((l) => (
              <g key={l.label}>
                <circle cx={l.x} cy={290} r={5} fill={l.color} fillOpacity={0.7} />
                <text x={l.x + 8} y={294} fontSize="9" fill="#94A3B8" fontFamily="DM Sans, sans-serif">
                  {l.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </Card>

      {/* Gap Analysis */}
      <div>
        <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-signal" />
          Opportunity Gaps in Competitive Landscape
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gapOpportunities.map((g, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-semibold text-primary text-sm">{g.gap}</h3>
                <Badge variant={g.potential === "High" ? "glow" : "amber"} size="xs">
                  {g.potential} Potential
                </Badge>
              </div>
              <p className="text-sm text-secondary">{g.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

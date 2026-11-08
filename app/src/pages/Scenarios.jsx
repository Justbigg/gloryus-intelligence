import { useState } from "react";
import AlertTriangle from "icon:alert-triangle";
import ChevronDown from "icon:chevron-down";
import Play from "icon:play";
import { Badge } from "../components/ui/Badge.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { demoTrends } from "../lib/demoData.js";

const scenarioTypes = [
  "Trend Accelerates",
  "Competition Increases",
  "Goes Mainstream",
  "Market Contracts",
  "New Technology Disrupts",
];

const timeHorizons = ["3 months", "6 months", "1 year", "2 years"];

const dimensions = [
  "Market Opportunity",
  "Content Demand",
  "Competition",
  "Revenue Potential",
  "Risk Level",
];

// Generate scenario impact based on type
function generateImpact(type) {
  const maps = {
    "Trend Accelerates": [85, 90, 60, 80, 35],
    "Competition Increases": [65, 70, 90, 55, 70],
    "Goes Mainstream": [90, 85, 75, 85, 45],
    "Market Contracts": [30, 25, 40, 25, 85],
    "New Technology Disrupts": [75, 80, 80, 70, 65],
  };
  return maps[type] || [60, 60, 60, 60, 60];
}

function generateOutcomes(type, trend) {
  const trendName = trend;
  const outcomes = {
    "Trend Accelerates": [
      `${trendName} adoption accelerates significantly, expanding addressable market by an estimated 40–60%`,
      "Early-positioned brands capture disproportionate market share before saturation",
      "Content demand spikes — high-volume, high-quality output becomes table stakes",
    ],
    "Competition Increases": [
      "New entrants flood the space, compressing margins and increasing paid media costs",
      `Differentiation becomes critical — brands without a clear ${trendName} niche struggle`,
      "Consumer expectations rise; perceived quality bar increases across the category",
    ],
    "Goes Mainstream": [
      `${trendName} crosses into late-majority adoption — mass retail and mainstream media coverage accelerate`,
      "Premium positioning becomes harder to maintain as category commoditizes",
      "Massive audience expansion opens new customer acquisition channels",
    ],
    "Market Contracts": [
      `Consumer enthusiasm for ${trendName} wanes; early-adopter attention moves to next trend`,
      "Weaker brands exit; opportunity for well-positioned brands to consolidate share",
      "Pricing pressure intensifies; value messaging becomes critical",
    ],
    "New Technology Disrupts": [
      `New technology fundamentally changes how ${trendName} products are made or delivered`,
      "Incumbents face rapid displacement unless they adapt product and messaging",
      "First-movers on new technology earn outsized media and community attention",
    ],
  };
  return outcomes[type] || ["Market dynamics shift significantly", "Adaptation is required", "Monitor closely"];
}

function generateActions(type) {
  const actions = {
    "Trend Accelerates": [
      "Double down on content production and creator partnerships immediately",
      "Secure distribution deals before competition intensifies",
      "Build community and CRM assets to retain early-adopter loyalty",
    ],
    "Competition Increases": [
      "Sharpen differentiation — identify one attribute to own exclusively",
      "Invest in owned media to reduce reliance on paid channels",
      "Pursue exclusive ingredient or supplier relationships",
    ],
    "Goes Mainstream": [
      "Develop mass-market product tier without diluting premium line",
      "Expand retail distribution aggressively",
      "Pivot content from education to aspiration and social proof",
    ],
    "Market Contracts": [
      "Focus resources on highest-margin, most-loyal customer segments",
      "Pivot positioning toward adjacent emerging trends",
      "Reduce content volume; increase quality and conversion focus",
    ],
    "New Technology Disrupts": [
      "Audit current product and delivery model for vulnerability",
      "Pilot new technology quickly — fail fast in a controlled way",
      "Lead with transparency about technology adoption in brand communication",
    ],
  };
  return actions[type] || ["Monitor closely", "Maintain flexibility", "Consult research"];
}

const prebuilt = [
  {
    title: "Adaptogenic Beverages Goes Mainstream",
    trend: "Adaptogenic Beverages",
    type: "Goes Mainstream",
    horizon: "6 months",
    ratings: [90, 85, 75, 85, 45],
  },
  {
    title: "AI Art Aesthetics Market Contracts",
    trend: "AI Art Aesthetics",
    type: "Market Contracts",
    horizon: "1 year",
    ratings: [30, 25, 40, 25, 85],
  },
  {
    title: "Micro-Workout Culture Accelerates",
    trend: "Micro-Workout Culture",
    type: "Trend Accelerates",
    horizon: "3 months",
    ratings: [85, 90, 60, 80, 35],
  },
  {
    title: "Quiet Luxury Skincare Competition Intensifies",
    trend: "Quiet Luxury Skincare",
    type: "Competition Increases",
    horizon: "6 months",
    ratings: [65, 70, 90, 55, 70],
  },
];

function RatingBar({ label, value }) {
  const color =
    label === "Risk Level"
      ? value > 65
        ? "bg-hot"
        : value > 40
        ? "bg-amber"
        : "bg-glow"
      : value > 70
      ? "bg-glow"
      : value > 45
      ? "bg-amber"
      : "bg-hot";

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-secondary w-36 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-muted w-8 text-right">{value}</span>
    </div>
  );
}

export default function Scenarios() {
  const [selectedTrend, setSelectedTrend] = useState(demoTrends[0].name);
  const [selectedType, setSelectedType] = useState(scenarioTypes[0]);
  const [selectedHorizon, setSelectedHorizon] = useState(timeHorizons[1]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function runSimulation() {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult({
        trend: selectedTrend,
        type: selectedType,
        horizon: selectedHorizon,
        ratings: generateImpact(selectedType),
        outcomes: generateOutcomes(selectedType, selectedTrend),
        actions: generateActions(selectedType),
      });
      setLoading(false);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-void text-primary font-body px-4 py-8 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-primary">Scenario Simulator</h1>
        <p className="text-secondary mt-1">Model hypothetical futures and market scenarios</p>
        <div className="mt-2 inline-flex items-center gap-1.5 bg-amber/10 border border-amber/20 rounded-lg px-3 py-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <p className="text-xs text-amber-300">All scenarios are hypothetical simulations — not forecasts or real data</p>
        </div>
      </div>

      {/* Scenario Builder */}
      <Card className="p-6">
        <h2 className="font-display text-xl font-semibold mb-5">Build a Scenario</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Trend */}
          <div>
            <label className="text-xs text-muted uppercase tracking-wide mb-1.5 block">Trend</label>
            <div className="relative">
              <select
                value={selectedTrend}
                onChange={(e) => setSelectedTrend(e.target.value)}
                className="appearance-none w-full bg-surface border border-border text-primary text-sm rounded-lg px-4 py-2.5 pr-8 focus:outline-none focus:border-signal/50 cursor-pointer"
              >
                {demoTrends.map((t) => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            </div>
          </div>

          {/* Scenario Type */}
          <div>
            <label className="text-xs text-muted uppercase tracking-wide mb-1.5 block">Scenario Type</label>
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none w-full bg-surface border border-border text-primary text-sm rounded-lg px-4 py-2.5 pr-8 focus:outline-none focus:border-signal/50 cursor-pointer"
              >
                {scenarioTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            </div>
          </div>

          {/* Time Horizon */}
          <div>
            <label className="text-xs text-muted uppercase tracking-wide mb-1.5 block">Time Horizon</label>
            <div className="flex gap-2">
              {timeHorizons.map((h) => (
                <button
                  key={h}
                  onClick={() => setSelectedHorizon(h)}
                  className={`flex-1 text-xs py-2.5 rounded-lg border transition-colors ${
                    selectedHorizon === h
                      ? "bg-signal/10 border-signal/40 text-signal"
                      : "bg-surface border-border text-secondary hover:border-signal/20"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button variant="primary" size="lg" onClick={runSimulation} disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-void border-t-transparent rounded-full animate-spin" />
              Running Simulation…
            </span>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Simulation
            </>
          )}
        </Button>
      </Card>

      {/* Scenario Results */}
      {result && (
        <div className="space-y-4">
          {/* Warning Banner */}
          <div className="flex items-start gap-3 bg-amber/10 border border-amber/20 rounded-xl px-4 py-3">
            <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-300">⚠ HYPOTHETICAL SCENARIO</p>
              <p className="text-xs text-amber-300/80 mt-0.5">
                All projections are simulated and should not be treated as forecasts or investment guidance.
              </p>
            </div>
          </div>

          <Card className="p-6 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-display text-xl font-bold text-primary">
                {result.trend} — {result.type}
              </h3>
              <Badge variant="default">{result.horizon} horizon</Badge>
              <Badge variant="amber">Simulated — Not Real Data</Badge>
            </div>

            {/* Impact Assessment */}
            <div>
              <p className="text-xs text-muted uppercase tracking-wide mb-3">Impact Assessment</p>
              <div className="space-y-2.5">
                {dimensions.map((d, i) => (
                  <RatingBar key={d} label={d} value={result.ratings[i]} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Likely Outcomes */}
              <div>
                <p className="text-xs text-muted uppercase tracking-wide mb-3">Likely Outcomes</p>
                <ul className="space-y-2">
                  {result.outcomes.map((o, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-secondary">
                      <span className="text-signal mt-0.5 shrink-0">→</span>{o}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Actions */}
              <div>
                <p className="text-xs text-muted uppercase tracking-wide mb-3">Recommended Actions</p>
                <ul className="space-y-2">
                  {result.actions.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-secondary">
                      <span className="text-glow mt-0.5 shrink-0">✓</span>{a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Pre-built Scenarios */}
      <div>
        <h2 className="font-display text-xl font-semibold mb-4">Pre-built Scenarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prebuilt.map((s, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-display font-semibold text-primary text-sm">{s.title}</h3>
                  <div className="flex gap-2 mt-1.5">
                    <Badge variant="default" size="xs">{s.type}</Badge>
                    <Badge variant="amber" size="xs">{s.horizon}</Badge>
                  </div>
                </div>
                <Badge variant="pulse" size="xs">Simulated</Badge>
              </div>
              <div className="space-y-1.5">
                {dimensions.slice(0, 3).map((d, j) => (
                  <RatingBar key={d} label={d} value={s.ratings[j]} />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Scenario History */}
      <Card className="p-6">
        <h2 className="font-display text-xl font-semibold mb-4">Your Scenarios</h2>
        <div className="text-center py-8">
          <p className="text-secondary text-sm">No scenarios saved yet</p>
          <p className="text-muted text-xs mt-1">Run a simulation above to create your first scenario</p>
        </div>
      </Card>
    </div>
  );
}

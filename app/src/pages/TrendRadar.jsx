import { useState, useMemo } from "react";
import { Badge } from "../components/ui/Badge.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { RadarChart } from "../components/ui/MiniChart.jsx";
import { demoTrends } from "../lib/demoData.js";
import TrendingUp from "icon:trending-up";
import Globe from "icon:globe";
import Search from "icon:search";

const REGIONS = ["Global", "North America", "Europe", "Asia Pacific", "Latin America", "Middle East & Africa"];

const RADAR_LABELS = ["Velocity", "Momentum", "Audience", "Saturation", "Competition", "Innovation", "Growth", "Sentiment"];

// Static radar scores for the global signal radar
const RADAR_SCORES = [82, 76, 74, 58, 65, 71, 79, 68];

const OPPORTUNITY_MAP = {
  "t1": "high", "t3": "high", "t5": "high", "t7": "high", "t9": "medium",
  "t11": "high", "t17": "high", "t15": "medium", "t20": "high",
};

function getOpportunity(id) {
  return OPPORTUNITY_MAP[id] || "low";
}

function matchesRegion(trend, region) {
  if (region === "Global") return true;
  return trend.region.toLowerCase().includes(region.toLowerCase().split(" ")[0]);
}

export default function TrendRadar() {
  const [activeRegion, setActiveRegion] = useState("Global");
  const [sortField, setSortField] = useState("velocity");
  const [sortDir, setSortDir] = useState("desc");

  const filtered = useMemo(() => {
    return demoTrends.filter((t) => matchesRegion(t, activeRegion));
  }, [activeRegion]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortField] ?? 0;
      const bv = b[sortField] ?? 0;
      return sortDir === "desc" ? bv - av : av - bv;
    });
  }, [filtered, sortField, sortDir]);

  function toggleSort(field) {
    if (sortField === field) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortField(field); setSortDir("desc"); }
  }

  const topOpportunities = useMemo(() => {
    return demoTrends
      .filter((t) => (t.status === "emerging" || t.status === "accelerating") && t.contentSaturation < 45)
      .sort((a, b) => b.velocity - a.velocity)
      .slice(0, 3);
  }, []);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Global Trend Radar</h1>
        <p className="text-secondary font-body mt-1">International signals & regional intelligence</p>
      </div>

      {/* Main layout: radar + table + sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          {/* Radar Visualization */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex flex-col items-center gap-3">
                <h2 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                  <Globe size={18} className="text-signal" />
                  Signal Radar
                </h2>
                <p className="text-xs text-muted font-body text-center max-w-[200px]">
                  Composite signal strength across 8 intelligence dimensions
                </p>
                <RadarChart scores={RADAR_SCORES} labels={RADAR_LABELS} size={300} />
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3">
                {RADAR_LABELS.map((label, i) => {
                  const score = RADAR_SCORES[i];
                  const color = score >= 75 ? "text-glow" : score >= 60 ? "text-signal" : "text-amber";
                  return (
                    <div key={label} className="bg-surface border border-border rounded-lg p-3">
                      <div className={`font-display text-2xl font-bold ${color}`}>{score}</div>
                      <div className="text-xs font-body text-secondary mt-0.5">{label}</div>
                      <div className="h-1 bg-border rounded-full mt-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${score >= 75 ? "bg-glow" : score >= 60 ? "bg-signal" : "bg-amber"}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Region Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRegion(r)}
                className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-all border ${
                  activeRegion === r
                    ? "bg-signal/20 text-signal border-signal/40"
                    : "bg-panel border-border text-secondary hover:text-primary"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Trend Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted font-body">Trend</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted">Region</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted">Status</th>
                    <th
                      className="text-left px-4 py-3 text-xs font-semibold text-muted cursor-pointer hover:text-signal select-none"
                      onClick={() => toggleSort("velocity")}
                    >
                      Velocity {sortField === "velocity" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                    </th>
                    <th
                      className="text-left px-4 py-3 text-xs font-semibold text-muted cursor-pointer hover:text-signal select-none"
                      onClick={() => toggleSort("momentum")}
                    >
                      Momentum {sortField === "momentum" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted">US Opportunity</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((trend, i) => {
                    const opp = getOpportunity(trend.id);
                    return (
                      <tr key={trend.id} className={`border-b border-border/50 hover:bg-surface/50 transition-colors ${i % 2 === 0 ? "" : "bg-surface/20"}`}>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-primary text-sm">{trend.name}</span>
                          <div className="text-xs text-muted mt-0.5">{trend.category}</div>
                        </td>
                        <td className="px-4 py-3 text-xs text-secondary">{trend.region}</td>
                        <td className="px-4 py-3">
                          <Badge variant={trend.status} size="xs">{trend.status}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                              <div className="h-full bg-signal rounded-full" style={{ width: `${trend.velocity}%` }} />
                            </div>
                            <span className="text-xs font-mono text-signal">{trend.velocity}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-mono text-pulse">{trend.momentum}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={opp === "high" ? "glow" : opp === "medium" ? "amber" : "default"} size="xs">
                            {opp}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm">
                            <Search size={12} />
                            Investigate
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Opportunity Panel */}
        <div>
          <Card className="p-5 sticky top-4">
            <h2 className="font-display text-base font-bold text-primary mb-1">U.S. Market Opportunities</h2>
            <p className="text-xs text-muted font-body mb-4">from International Trends</p>
            <div className="space-y-4">
              {topOpportunities.map((trend) => (
                <div key={trend.id} className="bg-glow/5 border border-glow/20 rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-display text-sm font-bold text-primary leading-tight">{trend.name}</span>
                    <Badge variant="glow" size="xs">High</Badge>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant={trend.status} size="xs">{trend.status}</Badge>
                    <span className="text-xs text-muted font-body">{trend.region}</span>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <div>
                      <span className="text-muted">Velocity</span>
                      <div className="font-mono text-signal font-bold">{trend.velocity}</div>
                    </div>
                    <div>
                      <span className="text-muted">US Saturation</span>
                      <div className="font-mono text-glow font-bold">{trend.contentSaturation}%</div>
                    </div>
                  </div>
                  <p className="text-xs text-secondary font-body leading-relaxed">{trend.signal}</p>
                  <Button variant="outline" size="sm" className="w-full justify-center mt-1">
                    <TrendingUp size={12} />
                    Investigate
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

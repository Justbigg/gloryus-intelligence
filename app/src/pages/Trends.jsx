import { useState, useMemo } from "react";
import { Badge } from "../components/ui/Badge.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { SparkLine } from "../components/ui/MiniChart.jsx";
import { demoTrends } from "../lib/demoData.js";
import ChevronDown from "icon:chevron-down";
import TrendingUp from "icon:trending-up";

const STATUS_FILTERS = ["All", "Emerging", "Accelerating", "Mainstream", "Saturated", "Declining"];
const CATEGORIES = ["All", "Wellness", "Beauty", "Tech/Culture", "Fashion", "Lifestyle", "Travel/Wellness", "Social/Culture", "Food/Wellness", "Food/Beverage", "Home/Wellness", "Tech/Marketing", "Fashion/Retail", "Tech/Retail", "Lifestyle/Culture", "Fashion/Wellness", "Fashion/Interior"];
const SORT_OPTIONS = ["Velocity", "Momentum", "Audience Interest", "Content Saturation"];

const STATUS_VARIANT = {
  emerging: "emerging",
  accelerating: "accelerating",
  mainstream: "mainstream",
  saturated: "saturated",
  declining: "declining",
};

const METRIC_COLORS = {
  Velocity: "bg-signal",
  Momentum: "bg-pulse",
  "Audience Interest": "bg-glow",
  "Content Saturation": "bg-amber",
};

function MetricBar({ label, value, colorClass }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-body text-muted">{label}</span>
        <span className="text-xs font-mono text-secondary">{value}%</span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function mockSparkline(seed, status) {
  const base = seed % 40 + 30;
  const arr = Array.from({ length: 8 }, (_, i) => {
    const noise = Math.sin(seed * 3 + i * 1.7) * 15;
    const trend = status === "emerging" || status === "accelerating" ? i * 4 : status === "declining" ? -i * 3 : 0;
    return Math.max(10, Math.min(100, base + noise + trend));
  });
  return arr;
}

export default function Trends() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Velocity");
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const filtered = useMemo(() => {
    let arr = [...demoTrends];
    if (statusFilter !== "All") {
      arr = arr.filter((t) => t.status === statusFilter.toLowerCase());
    }
    if (categoryFilter !== "All") {
      arr = arr.filter((t) => t.category === categoryFilter);
    }
    const sortKey = { Velocity: "velocity", Momentum: "momentum", "Audience Interest": "audienceInterest", "Content Saturation": "contentSaturation" }[sortBy];
    arr.sort((a, b) => b[sortKey] - a[sortKey]);
    return arr;
  }, [statusFilter, categoryFilter, sortBy]);

  const stats = useMemo(() => ({
    total: demoTrends.length,
    emerging: demoTrends.filter((t) => t.status === "emerging").length,
    declining: demoTrends.filter((t) => t.status === "declining").length,
    avgVelocity: Math.round(demoTrends.reduce((s, t) => s + t.velocity, 0) / demoTrends.length),
  }), []);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Trend Intelligence</h1>
        <p className="text-secondary font-body mt-1">Emerging signals across markets</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Trends", value: stats.total, color: "text-signal" },
          { label: "Emerging", value: stats.emerging, color: "text-glow" },
          { label: "Declining", value: stats.declining, color: "text-hot" },
          { label: "Avg Velocity", value: `${stats.avgVelocity}%`, color: "text-pulse" },
        ].map((s) => (
          <Card key={s.label} className="p-4 text-center">
            <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted font-body mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Status filters */}
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all border ${
                statusFilter === f
                  ? "bg-signal/20 text-signal border-signal/40"
                  : "bg-panel border-border text-secondary hover:text-primary hover:border-border/60"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex gap-2 ml-auto">
          {/* Category dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowCatDropdown((v) => !v); setShowSortDropdown(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-panel text-secondary text-xs font-body hover:text-primary"
            >
              {categoryFilter === "All" ? "Category" : categoryFilter}
              <ChevronDown size={12} />
            </button>
            {showCatDropdown && (
              <div className="absolute right-0 top-8 z-30 bg-surface border border-border rounded-lg shadow-panel w-48 py-1 max-h-64 overflow-y-auto">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCategoryFilter(c); setShowCatDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-body hover:bg-panel transition-colors ${categoryFilter === c ? "text-signal" : "text-secondary"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowSortDropdown((v) => !v); setShowCatDropdown(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-panel text-secondary text-xs font-body hover:text-primary"
            >
              Sort: {sortBy}
              <ChevronDown size={12} />
            </button>
            {showSortDropdown && (
              <div className="absolute right-0 top-8 z-30 bg-surface border border-border rounded-lg shadow-panel w-44 py-1">
                {SORT_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSortBy(s); setShowSortDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-body hover:bg-panel transition-colors ${sortBy === s ? "text-signal" : "text-secondary"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted font-body">
        Showing <span className="text-signal font-semibold">{filtered.length}</span> trends
      </p>

      {/* Trend Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((trend, idx) => {
          const sparkData = mockSparkline(idx * 7 + trend.velocity, trend.status);
          return (
            <Card key={trend.id} className="p-5 flex flex-col gap-3 hover:shadow-glow-signal transition-all duration-300">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <Badge variant={STATUS_VARIANT[trend.status] || "default"} size="xs">
                    {trend.status}
                  </Badge>
                  <h3 className="font-display text-lg font-bold text-primary mt-1 leading-tight">{trend.name}</h3>
                  <span className="text-xs text-muted font-body">{trend.category}</span>
                </div>
                <SparkLine data={sparkData} color={trend.status === "declining" ? "#EF4444" : trend.status === "emerging" ? "#10B981" : "#00D4FF"} width={72} height={32} />
              </div>

              {/* Description */}
              <p className="text-xs font-body text-secondary leading-relaxed line-clamp-2">{trend.description}</p>

              {/* Metrics */}
              <div className="space-y-2">
                <MetricBar label="Velocity" value={trend.velocity} colorClass={METRIC_COLORS.Velocity} />
                <MetricBar label="Momentum" value={trend.momentum} colorClass={METRIC_COLORS.Momentum} />
                <MetricBar label="Audience Interest" value={trend.audienceInterest} colorClass={METRIC_COLORS["Audience Interest"]} />
                <MetricBar label="Content Saturation" value={trend.contentSaturation} colorClass={METRIC_COLORS["Content Saturation"]} />
              </div>

              {/* Signal snippet */}
              <div className="bg-signal/5 border border-signal/15 rounded-lg px-3 py-2">
                <p className="text-xs font-mono text-signal leading-relaxed">{trend.signal}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-body text-muted bg-border px-2 py-0.5 rounded-full">{trend.region}</span>
                <Button variant="ghost" size="sm">
                  <TrendingUp size={12} />
                  Investigate
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

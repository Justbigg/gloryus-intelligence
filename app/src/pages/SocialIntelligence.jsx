import { useState, useMemo, useEffect } from "react";
import { Badge } from "../components/ui/Badge.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { demoSocialSignals } from "../lib/demoData.js";
import { censusProvider } from "../lib/providers.js";
import Search from "icon:search";
import ArrowRight from "icon:arrow-right";
import TrendingUp from "icon:trending-up";
import TrendingDown from "icon:trending-down";
import Zap from "icon:zap";

const PLATFORM_STYLES = {
  TikTok: { bg: "bg-pink-500/10 text-pink-400 border border-pink-500/20", dot: "bg-pink-500" },
  Instagram: { bg: "bg-purple-500/10 text-purple-400 border border-purple-500/20", dot: "bg-purple-500" },
  Reddit: { bg: "bg-orange-500/10 text-orange-400 border border-orange-500/20", dot: "bg-orange-500" },
  X: { bg: "bg-sky-500/10 text-sky-400 border border-sky-500/20", dot: "bg-sky-500" },
  YouTube: { bg: "bg-red-500/10 text-red-400 border border-red-500/20", dot: "bg-red-500" },
};

const SENTIMENT_VARIANT = { positive: "glow", negative: "hot", neutral: "amber" };
const PLATFORMS = ["All", "TikTok", "Instagram", "Reddit", "X", "YouTube"];
const SENTIMENTS = ["All", "positive", "negative", "neutral"];

const FLOW_STEPS = [
  { key: "signal", label: "SIGNAL", color: "text-signal", borderColor: "border-signal/40", bg: "bg-signal/5" },
  { key: "problem", label: "PROBLEM", color: "text-hot", borderColor: "border-hot/30", bg: "bg-hot/5" },
  { key: "need", label: "NEED", color: "text-pulse", borderColor: "border-pulse/30", bg: "bg-pulse/5" },
  { key: "product", label: "PRODUCT IDEA", color: "text-glow", borderColor: "border-glow/30", bg: "bg-glow/5" },
  { key: "audience", label: "AUDIENCE", color: "text-amber", borderColor: "border-amber/30", bg: "bg-amber/5" },
  { key: "content", label: "CONTENT", color: "text-secondary", borderColor: "border-border", bg: "bg-surface" },
  { key: "launch", label: "LAUNCH", color: "text-signal", borderColor: "border-signal/40", bg: "bg-signal/10" },
];

function formatVolume(v) {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return v;
}

function formatMoney(v) {
  return `$${(v / 1000).toFixed(1)}K`;
}

function getFlowData(signal) {
  return {
    signal: `${signal.keyword} on ${signal.platform}`,
    problem: signal.problem,
    need: `Solutions for: ${signal.problem.split(";")[0]}`,
    product: signal.opportunity,
    audience: signal.audience,
    content: `Tutorial + testimonial series targeting ${signal.platform} search`,
    launch: "MVP → Creator partnerships → Scale via paid",
  };
}

export default function SocialIntelligence() {
  const [searchQ, setSearchQ] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [market, setMarket] = useState(null);

  // Live US Census demographics via the serverless proxy. Falls back to
  // demo data inside the provider when the proxy/key is not configured.
  useEffect(() => {
    let cancelled = false;
    censusProvider
      .getMarketDemographics()
      .then((data) => {
        if (!cancelled) setMarket(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return demoSocialSignals.filter((s) => {
      const matchSearch = searchQ === "" || s.keyword.toLowerCase().includes(searchQ.toLowerCase());
      const matchPlatform = platformFilter === "All" || s.platform === platformFilter;
      const matchSentiment = sentimentFilter === "All" || s.sentiment === sentimentFilter;
      return matchSearch && matchPlatform && matchSentiment;
    });
  }, [searchQ, platformFilter, sentimentFilter]);

  const topSignal = demoSocialSignals[0];
  const flowData = getFlowData(topSignal);

  const topOpportunities = demoSocialSignals
    .sort((a, b) => b.engagementScore - a.engagementScore)
    .slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Social-to-Product Intelligence</h1>
        <p className="text-secondary font-body mt-1">Converting signals into opportunities</p>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Search keywords…"
            className="w-full pl-9 pr-4 py-2 bg-panel border border-border rounded-lg text-sm font-body text-primary placeholder:text-muted focus:outline-hidden focus:border-signal/50 transition-colors"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-body border transition-all ${
                platformFilter === p ? "bg-pulse/20 text-purple-300 border-pulse/30" : "bg-panel border-border text-secondary hover:text-primary"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {SENTIMENTS.map((s) => (
            <button
              key={s}
              onClick={() => setSentimentFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-body border transition-all capitalize ${
                sentimentFilter === s ? "bg-glow/20 text-emerald-300 border-glow/30" : "bg-panel border-border text-secondary hover:text-primary"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Signal-to-Product Flow */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-signal" />
          <h2 className="font-display text-base font-bold text-primary">Signal-to-Product Flow</h2>
          <Badge variant="signal" size="xs">Top Signal</Badge>
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="flex items-stretch gap-0 min-w-max">
            {FLOW_STEPS.map((step, i) => (
              <div key={step.key} className="flex items-center">
                <div className={`rounded-xl border ${step.borderColor} ${step.bg} p-3 w-44 flex-shrink-0`}>
                  <div className={`text-[10px] font-mono font-bold ${step.color} mb-1.5 tracking-widest`}>{step.label}</div>
                  <p className="text-xs font-body text-primary leading-snug">{flowData[step.key]}</p>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <div className="flex items-center px-1.5">
                    <ArrowRight size={14} className="text-muted" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Market Snapshot (US Census demographics) */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-6 rounded-full bg-glow/20 text-glow text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">US</span>
          <h2 className="font-display text-base font-bold text-primary">Market Snapshot</h2>
          {market && (
            <Badge variant={market.source === "live" ? "signal" : "amber"} size="xs">
              {market.source === "live" ? "Live · US Census ACS" : "Demo data"}
            </Badge>
          )}
        </div>
        {market === null ? (
          <p className="text-xs text-muted font-body">Loading census demographics…</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {market.states.slice(0, 10).map((state) => (
              <div
                key={state.fips}
                className="rounded-lg border border-border bg-surface p-2.5 hover:border-signal/40 transition-colors"
              >
                <div className="font-display text-xs font-bold text-primary truncate">{state.name}</div>
                <div className="font-mono text-[11px] text-signal mt-1">{formatMoney(state.medianIncome)}</div>
                <div className="text-[10px] text-muted font-body">{formatVolume(state.population)} people</div>
                <div className="text-[10px] text-secondary font-body mt-1 leading-tight">{state.incomeBand}</div>
              </div>
            ))}
          </div>
        )}
        {market?.source === "demo" && (
          <p className="text-[10px] text-muted font-body mt-3">
            Live census data unavailable{market.error ? ` — ${market.error}` : ""}. Showing demo data. Set
            CENSUS_API_KEY in Vercel to enable live figures.
          </p>
        )}
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Signal Stream */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-primary">Signal Stream</h2>
            <span className="text-xs text-muted font-body">{filtered.length} signals</span>
          </div>
          {filtered.map((signal) => {
            const pStyle = PLATFORM_STYLES[signal.platform] || PLATFORM_STYLES.TikTok;
            const sentimentVar = SENTIMENT_VARIANT[signal.sentiment] || "default";
            return (
              <Card key={signal.id} className="p-4 hover:shadow-glow-signal transition-all duration-300">
                <div className="flex flex-wrap items-start gap-3">
                  {/* Platform + keyword */}
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${pStyle.dot}`} />
                    <span className={`text-xs px-2 py-0.5 rounded-full font-body font-medium ${pStyle.bg}`}>
                      {signal.platform}
                    </span>
                    <span className="font-mono text-signal text-sm font-semibold truncate">{signal.keyword}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono flex-shrink-0">
                    <span className="text-secondary">{formatVolume(signal.volume)}</span>
                    {signal.engagementScore >= 80 ? (
                      <TrendingUp size={12} className="text-glow" />
                    ) : (
                      <TrendingDown size={12} className="text-hot" />
                    )}
                    <span className={signal.engagementScore >= 80 ? "text-glow" : "text-amber"}>{signal.engagementScore}</span>
                  </div>
                  <Badge variant={sentimentVar} size="xs">{signal.sentiment}</Badge>
                </div>

                {/* Engagement bar */}
                <div className="mt-2 mb-3 h-1 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-signal/70 rounded-full"
                    style={{ width: `${signal.engagementScore}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-body">
                  <div>
                    <span className="text-muted">Problem: </span>
                    <span className="text-secondary">{signal.problem}</span>
                  </div>
                  <div>
                    <span className="text-muted">Opportunity: </span>
                    <span className="text-glow font-medium">{signal.opportunity}</span>
                  </div>
                  <div>
                    <span className="text-muted">Audience: </span>
                    <span className="text-secondary">{signal.audience}</span>
                  </div>
                  <div>
                    <span className="text-muted">Date: </span>
                    <span className="text-secondary font-mono">{signal.date}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Top Opportunities Panel */}
        <div>
          <Card className="p-5 sticky top-4">
            <h2 className="font-display text-base font-bold text-primary mb-4">Top Opportunities</h2>
            <div className="space-y-4">
              {topOpportunities.map((signal, i) => (
                <div key={signal.id} className="space-y-2 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-signal/20 text-signal text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-display text-sm font-bold text-primary leading-snug">{signal.opportunity}</span>
                  </div>
                  <div className="text-xs text-muted font-body">
                    <span className="text-secondary">Source: </span>{signal.keyword}
                  </div>
                  <div className="text-xs text-muted font-body">
                    <span className="text-secondary">Audience: </span>{signal.audience}
                  </div>
                  <Button variant="outline" size="sm" className="w-full justify-center">
                    <Zap size={12} />
                    Develop Opportunity
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

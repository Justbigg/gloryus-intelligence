import { useState, useMemo } from "react";
import { Badge } from "../components/ui/Badge.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { demoOpportunities } from "../lib/demoData.js";
import ChevronDown from "icon:chevron-down";
import ChevronRight from "icon:chevron-right";
import Bookmark from "icon:bookmark";
import Search from "icon:search";
import Sparkles from "icon:sparkles";

const STATUS_FILTERS = ["All", "New", "Investigating", "Validated"];
const COMPETITION_FILTERS = ["All", "low", "medium", "high"];
const SATURATION_FILTERS = ["All", "low", "medium", "high"];
const SORT_OPTIONS = ["Confidence", "Newest", "Competition"];

const STATUS_VARIANT = { new: "signal", investigating: "amber", validated: "glow" };
const COMP_VARIANT = { low: "glow", medium: "amber", high: "hot" };

function ConfidenceRing({ value }) {
  const r = 28, c = 2 * Math.PI * r;
  const fill = (value / 100) * c;
  return (
    <svg width="72" height="72" className="flex-shrink-0">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#1E293B" strokeWidth="5" />
      <circle
        cx="36" cy="36" r={r} fill="none"
        stroke="#00D4FF" strokeWidth="5"
        strokeDasharray={`${fill} ${c}`}
        strokeDashoffset={c / 4}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text x="36" y="40" textAnchor="middle" fill="#00D4FF" fontSize="14" fontFamily="JetBrains Mono" fontWeight="700">{value}</text>
    </svg>
  );
}

function OpportunityCard({ opp }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card className="p-5 flex flex-col gap-4 hover:shadow-glow-signal transition-all duration-300">
      {/* Header */}
      <div className="flex items-start gap-4">
        <ConfidenceRing value={opp.confidence} />
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={STATUS_VARIANT[opp.status] || "default"} size="xs">{opp.status}</Badge>
            <Badge variant="default" size="xs">{opp.productCategory}</Badge>
          </div>
          <h3 className="font-display text-base font-bold text-primary leading-snug">{opp.title}</h3>
          <p className="text-xs font-body text-secondary leading-relaxed">{opp.opportunity}</p>
        </div>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-body">
        <div className="bg-surface rounded-lg p-2.5 space-y-0.5">
          <div className="text-muted">Audience</div>
          <div className="text-secondary">{opp.audience}</div>
        </div>
        <div className="bg-surface rounded-lg p-2.5 space-y-0.5">
          <div className="text-muted">Problem</div>
          <div className="text-secondary">{opp.problem}</div>
        </div>
        <div className="bg-surface rounded-lg p-2.5 space-y-0.5">
          <div className="text-muted">Observed Signal</div>
          <div className="text-signal font-mono text-[11px] leading-snug">{opp.observedSignal}</div>
        </div>
        <div className="bg-surface rounded-lg p-2.5 space-y-0.5">
          <div className="text-muted">Trend Connection</div>
          <div className="text-secondary">{opp.trendConnection}</div>
        </div>
        <div className="bg-surface rounded-lg p-2.5 flex items-center gap-2">
          <span className="text-muted">Competition:</span>
          <Badge variant={COMP_VARIANT[opp.competition] || "default"} size="xs">{opp.competition}</Badge>
        </div>
        <div className="bg-surface rounded-lg p-2.5 flex items-center gap-2">
          <span className="text-muted">Saturation:</span>
          <Badge variant={COMP_VARIANT[opp.contentSaturation] || "default"} size="xs">{opp.contentSaturation}</Badge>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-1.5">
        <div className="text-xs font-body text-muted font-semibold">Recommendations</div>
        <ul className="space-y-1">
          {opp.recommendations.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-xs font-body text-secondary">
              <span className="mt-1 w-1 h-1 rounded-full bg-signal/60 flex-shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Collapsible Evidence */}
      <div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-body text-muted hover:text-secondary transition-colors"
        >
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          Source & Evidence
        </button>
        {expanded && (
          <div className="mt-2 bg-surface border border-border rounded-lg p-3 text-xs font-mono text-muted space-y-1">
            <div><span className="text-secondary">Signal:</span> {opp.observedSignal}</div>
            <div><span className="text-secondary">Confidence:</span> {opp.confidence}%</div>
            <div><span className="text-secondary">Status:</span> {opp.status}</div>
            <div><span className="text-secondary">Category:</span> {opp.productCategory}</div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-border">
        <Button variant="primary" size="sm" className="flex-1 justify-center">
          <Search size={12} />
          Deep Research
        </Button>
        <Button variant="ghost" size="sm">
          <Bookmark size={12} />
          Save
        </Button>
      </div>
    </Card>
  );
}

export default function Opportunities() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [compFilter, setCompFilter] = useState("All");
  const [satFilter, setSatFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Confidence");
  const [showCompDrop, setShowCompDrop] = useState(false);
  const [showSatDrop, setShowSatDrop] = useState(false);
  const [showSortDrop, setShowSortDrop] = useState(false);

  const filtered = useMemo(() => {
    let arr = [...demoOpportunities];
    if (statusFilter !== "All") arr = arr.filter((o) => o.status === statusFilter.toLowerCase());
    if (compFilter !== "All") arr = arr.filter((o) => o.competition === compFilter);
    if (satFilter !== "All") arr = arr.filter((o) => o.contentSaturation === satFilter);
    if (sortBy === "Confidence") arr.sort((a, b) => b.confidence - a.confidence);
    else if (sortBy === "Newest") arr.sort((a, b) => a.id.localeCompare(b.id));
    else if (sortBy === "Competition") {
      const order = { low: 0, medium: 1, high: 2 };
      arr.sort((a, b) => (order[a.competition] ?? 1) - (order[b.competition] ?? 1));
    }
    return arr;
  }, [statusFilter, compFilter, satFilter, sortBy]);

  const stats = useMemo(() => ({
    newCount: demoOpportunities.filter((o) => o.status === "new").length,
    highConf: demoOpportunities.filter((o) => o.confidence >= 80).length,
    validated: demoOpportunities.filter((o) => o.status === "validated").length,
  }), []);

  function Dropdown({ show, setShow, label, options, value, setValue, others }) {
    return (
      <div className="relative">
        <button
          onClick={() => { setShow((v) => !v); others.forEach((f) => f(false)); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-panel text-secondary text-xs font-body hover:text-primary"
        >
          {value === "All" ? label : value}
          <ChevronDown size={12} />
        </button>
        {show && (
          <div className="absolute right-0 top-8 z-30 bg-surface border border-border rounded-lg shadow-panel w-36 py-1">
            {options.map((o) => (
              <button
                key={o}
                onClick={() => { setValue(o); setShow(false); }}
                className={`w-full text-left px-3 py-1.5 text-xs font-body hover:bg-panel capitalize ${value === o ? "text-signal" : "text-secondary"}`}
              >
                {o}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Product Opportunities</h1>
        <p className="text-secondary font-body mt-1">Intelligence-backed product opportunity cards</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "New This Week", value: stats.newCount, color: "text-signal" },
          { label: "High Confidence", value: stats.highConf, color: "text-glow" },
          { label: "Validated", value: stats.validated, color: "text-pulse" },
        ].map((s) => (
          <Card key={s.label} className="p-4 text-center">
            <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted font-body mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-body font-medium border transition-all ${
                statusFilter === f ? "bg-signal/20 text-signal border-signal/40" : "bg-panel border-border text-secondary hover:text-primary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          <Dropdown
            show={showCompDrop} setShow={setShowCompDrop}
            label="Competition" options={COMPETITION_FILTERS} value={compFilter} setValue={setCompFilter}
            others={[setShowSatDrop, setShowSortDrop]}
          />
          <Dropdown
            show={showSatDrop} setShow={setShowSatDrop}
            label="Saturation" options={SATURATION_FILTERS} value={satFilter} setValue={setSatFilter}
            others={[setShowCompDrop, setShowSortDrop]}
          />
          <Dropdown
            show={showSortDrop} setShow={setShowSortDrop}
            label="Sort" options={SORT_OPTIONS} value={sortBy} setValue={setSortBy}
            others={[setShowCompDrop, setShowSatDrop]}
          />
        </div>
      </div>

      <p className="text-xs text-muted font-body">
        Showing <span className="text-signal font-semibold">{filtered.length}</span> opportunities
      </p>

      {/* Opportunity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map((opp) => (
          <OpportunityCard key={opp.id} opp={opp} />
        ))}
      </div>
    </div>
  );
}

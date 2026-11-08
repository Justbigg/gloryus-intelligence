import { useState, useMemo } from "react";
import { Badge } from "../components/ui/Badge.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { demoAudiences } from "../lib/demoData.js";
import Users from "icon:users";
import HelpCircle from "icon:help-circle";
import AlertCircle from "icon:alert-circle";
import Zap from "icon:zap";
import Layers from "icon:layers";
import X from "icon:x";

const PLATFORM_STYLES = {
  TikTok: "bg-pink-500/10 text-pink-400 border border-pink-500/20",
  Instagram: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  Reddit: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  YouTube: "bg-red-500/10 text-red-400 border border-red-500/20",
  LinkedIn: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  Podcasts: "bg-amber/10 text-amber-300 border border-amber/20",
  Pinterest: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  Depop: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  "The RealReal": "bg-gray-500/10 text-gray-400 border border-gray-500/20",
  X: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
};

function PlatformBadge({ platform }) {
  const cls = PLATFORM_STYLES[platform] || "bg-border text-secondary";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-body font-medium ${cls}`}>
      {platform}
    </span>
  );
}

function AudienceCard({ audience, isComparing, onToggleCompare, compareDisabled }) {
  return (
    <Card className="p-5 flex flex-col gap-4 hover:shadow-glow-signal transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1.5">
          <h3 className="font-display text-lg font-bold text-primary">{audience.name}</h3>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="signal" size="xs">{audience.ageRange}</Badge>
            <Badge variant="default" size="xs">{audience.size}</Badge>
          </div>
        </div>
        <button
          onClick={() => onToggleCompare(audience.id)}
          disabled={compareDisabled && !isComparing}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-body border transition-all ${
            isComparing
              ? "bg-pulse/20 text-purple-300 border-pulse/30"
              : compareDisabled
              ? "opacity-40 cursor-not-allowed bg-panel border-border text-muted"
              : "bg-panel border-border text-secondary hover:text-primary hover:border-signal/30"
          }`}
        >
          {isComparing ? "✓ Selected" : "Compare"}
        </button>
      </div>

      {/* Platforms */}
      <div className="flex flex-wrap gap-1.5">
        {audience.platforms.map((p) => (
          <PlatformBadge key={p} platform={p} />
        ))}
      </div>

      {/* Interests */}
      <div>
        <div className="text-[10px] font-body text-muted uppercase tracking-wider mb-1.5">Interests</div>
        <div className="flex flex-wrap gap-1">
          {audience.interests.map((i) => (
            <span key={i} className="text-xs font-body bg-surface border border-border px-2 py-0.5 rounded-full text-secondary">{i}</span>
          ))}
        </div>
      </div>

      {/* Problems */}
      <div>
        <div className="flex items-center gap-1.5 text-[10px] font-body text-muted uppercase tracking-wider mb-1.5">
          <AlertCircle size={11} />
          Top Problems
        </div>
        <ul className="space-y-1">
          {audience.problems.slice(0, 3).map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-xs font-body text-secondary">
              <span className="mt-1 w-1 h-1 rounded-full bg-hot/60 flex-shrink-0" />
              {p}
            </li>
          ))}
        </ul>
      </div>

      {/* Questions */}
      <div>
        <div className="flex items-center gap-1.5 text-[10px] font-body text-muted uppercase tracking-wider mb-1.5">
          <HelpCircle size={11} />
          Top Questions
        </div>
        <ul className="space-y-1">
          {audience.questions.slice(0, 3).map((q, i) => (
            <li key={i} className="flex items-start gap-2 text-xs font-body text-secondary">
              <span className="mt-1 flex-shrink-0 text-muted">Q{i + 1}.</span>
              {q}
            </li>
          ))}
        </ul>
      </div>

      {/* Behaviors */}
      <div>
        <div className="text-[10px] font-body text-muted uppercase tracking-wider mb-1.5">Behaviors</div>
        <ul className="space-y-1">
          {audience.behaviors.slice(0, 2).map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-xs font-body text-secondary">
              <span className="mt-1 w-1 h-1 rounded-full bg-pulse/60 flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Content Preferences */}
      <div>
        <div className="text-[10px] font-body text-muted uppercase tracking-wider mb-1.5">Content Preferences</div>
        <div className="flex flex-wrap gap-1">
          {audience.contentPreferences.map((c) => (
            <span key={c} className="text-xs font-body bg-pulse/5 border border-pulse/20 text-purple-300 px-2 py-0.5 rounded-full">{c}</span>
          ))}
        </div>
      </div>

      {/* Emerging Needs */}
      <div className="bg-signal/5 border border-signal/15 rounded-lg p-3 space-y-1">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-signal uppercase tracking-wider">
          <Zap size={10} />
          Emerging Needs
        </div>
        {audience.emergingNeeds.map((n, i) => (
          <div key={i} className="text-xs font-body text-signal/80">• {n}</div>
        ))}
      </div>

      {/* Product Signals */}
      <div className="bg-glow/5 border border-glow/15 rounded-lg p-3 space-y-1">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-glow uppercase tracking-wider">
          <Layers size={10} />
          Product Signals
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {audience.productSignals.map((s) => (
            <span key={s} className="text-xs font-body bg-glow/10 text-emerald-300 px-2 py-0.5 rounded-full border border-glow/20">{s}</span>
          ))}
        </div>
      </div>
    </Card>
  );
}

function ComparePanel({ ids, audiences, onClose }) {
  const [a, b] = ids.map((id) => audiences.find((au) => au.id === id));
  if (!a || !b) return null;

  const fields = [
    { label: "Age Range", keyA: a.ageRange, keyB: b.ageRange },
    { label: "Size", keyA: a.size, keyB: b.size },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-void/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-primary">Audience Comparison</h2>
          <button onClick={onClose} className="text-muted hover:text-primary transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 grid grid-cols-2 gap-6">
          {[a, b].map((aud) => (
            <div key={aud.id} className="space-y-4">
              <div>
                <h3 className="font-display text-base font-bold text-primary">{aud.name}</h3>
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  <Badge variant="signal" size="xs">{aud.ageRange}</Badge>
                  <Badge variant="default" size="xs">{aud.size}</Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {aud.platforms.map((p) => <PlatformBadge key={p} platform={p} />)}
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-body text-muted uppercase tracking-wider">Problems</div>
                {aud.problems.slice(0, 3).map((p, i) => (
                  <div key={i} className="text-xs font-body text-secondary flex gap-2">
                    <span className="text-hot mt-0.5">•</span>{p}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-body text-muted uppercase tracking-wider">Emerging Needs</div>
                {aud.emergingNeeds.map((n, i) => (
                  <div key={i} className="text-xs font-body text-signal/80 flex gap-2">
                    <Zap size={10} className="mt-0.5 flex-shrink-0" />{n}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-body text-muted uppercase tracking-wider">Product Signals</div>
                <div className="flex flex-wrap gap-1">
                  {aud.productSignals.map((s) => (
                    <span key={s} className="text-xs font-body bg-glow/10 text-emerald-300 px-2 py-0.5 rounded-full border border-glow/20">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function Audiences() {
  const [compareIds, setCompareIds] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  function toggleCompare(id) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  }

  // Cross-audience insights
  const commonProblems = useMemo(() => {
    const all = demoAudiences.flatMap((a) => a.problems);
    const freq = {};
    all.forEach((p) => { const k = p.toLowerCase().slice(0, 30); freq[k] = (freq[k] || 0) + 1; });
    return Object.entries(freq).filter(([, v]) => v >= 2).slice(0, 4).map(([k]) => all.find((p) => p.toLowerCase().startsWith(k)));
  }, []);

  const allPlatforms = useMemo(() => {
    const counts = {};
    demoAudiences.forEach((a) => a.platforms.forEach((p) => { counts[p] = (counts[p] || 0) + 1; }));
    return Object.entries(counts).sort(([, a], [, b]) => b - a).slice(0, 5).map(([p, c]) => ({ platform: p, count: c }));
  }, []);

  const universalNeeds = useMemo(() => {
    const all = demoAudiences.flatMap((a) => a.emergingNeeds);
    const themes = ["community", "transparent", "personali", "accessible"];
    return themes.map((t) => all.find((n) => n.toLowerCase().includes(t))).filter(Boolean);
  }, []);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Audience Intelligence</h1>
          <p className="text-secondary font-body mt-1">Deep profiles of your target audiences</p>
        </div>
        <Button
          variant={compareIds.length === 2 ? "primary" : "outline"}
          size="md"
          onClick={() => compareIds.length === 2 && setShowCompare(true)}
          disabled={compareIds.length < 2}
        >
          <Users size={14} />
          Compare Audiences {compareIds.length > 0 ? `(${compareIds.length}/2)` : ""}
        </Button>
      </div>

      {compareIds.length > 0 && compareIds.length < 2 && (
        <div className="text-xs text-muted font-body bg-panel border border-border rounded-lg px-4 py-2">
          Select one more audience to compare.{" "}
          <button onClick={() => setCompareIds([])} className="text-signal underline">Clear selection</button>
        </div>
      )}

      {/* Audience Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
        {demoAudiences.map((audience) => (
          <AudienceCard
            key={audience.id}
            audience={audience}
            isComparing={compareIds.includes(audience.id)}
            onToggleCompare={toggleCompare}
            compareDisabled={compareIds.length >= 2}
          />
        ))}
      </div>

      {/* Cross-Audience Insights */}
      <Card className="p-6">
        <h2 className="font-display text-lg font-bold text-primary mb-5">Audience Insights Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Common Problems */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-hot" />
              <h3 className="font-display text-sm font-bold text-secondary">Common Problems</h3>
            </div>
            <ul className="space-y-2">
              {commonProblems.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-xs font-body text-secondary">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-hot/50 flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Shared Platforms */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-pulse" />
              <h3 className="font-display text-sm font-bold text-secondary">Shared Platforms</h3>
            </div>
            <div className="space-y-2">
              {allPlatforms.map(({ platform, count }) => (
                <div key={platform} className="flex items-center gap-2">
                  <PlatformBadge platform={platform} />
                  <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-pulse/50 rounded-full" style={{ width: `${(count / demoAudiences.length) * 100}%` }} />
                  </div>
                  <span className="text-xs font-mono text-muted">{count}/{demoAudiences.length}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Universal Needs */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-signal" />
              <h3 className="font-display text-sm font-bold text-secondary">Universal Needs</h3>
            </div>
            <ul className="space-y-2">
              {universalNeeds.map((n, i) => (
                <li key={i} className="flex items-start gap-2 text-xs font-body text-signal/80">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-signal/50 flex-shrink-0" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Compare Modal */}
      {showCompare && compareIds.length === 2 && (
        <ComparePanel ids={compareIds} audiences={demoAudiences} onClose={() => setShowCompare(false)} />
      )}
    </div>
  );
}

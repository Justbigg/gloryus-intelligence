import { useState } from "react";
import Lightbulb from "icon:lightbulb";
import ChevronDown from "icon:chevron-down";
import Sparkles from "icon:sparkles";
import { Badge } from "../components/ui/Badge.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { demoContentIdeas, demoTrends } from "../lib/demoData.js";

const platforms = [
  "All","TikTok","Instagram","YouTube","LinkedIn","X","Facebook","Pinterest","Blog","Email",
];

const platformColor = {
  TikTok: "bg-pink-500/10 text-pink-400 border border-pink-500/20",
  Instagram: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  YouTube: "bg-red-500/10 text-red-400 border border-red-500/20",
  LinkedIn: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  X: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
  Facebook: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
  Pinterest: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  Blog: "bg-glow/10 text-emerald-300 border border-glow/20",
  Email: "bg-amber/10 text-amber-300 border border-amber/20",
};

const contentTypeVariant = {
  educational: "signal",
  entertaining: "pulse",
  inspirational: "glow",
  promotional: "amber",
};

const calendarDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const calendarSlots = [
  { day: "Mon", platform: "TikTok", type: "Video" },
  { day: "Tue", platform: "Instagram", type: "Reel" },
  { day: "Wed", platform: "Email", type: "Newsletter" },
  { day: "Thu", platform: "LinkedIn", type: "Article" },
  { day: "Fri", platform: "YouTube", type: "Long-form" },
  { day: "Sat", platform: "X", type: "Thread" },
  { day: "Sun", platform: "Pinterest", type: "Pin" },
];

export default function ContentLab() {
  const [activePlatform, setActivePlatform] = useState("All");
  const [selectedTrend, setSelectedTrend] = useState(demoTrends[0].name);
  const [generatedIdeas, setGeneratedIdeas] = useState(null);
  const [generating, setGenerating] = useState(false);

  const filtered =
    activePlatform === "All"
      ? demoContentIdeas
      : demoContentIdeas.filter((i) => i.platform === activePlatform);

  function handleGenerate() {
    setGenerating(true);
    setGeneratedIdeas(null);
    setTimeout(() => {
      const matches = demoContentIdeas.filter((i) =>
        i.trendConnection.toLowerCase().includes(selectedTrend.toLowerCase().split(" ")[0])
      );
      const ideas = matches.length >= 3 ? matches.slice(0, 3) : matches.concat(demoContentIdeas.slice(0, 3 - matches.length));
      setGeneratedIdeas(ideas);
      setGenerating(false);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-void text-primary font-body px-4 py-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-primary">Content Intelligence Lab</h1>
        <p className="text-secondary mt-1">Turn trends and opportunities into content</p>
      </div>

      {/* Platform Filter Bar */}
      <div className="flex flex-wrap gap-2">
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => setActivePlatform(p)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              activePlatform === p
                ? "bg-signal text-void"
                : "bg-panel border border-border text-secondary hover:border-signal/40 hover:text-primary"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Content Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((idea) => (
          <Card key={idea.id} className="p-5 flex flex-col gap-3">
            <div className="flex flex-wrap gap-1.5">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${platformColor[idea.platform] || "bg-border text-secondary"}`}>
                {idea.platform}
              </span>
              <Badge variant="default" size="xs">{idea.format}</Badge>
              <Badge variant={contentTypeVariant[idea.contentType] || "default"} size="xs">
                {idea.contentType.charAt(0).toUpperCase() + idea.contentType.slice(1)}
              </Badge>
            </div>

            <h3 className="font-display font-bold text-primary text-sm leading-snug">
              {idea.title}
            </h3>

            <p className="text-xs text-secondary">{idea.angle}</p>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted">Trend:</span>
              <span className="text-xs text-signal">{idea.trendConnection}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted">Audience:</span>
              <span className="text-xs text-secondary">{idea.audienceTarget}</span>
            </div>

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
              <Badge variant="glow" size="xs">{idea.estimatedReach}</Badge>
              <Button variant="ghost" size="sm">
                <Lightbulb className="w-3.5 h-3.5" />
                Develop Idea
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Content Calendar Preview */}
      <Card className="p-6 relative overflow-hidden">
        <h2 className="font-display text-xl font-semibold mb-1">Content Calendar Preview</h2>
        <p className="text-sm text-secondary mb-4">Weekly content planning grid</p>
        <div className="grid grid-cols-7 gap-2">
          {calendarSlots.map((slot) => (
            <div key={slot.day} className="rounded-lg bg-surface border border-border p-2 text-center">
              <p className="text-xs text-muted mb-1">{slot.day}</p>
              <p className="text-[10px] font-medium text-signal">{slot.platform}</p>
              <p className="text-[10px] text-secondary">{slot.type}</p>
            </div>
          ))}
        </div>
        {/* Coming Soon Overlay */}
        <div className="absolute inset-0 bg-void/70 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
          <div className="text-center">
            <Badge variant="pulse" size="md">Coming Soon</Badge>
            <p className="text-sm text-secondary mt-2">Full calendar planning with scheduling</p>
          </div>
        </div>
      </Card>

      {/* Trend → Content Generator */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-signal" />
          <h2 className="font-display text-xl font-semibold">Trend → Content Generator</h2>
        </div>
        <p className="text-sm text-secondary mb-5">Select a trend and generate content concepts</p>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-6">
          <div className="relative">
            <select
              value={selectedTrend}
              onChange={(e) => setSelectedTrend(e.target.value)}
              className="appearance-none bg-panel border border-border text-primary text-sm rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-signal/50 cursor-pointer"
            >
              {demoTrends.map((t) => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          </div>
          <Button variant="primary" onClick={handleGenerate} disabled={generating}>
            {generating ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-void border-t-transparent rounded-full animate-spin" />
                Generating…
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Ideas
              </>
            )}
          </Button>
        </div>

        {generatedIdeas && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {generatedIdeas.map((idea, i) => (
              <div key={i} className="rounded-lg bg-surface border border-signal/20 p-4">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${platformColor[idea.platform] || "bg-border text-secondary"}`}>
                    {idea.platform}
                  </span>
                  <Badge variant="default" size="xs">{idea.format}</Badge>
                </div>
                <h4 className="font-display font-bold text-sm text-primary mb-1">{idea.title}</h4>
                <p className="text-xs text-secondary">{idea.angle}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

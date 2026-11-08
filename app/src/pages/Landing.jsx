import { useState } from "react";
import { Link } from "react-router";
import { Badge } from "../components/ui/Badge.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { demoTrends } from "../lib/demoData.js";
import { pb } from "../lib/pb.js";
import TrendingUp from "icon:trending-up";
import Zap from "icon:zap";
import Globe from "icon:globe";
import Target from "icon:target";
import Users from "icon:users";
import FileText from "icon:file-text";
import Search from "icon:search";
import BarChart2 from "icon:bar-chart-2";
import ArrowRight from "icon:arrow-right";
import CheckCircle from "icon:check-circle";
import Sparkles from "icon:sparkles";
import Layers from "icon:layers";

// ─── Signal Flow Animation ───────────────────────────────────────────────────
function SignalFlow() {
  const steps = ["SOCIAL", "SIGNAL", "PRODUCT", "CONTENT", "GROWTH"];
  return (
    <div className="relative w-full max-w-3xl mx-auto mt-16 px-4">
      <div className="flex items-center justify-between gap-0">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full bg-signal animate-pulse-slow"
                style={{ animationDelay: `${i * 0.4}s` }}
              />
              <span
                className="font-mono text-[10px] text-signal tracking-widest whitespace-nowrap"
                style={{ animationDelay: `${i * 0.4}s` }}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 mx-1 h-px relative overflow-hidden bg-border/50">
                <div
                  className="absolute inset-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, #00D4FF, transparent)`,
                    animation: `signalFlow 2s ease-in-out infinite`,
                    animationDelay: `${i * 0.4}s`,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes signalFlow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}

// ─── Intelligence Chain ──────────────────────────────────────────────────────
const chainSteps = [
  { icon: Globe, label: "Social Signal", desc: "We monitor TikTok, Reddit, Instagram, YouTube & more in real time." },
  { icon: Search, label: "Problem Discovery", desc: "AI surfaces repeating pain points and unmet needs from the noise." },
  { icon: Zap, label: "Need Validation", desc: "Volume, sentiment, and momentum confirm the opportunity is real." },
  { icon: Target, label: "Product Idea", desc: "Positioning frameworks turn validated needs into product concepts." },
  { icon: Users, label: "Audience Map", desc: "Psychographic profiles pinpoint exactly who to reach and where." },
  { icon: FileText, label: "Content Strategy", desc: "AI-generated content ideas tuned for each platform and persona." },
  { icon: TrendingUp, label: "Launch Ready", desc: "A full intelligence brief — ready to pitch, build, or publish." },
];

// ─── Features ────────────────────────────────────────────────────────────────
const features = [
  {
    icon: Globe,
    title: "Social-to-Product Intelligence",
    desc: "Transform social conversations into validated product opportunities. Every complaint, wish, and viral moment becomes a signal for what to build next.",
    color: "text-signal",
  },
  {
    icon: Search,
    title: "AI & Social Discoverability",
    desc: "Score your brand's visibility in AI search engines and social discovery feeds. Know exactly where you're invisible — and how to fix it.",
    color: "text-pulse",
  },
  {
    icon: BarChart2,
    title: "Trend Radar",
    desc: "Spot emerging, accelerating, and saturating trends before your competitors do. Real-time velocity and momentum scores keep you ahead of the curve.",
    color: "text-glow",
  },
  {
    icon: Globe,
    title: "Global Trend Radar",
    desc: "Track cultural shifts across regions and verticals. Intelligence isn't local — neither is opportunity.",
    color: "text-amber",
  },
  {
    icon: Target,
    title: "Product Opportunity Engine",
    desc: "Confidence scores, competition ratings, and audience fit analysis for every opportunity we surface — so you invest in what's worth building.",
    color: "text-signal",
  },
  {
    icon: Sparkles,
    title: "Content Intelligence Lab",
    desc: "Platform-native content ideas drawn straight from what's actually working right now. Stop guessing — start publishing with purpose.",
    color: "text-pulse",
  },
];

// ─── Stats ───────────────────────────────────────────────────────────────────
const stats = [
  { value: "10+", label: "Signal Sources" },
  { value: "24/7", label: "Monitoring" },
  { value: "Real-Time", label: "Analysis" },
  { value: "AI-Powered", label: "Insights" },
];

// ─── Services ────────────────────────────────────────────────────────────────
const services = [
  "Marketing Strategy",
  "Social Media",
  "Branding",
  "Content Creation",
  "SEO",
  "Events",
  "AI Discoverability",
  "Product Research",
];

// ─── Lead Form ────────────────────────────────────────────────────────────────
function LeadForm() {
  const [form, setForm] = useState({
    name: "", company: "", email: "", industry: "",
    website: "", challenge: "", desired_service: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    try {
      await pb.collection("leads").create(form);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <CheckCircle className="w-14 h-14 text-glow" />
        <h3 className="font-display text-2xl text-primary">Request received.</h3>
        <p className="text-secondary max-w-sm">Your request is saved — we'll be in touch soon with a tailored intelligence brief.</p>
      </div>
    );
  }

  const inputCls = "w-full bg-void border border-border rounded-lg px-4 py-2.5 text-primary text-sm font-body placeholder:text-muted focus:outline-none focus:border-signal transition-colors";
  const labelCls = "block text-xs font-body text-secondary mb-1.5 tracking-wide uppercase";

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div>
        <label className={labelCls}>Your Name *</label>
        <input required className={inputCls} placeholder="Jane Smith" value={form.name} onChange={set("name")} />
      </div>
      <div>
        <label className={labelCls}>Company</label>
        <input className={inputCls} placeholder="Acme Inc." value={form.company} onChange={set("company")} />
      </div>
      <div>
        <label className={labelCls}>Email *</label>
        <input required type="email" className={inputCls} placeholder="jane@acme.com" value={form.email} onChange={set("email")} />
      </div>
      <div>
        <label className={labelCls}>Industry</label>
        <select className={inputCls} value={form.industry} onChange={set("industry")}>
          <option value="">Select industry</option>
          <option>Wellness & Health</option>
          <option>Beauty & Skincare</option>
          <option>Food & Beverage</option>
          <option>Fashion & Apparel</option>
          <option>Technology</option>
          <option>Finance</option>
          <option>E-commerce</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>Website</label>
        <input className={inputCls} placeholder="https://yourbrand.com" value={form.website} onChange={set("website")} />
      </div>
      <div>
        <label className={labelCls}>Desired Service</label>
        <select className={inputCls} value={form.desired_service} onChange={set("desired_service")}>
          <option value="">Select a service</option>
          {services.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className={labelCls}>Your Biggest Challenge</label>
        <textarea
          className={inputCls + " resize-none"}
          rows={4}
          placeholder="Tell us what you're trying to solve — the more specific, the better."
          value={form.challenge}
          onChange={set("challenge")}
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" variant="primary" size="lg" disabled={status === "loading"} className="w-full justify-center">
          {status === "loading" ? "Sending…" : "Request Intelligence Report →"}
        </Button>
        {status === "error" && (
          <p className="text-hot text-sm mt-2 text-center">Something went wrong. Please try again.</p>
        )}
      </div>
    </form>
  );
}

// ─── Trend status → badge variant ────────────────────────────────────────────
function trendBadge(status) {
  const map = { emerging: "emerging", accelerating: "accelerating", mainstream: "mainstream", saturated: "saturated", declining: "declining" };
  return map[status] || "default";
}

// ─── MAIN LANDING PAGE ───────────────────────────────────────────────────────
export default function Landing() {
  const previewTrends = demoTrends.slice(0, 4);

  return (
    <div className="bg-void text-primary font-body">

      {/* ── 1. HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-24">
        {/* Grid background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        {/* Radial glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-signal/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-pulse/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-signal/20 bg-signal/5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse-slow" />
            <span className="font-mono text-[11px] text-signal tracking-widest">MARKETING INTELLIGENCE PLATFORM</span>
            <span className="w-1.5 h-1.5 rounded-full bg-pulse animate-pulse-slow" style={{ animationDelay: "0.5s" }} />
          </div>

          {/* H1 */}
          <h1 className="font-display leading-none mb-6">
            <span className="block text-6xl sm:text-7xl lg:text-8xl text-primary animate-fade-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
              See the signal.
            </span>
            <span className="block text-6xl sm:text-7xl lg:text-8xl text-signal animate-fade-up" style={{ animationDelay: "0.25s", opacity: 0 }}>
              Find the opportunity.
            </span>
            <span className="block text-6xl sm:text-7xl lg:text-8xl text-secondary animate-fade-up" style={{ animationDelay: "0.4s", opacity: 0 }}>
              Build what's next.
            </span>
          </h1>

          {/* Sub */}
          <p className="text-secondary text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: "0.55s", opacity: 0 }}>
            GloryUs Intelligence turns the noise of social media, cultural trends, and consumer behavior into clear, actionable product and content opportunities.
            We give brands the intelligence they need to move first — and move with confidence.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.7s", opacity: 0 }}>
            <Link to="/dashboard">
              <Button variant="primary" size="lg">Start Intelligence Free</Button>
            </Link>
            <Button variant="ghost" size="lg" className="border border-border hover:border-signal/30">
              See How It Works
            </Button>
          </div>

          {/* Signal flow */}
          <SignalFlow />
        </div>
      </section>

      {/* ── 2. SIGNAL FLOW CHAIN ── */}
      <section className="bg-surface py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="signal" size="md">The Intelligence Chain</Badge>
            <h2 className="font-display text-3xl sm:text-4xl text-primary mt-4 mb-3">From scroll to strategy in seconds</h2>
            <p className="text-secondary max-w-xl mx-auto">Every step in our intelligence engine — from raw social data to a launch-ready brief.</p>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-7 md:overflow-visible">
            {chainSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="snap-start shrink-0 w-40 md:w-auto flex flex-col items-center text-center gap-3 relative">
                  {i < chainSteps.length - 1 && (
                    <div className="hidden md:block absolute left-full top-5 w-full h-px bg-border z-0" style={{ width: "calc(100% - 2.5rem)", left: "calc(50% + 1.25rem)" }} />
                  )}
                  <div className="relative z-10 w-10 h-10 rounded-full bg-signal/10 border border-signal/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-signal" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-muted mb-1 tracking-wider">{String(i + 1).padStart(2, "0")}</p>
                    <p className="font-display text-sm text-primary mb-1">{step.label}</p>
                    <p className="text-xs text-secondary leading-snug">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. FEATURES GRID ── */}
      <section className="bg-void py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="pulse" size="md">Platform Capabilities</Badge>
            <h2 className="font-display text-3xl sm:text-4xl text-primary mt-4 mb-3">Intelligence across every dimension</h2>
            <p className="text-secondary max-w-xl mx-auto">Six interconnected modules that turn raw data into competitive advantage.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Card key={f.title} className="p-6 group hover:border-signal/30 transition-all duration-300 cursor-pointer" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center shrink-0 group-hover:bg-signal/10 transition-colors">
                      <Icon className={`w-5 h-5 ${f.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base text-primary mb-2">{f.title}</h3>
                      <p className="text-secondary text-sm leading-relaxed mb-3">{f.desc}</p>
                      <span className="inline-flex items-center gap-1 text-signal text-xs font-mono group-hover:gap-2 transition-all">
                        Explore <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. TREND PREVIEW ── */}
      <section className="bg-surface py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="glow" size="md">Live Intelligence</Badge>
            <h2 className="font-display text-3xl sm:text-4xl text-primary mt-4 mb-3">Intelligence In Motion</h2>
            <p className="text-secondary max-w-xl mx-auto">Live signals from across the digital landscape — updated continuously.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {previewTrends.map((t) => (
              <Card key={t.id} className="p-5 hover:border-signal/20 transition-all duration-300">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="font-display text-sm text-primary leading-tight">{t.name}</span>
                  <Badge variant={trendBadge(t.status)} size="xs">{t.status}</Badge>
                </div>
                <p className="text-xs text-muted mb-4 leading-relaxed">{t.signal}</p>
                {/* velocity bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted">VELOCITY</span>
                    <span className="font-mono text-[10px] text-signal">{t.velocity}</span>
                  </div>
                  <div className="h-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-signal rounded-full transition-all duration-700" style={{ width: `${t.velocity}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted">MOMENTUM</span>
                    <span className="font-mono text-[10px] text-pulse">{t.momentum}</span>
                  </div>
                  <div className="h-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-pulse rounded-full" style={{ width: `${t.momentum}%` }} />
                  </div>
                </div>
                <p className="text-xs text-muted mt-3 font-mono tracking-wide">{t.region}</p>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link to="/dashboard">
              <Button variant="outline" size="md">View All Trends <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. STATS ROW ── */}
      <section className="bg-void py-16 px-4 border-y border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl sm:text-5xl text-signal mb-2">{s.value}</p>
              <p className="text-secondary text-sm font-body">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. SERVICES LAYER ── */}
      <section className="bg-surface py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <Badge variant="amber" size="md">GloryUs Services</Badge>
          <h2 className="font-display text-3xl sm:text-4xl text-primary mt-4 mb-3">Turn Intelligence Into Action</h2>
          <p className="text-secondary max-w-xl mx-auto mb-10">
            Our platform gives you the signal. Our team helps you act on it — from strategy to execution.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {services.map((s) => (
              <div key={s} className="p-4 rounded-xl border border-border bg-panel/50 hover:border-signal/30 hover:bg-signal/5 transition-all duration-200 cursor-pointer group">
                <Layers className="w-5 h-5 text-signal mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm text-secondary group-hover:text-primary transition-colors font-body">{s}</p>
              </div>
            ))}
          </div>
          <Button variant="primary" size="lg" className="shadow-glow-signal">
            START A PROJECT <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* ── 7. LEAD FORM ── */}
      <section className="bg-void py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="signal" size="md">Intelligence Report</Badge>
            <h2 className="font-display text-3xl sm:text-4xl text-primary mt-4 mb-3">Request an Intelligence Report</h2>
            <p className="text-secondary max-w-xl mx-auto">
              Tell us about your brand and challenge. We'll build you a custom intelligence brief — trends, audiences, opportunities, and content — in your exact market.
            </p>
          </div>
          <Card className="p-8" glass>
            <LeadForm />
          </Card>
        </div>
      </section>

      {/* ── 8. FOOTER ── */}
      <footer className="bg-surface border-t border-border py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded bg-signal/20 flex items-center justify-center font-mono font-bold text-signal text-sm">GI</div>
                <span className="font-display text-sm tracking-widest text-primary uppercase">Gloryus Intelligence</span>
              </div>
              <p className="text-secondary text-sm leading-relaxed max-w-xs">
                Where social signals become product strategy. Built for brands that move on intelligence, not instinct.
              </p>
              <p className="font-mono text-[10px] text-muted mt-4 tracking-widest">
                SOCIAL → PRODUCT | AI → DISCOVERABILITY | TRENDS → OPPORTUNITY
              </p>
            </div>
            {/* Navigation */}
            <div>
              <h4 className="font-mono text-xs text-muted tracking-widest mb-4 uppercase">Platform</h4>
              <nav className="flex flex-col gap-2.5">
                {["Trend Radar", "Discoverability Analyzer", "Opportunity Engine", "Content Lab", "Dashboard", "Reports"].map((l) => (
                  <Link key={l} to="/dashboard" className="text-sm text-secondary hover:text-signal transition-colors">{l}</Link>
                ))}
              </nav>
            </div>
            {/* Contact */}
            <div>
              <h4 className="font-mono text-xs text-muted tracking-widest mb-4 uppercase">GloryUs LLC</h4>
              <div className="flex flex-col gap-2.5 text-sm text-secondary">
                <span>Marketing Intelligence</span>
                <span>Strategy & Execution</span>
                <a href="mailto:hello@gloryus.co" className="text-signal hover:underline">hello@gloryus.co</a>
                <a href="https://gloryus.co" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">gloryus.co</a>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-muted text-xs font-mono">© 2026 GloryUs LLC. All rights reserved.</p>
            <p className="text-muted text-xs font-mono">Intelligence Platform v1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

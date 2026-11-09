import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Database,
  Eye,
  EyeOff,
  FileText,
  LockKeyhole,
  LogOut,
  Radio,
  RefreshCw,
  Settings,
  ShieldCheck,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Badge } from "../components/ui/Badge.jsx";
import { Card } from "../components/ui/Card.jsx";
import { pb } from "../lib/pb.js";

const PAGE_SIZE = 50;

function StatCard({ icon: Icon, label, value, note, color = "signal" }) {
  const colorMap = {
    signal: "text-signal",
    pulse: "text-purple-400",
    glow: "text-emerald-400",
    amber: "text-amber-400",
  };

  return (
    <Card className="flex items-center gap-4 p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface">
        <Icon className={`h-5 w-5 ${colorMap[color] || "text-secondary"}`} />
      </div>
      <div className="min-w-0">
        <p className="truncate font-display text-2xl font-bold text-primary">{value}</p>
        <p className="text-xs text-muted">{label}</p>
        {note && <p className="mt-1 text-[11px] text-secondary">{note}</p>}
      </div>
    </Card>
  );
}

function StatusRow({ icon: Icon, title, detail, status, tone = "neutral" }) {
  const toneClasses = {
    good: "border-glow/30 bg-glow/5 text-glow",
    warning: "border-amber-500/30 bg-amber-500/5 text-amber-400",
    neutral: "border-border bg-surface text-secondary",
  };

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-surface/70 p-4">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${toneClasses[tone]}`} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-primary">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-secondary">{detail}</p>
      </div>
      <Badge variant={tone === "good" ? "signal" : "default"} size="xs">{status}</Badge>
    </div>
  );
}

function Breakdown({ title, description, items, emptyMessage }) {
  const maxValue = Math.max(1, ...items.map((item) => item.count));

  return (
    <Card className="p-5">
      <h3 className="font-display font-semibold text-primary">{title}</h3>
      <p className="mt-1 text-xs text-muted">{description}</p>
      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-secondary">{emptyMessage}</p>
      ) : (
        <div className="mt-5 space-y-4">
          {items.map((item) => (
            <div key={item.label}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                <span className="truncate text-secondary">{item.label}</span>
                <span className="shrink-0 font-mono text-primary">{item.count}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-signal transition-[width]"
                  style={{ width: `${(item.count / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function maskEmail(email) {
  if (!email || typeof email !== "string") return "—";
  const [name, domain] = email.split("@");
  if (!domain) return "••••••";
  return `${name.slice(0, 1)}•••@${domain}`;
}

function countBy(items, field) {
  const counts = new Map();
  items.forEach((item) => {
    const label = item[field]?.trim() || "Not specified";
    counts.set(label, (counts.get(label) || 0) + 1);
  });
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

export default function Admin() {
  const [leads, setLeads] = useState([]);
  const [totalLeads, setTotalLeads] = useState(null);
  const [leadsLoaded, setLeadsLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showEmails, setShowEmails] = useState(false);
  const [sessionActive, setSessionActive] = useState(() => pb.authStore.isValid);
  const [now] = useState(() => new Date());

  useEffect(() => {
    const controller = new AbortController();
    setLeadsLoaded(false);
    setLoadError("");

    pb.collection("leads")
      .getList(1, PAGE_SIZE, { sort: "-created", signal: controller.signal })
      .then((result) => {
        setLeads(result.items);
        setTotalLeads(result.totalItems);
        setLeadsLoaded(true);
      })
      .catch((error) => {
        if (error?.isAbort || controller.signal.aborted) return;
        console.error("Unable to load admin lead data", error);
        setLoadError("Lead data could not be loaded. Check your connection and collection access rules.");
        setLeadsLoaded(true);
      });

    return () => controller.abort();
  }, [refreshKey]);

  const analytics = useMemo(() => {
    const industry = countBy(leads, "industry");
    const services = countBy(leads, "desired_service");
    const recentCutoff = now.getTime() - 7 * 24 * 60 * 60 * 1000;
    const recentLeads = leads.filter((lead) => {
      const created = new Date(lead.created).getTime();
      return Number.isFinite(created) && created >= recentCutoff;
    }).length;

    return { industry, services, recentLeads };
  }, [leads, now]);

  const handleSignOut = () => {
    pb.authStore.clear();
    setSessionActive(false);
  };

  const secureTransport = typeof window !== "undefined" && window.location.protocol === "https:";

  return (
    <div className="mx-auto min-h-full max-w-6xl space-y-8 px-4 py-8 font-body text-primary md:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-signal">Workspace controls</p>
          <h1 className="font-display text-3xl font-bold text-primary">Admin</h1>
          <p className="mt-1 text-secondary">Security posture, lead analytics, and platform data.</p>
        </div>
        <button
          type="button"
          onClick={() => setRefreshKey((key) => key + 1)}
          disabled={!leadsLoaded}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-primary transition hover:border-signal/50 disabled:cursor-wait disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${!leadsLoaded ? "animate-spin" : ""}`} />
          Refresh data
        </button>
      </header>

      {loadError && (
        <div role="alert" className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <p>{loadError}</p>
        </div>
      )}

      <section aria-labelledby="overview-heading" className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-signal" />
          <h2 id="overview-heading" className="font-display text-xl font-semibold">At a glance</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Users} label="Total leads" value={leadsLoaded && totalLeads !== null ? totalLeads.toLocaleString() : "—"} note="All records reported by PocketBase" color="signal" />
          <StatCard icon={BarChart3} label="Analyzed records" value={leadsLoaded ? leads.length : "—"} note={`Latest ${PAGE_SIZE} records maximum`} color="pulse" />
          <StatCard icon={Radio} label="Leads · last 7 days" value={leadsLoaded ? analytics.recentLeads : "—"} note="Within the loaded sample" color="glow" />
          <StatCard icon={Database} label="Data source" value="PocketBase" note="Lead collection" color="amber" />
        </div>
      </section>

      <section aria-labelledby="analytics-heading" className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-signal" />
            <h2 id="analytics-heading" className="font-display text-xl font-semibold">Lead analytics</h2>
          </div>
          <p className="mt-1 text-xs text-muted">Aggregated from the latest {PAGE_SIZE} leads at most; no personal contact details are included.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Breakdown
            title="By industry"
            description="Most common industries in the loaded records"
            items={analytics.industry}
            emptyMessage={leadsLoaded ? "No industry data available yet." : "Loading analytics…"}
          />
          <Breakdown
            title="By requested service"
            description="Lead interest grouped by desired service"
            items={analytics.services}
            emptyMessage={leadsLoaded ? "No service data available yet." : "Loading analytics…"}
          />
        </div>
      </section>

      <section aria-labelledby="security-heading" className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-signal" />
            <h2 id="security-heading" className="font-display text-xl font-semibold">Security center</h2>
          </div>
          <p className="mt-1 text-xs text-muted">Client-visible checks only. They do not verify server configuration or replace access controls.</p>
        </div>
        <Card className="space-y-3 p-5">
          <StatusRow
            icon={sessionActive ? CheckCircle2 : ShieldAlert}
            title="PocketBase session"
            detail={sessionActive ? "A valid auth token is present in this browser session." : "No valid PocketBase auth session is detected in this browser."}
            status={sessionActive ? "Session active" : "Signed out"}
            tone={sessionActive ? "good" : "warning"}
          />
          <StatusRow
            icon={secureTransport ? LockKeyhole : AlertTriangle}
            title="Connection transport"
            detail={secureTransport ? "This page is being served over HTTPS." : "This page is not using HTTPS. Use HTTPS in production to protect traffic in transit."}
            status={secureTransport ? "HTTPS" : "Review"}
            tone={secureTransport ? "good" : "warning"}
          />
          <StatusRow
            icon={ShieldAlert}
            title="Admin authorization and MFA"
            detail="This page cannot verify server-side role checks, PocketBase collection rules, or multi-factor authentication. Configure and enforce these on the server before relying on admin access restrictions."
            status="Verify server-side"
            tone="warning"
          />
          <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-xs text-secondary">
              <EyeOff className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
              <p>Lead email addresses are masked by default in the table below.</p>
            </div>
            {sessionActive && (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-secondary transition hover:border-hot/50 hover:text-primary"
              >
                <LogOut className="h-4 w-4" />
                Sign out this browser
              </button>
            )}
          </div>
        </Card>
      </section>

      <section aria-labelledby="leads-heading" className="space-y-4">
        <Card className="p-5 md:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-signal" />
                <h2 id="leads-heading" className="font-display text-xl font-semibold">Recent leads</h2>
              </div>
              <p className="mt-1 text-xs text-muted">Showing up to {PAGE_SIZE} most recent records.</p>
            </div>
            <div className="flex items-center gap-3">
              {leadsLoaded && totalLeads !== null && <Badge variant="signal" size="sm">{totalLeads.toLocaleString()} total</Badge>}
              <button
                type="button"
                onClick={() => setShowEmails((shown) => !shown)}
                aria-pressed={showEmails}
                className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs text-secondary transition hover:text-primary"
              >
                {showEmails ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showEmails ? "Mask emails" : "Reveal emails"}
              </button>
            </div>
          </div>

          {!leadsLoaded ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-secondary" role="status">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-signal border-t-transparent" />
              Loading leads…
            </div>
          ) : leads.length === 0 ? (
            <div className="py-10 text-center">
              <Users className="mx-auto mb-3 h-10 w-10 text-muted" />
              <p className="font-medium text-secondary">No leads to display.</p>
              {!loadError && <p className="mt-1 text-sm text-muted">Leads will appear here after visitors submit the contact form.</p>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Name", "Company", "Email", "Industry", "Service", "Date"].map((heading) => (
                      <th key={heading} scope="col" className="whitespace-nowrap pb-2 pr-4 text-xs font-medium uppercase tracking-wide text-muted">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="transition-colors hover:bg-surface/50">
                      <td className="whitespace-nowrap py-3 pr-4 font-medium text-primary">{lead.name || "—"}</td>
                      <td className="whitespace-nowrap py-3 pr-4 text-secondary">{lead.company || "—"}</td>
                      <td className="whitespace-nowrap py-3 pr-4 text-secondary">{showEmails ? lead.email || "—" : maskEmail(lead.email)}</td>
                      <td className="whitespace-nowrap py-3 pr-4 text-secondary">{lead.industry || "—"}</td>
                      <td className="whitespace-nowrap py-3 pr-4"><Badge variant="signal" size="xs">{lead.desired_service || "General"}</Badge></td>
                      <td className="whitespace-nowrap py-3 pr-4 text-xs text-muted">{lead.created ? new Date(lead.created).toLocaleDateString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>

      <section aria-labelledby="data-heading" className="space-y-4">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-signal" />
          <h2 id="data-heading" className="font-display text-xl font-semibold">Data and platform</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface"><Database className="h-4 w-4 text-signal" /></div>
              <div>
                <h3 className="text-sm font-semibold text-primary">Lead collection</h3>
                <p className="text-xs text-muted">PocketBase · leads</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
              <span className="text-secondary">Records</span>
              <span className="font-mono text-primary">{leadsLoaded && totalLeads !== null ? totalLeads.toLocaleString() : "—"}</span>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface"><Settings className="h-4 w-4 text-muted" /></div>
              <div>
                <h3 className="text-sm font-semibold text-primary">Platform settings</h3>
                <p className="text-xs text-muted">Additional integrations are not configured here.</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-xs text-secondary">
              <FileText className="h-4 w-4 text-muted" />
              <span>Reports, signals, and sessions are not backed by live analytics in this admin view.</span>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

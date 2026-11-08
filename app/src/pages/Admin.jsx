import { useState, useEffect } from "react";
import Users from "icon:users";
import Activity from "icon:activity";
import FileText from "icon:file-text";
import Radio from "icon:radio";
import CheckCircle from "icon:check-circle";
import Database from "icon:database";
import Settings from "icon:settings";
import { Badge } from "../components/ui/Badge.jsx";
import { Card } from "../components/ui/Card.jsx";
import { pb } from "../lib/pb.js";

function StatCard({ icon: Icon, label, value, color }) {
  const colorMap = {
    signal: "text-signal",
    pulse: "text-purple-400",
    glow: "text-emerald-400",
    amber: "text-amber-400",
  };
  return (
    <Card className="p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-surface border border-border`}>
        <Icon className={`w-5 h-5 ${colorMap[color] || "text-secondary"}`} />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-primary">{value}</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </Card>
  );
}

function StatusDot({ active = true }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${active ? "bg-glow animate-pulse" : "bg-border"}`}
    />
  );
}

const settingPlaceholders = [
  { icon: Settings, label: "API Connections", desc: "Connect data sources and third-party APIs" },
  { icon: Database, label: "Data Sources", desc: "Manage your intelligence feed configuration" },
  { icon: Radio, label: "Notification Settings", desc: "Configure alerts for signals and reports" },
  { icon: Users, label: "Team Management", desc: "Invite team members and manage permissions" },
];

export default function Admin() {
  const [leads, setLeads] = useState([]);
  const [leadsLoaded, setLeadsLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    pb.collection("leads")
      .getList(1, 50, { sort: "-created", signal: controller.signal })
      .then((result) => {
        setLeads(result.items);
        setLeadsLoaded(true);
      })
      .catch((err) => {
        if (!err?.isAbort) console.error(err);
        setLeadsLoaded(true);
      });
    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen bg-void text-primary font-body px-4 py-8 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-primary">Admin</h1>
        <p className="text-secondary mt-1">Platform management and configuration</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Leads" value={leadsLoaded ? leads.length : "—"} color="signal" />
        <StatCard icon={Activity} label="Active Sessions" value="3" color="glow" />
        <StatCard icon={FileText} label="Reports Generated" value="12" color="pulse" />
        <StatCard icon={Radio} label="Signals Tracked" value="847" color="amber" />
      </div>

      {/* System Status */}
      <Card className="p-6">
        <h2 className="font-display text-xl font-semibold mb-4">System Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Data Layer", status: "Demo Active" },
            { label: "AI Layer", status: "Ready" },
            { label: "Signal Tracking", status: "Active" },
            { label: "Reporting Engine", status: "Active" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-3">
              <StatusDot />
              <div>
                <p className="text-sm font-medium text-primary">{s.label}</p>
                <p className="text-xs text-muted">{s.status}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Leads */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">Recent Leads</h2>
          {leadsLoaded && leads.length > 0 && (
            <Badge variant="signal" size="sm">{leads.length} total</Badge>
          )}
        </div>

        {!leadsLoaded ? (
          <div className="flex items-center gap-2 py-6 justify-center text-secondary text-sm">
            <span className="w-4 h-4 border-2 border-signal border-t-transparent rounded-full animate-spin" />
            Loading leads…
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-10">
            <Users className="w-10 h-10 text-muted mx-auto mb-3" />
            <p className="text-secondary font-medium">No leads yet — share your landing page!</p>
            <p className="text-muted text-sm mt-1">Leads will appear here once visitors submit the contact form</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Name", "Company", "Email", "Industry", "Service", "Date"].map((h) => (
                    <th key={h} className="text-left text-xs text-muted font-medium uppercase tracking-wide pb-2 pr-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-2.5 pr-4 text-primary font-medium">{lead.name || "—"}</td>
                    <td className="py-2.5 pr-4 text-secondary">{lead.company || "—"}</td>
                    <td className="py-2.5 pr-4 text-secondary">{lead.email || "—"}</td>
                    <td className="py-2.5 pr-4 text-secondary">{lead.industry || "—"}</td>
                    <td className="py-2.5 pr-4">
                      <Badge variant="signal" size="xs">{lead.desired_service || "General"}</Badge>
                    </td>
                    <td className="py-2.5 pr-4 text-muted text-xs">
                      {lead.created ? new Date(lead.created).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Data Management */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-signal" />
          <h2 className="font-display text-xl font-semibold">Collection Overview</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Collection", "Type", "Records"].map((h) => (
                <th key={h} className="text-left text-xs text-muted font-medium uppercase tracking-wide pb-2 pr-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="py-3 pr-4 font-medium text-primary font-mono text-xs">leads</td>
              <td className="py-3 pr-4 text-secondary">Base</td>
              <td className="py-3 pr-4">
                <Badge variant="signal" size="xs">{leadsLoaded ? leads.length : "—"} records</Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </Card>

      {/* Platform Settings */}
      <div>
        <h2 className="font-display text-xl font-semibold mb-4">Platform Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settingPlaceholders.map((s) => (
            <Card key={s.label} className="p-5 flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0">
                <s.icon className="w-4 h-4 text-muted" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-sm text-primary">{s.label}</h3>
                  <Badge variant="default" size="xs">Coming Soon</Badge>
                </div>
                <p className="text-xs text-muted mt-0.5">{s.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

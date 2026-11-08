import { NavLink } from "react-router";
import { useState } from "react";
import LayoutDashboard from "icon:layout-dashboard";
import TrendingUp from "icon:trending-up";
import Globe from "icon:globe";
import Zap from "icon:zap";
import Target from "icon:target";
import Search from "icon:search";
import Users from "icon:users";
import Shield from "icon:shield";
import Lightbulb from "icon:lightbulb";
import Bot from "icon:bot";
import Shuffle from "icon:shuffle";
import FileText from "icon:file-text";
import Settings from "icon:settings";
import ChevronLeft from "icon:chevron-left";
import ChevronRight from "icon:chevron-right";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Trends", to: "/trends", icon: TrendingUp },
  { label: "Trend Radar", to: "/trend-radar", icon: Globe },
  { label: "Social Intelligence", to: "/social-intelligence", icon: Zap },
  { label: "Opportunities", to: "/opportunities", icon: Target },
  { label: "AI Discoverability", to: "/ai-discoverability", icon: Search },
  { label: "Audiences", to: "/audiences", icon: Users },
  { label: "Competitors", to: "/competitors", icon: Shield },
  { label: "Content Lab", to: "/content-lab", icon: Lightbulb },
  { label: "AI Assistant", to: "/assistant", icon: Bot },
  { label: "Scenarios", to: "/scenarios", icon: Shuffle },
  { label: "Reports", to: "/reports", icon: FileText },
  { label: "Admin", to: "/admin", icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="hidden md:flex flex-col h-screen bg-surface border-r border-border shrink-0 transition-all duration-300 relative"
      style={{ width: collapsed ? "60px" : "220px" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 h-14 border-b border-border overflow-hidden">
        <div className="flex items-center justify-center w-8 h-8 rounded bg-signal/20 text-signal font-mono font-bold text-sm shrink-0">
          GI
        </div>
        {!collapsed && (
          <span className="font-display text-xs font-bold text-primary tracking-widest uppercase whitespace-nowrap">
            Gloryus Intelligence
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-0.5 px-2">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded px-2 py-2 text-sm transition-colors duration-150 group relative",
                isActive
                  ? "bg-signal/10 text-signal border-l-2 border-signal"
                  : "text-secondary hover:text-primary hover:bg-border/50 border-l-2 border-transparent",
              ].join(" ")
            }
          >
            <Icon size={17} className="shrink-0" />
            {!collapsed && (
              <span className="truncate font-body">{label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border p-2">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex items-center justify-center w-full py-2 rounded text-secondary hover:text-primary hover:bg-border/50 transition-colors duration-150"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}

import { useState } from "react";
import { NavLink } from "react-router";
import LayoutDashboard from "icon:layout-dashboard";
import TrendingUp from "icon:trending-up";
import Target from "icon:target";
import Bot from "icon:bot";
import MoreHorizontal from "icon:more-horizontal";
import Globe from "icon:globe";
import Zap from "icon:zap";
import Search from "icon:search";
import Users from "icon:users";
import Shield from "icon:shield";
import Lightbulb from "icon:lightbulb";
import Shuffle from "icon:shuffle";
import FileText from "icon:file-text";
import Settings from "icon:settings";
import X from "icon:x";

const mainTabs = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Trends", to: "/trends", icon: TrendingUp },
  { label: "Opportunities", to: "/opportunities", icon: Target },
  { label: "Assistant", to: "/assistant", icon: Bot },
];

const allNavItems = [
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

export default function MobileNav() {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {/* More sheet overlay */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMoreOpen(false)}
        />
      )}

      {/* More sheet */}
      <div
        className={[
          "fixed bottom-16 left-0 right-0 z-50 bg-surface border-t border-border rounded-t-2xl transition-transform duration-300 md:hidden",
          moreOpen ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="font-display text-sm font-semibold text-primary">All Sections</span>
          <button
            onClick={() => setMoreOpen(false)}
            className="text-secondary hover:text-primary transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="p-3 grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
          {allNavItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMoreOpen(false)}
              className={({ isActive }) =>
                [
                  "flex flex-col items-center gap-1.5 p-3 rounded-lg text-center transition-colors duration-150",
                  isActive
                    ? "bg-signal/10 text-signal"
                    : "text-secondary hover:text-primary hover:bg-border/50",
                ].join(" ")
              }
            >
              <Icon size={20} />
              <span className="text-[10px] font-body leading-tight">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex bg-surface/95 backdrop-blur border-t border-border md:hidden">
        {mainTabs.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors duration-150",
                isActive ? "text-signal" : "text-muted hover:text-secondary",
              ].join(" ")
            }
          >
            <Icon size={20} />
            <span className="text-[10px] font-body">{label}</span>
          </NavLink>
        ))}

        {/* More tab */}
        <button
          onClick={() => setMoreOpen((v) => !v)}
          className={[
            "flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors duration-150",
            moreOpen ? "text-signal" : "text-muted hover:text-secondary",
          ].join(" ")}
          aria-label="More navigation"
        >
          <MoreHorizontal size={20} />
          <span className="text-[10px] font-body">More</span>
        </button>
      </nav>
    </>
  );
}

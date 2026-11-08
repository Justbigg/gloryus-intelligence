import Search from "icon:search";
import Bell from "icon:bell";
import User from "icon:user";

export default function TopBar({ title, subtitle, actions }) {
  return (
    <header className="flex items-center justify-between h-14 px-4 bg-surface/80 backdrop-blur border-b border-border shrink-0">
      {/* Left: title + subtitle */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-primary leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-secondary leading-tight">{subtitle}</p>
          )}
        </div>
        <span className="ml-2 inline-flex items-center rounded px-2 py-0.5 text-[10px] font-mono font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 tracking-wider uppercase">
          Demo Data
        </span>
      </div>

      {/* Right: actions + icons */}
      <div className="flex items-center gap-2">
        {actions && <div className="flex items-center gap-2">{actions}</div>}

        {/* Search */}
        <button
          className="flex items-center justify-center w-8 h-8 rounded text-secondary hover:text-primary hover:bg-border/50 transition-colors duration-150"
          aria-label="Search"
        >
          <Search size={16} />
        </button>

        {/* Notifications */}
        <button
          className="relative flex items-center justify-center w-8 h-8 rounded text-secondary hover:text-primary hover:bg-border/50 transition-colors duration-150"
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-signal" />
        </button>

        {/* User avatar */}
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full bg-signal/20 text-signal hover:bg-signal/30 transition-colors duration-150"
          aria-label="User account"
        >
          <User size={15} />
        </button>
      </div>
    </header>
  );
}

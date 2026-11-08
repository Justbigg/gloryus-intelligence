import { useState } from "react";
import { Outlet, Link, NavLink } from "react-router";
import Menu from "icon:menu";
import X from "icon:x";

const navLinks = [
  { label: "Platform", to: "/platform" },
  { label: "Solutions", to: "/solutions" },
  { label: "About", to: "/about" },
];

export default function LandingLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-void">
      {/* Top navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-void/95 backdrop-blur border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-signal/20 text-signal font-mono font-bold text-sm shrink-0 group-hover:bg-signal/30 transition-colors">
              GI
            </div>
            <span className="font-display text-xs font-bold text-primary tracking-widest uppercase hidden sm:block">
              Gloryus Intelligence
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    "text-sm font-body transition-colors duration-150",
                    isActive
                      ? "text-primary"
                      : "text-secondary hover:text-primary",
                  ].join(" ")
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-body text-secondary hover:text-primary transition-colors duration-150"
            >
              Sign In
            </Link>
            <Link
              to="/early-access"
              className="inline-flex items-center px-4 py-1.5 rounded border border-signal text-signal text-sm font-body font-medium hover:bg-signal/10 transition-colors duration-150"
            >
              Get Early Access
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-8 h-8 rounded text-secondary hover:text-primary transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile full-screen nav */}
      <div
        className={[
          "fixed inset-0 z-40 bg-void flex flex-col pt-14 md:hidden transition-transform duration-300",
          menuOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <nav className="flex flex-col p-6 gap-4">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                [
                  "text-xl font-display font-semibold transition-colors duration-150",
                  isActive ? "text-signal" : "text-secondary hover:text-primary",
                ].join(" ")
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="mt-4 flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="text-lg font-body text-secondary hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/early-access"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center justify-center px-6 py-3 rounded border border-signal text-signal text-base font-body font-medium hover:bg-signal/10 transition-colors duration-150"
            >
              Get Early Access
            </Link>
          </div>
        </nav>
      </div>

      {/* Page content */}
      <div className="pt-14">
        <Outlet />
      </div>
    </div>
  );
}

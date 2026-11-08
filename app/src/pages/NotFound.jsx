import { Link } from "react-router";
import Home from "icon:home";
import ArrowLeft from "icon:arrow-left";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-void text-primary font-body flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated signal lines */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {/* Horizontal scan line */}
        <div
          className="absolute left-0 right-0 h-px bg-signal/20"
          style={{
            top: "40%",
            animation: "scanLine 4s linear infinite",
          }}
        />
        <div
          className="absolute left-0 right-0 h-px bg-signal/10"
          style={{
            top: "60%",
            animation: "scanLine 6s linear infinite reverse",
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#00D4FF 1px, transparent 1px), linear-gradient(90deg, #00D4FF 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-signal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pulse/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative text-center max-w-md">
        {/* 404 */}
        <div className="mb-2">
          <span
            className="font-display font-black text-[120px] md:text-[160px] leading-none text-signal"
            style={{ textShadow: "0 0 40px rgba(0,212,255,0.4)" }}
          >
            404
          </span>
        </div>

        {/* Signal not found */}
        <div className="mb-2 flex items-center justify-center gap-2">
          <span className="flex-1 h-px bg-signal/20 max-w-[80px]" />
          <span className="text-xs font-mono text-signal uppercase tracking-widest">
            SIGNAL NOT FOUND
          </span>
          <span className="flex-1 h-px bg-signal/20 max-w-[80px]" />
        </div>

        <h1 className="font-display text-2xl font-bold text-primary mt-4 mb-2">
          Intelligence not available
        </h1>
        <p className="text-secondary text-sm mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on signal.
        </p>

        {/* Links */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-signal text-void font-semibold px-5 py-2.5 rounded-lg hover:bg-signal/90 transition-colors text-sm"
          >
            <Home className="w-4 h-4" />
            Return to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 border border-signal text-signal px-5 py-2.5 rounded-lg hover:bg-signal/10 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* Error code */}
        <p className="text-muted text-xs mt-8 font-mono">ERR_SIGNAL_NOT_FOUND · GLORYUS INTELLIGENCE</p>
      </div>

      <style>{`
        @keyframes scanLine {
          0% { transform: translateY(-20px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export function Badge({ children, variant = 'default', size = 'sm' }) {
  const variants = {
    default: 'bg-border text-secondary',
    signal: 'bg-signal/10 text-signal border border-signal/20',
    pulse: 'bg-pulse/10 text-purple-300 border border-pulse/20',
    glow: 'bg-glow/10 text-emerald-300 border border-glow/20',
    amber: 'bg-amber/10 text-amber-300 border border-amber/20',
    hot: 'bg-hot/10 text-red-300 border border-hot/20',
    emerging: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    accelerating: 'bg-signal/10 text-signal border border-signal/20',
    mainstream: 'bg-amber/10 text-amber-300 border border-amber/20',
    saturated: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    declining: 'bg-hot/10 text-red-400 border border-hot/20',
  };
  const sizes = { xs: 'px-1.5 py-0.5 text-[10px]', sm: 'px-2 py-0.5 text-xs', md: 'px-3 py-1 text-sm' };
  return (
    <span className={`inline-flex items-center rounded-full font-body font-medium ${variants[variant] || variants.default} ${sizes[size]}`}>
      {children}
    </span>
  );
}

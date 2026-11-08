export function Card({ children, className = '', glass = false, glow = false }) {
  return (
    <div className={`rounded-xl border border-border bg-panel ${glass ? 'backdrop-blur-sm bg-panel/80' : ''} ${glow ? 'shadow-glow-signal' : 'shadow-panel'} ${className}`}>
      {children}
    </div>
  );
}

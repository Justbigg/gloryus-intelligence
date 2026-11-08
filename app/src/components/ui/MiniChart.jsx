export function MiniBarChart({ data, color = '#00D4FF', height = 40 }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5" style={{ height }}>
      {data.map((val, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-xs transition-all duration-300"
          style={{
            height: `${(val / max) * 100}%`,
            backgroundColor: color,
            opacity: 0.4 + (val / max) * 0.6,
          }}
          title={val}
        />
      ))}
    </div>
  );
}

export function SparkLine({ data, color = '#00D4FF', width = 80, height = 32 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} aria-hidden="true">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RadarChart({ scores, labels, size = 160 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const n = scores.length;
  const angle = (i) => (i * 2 * Math.PI) / n - Math.PI / 2;
  const point = (i, radius) => ({
    x: cx + radius * Math.cos(angle(i)),
    y: cy + radius * Math.sin(angle(i)),
  });
  const gridPts = (radius) => Array.from({ length: n }, (_, i) => {
    const p = point(i, radius);
    return `${p.x},${p.y}`;
  }).join(' ');
  const dataPts = scores.map((s, i) => {
    const p = point(i, (s / 100) * r);
    return `${p.x},${p.y}`;
  }).join(' ');
  return (
    <svg width={size} height={size} aria-label="Radar chart">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={gridPts(r * f)} fill="none" stroke="#1E293B" strokeWidth="1" />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const p = point(i, r);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#1E293B" strokeWidth="1" />;
      })}
      <polygon points={dataPts} fill="#00D4FF" fillOpacity="0.15" stroke="#00D4FF" strokeWidth="1.5" />
      {scores.map((s, i) => {
        const p = point(i, (s / 100) * r);
        return <circle key={i} cx={p.x} cy={p.y} r="3" fill="#00D4FF" />;
      })}
      {labels && labels.map((lbl, i) => {
        const p = point(i, r + 14);
        return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fill="#94A3B8" fontSize="9" fontFamily="DM Sans">{lbl}</text>;
      })}
    </svg>
  );
}

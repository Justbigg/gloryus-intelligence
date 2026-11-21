// Vercel serverless proxy for the GDELT Cloud API v2 (https://gdeltcloud.com).
//
// Keeps GDELT_API_KEY on the server (set it in Vercel → Project → Settings →
// Environment Variables, and locally in .env.local for `vercel dev`).
// The browser never sees the key — it calls /api/gdelt?... instead.
//
// Usage:  /api/gdelt?path=events&limit=10&country=Nigeria&days=7
//   - `path`  — endpoint route under https://gdeltcloud.com/api/v2/
//               e.g. 'events', 'stories', 'entities', 'search'
//   - all other query params are forwarded to GDELT Cloud as-is
//     (see https://docs.gdeltcloud.com for the full parameter reference).
//
// Unlike BLS (optional key) or Census (bulletin-free), GDELT Cloud has no
// keyless mode: every call needs the Bearer token. Free accounts include 200
// one-time starter calls; key/private access pauses with 403 once they run out.

const GDELT_BASE = 'https://gdeltcloud.com/api/v2';

// Only allow endpoint route segments — blocks SSRF-style path tricks.
const SAFE_PATH = /^[a-zA-Z0-9/_-]+$/;

// Read-only data endpoints. Mutations (alerts, Monitors) are deliberately not
// proxied — the browser should never trigger side effects on the account.
const BLOCKED_PATH = /^(alerts|monitors|webhooks)\b/i;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET is proxied for GDELT Cloud' });
  }

  const { path, ...params } = req.query;

  if (!path) {
    return res.status(400).json({ error: "Missing 'path' param, e.g. path=events" });
  }
  if (!SAFE_PATH.test(path)) {
    return res.status(400).json({ error: 'Invalid path' });
  }
  if (BLOCKED_PATH.test(path)) {
    return res.status(403).json({ error: 'Mutating GDELT endpoints (monitors, alerts) are not proxied' });
  }

  const key = process.env.GDELT_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'GDELT_API_KEY is not configured on the server' });
  }

  const qs = new URLSearchParams(params);

  try {
    const upstream = await fetch(`${GDELT_BASE}/${path}?${qs.toString()}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    const body = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400');
    res.send(body);
  } catch {
    res.status(502).json({ error: 'GDELT Cloud request failed' });
  }
}

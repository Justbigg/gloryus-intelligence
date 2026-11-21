// Vercel serverless proxy for the US Census Bureau API.
//
// Keeps CENSUS_API_KEY on the server (set it in Vercel → Project → Settings →
// Environment Variables, and locally in .env.local for `vercel dev`).
// The browser never sees the key — it calls /api/census?... instead.
//
// Usage:  /api/census?path=2023/acs/acs5&get=NAME,B19013_001E&for=county:*
//   - `path`  — dataset route under https://api.census.gov/data/
//   - all other query params are forwarded to the Census API as-is.

const CENSUS_BASE = 'https://api.census.gov/data';

// Only allow dataset route segments — blocks SSRF-style path tricks.
const SAFE_PATH = /^[a-zA-Z0-9/_-]+$/;

export default async function handler(req, res) {
  const { path, ...params } = req.query;

  if (!path) {
    return res.status(400).json({ error: "Missing 'path' param, e.g. path=2023/acs/acs5" });
  }
  if (!SAFE_PATH.test(path)) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  const key = process.env.CENSUS_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'CENSUS_API_KEY is not configured on the server' });
  }

  const qs = new URLSearchParams(params);
  qs.set('key', key);

  try {
    const upstream = await fetch(`${CENSUS_BASE}/${path}?${qs.toString()}`);
    const body = await upstream.text();

    // Invalid/expired keys make the Census API answer HTTP 200 with an HTML
    // error page instead of JSON — surface that as a clean upstream error
    // rather than letting the client choke on `JSON.parse('<html>...')`.
    const contentType = upstream.headers.get('content-type') || '';
    if (!contentType.includes('json')) {
      return res.status(502).json({
        error: 'Census API returned a non-JSON response — check that CENSUS_API_KEY is valid',
      });
    }

    res.status(upstream.status);
    res.setHeader('Content-Type', contentType || 'application/json');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    res.send(body);
  } catch {
    res.status(502).json({ error: 'Census API request failed' });
  }
}

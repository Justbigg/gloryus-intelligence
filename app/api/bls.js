// Vercel serverless proxy for the US Bureau of Labor Statistics (BLS) API v2.
//
// Keeps BLS_API_KEY on the server (set it in Vercel → Project → Settings →
// Environment Variables, and locally in .env.local for `vercel dev`).
// The browser never sees the key — it calls /api/bls?... instead.
//
// Unlike the Census API (GET-only), BLS v2 takes a POST with a JSON body.
// This proxy accepts a simple GET for convenience:
//
// Usage:  /api/bls?seriesid=CUUR0000SA0,LNS14000000&startyear=2019&endyear=2024
//   - seriesid  — one BLS series ID or a comma-separated list (max ~25 with a
//                 key, ~1 without; see https://data.bls.gov/registrationEngine/)
//   - startyear / endyear — 3–10 year span (up to 20 years with a key)
//   - catalog / calculations / annualaverage — optional 'true'/'false' flags
//
// A JSON POST passthrough is also supported for anything the GET form can't
// express: POST /api/bls with the exact BLS v2 request body.

const BLS_BASE = 'https://api.bls.gov/publicAPI/v2/timeseries/data/';

// BLS v2 body fields we forward from query params (others can go via POST).
const NUMERIC_YEARS = /^(19|20)\d{2}$/;
const BOOLEAN_FLAGS = ['catalog', 'calculations', 'annualaverage'];
const MAX_SERIES = 25;

function buildBody({ seriesid, startyear, endyear, ...rest }) {
  const body = {};

  if (!seriesid) return { error: "Missing 'seriesid' param, e.g. seriesid=CUUR0000SA0" };
  const ids = String(seriesid).split(',').map((s) => s.trim()).filter(Boolean);
  if (ids.length === 0) return { error: "Missing 'seriesid' param, e.g. seriesid=CUUR0000SA0" };
  if (ids.length > MAX_SERIES) return { error: `Too many series IDs (max ${MAX_SERIES})` };
  if (ids.some((id) => !/^[A-Za-z0-9]{2,30}$/.test(id))) {
    return { error: 'Invalid series ID format' };
  }
  body.seriesid = ids;

  if (startyear !== undefined) {
    if (!NUMERIC_YEARS.test(startyear)) return { error: "Invalid 'startyear' (use e.g. 2019)" };
    body.startyear = Number(startyear);
  }
  if (endyear !== undefined) {
    if (!NUMERIC_YEARS.test(endyear)) return { error: "Invalid 'endyear' (use e.g. 2024)" };
    body.endyear = Number(endyear);
  }
  if (body.startyear && body.endyear && body.endyear < body.startyear) {
    return { error: "'endyear' is earlier than 'startyear'" };
  }

  for (const flag of BOOLEAN_FLAGS) {
    if (rest[flag] !== undefined) body[flag] = rest[flag] === 'true';
  }

  return { body };
}

export default async function handler(req, res) {
  const key = process.env.BLS_API_KEY; // optional: BLS works without it at lower limits

  let body;
  if (req.method === 'POST') {
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
    if (!body || !Array.isArray(body.seriesid) || body.seriesid.length === 0) {
      return res.status(400).json({ error: "Body must include a non-empty 'seriesid' array" });
    }
  } else {
    const built = buildBody(req.query);
    if (built.error) return res.status(400).json({ error: built.error });
    body = built.body;
  }

  if (key) body.registrationkey = key;

  try {
    const upstream = await fetch(BLS_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const payload = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    res.send(payload);
  } catch {
    res.status(502).json({ error: 'BLS API request failed' });
  }
}

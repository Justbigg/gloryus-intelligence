// Client-side helper for the GDELT Cloud API (https://gdeltcloud.com).
//
// Calls the serverless proxy at /api/gdelt (see app/api/gdelt.js), which
// injects the API key server-side so it never reaches the browser bundle.
//
// Endpoint docs: https://docs.gdeltcloud.com — six nouns (Article, Story,
// Event, Entity, Facility, Metric); read endpoints live under /api/v2/.

const DEFAULT_PATH = 'events';

/**
 * Fetch data from the GDELT Cloud API via the server proxy.
 *
 * @param {Object} params - GDELT Cloud query params, e.g.
 *   { limit: 10, country: 'Nigeria', days: 7, category: 'CONFLICT' }
 * @param {string} path - Endpoint route, e.g. 'events', 'stories', 'entities',
 *   'search' (unified entity lookup: q=, type=, limit=)
 * @returns {Promise<Object>} Raw response envelope: { success, data, pagination?, meta? }
 */
export async function fetchGdelt(params = {}, path = DEFAULT_PATH) {
  const qs = new URLSearchParams({ ...params, path });
  const res = await fetch(`/api/gdelt?${qs.toString()}`);

  if (!res.ok) {
    let message = `GDELT proxy error ${res.status}`;
    try {
      const body = await res.json();
      // Upstream errors follow { code, error, details } — e.g. the 403
      // PROGRAMMATIC_ACCESS_DENIED sent once free starter calls run out.
      if (body?.error) {
        message = body.code ? `${body.code}: ${body.error}` : body.error;
        if (body?.details?.pricing_url) message += ` (${body.details.pricing_url})`;
      }
    } catch {
      // non-JSON error body; keep the status-message fallback
    }
    throw new Error(message);
  }

  return res.json();
}

/**
 * Convenience wrapper that unwraps the envelope into the row array.
 *
 * @param {Object} params - Query params for the list endpoint
 * @param {string} path - Endpoint route, defaults to 'events'
 * @returns {Promise<Array>} The `data` array of records
 */
export async function fetchGdeltRows(params = {}, path = DEFAULT_PATH) {
  const body = await fetchGdelt(params, path);
  return body?.data || [];
}

// Client-side helper for the US Census Bureau API.
//
// Calls the serverless proxy at /api/census (see app/api/census.js), which
// injects the API key server-side so it never reaches the browser bundle.

const DEFAULT_PATH = '2023/acs/acs5'; // ACS 5-year estimates

/**
 * Fetch data from the Census API via the server proxy.
 *
 * @param {Object} params - Census API query params, e.g.
 *   { get: 'NAME,B19013_001E', for: 'county:*', in: 'state:37' }
 * @param {string} path - Dataset route, e.g. '2023/acs/acs5'
 * @returns {Promise<Array<string[]>>} Raw Census response (rows of values)
 */
export async function fetchCensus(params = {}, path = DEFAULT_PATH) {
  const qs = new URLSearchParams({ ...params, path });
  const res = await fetch(`/api/census?${qs.toString()}`);

  if (!res.ok) {
    let message = `Census proxy error ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // non-JSON error body; keep the status-message fallback
    }
    throw new Error(message);
  }

  return res.json();
}

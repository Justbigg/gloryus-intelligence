// Client-side helper for the US Bureau of Labor Statistics (BLS) API v2.
//
// Calls the serverless proxy at /api/bls (see app/api/bls.js), which
// injects the API key server-side so it never reaches the browser bundle.

const DEFAULT_END_YEAR = new Date().getFullYear() - 1;

/**
 * Fetch BLS time series data via the server proxy.
 *
 * The BLS API is POST-based, but this helper mirrors the Census helper's
 * plain-object ergonomics and turns the params into the proxy's GET form.
 *
 * @param {Object} params - Query params, e.g.
 *   { seriesid: 'CUUR0000SA0,LNS14000000', startyear: '2019', endyear: '2024' }
 *   `seriesid` accepts an array or a comma-separated string.
 * @returns {Promise<Object>} Raw BLS response: { status, responseTime, message,
 *   Results: { series: [{ seriesID, data: [{ year, period, value, ... }] }] } }
 */
export async function fetchBls(params = {}) {
  const { seriesid, ...rest } = params;
  const ids = Array.isArray(seriesid)
    ? seriesid.join(',')
    : String(seriesid ?? '').trim();

  const qs = new URLSearchParams({ seriesid: ids, ...rest });
  const res = await fetch(`/api/bls?${qs.toString()}`);

  if (!res.ok) {
    let message = `BLS proxy error ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // non-JSON error body; keep the status-message fallback
    }
    throw new Error(message);
  }

  const data = await res.json();
  // BLS returns HTTP 200 with a non-1 status field on business errors
  // (e.g. REQUEST_NOT_PROCESSED for too many series or a bad year range).
  if (data?.status && data.status !== 'REQUEST_SUCCEEDED') {
    const msg = Array.isArray(data.message) && data.message.length
      ? data.message.join('; ')
      : `BLS request failed with status ${data.status}`;
    throw new Error(msg);
  }

  return data;
}

/**
 * Convenience wrapper: returns raw observations, one array per requested series.
 *
 * @param {string[] | string} seriesIds - BLS series IDs, e.g. ['CUUR0000SA0']
 * @param {Object} [opts] - { startyear, endyear, catalog, calculations, annualaverage }
 * @returns {Promise<Array<{ seriesID: string, data: Array }>>}
 */
export async function fetchBlsSeries(seriesIds, opts = {}) {
  const data = await fetchBls({
    seriesid: seriesIds,
    endyear: DEFAULT_END_YEAR,
    ...opts,
  });
  return data?.Results?.series || [];
}

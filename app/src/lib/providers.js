import {
  demoTrends,
  demoSocialSignals,
  demoOpportunities,
  demoAudiences,
  demoCompetitors,
  demoContentIdeas,
  demoDiscoverabilityData,
  demoReports,
  demoQA,
} from './demoData.js';
import { fetchCensus } from './census.js';

// ─── Demo Provider ───────────────────────────────────────────────────────────
// Implements all data fetching using static demo data.
// Swap individual methods to real API calls when integrating live data sources.
export class DemoProvider {
  async getTrends({ category, status, region, sort } = {}) {
    let results = [...demoTrends];
    if (category) results = results.filter((t) => t.category === category);
    if (status) results = results.filter((t) => t.status === status);
    if (region) results = results.filter((t) => t.region.includes(region));
    if (sort === 'velocity') results.sort((a, b) => b.velocity - a.velocity);
    if (sort === 'momentum') results.sort((a, b) => b.momentum - a.momentum);
    if (sort === 'audienceInterest') results.sort((a, b) => b.audienceInterest - a.audienceInterest);
    return results;
  }

  async getTrend(id) {
    return demoTrends.find((t) => t.id === id) || null;
  }

  async getTrendCategories() {
    return [...new Set(demoTrends.map((t) => t.category))];
  }

  async getSocialSignals({ platform, sentiment, sort } = {}) {
    let results = [...demoSocialSignals];
    if (platform) results = results.filter((s) => s.platform === platform);
    if (sentiment) results = results.filter((s) => s.sentiment === sentiment);
    if (sort === 'engagement') results.sort((a, b) => b.engagementScore - a.engagementScore);
    if (sort === 'volume') results.sort((a, b) => b.volume - a.volume);
    return results;
  }

  async getSocialSignal(id) {
    return demoSocialSignals.find((s) => s.id === id) || null;
  }

  async getOpportunities({ status, competition, category } = {}) {
    let results = [...demoOpportunities];
    if (status) results = results.filter((o) => o.status === status);
    if (competition) results = results.filter((o) => o.competition === competition);
    if (category) results = results.filter((o) => o.productCategory === category);
    results.sort((a, b) => b.confidence - a.confidence);
    return results;
  }

  async getOpportunity(id) {
    return demoOpportunities.find((o) => o.id === id) || null;
  }

  async getAudiences() {
    return [...demoAudiences];
  }

  async getAudience(id) {
    return demoAudiences.find((a) => a.id === id) || null;
  }

  async getCompetitors({ strength } = {}) {
    let results = [...demoCompetitors];
    if (strength) results = results.filter((c) => c.strength === strength);
    return results;
  }

  async getCompetitor(id) {
    return demoCompetitors.find((c) => c.id === id) || null;
  }

  async getContentIdeas({ platform, contentType, format } = {}) {
    let results = [...demoContentIdeas];
    if (platform) results = results.filter((c) => c.platform === platform);
    if (contentType) results = results.filter((c) => c.contentType === contentType);
    if (format) results = results.filter((c) => c.format.toLowerCase().includes(format.toLowerCase()));
    return results;
  }

  async getContentIdea(id) {
    return demoContentIdeas.find((c) => c.id === id) || null;
  }

  async getDiscoverabilityData() {
    return { ...demoDiscoverabilityData };
  }

  async getReports({ type } = {}) {
    let results = [...demoReports];
    if (type) results = results.filter((r) => r.type === type);
    results.sort((a, b) => new Date(b.date) - new Date(a.date));
    return results;
  }

  async getReport(id) {
    return demoReports.find((r) => r.id === id) || null;
  }

  async getQA() {
    return [...demoQA];
  }

  async askQuestion(question) {
    // Find the closest matching Q&A by keyword overlap
    const q = question.toLowerCase();
    const scored = demoQA.map((qa) => {
      const words = qa.question.toLowerCase().split(/\W+/);
      const matches = words.filter((w) => w.length > 3 && q.includes(w)).length;
      return { qa, score: matches };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.qa || demoQA[0];
  }

  async search(query) {
    const q = query.toLowerCase();
    const results = [];

    demoTrends.forEach((t) => {
      if (t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)) {
        results.push({ type: 'trend', item: t });
      }
    });

    demoOpportunities.forEach((o) => {
      if (o.title.toLowerCase().includes(q) || o.opportunity.toLowerCase().includes(q)) {
        results.push({ type: 'opportunity', item: o });
      }
    });

    demoSocialSignals.forEach((s) => {
      if (s.keyword.toLowerCase().includes(q) || s.problem.toLowerCase().includes(q)) {
        results.push({ type: 'signal', item: s });
      }
    });

    return results.slice(0, 20);
  }
}

// ─── Trend Provider (stub) ───────────────────────────────────────────────────
// Replace with real trend API integration (e.g., Google Trends, Exploding Topics)
export class TrendProvider {
  async getTrends(options = {}) {
    throw new Error('TrendProvider: not yet integrated. Connect to Exploding Topics or Google Trends API.');
  }

  async getTrend(id) {
    throw new Error('TrendProvider: not yet integrated.');
  }
}

// ─── Social Provider (stub) ──────────────────────────────────────────────────
// Replace with real social listening API integration (e.g., Brandwatch, Sprout)
export class SocialProvider {
  async getSocialSignals(options = {}) {
    throw new Error('SocialProvider: not yet integrated. Connect to Brandwatch, Sprout Social, or native platform APIs.');
  }

  async getKeywordData(keyword) {
    throw new Error('SocialProvider: not yet integrated.');
  }
}

// ─── AI Provider (stub) ─────────────────────────────────────────────────────
// Replace with real AI API integration (e.g., OpenAI, Anthropic)
export class AIProvider {
  async askQuestion(question, context = {}) {
    throw new Error('AIProvider: not yet integrated. Connect to OpenAI or Anthropic API.');
  }

  async generateReport(data) {
    throw new Error('AIProvider: not yet integrated.');
  }

  async generateContentIdeas(brief) {
    throw new Error('AIProvider: not yet integrated.');
  }
}

// ─── Census Provider ─────────────────────────────────────────────────────────
// Live US Census Bureau demographics via the serverless proxy (app/api/census.js).
// The API key stays server-side; this module only calls /api/census.
// Falls back to static demo data when the proxy is unreachable (e.g. the
// CENSUS_API_KEY env var is not yet configured).

const DEMO_DEMOGRAPHIC_STATES = [
  { name: 'California', fips: '06', population: 38900000, medianIncome: 95500 },
  { name: 'Texas', fips: '48', population: 30500000, medianIncome: 75700 },
  { name: 'New York', fips: '36', population: 19600000, medianIncome: 81200 },
  { name: 'Florida', fips: '12', population: 22600000, medianIncome: 68800 },
  { name: 'Washington', fips: '53', population: 7800000, medianIncome: 90600 },
  { name: 'Colorado', fips: '08', population: 5870000, medianIncome: 87500 },
];

function classifyIncomeBand(income, median) {
  if (income >= median * 1.15) return 'High-income market';
  if (income <= median * 0.85) return 'Value-driven market';
  return 'Mid-market';
}

export class CensusProvider {
  #cache = null;

  /**
   * Top states by population with median household income.
   * @returns {Promise<{source: 'live'|'demo', states: Array, error?: string}>}
   */
  async getMarketDemographics() {
    if (this.#cache) return this.#cache;

    let result;
    try {
      const rows = await fetchCensus({
        get: 'NAME,B01003_001E,B19013_001E',
        for: 'state:*',
      });
      const [header, ...body] = rows;
      const idx = {
        name: header.indexOf('NAME'),
        population: header.indexOf('B01003_001E'),
        income: header.indexOf('B19013_001E'),
        fips: header.indexOf('state'),
      };
      // The Census API returns sentinel values (e.g. -666666666) for
      // suppressed estimates — treat non-positive numbers as missing.
      const states = body
        .map((row) => ({
          name: row[idx.name],
          fips: row[idx.fips],
          population: Number(row[idx.population]),
          medianIncome: Number(row[idx.income]) > 0 ? Number(row[idx.income]) : null,
        }))
        .filter((s) => s.population > 0 && s.medianIncome)
        .sort((a, b) => b.population - a.population)
        .slice(0, 10);

      const medianIncome =
        [...states].sort((a, b) => a.medianIncome - b.medianIncome)[
          Math.floor(states.length / 2)
        ]?.medianIncome || 0;
      const tagged = states.map((s) => ({
        ...s,
        incomeBand: classifyIncomeBand(s.medianIncome, medianIncome),
      }));

      result = { source: 'live', states: tagged };
    } catch (err) {
      result = { source: 'demo', error: err.message, states: DEMO_DEMOGRAPHIC_STATES };
    }

    this.#cache = result;
    return result;
  }
}

// ─── Active Provider ─────────────────────────────────────────────────────────
// Swap DemoProvider for real providers when integration is ready
export const dataProvider = new DemoProvider();

export const censusProvider = new CensusProvider();

// In-memory cache with TTL for Tavily search results
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const searchCache = new Map<string, CacheEntry<any>>();
const SEARCH_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getFromCache<T>(key: string): T | null {
  const entry = searchCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    searchCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setToCache<T>(key: string, data: T, ttlMs = SEARCH_CACHE_TTL_MS): void {
  searchCache.set(key, { data, expiry: Date.now() + ttlMs });
}

export interface SearchResultItem {
  title: string;
  url: string;
  content: string;
  score?: number;
}

export interface SearchResponse {
  query: string;
  results: SearchResultItem[];
  sources: { title: string; url: string }[];
}

/**
 * Execute web search strictly via Tavily Search API (no fallback)
 */
export async function executeTavilySearch(
  query: string,
  maxResults = 5,
  includeDomains?: string[]
): Promise<SearchResponse> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is not configured in server environment.");
  }

  const normalizedKey = `tavily:${query.trim().toLowerCase()}:${maxResults}:${(includeDomains || []).join(",")}`;
  const cached = getFromCache<SearchResponse>(normalizedKey);
  if (cached) return cached;

  const payload: Record<string, any> = {
    api_key: apiKey,
    query: query.trim(),
    search_depth: "basic",
    max_results: Math.min(maxResults, 8),
    include_answer: false,
  };

  if (includeDomains && includeDomains.length > 0) {
    payload.include_domains = includeDomains;
  }

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Tavily Search API failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const rawResults = data.results || [];

  const results: SearchResultItem[] = rawResults.map((r: any) => ({
    title: r.title || "Web Result",
    url: r.url,
    content: (r.content || "").slice(0, 1000),
    score: r.score,
  }));

  const sources = results.map((r) => ({
    title: r.title,
    url: r.url,
  }));

  const response: SearchResponse = {
    query,
    results,
    sources,
  };

  setToCache(normalizedKey, response);
  return response;
}

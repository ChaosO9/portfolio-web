// In-memory cache with TTL for GitHub API responses
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setToCache<T>(key: string, data: T, ttlMs = CACHE_TTL_MS): void {
  cache.set(key, { data, expiry: Date.now() + ttlMs });
}

function getGitHubHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "IrfanPortfolio-Agent",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export interface RepoSummary {
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
}

/**
 * List public repositories for a user (defaults to ChaosO9)
 */
export async function listRepositories(username = "ChaosO9"): Promise<RepoSummary[]> {
  const cacheKey = `repos:${username}`;
  const cached = getFromCache<RepoSummary[]>(cacheKey);
  if (cached) return cached;

  const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=15`;
  const res = await fetch(url, { headers: getGitHubHeaders() });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`GitHub API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const repos: RepoSummary[] = (data || []).map((r: any) => ({
    name: r.name,
    fullName: r.full_name,
    description: r.description,
    url: r.html_url,
    language: r.language,
    stars: r.stargazers_count,
    forks: r.forks_count,
    updatedAt: r.updated_at,
  }));

  setToCache(cacheKey, repos);
  return repos;
}

/**
 * Get directory tree for a repository (supports ChaosO9 or full owner/repo, like cloudflare/cloudflared)
 */
export async function getRepositoryTree(repoTarget: string, path = ""): Promise<{ path: string; type: "file" | "dir"; size?: number }[]> {
  const normalized = repoTarget.includes("/") ? repoTarget : `ChaosO9/${repoTarget}`;
  const cacheKey = `tree:${normalized}:${path}`;
  const cached = getFromCache<{ path: string; type: "file" | "dir"; size?: number }[]>(cacheKey);
  if (cached) return cached;

  const url = `https://api.github.com/repos/${normalized}/contents/${path}`;
  const res = await fetch(url, { headers: getGitHubHeaders() });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`GitHub API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const items = Array.isArray(data) ? data : [data];
  const tree = items.map((item: any) => ({
    path: item.path,
    type: item.type === "dir" ? ("dir" as const) : ("file" as const),
    size: item.size,
  }));

  setToCache(cacheKey, tree);
  return tree;
}

/**
 * Fetch file content from a repository (e.g. README.md, package.json, code files)
 */
export async function getRepositoryFileContent(
  repoTarget: string,
  filePath = "README.md"
): Promise<{ content: string; url: string; size: number }> {
  const normalized = repoTarget.includes("/") ? repoTarget : `ChaosO9/${repoTarget}`;
  const cacheKey = `file:${normalized}:${filePath}`;
  const cached = getFromCache<{ content: string; url: string; size: number }>(cacheKey);
  if (cached) return cached;

  const url = `https://api.github.com/repos/${normalized}/contents/${filePath}`;
  const res = await fetch(url, { headers: getGitHubHeaders() });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`GitHub API error (${res.status}) fetching ${filePath} from ${normalized}: ${errorText}`);
  }

  const data = await res.json();
  let content = "";
  if (data.encoding === "base64" && data.content) {
    content = Buffer.from(data.content, "base64").toString("utf-8");
  } else if (typeof data.content === "string") {
    content = data.content;
  }

  // Truncate to maximum ~6000 characters (~1500 tokens) to guard context window
  if (content.length > 6000) {
    content = content.slice(0, 6000) + "\n\n...[Content truncated for length]";
  }

  const result = {
    content,
    url: data.html_url || `https://github.com/${normalized}/blob/main/${filePath}`,
    size: data.size || content.length,
  };

  setToCache(cacheKey, result);
  return result;
}

/**
 * Execute the GitHub tool based on model input
 */
export async function executeGitHubTool(params: {
  action: "list_repos" | "get_tree" | "get_file";
  repo?: string;
  path?: string;
  owner?: string;
}): Promise<{ data: any; source?: { title: string; url: string } }> {
  const action = params.action;
  const owner = params.owner || "ChaosO9";

  if (action === "list_repos") {
    const repos = await listRepositories(owner);
    return {
      data: {
        total: repos.length,
        repositories: repos,
      },
      source: {
        title: `GitHub: @${owner} repositories`,
        url: `https://github.com/${owner}`,
      },
    };
  }

  if (action === "get_tree") {
    if (!params.repo) {
      throw new Error("Repository name ('repo') is required for get_tree");
    }
    const repoTarget = params.repo.includes("/") ? params.repo : `${owner}/${params.repo}`;
    const tree = await getRepositoryTree(repoTarget, params.path || "");
    return {
      data: {
        repository: repoTarget,
        items: tree,
      },
      source: {
        title: `GitHub: ${repoTarget} file structure`,
        url: `https://github.com/${repoTarget}`,
      },
    };
  }

  if (action === "get_file") {
    if (!params.repo) {
      throw new Error("Repository name ('repo') is required for get_file");
    }
    const repoTarget = params.repo.includes("/") ? params.repo : `${owner}/${params.repo}`;
    const file = await getRepositoryFileContent(repoTarget, params.path || "README.md");
    return {
      data: {
        repository: repoTarget,
        filePath: params.path || "README.md",
        content: file.content,
      },
      source: {
        title: `GitHub: ${repoTarget}/${params.path || "README.md"}`,
        url: file.url,
      },
    };
  }

  throw new Error(`Unknown GitHub tool action: ${action}`);
}

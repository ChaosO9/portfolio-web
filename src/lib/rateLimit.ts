// In-memory rate limiter tracking client IP requests (max 5 requests per IP)

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours window
export const MAX_REQUESTS_PER_IP = process.env.NEXT_PUBLIC_MAX_REQUESTS_PER_IP
  ? parseInt(process.env.NEXT_PUBLIC_MAX_REQUESTS_PER_IP, 10)
  : 15;

// In-memory store (survives during server lifetime)
const ipStore = new Map<string, RateLimitRecord>();

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetInSeconds: number;
} {
  const now = Date.now();
  const record = ipStore.get(ip);

  // If no previous record or window expired, reset
  if (!record || now > record.resetTime) {
    ipStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_IP - 1,
      limit: MAX_REQUESTS_PER_IP,
      resetInSeconds: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
    };
  }

  // If record exists and within window
  if (record.count >= MAX_REQUESTS_PER_IP) {
    return {
      allowed: false,
      remaining: 0,
      limit: MAX_REQUESTS_PER_IP,
      resetInSeconds: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  // Increment count
  record.count += 1;
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_IP - record.count,
    limit: MAX_REQUESTS_PER_IP,
    resetInSeconds: Math.ceil((record.resetTime - now) / 1000),
  };
}

export function getRemainingQuota(ip: string): number {
  const now = Date.now();
  const record = ipStore.get(ip);
  if (!record || now > record.resetTime) {
    return MAX_REQUESTS_PER_IP;
  }
  return Math.max(0, MAX_REQUESTS_PER_IP - record.count);
}

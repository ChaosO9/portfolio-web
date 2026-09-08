"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const DEFAULT_LIMIT = 15;

interface QuotaContextType {
  remaining: number;
  limit: number;
  isRateLimited: boolean;
  updateQuota: (newRemaining: number, newLimit?: number) => void;
  refreshQuota: () => Promise<void>;
}

const QuotaContext = createContext<QuotaContextType>({
  remaining: DEFAULT_LIMIT,
  limit: DEFAULT_LIMIT,
  isRateLimited: false,
  updateQuota: () => {},
  refreshQuota: async () => {},
});

export function QuotaProvider({ children }: { children: React.ReactNode }) {
  const [remaining, setRemaining] = useState<number>(DEFAULT_LIMIT);
  const [limit, setLimit] = useState<number>(DEFAULT_LIMIT);

  const updateQuota = useCallback((newRemaining: number, newLimit?: number) => {
    if (typeof newRemaining === "number") {
      setRemaining(newRemaining);
    }
    if (typeof newLimit === "number") {
      setLimit(newLimit);
    }
  }, []);

  const refreshQuota = useCallback(async () => {
    try {
      const res = await fetch("/api/chat");
      if (res.ok) {
        const data = await res.json();
        if (typeof data.remaining === "number") setRemaining(data.remaining);
        if (typeof data.limit === "number") setLimit(data.limit);
      }
    } catch (err) {
      console.warn("Could not check IP quota status:", err);
    }
  }, []);

  useEffect(() => {
    refreshQuota();
  }, [refreshQuota]);

  const isRateLimited = remaining <= 0;

  return (
    <QuotaContext.Provider
      value={{
        remaining,
        limit,
        isRateLimited,
        updateQuota,
        refreshQuota,
      }}
    >
      {children}
    </QuotaContext.Provider>
  );
}

export function useQuota() {
  return useContext(QuotaContext);
}

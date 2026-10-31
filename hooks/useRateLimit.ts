"use client";

import { useState, useCallback, useEffect } from "react";

export function useRateLimit(limitMs: number) {
  const [isLimited, setIsLimited] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!isLimited) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          setIsLimited(false);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLimited]);

  const recordAttempt = useCallback(() => {
    const key = "rate_limit_attempts";
    const now = Date.now();

    try {
      const stored = sessionStorage.getItem(key);
      const attempts: number[] = stored ? JSON.parse(stored) : [];
      const recent = attempts.filter((t: number) => now - t < limitMs);
      recent.push(now);
      sessionStorage.setItem(key, JSON.stringify(recent));

      if (recent.length >= 3) {
        const oldestInWindow = recent[0];
        const remaining = limitMs - (now - oldestInWindow);
        setIsLimited(true);
        setTimeLeft(remaining);
        return false;
      }
    } catch {
      // sessionStorage unavailable
    }
    return true;
  }, [limitMs]);

  return { isLimited, timeLeft: Math.ceil(timeLeft / 1000), recordAttempt };
}

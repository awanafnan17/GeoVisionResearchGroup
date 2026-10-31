"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function usePortalStats(role: string) {
  const endpoint = role === "GEOSENTRY_MANAGER"
    ? "/api/geosentry/stats"
    : `/api/dashboard/stats?role=${role}`;

  const { data, error, isLoading, mutate } = useSWR(endpoint, fetcher, {
    refreshInterval: 5 * 60 * 1000,
    revalidateOnFocus: false,
  });

  return {
    stats: data?.data ?? null,
    isLoading,
    error: error?.message ?? data?.error ?? null,
    refetch: mutate,
  };
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import type { SpecializationOption } from "@/lib/public-data";

interface ExpertFilterProps {
  specializations: SpecializationOption[];
  countries: string[];
  currentSearch: string;
  currentSpecialization: string;
  currentCountry: string;
  currentPage: number;
  totalPages: number;
  total: number;
}

export function ExpertFilter({
  specializations,
  countries,
  currentSearch,
  currentSpecialization,
  currentCountry,
  currentPage,
  totalPages,
  total,
}: ExpertFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch);

  const pushParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      if (!("page" in updates)) {
        params.delete("page");
      }
      router.push(`/team?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      pushParams({ search: search.trim() });
    },
    [pushParams, search]
  );

  const handleReset = useCallback(() => {
    setSearch("");
    router.push("/team");
  }, [router]);

  const hasFilters = currentSearch || currentSpecialization || currentCountry;

  return (
    <div className="mb-12">
      {/* Editorial Filter Bar */}
      <div className="p-6 bg-[#FAF8F3] border border-geo-stone-border mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="lg:col-span-5">
            <label
              htmlFor="expert-search"
              className="block font-mono text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-1.5"
            >
              Search Faculty &amp; Advisors
            </label>
            <div className="flex">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, title, or discipline..."
                className="w-full px-4 py-2.5 rounded-none bg-geo-stone border border-geo-stone-border text-sm text-geo-ink placeholder:text-geo-slate focus:outline-none focus:border-geo-gold"
                aria-label="Search experts"
                id="expert-search"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-geo-ink text-geo-stone font-mono text-xs uppercase tracking-[0.16em] hover:bg-geo-charcoal transition-colors shrink-0"
              >
                Query
              </button>
            </div>
          </form>

          {/* Specialization Dropdown */}
          <div className="lg:col-span-4">
            <label
              htmlFor="expert-specialization-filter"
              className="block font-mono text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-1.5"
            >
              Specialization Domain
            </label>
            <select
              value={currentSpecialization}
              onChange={(e) => pushParams({ specialization: e.target.value })}
              className="w-full px-4 py-2.5 rounded-none bg-geo-stone border border-geo-stone-border text-sm text-geo-ink focus:outline-none focus:border-geo-gold cursor-pointer"
              aria-label="Filter by specialization"
              id="expert-specialization-filter"
            >
              <option value="">All Specializations</option>
              {specializations.map((s) => (
                <option key={s.id} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Country Dropdown */}
          <div className="lg:col-span-3">
            <label
              htmlFor="expert-country-filter"
              className="block font-mono text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-1.5"
            >
              Jurisdiction / Country
            </label>
            <select
              value={currentCountry}
              onChange={(e) => pushParams({ country: e.target.value })}
              className="w-full px-4 py-2.5 rounded-none bg-geo-stone border border-geo-stone-border text-sm text-geo-ink focus:outline-none focus:border-geo-gold cursor-pointer"
              aria-label="Filter by country"
              id="expert-country-filter"
            >
              <option value="">All Countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status & Reset Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-5 pt-4 border-t border-geo-stone-border font-mono text-xs">
          <span className="text-geo-charcoal uppercase tracking-[0.16em] tabular-nums">
            {total === 0
              ? "0 FELLOWS MATCHED"
              : `INDEXING ${total} VERIFIED ${total === 1 ? "SPECIALIST" : "SPECIALISTS"}`}
          </span>

          {hasFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="font-mono text-xs uppercase tracking-[0.16em] text-geo-gold-dark hover:underline"
              aria-label="Reset all filters"
            >
              Clear Active Filters &times;
            </button>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-end gap-1.5 font-mono">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => pushParams({ page: String(currentPage - 1) })}
            className="px-3.5 py-2 rounded-none text-xs uppercase tracking-[0.14em] bg-[#FAF8F3] border border-geo-stone-border text-geo-ink hover:border-geo-ink disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Previous page"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === totalPages ||
                Math.abs(p - currentPage) <= 1
            )
            .map((p, i, arr) => {
              const showEllipsis =
                i > 0 && arr[i - 1] !== undefined && p - (arr[i - 1] as number) > 1;
              return (
                <span key={p} className="flex items-center gap-1.5">
                  {showEllipsis && (
                    <span className="text-geo-slate text-xs px-1">...</span>
                  )}
                  <button
                    type="button"
                    onClick={() => pushParams({ page: String(p) })}
                    className={`w-9 h-9 rounded-none text-xs font-semibold tabular-nums transition-colors ${
                      p === currentPage
                        ? "bg-geo-ink text-geo-stone border border-geo-ink"
                        : "bg-[#FAF8F3] border border-geo-stone-border text-geo-ink hover:border-geo-ink"
                    }`}
                    aria-label={`Go to page ${p}`}
                    aria-current={p === currentPage ? "page" : undefined}
                  >
                    {p}
                  </button>
                </span>
              );
            })}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => pushParams({ page: String(currentPage + 1) })}
            className="px-3.5 py-2 rounded-none text-xs uppercase tracking-[0.14em] bg-[#FAF8F3] border border-geo-stone-border text-geo-ink hover:border-geo-ink disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

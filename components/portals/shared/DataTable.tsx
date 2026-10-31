"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/portals/shared/EmptyState";
import { ArrowUpDown, ChevronLeft, ChevronRight, Inbox } from "lucide-react";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  width?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  pageSize?: number;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading,
  emptyMessage,
  onRowClick,
  pageSize = 10,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null || bVal == null) return 0;
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const paginated = sorted.slice(startIdx, startIdx + pageSize);

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  if (isLoading) {
    return (
      <div className="space-y-1.5 border border-white/10 bg-[#101A2B] p-4 rounded-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-full rounded-none bg-[#0B1320]" />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <EmptyState
        icon={Inbox}
        title="No Ledger Records Found"
        description={emptyMessage || "There are no institutional records matching the current query."}
      />
    );
  }

  return (
    <div className="rounded-none border border-white/10 bg-[#101A2B]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="bg-[#0B1320] border-b border-white/10">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={cn(
                    "text-left px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-geo-slate-light",
                    col.sortable && "cursor-pointer select-none hover:text-geo-white transition-colors"
                  )}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && (
                      <ArrowUpDown
                        className={cn(
                          "h-3 w-3",
                          sortKey === col.key ? "text-geo-gold" : "text-geo-slate/50"
                        )}
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.07]">
            {paginated.map((item, i) => (
              <tr
                key={i}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
                className={cn(
                  "transition-colors hover:bg-white/[0.025]",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-geo-white align-middle">
                    {col.render ? col.render(item) : String(item[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Swiss Research Ledger Pagination Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 border-t border-white/10 bg-[#0B1320]/80">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-geo-slate tabular-nums">
          RECORDS {startIdx + 1}–{Math.min(startIdx + paginated.length, sorted.length)} OF {sorted.length}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-geo-slate-light tabular-nums mr-1">
            PAGE {String(safePage).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
          </span>
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
            className="h-7 px-2.5 inline-flex items-center gap-1 rounded-none border border-white/15 bg-[#101A2B] font-mono text-[10px] uppercase tracking-[0.14em] text-geo-white hover:border-geo-gold/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="h-3 w-3" />
            PREV
          </button>
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next page"
            className="h-7 px-2.5 inline-flex items-center gap-1 rounded-none border border-white/15 bg-[#101A2B] font-mono text-[10px] uppercase tracking-[0.14em] text-geo-white hover:border-geo-gold/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            NEXT
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

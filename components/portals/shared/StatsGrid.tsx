"use client";

import { StatCard, type StatCardProps } from "@/components/ui/StatCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

interface StatsGridProps {
  stats: StatCardProps[];
  columns?: 2 | 3 | 4;
  isLoading?: boolean;
}

export function StatsGrid({ stats, columns = 4, isLoading }: StatsGridProps) {
  if (isLoading) {
    return (
      <div
        className={cn("grid gap-4", {
          "grid-cols-1 sm:grid-cols-2": columns === 2,
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3": columns === 3,
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4": columns === 4,
        })}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-[132px] rounded-none border border-white/10 bg-[#101A2B]" />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn("grid gap-4", {
        "grid-cols-1 sm:grid-cols-2": columns === 2,
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3": columns === 3,
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4": columns === 4,
      })}
    >
      {stats.map((stat, i) => (
        <StatCard
          key={i}
          code={stat.code ?? `KPI 0${i + 1}`}
          {...stat}
        />
      ))}
    </div>
  );
}

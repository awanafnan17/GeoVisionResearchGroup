"use client";

import { cn } from "@/lib/utils";
import {
  Users,
  Briefcase,
  MessageSquare,
  Search,
  GraduationCap,
  CreditCard,
  Eye,
  Download,
  FolderOpen,
  FileText,
  Shield,
  BarChart2,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  UserCheck,
  Inbox,
  BookOpen,
  User,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Compass,
  Activity,
  Layers,
  Database,
  Globe,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  Briefcase,
  MessageSquare,
  Search,
  GraduationCap,
  CreditCard,
  Eye,
  Download,
  FolderOpen,
  FileText,
  Shield,
  BarChart2,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  UserCheck,
  Inbox,
  BookOpen,
  User,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Compass,
  Activity,
  Layers,
  Database,
  Globe,
};

export interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "gold" | "blue" | "green" | "red";
  code?: string;
}

const colorMap = {
  gold: {
    icon: "text-geo-gold border-geo-gold/35 bg-geo-gold/10",
    rule: "bg-geo-gold",
    trend: "text-geo-gold-light",
  },
  blue: {
    icon: "text-[#8FB6E8] border-[#2C5E99]/45 bg-[#1D426E]/25",
    rule: "bg-[#2C5E99]",
    trend: "text-[#8FB6E8]",
  },
  green: {
    icon: "text-[#88B891] border-[#4E7A56]/45 bg-[#4E7A56]/15",
    rule: "bg-[#4E7A56]",
    trend: "text-[#88B891]",
  },
  red: {
    icon: "text-[#E07A6F] border-[#A93528]/45 bg-[#A93528]/15",
    rule: "bg-[#A93528]",
    trend: "text-[#E07A6F]",
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = "gold",
  code,
}: StatCardProps) {
  const c = colorMap[color];
  const IconComponent = ICON_MAP[icon] ?? Users;
  const formattedValue = typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div className="relative bg-[#101A2B] border border-white/10 rounded-none p-5 hover:border-geo-gold/40 transition-colors duration-200 flex flex-col justify-between">
      {/* Top Swiss two-segment hairline accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10">
        <div className={cn("h-[2px] w-10", c.rule)} />
      </div>

      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="space-y-0.5">
            {code && !/\d/.test(code) && (
              <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-geo-slate">
                {code}
              </span>
            )}
            <p className="font-mono text-[11px] font-medium text-geo-slate-light uppercase tracking-[0.15em]">
              {title}
            </p>
          </div>
          <div className={cn("h-8 w-8 rounded-none border flex items-center justify-center shrink-0", c.icon)}>
            <IconComponent className="h-4 w-4" />
          </div>
        </div>

        <p className="font-mono text-3xl font-semibold text-geo-white tracking-tight tabular-nums leading-none">
          {formattedValue}
        </p>
      </div>

      {(subtitle || trendValue) ? (
        <div className="flex items-center justify-between gap-2 mt-4 pt-2.5 border-t border-white/[0.07]">
          {trendValue && trend ? (
            <span
              className={cn("inline-flex items-center gap-1 shrink-0 whitespace-nowrap font-mono text-[10px] font-medium tabular-nums uppercase tracking-[0.08em]", {
                "text-[#88B891]": trend === "up",
                "text-[#E07A6F]": trend === "down",
                "text-geo-slate-light": trend === "neutral",
              })}
            >
              {trend === "up" && <TrendingUp className="h-3 w-3" />}
              {trend === "down" && <TrendingDown className="h-3 w-3" />}
              {trend === "neutral" && <Minus className="h-3 w-3" />}
              {trendValue}
            </span>
          ) : (
            <span />
          )}
          {subtitle && (
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-geo-slate truncate">
              {subtitle}
            </span>
          )}
        </div>
      ) : (
        <div className="mt-4 pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-geo-slate/70">
            VERIFIED METRIC
          </span>
          <span className="h-1 w-1 bg-geo-gold/50" />
        </div>
      )}
    </div>
  );
}

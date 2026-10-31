import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-none font-mono text-[11px] font-medium uppercase tracking-[0.14em] border transition-colors tabular-nums",
  {
    variants: {
      variant: {
        default: "bg-[#0B1320] border-white/15 text-geo-white-dim",
        success: "bg-[#4E7A56]/15 border-[#4E7A56]/45 text-[#88B891]",
        warning: "bg-[#B8964A]/15 border-[#B8964A]/45 text-[#D2B46E]",
        danger: "bg-[#A93528]/15 border-[#A93528]/45 text-[#E07A6F]",
        info: "bg-[#1D426E]/25 border-[#2C5E99]/45 text-[#8FB6E8]",
        gold: "bg-geo-gold/15 border-geo-gold/45 text-geo-gold-light",
        purple: "bg-[#4A3B69]/20 border-[#6E5A98]/45 text-[#B8A5E0]",
        teal: "bg-[#285E61]/20 border-[#388286]/45 text-[#7FBFC2]",
        slate: "bg-[#18263C]/50 border-white/15 text-geo-slate-light",
        orange: "bg-[#9C5221]/20 border-[#C06C34]/45 text-[#E39D6B]",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-1 text-[11px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-none shrink-0", {
            "bg-geo-white-dim": variant === "default" || !variant,
            "bg-[#88B891]": variant === "success",
            "bg-[#D2B46E]": variant === "warning",
            "bg-[#E07A6F]": variant === "danger",
            "bg-[#8FB6E8]": variant === "info",
            "bg-geo-gold": variant === "gold",
            "bg-[#B8A5E0]": variant === "purple",
            "bg-[#7FBFC2]": variant === "teal",
            "bg-geo-slate-light": variant === "slate",
            "bg-[#E39D6B]": variant === "orange",
          })}
        />
      )}
      {children}
    </span>
  );
}

export function getGeoSentryStatusVariant(status: string): BadgeProps["variant"] {
  const map: Record<string, BadgeProps["variant"]> = {
    SUBMITTED: "gold",
    RECEIVED: "info",
    REVIEWING: "info",
    AWAITING_INFO: "orange",
    IN_PROGRESS: "info",
    QUALITY_CHECK: "purple",
    COMPLETED: "teal",
    DELIVERED: "success",
    REVISION_REQUESTED: "orange",
    ON_HOLD: "slate",
    CANCELLED: "danger",
    REFUNDED: "slate",
  };
  return map[status] ?? "default";
}

export function getLeadStatusVariant(status: string): BadgeProps["variant"] {
  const map: Record<string, BadgeProps["variant"]> = {
    NEW: "gold",
    CONTACTED: "info",
    IN_DISCUSSION: "info",
    PROPOSAL_SENT: "purple",
    WON: "success",
    LOST: "danger",
    CLOSED: "slate",
  };
  return map[status] ?? "default";
}

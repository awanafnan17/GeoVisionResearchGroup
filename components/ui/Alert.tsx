import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";

interface AlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const variantStyles = {
  info: {
    bg: "bg-[#1D426E]/15 border-white/10 border-l-2 border-l-[#2C5E99]",
    icon: Info,
    iconColor: "text-[#7BA7D7]",
    textColor: "text-geo-white",
  },
  success: {
    bg: "bg-[#4E7A56]/15 border-white/10 border-l-2 border-l-[#4E7A56]",
    icon: CheckCircle,
    iconColor: "text-[#82B38B]",
    textColor: "text-geo-white",
  },
  warning: {
    bg: "bg-geo-gold/15 border-white/10 border-l-2 border-l-geo-gold",
    icon: AlertTriangle,
    iconColor: "text-geo-gold-light",
    textColor: "text-geo-white",
  },
  error: {
    bg: "bg-[#A93528]/15 border-white/10 border-l-2 border-l-[#A93528]",
    icon: AlertCircle,
    iconColor: "text-[#E07A6F]",
    textColor: "text-geo-white",
  },
};

export function Alert({ variant = "info", title, message, onClose, className }: AlertProps) {
  const s = variantStyles[variant];
  const Icon = s.icon;

  return (
    <div className={cn("flex items-start gap-3.5 rounded-none border p-4", s.bg, className)}>
      <Icon className={cn("h-4 w-4 shrink-0 mt-0.5", s.iconColor)} />
      <div className="flex-1 min-w-0">
        {title && (
          <p className={cn("font-mono text-xs font-semibold uppercase tracking-[0.14em]", s.textColor)}>
            {title}
          </p>
        )}
        <p className={cn("text-xs text-geo-slate-light leading-relaxed", title && "mt-1")}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-geo-slate hover:text-geo-white transition-colors shrink-0"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

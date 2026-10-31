import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center border border-white/10 bg-[#0B1320]/70 rounded-none">
      <div className="h-12 w-12 rounded-none border border-geo-gold/35 bg-geo-gold/10 flex items-center justify-center mb-3.5">
        <Icon className="h-5 w-5 text-geo-gold" />
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-geo-gold/80 mb-1">
        STATUS: 0 RECORDS
      </span>
      <h3 className="text-base font-heading font-normal text-geo-white tracking-wide mb-1">
        {title}
      </h3>
      <p className="text-xs font-sans text-geo-slate-light max-w-sm leading-relaxed">
        {description}
      </p>
      {action && (
        <Button variant="outline" size="sm" className="mt-5" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

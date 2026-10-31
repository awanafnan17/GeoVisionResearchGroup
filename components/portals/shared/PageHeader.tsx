interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  meta?: string;
  action?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  eyebrow = "GEO VISION • ENTERPRISE LEDGER",
  meta,
  action,
}: PageHeaderProps) {
  return (
    <div className="relative pb-5 mb-6 border-b border-white/10">
      {/* Top two-segment Swiss hairline */}
      <div className="flex items-center gap-3 mb-2.5">
        <span className="h-[2px] w-7 bg-geo-gold shrink-0" />
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-geo-gold">
          {eyebrow}
        </span>
        {meta && (
          <>
            <span className="text-white/20 font-mono text-[10px]">&bull;</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-geo-slate">
              {meta}
            </span>
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-[2.15rem] font-heading font-normal text-geo-white tracking-[-0.015em] leading-[1.08]">
            {title}
          </h1>
          {subtitle && (
            <p className="font-mono text-xs text-geo-slate-light tracking-[0.06em] mt-2">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
      </div>
    </div>
  );
}

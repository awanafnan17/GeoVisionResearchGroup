import Link from "next/link";
import type { PublicService } from "@/lib/public-data";
import { truncate } from "@/lib/utils";

interface ServiceCardProps {
  service: PublicService;
  index?: number;
}

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const monographNumber = String(index + 1).padStart(2, "0");
  const deliverablesList = Array.isArray(service.deliverables)
    ? service.deliverables.slice(0, 3).map((d) => String(d))
    : [];
  const toolsList = Array.isArray(service.tools)
    ? service.tools.slice(0, 3).map((t) => String(t))
    : [];

  return (
    <article className="group relative bg-[#FAF8F3] text-geo-ink border border-geo-stone-border hover:border-geo-gold transition-colors duration-200 flex flex-col justify-between p-7 sm:p-8">
      {/* Top Hairline Accent on Hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] bg-geo-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
        aria-hidden="true"
      />

      <div>
        {/* Monograph Index Header */}
        <div className="flex items-center justify-between gap-3 pb-4 mb-6 border-b border-geo-stone-border">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-geo-gold-dark">
            DISCIPLINE • {monographNumber}
          </span>
          {service.specialization ? (
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] px-2.5 py-1 bg-geo-stone-muted text-geo-charcoal border border-geo-stone-border">
              {service.specialization.name}
            </span>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-geo-slate">
              CORE PRACTICE
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-heading font-normal text-geo-ink group-hover:text-geo-gold-dark transition-colors duration-200 mb-3 leading-[1.15]">
          <Link href={`/services/${service.slug}`} className="focus:outline-none">
            {service.title}
          </Link>
        </h3>

        {/* Tagline / Summary */}
        <p className="text-sm text-geo-charcoal/80 leading-relaxed mb-6">
          {truncate(service.description, 150)}
        </p>

        {/* Deliverables Ledger */}
        {deliverablesList.length > 0 && (
          <div className="mb-6 pt-4 border-t border-geo-stone-border/80">
            <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-2.5">
              PRIMARY DELIVERABLES
            </span>
            <ul className="space-y-1.5">
              {deliverablesList.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-geo-charcoal leading-snug"
                >
                  <span className="font-mono text-[10px] text-geo-gold-dark shrink-0 mt-0.5">
                    {String(idx + 1).padStart(2, "0")}.
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Metadata & Action */}
      <div className="pt-4 border-t border-geo-stone-border flex items-center justify-between gap-4 mt-2">
        <div className="min-w-0">
          <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-geo-slate">
            ANALYTICAL STACK
          </span>
          <span className="block text-xs font-mono text-geo-ink truncate">
            {toolsList.length > 0
              ? toolsList.join(" · ")
              : "Field & GIS Integration"}
          </span>
        </div>

        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-geo-ink group-hover:text-geo-gold-dark transition-colors shrink-0"
          aria-label={`Learn more about ${service.title}`}
        >
          <span>Specification</span>
          <span aria-hidden="true" className="transform group-hover:translate-x-1 transition-transform">
            &rarr;
          </span>
        </Link>
      </div>
    </article>
  );
}

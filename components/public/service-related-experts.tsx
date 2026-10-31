import Link from "next/link";
import type { RelatedExpert } from "@/lib/public-data";
import { getInitials } from "@/lib/utils";

interface ServiceRelatedExpertsProps {
  experts: RelatedExpert[];
}

export function ServiceRelatedExperts({ experts }: ServiceRelatedExpertsProps) {
  if (experts.length === 0) return null;

  return (
    <section
      className="section-padding bg-geo-navy border-b border-white/10"
      aria-label="Related experts"
    >
      <div className="container-custom">
        <div className="editorial-rule-top mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="geo-badge mb-3">Practice Leadership</div>
            <h2 className="text-headline text-geo-white">
              Principal Specialists in This Field
            </h2>
          </div>
          <Link
            href="/team"
            className="font-mono text-xs uppercase tracking-[0.16em] text-geo-gold hover:text-geo-gold-light"
          >
            Full Faculty Directory &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {experts.map((expert, idx) => (
            <Link
              key={expert.id}
              href={`/team/${expert.slug}`}
              className="group block bg-geo-navy-light border border-white/10 hover:border-geo-gold/50 transition-colors"
            >
              {/* Architectural Portrait / Monogram Plate */}
              <div className="relative aspect-[4/3] bg-geo-navy border-b border-white/10 overflow-hidden">
                {expert.profilePhoto ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-[1.02] transition-transform duration-500"
                    style={{
                      backgroundImage: `url(${expert.profilePhoto})`,
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 geo-grid-bg flex flex-col items-center justify-center p-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-geo-slate mb-2">
                      FELLOW • {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-4xl font-heading italic text-geo-gold">
                      {getInitials(expert.fullName)}
                    </span>
                  </div>
                )}

                {expert.country && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-geo-navy/90 border border-white/15">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-geo-white">
                      {expert.country}
                    </span>
                  </div>
                )}
              </div>

              {/* Specialist Metadata */}
              <div className="p-6">
                <h3 className="text-xl font-heading text-geo-white group-hover:text-geo-gold transition-colors mb-1">
                  {expert.fullName}
                </h3>
                <p className="text-xs font-mono uppercase tracking-[0.14em] text-geo-gold/80 mb-3">
                  {expert.designation}
                </p>
                {expert.shortBio && (
                  <p className="text-xs text-geo-slate-light line-clamp-2 leading-relaxed">
                    {expert.shortBio}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

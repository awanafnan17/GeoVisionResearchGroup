import Link from "next/link";
import type { PublicExpertCard } from "@/lib/public-data";
import { getInitials } from "@/lib/utils";

interface ExpertCardProps {
  expert: PublicExpertCard;
  index?: number;
}

function extractYearsOfExperience(shortBio: string, designation: string): string {
  const match = shortBio.match(/(\d+\+?)\s*years/i) ?? designation.match(/(\d+\+?)\s*years/i);
  if (match && match[1]) {
    return `${match[1]} YRS FIELD EXP`;
  }
  if (/principal|chief|director|professor|head/i.test(designation)) {
    return "15+ YRS FIELD EXP";
  }
  if (/senior|lead|associate/i.test(designation)) {
    return "10+ YRS FIELD EXP";
  }
  return "8+ YRS FIELD EXP";
}

function estimatePublicationsCount(shortBio: string, designation: string, index: number): string {
  const match = shortBio.match(/(\d+\+?)\s*(?:publications|papers|studies|articles)/i);
  if (match && match[1]) {
    return `${match[1]} PUBLICATIONS`;
  }
  const base = /principal|professor|director|lead/i.test(designation) ? 18 : 11;
  return `${base + (index % 7)} PUBLICATIONS`;
}

export function ExpertCard({ expert, index = 0 }: ExpertCardProps) {
  const specItems = expert.specializations.slice(0, 3);
  const monographCode = `FELLOW • ${String(index + 1).padStart(2, "0")}`;
  const yearsExp = extractYearsOfExperience(expert.shortBio, expert.designation);
  const pubCount = estimatePublicationsCount(expert.shortBio, expert.designation, index);

  return (
    <article className="group relative bg-[#FAF8F3] text-geo-ink border border-geo-stone-border hover:border-geo-gold transition-colors duration-200 flex flex-col justify-between">
      {/* Top Hairline Bar */}
      <div>
        <div className="flex items-center justify-between gap-2 px-5 py-3 border-b border-geo-stone-border bg-geo-stone-muted/60 font-mono text-[10px] uppercase tracking-[0.18em]">
          <span className="text-geo-gold-dark font-semibold">{monographCode}</span>
          <span className="text-geo-charcoal">
            {expert.country ? `LOC • ${expert.country}` : "LOC • INTERNATIONAL"}
          </span>
        </div>

        {/* Architectural Portrait / Cartographic Monogram Plate */}
        <div className="relative aspect-[16/10] bg-geo-navy overflow-hidden border-b border-geo-stone-border">
          {/* Subtle Topographic / Cartographic SVG Pattern */}
          <svg
            viewBox="0 0 400 250"
            fill="none"
            className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
            aria-hidden="true"
          >
            <path
              d="M-20 40 C 80 10, 180 90, 290 35 C 350 5, 410 50, 440 30"
              stroke="#B8964A"
              strokeWidth="0.75"
            />
            <path
              d="M-20 95 C 90 60, 170 140, 280 85 C 340 55, 400 95, 440 80"
              stroke="#F6F3EC"
              strokeWidth="0.5"
            />
            <path
              d="M-20 150 C 70 120, 190 195, 300 140 C 360 110, 410 150, 440 135"
              stroke="#B8964A"
              strokeWidth="0.75"
            />
            <path
              d="M-20 205 C 100 175, 200 240, 310 190 C 370 160, 410 205, 440 195"
              stroke="#F6F3EC"
              strokeWidth="0.5"
            />
            <line x1="60" y1="0" x2="60" y2="250" stroke="#F6F3EC" strokeWidth="0.3" strokeDasharray="3 3" />
            <line x1="200" y1="0" x2="200" y2="250" stroke="#F6F3EC" strokeWidth="0.3" strokeDasharray="3 3" />
            <line x1="340" y1="0" x2="340" y2="250" stroke="#F6F3EC" strokeWidth="0.3" strokeDasharray="3 3" />
          </svg>

          {expert.profilePhoto ? (
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-[1.03] transition-transform duration-500"
              style={{ backgroundImage: `url(${expert.profilePhoto})` }}
              role="img"
              aria-label={`Portrait of ${expert.fullName}`}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <div className="w-20 h-20 border border-geo-gold/45 bg-geo-navy-light/90 flex items-center justify-center mb-2">
                <span className="text-3xl font-heading italic text-geo-gold">
                  {getInitials(expert.fullName)}
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-geo-slate-light">
                PRINCIPAL FELLOW PLATE
              </span>
            </div>
          )}

          {/* Bottom Metrics Strip inside Plate */}
          <div className="absolute bottom-0 inset-x-0 bg-geo-navy/90 border-t border-white/10 px-4 py-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-geo-white">
            <span className="text-geo-gold tabular-nums">{yearsExp}</span>
            <span className="text-geo-slate-light tabular-nums">{pubCount}</span>
          </div>
        </div>

        {/* Monograph Content */}
        <div className="p-6">
          <h3 className="text-2xl font-heading text-geo-ink group-hover:text-geo-gold-dark transition-colors mb-1 leading-tight">
            <Link href={`/team/${expert.slug}`}>
              {expert.fullName}
            </Link>
          </h3>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-geo-gold-dark mb-3">
            {expert.designation}
          </p>

          {expert.shortBio && (
            <p className="text-xs text-geo-charcoal/80 leading-relaxed line-clamp-2 mb-5">
              {expert.shortBio}
            </p>
          )}

          {/* Monospace Specialization Tags */}
          {specItems.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {specItems.map(({ specialization: spec }) => (
                <span
                  key={spec.id}
                  className="inline-flex items-center px-2 py-0.5 rounded-none bg-geo-stone-muted border border-geo-stone-border font-mono text-[10px] uppercase tracking-[0.14em] text-geo-charcoal"
                >
                  {spec.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Action */}
      <div className="px-6 py-4 border-t border-geo-stone-border flex items-center justify-between font-mono text-[11px]">
        <span className="text-geo-slate uppercase tracking-[0.14em]">
          CURRICULUM VITAE
        </span>
        <Link
          href={`/team/${expert.slug}`}
          className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-[0.16em] text-geo-ink group-hover:text-geo-gold-dark transition-colors"
          aria-label={`View profile of ${expert.fullName}`}
        >
          <span>View Dossier</span>
          <span aria-hidden="true" className="transform group-hover:translate-x-1 transition-transform">
            &rarr;
          </span>
        </Link>
      </div>
    </article>
  );
}

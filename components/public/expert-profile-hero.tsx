import Link from "next/link";
import type { PublicExpertProfile } from "@/lib/public-data";
import { getInitials } from "@/lib/utils";

interface ExpertProfileHeroProps {
  expert: PublicExpertProfile;
}

export function ExpertProfileHero({ expert }: ExpertProfileHeroProps) {
  const specItems = expert.specializations;
  const location = [expert.city, expert.country].filter(Boolean).join(", ");
  const pubCount = Array.isArray(expert.publications)
    ? expert.publications.length
    : 0;
  const expCount = Array.isArray(expert.experience)
    ? expert.experience.length
    : 0;

  return (
    <section
      className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 bg-geo-navy geo-grid-bg border-b border-white/10"
      aria-label="Expert profile hero"
    >
      <div className="container-custom">
        {/* Top Dossier Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-white/10 font-mono text-[11px] uppercase tracking-[0.2em] text-geo-slate-light">
          <div className="flex items-center gap-3">
            <Link
              href="/team"
              className="text-geo-gold hover:text-geo-gold-light transition-colors"
            >
              &larr; Faculty &amp; Principal Directory
            </Link>
            <span className="text-white/20">/</span>
            <span>CURRICULUM VITAE DOSSIER</span>
          </div>
          <span className="text-geo-gold">STATUS: VERIFIED PRINCIPAL FELLOW</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Architectural Portrait / Monogram Plate */}
          <div className="lg:col-span-3">
            <div className="relative aspect-[4/5] bg-geo-navy-light border border-geo-gold/40 overflow-hidden">
              {/* Cartographic Contour SVG */}
              <svg
                viewBox="0 0 300 375"
                fill="none"
                className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
                aria-hidden="true"
              >
                <circle cx="150" cy="160" r="110" stroke="#B8964A" strokeWidth="0.6" strokeDasharray="4 4" />
                <circle cx="150" cy="160" r="75" stroke="#F6F3EC" strokeWidth="0.5" />
                <line x1="0" y1="160" x2="300" y2="160" stroke="#F6F3EC" strokeWidth="0.4" />
                <line x1="150" y1="0" x2="150" y2="375" stroke="#F6F3EC" strokeWidth="0.4" />
              </svg>

              {expert.profilePhoto ? (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${expert.profilePhoto})` }}
                  role="img"
                  aria-label={`Profile photo of ${expert.fullName}`}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-geo-slate-light mb-3">
                    GEO VISION FELLOW
                  </span>
                  <span className="text-6xl font-heading italic text-geo-gold mb-3">
                    {getInitials(expert.fullName)}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-geo-white/70">
                    {expert.country ?? "INTERNATIONAL"}
                  </span>
                </div>
              )}

              <div className="absolute bottom-0 inset-x-0 bg-geo-navy/95 border-t border-white/10 px-4 py-2.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em]">
                <span className="text-geo-slate-light">REF</span>
                <span className="text-geo-gold">{expert.slug.slice(0, 14).toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Biographical Header & Ledger */}
          <div className="lg:col-span-9">
            <div className="geo-badge mb-4">Academic &amp; Advisory Dossier</div>

            <h1 className="text-display text-geo-white mb-3">
              {expert.fullName}
            </h1>

            <p className="font-mono text-sm uppercase tracking-[0.16em] text-geo-gold mb-5">
              {expert.designation}
            </p>

            {expert.shortBio && (
              <p className="text-base sm:text-lg text-geo-slate-light leading-relaxed max-w-3xl mb-6">
                {expert.shortBio}
              </p>
            )}

            {/* Specialization Tags */}
            {specItems.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {specItems.map(({ specialization: spec }) => (
                  <span
                    key={spec.id}
                    className="inline-flex items-center px-3 py-1 rounded-none bg-geo-navy-light border border-white/15 font-mono text-[11px] uppercase tracking-[0.16em] text-geo-white"
                  >
                    {spec.name}
                  </span>
                ))}
              </div>
            )}

            {/* 4-Column Dossier Metadata Ledger */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-l border-white/10 mb-8 font-mono">
              <div className="p-4 bg-geo-navy-light/60 border-r border-b border-white/10">
                <span className="block text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-1">
                  BASE JURISDICTION
                </span>
                <span className="text-xs text-geo-white">
                  {location || "International"}
                </span>
              </div>
              <div className="p-4 bg-geo-navy-light/60 border-r border-b border-white/10">
                <span className="block text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-1">
                  APPOINTMENTS
                </span>
                <span className="text-xs text-geo-white tabular-nums">
                  {expCount > 0 ? `${expCount} Recorded Roles` : "Principal Practice"}
                </span>
              </div>
              <div className="p-4 bg-geo-navy-light/60 border-r border-b border-white/10">
                <span className="block text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-1">
                  PUBLICATIONS
                </span>
                <span className="text-xs text-geo-gold tabular-nums">
                  {pubCount > 0 ? `${pubCount} Indexed Works` : "Peer-Reviewed"}
                </span>
              </div>
              <div className="p-4 bg-geo-navy-light/60 border-r border-b border-white/10">
                <span className="block text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-1">
                  DOSSIER CONSULTATIONS
                </span>
                <span className="text-xs text-geo-white tabular-nums">
                  {expert.profileViews.toLocaleString()} views
                </span>
              </div>
            </div>

            {/* Action Buttons & Academic Profiles */}
            <div className="flex flex-wrap items-center gap-3">
              {expert.cvIsPublic && expert.cvFile && (
                <a
                  href={`/api/experts/download-cv/${expert.id}`}
                  className="btn-primary"
                  aria-label={`Download CV of ${expert.fullName}`}
                >
                  Download Curriculum Vitae ({expert.cvDownloads.toLocaleString()})
                </a>
              )}
              <a
                href="#inquire"
                className="btn-secondary"
                aria-label={`Consult with ${expert.fullName}`}
              >
                Commission Advisory
              </a>
              <Link
                href="/contact"
                className="btn-outline"
                aria-label={`Contact ${expert.fullName}`}
              >
                Contact Desk
              </Link>

              {/* External Academic Links */}
              <div className="flex items-center gap-2 ml-auto">
                {expert.linkedin && (
                  <a
                    href={expert.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-geo-navy-light border border-white/15 font-mono text-[10px] uppercase tracking-[0.16em] text-geo-slate-light hover:text-geo-gold hover:border-geo-gold transition-colors"
                    aria-label="LinkedIn profile"
                  >
                    IN
                  </a>
                )}
                {expert.researchgate && (
                  <a
                    href={expert.researchgate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-geo-navy-light border border-white/15 font-mono text-[10px] uppercase tracking-[0.16em] text-geo-slate-light hover:text-geo-gold hover:border-geo-gold transition-colors"
                    aria-label="ResearchGate profile"
                  >
                    RG
                  </a>
                )}
                {expert.googleScholar && (
                  <a
                    href={expert.googleScholar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-geo-navy-light border border-white/15 font-mono text-[10px] uppercase tracking-[0.16em] text-geo-slate-light hover:text-geo-gold hover:border-geo-gold transition-colors"
                    aria-label="Google Scholar profile"
                  >
                    GS
                  </a>
                )}
                {expert.orcid && (
                  <a
                    href={`https://orcid.org/${expert.orcid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-geo-navy-light border border-white/15 font-mono text-[10px] uppercase tracking-[0.16em] text-geo-slate-light hover:text-geo-gold hover:border-geo-gold transition-colors"
                    aria-label="ORCID profile"
                  >
                    ORCID
                  </a>
                )}
                {expert.website && (
                  <a
                    href={expert.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-geo-navy-light border border-white/15 font-mono text-[10px] uppercase tracking-[0.16em] text-geo-slate-light hover:text-geo-gold hover:border-geo-gold transition-colors"
                    aria-label="Personal website"
                  >
                    WEB
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

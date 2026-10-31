import Link from "next/link";

interface ServiceHeroProps {
  title: string;
  tagline: string | null;
  specializationName: string | null;
  specializationColor: string | null;
}

export function ServiceHero({
  title,
  tagline,
  specializationName,
}: ServiceHeroProps) {
  return (
    <section
      className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 bg-geo-navy geo-grid-bg border-b border-white/10"
      aria-label="Service hero"
    >
      <div className="container-custom">
        {/* Top Metadata Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-white/10 font-mono text-[11px] uppercase tracking-[0.2em] text-geo-slate-light">
          <div className="flex items-center gap-3">
            <Link
              href="/services"
              className="text-geo-gold hover:text-geo-gold-light transition-colors"
            >
              &larr; Practice Directory
            </Link>
            <span className="text-white/20">/</span>
            <span>COMMISSIONING SPECIFICATION</span>
          </div>
          {specializationName && (
            <span className="px-3 py-1 bg-geo-navy-light border border-geo-gold/40 text-geo-gold">
              DOMAIN • {specializationName}
            </span>
          )}
        </div>

        {/* Title & Tagline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <div className="geo-badge mb-5">
              {specializationName ?? "Technical Practice Specification"}
            </div>
            <h1 className="text-display text-geo-white mb-6 [text-wrap:balance]">
              {title}
            </h1>
            {tagline && (
              <p className="text-lg sm:text-xl text-geo-slate-light leading-relaxed max-w-3xl">
                {tagline}
              </p>
            )}
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
            <a href="#inquire" className="btn-primary w-full sm:w-auto text-center">
              Commission Practice Scope
            </a>
            <Link
              href="/geosentry"
              className="btn-outline w-full sm:w-auto text-center"
            >
              48-Hr GeoSentry Screening
            </Link>
          </div>
        </div>

        {/* Bottom Specification Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14 pt-6 border-t border-white/10 font-mono text-xs">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
              REPORTING FRAMEWORK
            </span>
            <span className="text-geo-white">
              JORC / NI 43-101 / Institutional QA-QC
            </span>
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
              DELIVERY FORMAT
            </span>
            <span className="text-geo-white">
              GIS Spatial Layers + Technical Dossier
            </span>
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
              LEADERSHIP
            </span>
            <span className="text-geo-gold">
              Principal Geoscientist Oversight
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllProjects,
  getAllProjectCountries,
  getAllServices,
} from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Consultancy Portfolio & Case Studies | Geo Vision Research Group",
  description:
    "Explore technical case studies and research benchmark projects across mineral prospectivity, multi-spectral alteration mapping, hydrogeology, and rock slope engineering.",
};

interface PortfolioPageProps {
  searchParams: Promise<{
    search?: string;
    country?: string;
    serviceSlug?: string;
  }>;
}

const REGION_COORDINATES: Record<string, string> = {
  Oman: "23°35'N 58°24'E",
  Pakistan: "30°11'N 67°00'E",
  "Saudi Arabia": "24°42'N 46°43'E",
  Turkey: "39°55'N 32°51'E",
  Australia: "25°16'S 133°46'E",
  Canada: "56°07'N 106°20'W",
  Chile: "23°38'S 70°24'W",
};

export default async function PortfolioPage({
  searchParams,
}: PortfolioPageProps) {
  const params = await searchParams;
  const currentSearch = params.search ?? "";
  const currentCountry = params.country ?? "";
  const currentServiceSlug = params.serviceSlug ?? "";

  const [projects, countries, services] = await Promise.all([
    getAllProjects({
      search: currentSearch,
      country: currentCountry,
      serviceSlug: currentServiceSlug,
    }),
    getAllProjectCountries(),
    getAllServices(),
  ]);

  return (
    <>
      {/* Hero Banner — Deep Mineral Navy */}
      <section
        className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-geo-navy geo-grid-bg border-b border-white/10"
        aria-label="Portfolio hero"
      >
        <div className="container-custom">
          {/* Top Metadata Hairline Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-white/10 font-mono text-[11px] uppercase tracking-[0.22em] text-geo-slate-light">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 bg-geo-gold" />
              <span className="text-geo-gold">EDITORIAL FIELD DOSSIER ARCHIVE</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="tabular-nums">ARCHIVED DOSSIERS: {String(projects.length).padStart(2, "0")}</span>
              <span className="hidden sm:inline">SCALE 1:25,000 / 1:50,000</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <div className="geo-badge mb-6">Case Studies &amp; Benchmarks</div>
              <h1 className="text-display text-geo-white mb-4 [text-wrap:balance]">
                Consultancy <span className="italic text-geo-gold pr-2">Portfolio</span>{" "}&amp; Field Dossiers
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pb-2">
              <p className="text-base text-geo-slate-light leading-relaxed border-l border-geo-gold/50 pl-5">
                Technical deliverables and benchmark investigations across mineral exploration, geospatial analysis, basin hydrogeology, and geotechnical engineering.
              </p>
            </div>
          </div>

          {/* 3-Column Monospace Ledger */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14 pt-6 border-t border-white/10 font-mono text-xs">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                COMMODITY COVERAGE
              </span>
              <span className="text-geo-white">
                Cu-Au VMS, Porphyry, Orogenic Au &amp; Critical Minerals
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                SENSOR STACK
              </span>
              <span className="text-geo-white">
                ASTER, Sentinel-2, Aeromagnetics &amp; Structural Mapping
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                ARCHIVE STATUS
              </span>
              <span className="text-geo-gold">
                Verified Benchmark &amp; Client Mandates
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Field Dossier Archive — Warm Alabaster Stone */}
      <section
        className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
        aria-label="Portfolio case studies"
      >
        <div className="container-custom">
          {/* Transparency disclosure banner */}
          <div className="mb-8 bg-[#FAF8F3] border border-geo-stone-border border-l-4 border-l-geo-gold p-5 text-xs text-geo-charcoal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="leading-relaxed">
              <strong className="font-mono uppercase tracking-[0.14em] text-geo-gold-dark mr-2">
                PORTFOLIO DISCLOSURE &bull;
              </strong>
              Seeded portfolio records represent demonstration consultancy case studies and internal methodology benchmarks illustrating our standard analytical workflows.
            </p>
            <Link
              href="/contact"
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-geo-ink font-semibold hover:text-geo-gold-dark shrink-0"
            >
              Request Custom Project Scope &rarr;
            </Link>
          </div>

          {/* Filter Form */}
          <form
            action="/portfolio"
            method="GET"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 p-6 bg-[#FAF8F3] border border-geo-stone-border"
          >
            <div>
              <label
                htmlFor="portfolio-search"
                className="block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-geo-slate mb-1.5"
              >
                Keyword Search
              </label>
              <input
                id="portfolio-search"
                type="search"
                name="search"
                defaultValue={currentSearch}
                placeholder="Search title, commodity, region..."
                className="w-full px-3.5 py-2.5 rounded-none bg-geo-stone border border-geo-stone-border text-sm text-geo-ink placeholder:text-geo-slate focus:outline-none focus:border-geo-gold"
              />
            </div>

            <div>
              <label
                htmlFor="portfolio-country"
                className="block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-geo-slate mb-1.5"
              >
                Country / Basin
              </label>
              <select
                id="portfolio-country"
                name="country"
                defaultValue={currentCountry}
                className="w-full px-3.5 py-2.5 rounded-none bg-geo-stone border border-geo-stone-border text-sm text-geo-ink focus:outline-none focus:border-geo-gold"
              >
                <option value="">All Countries</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="portfolio-service"
                className="block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-geo-slate mb-1.5"
              >
                Discipline / Service
              </label>
              <select
                id="portfolio-service"
                name="serviceSlug"
                defaultValue={currentServiceSlug}
                className="w-full px-3.5 py-2.5 rounded-none bg-geo-stone border border-geo-stone-border text-sm text-geo-ink focus:outline-none focus:border-geo-gold"
              >
                <option value="">All Services</option>
                {services.map((s) => (
                  <option key={s.id} value={s.slug}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-geo-ink text-geo-stone font-mono text-xs uppercase tracking-[0.16em] hover:bg-geo-charcoal transition-colors flex-1"
              >
                Apply Filters
              </button>
              {(currentSearch || currentCountry || currentServiceSlug) && (
                <Link
                  href="/portfolio"
                  className="px-4 py-2.5 bg-geo-stone border border-geo-stone-border font-mono text-xs uppercase tracking-[0.16em] text-geo-ink hover:border-geo-ink"
                >
                  Clear
                </Link>
              )}
            </div>
          </form>

          {/* Field Dossier Plates */}
          {projects.length > 0 ? (
            <div className="space-y-8">
              {projects.map((project, idx) => {
                const dossierCode = `DOSSIER • GVR-${project.year ?? 2025}-${String(idx + 1).padStart(2, "0")}`;
                const locationText =
                  [project.city, project.country].filter(Boolean).join(", ") ||
                  "International";
                const coordinates =
                  (project.country && REGION_COORDINATES[project.country]) ||
                  "24°15'N 56°10'E";
                const commodityOrDiscipline =
                  project.sector ?? project.service?.title ?? "Consultancy Study";

                return (
                  <article
                    key={project.id}
                    className="group bg-[#FAF8F3] border border-geo-stone-border hover:border-geo-gold transition-colors duration-200"
                  >
                    {/* Top Dossier Metadata Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 px-6 sm:px-8 py-3.5 bg-geo-stone-muted/70 border-b border-geo-stone-border font-mono text-[11px] uppercase tracking-[0.18em]">
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-geo-gold-dark tabular-nums">
                          {dossierCode}
                        </span>
                        <span className="text-geo-stone-border">|</span>
                        <span className="text-geo-ink">{commodityOrDiscipline}</span>
                      </div>
                      <div className="flex items-center gap-4 text-geo-slate tabular-nums">
                        <span>COORD &bull; {coordinates}</span>
                        {project.year && (
                          <span className="px-2 py-0.5 bg-[#FAF8F3] border border-geo-stone-border text-geo-ink">
                            {project.year}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Asymmetric 12-Column Case Study Plate */}
                    <div className="grid grid-cols-1 lg:grid-cols-12">
                      {/* Left 8 Cols: Title & Key Findings Narrative */}
                      <div className="lg:col-span-8 p-6 sm:p-8 lg:border-r border-geo-stone-border flex flex-col justify-between">
                        <div>
                          <h2 className="text-2xl sm:text-3xl font-heading text-geo-ink group-hover:text-geo-gold-dark transition-colors mb-4 leading-[1.12]">
                            <Link href={`/portfolio/${project.slug}`}>
                              {project.title}
                            </Link>
                          </h2>

                          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-geo-gold-dark mb-2">
                            KEY FINDINGS &amp; ANALYTICAL SCOPE
                          </span>
                          <p className="text-sm sm:text-base text-geo-charcoal/85 leading-relaxed mb-6">
                            {project.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-geo-stone-border flex items-center justify-between gap-4">
                          {project.service ? (
                            <Link
                              href={`/services/${project.service.slug}`}
                              className="font-mono text-[11px] uppercase tracking-[0.16em] text-geo-slate hover:text-geo-ink"
                            >
                              PRACTICE: {project.service.title}
                            </Link>
                          ) : (
                            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-geo-slate">
                              PRACTICE: GEOLOGICAL ADVISORY
                            </span>
                          )}

                          <Link
                            href={`/portfolio/${project.slug}`}
                            className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-geo-ink group-hover:text-geo-gold-dark transition-colors"
                          >
                            <span>View Case Study</span>
                            <span aria-hidden="true" className="transform group-hover:translate-x-1 transition-transform">
                              &rarr;
                            </span>
                          </Link>
                        </div>
                      </div>

                      {/* Right 4 Cols: Technical Metadata Spec Table */}
                      <div className="lg:col-span-4 p-6 sm:p-8 bg-geo-stone/60 border-t lg:border-t-0 border-geo-stone-border flex flex-col justify-between font-mono text-xs">
                        <div className="space-y-4">
                          <div className="pb-3 border-b border-geo-stone-border">
                            <span className="block text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-1">
                              JURISDICTION &amp; PROVINCE
                            </span>
                            <span className="text-geo-ink font-semibold">
                              {locationText}
                            </span>
                          </div>

                          <div className="pb-3 border-b border-geo-stone-border">
                            <span className="block text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-1">
                              CLIENT SECTOR / MANDATE
                            </span>
                            <span className="text-geo-ink">
                              {project.client ?? "Demonstration Benchmark"}
                            </span>
                          </div>

                          <div className="pb-3 border-b border-geo-stone-border">
                            <span className="block text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-1">
                              GEOLOGICAL COMMODITY / DOMAIN
                            </span>
                            <span className="text-geo-gold-dark font-semibold">
                              {commodityOrDiscipline}
                            </span>
                          </div>

                          <div>
                            <span className="block text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-1">
                              CAMPAIGN DURATION
                            </span>
                            <span className="text-geo-ink tabular-nums">
                              {project.duration ?? "4 Weeks"} ({project.year ?? 2025})
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-geo-stone-border">
                          <Link
                            href={`/portfolio/${project.slug}`}
                            className="block w-full py-2.5 text-center bg-geo-ink text-geo-stone text-[11px] uppercase tracking-[0.16em] font-semibold hover:bg-geo-gold hover:text-geo-navy transition-colors"
                          >
                            Open Technical Report
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 px-6 bg-[#FAF8F3] border border-geo-stone-border">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-geo-slate mb-2">
                NO DOSSIERS MATCHED QUERY
              </p>
              <p className="text-geo-charcoal text-sm mb-6">
                No case studies matched your filter criteria.
              </p>
              <Link
                href="/portfolio"
                className="inline-block px-5 py-2.5 bg-geo-ink text-geo-stone font-mono text-xs uppercase tracking-[0.16em]"
              >
                Reset Portfolio Filters
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

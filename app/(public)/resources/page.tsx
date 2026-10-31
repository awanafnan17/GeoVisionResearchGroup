import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Technical Resources & Frameworks",
  description:
    "Access Geo Vision Research Group technical resources including the GeoSentry 100-Point Screening Framework, Sample Screening Report, professional training courses, and research briefs.",
};

const RESOURCE_CARDS = [
  {
    code: "REF-01",
    badge: "Methodology Framework",
    title: "GeoSentry 100-Point Scoring Framework",
    description:
      "Explore the three weighted evaluation pillars: Geological Assessment (40 pts), Jurisdiction and ESG (40 pts), and Operator Quality (20 pts), plus deposit-specific criteria across 24 mineral systems.",
    href: "/geosentry/framework",
    cta: "Explore 100-Point Framework",
  },
  {
    code: "REF-02",
    badge: "Demonstration Dossier",
    title: "Sample 100-Point Target Screening Report",
    description:
      "Review a complete demonstration screening report showing sub-criterion scoring, risk matrix, technical red flags, and staged pre-drilling recommendations.",
    href: "/geosentry/sample-report",
    cta: "Read Sample Report",
  },
  {
    code: "REF-03",
    badge: "Process Guide",
    title: "How GeoSentry Desktop Screening Works",
    description:
      "Walk through our 5-stage desktop evaluation workflow from target intake and satellite spectral processing to Go, Conditional, or No-Go verdict delivery.",
    href: "/geosentry/how-it-works",
    cta: "View 5-Stage Process",
  },
  {
    code: "REF-04",
    badge: "Client Utility",
    title: "Live GeoSentry Request & Score Tracker",
    description:
      "Track active screening requests, commercial quote details, status history, and delivered 100-point scores using your reference number.",
    href: "/geosentry/track",
    cta: "Open Live Tracker",
  },
  {
    code: "REF-05",
    badge: "Capacity Building",
    title: "Professional Courses & GIS Lab Bundles",
    description:
      "Register for instructor-led courses in ASTER/Sentinel-2 alteration mapping, pre-field mineral due diligence, sequence stratigraphy, and rock mechanics.",
    href: "/courses",
    cta: "Browse Courses",
  },
  {
    code: "REF-06",
    badge: "Knowledge Hub",
    title: "Research Articles & Technical Guides",
    description:
      "Read open-access articles on hydrothermal alteration mapping, sequence stratigraphy in hydrogeology, and capital-efficient mineral exploration.",
    href: "/blog",
    cta: "Read Research Blog",
  },
] as const;

export default function ResourcesPage() {
  return (
    <>
      {/* 00 // Technical Library Header */}
      <section
        className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-geo-navy text-geo-white border-b border-white/15 overflow-hidden"
        aria-label="Resources hero"
      >
        <div className="absolute inset-0 geo-grid-bg opacity-50 pointer-events-none" />

        <div className="relative container-custom">
          <div className="py-4 border-b border-white/10 mb-10 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono uppercase tracking-[0.22em]">
            <span className="text-geo-gold">
              TECHNICAL LIBRARY &bull; FRAMEWORKS, DOSSIERS &amp; PROTOCOLS
            </span>
            <span className="text-geo-slate-light">
              OPEN REFERENCE LEDGER &bull; REV 2026.IV
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <div className="geo-badge mb-5">Technical Library</div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-normal text-geo-white tracking-[-0.02em] leading-[1.04]">
                Geoscience Resources &amp;{" "}
                <span className="italic text-geo-gold">Frameworks</span>
              </h1>
            </div>
            <div className="lg:col-span-4">
              <p className="text-sm sm:text-base text-geo-white-dim leading-relaxed font-sans border-l border-geo-gold pl-5">
                Reference frameworks, sample screening dossiers, professional
                training modules, and methodology guides for exploration teams
                and researchers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 01 // Warm Alabaster Stone — Technical Reference Matrix */}
      <section
        className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
        aria-label="Resources grid"
      >
        <div className="container-custom">
          <div className="editorial-rule-top-dark mb-12 flex flex-wrap items-center justify-between gap-4">
            <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-geo-gold-dark">
              TECHNICAL REFERENCE MATRIX (06 DOCUMENTS)
            </span>
            <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-geo-slate">
              CLASSIFICATION: PUBLIC INSTITUTIONAL ACCESS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-geo-stone-border">
            {RESOURCE_CARDS.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex flex-col justify-between p-8 lg:p-9 bg-geo-stone hover:bg-geo-stone-muted/75 border-r border-b border-geo-stone-border transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-geo-stone-border text-[10px] font-mono uppercase tracking-[0.2em]">
                    <span className="text-geo-gold-dark font-semibold">
                      {item.code}
                    </span>
                    <span className="text-geo-slate">{item.badge}</span>
                  </div>
                  <h2 className="text-2xl font-heading font-normal text-geo-ink group-hover:text-geo-blue transition-colors mb-3 leading-snug">
                    {item.title}
                  </h2>
                  <p className="text-sm text-geo-charcoal/80 leading-relaxed mb-8 font-sans">
                    {item.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-geo-stone-border/70 flex items-center justify-between text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-geo-ink group-hover:text-geo-gold-dark">
                  <span>{item.cta}</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">
                    &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getHomepageStats } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Geo Vision Research Group, our mission in multidisciplinary earth science research, geospatial intelligence, professional capacity building, and GeoSentry pre-field target screening.",
};

export default async function AboutPage() {
  const stats = await getHomepageStats();

  return (
    <>
      {/* 00 // Deep Mineral Navy — Institutional Monograph Header */}
      <section
        className="relative pt-28 pb-20 lg:pt-36 lg:pb-24 bg-geo-navy text-geo-white border-b border-white/15 overflow-hidden"
        aria-label="About hero"
      >
        <div className="absolute inset-0 geo-grid-bg opacity-50 pointer-events-none" />

        <div className="relative container-custom">
          {/* Top Metadata Hairline */}
          <div className="py-4 border-b border-white/10 mb-10 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono uppercase tracking-[0.22em]">
            <span className="text-geo-gold">
              INSTITUTE CHARTER &bull; METHODOLOGY
            </span>
            <span className="text-geo-slate-light">
              EST. 2019 &bull; MULTIDISCIPLINARY EARTH SCIENCES
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <div className="geo-badge mb-6">About Geo Vision</div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-normal text-geo-white tracking-[-0.02em] leading-[1.04]">
                Advancing Earth Science &amp;{" "}
                <span className="italic text-geo-gold">
                  Geospatial Intelligence
                </span>
              </h1>
            </div>
            <div className="lg:col-span-4">
              <p className="text-base text-geo-white-dim leading-relaxed font-sans border-l border-geo-gold pl-5">
                Geo Vision Research Group is an international geoscience
                consultancy, research institute, and professional academy
                connecting academic rigor with resource and infrastructure
                decision-making.
              </p>
            </div>
          </div>

          {/* 4-Column Quantitative Ledger */}
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 border border-white/15 bg-geo-navy-light/70 divide-y sm:divide-y-0 sm:divide-x divide-white/15">
            {[
              {
                code: "01",
                value: `${stats.specializations}+`,
                label: "Earth Science Sub-Disciplines",
              },
              {
                code: "02",
                value: `${stats.services}+`,
                label: "Core Advisory Practice Lines",
              },
              {
                code: "03",
                value: "100-Pt",
                label: "GeoSentry Evaluation Matrix",
              },
              {
                code: "04",
                value: `${stats.countries}+`,
                label: "International Jurisdictions",
              },
            ].map((item) => (
              <div key={item.code} className="p-6">
                <div className="text-[10px] font-mono text-geo-gold uppercase tracking-[0.2em] mb-2">
                  METRIC &bull; {item.code}
                </div>
                <div className="text-3xl lg:text-4xl font-heading font-normal text-geo-white tabular-nums mb-1">
                  {item.value}
                </div>
                <div className="text-xs font-mono text-geo-slate-light uppercase tracking-[0.12em]">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 01 // Warm Alabaster Stone — Institutional Mandate & Practice Pillars */}
      <section
        className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
        aria-label="Mission and pillars"
      >
        <div className="container-custom">
          <div className="editorial-rule-top-dark mb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-geo-gold-dark mb-3">
                INSTITUTIONAL ARCHITECTURE
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-normal text-geo-ink tracking-[-0.02em] leading-[1.06]">
                Three Integrated Pillars of{" "}
                <span className="italic text-geo-blue">
                  Geoscience Practice
                </span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-sm sm:text-base text-geo-charcoal/80 leading-relaxed font-sans">
                Our institute operates at the intersection of applied field
                geology, quantitative satellite remote sensing, and structured
                investment due diligence.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-geo-stone-border divide-y md:divide-y-0 md:divide-x divide-geo-stone-border bg-geo-stone">
            <div className="p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-geo-gold-dark pb-4 mb-6 border-b border-geo-stone-border">
                  MULTIDISCIPLINARY ADVISORY
                </div>
                <h3 className="text-2xl font-heading font-normal text-geo-ink mb-3">
                  Technical Geoscience Consulting
                </h3>
                <p className="text-sm text-geo-charcoal/80 leading-relaxed font-sans mb-6">
                  Spanning {stats.specializations} earth science specializations
                  and {stats.services} core service lines, we execute mineral
                  exploration targeting, geotechnical site investigation,
                  hydrogeological basin modeling, geophysical interpretation, and
                  environmental baseline studies.
                </p>
              </div>
              <Link
                href="/services"
                className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-geo-ink hover:text-geo-gold-dark pt-4 border-t border-geo-stone-border flex items-center justify-between"
              >
                <span>Examine Advisory Services</span>
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="p-8 lg:p-10 flex flex-col justify-between bg-geo-stone-muted/40">
              <div>
                <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-geo-gold-dark pb-4 mb-6 border-b border-geo-stone-border">
                  GEOSENTRY SCREENING
                </div>
                <h3 className="text-2xl font-heading font-normal text-geo-ink mb-3">
                  100-Point Pre-Field Due Diligence
                </h3>
                <p className="text-sm text-geo-charcoal/80 leading-relaxed font-sans mb-6">
                  Our specialized GeoSentry division evaluates mining
                  concessions across Geological Merit (40 pts), Jurisdiction and
                  ESG (40 pts), and Operator Quality (20 pts) before field
                  capital deployment, filtering out non-viable targets early.
                </p>
              </div>
              <Link
                href="/geosentry"
                className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-geo-ink hover:text-geo-gold-dark pt-4 border-t border-geo-stone-border flex items-center justify-between"
              >
                <span>Inspect GeoSentry System</span>
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-geo-gold-dark pb-4 mb-6 border-b border-geo-stone-border">
                  APPLIED CAPACITY BUILDING
                </div>
                <h3 className="text-2xl font-heading font-normal text-geo-ink mb-3">
                  Research &amp; Professional Training
                </h3>
                <p className="text-sm text-geo-charcoal/80 leading-relaxed font-sans mb-6">
                  We bridge industry and academia through instructor-led courses
                  in GIS, ASTER/Sentinel-2 hydrothermal alteration mapping,
                  sequence stratigraphy, and geotechnical rock mass
                  characterization.
                </p>
              </div>
              <Link
                href="/courses"
                className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-geo-ink hover:text-geo-gold-dark pt-4 border-t border-geo-stone-border flex items-center justify-between"
              >
                <span>Browse Academy Syllabi</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 02 // Deep Mineral Navy — Scientific Integrity & Methodological Charter */}
      <section
        className="section-padding bg-geo-navy text-geo-white"
        aria-label="Scientific integrity and leadership"
      >
        <div className="container-custom">
          <div className="editorial-rule-top mb-12 text-[11px] font-mono uppercase tracking-[0.22em] text-geo-gold">
            METHODOLOGICAL STANDARDS &amp; GOVERNANCE
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 border border-white/15 bg-geo-navy-light/70">
            <div className="lg:col-span-8 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-white/15 space-y-6">
              <div className="geo-badge">Scientific Integrity</div>
              <h2 className="text-3xl sm:text-4xl font-heading font-normal text-geo-white tracking-[-0.02em] leading-[1.08]">
                Evidence-Based Geoscience{" "}
                <span className="italic text-geo-gold">Without Hype</span>
              </h2>
              <p className="text-sm sm:text-base text-geo-white-dim leading-relaxed font-sans">
                Every investigation undertaken by Geo Vision Research Group is
                grounded in reproducible spatial datasets, explicit analytical
                assumptions, and a strict separation between remote desktop
                interpretation and field-verified ground truth.
              </p>
              <p className="text-sm sm:text-base text-geo-slate-light leading-relaxed font-sans">
                Our senior geoscientists collaborate across the Tethyan
                metallogenic belt, the Semail Ophiolite and Arabian Shield, and
                international sedimentary basins to deliver objective technical
                guidance for exploration operators, engineering firms, and
                institutional investors.
              </p>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 text-xs font-mono">
                <div>
                  <span className="block text-[10px] text-geo-gold uppercase tracking-[0.18em]">
                    STANDARD I
                  </span>
                  <span className="text-geo-white mt-1 block">
                    Reproducible GIS &amp; Spectral Workflows
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-geo-gold uppercase tracking-[0.18em]">
                    STANDARD II
                  </span>
                  <span className="text-geo-white mt-1 block">
                    Explicit Uncertainty &amp; Red-Flag Logging
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-geo-gold uppercase tracking-[0.18em]">
                    STANDARD III
                  </span>
                  <span className="text-geo-white mt-1 block">
                    Peer-Reviewed Senior Sign-Off
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-8 sm:p-10 bg-geo-navy flex flex-col justify-between gap-6">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-geo-gold mb-2">
                  INSTITUTIONAL DIRECTORY
                </div>
                <h3 className="text-xl font-heading font-normal text-geo-white mb-3">
                  Explore Our Roster &amp; Capabilities
                </h3>
                <p className="text-xs text-geo-slate-light leading-relaxed">
                  Review our published research, examine senior specialist CVs,
                  or commission a confidential desktop study.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/team"
                  className="btn-primary w-full justify-between"
                >
                  <span>Meet Our Expert Team</span>
                  <span>&rarr;</span>
                </Link>
                <Link
                  href="/services"
                  className="btn-secondary w-full justify-between"
                >
                  <span>Explore Our Services</span>
                  <span>&rarr;</span>
                </Link>
                <Link
                  href="/geosentry"
                  className="btn-outline w-full justify-between"
                >
                  <span>GeoSentry Platform</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getAllServices } from "@/lib/public-data";
import { ServicesFilter } from "@/components/public/services-filter";

export const metadata: Metadata = {
  title: "Technical Practice & Services | Geo Vision Research Group",
  description:
    "Comprehensive geoscience consultancy across disciplines. Explore our full range of geological services including mineral exploration, hydrogeology, geophysics, environmental assessment, and geotechnical engineering.",
  keywords: [
    "geoscience services",
    "geology consultancy",
    "mineral exploration",
    "hydrogeology",
    "geophysics",
    "environmental geology",
    "geotechnical",
    "GIS",
    "remote sensing",
  ],
  openGraph: {
    title: "Technical Practice & Services | Geo Vision Research Group",
    description:
      "Comprehensive geoscience consultancy across disciplines. Explore our full range of geological services.",
    type: "website",
  },
};

export default async function ServicesPage() {
  const services = await getAllServices();

  return (
    <>
      {/* Architectural Header — Deep Mineral Navy */}
      <section
        className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-geo-navy geo-grid-bg border-b border-white/10"
        aria-label="Services hero"
      >
        <div className="container-custom">
          {/* Top Metadata Hairline Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-white/10 text-[11px] font-mono uppercase tracking-[0.22em] text-geo-slate-light">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 bg-geo-gold" />
              <span className="text-geo-gold">PRACTICE DIRECTORY</span>
            </div>
            <div className="flex items-center gap-6">
              <span>DISCIPLINES: {String(services.length).padStart(2, "0")}</span>
              <span className="hidden sm:inline">STANDARD: JORC / NI 43-101 / ISO</span>
            </div>
          </div>

          {/* Asymmetric 12-Column Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
            <div className="lg:col-span-8">
              <div className="geo-badge mb-6">Practice Disciplines</div>
              <h1 className="text-display text-geo-white mb-4 [text-wrap:balance]">
                Technical Practice &amp; Advisory{" "}
                <span className="italic text-geo-gold">Services</span>
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pb-2">
              <p className="text-base text-geo-slate-light leading-relaxed border-l border-geo-gold/50 pl-5">
                Structured earth science investigations, multi-spectral remote sensing, basin hydrogeology, and engineering geology delivered by principal specialists for natural-resource and infrastructure mandates.
              </p>
            </div>
          </div>

          {/* 3-Column Monospace Ledger */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14 pt-6 border-t border-white/10 text-xs font-mono">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                METHODOLOGY
              </span>
              <span className="text-geo-white">
                Field Mapping + Multi-Sensor Integration
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                DELIVERABLE FORMAT
              </span>
              <span className="text-geo-white">
                GIS Geodatabases, 3D Block Models &amp; Dossiers
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                COMMISSIONING
              </span>
              <span className="text-geo-gold">
                Fixed-Scope &amp; Retainer Advisory Mandates
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Index Grid — Warm Alabaster Stone */}
      <section
        className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
        aria-label="All services"
      >
        <div className="container-custom">
          <ServicesFilter services={services} />
        </div>
      </section>

      {/* Institutional Commissioning Callout — Deep Mineral Navy */}
      <section
        className="py-20 lg:py-24 bg-geo-navy border-t border-white/10"
        aria-label="Commissioning protocol"
      >
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="geo-badge mb-4">Pre-Fieldwork Intelligence</div>
              <h2 className="text-headline text-geo-white mb-4">
                Require Desktop Target Screening Before Full Field Mobilization?
              </h2>
              <p className="text-base text-geo-slate-light leading-relaxed max-w-2xl">
                Before committing drill or geophysical capital, commission a rapid 48-hour GeoSentry desktop screening dossier or request a tailored multidisciplinary scope from our advisory desk.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:justify-end gap-4">
              <Link href="/geosentry" className="btn-primary">
                Launch GeoSentry Screening
              </Link>
              <Link href="/contact" className="btn-outline">
                Commission Custom Scope
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

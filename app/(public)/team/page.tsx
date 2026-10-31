import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import {
  getAllExperts,
  getAllSpecializations,
  getAllExpertCountries,
} from "@/lib/public-data";
import { ExpertCard } from "@/components/public/expert-card";
import { ExpertFilter } from "@/components/public/expert-filter";

export const metadata: Metadata = {
  title: "Principal Geoscientists & Expert Team | Geo Vision Research Group",
  description:
    "Meet our world-class geoscientists and specialists. Browse our faculty and principal consultants across geology, geophysics, hydrogeology, environmental science, and mineral exploration.",
  keywords: [
    "geoscience experts",
    "geologists",
    "geophysicists",
    "hydrogeologists",
    "environmental scientists",
    "mining consultants",
    "geology team",
  ],
  openGraph: {
    title: "Principal Geoscientists & Expert Team | Geo Vision Research Group",
    description:
      "Meet our world-class geoscientists and specialists across all earth science disciplines.",
    type: "website",
  },
};

interface TeamPageProps {
  searchParams: Promise<{
    search?: string;
    specialization?: string;
    country?: string;
    page?: string;
  }>;
}

async function TeamContent({ searchParams }: TeamPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const [result, specializations, countries] = await Promise.all([
    getAllExperts({
      search: params.search,
      specialization: params.specialization,
      country: params.country,
      page,
    }),
    getAllSpecializations(),
    getAllExpertCountries(),
  ]);

  return (
    <section
      className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
      aria-label="Experts grid"
    >
      <div className="container-custom">
        <ExpertFilter
          specializations={specializations}
          countries={countries}
          currentSearch={params.search ?? ""}
          currentSpecialization={params.specialization ?? ""}
          currentCountry={params.country ?? ""}
          currentPage={result.page}
          totalPages={result.totalPages}
          total={result.total}
        />

        {result.experts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.experts.map((expert, idx) => (
              <ExpertCard
                key={expert.id}
                expert={expert}
                index={(result.page - 1) * result.perPage + idx}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 px-6 text-center bg-[#FAF8F3] border border-geo-stone-border">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-geo-slate mb-2">
              NO MATCHING SPECIALISTS FOUND
            </p>
            <p className="text-geo-charcoal text-sm mb-6">
              No experts found matching your filter criteria.
            </p>
            <Link
              href="/team"
              className="inline-block px-5 py-2.5 font-mono text-xs uppercase tracking-[0.16em] bg-geo-ink text-geo-stone border border-geo-ink"
            >
              Reset Faculty Directory
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default async function TeamPage(props: TeamPageProps) {
  return (
    <>
      {/* Hero Section — Deep Mineral Navy */}
      <section
        className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-geo-navy geo-grid-bg border-b border-white/10"
        aria-label="Team hero"
      >
        <div className="container-custom">
          {/* Top Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-white/10 font-mono text-[11px] uppercase tracking-[0.22em] text-geo-slate-light">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 bg-geo-gold" />
              <span className="text-geo-gold">FACULTY &amp; ADVISORY ROSTER</span>
            </div>
            <div className="flex items-center gap-6">
              <span>MULTIDISCIPLINARY FELLOWS</span>
              <span className="hidden sm:inline">PEER-REVIEWED &amp; FIELD CERTIFIED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <div className="geo-badge mb-6">Faculty &amp; Principal Geoscientists</div>
              <h1 className="text-display text-geo-white mb-4 [text-wrap:balance]">
                Our <span className="italic text-geo-gold pr-2">Expert</span>{" "}Team &amp; Principal Advisors
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pb-2">
              <p className="text-base text-geo-slate-light leading-relaxed border-l border-geo-gold/50 pl-5">
                Senior structural geologists, exploration geochemists, remote sensing specialists, and geotechnical engineers advising institutional and sovereign projects worldwide.
              </p>
            </div>
          </div>

          {/* 3-Column Monospace Ledger */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14 pt-6 border-t border-white/10 font-mono text-xs">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                ACADEMIC STANDING
              </span>
              <span className="text-geo-white">
                Doctoral &amp; Principal Industry Fellows
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                REGIONAL EXPERIENCE
              </span>
              <span className="text-geo-white">
                Tethyan Belt, Arabian Shield &amp; Cratonic Basins
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                ADVISORY ACCESS
              </span>
              <span className="text-geo-gold">
                Direct Technical Consultation &amp; Peer Review
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Experts Monograph Directory — Warm Alabaster Stone */}
      <Suspense
        fallback={
          <section className="section-padding bg-geo-stone text-geo-ink">
            <div className="container-custom text-center font-mono text-xs uppercase tracking-[0.2em] text-geo-slate">
              LOADING SPECIALIST DIRECTORY...
            </div>
          </section>
        }
      >
        <TeamContent searchParams={props.searchParams} />
      </Suspense>

      {/* Advisory Engagement Band — Deep Mineral Navy */}
      <section className="py-20 bg-geo-navy border-t border-white/10" aria-label="Expert engagement">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="geo-badge mb-4">Institutional Retainers</div>
              <h2 className="text-headline text-geo-white mb-3">
                Assemble a Multidisciplinary Geoscience Advisory Panel
              </h2>
              <p className="text-base text-geo-slate-light leading-relaxed max-w-2xl">
                Engage individual specialists for independent technical reviews or commission an integrated exploration and engineering team through our central advisory desk.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:justify-end gap-4">
              <Link href="/contact" className="btn-primary text-center">
                Request Specialist Briefing
              </Link>
              <Link href="/careers" className="btn-outline text-center">
                Apply as Fellow
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

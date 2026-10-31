import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/public-data";
import { sanitizeHtml } from "@/lib/utils";
import { InquiryForm } from "@/components/public/inquiry-form";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.metaTitle ?? project.title} | Geo Vision Research Group`,
    description: project.metaDesc ?? project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const locationText =
    [project.city, project.country].filter(Boolean).join(", ") || "Regional";

  return (
    <>
      {/* Hero — Deep Mineral Navy */}
      <section
        className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 bg-geo-navy geo-grid-bg border-b border-white/10"
        aria-label="Project case study header"
      >
        <div className="container-custom">
          {/* Top Breadcrumb & Dossier Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-white/10 font-mono text-[11px] uppercase tracking-[0.2em] text-geo-slate-light">
            <div className="flex items-center gap-3">
              <Link
                href="/portfolio"
                className="text-geo-gold hover:text-geo-gold-light transition-colors"
              >
                &larr; Back to Portfolio
              </Link>
              <span className="text-white/20">/</span>
              <span>GEOLOGICAL CASE REPORT</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {project.sector && (
                <span className="px-3 py-1 bg-geo-navy-light border border-geo-gold/40 text-geo-gold">
                  {project.sector}
                </span>
              )}
              {project.service && (
                <Link
                  href={`/services/${project.service.slug}`}
                  className="px-3 py-1 bg-geo-navy-light border border-white/15 text-geo-white hover:border-geo-gold transition-colors"
                >
                  {project.service.title}
                </Link>
              )}
            </div>
          </div>

          <h1 className="text-display text-geo-white mb-6 max-w-4xl [text-wrap:balance]">
            {project.title}
          </h1>

          <p className="text-lg sm:text-xl text-geo-slate-light max-w-3xl leading-relaxed mb-10">
            {project.description}
          </p>

          {/* 4-Column Case Report Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-l border-white/15 font-mono">
            <div className="p-5 bg-geo-navy-light/70 border-r border-b border-white/15">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                LOCATION
              </span>
              <span className="text-sm font-semibold text-geo-white">
                {locationText}
              </span>
            </div>
            <div className="p-5 bg-geo-navy-light/70 border-r border-b border-white/15">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                CLIENT &bull; CONTEXT
              </span>
              <span className="text-sm font-semibold text-geo-white">
                {project.client ?? "Demonstration Case"}
              </span>
            </div>
            <div className="p-5 bg-geo-navy-light/70 border-r border-b border-white/15">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                YEAR
              </span>
              <span className="text-sm font-semibold text-geo-white tabular-nums">
                {project.year ?? "2025"}
              </span>
            </div>
            <div className="p-5 bg-geo-navy-light/70 border-r border-b border-white/15">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                DURATION
              </span>
              <span className="text-sm font-semibold text-geo-gold tabular-nums">
                {project.duration ?? "4 Weeks"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Publication-Grade Case Report — Warm Alabaster Stone Reading Columns + Dark Technical Sidebar */}
      <section
        className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
        aria-label="Case study details"
      >
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 8 Columns: Warm Alabaster Stone Reading Column */}
            <div className="lg:col-span-8 space-y-12">
              {/* Study Overview */}
              {project.fullContent && (
                <div className="bg-[#FAF8F3] border border-geo-stone-border p-7 sm:p-10">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-geo-gold-dark mb-2">
                    EXECUTIVE SYNTHESIS
                  </span>
                  <h2 className="text-title text-geo-ink mb-6">
                    Study Overview
                  </h2>
                  <div
                    className="prose max-w-none text-base text-geo-charcoal space-y-4 leading-relaxed [&>p]:mb-4 [&>h2]:text-geo-ink [&>h2]:font-heading [&>h3]:text-geo-ink"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(project.fullContent),
                    }}
                  />
                </div>
              )}

              {/* 3-Stage Technical Investigation Breakdown */}
              <div className="space-y-6">
                {(project.objectives || project.challenge) && (
                  <div className="bg-[#FAF8F3] border border-geo-stone-border border-l-4 border-l-geo-ink p-7 sm:p-8">
                    <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-geo-gold-dark mb-1">
                      01. Objectives &amp; Geological Challenge
                    </span>
                    <h3 className="text-2xl font-heading text-geo-ink mb-3">
                      Technical Scope &amp; Structural Problem
                    </h3>
                    <p className="text-sm sm:text-base text-geo-charcoal leading-relaxed">
                      {project.objectives ?? project.challenge}
                    </p>
                  </div>
                )}

                {(project.methodology || project.solution) && (
                  <div className="bg-[#FAF8F3] border border-geo-stone-border border-l-4 border-l-geo-gold p-7 sm:p-8">
                    <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-geo-gold-dark mb-1">
                      02. Analytical Methodology
                    </span>
                    <h3 className="text-2xl font-heading text-geo-ink mb-3">
                      Multi-Sensor &amp; Field Workflow
                    </h3>
                    <p className="text-sm sm:text-base text-geo-charcoal leading-relaxed">
                      {project.methodology ?? project.solution}
                    </p>
                  </div>
                )}

                {(project.results || project.outcome) && (
                  <div className="bg-[#FAF8F3] border border-geo-stone-border border-l-4 border-l-[#4E7A56] p-7 sm:p-8">
                    <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-geo-gold-dark mb-1">
                      03. Outcomes &amp; Verification
                    </span>
                    <h3 className="text-2xl font-heading text-geo-ink mb-3">
                      Key Findings &amp; Exploration Impact
                    </h3>
                    <p className="text-sm sm:text-base text-geo-charcoal leading-relaxed">
                      {project.results ?? project.outcome}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right 4 Columns: Dark Technical Metadata & Specialist Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-geo-navy text-geo-white border border-geo-gold/40 p-6 sm:p-7">
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-geo-gold mb-3">
                  TECHNICAL DOSSIER METADATA
                </span>
                <h2 className="text-2xl font-heading text-geo-white mb-5">
                  Investigation Specifications
                </h2>

                <dl className="space-y-4 font-mono text-xs">
                  <div className="pb-3 border-b border-white/10">
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-1">
                      DOSSIER REFERENCE
                    </dt>
                    <dd className="text-geo-gold font-semibold">
                      GVR-{project.year ?? 2025}-{project.slug.slice(0, 8).toUpperCase()}
                    </dd>
                  </div>
                  <div className="pb-3 border-b border-white/10">
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-1">
                      TERRANE / LOCATION
                    </dt>
                    <dd className="text-geo-white">{locationText}</dd>
                  </div>
                  <div className="pb-3 border-b border-white/10">
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-1">
                      COMMODITY / SECTOR
                    </dt>
                    <dd className="text-geo-white">
                      {project.sector ?? "Geological Consultancy"}
                    </dd>
                  </div>
                  {project.service && (
                    <div className="pb-3 border-b border-white/10">
                      <dt className="text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-1">
                        PRIMARY PRACTICE
                      </dt>
                      <dd>
                        <Link
                          href={`/services/${project.service.slug}`}
                          className="text-geo-gold hover:underline"
                        >
                          {project.service.title} &rarr;
                        </Link>
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-1">
                      QA/QC COMPLIANCE
                    </dt>
                    <dd className="text-geo-white">
                      Peer-Reviewed Institutional Dossier
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Project Specialists */}
              {project.teamMembers.length > 0 && (
                <div className="bg-geo-navy text-geo-white border border-white/15 p-6 sm:p-7">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-geo-gold mb-2">
                    INVESTIGATION TEAM
                  </span>
                  <h2 className="text-xl font-heading text-geo-white mb-4">
                    Project Specialists
                  </h2>
                  <div className="space-y-3">
                    {project.teamMembers.map((tm) => (
                      <Link
                        key={tm.id}
                        href={`/team/${tm.expertProfile.slug}`}
                        className="block p-4 bg-geo-navy-light border border-white/10 hover:border-geo-gold transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <h3 className="text-base font-heading text-geo-white">
                              {tm.expertProfile.fullName}
                            </h3>
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-geo-slate-light mt-0.5">
                              {tm.role ?? tm.expertProfile.designation}
                            </p>
                          </div>
                          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-geo-gold shrink-0">
                            CV &rarr;
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* Commission a Similar Technical Study — Deep Mineral Navy */}
      <section
        className="section-padding bg-geo-navy"
        aria-label="Commission similar study"
      >
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <InquiryForm
              type="PROJECT_INQUIRY"
              serviceId={project.service?.id}
              defaultSubject={`Case Study Inquiry: ${project.title}`}
              title="Commission a Similar Technical Study"
              subtitle="Discuss how our team can adapt this analytical workflow to your concession, basin, or infrastructure project."
              source={`portfolio-${project.slug}`}
            />
          </div>
        </div>
      </section>
    </>
  );
}

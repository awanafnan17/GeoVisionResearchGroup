import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/public/hero-section";
import { StatsSection } from "@/components/public/stats-section";
import { ServicesPreview } from "@/components/public/services-preview";
import { ExpertsPreview } from "@/components/public/experts-preview";
import { CtaSection } from "@/components/public/cta-section";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import {
  getHomepageStats,
  getFeaturedServices,
  getFeaturedExperts,
  getFeaturedCourses,
  getFeaturedProjects,
  getFeaturedBlogPosts,
} from "@/lib/public-data";
import { formatCurrency, formatDateShort } from "@/lib/utils";

export const metadata: Metadata = {
  title:
    "Geo Vision Research Group | Research, Geospatial Intelligence & Innovation",
  description:
    "Geo Vision Research Group provides multidisciplinary expertise in geospatial intelligence, environmental science, technology, research, and innovation.",
  openGraph: {
    title:
      "Geo Vision Research Group | Research, Geospatial Intelligence & Innovation",
    description:
      "Geo Vision Research Group provides multidisciplinary expertise in geospatial intelligence, environmental science, technology, research, and innovation.",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    siteName: "Geo Vision Research Group",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Geo Vision Research Group",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Geo Vision Research Group | Research, Geospatial Intelligence & Innovation",
    description:
      "Multidisciplinary expertise in geospatial intelligence, environmental science, technology, research, and innovation.",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  },
};

export default async function HomePage() {
  // Parallel database queries preserving real data contract
  const [stats, services, experts, courses, projects, blogPosts] =
    await Promise.all([
      getHomepageStats(),
      getFeaturedServices(),
      getFeaturedExperts(),
      getFeaturedCourses(3),
      getFeaturedProjects(3),
      getFeaturedBlogPosts(3),
    ]);

  return (
    <>
      <Navbar />
      <main id="main-content" role="main" className="overflow-x-hidden">
        {/* 00: Immersive 3D Geological Hero with GSAP Depth Scrubbing */}
        <HeroSection stats={stats} />

        {/* 01: Modern Quantitative Footprint */}
        <StatsSection stats={stats} />

        {/* 02: Core Geoscience & Engineering Advisory Services */}
        <ServicesPreview services={services} />

        {/* 03: GeoSentry 100-Point Target Screening System (Modern Frosted Glass) */}
        <section
          className="relative py-20 lg:py-28 bg-[#060B14]/90 text-slate-100 border-b border-white/10 overflow-hidden"
          aria-label="GeoSentry Screening Platform"
        >
          {/* Ambient Depth Glows */}
          <div className="absolute top-1/3 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="container-custom relative z-10">
            {/* Section Index Header */}
            <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 text-xs font-sans font-medium backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>GeoSentry Target Intelligence &bull; Pre-Field Capital Allocation</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-sans text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>SCREENING STANDARD GS-100</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left 5 Columns: Narrative, Audited Count & Actions */}
              <div className="lg:col-span-5 glass-panel-modern p-8 sm:p-10 rounded-3xl border border-white/10 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-sans font-bold text-white tracking-tight leading-[1.08] mb-5">
                    100-Point Pre-Field{" "}
                    <span className="gradient-text-emerald">
                      Geological Target
                    </span>{" "}
                    Screening.
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-sans">
                    Before committing exploration budgets to trenching, airborne
                    geophysics, or diamond drilling, GeoSentry evaluates mineral
                    concessions across three weighted analytical pillars to
                    issue an auditable{" "}
                    <span className="text-white font-medium">
                      Go, Conditional, or No-Go
                    </span>{" "}
                    capital allocation verdict.
                  </p>

                  {/* Real Database Count Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-xs font-sans text-slate-200 mb-8">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Concessions Screened:</span>
                    <span className="font-mono font-bold text-emerald-400 tabular-nums">
                      {stats.geosentryRequests}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/geosentry/request"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#060B14] font-sans font-semibold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:-translate-y-0.5"
                    >
                      <span>Request Target Screening</span>
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                    <Link
                      href="/geosentry/sample-report"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg glass-panel-interactive text-white font-sans font-medium text-xs transition-all hover:-translate-y-0.5"
                    >
                      <span>View Sample Report</span>
                    </Link>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
                    <Link
                      href="/geosentry"
                      className="text-emerald-400 hover:text-cyan-300 transition-colors"
                    >
                      Explore GeoSentry Platform &rarr;
                    </Link>
                    <Link
                      href="/geosentry/track"
                      className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>Track Screening Reference &rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right 7 Columns: 100-Point Evaluation Matrix & Verdict Bands */}
              <div className="lg:col-span-7 glass-panel-modern p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
                <div>
                  {/* Matrix Header */}
                  <div className="pb-5 mb-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-sans text-emerald-400 font-medium">
                        Weighted Evaluation Methodology
                      </span>
                      <h3 className="text-xl font-sans font-bold text-white mt-0.5">
                        100-Point Due Diligence Matrix
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-xs font-mono font-semibold text-emerald-400 tabular-nums">
                      100 PTS TOTAL
                    </span>
                  </div>

                  {/* 3 Weighted Pillars */}
                  <div className="space-y-4 mb-6">
                    {[
                      {
                        code: "PILLAR I",
                        pillar: "Geological Assessment & Deposit Fit",
                        points: "40 PTS",
                        barWidth: "w-[40%]",
                        barColor: "bg-emerald-400",
                        textColor: "text-emerald-400",
                        desc: "Tectonic framework, deposit model conformance, ASTER/Sentinel-2 hydrothermal alteration footprint, and structural trap geometry.",
                        subcriteria: "4 Sub-Criteria &times; 10 Pts",
                      },
                      {
                        code: "PILLAR II",
                        pillar: "Jurisdiction, Tenure & ESG Risk",
                        points: "40 PTS",
                        barWidth: "w-[40%]",
                        barColor: "bg-cyan-400",
                        textColor: "text-cyan-400",
                        desc: "Cadastral license standing, protected area & buffer conflicts, surface security, water availability, and transport corridor access.",
                        subcriteria: "4 Sub-Criteria &times; 10 Pts",
                      },
                      {
                        code: "PILLAR III",
                        pillar: "Operator Track Record & Workplan",
                        points: "20 PTS",
                        barWidth: "w-[20%]",
                        barColor: "bg-amber-400",
                        textColor: "text-amber-400",
                        desc: "Technical team credentials, exploration stage realism, QA/QC readiness, and capital efficiency of proposed Phase-1 budget.",
                        subcriteria: "2 Sub-Criteria &times; 10 Pts",
                      },
                    ].map((item) => (
                      <div
                        key={item.code}
                        className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <span className={`text-xs font-mono font-medium ${item.textColor}`}>
                              {item.code}
                            </span>
                            <h4 className="text-sm font-sans font-semibold text-white">
                              {item.pillar}
                            </h4>
                          </div>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-slate-400 font-sans" dangerouslySetInnerHTML={{ __html: item.subcriteria }} />
                            <span className={`font-mono font-bold ${item.textColor} tabular-nums`}>
                              {item.points}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-3 font-sans">
                          {item.desc}
                        </p>
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className={`h-full rounded-full ${item.barColor} ${item.barWidth}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verdict Threshold Bands */}
                <div className="p-4 rounded-xl border border-white/10 bg-black/30 flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 font-mono text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      70–100: PROCEED (GO)
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-400 font-mono text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      50–69: CONDITIONAL
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/15 text-red-400 font-mono text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      0–49: NO-GO
                    </span>
                  </div>
                  <Link
                    href="/geosentry/framework"
                    className="text-emerald-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    Methodology Framework &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04: Senior Geoscience Faculty Roster */}
        <ExpertsPreview experts={experts} />

        {/* 05: Featured Training Courses & Technical Workshops */}
        <section
          className="relative py-20 lg:py-28 bg-[#0B1324]/85 text-slate-100 border-b border-white/10 overflow-hidden"
          aria-label="Featured training courses"
        >
          <div className="container-custom relative z-10">
            <div className="mb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 text-xs font-sans font-medium mb-4 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Technical Academy &amp; Capacity Building</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-white leading-[1.08]">
                  Featured Training{" "}
                  <span className="gradient-text-emerald">
                    Courses &amp; Workshops
                  </span>
                </h2>
              </div>
              <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                  Instructor-led technical courses and applied workshops in GIS,
                  multi-spectral remote sensing, mineral exploration, and
                  sedimentary basin analysis.
                </p>
                <div>
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-emerald-400 hover:text-cyan-300 pb-1 transition-colors"
                  >
                    <span>Browse All Courses</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>

            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.map((course) => {
                  return (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      className="glass-panel-interactive p-7 sm:p-8 rounded-2xl flex flex-col justify-between group transition-all duration-300 hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] hover:border-emerald-500/40"
                    >
                      <div>
                        <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10 text-xs">
                          <span className="font-sans text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                            {course.mode.replace("_", " ")} &bull; {course.durationText || "Self-Paced"}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-semibold text-xs tabular-nums">
                            {course.isFree
                              ? "OPEN ACCESS"
                              : formatCurrency(
                                  course.earlyBirdFee ?? course.fee ?? 0,
                                  course.currency
                                )}
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-sans font-bold text-white group-hover:text-emerald-300 transition-colors mb-3 leading-snug">
                          {course.title}
                        </h3>

                        <p className="text-sm text-slate-300 leading-relaxed mb-6 line-clamp-3 font-sans">
                          {course.tagline ?? course.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-sans text-slate-400">
                        <span>
                          {course.durationText ??
                            (course.startDate
                              ? formatDateShort(course.startDate)
                              : "Flexible Cohort")}
                        </span>
                        <span className="text-emerald-400 group-hover:translate-x-1.5 transition-transform font-medium">
                          Explore Course &rarr;
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="glass-panel-modern p-12 rounded-2xl text-center text-slate-400 font-sans text-sm">
                Upcoming courses will be announced shortly.
              </div>
            )}
          </div>
        </section>

        {/* 06: Selected Research Case Studies & Publications (Deep Glass Canvas, NO WARM STONE) */}
        <section
          className="relative py-20 lg:py-28 bg-[#060B14]/90 text-slate-100 border-b border-white/10 overflow-hidden"
          aria-label="Selected research and consultancy portfolio"
        >
          <div className="container-custom relative z-10 space-y-24">
            {/* Part A: Selected Case Studies */}
            <div>
              <div className="mb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 text-xs font-sans font-medium mb-4 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Field &amp; Desktop Case Studies</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-white leading-[1.08]">
                    Selected Research &amp;{" "}
                    <span className="gradient-text-emerald">
                      Consultancy Portfolio
                    </span>
                  </h2>
                </div>
                <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                    Representative technical studies across mineral
                    prospectivity, multi-spectral alteration mapping,
                    hydrogeology, and rock slope engineering.
                  </p>
                  <div>
                    <Link
                      href="/portfolio"
                      className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-emerald-400 hover:text-cyan-300 pb-1 transition-colors"
                    >
                      <span>View Full Portfolio</span>
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>

              {projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.map((project) => {
                    return (
                      <Link
                        key={project.id}
                        href={`/portfolio/${project.slug}`}
                        className="glass-panel-interactive p-6 sm:p-8 rounded-2xl group grid grid-cols-1 lg:grid-cols-12 gap-6 items-center transition-all duration-300 hover:border-emerald-500/40 hover:shadow-[0_20px_40px_rgba(16,185,129,0.12)]"
                      >
                        <div className="lg:col-span-3 flex flex-col gap-1 text-xs">
                          <span className="text-emerald-400 font-sans text-xs font-semibold uppercase tracking-wider">
                            {[project.country || "Global", project.sector || project.service?.title || "Technical Study"].filter(Boolean).join(" • ")}
                          </span>
                          <span className="text-white font-sans font-medium text-sm">
                            {project.sector ??
                              project.service?.title ??
                              "Technical Study"}
                          </span>
                          <span className="text-slate-400 text-xs font-sans">
                            {[project.city, project.country]
                              .filter(Boolean)
                              .join(", ") || "Regional Basin Study"}
                            {project.year ? ` • ${project.year}` : ""}
                          </span>
                        </div>

                        <div className="lg:col-span-7">
                          <h3 className="text-xl sm:text-2xl font-sans font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                            {project.title}
                          </h3>
                          <p className="text-sm text-slate-300 leading-relaxed line-clamp-2 font-sans">
                            {project.description}
                          </p>
                        </div>

                        <div className="lg:col-span-2 lg:text-right">
                          <span className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-emerald-400 group-hover:text-cyan-300 transition-colors">
                            <span>View Case Study</span>
                            <span className="transform group-hover:translate-x-1.5 transition-transform">
                              &rarr;
                            </span>
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="glass-panel-modern p-12 rounded-2xl text-center text-slate-400 font-sans text-sm">
                  Portfolio studies are being updated.
                </div>
              )}
            </div>

            {/* Part B: Research Journal & Technical Notes */}
            {blogPosts.length > 0 && (
              <div>
                <div className="mb-14 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 text-xs font-sans font-medium mb-4 backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Publications &amp; Field Notes</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-white leading-[1.08]">
                      Recent Research Insights &amp;{" "}
                      <span className="gradient-text-emerald">
                        Technical Notes
                      </span>
                    </h2>
                  </div>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-emerald-400 hover:text-cyan-300 pb-1 transition-colors self-start lg:self-auto"
                  >
                    <span>Read Research Journal</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {blogPosts.map((post) => {
                    return (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="glass-panel-interactive p-7 sm:p-8 rounded-2xl flex flex-col justify-between group transition-all duration-300 hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] hover:border-emerald-500/40"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs pb-3 mb-4 border-b border-white/10 text-slate-400">
                            <span className="text-emerald-400 font-sans text-xs font-medium">
                              {post.category || "Research"} &bull; {post.readTime || "5 min read"}
                            </span>
                            <span className="font-sans">
                              {formatDateShort(
                                post.publishedAt ?? post.createdAt
                              )}
                            </span>
                          </div>
                          <h3 className="text-lg sm:text-xl font-sans font-bold text-white group-hover:text-emerald-300 transition-colors mb-3 leading-snug">
                            {post.title}
                          </h3>
                          <p className="text-sm text-slate-300 leading-relaxed mb-6 line-clamp-3 font-sans">
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-sans text-slate-400 group-hover:text-emerald-400 transition-colors">
                          <span>Technical Publication</span>
                          <span className="font-medium">Read Article &rarr;</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 07: Modern Frosted-Glass Commissioning Desk */}
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}

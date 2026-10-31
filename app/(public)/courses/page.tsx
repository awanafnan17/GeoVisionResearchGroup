import type { Metadata } from "next";
import Link from "next/link";
import { getAllCourses } from "@/lib/public-data";
import { formatCurrency, formatDateShort } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Professional Geoscience Courses & Training | Geo Vision Research Group",
  description:
    "Applied instructor-led training programs in GIS, multi-spectral remote sensing, mineral exploration target screening, sequence stratigraphy, and engineering geology.",
};

interface CoursesPageProps {
  searchParams: Promise<{
    search?: string;
    mode?: string;
  }>;
}

const MODE_FILTERS = [
  { value: "", label: "All Modes" },
  { value: "ONLINE", label: "Online" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "IN_PERSON", label: "In Person" },
] as const;

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams;
  const currentSearch = params.search ?? "";
  const currentMode = params.mode ?? "";

  const courses = await getAllCourses({
    search: currentSearch,
    mode: currentMode,
  });

  return (
    <>
      {/* Hero Banner — Deep Mineral Navy */}
      <section
        className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-geo-navy geo-grid-bg border-b border-white/10"
        aria-label="Courses hero"
      >
        <div className="container-custom">
          {/* Top Metadata Hairline Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-white/10 font-mono text-[11px] uppercase tracking-[0.22em] text-geo-slate-light">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 bg-geo-gold" />
              <span className="text-geo-gold">EXECUTIVE SYLLABUS LEDGER</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="tabular-nums">ACTIVE SEMINARS: {String(courses.length).padStart(2, "0")}</span>
              <span className="hidden sm:inline">ACCREDITED CERTIFICATE PROGRAMS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <div className="geo-badge mb-6">Training &amp; Capacity Building</div>
              <h1 className="text-display text-geo-white mb-4 [text-wrap:balance]">
                Professional Geoscience <span className="italic text-geo-gold pr-2">Courses</span>{" "}&amp; Seminars
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pb-2">
              <p className="text-base text-geo-slate-light leading-relaxed border-l border-geo-gold/50 pl-5">
                Hands-on technical training designed by practicing geoscientists, combining real satellite, borehole, and exploration datasets with modern analytical software.
              </p>
            </div>
          </div>

          {/* 3-Column Monospace Ledger */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14 pt-6 border-t border-white/10 font-mono text-xs">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                CURRICULUM DESIGN
              </span>
              <span className="text-geo-white">
                Real Concession &amp; Borehole Datasets
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                DELIVERY FORMAT
              </span>
              <span className="text-geo-white">
                Live Instructor-Led &amp; Hybrid Cohorts
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                CERTIFICATION
              </span>
              <span className="text-geo-gold">
                Verified Geo Vision Competency Credential
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Syllabus Ledger & Courses Catalog — Warm Alabaster Stone */}
      <section
        className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
        aria-label="Course catalog"
      >
        <div className="container-custom">
          {/* Filter Controls */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-12 p-6 bg-[#FAF8F3] border border-geo-stone-border">
            {/* Mode filter tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-geo-slate mr-2">
                DELIVERY MODE:
              </span>
              {MODE_FILTERS.map((m) => {
                const isActive = currentMode === m.value;
                const href = m.value
                  ? `/courses?mode=${encodeURIComponent(m.value)}${
                      currentSearch ? `&search=${encodeURIComponent(currentSearch)}` : ""
                    }`
                  : `/courses${
                      currentSearch ? `?search=${encodeURIComponent(currentSearch)}` : ""
                    }`;
                return (
                  <Link
                    key={m.label}
                    href={href}
                    className={`px-4 py-2 rounded-none font-mono text-[11px] uppercase tracking-[0.16em] border transition-colors ${
                      isActive
                        ? "bg-geo-ink text-geo-stone border-geo-ink font-semibold"
                        : "bg-geo-stone text-geo-charcoal border-geo-stone-border hover:border-geo-ink"
                    }`}
                  >
                    {m.label}
                  </Link>
                );
              })}
            </div>

            {/* Search form */}
            <form action="/courses" method="GET" className="flex items-center">
              {currentMode && (
                <input type="hidden" name="mode" value={currentMode} />
              )}
              <input
                type="search"
                name="search"
                defaultValue={currentSearch}
                placeholder="Search syllabus by topic..."
                aria-label="Search courses"
                className="w-full sm:w-64 px-4 py-2.5 rounded-none bg-geo-stone border border-geo-stone-border text-sm text-geo-ink placeholder:text-geo-slate focus:outline-none focus:border-geo-gold"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-geo-ink text-geo-stone font-mono text-xs uppercase tracking-[0.16em] hover:bg-geo-charcoal transition-colors shrink-0"
              >
                Search
              </button>
            </form>
          </div>

          {/* Course Cards — Executive Syllabus Ledger */}
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, idx) => {
                const courseCode = `GVR-CRS-${String(idx + 1).padStart(2, "0")}`;
                const seatsRemaining =
                  course.maxSeats !== null
                    ? Math.max(0, course.maxSeats - course.enrolledCount)
                    : null;
                const hasActiveEarlyBird =
                  course.earlyBirdFee !== null &&
                  course.earlyBirdDeadline !== null &&
                  new Date(course.earlyBirdDeadline) >= new Date();
                const levelLabel = course.specialization?.name
                  ? `${course.specialization.name} · Applied`
                  : "Professional Seminar";

                return (
                  <article
                    key={course.id}
                    className="group flex flex-col justify-between bg-[#FAF8F3] text-geo-ink border border-geo-stone-border hover:border-geo-gold transition-colors duration-200"
                  >
                    <div>
                      {/* Top Monospace Course Code & Mode Bar */}
                      <div className="flex items-center justify-between gap-2 px-6 py-3.5 bg-geo-stone-muted/70 border-b border-geo-stone-border font-mono text-[10px] uppercase tracking-[0.18em]">
                        <span className="font-semibold text-geo-gold-dark tabular-nums">
                          {courseCode}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-[#FAF8F3] border border-geo-stone-border text-geo-ink">
                            {course.mode.replace("_", " ")}
                          </span>
                          {course.certificate && (
                            <span className="px-2 py-0.5 bg-geo-ink text-geo-stone">
                              CERTIFIED
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-6 sm:p-7">
                        {/* Level Eyebrow */}
                        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-2">
                          LEVEL &bull; {levelLabel}
                        </span>

                        {/* Title */}
                        <h2 className="text-2xl font-heading text-geo-ink group-hover:text-geo-gold-dark transition-colors mb-3 leading-[1.15]">
                          <Link href={`/courses/${course.slug}`}>
                            {course.title}
                          </Link>
                        </h2>

                        {/* Tagline / description */}
                        <p className="text-sm text-geo-charcoal/80 leading-relaxed mb-6 line-clamp-3">
                          {course.tagline ?? course.description}
                        </p>

                        {/* Structured Syllabus Metadata Ledger */}
                        <div className="border-t border-geo-stone-border pt-4 space-y-2.5 font-mono text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-[0.16em] text-geo-slate">
                              DURATION
                            </span>
                            <span className="text-geo-ink font-medium tabular-nums">
                              {course.durationText ?? "4 Weeks Intensive"}
                            </span>
                          </div>
                          {course.startDate && (
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase tracking-[0.16em] text-geo-slate">
                                COMMENCEMENT
                              </span>
                              <span className="text-geo-ink font-medium tabular-nums">
                                {formatDateShort(course.startDate)}
                              </span>
                            </div>
                          )}
                          {course.instructor && (
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] uppercase tracking-[0.16em] text-geo-slate shrink-0">
                                INSTRUCTOR
                              </span>
                              <span className="text-geo-ink font-medium truncate">
                                {course.instructor.fullName}
                              </span>
                            </div>
                          )}
                          {seatsRemaining !== null && (
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase tracking-[0.16em] text-geo-slate">
                                ALLOCATION
                              </span>
                              <span className="text-geo-gold-dark font-semibold tabular-nums">
                                {seatsRemaining} / {course.maxSeats} SEATS OPEN
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Pricing & CTA */}
                    <div className="px-6 py-4 bg-geo-stone-muted/40 border-t border-geo-stone-border flex items-center justify-between gap-4">
                      <div className="font-mono tabular-nums">
                        {course.isFree ? (
                          <div>
                            <span className="text-base font-bold text-geo-ink uppercase">
                              USD $0 (FREE)
                            </span>
                            <span className="block text-[9px] text-geo-slate uppercase tracking-[0.16em]">
                              OPEN ACCESS COHORT
                            </span>
                          </div>
                        ) : hasActiveEarlyBird && course.earlyBirdFee !== null ? (
                          <div>
                            <span className="text-lg font-bold text-geo-gold-dark">
                              {formatCurrency(course.earlyBirdFee, course.currency)}
                            </span>
                            {course.fee !== null && (
                              <span className="ml-2 text-xs text-geo-slate line-through">
                                {formatCurrency(course.fee, course.currency)}
                              </span>
                            )}
                            <span className="block text-[9px] text-geo-gold-dark uppercase tracking-[0.16em]">
                              EARLY-BIRD TUITION (USD)
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-lg font-bold text-geo-ink">
                              {formatCurrency(course.fee ?? 0, course.currency)}
                            </span>
                            <span className="block text-[9px] text-geo-slate uppercase tracking-[0.16em]">
                              STANDARD TUITION (USD)
                            </span>
                          </div>
                        )}
                      </div>

                      <Link
                        href={`/courses/${course.slug}`}
                        className="px-4 py-2.5 bg-geo-ink text-geo-stone font-mono text-[11px] font-semibold uppercase tracking-[0.16em] hover:bg-geo-gold hover:text-geo-navy transition-colors shrink-0"
                      >
                        View &amp; Enroll &rarr;
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 px-6 bg-[#FAF8F3] border border-geo-stone-border">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-geo-slate mb-2">
                NO SEMINARS MATCHED FILTER
              </p>
              <p className="text-geo-charcoal text-sm mb-6">
                No courses matched your filter criteria.
              </p>
              <Link
                href="/courses"
                className="inline-block px-5 py-2.5 bg-geo-ink text-geo-stone font-mono text-xs uppercase tracking-[0.16em]"
              >
                Reset Filters
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Corporate Capacity Building Callout — Deep Mineral Navy */}
      <section className="py-20 bg-geo-navy border-t border-white/10" aria-label="Corporate training">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="geo-badge mb-4">Institutional Capacity Building</div>
              <h2 className="text-headline text-geo-white mb-3">
                Commission a Custom In-House Geoscience Workshop
              </h2>
              <p className="text-base text-geo-slate-light leading-relaxed max-w-2xl">
                Our instructors deliver bespoke technical training for geological surveys, mining companies, and university departments using your organization&apos;s proprietary datasets.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:justify-end gap-4">
              <Link href="/contact" className="btn-primary text-center">
                Request Corporate Syllabus
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/public-data";
import { generateCourseMetadata, generateCourseSchema } from "@/lib/seo";
import {
  formatCurrency,
  formatDate,
  sanitizeHtml,
  safeJsonLd,
} from "@/lib/utils";
import { CourseEnrollForm } from "@/components/public/course-enroll-form";

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CourseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course Not Found" };
  return generateCourseMetadata(course);
}

interface SyllabusItem {
  week?: string;
  module?: string;
  title?: string;
  topics?: string[];
  description?: string;
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const seatsRemaining =
    course.maxSeats !== null
      ? Math.max(0, course.maxSeats - course.enrolledCount)
      : null;

  const hasActiveEarlyBird =
    course.earlyBirdFee !== null &&
    course.earlyBirdDeadline !== null &&
    new Date(course.earlyBirdDeadline) >= new Date();

  const effectiveFee = course.isFree
    ? 0
    : hasActiveEarlyBird && course.earlyBirdFee !== null
      ? course.earlyBirdFee
      : course.fee ?? 0;

  const outcomes: string[] = Array.isArray(course.learningOutcomes)
    ? course.learningOutcomes.map((item) => String(item))
    : [];

  const includesList: string[] = Array.isArray(course.includes)
    ? course.includes.map((item) => String(item))
    : [];

  const syllabusModules: SyllabusItem[] = Array.isArray(course.syllabus)
    ? (course.syllabus as SyllabusItem[])
    : [];

  const courseSchema = generateCourseSchema({
    title: course.title,
    tagline: course.tagline,
    slug: course.slug,
    description: course.description,
    startDate: course.startDate ? course.startDate.toISOString() : null,
    fee: effectiveFee,
    currency: course.currency,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(courseSchema) }}
      />

      {/* Prospectus Header — Deep Mineral Navy */}
      <section
        className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 bg-geo-navy geo-grid-bg border-b border-white/10"
        aria-label="Course header"
      >
        <div className="container-custom">
          {/* Top Breadcrumb & Prospectus Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-white/10 font-mono text-[11px] uppercase tracking-[0.2em] text-geo-slate-light">
            <div className="flex items-center gap-3">
              <Link
                href="/courses"
                className="text-geo-gold hover:text-geo-gold-light transition-colors"
              >
                &larr; Back to All Courses
              </Link>
              <span className="text-white/20">/</span>
              <span>EXECUTIVE SEMINAR PROSPECTUS</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-geo-navy-light border border-geo-gold/40 text-geo-gold">
                {course.mode.replace("_", " ")}
              </span>
              {course.specialization && (
                <span className="px-2.5 py-1 bg-geo-navy-light border border-white/15 text-geo-white">
                  {course.specialization.name}
                </span>
              )}
              {course.certificate && (
                <span className="px-2.5 py-1 bg-geo-gold text-geo-navy font-semibold">
                  VERIFIED CERTIFICATE
                </span>
              )}
            </div>
          </div>

          <h1 className="text-display text-geo-white mb-5 max-w-4xl [text-wrap:balance]">
            {course.title}
          </h1>

          {course.tagline && (
            <p className="text-lg sm:text-xl text-geo-slate-light max-w-3xl leading-relaxed mb-10">
              {course.tagline}
            </p>
          )}

          {/* 4-Column Prospectus Key Metadata Ledger */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-l border-white/15 font-mono">
            <div className="p-5 bg-geo-navy-light/70 border-r border-b border-white/15">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                DURATION
              </span>
              <span className="text-sm font-semibold text-geo-white tabular-nums">
                {course.durationText ?? "Self-Paced / Flexible"}
              </span>
            </div>
            <div className="p-5 bg-geo-navy-light/70 border-r border-b border-white/15">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                START DATE
              </span>
              <span className="text-sm font-semibold text-geo-white tabular-nums">
                {course.startDate ? formatDate(course.startDate) : "Open Enrollment"}
              </span>
            </div>
            <div className="p-5 bg-geo-navy-light/70 border-r border-b border-white/15">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                SCHEDULE &amp; VENUE
              </span>
              <span className="text-sm font-semibold text-geo-white">
                {course.schedule ?? course.location ?? "Live Online"}
              </span>
            </div>
            <div className="p-5 bg-geo-navy-light/70 border-r border-b border-white/15">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                SEATS REMAINING
              </span>
              <span className="text-sm font-semibold text-geo-gold tabular-nums">
                {seatsRemaining !== null
                  ? `${seatsRemaining} of ${course.maxSeats} available`
                  : "Open Seats"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Prospectus Content + Enrollment Sidebar — Warm Alabaster Stone */}
      <section
        className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
        aria-label="Course details and enrollment"
      >
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Course Overview, Outcomes, Syllabus, Instructor */}
            <div className="lg:col-span-7 space-y-12">
              {/* Overview */}
              <div className="bg-[#FAF8F3] border border-geo-stone-border p-7 sm:p-9">
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-geo-gold-dark mb-2">
                  ACADEMIC SCOPE
                </span>
                <h2 className="text-title text-geo-ink mb-5">
                  Course Overview
                </h2>
                <p className="text-base text-geo-charcoal leading-relaxed mb-5">
                  {course.description}
                </p>
                {course.fullContent && (
                  <div
                    className="prose max-w-none text-sm text-geo-charcoal/90 space-y-3 leading-relaxed [&>p]:mb-4 [&>h2]:text-geo-ink [&>h2]:font-heading [&>h3]:text-geo-ink [&>ul>li]:text-geo-charcoal"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(course.fullContent),
                    }}
                  />
                )}
              </div>

              {/* Learning Outcomes */}
              {outcomes.length > 0 && (
                <div className="bg-[#FAF8F3] border border-geo-stone-border p-7 sm:p-9">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-geo-gold-dark mb-2">
                    APPLIED COMPETENCIES
                  </span>
                  <h2 className="text-title text-geo-ink mb-6">
                    What You Will Learn
                  </h2>
                  <div className="border-t border-geo-stone-border">
                    {outcomes.map((outcome, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 py-4 border-b border-geo-stone-border text-sm text-geo-ink"
                      >
                        <span className="font-mono text-xs font-semibold text-geo-gold-dark tabular-nums shrink-0 mt-0.5">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="leading-relaxed">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Syllabus */}
              {syllabusModules.length > 0 && (
                <div className="bg-[#FAF8F3] border border-geo-stone-border p-7 sm:p-9">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-geo-gold-dark mb-2">
                    CURRICULUM BREAKDOWN
                  </span>
                  <h2 className="text-title text-geo-ink mb-6">
                    Course Syllabus
                  </h2>
                  <div className="space-y-4">
                    {syllabusModules.map((mod, idx) => (
                      <div
                        key={idx}
                        className="bg-geo-stone border border-geo-stone-border p-5"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3 mb-3 border-b border-geo-stone-border">
                          <h3 className="text-lg font-heading text-geo-ink">
                            {mod.title ?? "Technical Session"}
                          </h3>
                          <span className="px-2.5 py-0.5 bg-geo-ink text-geo-stone font-mono text-[10px] uppercase tracking-[0.16em]">
                            {mod.week ?? mod.module ?? `MODULE ${String(idx + 1).padStart(2, "0")}`}
                          </span>
                        </div>
                        {Array.isArray(mod.topics) && mod.topics.length > 0 && (
                          <ul className="space-y-1.5 text-xs text-geo-charcoal">
                            {mod.topics.map((t, tIdx) => (
                              <li key={tIdx} className="flex items-start gap-2">
                                <span className="font-mono text-[10px] text-geo-gold-dark mt-0.5">
                                  &mdash;
                                </span>
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {mod.description && (
                          <p className="text-xs text-geo-charcoal/85 mt-2 leading-relaxed">
                            {mod.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prerequisites & Target Audience */}
              {(course.prerequisites || course.targetAudience) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {course.prerequisites && (
                    <div className="bg-[#FAF8F3] border border-geo-stone-border p-6">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-geo-gold-dark mb-1.5">
                        REQUIREMENTS
                      </span>
                      <h3 className="text-xl font-heading text-geo-ink mb-2">
                        Prerequisites
                      </h3>
                      <p className="text-xs text-geo-charcoal leading-relaxed">
                        {course.prerequisites}
                      </p>
                    </div>
                  )}
                  {course.targetAudience && (
                    <div className="bg-[#FAF8F3] border border-geo-stone-border p-6">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-geo-gold-dark mb-1.5">
                        PARTICIPANT PROFILE
                      </span>
                      <h3 className="text-xl font-heading text-geo-ink mb-2">
                        Target Audience
                      </h3>
                      <p className="text-xs text-geo-charcoal leading-relaxed">
                        {course.targetAudience}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Instructor Profile */}
              {course.instructor && (
                <div className="bg-[#FAF8F3] border border-geo-stone-border p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-geo-gold-dark mb-1">
                      SEMINAR DIRECTOR &amp; INSTRUCTOR
                    </span>
                    <h3 className="text-2xl font-heading text-geo-ink">
                      {course.instructor.fullName}
                    </h3>
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-geo-slate mt-1">
                      {course.instructor.designation}
                    </p>
                  </div>
                  {course.instructor.slug && (
                    <Link
                      href={`/team/${course.instructor.slug}`}
                      className="px-5 py-2.5 bg-geo-ink text-geo-stone font-mono text-xs uppercase tracking-[0.16em] hover:bg-geo-charcoal transition-colors shrink-0"
                    >
                      View Instructor Dossier &rarr;
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Pricing Breakdown + Enrollment Form */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-geo-navy text-geo-white border border-geo-gold/40 p-6 sm:p-8">
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-geo-gold mb-2">
                  TUITION &amp; REGISTRATION LEDGER
                </span>
                <div className="mt-2 mb-5 font-mono tabular-nums">
                  {course.isFree ? (
                    <div className="text-3xl font-heading text-geo-gold">
                      Free Enrollment (USD $0)
                    </div>
                  ) : hasActiveEarlyBird && course.earlyBirdFee !== null ? (
                    <div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-heading text-geo-gold">
                          {formatCurrency(course.earlyBirdFee, course.currency)}
                        </span>
                        {course.fee !== null && (
                          <span className="text-sm text-geo-slate line-through">
                            {formatCurrency(course.fee, course.currency)}
                          </span>
                        )}
                      </div>
                      {course.earlyBirdDeadline && (
                        <p className="text-xs text-geo-gold/90 mt-1">
                          Early-bird rate active until {formatDate(course.earlyBirdDeadline)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-3xl font-heading text-geo-white">
                      {formatCurrency(course.fee ?? 0, course.currency)}
                    </div>
                  )}
                </div>

                {includesList.length > 0 && (
                  <div className="pt-4 border-t border-white/10">
                    <p className="font-mono text-[10px] font-semibold text-geo-gold uppercase tracking-[0.18em] mb-3">
                      REGISTRATION INCLUDES
                    </p>
                    <ul className="space-y-2 text-xs text-geo-slate-light">
                      {includesList.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="font-mono text-geo-gold shrink-0">
                            {String(i + 1).padStart(2, "0")}.
                          </span>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <CourseEnrollForm
                courseId={course.id}
                courseTitle={course.title}
                isFree={course.isFree}
                effectiveFee={effectiveFee}
                currency={course.currency}
                seatsRemaining={seatsRemaining}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

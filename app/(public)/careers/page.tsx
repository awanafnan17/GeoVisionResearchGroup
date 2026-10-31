import type { Metadata } from "next";
import Link from "next/link";
import { InquiryForm } from "@/components/public/inquiry-form";

export const metadata: Metadata = {
  title: "Careers & Associate Network",
  description:
    "Join the Geo Vision Research Group associate specialist network. Opportunities for structural geologists, remote sensing analysts, hydrogeologists, and geophysicists.",
};

const OPEN_TRACKS = [
  {
    code: "APPT-01",
    title: "Associate Economic & Structural Geologist",
    mode: "Project-Based / Remote & Field",
    discipline: "Mineral Exploration & GeoSentry",
    summary:
      "Support 100-point desktop target screening, structural lineament synthesis, and porphyry/VMS/orogenic gold prospectivity evaluations.",
  },
  {
    code: "APPT-02",
    title: "Remote Sensing & GIS Specialist",
    mode: "Remote / Contract",
    discipline: "Geospatial Intelligence",
    summary:
      "Process ASTER, Sentinel-2, and high-resolution DEM datasets for hydrothermal alteration mapping and enterprise geodatabase compilation.",
  },
  {
    code: "APPT-03",
    title: "Technical Course Instructor (Earth Sciences)",
    mode: "Part-Time / Online & Hybrid",
    discipline: "Training & Capacity Building",
    summary:
      "Design and deliver applied workshops in hydrogeological modeling, geophysics, petrophysics, or geotechnical engineering.",
  },
] as const;

export default function CareersPage() {
  return (
    <>
      {/* 00 // Fellowship & Appointments Header */}
      <section
        className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-geo-navy text-geo-white border-b border-white/15 overflow-hidden"
        aria-label="Careers hero"
      >
        <div className="absolute inset-0 geo-grid-bg opacity-50 pointer-events-none" />

        <div className="relative container-custom">
          <div className="py-4 border-b border-white/10 mb-10 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono uppercase tracking-[0.22em]">
            <span className="text-geo-gold">
              FELLOWSHIPS &amp; APPOINTMENTS &bull; ASSOCIATE SPECIALIST ROSTER
            </span>
            <span className="text-geo-slate-light">
              INTERNATIONAL COLLABORATION NETWORK
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <div className="geo-badge mb-5">Join Our Network</div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-normal text-geo-white tracking-[-0.02em] leading-[1.04]">
                Careers &amp;{" "}
                <span className="italic text-geo-gold">Associate Roster</span>
              </h1>
            </div>
            <div className="lg:col-span-4">
              <p className="text-sm sm:text-base text-geo-white-dim leading-relaxed font-sans border-l border-geo-gold pl-5">
                We collaborate with experienced geoscientists, researchers, and
                geospatial analysts across consulting engagements, desktop
                screening, and technical training.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 01 // Warm Alabaster Stone — Active Appointments Ledger */}
      <section
        className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
        aria-label="Open collaboration tracks"
      >
        <div className="container-custom">
          <div className="editorial-rule-top-dark mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-geo-gold-dark mb-3">
                STANDING APPOINTMENTS
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-normal text-geo-ink tracking-[-0.02em]">
                Active Specialist &amp;{" "}
                <span className="italic text-geo-blue">Associate Tracks</span>
              </h2>
            </div>
            <span className="text-xs font-mono text-geo-slate uppercase tracking-[0.16em]">
              ROLLING CREDENTIAL REVIEW
            </span>
          </div>

          <div className="border border-geo-stone-border divide-y divide-geo-stone-border bg-geo-stone">
            {OPEN_TRACKS.map((role) => (
              <div
                key={role.title}
                className="grid grid-cols-1 lg:grid-cols-12 p-6 sm:p-8 gap-6 items-center hover:bg-geo-stone-muted/70 transition-colors"
              >
                <div className="lg:col-span-3 font-mono text-xs space-y-1">
                  <div className="text-geo-gold-dark font-semibold uppercase tracking-[0.18em]">
                    {role.code}
                  </div>
                  <div className="text-geo-ink font-medium uppercase tracking-[0.12em]">
                    {role.discipline}
                  </div>
                  <div className="text-geo-slate text-[11px]">{role.mode}</div>
                </div>

                <div className="lg:col-span-7">
                  <h3 className="text-2xl font-heading font-normal text-geo-ink mb-2">
                    {role.title}
                  </h3>
                  <p className="text-sm text-geo-charcoal/80 leading-relaxed font-sans">
                    {role.summary}
                  </p>
                </div>

                <div className="lg:col-span-2 lg:text-right">
                  <Link
                    href="#apply"
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-geo-ink hover:text-geo-gold-dark border border-geo-stone-border px-4 py-2.5 bg-geo-stone-muted/60 transition-colors"
                  >
                    <span>Express Interest</span>
                    <span>&darr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 02 // Deep Mineral Navy — Credential Submission Form */}
      <section
        id="apply"
        className="section-padding bg-geo-navy text-geo-white"
        aria-label="Submit credentials"
      >
        <div className="container-custom max-w-4xl">
          <div className="editorial-rule-top mb-10 text-[11px] font-mono uppercase tracking-[0.22em] text-geo-gold">
            CREDENTIAL &amp; DOSSIER SUBMISSION
          </div>
          <InquiryForm
            type="GENERAL_INQUIRY"
            defaultSubject="Associate Roster / Career Application"
            title="Submit Your Credentials"
            subtitle="Introduce your specialization, academic and industry track record, and links to your ORCID, Google Scholar, or LinkedIn profile."
            source="careers-page"
          />
        </div>
      </section>
    </>
  );
}

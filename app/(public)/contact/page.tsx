import type { Metadata } from "next";
import Link from "next/link";
import { getPublicSiteSettings } from "@/lib/public-data";
import { InquiryForm } from "@/components/public/inquiry-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Connect with Geo Vision Research Group for geological consultancy, remote sensing, hydrogeology, training inquiries, or GeoSentry target screening.",
};

export default async function ContactPage() {
  const settings = await getPublicSiteSettings();

  const contactEmail =
    settings.contact_email ?? "info@geovisionresearchgroup.com";
  const contactAddress =
    settings.contact_address ??
    "Islamabad & Sargodha Research Offices, Pakistan";
  const standardTurnaround =
    settings.geosentry_turnaround_standard ?? "5 to 7 Business Days";

  return (
    <>
      {/* 00 // Executive Commissioning Header */}
      <section
        className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-geo-navy text-geo-white border-b border-white/15 overflow-hidden"
        aria-label="Contact hero"
      >
        <div className="absolute inset-0 geo-grid-bg opacity-50 pointer-events-none" />

        <div className="relative container-custom">
          <div className="py-4 border-b border-white/10 mb-10 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono uppercase tracking-[0.22em]">
            <span className="text-geo-gold">
              COMMISSIONING DESK &bull; TECHNICAL &amp; COMMERCIAL DISPATCH
            </span>
            <span className="text-geo-slate-light">
              24-HOUR INITIAL SLA &bull; CONFIDENTIAL INTAKE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <div className="geo-badge mb-5">Get in Touch</div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-normal text-geo-white tracking-[-0.02em] leading-[1.04]">
                Contact Our{" "}
                <span className="italic text-geo-gold">
                  Geoscience &amp; Advisory
                </span>{" "}
                Desk
              </h1>
            </div>
            <div className="lg:col-span-4">
              <p className="text-sm sm:text-base text-geo-white-dim leading-relaxed font-sans border-l border-geo-gold pl-5">
                Discuss mineral exploration targeting, site investigations,
                hydrogeological studies, corporate training, or pre-field
                GeoSentry screening with our senior specialists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 01 // Structured 2-Column Dossier Layout */}
      <section
        className="section-padding bg-geo-navy text-geo-white"
        aria-label="Contact details and inquiry form"
      >
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left 5 Columns: Institutional Ledger & GeoSentry Dispatch */}
            <div className="lg:col-span-5 border border-white/15 bg-geo-navy-light/80 divide-y divide-white/15">
              <div className="p-6 sm:p-8">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-geo-gold mb-2">
                  DIRECT CORRESPONDENCE
                </div>
                <h2 className="text-xl font-heading font-normal text-geo-white mb-2">
                  General &amp; Consultancy Desk
                </h2>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-xs sm:text-sm font-mono text-geo-gold hover:text-geo-gold-light underline underline-offset-4 break-all"
                >
                  {contactEmail}
                </a>
                <p className="text-xs text-geo-slate-light mt-3 leading-relaxed font-sans">
                  For technical proposals, expert consultations, and academic or
                  corporate partnerships.
                </p>
              </div>

              <div className="p-6 sm:p-8">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-geo-gold mb-2">
                  REGIONAL COORDINATION
                </div>
                <h2 className="text-xl font-heading font-normal text-geo-white mb-2">
                  Research &amp; Coordination Offices
                </h2>
                <p className="text-sm text-geo-white font-medium font-sans">
                  {contactAddress}
                </p>
                <p className="text-xs text-geo-slate-light mt-2 leading-relaxed font-sans">
                  Supporting international clients across the Middle East, South
                  and Central Asia, Africa, and the Americas.
                </p>
                <p className="text-[11px] font-mono text-geo-slate mt-3">
                  COORDINATES: 33&deg;41&prime;N 73&deg;02&prime;E &bull;
                  23&deg;35&prime;N 58&deg;24&prime;E
                </p>
              </div>

              <div className="p-6 sm:p-8">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-geo-gold mb-2">
                  SERVICE LEVEL COMMITMENT
                </div>
                <h2 className="text-xl font-heading font-normal text-geo-white mb-2">
                  24-Hour Initial Response SLA
                </h2>
                <p className="text-xs text-geo-slate-light leading-relaxed font-sans">
                  All technical inquiries are reviewed by a domain specialist
                  within 24 business hours. Standard GeoSentry desktop screening
                  turnaround is{" "}
                  <span className="text-geo-white font-mono">
                    {standardTurnaround}
                  </span>
                  .
                </p>
              </div>

              <div className="p-6 sm:p-8 bg-gs-navy">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-geo-gold mb-2">
                  GEOSENTRY SCREENING PORTAL
                </div>
                <h2 className="text-xl font-heading font-normal text-geo-white mb-2">
                  Need a 100-Point Target Screening?
                </h2>
                <p className="text-xs text-geo-slate-light leading-relaxed mb-5 font-sans">
                  Submit concession coordinates, deposit style, and commodity
                  focus directly through our dedicated GeoSentry intake portal,
                  or track an active request.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/geosentry/request"
                    className="btn-primary text-xs py-2.5 px-5"
                  >
                    Request Screening
                  </Link>
                  <Link
                    href="/geosentry/track"
                    className="btn-secondary text-xs py-2.5 px-5"
                  >
                    Track Request
                  </Link>
                </div>
              </div>
            </div>

            {/* Right 7 Columns: Structured Technical Inquiry Form */}
            <div className="lg:col-span-7">
              <InquiryForm
                type="GENERAL_INQUIRY"
                title="Submit a Technical or Commercial Inquiry"
                subtitle="Complete the intake ledger below and our coordination desk will route your dossier to the appropriate domain specialist."
                source="contact-page"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

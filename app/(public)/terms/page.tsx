import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service governing the use of the Geo Vision Research Group website, professional training enrollments, and GeoSentry desktop geological screening services.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <section
        className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-geo-navy text-geo-white border-b border-white/15 overflow-hidden"
        aria-label="Terms of service header"
      >
        <div className="absolute inset-0 geo-grid-bg opacity-50 pointer-events-none" />

        <div className="relative container-custom">
          <div className="py-4 border-b border-white/10 mb-8 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono uppercase tracking-[0.22em]">
            <span className="text-geo-gold">
              GOVERNANCE &bull; TERMS OF ENGAGEMENT &amp; STATUTORY DISCLAIMERS
            </span>
            <span className="text-geo-slate-light">EFFECTIVE: JAN 1, 2026</span>
          </div>

          <div className="geo-badge mb-4">Legal Terms</div>
          <h1 className="text-4xl sm:text-5xl font-heading font-normal text-geo-white mb-3">
            Terms of Service
          </h1>
          <p className="text-xs font-mono uppercase tracking-[0.16em] text-geo-slate-light">
            Effective Date: January 1, 2026 &bull; Geo Vision Research Group &amp;
            GeoSentry
          </p>
        </div>
      </section>

      <section
        className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
        aria-label="Terms of service content"
      >
        <div className="container-custom">
          <div className="max-w-4xl border border-geo-stone-border bg-geo-stone divide-y divide-geo-stone-border">
            {[
              {
                code: "CLAUSE 01",
                title: "1. Scope of Services",
                body: "Geo Vision Research Group provides multidisciplinary earth science consulting, geospatial analysis, professional training courses, and desktop geological target screening through the GeoSentry platform. Specific commercial engagements are governed by written project proposals and scope agreements.",
              },
              {
                code: "CLAUSE 02",
                title: "2. Nature of GeoSentry Desktop Screening Reports",
                body: "GeoSentry 100-point screening reports are early-stage desktop due diligence evaluations based on satellite remote sensing, public geological records, cadastral data, and client-supplied materials. A GeoSentry desktop screening report does not constitute a statutory Competent Person Report or Qualified Person Technical Report under NI 43-101, JORC, or SAMREC codes, and must not be represented as a mineral resource or reserve statement.",
              },
              {
                code: "CLAUSE 03",
                title: "3. Course Enrollments & Invoices",
                body: "Paid course enrollments generate an official invoice upon registration and are confirmed upon verification of bank transfer or corporate purchase order. Free open-access courses are confirmed immediately subject to seat capacity.",
              },
              {
                code: "CLAUSE 04",
                title: "4. Intellectual Property",
                body: "All website content, training materials, lab datasets, and the GeoSentry 100-point scoring methodology remain the intellectual property of Geo Vision Research Group unless otherwise specified in a client deliverables agreement.",
              },
            ].map((item) => (
              <div
                key={item.code}
                className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-4"
              >
                <div className="md:col-span-3 text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-geo-gold-dark">
                  {item.code}
                </div>
                <div className="md:col-span-9">
                  <h2 className="text-xl font-heading font-normal text-geo-ink mb-2">
                    {item.title}
                  </h2>
                  <p className="text-sm text-geo-charcoal/85 leading-relaxed font-sans">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}

            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-4 bg-geo-stone-muted/50">
              <div className="md:col-span-3 text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-geo-gold-dark">
                CLAUSE 05
              </div>
              <div className="md:col-span-9">
                <h2 className="text-xl font-heading font-normal text-geo-ink mb-2">
                  5. Questions &amp; Notices
                </h2>
                <p className="text-sm text-geo-charcoal/85 leading-relaxed font-sans">
                  For contractual or legal inquiries, please contact{" "}
                  <a
                    href="mailto:info@geovisionresearchgroup.com"
                    className="text-geo-blue hover:text-geo-gold-dark underline font-medium"
                  >
                    info@geovisionresearchgroup.com
                  </a>{" "}
                  or reach out via our{" "}
                  <Link
                    href="/contact"
                    className="text-geo-blue hover:text-geo-gold-dark underline font-medium"
                  >
                    Contact page
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { GsRequestForm } from "@/components/geosentry/gs-request-form";

export const metadata: Metadata = {
  title: "Request Geological Screening | GeoSentry",
  description:
    "Submit a GeoSentry screening request. Provide target details and receive a structured 100-point geological assessment within 5-7 business days.",
  keywords: [
    "request geological screening",
    "mining due diligence",
    "geological risk assessment",
    "GeoSentry screening form",
  ],
};

export default function RequestPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-28 pb-14 lg:pt-36 lg:pb-16 bg-geo-navy geo-grid-bg border-b border-white/10"
        aria-label="Request screening hero"
      >
        <div className="container-custom">
          {/* Top Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10 text-[11px] font-mono uppercase tracking-[0.2em] text-gs-slate">
            <span>COMMISSIONING DESK &bull; INTAKE FORM GS-REQ</span>
            <span>RESPONSE SLA: WITHIN 24 HOURS</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <div className="gs-badge mb-5">MANDATE INTAKE</div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading text-geo-white leading-[1.04]">
                Submit Your{" "}
                <span className="italic font-normal text-gs-gold">
                  Screening
                </span>{" "}
                Request.
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-sm sm:text-base text-gs-slate leading-relaxed">
                Provide concession coordinates, deposit hypothesis, and project
                context below. Our intake desk assigns a unique{" "}
                <span className="font-mono text-xs text-geo-white">
                  GS-YYYY-XXXX
                </span>{" "}
                reference immediately and confirms commercial scope within 24
                hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Commissioning Ledger */}
      <section
        className="py-16 lg:py-24 bg-geo-navy border-b border-white/10"
        aria-label="Screening request form"
      >
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Column (5 cols): Institutional SLA & Confidentiality Ledger */}
            <div className="lg:col-span-5 space-y-6">
              <div className="border border-white/15 bg-geo-navy-light p-6 sm:p-8">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-gs-gold block pb-3 mb-5 border-b border-white/10">
                  FEE SCHEDULE &amp; TURNAROUND SLA
                </span>

                <div className="space-y-4 font-mono tabular-nums">
                  <div className="p-4 bg-geo-navy border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-geo-white block">
                        STANDARD MANDATE
                      </span>
                      <span className="text-[11px] text-gs-slate">
                        5–7 Business Days Delivery
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gs-gold">
                      $2,500
                    </span>
                  </div>

                  <div className="p-4 bg-gs-navy-dark border border-gs-gold/40 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gs-gold block">
                        PRIORITY RUSH MANDATE
                      </span>
                      <span className="text-[11px] text-gs-slate">
                        2–3 Business Days (48–72h)
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gs-gold">
                      $4,200
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 space-y-3 text-xs text-gs-slate">
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-gs-gold">01 &bull;</span>
                    <span>
                      <strong className="text-geo-white">
                        Strict Confidentiality:
                      </strong>{" "}
                      All concession coordinates and vendor disclosures are
                      protected under institutional non-disclosure protocols.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-gs-gold">02 &bull;</span>
                    <span>
                      <strong className="text-geo-white">
                        24h Scope Confirmation:
                      </strong>{" "}
                      No fee is billed until our lead economic geologist reviews
                      data availability and confirms your fixed-fee quote.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-gs-gold">03 &bull;</span>
                    <span>
                      <strong className="text-geo-white">
                        Real-Time Reference Tracking:
                      </strong>{" "}
                      Monitor status milestones and download your final 100-point
                      dossier via the GeoSentry tracker.
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Links Box */}
              <div className="border border-white/15 bg-gs-navy-dark p-6 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-gs-slate block">
                    BENCHMARK DOSSIER
                  </span>
                  <span className="text-sm font-heading text-geo-white">
                    Inspect Block 14B Sample Report (72/100)
                  </span>
                </div>
                <Link
                  href="/geosentry/sample-report"
                  className="text-xs font-mono text-gs-gold hover:text-geo-gold-light uppercase tracking-[0.14em] shrink-0"
                >
                  [OPEN DOSSIER &rarr;]
                </Link>
              </div>
            </div>

            {/* Right Column (7 cols): Multi-Step Commissioning Form */}
            <div className="lg:col-span-7 border border-white/15 bg-geo-navy-light p-6 sm:p-8 lg:p-10">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <span className="text-xs font-mono font-semibold uppercase tracking-[0.18em] text-geo-white">
                  COMMISSIONING DOSSIER &bull; TARGET SPECIFICATION
                </span>
                <span className="text-[11px] font-mono text-gs-gold uppercase tracking-[0.14em]">
                  ENCRYPTED TRANSMISSION
                </span>
              </div>
              <GsRequestForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { generateGeoSentryMetadata, geoSentrySchema } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";
import { GsHero } from "@/components/geosentry/gs-hero";
import { GsProblem } from "@/components/geosentry/gs-problem";
import { GsSolution } from "@/components/geosentry/gs-solution";
import { GsFrameworkVisual } from "@/components/geosentry/gs-framework-visual";
import { GsDepositTypes } from "@/components/geosentry/gs-deposit-types";
import { GsProof } from "@/components/geosentry/gs-proof";
import { GsProcess } from "@/components/geosentry/gs-process";
import { GsPricing } from "@/components/geosentry/gs-pricing";
import { GsFaq } from "@/components/geosentry/gs-faq";
import Link from "next/link";

export const metadata: Metadata = generateGeoSentryMetadata();

export default function GeoSentryPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(geoSentrySchema) }}
      />

      <GsHero />
      <GsProblem />
      <GsSolution />
      <GsFrameworkVisual />
      <GsDepositTypes />
      <GsProof />
      <GsProcess />
      <GsPricing />
      <GsFaq />

      {/* Institutional Commissioning Footer Callout */}
      <section
        className="py-24 bg-geo-navy border-t border-white/10 geo-grid-bg"
        aria-label="Commission target screening"
      >
        <div className="container-custom">
          <div className="border border-gs-gold/40 bg-geo-navy-light p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="gs-badge mb-5">
                COMMISSIONING DESK &bull; 24H RESPONSE SLA
              </div>
              <h2 className="text-headline text-geo-white mb-4">
                Screen Your Mineral Target{" "}
                <span className="italic font-normal text-gs-gold">
                  Before Deploying Field Capital.
                </span>
              </h2>
              <p className="text-sm sm:text-base text-gs-slate leading-relaxed max-w-2xl">
                Submit concession coordinates, deposit model hypotheses, and
                available technical reports. Receive a binding commercial scope
                within 24 hours and a complete 100-point institutional dossier
                within 5 to 7 business days.
              </p>
            </div>

            <div className="lg:col-span-5 lg:border-l lg:border-white/15 lg:pl-10 flex flex-col gap-3">
              <Link
                href="/geosentry/request"
                className="gs-btn-primary w-full justify-center"
              >
                Request Target Screening
              </Link>
              <Link
                href="/geosentry/sample-report"
                className="gs-btn-secondary w-full justify-center"
              >
                Inspect Sample Dossier (72/100)
              </Link>
              <Link
                href="/geosentry/track"
                className="text-center pt-2 text-[11px] font-mono uppercase tracking-[0.18em] text-gs-slate hover:text-gs-gold transition-colors"
              >
                [EXISTING MANDATE? TRACK REFERENCE &rarr;]
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

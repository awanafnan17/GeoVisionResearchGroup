import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy governing how Geo Vision Research Group and GeoSentry collect, protect, and process client inquiry, course enrollment, and geological target data.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section
        className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-geo-navy text-geo-white border-b border-white/15 overflow-hidden"
        aria-label="Privacy policy header"
      >
        <div className="absolute inset-0 geo-grid-bg opacity-50 pointer-events-none" />

        <div className="relative container-custom">
          <div className="py-4 border-b border-white/10 mb-8 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono uppercase tracking-[0.22em]">
            <span className="text-geo-gold">
              GOVERNANCE &bull; DATA PROTECTION &amp; CONCESSION CONFIDENTIALITY
            </span>
            <span className="text-geo-slate-light">EFFECTIVE: JAN 1, 2026</span>
          </div>

          <div className="geo-badge mb-4">Data Protection</div>
          <h1 className="text-4xl sm:text-5xl font-heading font-normal text-geo-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono uppercase tracking-[0.16em] text-geo-slate-light">
            Effective Date: January 1, 2026 &bull; Geo Vision Research Group &amp;
            GeoSentry
          </p>
        </div>
      </section>

      <section
        className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
        aria-label="Privacy policy content"
      >
        <div className="container-custom">
          <div className="max-w-4xl border border-geo-stone-border bg-geo-stone divide-y divide-geo-stone-border">
            {[
              {
                code: "ARTICLE 01",
                title: "1. Information We Collect",
                body: "We collect information that you voluntarily provide when submitting a consultancy inquiry, requesting a GeoSentry target screening, or enrolling in a professional training course. This includes your name, email address, phone number, organization, country, and technical project descriptions.",
              },
              {
                code: "ARTICLE 02",
                title: "2. Confidentiality of Geological & Concession Data",
                body: "All concession coordinates, target names, exploration descriptions, and proprietary technical disclosures submitted through GeoSentry or our consultancy inquiry forms are treated as strictly confidential client information. Access is restricted to authorized geoscience analysts assigned to evaluate your request.",
              },
              {
                code: "ARTICLE 03",
                title: "3. How We Use Your Information",
                body: "We use your contact and project details solely to scope and deliver requested geoscience services, issue course enrollment invoices and certificates, provide status updates via the GeoSentry tracker, and maintain security audit logs. We never sell or rent client data to third parties.",
              },
              {
                code: "ARTICLE 04",
                title: "4. Data Security & Access Controls",
                body: "Our platform enforces role-based access control (RBAC), encrypted credential storage, rate limiting, and reference-plus-email verification for screening status lookups.",
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
                ARTICLE 05
              </div>
              <div className="md:col-span-9">
                <h2 className="text-xl font-heading font-normal text-geo-ink mb-2">
                  5. Contact for Privacy Requests
                </h2>
                <p className="text-sm text-geo-charcoal/85 leading-relaxed font-sans">
                  To request access to, correction of, or deletion of your
                  personal information, please contact{" "}
                  <a
                    href="mailto:info@geovisionresearchgroup.com"
                    className="text-geo-blue hover:text-geo-gold-dark underline font-medium"
                  >
                    info@geovisionresearchgroup.com
                  </a>{" "}
                  or visit our{" "}
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

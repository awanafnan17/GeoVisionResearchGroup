import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getServiceBySlug,
  getRelatedExperts,
} from "@/lib/public-data";
import { safeJsonLd } from "@/lib/utils";
import { generateServiceMetadata, generateServiceSchema } from "@/lib/seo";
import { ServiceHero } from "@/components/public/service-hero";
import { ServiceDetails } from "@/components/public/service-details";
import { ServiceRelatedExperts } from "@/components/public/service-related-experts";
import { ServiceRelatedProjects } from "@/components/public/service-related-projects";
import { ServiceFaq } from "@/components/public/service-faq";
import { InquiryForm } from "@/components/public/inquiry-form";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service Not Found" };
  return generateServiceMetadata(service);
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const experts = await getRelatedExperts(service.id);
  const serviceSchema = generateServiceSchema(service);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(serviceSchema) }}
      />

      {/* Hero (Deep Mineral Navy) */}
      <ServiceHero
        title={service.title}
        tagline={service.tagline}
        specializationName={service.specialization?.name ?? null}
        specializationColor={service.specialization?.color ?? null}
      />

      {/* Technical Specification + Methodology + Deliverables (Warm Alabaster Stone) */}
      <ServiceDetails
        description={service.description}
        fullContent={service.fullContent}
        methodology={service.methodology}
        deliverables={service.deliverables}
        tools={service.tools}
      />

      {/* Related Experts (Deep Mineral Navy) */}
      <ServiceRelatedExperts experts={experts} />

      {/* Related Projects (Warm Alabaster Stone Muted) */}
      <ServiceRelatedProjects projects={service.projects} />

      {/* FAQ (Warm Alabaster Stone) */}
      <ServiceFaq faqs={service.faqs} />

      {/* Direct Service Inquiry Section (Deep Mineral Navy) */}
      <section
        id="inquire"
        className="section-padding bg-geo-navy border-b border-white/10"
        aria-label="Service inquiry form"
      >
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <InquiryForm
              type="PROJECT_INQUIRY"
              serviceId={service.id}
              defaultSubject={`Service Inquiry: ${service.title}`}
              title={`Request ${service.title}`}
              subtitle="Provide your project location, timeline, and technical requirements to receive a tailored consultancy scope."
              source={`service-${service.slug}`}
            />
          </div>
        </div>
      </section>

      {/* Institutional Footer Band */}
      <section
        className="py-20 bg-geo-navy-light"
        aria-label="Call to action"
      >
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="geo-badge mb-4">Advisory Mandate</div>
              <h2 className="text-headline text-geo-white mb-3">
                Ready to Commission{" "}
                <span className="italic text-geo-gold">{service.title}</span>?
              </h2>
              <p className="text-base text-geo-slate-light leading-relaxed max-w-2xl">
                Connect directly with our principal geoscientists or initiate a 48-hour GeoSentry pre-fieldwork screening report.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:justify-end gap-4">
              <Link
                href="/geosentry"
                className="btn-primary text-center"
                aria-label="Request consultation"
              >
                Request Consultation
              </Link>
              <Link
                href="/contact"
                className="btn-secondary text-center"
                aria-label="Contact our experts"
              >
                Contact Our Experts
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

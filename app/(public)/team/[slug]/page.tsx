import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getExpertBySlug,
  incrementProfileView,
  getRelatedExpertsBySpecialization,
} from "@/lib/public-data";
import { safeJsonLd } from "@/lib/utils";
import { generateExpertMetadata, generatePersonSchema } from "@/lib/seo";
import { ExpertProfileHero } from "@/components/public/expert-profile-hero";
import { ExpertProfileTabs } from "@/components/public/expert-profile-tabs";
import { ExpertRelated } from "@/components/public/expert-related";
import { InquiryForm } from "@/components/public/inquiry-form";

interface ExpertPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ExpertPageProps): Promise<Metadata> {
  const { slug } = await params;
  const expert = await getExpertBySlug(slug);
  if (!expert) return { title: "Expert Not Found" };
  return generateExpertMetadata(expert);
}

export default async function ExpertProfilePage({ params }: ExpertPageProps) {
  const { slug } = await params;
  const expert = await getExpertBySlug(slug);

  if (!expert) {
    notFound();
  }

  // Increment profile view (fire-and-forget, non-blocking)
  void incrementProfileView(expert.id);

  // Fetch related experts by shared specializations
  const specializationIds = expert.specializations.map(
    (s) => s.specialization.id
  );
  const relatedExperts = await getRelatedExpertsBySpecialization(
    specializationIds,
    expert.id
  );

  // Generate structured data
  const personSchema = generatePersonSchema({
    fullName: expert.fullName,
    designation: expert.designation,
    shortBio: expert.shortBio,
    slug: expert.slug,
    profilePhoto: expert.profilePhoto,
    country: expert.country,
  });

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(personSchema) }}
      />

      {/* Dossier Hero (Deep Mineral Navy) */}
      <ExpertProfileHero expert={expert} />

      {/* Curriculum Vitae Dossier Tabs (Warm Alabaster Stone) */}
      <ExpertProfileTabs
        shortBio={expert.shortBio}
        fullBio={expert.fullBio}
        experience={expert.experience}
        education={expert.education}
        publications={expert.publications}
        certifications={expert.certifications}
        languages={expert.languages}
        awards={expert.awards}
      />

      {/* Direct Expert Consultation Form (Deep Mineral Navy) */}
      <section
        id="inquire"
        className="section-padding bg-geo-navy border-b border-white/10"
        aria-label="Consult with expert"
      >
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <InquiryForm
              type="EXPERT_CONTACT"
              expertProfileId={expert.id}
              defaultSubject={`Consultation with ${expert.fullName}`}
              title={`Consult with ${expert.fullName}`}
              subtitle={`Submit a technical consultation or advisory request directly to ${expert.fullName} through the Geo Vision desk.`}
              source={`expert-${expert.slug}`}
            />
          </div>
        </div>
      </section>

      {/* Related Experts (Warm Alabaster Stone Muted) */}
      <ExpertRelated experts={relatedExperts} />
    </>
  );
}

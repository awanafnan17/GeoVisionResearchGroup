import type { Metadata } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://geovisionresearchgroup.com";
const APP_NAME = "Geo Vision Research Group";

type MetadataOptions = {
  title?: string; description?: string; keywords?: string[];
  image?: string; url?: string; noIndex?: boolean;
};

export function generateMetadata(options: MetadataOptions): Metadata {
  const fullTitle = options.title ? `${options.title} | ${APP_NAME}` : APP_NAME;
  return {
    title: options.title ?? APP_NAME,
    description: options.description,
    keywords: options.keywords,
    openGraph: { title: fullTitle, description: options.description, url: options.url ?? APP_URL, siteName: APP_NAME, images: [{ url: options.image ?? `${APP_URL}/og-image.jpg`, width: 1200, height: 630 }], type: "website" },
    twitter: { card: "summary_large_image", title: fullTitle, description: options.description },
    robots: options.noIndex ? { index: false, follow: false } : undefined,
  };
}

type ExpertMeta = { fullName: string; designation: string; shortBio: string; slug: string; profilePhoto?: string | null };
export function generateExpertMetadata(expert: ExpertMeta): Metadata {
  return generateMetadata({ title: `${expert.fullName} - ${expert.designation}`, description: expert.shortBio, url: `${APP_URL}/team/${expert.slug}`, image: expert.profilePhoto ?? undefined, keywords: [expert.fullName, expert.designation, "geologist", "expert"] });
}

type CourseMeta = { title: string; tagline?: string | null; slug: string; thumbnail?: string | null };
export function generateCourseMetadata(course: CourseMeta): Metadata {
  return generateMetadata({ title: course.title, description: course.tagline ?? undefined, url: `${APP_URL}/courses/${course.slug}`, image: course.thumbnail ?? undefined, keywords: [course.title, "geology course", "training", "professional development"] });
}

type ServiceMeta = { title: string; tagline?: string | null; slug: string; heroImage?: string | null; keywords?: string | null };
export function generateServiceMetadata(service: ServiceMeta): Metadata {
  return generateMetadata({ title: service.title, description: service.tagline ?? undefined, url: `${APP_URL}/services/${service.slug}`, image: service.heroImage ?? undefined, keywords: service.keywords?.split(",").map(k => k.trim()) ?? [service.title] });
}

export function generateGeoSentryMetadata(): Metadata {
  return generateMetadata({ title: "GeoSentry - Geological Intelligence & Risk-Based Screening", description: "Desktop geological screening service for junior exploration companies and mining investors. 100-point scoring framework with structured go/no-go verdicts.", url: `${APP_URL}/geosentry`, keywords: ["GeoSentry", "geological screening", "mining risk", "due diligence", "mineral exploration", "desktop study"] });
}

export const organizationSchema = {
  "@context": "https://schema.org", "@type": "Organization",
  name: APP_NAME, url: APP_URL,
  description: "International geoscience consultancy providing geological services, training, and expert advisory across all earth science disciplines.",
  contactPoint: { "@type": "ContactPoint", email: "info@geovisionresearchgroup.com", contactType: "customer service" },
};

export const geoSentrySchema = {
  "@context": "https://schema.org", "@type": "Service",
  name: "GeoSentry", provider: { "@type": "Organization", name: APP_NAME },
  description: "Desktop geological screening for junior explorers and mining investors. 100-point risk-based scoring framework.",
  serviceType: "Geological Screening",
};

export function generatePersonSchema(expert: ExpertMeta & { country?: string | null }) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: expert.fullName,
    jobTitle: expert.designation,
    description: expert.shortBio,
    image: expert.profilePhoto,
    url: `${APP_URL}/team/${expert.slug}`,
    worksFor: { "@type": "Organization", name: APP_NAME },
    ...(expert.country
      ? {
          address: {
            "@type": "PostalAddress",
            addressCountry: expert.country,
          },
        }
      : {}),
  };
}

export function generateCourseSchema(course: CourseMeta & { description?: string; startDate?: string | null; fee?: number | null; currency?: string }) {
  return { "@context": "https://schema.org", "@type": "Course", name: course.title, description: course.tagline ?? course.description, url: `${APP_URL}/courses/${course.slug}`, provider: { "@type": "Organization", name: APP_NAME }, ...(course.startDate ? { startDate: course.startDate } : {}), ...(course.fee ? { offers: { "@type": "Offer", price: course.fee, priceCurrency: course.currency ?? "USD" } } : {}) };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: item.url })) };
}

export function generateServiceSchema(service: ServiceMeta) {
  return { "@context": "https://schema.org", "@type": "Service", name: service.title, description: service.tagline, url: `${APP_URL}/services/${service.slug}`, provider: { "@type": "Organization", name: APP_NAME } };
}

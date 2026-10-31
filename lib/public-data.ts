// Server-side data fetching for public homepage
// All functions run on the server only - never exposed to client

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

// -------------------------------------------------------
// Types
// -------------------------------------------------------

export interface HomepageStats {
  specializations: number;
  services: number;
  courses: number;
  experts: number;
  geosentryRequests: number;
  countries: number;
}

export interface FeaturedService {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  icon: string | null;
}

export interface FeaturedExpert {
  id: string;
  slug: string;
  fullName: string;
  designation: string;
  profilePhoto: string | null;
  country: string | null;
}

// -------------------------------------------------------
// Queries
// -------------------------------------------------------

export async function getHomepageStats(): Promise<HomepageStats> {
  try {
    const [
      specializations,
      services,
      courses,
      experts,
      geosentryRequests,
      expertProfiles,
      projects,
      geosentryRecords,
    ] = await Promise.all([
      prisma.specialization.count({ where: { isActive: true } }),
      prisma.service.count({ where: { isPublished: true } }),
      prisma.course.count({
        where: { status: { in: ["PUBLISHED", "ONGOING", "UPCOMING"] } },
      }),
      prisma.expertProfile.count({ where: { status: "PUBLISHED" } }),
      prisma.geoSentryRequest.count(),
      prisma.expertProfile.findMany({
        where: { status: "PUBLISHED", country: { not: null } },
        select: { country: true },
      }),
      prisma.project.findMany({
        where: { status: "PUBLISHED", country: { not: null } },
        select: { country: true },
      }),
      prisma.geoSentryRequest.findMany({
        select: { targetCountry: true, clientCountry: true },
      }),
    ]);

    const distinctCountries = new Set<string>();
    for (const exp of expertProfiles) {
      const c = exp.country?.trim();
      if (c) distinctCountries.add(c);
    }
    for (const proj of projects) {
      const c = proj.country?.trim();
      if (c) distinctCountries.add(c);
    }
    for (const req of geosentryRecords) {
      const tc = req.targetCountry?.trim();
      if (tc) distinctCountries.add(tc);
      const cc = req.clientCountry?.trim();
      if (cc) distinctCountries.add(cc);
    }

    return {
      specializations,
      services,
      courses,
      experts,
      geosentryRequests,
      countries: distinctCountries.size,
    };
  } catch (error) {
    logger.error("Failed to fetch homepage stats", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      specializations: 0,
      services: 0,
      courses: 0,
      experts: 0,
      geosentryRequests: 0,
      countries: 0,
    };
  }
}

export async function getFeaturedServices(): Promise<FeaturedService[]> {
  try {
    const services = await prisma.service.findMany({
      where: { isPublished: true },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
      take: 6,
      select: {
        id: true,
        slug: true,
        title: true,
        tagline: true,
        icon: true,
      },
    });
    return services;
  } catch (error) {
    logger.error("Failed to fetch featured services", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export async function getFeaturedExperts(): Promise<FeaturedExpert[]> {
  try {
    const experts = await prisma.expertProfile.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
      take: 4,
      select: {
        id: true,
        slug: true,
        fullName: true,
        designation: true,
        profilePhoto: true,
        country: true,
      },
    });
    return experts;
  } catch (error) {
    logger.error("Failed to fetch featured experts", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

// -------------------------------------------------------
// Service Types
// -------------------------------------------------------

export interface PublicService {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string;
  fullContent: string | null;
  icon: string | null;
  heroImage: string | null;
  coverImage: string | null;
  methodology: string | null;
  deliverables: unknown;
  tools: unknown;
  faqs: unknown;
  metaTitle: string | null;
  metaDesc: string | null;
  keywords: string | null;
  sortOrder: number;
  createdAt: Date;
  specialization: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    color: string | null;
  } | null;
}

export interface PublicServiceWithRelations extends PublicService {
  projects: RelatedProject[];
}

export interface RelatedExpert {
  id: string;
  slug: string;
  fullName: string;
  designation: string;
  profilePhoto: string | null;
  country: string | null;
  shortBio: string;
}

export interface RelatedProject {
  id: string;
  slug: string;
  title: string;
  country: string | null;
  city: string | null;
  year: number | null;
  coverImage: string | null;
  description: string;
}

// -------------------------------------------------------
// Service Queries
// -------------------------------------------------------

const serviceSelect = {
  id: true,
  slug: true,
  title: true,
  tagline: true,
  description: true,
  fullContent: true,
  icon: true,
  heroImage: true,
  coverImage: true,
  methodology: true,
  deliverables: true,
  tools: true,
  faqs: true,
  metaTitle: true,
  metaDesc: true,
  keywords: true,
  sortOrder: true,
  createdAt: true,
  specialization: {
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
      color: true,
    },
  },
} as const;

export async function getAllServices(): Promise<PublicService[]> {
  try {
    const services = await prisma.service.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: serviceSelect,
    });
    return services;
  } catch (error) {
    logger.error("Failed to fetch all services", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export const getServiceBySlug = cache(async function getServiceBySlug(
  slug: string
): Promise<PublicServiceWithRelations | null> {
  try {
    const service = await prisma.service.findFirst({
      where: { slug, isPublished: true },
      select: {
        ...serviceSelect,
        projects: {
          where: { status: "PUBLISHED" },
          orderBy: { year: "desc" },
          take: 3,
          select: {
            id: true,
            slug: true,
            title: true,
            country: true,
            city: true,
            year: true,
            coverImage: true,
            description: true,
          },
        },
      },
    });
    return service;
  } catch (error) {
    logger.error("Failed to fetch service by slug", {
      slug,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
});

export async function getRelatedExperts(
  serviceId: string
): Promise<RelatedExpert[]> {
  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { specializationId: true },
    });

    if (!service?.specializationId) return [];

    const experts = await prisma.expertProfile.findMany({
      where: {
        status: "PUBLISHED",
        specializations: {
          some: { specializationId: service.specializationId },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
      take: 3,
      select: {
        id: true,
        slug: true,
        fullName: true,
        designation: true,
        profilePhoto: true,
        country: true,
        shortBio: true,
      },
    });

    return experts;
  } catch (error) {
    logger.error("Failed to fetch related experts", {
      serviceId,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export async function getRelatedProjects(
  serviceId: string
): Promise<RelatedProject[]> {
  try {
    const projects = await prisma.project.findMany({
      where: { serviceId, status: "PUBLISHED" },
      orderBy: { year: "desc" },
      take: 3,
      select: {
        id: true,
        slug: true,
        title: true,
        country: true,
        city: true,
        year: true,
        coverImage: true,
        description: true,
      },
    });
    return projects;
  } catch (error) {
    logger.error("Failed to fetch related projects", {
      serviceId,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

// -------------------------------------------------------
// Expert Directory Types
// -------------------------------------------------------

export interface ExpertSpecializationItem {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}

export interface PublicExpertCard {
  id: string;
  slug: string;
  fullName: string;
  designation: string;
  shortBio: string;
  profilePhoto: string | null;
  city: string | null;
  country: string | null;
  profileViews: number;
  specializations: {
    specialization: ExpertSpecializationItem;
  }[];
}

export interface PublicExpertProfile {
  id: string;
  slug: string;
  fullName: string;
  designation: string;
  shortBio: string;
  fullBio: string | null;
  profilePhoto: string | null;
  cvFile: string | null;
  cvIsPublic: boolean;
  cvDownloads: number;
  linkedin: string | null;
  twitter: string | null;
  researchgate: string | null;
  googleScholar: string | null;
  orcid: string | null;
  website: string | null;
  education: unknown;
  experience: unknown;
  publications: unknown;
  certifications: unknown;
  languages: unknown;
  awards: unknown;
  profileViews: number;
  city: string | null;
  country: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
  specializations: {
    specialization: ExpertSpecializationItem;
  }[];
}

export interface ExpertListParams {
  search?: string;
  specialization?: string;
  country?: string;
  page?: number;
  perPage?: number;
}

export interface PaginatedExperts {
  experts: PublicExpertCard[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface SpecializationOption {
  id: string;
  name: string;
  slug: string;
}

// -------------------------------------------------------
// Expert Select (safe public fields only)
// -------------------------------------------------------

const expertCardSelect = {
  id: true,
  slug: true,
  fullName: true,
  designation: true,
  shortBio: true,
  profilePhoto: true,
  city: true,
  country: true,
  profileViews: true,
  specializations: {
    select: {
      specialization: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
        },
      },
    },
  },
} as const;

const expertProfileSelect = {
  id: true,
  slug: true,
  fullName: true,
  designation: true,
  shortBio: true,
  fullBio: true,
  profilePhoto: true,
  cvFile: true,
  cvIsPublic: true,
  cvDownloads: true,
  linkedin: true,
  twitter: true,
  researchgate: true,
  googleScholar: true,
  orcid: true,
  website: true,
  education: true,
  experience: true,
  publications: true,
  certifications: true,
  languages: true,
  awards: true,
  profileViews: true,
  city: true,
  country: true,
  metaTitle: true,
  metaDesc: true,
  specializations: {
    select: {
      specialization: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
        },
      },
    },
  },
} as const;

// -------------------------------------------------------
// Expert Directory Queries
// -------------------------------------------------------

export async function getAllExperts(
  params: ExpertListParams = {}
): Promise<PaginatedExperts> {
  const { search, specialization, country, page = 1, perPage = 12 } = params;
  const skip = (page - 1) * perPage;

  try {
    const where: Record<string, unknown> = { status: "PUBLISHED" as const };

    if (search && search.trim().length > 0) {
      const q = search.trim();
      where.OR = [
        { fullName: { contains: q, mode: "insensitive" } },
        { designation: { contains: q, mode: "insensitive" } },
      ];
    }

    if (specialization && specialization.trim().length > 0) {
      where.specializations = {
        some: {
          specialization: { slug: specialization.trim() },
        },
      };
    }

    if (country && country.trim().length > 0) {
      where.country = country.trim();
    }

    const [experts, total] = await Promise.all([
      prisma.expertProfile.findMany({
        where,
        orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { fullName: "asc" }],
        skip,
        take: perPage,
        select: expertCardSelect,
      }),
      prisma.expertProfile.count({ where }),
    ]);

    return {
      experts,
      total,
      page,
      perPage,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    };
  } catch (error) {
    logger.error("Failed to fetch experts list", {
      error: error instanceof Error ? error.message : String(error),
    });
    return { experts: [], total: 0, page: 1, perPage, totalPages: 1 };
  }
}

export const getExpertBySlug = cache(async function getExpertBySlug(
  slug: string
): Promise<PublicExpertProfile | null> {
  try {
    const expert = await prisma.expertProfile.findFirst({
      where: { slug, status: "PUBLISHED" },
      select: expertProfileSelect,
    });
    if (!expert) return null;
    return {
      ...expert,
      cvFile: expert.cvIsPublic ? expert.cvFile : null,
    };
  } catch (error) {
    logger.error("Failed to fetch expert by slug", {
      slug,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
});

export async function incrementProfileView(id: string): Promise<void> {
  try {
    await prisma.expertProfile.update({
      where: { id },
      data: { profileViews: { increment: 1 } },
    });
  } catch (error) {
    // Non-critical: log and swallow so page still renders
    logger.error("Failed to increment profile view", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function incrementCvDownload(id: string): Promise<void> {
  try {
    await prisma.expertProfile.update({
      where: { id },
      data: { cvDownloads: { increment: 1 } },
    });
  } catch (error) {
    logger.error("Failed to increment CV download", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function getRelatedExpertsBySpecialization(
  specializationIds: string[],
  excludeId: string
): Promise<PublicExpertCard[]> {
  if (specializationIds.length === 0) return [];

  try {
    const experts = await prisma.expertProfile.findMany({
      where: {
        status: "PUBLISHED",
        id: { not: excludeId },
        specializations: {
          some: {
            specializationId: { in: specializationIds },
          },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
      take: 3,
      select: expertCardSelect,
    });
    return experts;
  } catch (error) {
    logger.error("Failed to fetch related experts by specialization", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export async function getAllSpecializations(): Promise<SpecializationOption[]> {
  try {
    const specs = await prisma.specialization.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    });
    return specs;
  } catch (error) {
    logger.error("Failed to fetch specializations", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export async function getAllExpertCountries(): Promise<string[]> {
  try {
    const results = await prisma.expertProfile.findMany({
      where: { status: "PUBLISHED", country: { not: null } },
      select: { country: true },
      distinct: ["country"],
      orderBy: { country: "asc" },
    });
    return results
      .map((r) => r.country)
      .filter((c): c is string => c !== null);
  } catch (error) {
    logger.error("Failed to fetch expert countries", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export async function getExpertCvFile(
  id: string
): Promise<{ cvFile: string | null; cvIsPublic: boolean } | null> {
  try {
    const expert = await prisma.expertProfile.findFirst({
      where: { id, status: "PUBLISHED" },
      select: { cvFile: true, cvIsPublic: true },
    });
    return expert;
  } catch (error) {
    logger.error("Failed to fetch expert CV file", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

// -------------------------------------------------------
// Courses & Training Types & Queries
// -------------------------------------------------------

export interface PublicCourseCard {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  tagline: string | null;
  description: string;
  coverImage: string | null;
  thumbnail: string | null;
  mode: string;
  duration: string | null;
  durationText: string | null;
  totalHours: number | null;
  startDate: Date | null;
  endDate: Date | null;
  schedule: string | null;
  location: string | null;
  maxStudents: number | null;
  maxSeats: number | null;
  enrolledCount: number;
  fee: number | null;
  currency: string;
  isFree: boolean;
  earlyBirdFee: number | null;
  earlyBirdEnd: Date | null;
  earlyBirdDeadline: Date | null;
  hasCertificate: boolean;
  certificate: boolean;
  isFeatured: boolean;
  instructor: {
    id: string;
    slug: string;
    fullName: string;
    designation: string;
    profilePhoto: string | null;
  } | null;
  specialization: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
  } | null;
}

export interface PublicCourseDetail extends PublicCourseCard {
  fullContent: string | null;
  prerequisites: string | null;
  syllabus: unknown;
  learningOutcomes: unknown;
  includes: unknown;
  targetAudience: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
}

export interface CourseListParams {
  search?: string;
  mode?: string;
  specialization?: string;
  limit?: number;
}

export async function getAllCourses(
  params: CourseListParams = {}
): Promise<PublicCourseCard[]> {
  try {
    const where: Record<string, unknown> = {
      status: { in: ["PUBLISHED", "ONGOING", "UPCOMING"] },
    };

    if (params.search && params.search.trim()) {
      const q = params.search.trim();
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { tagline: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    if (params.mode && ["ONLINE", "IN_PERSON", "ONSITE", "HYBRID"].includes(params.mode)) {
      where.mode = params.mode === "IN_PERSON" ? "ONSITE" : params.mode;
    }

    if (params.specialization && params.specialization.trim()) {
      where.specialization = { slug: params.specialization.trim() };
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy: [{ startDate: "asc" }, { createdAt: "desc" }],
      take: params.limit,
      select: {
        id: true,
        slug: true,
        title: true,
        tagline: true,
        description: true,
        thumbnail: true,
        coverImage: true,
        mode: true,
        durationText: true,
        startDate: true,
        endDate: true,
        schedule: true,
        location: true,
        maxSeats: true,
        fee: true,
        currency: true,
        earlyBirdFee: true,
        earlyBirdDeadline: true,
        certificate: true,
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
            expertProfile: {
              select: {
                id: true,
                slug: true,
                fullName: true,
                designation: true,
                profilePhoto: true,
              },
            },
          },
        },
        specialization: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
        _count: {
          select: {
            enrollments: {
              where: { status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] } },
            },
          },
        },
      },
    });

    return courses.map((c) => {
      const feeNum = c.fee !== null ? Number(c.fee) : null;
      const isFree = feeNum === null || feeNum === 0;
      const ep = c.instructor?.expertProfile;
      return {
        id: c.id,
        slug: c.slug,
        title: c.title,
        subtitle: c.tagline,
        tagline: c.tagline,
        description: c.description,
        coverImage: c.coverImage ?? c.thumbnail,
        thumbnail: c.thumbnail,
        mode: c.mode,
        duration: c.durationText,
        durationText: c.durationText,
        totalHours: null,
        startDate: c.startDate,
        endDate: c.endDate,
        schedule: c.schedule,
        location: c.location,
        maxStudents: c.maxSeats,
        maxSeats: c.maxSeats,
        enrolledCount: c._count.enrollments,
        fee: feeNum,
        currency: c.currency,
        isFree,
        earlyBirdFee: c.earlyBirdFee !== null ? Number(c.earlyBirdFee) : null,
        earlyBirdEnd: c.earlyBirdDeadline,
        earlyBirdDeadline: c.earlyBirdDeadline,
        hasCertificate: c.certificate,
        certificate: c.certificate,
        isFeatured: true,
        instructor: ep
          ? {
              id: ep.id,
              slug: ep.slug,
              fullName: ep.fullName,
              designation: ep.designation,
              profilePhoto: ep.profilePhoto,
            }
          : c.instructor
            ? {
                id: c.instructor.id,
                slug: "",
                fullName: c.instructor.name ?? "Geo Vision Instructor",
                designation: "Senior Instructor",
                profilePhoto: c.instructor.image,
              }
            : null,
        specialization: c.specialization,
      };
    });
  } catch (error) {
    logger.error("Failed to fetch courses", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export async function getFeaturedCourses(limit = 3): Promise<PublicCourseCard[]> {
  return getAllCourses({ limit });
}

export const getCourseBySlug = cache(async function getCourseBySlug(
  slug: string
): Promise<PublicCourseDetail | null> {
  try {
    const c = await prisma.course.findFirst({
      where: { slug, status: { in: ["PUBLISHED", "ONGOING", "UPCOMING"] } },
      select: {
        id: true,
        slug: true,
        title: true,
        tagline: true,
        description: true,
        fullContent: true,
        thumbnail: true,
        coverImage: true,
        mode: true,
        durationText: true,
        startDate: true,
        endDate: true,
        schedule: true,
        location: true,
        maxSeats: true,
        fee: true,
        currency: true,
        earlyBirdFee: true,
        earlyBirdDeadline: true,
        certificate: true,
        prerequisites: true,
        syllabus: true,
        learningOutcomes: true,
        includes: true,
        targetAudience: true,
        metaTitle: true,
        metaDesc: true,
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
            expertProfile: {
              select: {
                id: true,
                slug: true,
                fullName: true,
                designation: true,
                profilePhoto: true,
              },
            },
          },
        },
        specialization: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
        _count: {
          select: {
            enrollments: {
              where: { status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] } },
            },
          },
        },
      },
    });

    if (!c) return null;

    const feeNum = c.fee !== null ? Number(c.fee) : null;
    const isFree = feeNum === null || feeNum === 0;
    const ep = c.instructor?.expertProfile;

    return {
      id: c.id,
      slug: c.slug,
      title: c.title,
      subtitle: c.tagline,
      tagline: c.tagline,
      description: c.description,
      fullContent: c.fullContent,
      coverImage: c.coverImage ?? c.thumbnail,
      thumbnail: c.thumbnail,
      mode: c.mode,
      duration: c.durationText,
      durationText: c.durationText,
      totalHours: null,
      startDate: c.startDate,
      endDate: c.endDate,
      schedule: c.schedule,
      location: c.location,
      maxStudents: c.maxSeats,
      maxSeats: c.maxSeats,
      enrolledCount: c._count.enrollments,
      fee: feeNum,
      currency: c.currency,
      isFree,
      earlyBirdFee: c.earlyBirdFee !== null ? Number(c.earlyBirdFee) : null,
      earlyBirdEnd: c.earlyBirdDeadline,
      earlyBirdDeadline: c.earlyBirdDeadline,
      hasCertificate: c.certificate,
      certificate: c.certificate,
      isFeatured: true,
      prerequisites: c.prerequisites,
      syllabus: c.syllabus,
      learningOutcomes: c.learningOutcomes,
      includes: c.includes,
      targetAudience: c.targetAudience,
      metaTitle: c.metaTitle,
      metaDesc: c.metaDesc,
      instructor: ep
        ? {
            id: ep.id,
            slug: ep.slug,
            fullName: ep.fullName,
            designation: ep.designation,
            profilePhoto: ep.profilePhoto,
          }
        : c.instructor
          ? {
              id: c.instructor.id,
              slug: "",
              fullName: c.instructor.name ?? "Geo Vision Instructor",
              designation: "Senior Instructor",
              profilePhoto: c.instructor.image,
            }
          : null,
      specialization: c.specialization,
    };
  } catch (error) {
    logger.error("Failed to fetch course by slug", {
      slug,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
});

// -------------------------------------------------------
// Portfolio & Projects Types & Queries
// -------------------------------------------------------

export interface PublicProjectCard {
  id: string;
  slug: string;
  title: string;
  client: string | null;
  sector: string | null;
  clientIsPublic: boolean;
  country: string | null;
  city: string | null;
  year: number | null;
  duration: string | null;
  description: string;
  coverImage: string | null;
  isFeatured: boolean;
  service: {
    id: string;
    slug: string;
    title: string;
  } | null;
}

export interface PublicProjectDetail extends PublicProjectCard {
  fullContent: string | null;
  challenge: string | null;
  solution: string | null;
  outcome: string | null;
  objectives: string | null;
  methodology: string | null;
  results: string | null;
  galleryImages: unknown;
  images: unknown;
  metaTitle: string | null;
  metaDesc: string | null;
  teamMembers: {
    id: string;
    role: string | null;
    expertProfile: {
      id: string;
      slug: string;
      fullName: string;
      designation: string;
      profilePhoto: string | null;
    };
  }[];
}

export interface ProjectListParams {
  search?: string;
  country?: string;
  serviceSlug?: string;
  limit?: number;
}

export async function getAllProjects(
  params: ProjectListParams = {}
): Promise<PublicProjectCard[]> {
  try {
    const where: Record<string, unknown> = { status: "PUBLISHED" };

    if (params.search && params.search.trim()) {
      const q = params.search.trim();
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { country: { contains: q, mode: "insensitive" } },
      ];
    }

    if (params.country && params.country.trim()) {
      where.country = params.country.trim();
    }

    if (params.serviceSlug && params.serviceSlug.trim()) {
      where.service = { slug: params.serviceSlug.trim() };
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { year: "desc" }, { createdAt: "desc" }],
      take: params.limit,
      select: {
        id: true,
        slug: true,
        title: true,
        client: true,
        sector: true,
        isConfidential: true,
        country: true,
        city: true,
        year: true,
        duration: true,
        description: true,
        coverImage: true,
        isFeatured: true,
        service: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
      },
    });

    return projects.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      client: p.isConfidential ? "Confidential Client" : p.client,
      sector: p.sector,
      clientIsPublic: !p.isConfidential,
      country: p.country,
      city: p.city,
      year: p.year,
      duration: p.duration,
      description: p.description,
      coverImage: p.coverImage,
      isFeatured: p.isFeatured,
      service: p.service,
    }));
  } catch (error) {
    logger.error("Failed to fetch projects", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export async function getFeaturedProjects(limit = 3): Promise<PublicProjectCard[]> {
  return getAllProjects({ limit });
}

export const getProjectBySlug = cache(async function getProjectBySlug(
  slug: string
): Promise<PublicProjectDetail | null> {
  try {
    const p = await prisma.project.findFirst({
      where: { slug, status: "PUBLISHED" },
      select: {
        id: true,
        slug: true,
        title: true,
        client: true,
        sector: true,
        isConfidential: true,
        country: true,
        city: true,
        year: true,
        duration: true,
        description: true,
        fullContent: true,
        objectives: true,
        methodology: true,
        results: true,
        coverImage: true,
        images: true,
        isFeatured: true,
        metaTitle: true,
        metaDesc: true,
        service: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
        teamMembers: {
          select: {
            id: true,
            role: true,
            expertProfile: {
              select: {
                id: true,
                slug: true,
                fullName: true,
                designation: true,
                profilePhoto: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!p) return null;

    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      client: p.isConfidential ? "Confidential Client" : p.client,
      sector: p.sector,
      clientIsPublic: !p.isConfidential,
      country: p.country,
      city: p.city,
      year: p.year,
      duration: p.duration,
      description: p.description,
      fullContent: p.fullContent,
      challenge: p.objectives,
      solution: p.methodology,
      outcome: p.results,
      objectives: p.objectives,
      methodology: p.methodology,
      results: p.results,
      coverImage: p.coverImage,
      galleryImages: p.images,
      images: p.images,
      isFeatured: p.isFeatured,
      metaTitle: p.metaTitle,
      metaDesc: p.metaDesc,
      service: p.service,
      teamMembers: p.teamMembers
        .filter((tm) => tm.expertProfile.status === "PUBLISHED")
        .map((tm) => ({
          id: tm.id,
          role: tm.role,
          expertProfile: {
            id: tm.expertProfile.id,
            slug: tm.expertProfile.slug,
            fullName: tm.expertProfile.fullName,
            designation: tm.expertProfile.designation,
            profilePhoto: tm.expertProfile.profilePhoto,
          },
        })),
    };
  } catch (error) {
    logger.error("Failed to fetch project by slug", {
      slug,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
});

export async function getAllProjectCountries(): Promise<string[]> {
  try {
    const results = await prisma.project.findMany({
      where: { status: "PUBLISHED", country: { not: null } },
      select: { country: true },
      distinct: ["country"],
      orderBy: { country: "asc" },
    });
    return results
      .map((r) => r.country)
      .filter((c): c is string => c !== null);
  } catch (error) {
    logger.error("Failed to fetch project countries", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

// -------------------------------------------------------
// Blog & Research Types & Queries
// -------------------------------------------------------

export interface PublicBlogPostCard {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  category: string | null;
  tags: string[];
  authorName: string | null;
  authorPhoto: string | null;
  authorBio: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  views: number;
  readTime: string | null;
  isFeatured: boolean;
}

export interface PublicBlogPostDetail extends PublicBlogPostCard {
  content: string;
  metaTitle: string | null;
  metaDesc: string | null;
  keywords: string | null;
}

export interface BlogListParams {
  search?: string;
  category?: string;
  limit?: number;
}

export async function getAllBlogPosts(
  params: BlogListParams = {}
): Promise<PublicBlogPostCard[]> {
  try {
    const where: Record<string, unknown> = { status: "PUBLISHED" };

    if (params.search && params.search.trim()) {
      const q = params.search.trim();
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
        { keywords: { contains: q, mode: "insensitive" } },
      ];
    }

    if (params.category && params.category.trim()) {
      where.keywords = { contains: params.category.trim(), mode: "insensitive" };
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
      take: params.limit,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        keywords: true,
        publishedAt: true,
        createdAt: true,
        readTime: true,
        isFeatured: true,
        author: {
          select: {
            name: true,
            image: true,
            expertProfile: {
              select: {
                fullName: true,
                profilePhoto: true,
                shortBio: true,
              },
            },
          },
        },
      },
    });

    return posts.map((post) => {
      const tagList = post.keywords
        ? post.keywords
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : ["Geological Research"];
      const ep = post.author?.expertProfile;
      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt ?? "",
        coverImage: post.coverImage,
        category: tagList[0] ?? "Research",
        tags: tagList,
        authorName: ep?.fullName ?? post.author?.name ?? "Geo Vision Research Team",
        authorPhoto: ep?.profilePhoto ?? post.author?.image ?? null,
        authorBio: ep?.shortBio ?? null,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        views: 0,
        readTime: post.readTime ?? "6 min read",
        isFeatured: post.isFeatured,
      };
    });
  } catch (error) {
    logger.error("Failed to fetch blog posts", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export async function getFeaturedBlogPosts(limit = 3): Promise<PublicBlogPostCard[]> {
  return getAllBlogPosts({ limit });
}

export const getBlogPostBySlug = cache(async function getBlogPostBySlug(
  slug: string
): Promise<PublicBlogPostDetail | null> {
  try {
    const post = await prisma.blogPost.findFirst({
      where: { slug, status: "PUBLISHED" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        coverImage: true,
        publishedAt: true,
        createdAt: true,
        readTime: true,
        isFeatured: true,
        metaTitle: true,
        metaDesc: true,
        keywords: true,
        author: {
          select: {
            name: true,
            image: true,
            expertProfile: {
              select: {
                fullName: true,
                profilePhoto: true,
                shortBio: true,
              },
            },
          },
        },
      },
    });

    if (!post) return null;

    const tagList = post.keywords
      ? post.keywords
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : ["Geological Research"];
    const ep = post.author?.expertProfile;

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt ?? "",
      content: post.content,
      coverImage: post.coverImage,
      category: tagList[0] ?? "Research",
      tags: tagList,
      authorName: ep?.fullName ?? post.author?.name ?? "Geo Vision Research Team",
      authorPhoto: ep?.profilePhoto ?? post.author?.image ?? null,
      authorBio: ep?.shortBio ?? null,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      views: 0,
      readTime: post.readTime ?? "6 min read",
      isFeatured: post.isFeatured,
      metaTitle: post.metaTitle,
      metaDesc: post.metaDesc,
      keywords: post.keywords,
    };
  } catch (error) {
    logger.error("Failed to fetch blog post by slug", {
      slug,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
});

export async function incrementBlogView(id: string): Promise<void> {
  if (!id) return;
}

export async function getAllBlogCategories(): Promise<string[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED", keywords: { not: null } },
      select: { keywords: true },
    });
    const set = new Set<string>();
    for (const p of posts) {
      if (p.keywords) {
        const first = p.keywords.split(",")[0]?.trim();
        if (first) set.add(first);
      }
    }
    return Array.from(set).sort();
  } catch (error) {
    logger.error("Failed to fetch blog categories", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export async function getPublicSiteSettings(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: {
        group: { in: ["general", "contact", "geosentry"] },
      },
    });
    const map: Record<string, string> = {};
    for (const row of rows) {
      map[row.key] = row.value;
    }
    return map;
  } catch (error) {
    logger.error("Failed to fetch public site settings", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {};
  }
}


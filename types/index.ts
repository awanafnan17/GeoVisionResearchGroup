import type { Prisma } from "@prisma/client";

// ═══════════════════════════════════════════════════════════
// Prisma Relations Types
// ═══════════════════════════════════════════════════════════

export type UserWithRelations = Prisma.UserGetPayload<{
  include: { expertProfile: true; accounts: true; enrollments: true; blogPosts: true };
}>;

export type ExpertProfileWithRelations = Prisma.ExpertProfileGetPayload<{
  include: { user: true; specializations: { include: { specialization: true } }; projects: true };
}>;

export type CourseWithRelations = Prisma.CourseGetPayload<{
  include: { instructor: true; specialization: true; enrollments: true };
}>;

export type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: { service: true; teamMembers: { include: { expertProfile: true } } };
}>;

export type LeadWithRelations = Prisma.LeadGetPayload<{
  include: { assignedTo: true; expertProfile: true; service: true; notes: true };
}>;

export type GeoSentryRequestWithRelations = Prisma.GeoSentryRequestGetPayload<{
  include: { assignedTo: true; statusNotes: true };
}>;

// ═══════════════════════════════════════════════════════════
// UI Types
// ═══════════════════════════════════════════════════════════

export interface NavLink {
  href: string;
  label: string;
  icon?: string;
  badge?: string;
  description?: string;
}

export interface PortalNavItem {
  href: string;
  label: string;
  icon: string;
  roles: string[];
}

export interface SpecializationType {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
}

export interface ServiceCard {
  id: string;
  title: string;
  slug: string;
  icon: string;
  tagline: string;
  coverImage?: string;
}

// ═══════════════════════════════════════════════════════════
// API Types
// ═══════════════════════════════════════════════════════════

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface FormState {
  success?: boolean;
  error?: string;
  message?: string;
}

export interface UploadedFile {
  url: string;
  name: string;
  size: number;
  type: string;
}

// ═══════════════════════════════════════════════════════════
// GeoSentry Types
// ═══════════════════════════════════════════════════════════

export interface GeoSentryRequestForm {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientOrganization?: string;
  clientCountry?: string;
  clientWebsite?: string;
  clientLinkedIn?: string;
  targetName: string;
  targetCountry: string;
  targetRegion?: string;
  targetCoordinates?: string;
  depositType: string;
  commodityFocus: string;
  commodities?: string[];
  targetSizeHectares?: number;
  existingData?: string;
  projectDescription: string;
  specificConcerns?: string;
  keyQuestions?: string;
  additionalContext?: string;
  budget?: string;
  currency?: string;
  timeline?: string;
  priority?: string;
  source?: string;
}

export interface GeoSentryStatusUpdate {
  requestId: string;
  status: string;
  note?: string;
}

export interface GeoSentryScoring {
  geological: number;
  jurisdiction: number;
  operator: number;
  total: number;
}

export interface DepositTypeOption {
  value: string;
  label: string;
  description: string;
}

export interface VerdictDisplay {
  verdict: string;
  color: string;
  label: string;
  description: string;
}

// ═══════════════════════════════════════════════════════════
// Data Interfaces
// ═══════════════════════════════════════════════════════════

export interface Education {
  degree: string;
  institution: string;
  year: string;
  field?: string;
}

export interface Experience {
  title: string;
  organization: string;
  startYear: string;
  endYear?: string;
  description?: string;
}

export interface Publication {
  title: string;
  journal?: string;
  year: string;
  doi?: string;
  url?: string;
  authors?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  expiryYear?: string;
}

export interface SyllabusItem {
  title: string;
  description: string;
  duration?: string;
  topics?: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Deliverable {
  title: string;
  description: string;
  format?: string;
}

// ═══════════════════════════════════════════════════════════
// Auth Types
// ═══════════════════════════════════════════════════════════

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string | null;
}

export interface AuthError {
  type: string;
  message: string;
}

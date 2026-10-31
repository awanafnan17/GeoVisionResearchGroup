export interface PortalUser {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  role: "SUPERADMIN" | "ADMIN" | "GEOSENTRY_MANAGER" | "EXPERT" | "STUDENT";
  isActive: boolean;
  loginAttempts: number;
  lockedUntil: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  expertProfile?: {
    id: string;
    fullName: string;
    designation: string;
    status: string;
  } | null;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
  field?: string;
}

export interface ExperienceEntry {
  title: string;
  organization: string;
  startYear: string;
  endYear?: string;
  description?: string;
}

export interface PublicationEntry {
  title: string;
  journal?: string;
  year: string;
  doi?: string;
  url?: string;
  authors?: string;
}

export interface CertificationEntry {
  name: string;
  issuer: string;
  year: string;
  expiryYear?: string;
}

export interface PortalExpert {
  id: string;
  userId: string;
  slug: string;
  fullName: string;
  designation: string;
  shortBio: string;
  fullBio?: string | null;
  profilePhoto?: string | null;
  cvFile?: string | null;
  cvDownloads: number;
  cvIsPublic: boolean;
  linkedin?: string | null;
  twitter?: string | null;
  researchgate?: string | null;
  googleScholar?: string | null;
  orcid?: string | null;
  website?: string | null;
  education?: EducationEntry[] | null;
  experience?: ExperienceEntry[] | null;
  publications?: PublicationEntry[] | null;
  certifications?: CertificationEntry[] | null;
  status: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  isGeoSentryFounder: boolean;
  profileViews: number;
  sortOrder: number;
  city?: string | null;
  country?: string | null;
  createdAt: string;
  updatedAt?: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  } | null;
  specializations?: Array<{
    id?: string;
    specialization?: { id: string; name: string; slug: string };
    name?: string;
  }>;
}

export interface PortalService {
  id: string;
  slug: string;
  title: string;
  tagline?: string | null;
  description: string;
  fullContent?: string | null;
  icon?: string | null;
  methodology?: string | null;
  deliverables?: unknown;
  tools?: unknown;
  faqs?: unknown;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  specializationId?: string | null;
  specialization?: { id: string; name: string } | null;
  createdAt: string;
}

export interface SyllabusModule {
  title: string;
  description: string;
  duration?: string;
  topics?: string[];
}

export interface PortalCourse {
  id: string;
  slug: string;
  title: string;
  tagline?: string | null;
  description: string;
  fullContent?: string | null;
  instructorId: string;
  instructor?: { id: string; name: string | null; email: string } | null;
  mode: "ONLINE" | "ONSITE" | "HYBRID";
  status: "DRAFT" | "PUBLISHED" | "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  startDate?: string | null;
  endDate?: string | null;
  durationText?: string | null;
  schedule?: string | null;
  fee?: number | string | null;
  currency: string;
  earlyBirdFee?: number | string | null;
  maxSeats?: number | null;
  minSeats?: number | null;
  prerequisites?: string | null;
  targetAudience?: string | null;
  syllabus?: SyllabusModule[] | null;
  location?: string | null;
  certificate: boolean;
  createdAt: string;
  _count?: { enrollments: number };
  enrollments?: PortalEnrollment[];
}

export interface PortalEnrollment {
  id: string;
  courseId: string;
  userId?: string | null;
  guestName?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
  guestOrganization?: string | null;
  guestCountry?: string | null;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  notes?: string | null;
  createdAt: string;
  course?: PortalCourse;
  user?: { id: string; name: string | null; email: string } | null;
  payment?: PortalPayment | null;
}

export interface PortalPayment {
  id: string;
  enrollmentId: string;
  invoiceNumber: string;
  amount: number | string;
  currency: string;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "MANUAL_REVIEW";
  method: "STRIPE" | "PAYPAL" | "BANK_TRANSFER" | "OTHER";
  bankReference?: string | null;
  receiptImage?: string | null;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  paidAt?: string | null;
  notes?: string | null;
  createdAt: string;
  enrollment?: {
    id: string;
    status: string;
    guestName?: string | null;
    guestEmail?: string | null;
    user?: { id: string; name: string | null; email: string } | null;
    course?: { id: string; title: string; slug: string; mode?: string; schedule?: string | null } | null;
  } | null;
}

export interface PortalLeadNote {
  id: string;
  leadId: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

export interface PortalLead {
  id: string;
  type: "GENERAL_INQUIRY" | "PROJECT_INQUIRY" | "EXPERT_CONTACT" | "COURSE_INQUIRY";
  status: "NEW" | "CONTACTED" | "IN_DISCUSSION" | "PROPOSAL_SENT" | "WON" | "LOST" | "CLOSED";
  name: string;
  email: string;
  phone?: string | null;
  organization?: string | null;
  country?: string | null;
  subject?: string | null;
  message: string;
  projectLocation?: string | null;
  projectTimeline?: string | null;
  projectBudget?: string | null;
  projectType?: string | null;
  assignedToId?: string | null;
  expertProfileId?: string | null;
  serviceId?: string | null;
  isRead: boolean;
  createdAt: string;
  assignedTo?: { id: string; name: string | null; email: string } | null;
  expertProfile?: { id: string; fullName: string } | null;
  service?: { id: string; title: string } | null;
  notes?: PortalLeadNote[];
}

export interface PortalProject {
  id: string;
  slug: string;
  title: string;
  client?: string | null;
  sector?: string | null;
  country?: string | null;
  city?: string | null;
  year?: number | null;
  duration?: string | null;
  description: string;
  fullContent?: string | null;
  objectives?: string | null;
  methodology?: string | null;
  results?: string | null;
  isConfidential: boolean;
  coverImage?: string | null;
  status: "DRAFT" | "PUBLISHED";
  isFeatured: boolean;
  serviceId?: string | null;
  service?: { id: string; title: string } | null;
  teamMembers?: Array<{
    id: string;
    role?: string | null;
    expertProfileId: string;
    expertProfile?: { id: string; fullName: string; userId?: string };
  }>;
  createdAt: string;
}

export interface PortalBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  readTime?: string | null;
  authorId: string;
  author?: { id: string; name: string | null; email: string } | null;
  publishedAt?: string | null;
  createdAt: string;
}

export interface PortalAuditLog {
  id: string;
  userId?: string | null;
  action: string;
  entity?: string | null;
  entityId?: string | null;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  user?: { id: string; name: string | null; email: string; role: string } | null;
}

export interface PortalSiteSetting {
  id?: string;
  key: string;
  value: string;
  type?: string;
  group?: string | null;
  label?: string | null;
}

export interface PortalGeoSentryNote {
  id: string;
  requestId: string;
  content: string;
  isInternal: boolean;
  createdBy: string;
  createdAt: string;
}

export interface PortalGeoSentryRequest {
  id: string;
  referenceNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  clientOrganization?: string | null;
  clientCountry?: string | null;
  clientWebsite?: string | null;
  clientLinkedIn?: string | null;
  targetName: string;
  targetCountry: string;
  targetRegion?: string | null;
  targetCoordinates?: string | null;
  depositType: string;
  commodityFocus: string;
  commodities?: string[] | null;
  targetSizeHectares?: number | string | null;
  existingData?: string | null;
  projectDescription: string;
  specificConcerns?: string | null;
  keyQuestions?: string | null;
  additionalContext?: string | null;
  budget?: string | null;
  currency: string;
  timeline?: string | null;
  priority: "STANDARD" | "RUSH";
  quotedPrice?: number | string | null;
  quotedCurrency: string;
  invoiceFile?: string | null;
  status: string;
  internalNotes?: string | null;
  clientNotes?: string | null;
  statusHistory?: Array<{ status: string; timestamp: string; note?: string }> | null;
  reportFile?: string | null;
  reportSummary?: string | null;
  overallScore?: number | null;
  geologicalScore?: number | null;
  jurisdictionScore?: number | null;
  operatorScore?: number | null;
  verdict: "GO" | "NO_GO" | "CONDITIONAL" | "PENDING";
  deliveredAt?: string | null;
  source?: string | null;
  isRead: boolean;
  assignedToId?: string | null;
  assignedTo?: { id: string; name: string | null; email: string } | null;
  statusNotes?: PortalGeoSentryNote[];
  createdAt: string;
  updatedAt: string;
}

const ARRAY_KEYS = [
  "items",
  "requests",
  "users",
  "experts",
  "services",
  "courses",
  "enrollments",
  "payments",
  "leads",
  "projects",
  "posts",
  "blogPosts",
  "logs",
  "auditLogs",
  "settings",
  "records",
  "data",
];

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

export function extractArray<T>(payload: unknown, extraKeys: string[] = []): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }
  if (!isRecord(payload)) {
    return [];
  }
  const keys = [...extraKeys, ...ARRAY_KEYS];
  if ("data" in payload) {
    const inner = payload.data;
    if (Array.isArray(inner)) {
      return inner as T[];
    }
    if (isRecord(inner)) {
      for (const k of keys) {
        if (k in inner && Array.isArray(inner[k])) {
          return inner[k] as T[];
        }
      }
    }
  }
  for (const k of keys) {
    if (k in payload && Array.isArray(payload[k])) {
      return payload[k] as T[];
    }
  }
  return [];
}

export function extractObject<T>(payload: unknown, extraKeys: string[] = []): T | null {
  if (!isRecord(payload)) {
    return null;
  }
  if ("data" in payload && isRecord(payload.data)) {
    const inner = payload.data;
    for (const k of extraKeys) {
      if (k in inner && isRecord(inner[k])) {
        return inner[k] as unknown as T;
      }
    }
    return inner as unknown as T;
  }
  for (const k of extraKeys) {
    if (k in payload && isRecord(payload[k])) {
      return payload[k] as unknown as T;
    }
  }
  return payload as unknown as T;
}

export async function portalFetch<T = unknown>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  if (!res.ok) {
    if (isRecord(body)) {
      const msg = typeof body.error === "string" ? body.error : typeof body.message === "string" ? body.message : `Request failed (${res.status})`;
      throw new Error(msg);
    }
    throw new Error(`Request failed (${res.status})`);
  }
  if (isRecord(body) && body.success === false) {
    const msg = typeof body.error === "string" ? body.error : "Operation failed";
    throw new Error(msg);
  }
  return body as T;
}

export const DEPOSIT_TYPE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "PORPHYRY", label: "Porphyry Cu-Au-Mo" },
  { value: "VMS", label: "Volcanogenic Massive Sulfide (VMS)" },
  { value: "EPITHERMAL_HIGH_SULPHIDATION", label: "Epithermal High-Sulphidation" },
  { value: "EPITHERMAL_LOW_SULPHIDATION", label: "Epithermal Low-Sulphidation" },
  { value: "OROGENIC_GOLD", label: "Orogenic Gold" },
  { value: "OPHIOLITE_HOSTED", label: "Ophiolite-Hosted" },
  { value: "IOCG", label: "Iron Oxide Copper-Gold (IOCG)" },
  { value: "SKARN", label: "Skarn" },
  { value: "SEDEX", label: "Sedimentary Exhalative (SEDEX)" },
  { value: "CARLIN_TYPE", label: "Carlin-Type Gold" },
  { value: "PODIFORM_CHROMITE", label: "Podiform Chromite" },
  { value: "NICKEL_LATERITE", label: "Nickel Laterite" },
  { value: "LATERITE_SAPROLITE", label: "Laterite / Saprolite" },
  { value: "PEGMATITE_LITHIUM_REE", label: "Pegmatite (Lithium / REE)" },
  { value: "BIF_IRON", label: "Banded Iron Formation (BIF)" },
  { value: "PLACER_GOLD", label: "Placer Gold" },
  { value: "MANGANESE", label: "Manganese" },
  { value: "PHOSPHATE", label: "Phosphate" },
  { value: "BAUXITE", label: "Bauxite" },
  { value: "MVT_LEAD_ZINC", label: "MVT Lead-Zinc" },
  { value: "INTRUSION_RELATED", label: "Intrusion-Related" },
  { value: "VOLCANIC_HOSTED", label: "Volcanic-Hosted" },
  { value: "SEDIMENT_HOSTED", label: "Sediment-Hosted" },
  { value: "OTHER", label: "Other Deposit Type" },
];

export const GEOSENTRY_STATUS_OPTIONS = [
  "SUBMITTED",
  "RECEIVED",
  "REVIEWING",
  "AWAITING_INFO",
  "IN_PROGRESS",
  "QUALITY_CHECK",
  "COMPLETED",
  "DELIVERED",
  "ON_HOLD",
  "CANCELLED",
] as const;

export const GEOSENTRY_VERDICT_OPTIONS = [
  { value: "PENDING", label: "Pending Assessment" },
  { value: "GO", label: "GO (Proceed)" },
  { value: "CONDITIONAL", label: "CONDITIONAL (Proceed with Conditions)" },
  { value: "NO_GO", label: "NO GO (Do Not Proceed)" },
] as const;

export function getVerdictBadgeVariant(verdict: string): "success" | "warning" | "danger" | "slate" {
  if (verdict === "GO") return "success";
  if (verdict === "CONDITIONAL") return "warning";
  if (verdict === "NO_GO") return "danger";
  return "slate";
}

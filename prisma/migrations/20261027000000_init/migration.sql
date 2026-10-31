-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'ADMIN', 'EXPERT', 'GEOSENTRY_MANAGER', 'STUDENT');

-- CreateEnum
CREATE TYPE "ProfileStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'IN_DISCUSSION', 'PROPOSAL_SENT', 'WON', 'LOST', 'CLOSED');

-- CreateEnum
CREATE TYPE "LeadType" AS ENUM ('GENERAL_INQUIRY', 'PROJECT_INQUIRY', 'EXPERT_CONTACT', 'COURSE_INQUIRY');

-- CreateEnum
CREATE TYPE "CourseMode" AS ENUM ('ONLINE', 'ONSITE', 'HYBRID');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'MANUAL_REVIEW');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('STRIPE', 'PAYPAL', 'BANK_TRANSFER', 'OTHER');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "GeoSentryStatus" AS ENUM ('SUBMITTED', 'RECEIVED', 'REVIEWING', 'AWAITING_INFO', 'IN_PROGRESS', 'QUALITY_CHECK', 'COMPLETED', 'DELIVERED', 'REVISION_REQUESTED', 'ON_HOLD', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "GeoSentryPriority" AS ENUM ('STANDARD', 'RUSH');

-- CreateEnum
CREATE TYPE "GeoSentryVerdict" AS ENUM ('GO', 'NO_GO', 'CONDITIONAL', 'PENDING');

-- CreateEnum
CREATE TYPE "DepositType" AS ENUM ('PORPHYRY', 'VMS', 'EPITHERMAL_HIGH_SULPHIDATION', 'EPITHERMAL_LOW_SULPHIDATION', 'OROGENIC_GOLD', 'OPHIOLITE_HOSTED', 'IOCG', 'SKARN', 'SEDEX', 'CARLIN_TYPE', 'PODIFORM_CHROMITE', 'NICKEL_LATERITE', 'LATERITE_SAPROLITE', 'PEGMATITE_LITHIUM_REE', 'BIF_IRON', 'PLACER_GOLD', 'MANGANESE', 'PHOSPHATE', 'BAUXITE', 'MVT_LEAD_ZINC', 'INTRUSION_RELATED', 'VOLCANIC_HOSTED', 'SEDIMENT_HOSTED', 'OTHER');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'LOGIN_FAILED', 'FILE_DOWNLOAD', 'FILE_UPLOAD', 'ROLE_CHANGE', 'STATUS_CHANGE', 'VIEW_SENSITIVE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT,
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "loginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "expert_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "shortBio" TEXT NOT NULL,
    "fullBio" TEXT,
    "profilePhoto" TEXT,
    "cvFile" TEXT,
    "cvDownloads" INTEGER NOT NULL DEFAULT 0,
    "cvIsPublic" BOOLEAN NOT NULL DEFAULT true,
    "phone" TEXT,
    "whatsapp" TEXT,
    "officeEmail" TEXT,
    "linkedin" TEXT,
    "twitter" TEXT,
    "researchgate" TEXT,
    "googleScholar" TEXT,
    "orcid" TEXT,
    "website" TEXT,
    "education" JSONB,
    "experience" JSONB,
    "publications" JSONB,
    "certifications" JSONB,
    "languages" JSONB,
    "awards" JSONB,
    "status" "ProfileStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isGeoSentryFounder" BOOLEAN NOT NULL DEFAULT false,
    "profileViews" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "city" TEXT,
    "country" TEXT,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expert_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specializations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "specializations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_specializations" (
    "id" TEXT NOT NULL,
    "expertProfileId" TEXT NOT NULL,
    "specializationId" TEXT NOT NULL,

    CONSTRAINT "expert_specializations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT,
    "description" TEXT NOT NULL,
    "fullContent" TEXT,
    "icon" TEXT,
    "heroImage" TEXT,
    "coverImage" TEXT,
    "methodology" TEXT,
    "deliverables" JSONB,
    "tools" JSONB,
    "faqs" JSONB,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "keywords" TEXT,
    "specializationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT,
    "description" TEXT NOT NULL,
    "fullContent" TEXT,
    "thumbnail" TEXT,
    "coverImage" TEXT,
    "instructorId" TEXT NOT NULL,
    "mode" "CourseMode" NOT NULL,
    "status" "CourseStatus" NOT NULL DEFAULT 'DRAFT',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "durationText" TEXT,
    "schedule" TEXT,
    "fee" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "earlyBirdFee" DECIMAL(10,2),
    "earlyBirdDeadline" TIMESTAMP(3),
    "maxSeats" INTEGER,
    "minSeats" INTEGER,
    "prerequisites" TEXT,
    "targetAudience" TEXT,
    "syllabus" JSONB,
    "learningOutcomes" JSONB,
    "includes" JSONB,
    "location" TEXT,
    "certificate" BOOLEAN NOT NULL DEFAULT false,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "keywords" TEXT,
    "specializationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "userId" TEXT,
    "guestName" TEXT,
    "guestEmail" TEXT,
    "guestPhone" TEXT,
    "guestOrganization" TEXT,
    "guestCountry" TEXT,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "method" "PaymentMethod" NOT NULL DEFAULT 'BANK_TRANSFER',
    "gatewayProvider" TEXT,
    "gatewayPaymentId" TEXT,
    "gatewayResponse" JSONB,
    "bankReference" TEXT,
    "receiptImage" TEXT,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "client" TEXT,
    "sector" TEXT,
    "country" TEXT,
    "city" TEXT,
    "year" INTEGER,
    "duration" TEXT,
    "description" TEXT NOT NULL,
    "fullContent" TEXT,
    "objectives" TEXT,
    "methodology" TEXT,
    "results" TEXT,
    "isConfidential" BOOLEAN NOT NULL DEFAULT false,
    "images" JSONB,
    "coverImage" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "serviceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_team_members" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "expertProfileId" TEXT NOT NULL,
    "role" TEXT,

    CONSTRAINT "project_team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "type" "LeadType" NOT NULL DEFAULT 'GENERAL_INQUIRY',
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "organization" TEXT,
    "country" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "attachment" TEXT,
    "projectLocation" TEXT,
    "projectTimeline" TEXT,
    "projectBudget" TEXT,
    "projectType" TEXT,
    "assignedToId" TEXT,
    "expertProfileId" TEXT,
    "serviceId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_notes" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "status" "BlogStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "readTime" TEXT,
    "authorId" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "keywords" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT,
    "organization" TEXT,
    "country" TEXT,
    "photo" TEXT,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_files" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "alt" TEXT,
    "caption" TEXT,
    "folder" TEXT,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'text',
    "group" TEXT,
    "label" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" "AuditAction" NOT NULL,
    "entity" TEXT,
    "entityId" TEXT,
    "oldValue" JSONB,
    "newValue" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geosentry_requests" (
    "id" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientPhone" TEXT,
    "clientOrganization" TEXT,
    "clientCountry" TEXT,
    "clientWebsite" TEXT,
    "clientLinkedIn" TEXT,
    "targetName" TEXT NOT NULL,
    "targetCountry" TEXT NOT NULL,
    "targetRegion" TEXT,
    "targetCoordinates" TEXT,
    "depositType" "DepositType" NOT NULL,
    "commodityFocus" TEXT NOT NULL,
    "commodities" JSONB,
    "targetSizeHectares" DECIMAL(12,2),
    "existingData" TEXT,
    "projectDescription" TEXT NOT NULL,
    "specificConcerns" TEXT,
    "keyQuestions" TEXT,
    "additionalContext" TEXT,
    "attachments" JSONB,
    "budget" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "timeline" TEXT,
    "priority" "GeoSentryPriority" NOT NULL DEFAULT 'STANDARD',
    "quotedPrice" DECIMAL(10,2),
    "quotedCurrency" TEXT NOT NULL DEFAULT 'USD',
    "invoiceFile" TEXT,
    "status" "GeoSentryStatus" NOT NULL DEFAULT 'SUBMITTED',
    "internalNotes" TEXT,
    "clientNotes" TEXT,
    "statusHistory" JSONB,
    "reportFile" TEXT,
    "reportSummary" TEXT,
    "overallScore" INTEGER,
    "geologicalScore" INTEGER,
    "jurisdictionScore" INTEGER,
    "operatorScore" INTEGER,
    "verdict" "GeoSentryVerdict" NOT NULL DEFAULT 'PENDING',
    "deliveredAt" TIMESTAMP(3),
    "source" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "assignedToId" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "geosentry_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geosentry_notes" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "geosentry_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "expert_profiles_userId_key" ON "expert_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "expert_profiles_slug_key" ON "expert_profiles"("slug");

-- CreateIndex
CREATE INDEX "expert_profiles_status_isFeatured_sortOrder_idx" ON "expert_profiles"("status", "isFeatured", "sortOrder");

-- CreateIndex
CREATE INDEX "expert_profiles_country_idx" ON "expert_profiles"("country");

-- CreateIndex
CREATE UNIQUE INDEX "specializations_name_key" ON "specializations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "specializations_slug_key" ON "specializations"("slug");

-- CreateIndex
CREATE INDEX "expert_specializations_specializationId_idx" ON "expert_specializations"("specializationId");

-- CreateIndex
CREATE UNIQUE INDEX "expert_specializations_expertProfileId_specializationId_key" ON "expert_specializations"("expertProfileId", "specializationId");

-- CreateIndex
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");

-- CreateIndex
CREATE INDEX "services_isPublished_sortOrder_idx" ON "services"("isPublished", "sortOrder");

-- CreateIndex
CREATE INDEX "services_specializationId_idx" ON "services"("specializationId");

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

-- CreateIndex
CREATE INDEX "courses_status_startDate_idx" ON "courses"("status", "startDate");

-- CreateIndex
CREATE INDEX "courses_instructorId_idx" ON "courses"("instructorId");

-- CreateIndex
CREATE INDEX "courses_specializationId_idx" ON "courses"("specializationId");

-- CreateIndex
CREATE INDEX "enrollments_courseId_idx" ON "enrollments"("courseId");

-- CreateIndex
CREATE INDEX "enrollments_userId_idx" ON "enrollments"("userId");

-- CreateIndex
CREATE INDEX "enrollments_status_idx" ON "enrollments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "payments_enrollmentId_key" ON "payments"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_invoiceNumber_key" ON "payments"("invoiceNumber");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_status_isFeatured_year_idx" ON "projects"("status", "isFeatured", "year");

-- CreateIndex
CREATE INDEX "projects_serviceId_status_year_idx" ON "projects"("serviceId", "status", "year");

-- CreateIndex
CREATE INDEX "projects_country_idx" ON "projects"("country");

-- CreateIndex
CREATE INDEX "project_team_members_expertProfileId_idx" ON "project_team_members"("expertProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "project_team_members_projectId_expertProfileId_key" ON "project_team_members"("projectId", "expertProfileId");

-- CreateIndex
CREATE INDEX "leads_status_createdAt_idx" ON "leads"("status", "createdAt");

-- CreateIndex
CREATE INDEX "leads_assignedToId_idx" ON "leads"("assignedToId");

-- CreateIndex
CREATE INDEX "lead_notes_leadId_idx" ON "lead_notes"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_status_isFeatured_publishedAt_idx" ON "blog_posts"("status", "isFeatured", "publishedAt");

-- CreateIndex
CREATE INDEX "blog_posts_authorId_idx" ON "blog_posts"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "site_settings_key_key" ON "site_settings"("key");

-- CreateIndex
CREATE INDEX "audit_logs_userId_createdAt_idx" ON "audit_logs"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_action_createdAt_idx" ON "audit_logs"("action", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_entity_entityId_idx" ON "audit_logs"("entity", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "geosentry_requests_referenceNumber_key" ON "geosentry_requests"("referenceNumber");

-- CreateIndex
CREATE INDEX "geosentry_requests_status_priority_createdAt_idx" ON "geosentry_requests"("status", "priority", "createdAt");

-- CreateIndex
CREATE INDEX "geosentry_requests_assignedToId_idx" ON "geosentry_requests"("assignedToId");

-- CreateIndex
CREATE INDEX "geosentry_requests_clientEmail_idx" ON "geosentry_requests"("clientEmail");

-- CreateIndex
CREATE INDEX "geosentry_notes_requestId_idx" ON "geosentry_notes"("requestId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_profiles" ADD CONSTRAINT "expert_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_specializations" ADD CONSTRAINT "expert_specializations_expertProfileId_fkey" FOREIGN KEY ("expertProfileId") REFERENCES "expert_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_specializations" ADD CONSTRAINT "expert_specializations_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "specializations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "specializations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "specializations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_team_members" ADD CONSTRAINT "project_team_members_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_team_members" ADD CONSTRAINT "project_team_members_expertProfileId_fkey" FOREIGN KEY ("expertProfileId") REFERENCES "expert_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_expertProfileId_fkey" FOREIGN KEY ("expertProfileId") REFERENCES "expert_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_notes" ADD CONSTRAINT "lead_notes_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geosentry_requests" ADD CONSTRAINT "geosentry_requests_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geosentry_notes" ADD CONSTRAINT "geosentry_notes_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "geosentry_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;


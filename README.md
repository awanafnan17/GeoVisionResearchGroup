<div align="center">

# GeoVision Research Group

### Public geoscience site · GeoSentry screening · courses · role-based portals

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Status](https://img.shields.io/badge/status-development-f59e0b)](#current-status)

One application for public geoscience content, structured geological screening, courses, and day-to-day administration.

[Features](#what-is-included) · [Architecture](docs/ARCHITECTURE.md) · [Setup](#local-setup) · [Deployment](docs/DEPLOYMENT.md) · [Security](SECURITY.md)

</div>

## Why this project exists

GeoVision keeps public content, geological screening, learning, and administration in one application. Visitors can explore services, experts, publications, projects, courses, and the **GeoSentry** mineral-target screening workflow. Authorized users have separate workspaces for administration, experts, students, and screening operations.

This public repository shows the application structure and workflows. It does **not** include the owner's production database, people records, CVs, uploaded files, cloud state, real credentials, or private deployment reports.

## What is included

- An editorial public site for consultancy services, experts, case studies, courses, publications, resources, and research articles.
- GeoSentry request intake, reference tracking, status management, analytics, and a documented 100-point screening framework.
- Super-admin and admin consoles for users, services, experts, courses, projects, leads, blog content, payments, settings, and audit events.
- Expert workspaces for profiles, CVs, projects, publications, leads, and settings.
- Student workspaces for course access, enrollment visibility, payments, and account settings.
- Authentication with role/channel checks, account lockout state, audit logging, and predictable-demo-password protection.
- PostgreSQL data modeling through Prisma, including 22 application models and checked-in migrations.
- Responsive React interfaces, motion, accessible components, and a WebGL geological hero with a non-WebGL fallback.
- SEO metadata, structured data, sitemap/robots endpoints, security headers, server-side validation, and local rate limiting.

## Product areas

| Area | Audience | Representative capabilities |
|---|---|---|
| Public research site | Visitors and prospective clients | Services, team, courses, projects, publications, resources, contact |
| GeoSentry | Exploration teams and screening staff | Request intake, deposit classification, tracking, review statuses, reports |
| Operations console | Super-admins and admins | Content, users, leads, settings, payments, audit logs |
| Expert portal | Geoscience specialists | Profile, CV, projects, publications, assigned leads |
| Student portal | Course participants | Courses, enrollment state, payment records, settings |

## Technology

| Layer | Implementation |
|---|---|
| Web application | Next.js 16 App Router, React 19, TypeScript 5 |
| Interface | Tailwind CSS, Radix UI primitives, Framer Motion, GSAP |
| 3D presentation | Three.js, React Three Fiber, Drei |
| Data | PostgreSQL, Prisma 7, checked-in SQL migration |
| Authentication | Auth.js / NextAuth v5, credentials provider, bcrypt |
| Validation and forms | Zod, React Hook Form |
| Content editing | Tiptap |
| Charts | Recharts |
| Optional integrations | Resend email and UploadThing-compatible media paths |
| Deployment targets | Node server, Docker, Vercel, or Netlify |

## Local setup

### Requirements

- Node.js 22+
- npm 10+
- PostgreSQL 15+ (local or hosted)

### macOS / Linux

```bash
git clone https://github.com/awanafnan17/GeoVisionResearchGroup.git
cd GeoVisionResearchGroup
npm ci
cp .env.example .env.local
npm run db:migrate:deploy
npm run dev
```

### Windows PowerShell

```powershell
git clone https://github.com/awanafnan17/GeoVisionResearchGroup.git
Set-Location GeoVisionResearchGroup
npm ci
Copy-Item .env.example .env.local
npm run db:migrate:deploy
npm run dev
```

Before running a migration, replace the example database URLs and authentication secrets in `.env.local`. No account is created automatically in this public snapshot; provision users through your own reviewed administration process.

Open `http://localhost:3000`. The public pages can render graceful empty states when PostgreSQL is unavailable, but authentication, portals, request tracking, and content management require a configured database.

## Quality checks

```bash
npm run lint
npm run type-check
npm run build
```

The GitHub workflow runs the same source checks with non-production placeholder environment values. Passing compilation does not establish production security, mail delivery, database availability, or geological accuracy.

## Current status

This repository is a **development source release** for code review and local evaluation. It is not ready for an unattended production launch. Before deployment, add a distributed rate limiter, review file scanning and storage, configure backups, rotate all secrets, create least-privilege database roles, and perform an application security review.

GeoSentry scores and verdict labels support the review workflow. They do not replace field investigation, qualified-person review, legal due diligence, or an investment decision.

## Privacy and publication boundary

The following are deliberately excluded:

- `.env*` files other than the placeholder template;
- production/staging database exports and connection metadata;
- seeded accounts and generated passwords;
- personal CVs, uploaded documents, customer requests, leads, payments, and audit logs;
- Netlify/Vercel state, deployment scripts, screenshots from private environments, and operator handoff reports.

Read [SECURITY.md](SECURITY.md) before connecting the application to real people or operational data.

## Repository map

```text
app/                 Next.js routes, portals, APIs and metadata endpoints
components/          Public, portal, GeoSentry, UI and Three.js components
hooks/               Session, rate-limit, audit and portal-state hooks
lib/                 Auth, database, security, email, SEO and API helpers
prisma/              Data model and migration history (no database contents)
public/              Generic public assets only
docs/                Architecture and deployment guidance
```

## Attribution

Designed and integrated by **Afnan Mehmood Awan**. `DESIGN_SYSTEM.md` records visual references and their licensing boundaries. Dependencies retain their own licenses. No license is granted for third-party brands, geological data, uploaded content, or model/report outputs merely because this source is public.

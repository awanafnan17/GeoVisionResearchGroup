# Deployment guide

## Required configuration

Create deployment secrets from `.env.example`; never deploy that file verbatim.

| Variable group | Purpose |
|---|---|
| `DATABASE_URL`, `DIRECT_URL` | Pooled runtime and direct migration connections |
| `AUTH_SECRET`, `NEXTAUTH_SECRET` | Session/token signing secrets |
| `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL` | Canonical deployment URLs |
| `RESEND_API_KEY`, mail addresses | Optional transactional mail |
| `INITIAL_*_PASSWORD` | Not used by this public snapshot; do not create predictable seed accounts |

Generate independent random secrets, use a least-privilege PostgreSQL role, and run `npm run db:migrate:deploy` as a controlled release step. Do not run `db:reset` against an environment containing data.

## Build

```bash
npm ci
npm run lint
npm run type-check
npm run build
npm start
```

The included Dockerfile is a source build target; review its base-image digest, runtime user, environment injection, health checks, and image-scanning policy before production use.

## Production checklist

1. Configure database backups and test restoration.
2. Rotate application/session/database/email keys independently.
3. Replace the in-memory rate limiter with a shared service.
4. Add upload storage isolation, magic-byte validation, malware scanning, and retention rules.
5. Configure HTTPS, trusted proxy behavior, CSP reporting, alerting, and audit retention.
6. Provision roles through an approved process; do not publish demo passwords.
7. Exercise authorization tests for every mutation route and role.
8. Review privacy, payment, geological-advice, and record-retention obligations for the deployment jurisdiction.

No production cloud project, database, DNS zone, or email account is configured by this repository.

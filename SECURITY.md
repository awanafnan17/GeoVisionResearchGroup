# Security policy

## Supported status

This repository is a development source release. It has not completed a production penetration test and should not be connected to sensitive client, student, payment, geological, or identity records without a deployment-specific review.

## Reporting

Use GitHub's private vulnerability-reporting flow when available. Do not put passwords, connection strings, private reports, CVs, customer requests, database rows, or cloud details in a public issue. Reproduce problems with synthetic data.

## Deployment requirements

- Keep all real values in a secrets manager; `.env.example` contains placeholders only.
- Use separate least-privilege database roles for runtime and migrations.
- Replace memory-local rate limiting in horizontally scaled environments.
- Add malware scanning and isolated object storage before enabling uploads.
- Review each route handler for authentication, role authorization, input validation, and safe error output.
- Configure logging to exclude passwords, tokens, uploaded content, and unnecessary personal data.
- Back up encrypted data and test deletion/restoration procedures.
- Rotate a credential immediately if it is ever committed; deleting the current file does not erase Git history.

The checked-in Content Security Policy currently permits inline/evaluated scripts required by parts of the development stack. Tighten it for the exact production bundle and integrations.

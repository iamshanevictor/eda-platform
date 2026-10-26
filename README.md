# EDA Platform

EDA Platform is a small-file CSV exploratory analysis app. Upload a dataset to inspect its statistics, missing values, correlations, and charts without sending dataset content to an AI provider.

## What it does

- Analyzes CSV files up to 2 MiB and 10,000 rows, with validation before storage.
- Shows summary statistics, data-quality signals, visualizations, and a browser-printable report.
- Keeps datasets within an anonymous Supabase session using owner-scoped Row Level Security. Access expires after 24 hours; scheduled cleanup removes the stored data later.

Uploads require Cloudflare Turnstile and are disabled unless the server's `UPLOADS_ENABLED` value is exactly `true`. See [Setup](docs/SETUP.md) for the required provider configuration and safe local upload testing.

## Quick start

Requires Node.js 24.x, npm 11.x, and Supabase configuration. From the repository root:

```powershell
npm ci
Copy-Item .env.example .env.local
# Set the Supabase values in .env.local
npm run dev
```

Open <http://localhost:3000>. The sample environment leaves uploads disabled; [Setup](docs/SETUP.md) explains how to enable them in a development environment.

## Built with

Next.js 16, React 19, TypeScript, Tailwind CSS, Supabase Auth/PostgreSQL, Cloudflare Turnstile, Papa Parse, and Recharts.

## Documentation

- [Setup](docs/SETUP.md) · [Architecture](docs/ARCHITECTURE.md) · [Development and quality checks](docs/DEVELOPMENT.md)
- [Deployment](docs/DEPLOYMENT.md) · [Security notes](docs/SECURITY_NOTES.md) · [Troubleshooting](docs/TROUBLESHOOTING.md)
- [Testing details](docs/TESTING.md) · [Project structure and records](docs/PROJECT_STRUCTURE.md) · [Contributing](.github/CONTRIBUTING.md) · [Security reporting](.github/SECURITY.md)

## License

No license file is included. Reuse and redistribution require permission from the owner.

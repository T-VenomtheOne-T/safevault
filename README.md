# SafeVault

SafeVault is a security-focused personal vault for sensitive digital information.

## Structure

- `backend/` — Express, TypeScript, Prisma, tests, and API configuration.
- `frontend/` — reserved for the web client.
- `docs/` — architecture and security decisions.
- `database/` — local database notes.
- `docker/` — container build definitions.

## Local development

1. Install Node.js 20 LTS or later and Docker Desktop.
2. Start MySQL: `docker compose up -d mysql`
3. Copy `backend/.env.example` to `backend/.env`.
4. Run `npm install` from `backend/`.
5. Create the schema: `npx prisma migrate dev --name init`.
6. Start the API: `npm run dev`.

The health endpoint is available at `http://localhost:3000/health`.

Read [the security architecture](docs/security-architecture.md) before implementing authentication or encryption.

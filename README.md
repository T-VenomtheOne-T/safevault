# SafeVault

SafeVault is a security-focused personal vault for sensitive digital information.

SafeVault

Mission
SafeVault is a secure personal vault designed to protect sensitive digital information through modern encryption, authentication, and secure software engineering practices.

Functional Requirements
A registered user can:
    • Register an account 
    • Log in securely 
    • Log out 
    • Store encrypted secrets 
    • Organize secrets into categories 
    • Edit secrets 
    • Delete secrets 
    • Search secrets 
    • View account activity 
    • Change password 
    • Reset password 
    • Manage profile 
    • View login history 
    • Enable MFA (later) 
    • View security dashboard 

Secret Types
Initially we'll support:
    • Password 
    • Secure Note 
    • API Key 
    • SSH Key 
    • Recovery Code 
Later versions can add:
    • Credit Cards 
    • Bank Accounts 
    • Certificates 
    • Cryptocurrency Wallets 
    • Identity Documents 

Technology Stack
I recommend the following modern stack.
Backend
    • Node.js (LTS) 
    • Express.js 
    • JavaScript (ES2023) 

Database
MySQL 8

ORM
Prisma
Why Prisma instead of raw SQL?
    • Type-safe queries 
    • Easy migrations 
    • Excellent documentation 
    • Widely used 
    • Professional-looking portfolio 

Authentication
    • JWT Access Tokens 
    • JWT Refresh Tokens 

Password Hashing
Argon2id

Encryption
AES-256-GCM

Validation
Zod

Logging
Pino

Security
    • Helmet 
    • CORS 
    • Express Rate Limit 
    • Cookie Parser 
    • dotenv 

API Documentation
Swagger / OpenAPI

Testing
Jest

Deployment
Docker
GitHub
GitHub Actions












Folder Structure

SafeVault/

├── backend/
│
├── frontend/
│
├── docs/
│
├── database/
│
├── docker/
│
├── .gitignore
│
├── docker-compose.yml
│
└── README.md


Backend:

backend/

src/

├── config/
├── controllers/
├── middleware/
├── routes/
├── services/
├── repositories/
├── validators/
├── security/
├── database/
├── utils/
├── models/
├── logs/
├── app.js
└── server.js



This separation keeps responsibilities clear:
    • Controllers handle HTTP requests. 
    • Services contain business logic. 
    • Repositories interact with the database. 
    • Middleware manages authentication, validation, and error handling. 
    • Security centralizes cryptography and security helpers.
API Design
We'll follow REST conventions.
Authentication:
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/reset-password


Vault:

GET    /api/vault
GET    /api/vault/:id
POST   /api/vault
PUT    /api/vault/:id
DELETE /api/vault/:id


Categories:

GET
POST
PUT
DELETE

Users:

GET /api/users/profile
PUT /api/users/profile
PUT /api/users/password


Audit Logs:

GET /api/logs











Git Workflow
We'll use a simple but professional branching strategy.

main

develop

feature/authentication

feature/vault

feature/encryption

feature/dashboard

feature/frontend


Every feature will be developed and tested independently before being merged into develop and then main.


First Milestone
Before writing the backend, we'll complete these foundational tasks:
    1. Create the Git repository. 
    2. Initialize the Node.js project. 
    3. Install and configure Express. 
    4. Set up environment variables. 
    5. Configure Prisma and connect to MySQL. 
    6. Create the initial folder structure. 
    7. Add ESLint and Prettier for consistent code quality. 
    8. Verify the server starts and responds to a health check endpoint. 
Once these are done, we'll have a clean, production-style backend foundation ready for implementing authentication.
From this point onward, I'll guide you as if we were building SafeVault for production: every decision will follow modern software engineering and cybersecurity best practices, with explanations of why we're doing something—not just how. This way, you'll finish with both a polished portfolio project and a deeper understanding of the architecture behind it.

Phase	Goal 	Status 
1	Project Planning & Architecture 	Current 
2	Development Environment 	Pending 
3	Backend Foundation 	Pending 
4	Authentication System 	Pending 
5	Vault CRUD API 	Pending 
6	Encryption Layer 	Pending 
7	Audit Logging 	Pending 
8	Dashboard API 	Pending 
9	Frontend 	Pending
10	Deployment 	Pending 



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

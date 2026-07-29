# SafeVault

> **A Zero-Knowledge Personal Secret Management Platform built with modern cybersecurity practices.**

---

# Overview

SafeVault is a full-stack web application designed to securely manage sensitive digital information using modern software engineering principles and cybersecurity best practices.

Unlike traditional password managers that simply store credentials, SafeVault is designed as a **Zero-Knowledge Personal Secret Management Platform**, where confidentiality, integrity, authentication, authorization, encryption, and auditing are treated as first-class citizens throughout the entire application.

This project serves three primary purposes:

* Professional cybersecurity portfolio project
* Practical study of secure software engineering
* Foundation for a future Master's Degree thesis in **Cybersecurity and Systems Administration**

The project is intentionally built following production-level architecture, coding standards, and security practices rather than tutorial-style development.

---

# Mission

Design and develop a secure, scalable, and production-ready platform capable of storing and protecting sensitive information while demonstrating modern cybersecurity techniques, cryptographic implementations, and secure software architecture.

---

# Project Objectives

SafeVault aims to demonstrate knowledge in:

* Secure Backend Development
* Authentication & Authorization
* Applied Cryptography
* REST API Design
* Database Security
* Secure Coding Practices
* Dockerized Deployments
* Logging & Monitoring
* DevSecOps
* Automated Testing
* CI/CD
* Secure System Design

---

# Core Principles

The project is built around the following security principles:

* Zero Trust Architecture
* Defense in Depth
* Least Privilege
* Principle of Secure Defaults
* Encryption by Default
* Security by Design
* Privacy by Design
* Fail Secure
* Separation of Concerns

---

# Features

## User Management

* User Registration
* Secure Login
* Secure Logout
* Password Change
* Password Reset
* Email Verification
* User Profile Management
* Account Deletion
* Session Management

---

## Authentication

* JWT Access Tokens
* JWT Refresh Tokens
* Refresh Token Rotation
* Secure HttpOnly Cookies
* Argon2id Password Hashing
* Password Strength Validation
* Password History
* Account Lockout Protection
* Login Attempt Monitoring
* Session Expiration

---

## Multi-Factor Authentication (Future)

* TOTP Authentication
* Recovery Codes
* MFA Backup Codes

---

## Secret Vault

Users will be able to securely store:

* Passwords
* Secure Notes
* API Keys
* SSH Keys
* Recovery Codes

Future support:

* Credit Cards
* Bank Accounts
* Identity Documents
* Certificates
* Cryptocurrency Wallets
* Software Licenses

---

## Categories

* Create Categories
* Edit Categories
* Delete Categories
* Organize Secrets
* Search by Category

---

## Search Engine

* Full Secret Search
* Category Search
* Tag Search
* Instant Filtering

---

## Security Dashboard

The dashboard will display:

* Last Login
* Active Sessions
* Login History
* Failed Login Attempts
* Security Score
* MFA Status
* Encryption Status
* Password Strength
* Stored Secret Statistics
* Device History

---

## Audit Logging

Every important security event will be recorded.

Examples:

* Registration
* Login
* Logout
* Failed Login
* Password Change
* Password Reset
* Secret Creation
* Secret Modification
* Secret Deletion
* Account Lock
* MFA Enabled
* Suspicious Activity

---

# Zero-Knowledge Design

SafeVault follows a Zero-Knowledge philosophy whenever possible.

Sensitive vault data is encrypted before storage using authenticated encryption.

The server stores encrypted data but cannot read user secrets without the proper encryption key.

This architecture significantly reduces the impact of potential database breaches.

---

# Cryptography

## Password Hashing

* Argon2id

## Secret Encryption

* AES-256-GCM

## Key Derivation

Future implementation:

* HKDF
* Per-user encryption keys
* Key rotation
* Random IV generation
* Authenticated encryption

---

# Security Features

SafeVault implements multiple security layers.

## HTTP Security

* Helmet
* Content Security Policy (CSP)
* HSTS
* Secure Headers

## API Security

* CORS
* Rate Limiting
* Input Validation
* Request Sanitization

## Authentication Security

* Secure Cookies
* JWT
* Refresh Token Rotation
* Password Hashing
* MFA
* Session Validation

## Attack Mitigation

Protection against:

* SQL Injection
* XSS
* CSRF
* Brute Force Attacks
* Session Hijacking
* Credential Stuffing
* Timing Attacks

---

# Technology Stack

## Backend

* Node.js (LTS)
* Express.js
* JavaScript (ES2023)

## Database

* MySQL 8

## ORM

* Prisma

## Authentication

* JWT
* Refresh Tokens

## Validation

* Zod

## Logging

* Pino

## Cryptography

* Argon2id
* AES-256-GCM

## Security

* Helmet
* CORS
* Express Rate Limit
* Cookie Parser
* dotenv

## API Documentation

* Swagger / OpenAPI

## Testing

* Jest

## Containerization

* Docker
* Docker Compose

## CI/CD

* GitHub Actions

---

# Project Structure

```
SafeVault/

├── backend/
│
├── frontend/
│
├── database/
│
├── docker/
│
├── docs/
│
├── .github/
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# Backend Structure

```
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
├── docs/
├── tests/
├── app.js
└── server.js
```

---

# Architecture

SafeVault follows a layered architecture.

```
Client

↓

Routes

↓

Controllers

↓

Services

↓

Repositories

↓

Database
```

### Responsibilities

**Routes**

* API endpoints

**Controllers**

* Handle HTTP requests and responses

**Services**

* Business logic

**Repositories**

* Database access

**Validators**

* Input validation

**Security**

* Cryptography
* Authentication
* Authorization

**Middleware**

* Authentication
* Authorization
* Error Handling
* Logging

---

# REST API

## Authentication

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/reset-password
POST   /api/auth/verify-email
```

---

## Users

```
GET    /api/users/profile
PUT    /api/users/profile
PUT    /api/users/password
DELETE /api/users
```

---

## Vault

```
GET    /api/vault
GET    /api/vault/:id
POST   /api/vault
PUT    /api/vault/:id
DELETE /api/vault/:id
```

---

## Categories

```
GET
POST
PUT
DELETE
```

---

## Audit Logs

```
GET /api/logs
```

---

## Dashboard

```
GET /api/dashboard
```

---

# Git Workflow

```
main

↓

develop

↓

feature/*
```

Feature branches include:

```
feature/authentication

feature/authorization

feature/users

feature/vault

feature/encryption

feature/dashboard

feature/frontend

feature/testing

feature/docker
```

Each feature is:

* Developed independently
* Reviewed
* Tested
* Merged into `develop`
* Released into `main`

---

# Development Roadmap

| Phase | Module                             | Status         |
| ----- | ---------------------------------- | -------------- |
| 1     | Project Planning & Architecture    | ✅ Completed    |
| 2     | Development Environment            | ✅ Completed    |
| 3     | Backend Foundation                 | ✅ Completed    |
| 4     | Authentication System              | 🚧 In Progress |
| 5     | Authorization System               | ⏳ Pending      |
| 6     | User Management                    | ⏳ Pending      |
| 7     | Vault CRUD API                     | ⏳ Pending      |
| 8     | Encryption Layer                   | ⏳ Pending      |
| 9     | Search Engine                      | ⏳ Pending      |
| 10    | Categories                         | ⏳ Pending      |
| 11    | Audit Logging                      | ⏳ Pending      |
| 12    | Security Dashboard                 | ⏳ Pending      |
| 13    | Rate Limiting & Abuse Protection   | ⏳ Pending      |
| 14    | Refresh Token Rotation             | ⏳ Pending      |
| 15    | Password Reset                     | ⏳ Pending      |
| 16    | Email Verification                 | ⏳ Pending      |
| 17    | Multi-Factor Authentication (TOTP) | ⏳ Pending      |
| 18    | API Documentation                  | ⏳ Pending      |
| 19    | Automated Testing                  | ⏳ Pending      |
| 20    | Docker Production Environment      | ⏳ Pending      |
| 21    | GitHub Actions CI/CD               | ⏳ Pending      |
| 22    | Frontend Development               | ⏳ Pending      |
| 23    | Thesis Enhancements                | ⏳ Pending      |
| 24    | Production Deployment              | ⏳ Pending      |

---

# Long-Term Vision

SafeVault is intended to evolve beyond a portfolio project into a complete secure platform capable of serving as:

* A professional cybersecurity showcase
* A production-ready personal vault
* A Master's Degree research project
* A reference implementation of secure web application development

---

# License

This project is licensed under the MIT License.

---

# Author

Developed by **Rui Gomes** as a professional portfolio project and future Master's Degree research platform in **Cybersecurity and Systems Administration**.

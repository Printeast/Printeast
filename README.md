# Printeast: The AI-Native Print-on-Demand Operating System

Printeast is a vertically integrated commerce engine designed to collapse the journey from creative impulse to physical product. It represents a paradigm shift in the Creator Economy by providing an indigenous, high-scale infrastructure for AI-driven design, smart logistics, and embedded finance.

## Core Philosophical Pillar: The AI-Native OS

Unlike legacy POD platforms that bolt AI onto existing systems, Printeast is built from the ground up with a Vector-first architecture. This allows for:

- Magic-Prompt Generation: Converting creative intent into high-fidelity design assets instantly.
- Intelligent Routing: A logistics engine that optimizes for margin, speed, and reliability across a global vendor network.
- Vertical Integration: Direct control over the entire stack—from the canvas where the design is born to the settlement in a creator's wallet.

---

## Technical Architecture

Printeast is architected as a high-performance Turborepo monorepo, ensuring strict type safety and code reuse across the entire ecosystem.

### Repository Structure

### Repository Structure

```text
/printeast-monorepo
 ├── apps
 │   ├── web                  # Next.js 16 Frontend
 │   └── backend              # Express.js API ("The Brain")
 ├── packages
 │   ├── database             # Shared Prisma Schema & Client
 │   ├── types                # Shared Zod Schemas & TS Interfaces
 │   ├── config-eslint        # Shared Linting Rules
 │   └── config-typescript    # Shared TS Configuration
 ├── docs                     # RFCs, Architecture Plans, & Guides
 ├── scripts                  # Automation & Setup Tools
 └── docker                   # Infrastructure Configuration
```

### Foundational Stack

- Frontend: Next.js 16 (App Router), React 19, Framer Motion 12, Tailwind CSS.
- Backend: Express, TypeScript, Node.js (v18+).
- Database: PostgreSQL with pgvector for AI-driven asset discovery.
- Caching/Sessions: Redis (utilizing Redlock for distributed consistency).
- Security: Zero-trust JWT flow with secure HTTP-only cookie rotation.
- Storage: Supabase Storage for secure, S3-compatible design asset management.

---

## Core Systems

The implementation is built on robust, production-ready pillars:

### 1. Identity and Access Control

- Multi-role support: ADMIN, CREATOR, SELLER, and USER.
- Secure Auth: JWT implementation with Redis-backed session whitelisting and revocation.
- Edge Protection: High-performance Next.js 16 proxy for unauthorized request blocking.

### 2. The Commerce Engine

A robust database architecture covering:

- Products and Inventory: Managing SKUs, base pricing, and warehouse locations.
- Orders and Payments: Handling transaction flows from creation to fulfillment.
- Vendor Management: Tracking production reliability and API integration points.
- Finance: Wallet transaction logic for credits, debits, and settlements.

### 3. Storage and Assets

- Integrated StorageService capable of generating secure, pre-signed upload URLs.
- Indigenous support for design draft management and high-resolution print file isolation.

---

## Development and Onboarding

### Setup Instructions

For a rapid setup on Windows, open an administrative PowerShell terminal and execute:

```powershell
.\scripts\setup.ps1
```

For manual setup:

1. Install dependencies: `pnpm install`
2. Start local infrastructure: `docker-compose up -d`
3. Push database schema: `pnpm turbo run db:push`
4. Start development: `pnpm dev`

### Command Reference

| Command      | Scope    | Description                                     |
| :----------- | :------- | :---------------------------------------------- |
| pnpm dev     | Global   | Starts all applications in watch mode           |
| pnpm build   | Global   | Generates production bundles for all workspaces |
| pnpm lint    | Global   | Runs static analysis checks across the monorepo |
| pnpm db:push | Database | Syncs Prisma schema with the local PostgreSQL   |
| pnpm format  | Global   | Enforces project-wide code style via Prettier   |

---

## Security and Engineering Standards

- No Implicit Any: Strict TypeScript configurations are enforced.
- Contract-Driven Development: All cross-service communication must used shared types from @repo/types.
- Fail-Fast Environment: Centralized validation ensures the system will not boot if critical configurations (JWT secrets, DB URLs) are missing.
- Direct-Path API Architecture: Standardized JSON responses for predictable consumption by frontend and mobile clients.

## Deployment

### Deploying to Vercel

This monorepo is optimized for Vercel deployment:

1.  **Framework Preset**: Next.js
2.  **Root Directory**: Leave as root (Turborepo will be detected)
3.  **Build Command**: `pnpm build`
4.  **Install Command**: `pnpm install`
5.  **Environment Variables**: Ensure all variables from `.env.example` are added to your Vercel Project Settings.

> **Note**: For the `web` app to communicate with the `backend`, ensure `NEXT_PUBLIC_API_URL` points to your deployed backend URL.

---

Confidential and Proprietary. Copyright 2026 Printeast Technologies.
For further details, refer to the documentation in the /docs directory.

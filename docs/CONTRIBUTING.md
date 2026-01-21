# Contributing to Printeast

Welcome to the development team. Printeast is built as a high-performance, AI-native monorepo. This guide outlines the technical standards and setup procedures required for all contributors.

## Environment Setup

Printeast utilized pnpm and Turborepo for workspace management.

### Prerequisites

- Node.js: v18.0.0 or higher.
- Docker: Required for local database (PostgreSQL) and caching (Redis).
- Package Manager: pnpm v8 or higher.

### Initialization

#### Windows (Automated)

1. Open a PowerShell terminal with Administrative privileges.
2. Execute the setup script:
   ```powershell
   .\scripts\setup.ps1
   ```
   This script validates your environment, installs dependencies, and configures local infrastructure automatically.

#### Manual Configuration

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Start local infrastructure:
   ```bash
   docker-compose up -d
   ```
3. Initialize the database schema:
   ```bash
   pnpm turbo run db:push
   ```

### Local Development

To start all services in development mode, execute:

```bash
pnpm dev
```

- Frontend Application: http://localhost:3000
- Backend API (The Brain): http://localhost:4000

## Repository Architecture

- apps/web: Next.js 16 frontend application featuring the AI Design Studio.
- apps/backend: Express.js server handling core platform logic.
- packages/database: Shared Prisma configurations and database client.
- packages/types: Shared Zod schemas and TypeScript interfaces.
- packages/config-typescript: Standardized TypeScript base configurations.

## Development Standards

### Type Safety

Printeast enforces strict TypeScript configurations. Use of "any" is prohibited unless explicitly justified. Leverage the shared types package for all data structures that cross the network boundary.

### Error Handling

Backend logic must utilize the centralized AppError class and the catchAsync wrapper to ensure consistent API responses and proper stack trace management.

### Validation

All incoming data (API requests and environment variables) must be validated using Zod schemas defined in packages/types.

## Core Commands

| Command          | Description                                              |
| :--------------- | :------------------------------------------------------- |
| pnpm dev         | Starts all applications in watch mode                    |
| pnpm build       | Generates production bundles for the entire monorepo     |
| pnpm lint        | Runs ESLint across all workspaces                        |
| pnpm db:generate | Updates the Prisma Client based on schema changes        |
| pnpm db:push     | Synchronizes the schema with the local database instance |

---

Copyright 2026 Printeast Technologies.

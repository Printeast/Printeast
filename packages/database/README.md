# Printeast Database Package

This package manages the shared data layer for the Printeast monorepo. It contains the Prisma schema, client generation logic, and migration history.

## Database Schema

The schema is built on top of PostgreSQL and is designed for high-scale operations. It consists of 15 core tables divided into four functional modules:

1. Identity & Access: User and Session management.
2. Commerce Engine: Product, Order, Category, and Inventory management.
3. Creator Assets: Design and Creator profiles.
4. Operations & Finance: Vendor management and Wallet transactions.

## Features

- Strictly Typed: Automatic Prisma Client generation provides full type safety across the monorepo.
- Scalable Relations: Normalized table structure with appropriate indexing and cascading rules.
- PGVector Support: Indigenous support for vector embeddings in the Design table for AI-driven search capabilities.
- Mapping: Database columns use snake_case for PostgreSQL consistency while keeping camelCase in the application code.

## Remote/Supabase Setup

For remote instances (like Supabase), you must manually run the initialization script located in:
`packages/database/sql/supabase-setup.sql`

This ensures that essential extensions like `pgvector` are enabled before the Prisma migrations are applied.

## Local Workflow

To apply schema changes to your local database:

```bash
pnpm db:push
```

To generate the updated Prisma Client:

```bash
pnpm db:generate
```

## Management

All database interactions should go through the shared Prisma client exported from this package to ensure connection pooling and consistent performance.

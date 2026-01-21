# Printeast Types Package

This package serves as the single source of truth for all data definitions across the Printeast monorepo. It ensures absolute type safety between the frontend, backend, and database layers.

## Contents

1. Zod Schemas: Validation rules for authentication, storage signals, and platform configurations.
2. API Interfaces: Standardized request and response structures (RFC 6.1 alignment).
3. Inferred Types: TypeScript types automatically generated from Zod schemas to ensure sync between validation and logic.

## Usage

Centralizing types here prevents "Implicit Any" errors and ensures that a change in the data structure in one area of the app is immediately caught by the TypeScript compiler in all other areas.

## Best Practices

- Always use Zod for incoming data validation (backend) or dynamic styling constraints (frontend).
- Extend the shared ApiResponse interface for all new API modules to maintain consistency.

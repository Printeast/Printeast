# Printeast Backend (The Brain)

This directory contains the core API server for the Printeast platform. It is built with Express and TypeScript, focusing on security, performance, and clear separation of concerns.

## Core Features

- Authentication: Zero-trust JWT flow with secure HTTP-only cookie rotation.
- Session Management: Redis-backed session whitelisting and revocation.
- Data Validation: Strict Zod-based validation for all incoming requests.
- Error Handling: Standardized JSON response engine for consistent client-side consumption.
- Security: Integrated rate limiting, CORS protection, and secure header management via Helmet.
- Storage Integration: Supabase Storage provider for secure file uploads via pre-signed URLs.

## Project Structure

- src/config: Environment variable validation and central configuration.
- src/controllers: Request handlers and business logic orchestration.
- src/middleware: Global and route-specific middleware (Auth, Error, Rate Limiting).
- src/routes: API endpoint definitions.
- src/services: Core business services (Token, Session, Storage).
- src/utils: Shared utility functions and classes.

## API Documentation

The backend follows a versioned API structure. Currently, all core endpoints are located under /api/v1.

- /api/v1/auth: Handles user registration, login, and logout.
- /api/v1/storage: Manages file upload signals and pre-signed URLs.

## Development

Run the development server with hot-reloading:

```bash
pnpm dev
```

Build the project for production:

```bash
pnpm build
```

## Security Standards

The backend implements a multi-layer security model:

1. Rate Limiting: Prevents brute-force attacks on sensitive endpoints.
2. JWT Rotation: Short-lived access tokens combined with secure, one-time-use refresh tokens.
3. Strict Typing: Every internal data structure is fully typed to prevent runtime errors and injection vulnerabilities.

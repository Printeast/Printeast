# Printeast Web Interface

The frontend application for Printeast is a high-performance, responsive web application built with Next.js 16 and React 19. It serves as the primary interface for creators, sellers, and administrators.

## Technology Highlights

- Framework: Next.js 16 (App Router)
- UI Library: React 19
- Styling: Tailwind CSS
- Animations: Framer Motion 12
- Type Safety: TypeScript with shared monorepo configurations
- Security: Edge-compatible middleware for authentication and role-based access control.

## Component Overview

- Design Studio: An interactive canvas interface (built with Fabric.js) for creator asset generation.
- Dashboard: Role-specific navigation and state management for creators and sellers.
- Commerce Engine: Integrated checkout and product visualization.

## Architecture

The application uses the Next.js App Router for centralized routing and layout management. Performance is optimized through:

1. Server Components: Minimizing client-side JavaScript for static sections.
2. Edge Proxy: Centralized authentication gatekeeper in src/proxy.ts.
3. Custom Hooks: Reusable logic for complex interactions like smooth scrolling and animations.

## Development

Start the Next.js development server:

```bash
pnpm dev
```

Generate a production build:

```bash
pnpm build
```

## Styling Convention

Printeast follows a strictly defined design system. All custom colors and typography are managed via the tailwind.config.js to ensure brand consistency across the entire platform.

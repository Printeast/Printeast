# UI Components Integration with Backend

This document describes the integration of custom UI components with the Printeast backend architecture.

## Overview

The integration adds a shared UI component library (`@repo/ui`) to the monorepo and demonstrates its use with backend API integration through authentication and dashboard pages.

## Components Created

### 1. UI Package (`packages/ui`)

A shared component library with the following components:

#### Button Component
- **Location**: `packages/ui/src/Button.tsx`
- **Features**:
  - Multiple variants: primary, secondary, outline, ghost, danger
  - Size options: sm, md, lg, icon
  - Loading state with spinner
  - Framer Motion animations
  - Full TypeScript support

#### Input Component
- **Location**: `packages/ui/src/Input.tsx`
- **Features**:
  - Label support
  - Error and helper text display
  - Full accessibility with proper htmlFor linking
  - Disabled state styling
  - TypeScript ref forwarding

#### Card Component
- **Location**: `packages/ui/src/Card.tsx`
- **Features**:
  - Multiple variants: default, bordered, elevated
  - Hover animations (optional)
  - Sub-components: CardHeader, CardContent, CardFooter
  - Framer Motion scroll animations

### 2. API Service

**Location**: `apps/web/src/services/api.ts`

Provides type-safe API methods for:
- User registration
- User login
- User logout
- Storage signed URL generation

All methods include:
- Proper error handling
- TypeScript types
- Credential management (cookies)
- Structured response format

### 3. Pages

#### Login Page (`/login`)
- **Location**: `apps/web/src/app/login/page.tsx`
- **Features**:
  - Email and password inputs
  - Form validation
  - Error display
  - Loading states
  - Integration with `/api/v1/auth/login` endpoint

#### Register Page (`/register`)
- **Location**: `apps/web/src/app/register/page.tsx`
- **Features**:
  - Full name, email, and password fields
  - Password confirmation
  - Client-side validation
  - Error display
  - Loading states
  - Integration with `/api/v1/auth/register` endpoint

#### Dashboard Page (`/dashboard`)
- **Location**: `apps/web/src/app/dashboard/page.tsx`
- **Features**:
  - Component showcase
  - Storage API integration demo
  - Signed URL generation example
  - Logout functionality
  - Demonstrates all UI components in action

## Backend API Endpoints Used

### Authentication Routes (`/api/v1/auth`)
- `POST /register` - Create new user account
- `POST /login` - Authenticate user and create session
- `POST /logout` - End user session

### Storage Routes (`/api/v1/storage`)
- `POST /sign` - Generate signed URL for file uploads (requires authentication)

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Configuration

Copy the environment example file and configure:

```bash
# In apps/web directory
cp .env.example .env.local
```

Set the backend API URL (default: `http://localhost:5000/api/v1`)

### 3. Start Development Servers

```bash
# Start all services (frontend + backend)
pnpm dev
```

This will start:
- Next.js frontend on `http://localhost:3000`
- Express backend on `http://localhost:5000`

### 4. Access the Application

- Login: `http://localhost:3000/login`
- Register: `http://localhost:3000/register`
- Dashboard: `http://localhost:3000/dashboard` (requires authentication)

## Technical Details

### Styling

The UI components use:
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for animations
- **Custom color palette** from `tailwind.config.js`:
  - Primary Pink: `#E23E83`
  - Coral Orange: `#FF7A39`
  - Neutral Background: `#F8F9FC`

### TypeScript Support

All components and services are fully typed:
- Props interfaces exported from components
- API response types defined
- Type-safe form handling

### Component Utilities

**cn() function** (`packages/ui/src/lib/utils.ts`):
- Combines `clsx` and `tailwind-merge`
- Enables conditional class names
- Prevents Tailwind class conflicts

## Testing the Integration

### 1. Test Registration Flow

1. Navigate to `/register`
2. Fill in the form with valid data
3. Submit and verify redirection to `/dashboard`
4. Check browser cookies for authentication token

### 2. Test Login Flow

1. Navigate to `/login`
2. Use existing credentials
3. Submit and verify redirection to `/dashboard`
4. Verify authenticated state

### 3. Test Storage API

1. Log in and navigate to `/dashboard`
2. Enter a filename and file type
3. Click "Get Signed Upload URL"
4. Verify signed URL is returned from backend

### 4. Test Components

All components are showcased on the `/dashboard` page with various configurations.

## File Structure

```
packages/ui/
├── src/
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   ├── Button.tsx             # Button component
│   ├── Input.tsx              # Input component
│   ├── Card.tsx               # Card components
│   └── styles.css             # Base styles
├── package.json
└── tsconfig.json

apps/web/src/
├── app/
│   ├── login/
│   │   └── page.tsx           # Login page
│   ├── register/
│   │   └── page.tsx           # Register page
│   ├── dashboard/
│   │   └── page.tsx           # Dashboard page
│   ├── globals.css            # Global styles
│   └── layout.tsx             # Root layout
└── services/
    └── api.ts                 # API service layer
```

## Next Steps

1. **Add more UI components**: Modal, Dropdown, Toast notifications
2. **Implement protected routes**: Middleware to check authentication
3. **Add form validation library**: Zod or React Hook Form
4. **Create design system documentation**: Storybook integration
5. **Add E2E tests**: Playwright or Cypress

## Notes

- All API calls use credentials: 'include' for cookie-based authentication
- Components follow atomic design principles
- Error states are handled gracefully in all forms
- The integration is production-ready with proper TypeScript typing

---

**Integration Date**: January 23, 2026  
**Branch**: workbranch-div

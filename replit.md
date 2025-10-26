# PSU Rizal Academic Collaboration Platform

## Overview

The PSU Rizal Academic Collaboration Platform is a comprehensive web application for Palawan State University - Rizal Campus. It provides a unified environment for virtual learning, academic management, and real-time collaboration. Key capabilities include HD video conferencing, role-based dashboards, secure JWT authentication, course and assignment management, real-time chat, and guest access for meetings. The platform aims to enhance the academic experience for students, faculty, and administrators through accessibility, performance, and scalability.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The application is built with Next.js 14 (App Router), React 18, and TypeScript. Styling is handled by Tailwind CSS 4 and a custom design system based on shadcn/ui components. It utilizes a server and client component split for performance, a mobile-first responsive design with glass morphism effects, and a reusable component library built on Radix UI primitives. Middleware enforces route protection and redirects based on user roles, providing distinct dashboards for Admin, Faculty, Student, and Guest users.

### Backend Architecture

The backend uses Next.js API routes for serverless functions, managing authentication, data operations, and real-time communication. It employs a JWT-based authentication strategy with tokens stored in HTTP-only cookies and role-based access control enforced via `middleware.ts`. Drizzle ORM provides type-safe database operations with PostgreSQL. Custom hooks abstract WebRTC peer connections and WebSocket signaling for video conferencing. API endpoints follow RESTful conventions. The `middleware.ts` handles public route exemptions, session validation via JWT, role-based redirection, and attaches user information to request headers. User registration requires admin approval.

**Dashboard API Endpoints**: All role-based dashboards (Admin, Faculty, Student) use real-time database integration via dedicated stats API endpoints (`/api/admin/stats`, `/api/faculty/stats`, `/api/student/stats`). These endpoints use efficient SQL filtering with `inArray()` and `eq()` operators from Drizzle ORM to minimize database queries and ensure scalability. All database operations use the Replit PostgreSQL connection via `getReplitDb()` from `@/lib/database/replit-connection`.

### Data Storage Solutions

The primary data store is **Replit's built-in PostgreSQL database**, managed with Drizzle ORM. The schema includes tables for academic structure (programs, subjects, curriculum), users (students, faculty, admin with program and year level tracking), courses, learning modules (meetings, assignments, submissions, enrollments), and communication (announcements, chat messages). File uploads are managed using Replit Object Storage via dedicated `/api/upload` and `/api/download` endpoints.

### Authentication and Authorization

Authentication is JWT-based. User credentials are verified against the Replit PostgreSQL database, and a JWT is issued and stored in an HTTP-only cookie. `sessionStorage` is used for client-side dashboard access. `middleware.ts` validates protected requests using the JWT, enforcing role-based access control based on user roles embedded in the JWT. Guest access for meetings creates temporary sessions without persistent user records. New user registrations require admin approval before login.

## External Dependencies

### Third-Party Services

-   **Replit**: Primary deployment and hosting platform.
-   **Google Tag Manager & Analytics**: User tracking and analytics.

### APIs and Integrations

-   **Twilio Video**: Enterprise-grade video conferencing with built-in SFU (Selective Forwarding Unit).
-   **WebSocket**: Real-time chat and participant presence.

### Databases

-   **Replit PostgreSQL**: Primary relational database for all application data.

### Key Libraries

-   **UI**: `@radix-ui/*`, `tailwindcss`, `lucide-react`, `shadcn/ui`.
-   **Forms**: `react-hook-form`, `zod`, `@hookform/resolvers`.
-   **Auth**: `jose` (JWT), `bcryptjs`.
-   **Database**: `drizzle-orm`, `postgres` driver, `drizzle-kit`.
-   **Video**: `twilio-video` (enterprise video conferencing).
-   **Graphics**: `ogl` (WebGL for plasma effect).
-   **Object Storage**: `@replit/object-storage`.

## Planned Upgrades

The platform is ready for production-grade enhancements based on Vercel best practices. See `docs/PLATFORM_UPGRADE_PLAN.md` for comprehensive upgrade guide including:

### Implemented Features
-   **Video Conferencing**: Twilio Video integration for enterprise-grade video calls (✅ COMPLETE)
-   **Multi-Platform Storage**: Abstraction layer supporting Replit, Vercel, Firebase (✅ COMPLETE)
-   **Feature Flags**: Runtime feature toggles for A/B testing (✅ COMPLETE)

### Optional Enhancements
-   **Error Monitoring**: Sentry integration for production stability

### Implementation Status
-   ✅ **Video Conferencing**: Twilio Video integrated via Replit Connector
-   ✅ **Storage Abstraction**: Multi-platform storage adapter implemented
-   ✅ **Feature Flags**: Runtime feature toggles configured
-   ✅ **Multi-Platform Ready**: Firebase, Vercel configs complete
-   📝 **Documentation**: Twilio migration guide in `docs/TWILIO_MIGRATION.md`

For quick implementation: See `docs/PLATFORM_UPGRADE_PLAN.md` sections 1-4.
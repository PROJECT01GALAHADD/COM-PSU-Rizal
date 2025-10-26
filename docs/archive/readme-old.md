# PSU Rizal | Academic Collaboration Platform

A Next.js-based web platform for Palawan State University (PSU) Rizal enabling virtual collaboration, academic management, and real-time meetings for Students, Faculty/Teachers, and Administrators.

This repository is part of a formal academic thesis project:

- Title document: PALAWAN-STATE-UNIVERSITY-COLLABORATION-ONLINE-MEET-thesis.docx
- Path: /Users/ORDEROFCODE/v0-COM-PSU-Rizal/PALAWAN-STATE-UNIVERSITY-COLLABORATION-ONLINE-MEET-thesis.docx

## Key Capabilities

- Dashboards for academic tracking and collaboration (Admin, Faculty, Student)
- Live meeting experience with Guest access
- Authentication and protected routes
- Integrated database support for Supabase and NocoDB
- Video conferencing with screen sharing and chat
- Academic management system (courses, assignments, grades)
- File backup and restore capabilities

## Tech Stack

- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS, shadcn/ui, Lucide icons
- Supabase + NocoDB (data integration)
- PostgreSQL database with Drizzle ORM
- JWT-based authentication
- WebRTC for video conferencing
- Vercel deployment

## Quick Start

1. Install dependencies: `pnpm install`
2. Set up environment variables (copy .env.example to .env.local)
3. Initialize database: `pnpm run init-db`
4. Dev server: `pnpm dev` (<http://localhost:3000>)
5. Build: `pnpm build`

## Deployment

The application can be deployed in multiple ways:

### Cloud Deployment (Vercel)

Your project is live at:

**[https://vercel.com/knightprojeks-0s-projects/v0-v0-com](https://vercel.com/knightprojeks-0s-projects/v0-v0-com)**

### Local Deployment

The application can be run entirely on localhost with full functionality:

- **Frontend**: Next.js development server
- **Backend**: Local PostgreSQL database via Docker
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Full JWT-based authentication system
- **Video Conferencing**: WebRTC capabilities (requires STUN/TURN servers for production)

The local deployment option makes this platform accessible to institutions with limited internet connectivity or those preferring on-premises solutions.

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/UrUm24jG2lB](https://v0.app/chat/projects/UrUm24jG2lB)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Local Development

To run the application locally, you can use the provided startup script:

### On macOS/Linux

```bash
./start-app.sh
```

### On Windows

```bash
start-app.bat
```

Alternatively, you can run the standard Next.js commands:

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database credentials

# Initialize database (optional)
pnpm run init-db

# Start the development server
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

The project includes the following directories:

- `app/` - Next.js 13+ app directory with page components and API routes
- `components/` - Reusable UI components including shadcn/ui components
- `database/` - Database configurations for both NocoDB and Supabase
- `hooks/` - React hooks for state management and WebRTC/WebSocket functionality
- `lib/` - Shared utility functions, database schema, and authentication utilities
- `public/` - Static assets and media files
- `scripts/` - Utility scripts for database initialization and maintenance
- `styles/` - Additional CSS files
- `templates/` - Template resources for components and pages (excluded from analysis)
- `.vscode/` - VS Code settings for the project
- `.cursor/` - Cursor IDE settings
- `.qodo/` - Qodo Code settings

## Templates Directory

The `templates/` directory contains pre-built UI components, pages, and layouts that can be used as starting points for new features. These templates are:

- **Excluded from all analysis tools** - They are not linted, type-checked, or included in search results
- **Not part of the main application** - They are only used as reference or copy-paste sources
- **Template projects** - Each subdirectory represents a complete template project that can be referenced

To use templates in your project:

1. Browse the templates directory to find components or layouts you want to use
2. Copy the relevant files to your main project directories
3. Customize the copied code to fit your specific needs

**Important**: Never directly modify files in the templates directory. Instead, copy them to the appropriate location in the main project structure.

## Authentication System

The platform implements a comprehensive authentication system with:

- User roles: Admin, Faculty, Student, Guest
- JWT-based session management
- Protected API routes
- Middleware for role-based access control
- Login and signup pages with form validation

### User Types

1. **Admin** - Full system access for platform management
2. **Faculty** - Course management, assignment grading, and meeting hosting
3. **Student** - Course enrollment, assignment submission, and meeting participation
4. **Guest** - Limited meeting access without account creation

## Database Configuration

This project supports both Supabase and NocoDB. You can configure your preferred database solution in the .env file. The database directory contains configuration files for both solutions.

The database schema includes:

- Users table with role-based fields
- Meetings table for virtual sessions
- Participants table for meeting attendance
- Chat messages for real-time communication
- Courses table for academic programs
- Enrollments table for student-course relationships
- Assignments and submissions tables for academic work

## Meeting System

The platform features a robust video conferencing system based on WebRTC:

- Real-time video and audio communication
- Screen sharing capabilities
- Participant management
- Chat functionality
- Recording support
- Meeting scheduling

## API Routes

The platform provides RESTful API endpoints for:

- Authentication (`/api/auth`)
- User management
- Meeting creation and management
- Course and enrollment management
- Assignment and submission handling

## Thesis Project

This repository is part of a formal academic thesis project.

- Title document: `PALAWAN-STATE-UNIVERSITY-COLLABORATION-ONLINE-MEET-thesis.docx`
- Path: `/Users/ORDEROFCODE/v0-COM-PSU-Rizal/PALAWAN-STATE-UNIVERSITY-COLLABORATION-ONLINE-MEET-thesis.docx`

## Documentation

Additional documentation is available in the `docs/` directory:

- [Thesis Document (Markdown version)](docs/thesis.md) - A Markdown version of the thesis document for easy reading by LLMs and AI systems
- [Implementation Summary](docs/implementation_summary.md) - Summary of implemented features and components
- [Collaboration Features](docs/collaboration.md) - Details about collaboration capabilities
- [Database Configuration](docs/database.md) - Database setup and configuration
- [Environment and Secrets](docs/env-and-secrets.md) - Environment variable configuration
- [Templates Policy](docs/templates-policy.md) - Guidelines for using templates

Guidance:

- Treat the thesis document as the authoritative reference for project objectives, scope, and requirements.
- Consult the thesis first when introducing new features, architecture, and UX decisions.
- Do not commit direct edits to the DOCX; coordinate changes via maintainers and keep a changelog.

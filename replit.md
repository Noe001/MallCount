# AEON Mall Visit Counter Application

## Overview

The AEON Mall Visit Counter is a web application designed to help users track their visits to AEON Malls across Japan. The application provides a comprehensive interface for managing visit records, viewing statistics, and searching through mall locations. Built with a focus on Japanese-language support and Material Design 3 principles, the application offers an efficient, data-dense tracking experience optimized for both desktop and mobile devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server, providing fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing instead of React Router

**UI Component Library**
- shadcn/ui components built on Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Material Design 3 principles guide the visual design system
- Custom theme system supporting light/dark modes via ThemeProvider context

**State Management**
- TanStack Query (React Query) for server state management and data fetching
- Local React state (useState) for UI state management
- No global state management library (Redux, Zustand) - keeping state local or in React Query

**Typography & Internationalization**
- Noto Sans JP as primary font for exceptional Japanese character support
- Inter font for numbers, statistics, and English text
- Japanese-first design with all UI text in Japanese

**Component Organization**
- UI components in `client/src/components/ui/` (shadcn primitives)
- Feature components in `client/src/components/` (AppHeader, MallCard, SearchBar, etc.)
- Page components in `client/src/pages/`
- Example components in `client/src/components/examples/` for development reference

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- Node.js runtime with ES modules (type: "module")
- TypeScript throughout for type safety

**Development & Production Setup**
- Development: tsx for running TypeScript directly with hot reload
- Production: esbuild bundles server code into single output file
- Vite dev server in middleware mode during development for seamless frontend/backend integration

**API Structure**
- RESTful API routes prefixed with `/api`
- Routes registered through `registerRoutes` function in `server/routes.ts`
- Storage interface abstraction (`IStorage`) for data operations
- Currently using in-memory storage (`MemStorage`) - designed to be swapped with database implementation

**Request/Response Handling**
- JSON body parsing with raw body preservation for webhook support
- Comprehensive request logging middleware tracking method, path, status, duration, and response
- Error handling through standard Express patterns

### Data Storage Solutions

**Database Configuration**
- Drizzle ORM for type-safe database operations
- Configured for PostgreSQL (dialect: "postgresql")
- Neon serverless database client for serverless/edge deployments
- WebSocket support for Neon's serverless driver

**Schema Definition**
- Database schema defined in `shared/schema.ts` using Drizzle
- Zod integration via drizzle-zod for runtime validation
- Current schema includes basic user table (id, username, password)
- Schema designed to be extended with mall visit tracking tables

**Migration Strategy**
- Drizzle Kit for schema migrations
- Migrations output to `./migrations` directory
- `db:push` script for direct schema changes during development

**Data Access Pattern**
- Storage interface pattern provides abstraction layer
- Methods like `getUser`, `getUserByUsername`, `createUser` define data operations
- Easy to swap between in-memory and database implementations without changing business logic

### Authentication and Authorization

**Current Implementation**
- Basic user schema with username/password fields
- No authentication currently implemented in routes
- AuthModal component exists in frontend for login/signup UI
- Session management infrastructure exists (connect-pg-simple for PostgreSQL sessions)

**Planned Authentication**
- Session-based authentication using Express sessions
- PostgreSQL session store via connect-pg-simple
- Password hashing (library included but not yet implemented)
- Frontend auth state managed through React Query

### External Dependencies

**Database**
- Neon Serverless PostgreSQL - cloud-hosted PostgreSQL optimized for serverless
- Connection via `DATABASE_URL` environment variable
- WebSocket support for serverless execution contexts

**Font Services**
- Google Fonts for Noto Sans JP and Inter typefaces
- Material Icons for iconography

**UI Component Foundation**
- Radix UI primitives for 20+ accessible component patterns (dialogs, dropdowns, popovers, etc.)
- Lucide React for consistent icon system

**Form Management**
- React Hook Form for form state and validation
- @hookform/resolvers for Zod schema integration

**Date Handling**
- date-fns for date formatting and manipulation (Japanese date formats)

**Development Tools**
- Replit-specific plugins for development environment integration
- Runtime error overlay for development debugging
- Cartographer and dev banner plugins in development mode

**Build & Bundling**
- Vite for frontend bundling and development server
- esbuild for fast server-side bundling
- PostCSS with Tailwind CSS and Autoprefixer
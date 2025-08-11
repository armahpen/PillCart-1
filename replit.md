# Online Pharmacy System

## Overview

SmilePills is a comprehensive online pharmacy platform built as a full-stack web application. The system allows users to browse medications, manage shopping carts, process payments, and complete orders through a secure e-commerce interface. The platform integrates prescription management capabilities with over-the-counter product sales, featuring Stripe payment processing and Replit authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern component-based UI using functional components and hooks
- **Vite Build System**: Fast development server and optimized production builds
- **UI Component Library**: Shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with CSS variables for theming and design system consistency
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation schemas

### Backend Architecture
- **Express.js Server**: RESTful API with middleware for logging, error handling, and request processing
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL storage for persistent user sessions
- **File Structure**: Modular separation with dedicated files for routes, storage operations, and database configuration

### Authentication System
- **Replit OpenID Connect**: OAuth-based authentication using Replit's identity provider
- **Passport.js Integration**: Session-based authentication with OpenID Connect strategy
- **User Management**: Automatic user creation and session persistence with profile data sync

### Database Design
- **User System**: Users table with profile information and Stripe customer integration
- **Product Catalog**: Products, categories, and brands with relational structure
- **E-commerce**: Shopping cart, orders, and order items with proper foreign key relationships
- **Session Storage**: Dedicated sessions table for secure session management
- **Schema Validation**: Drizzle-Zod integration for runtime type checking and API validation

### Payment Processing
- **Stripe Integration**: Secure payment processing with Stripe API
- **Customer Management**: Automatic Stripe customer creation linked to user accounts
- **Subscription Support**: Built-in support for subscription-based services
- **Payment Elements**: Modern Stripe Elements for secure payment form handling

### Data Flow Architecture
- **API Routes**: RESTful endpoints organized by resource type (products, cart, orders, auth)
- **Storage Layer**: Abstracted database operations through a storage interface
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Request Logging**: Comprehensive logging of API requests with response details

## External Dependencies

### Core Technologies
- **Database**: Neon PostgreSQL serverless database
- **Payment Processing**: Stripe payment gateway with customer and subscription management
- **Authentication**: Replit OAuth for user authentication and authorization
- **CDN/Assets**: Font loading from Google Fonts for typography

### Development Tools
- **Build System**: Vite for fast development and optimized production builds
- **Database Tooling**: Drizzle Kit for database migrations and schema management
- **Runtime**: Node.js with ES modules and TypeScript compilation

### UI/UX Libraries
- **Component System**: Radix UI primitives for accessible components
- **Icons**: Lucide React for consistent iconography
- **Styling**: Tailwind CSS with PostCSS for utility-first styling
- **Animations**: CSS transitions and animations for enhanced user experience

### Third-Party Services
- **Email/Communication**: Potential integration points for order confirmations and notifications
- **Analytics**: Built-in tracking capabilities for user interactions and cart behavior
- **Error Monitoring**: Development error overlay for debugging in Replit environment
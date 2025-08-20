# Smile Pills Ltd - E-Commerce Website

## Overview

Smile Pills Ltd is a comprehensive online pharmaceutical and medical supplies platform serving Ghana. The company is a licensed pharmaceutical wholesale business providing quality, affordable, and accessible medicines and medical products to pharmacies, hospitals, and individual customers. The platform features Stripe embedded checkout, prescription verification, secure authentication, and comprehensive product management.

## Business Information

**Company**: Smile Pills Ltd  
**Location**: East Legon Hills, Accra, Ghana  
**Contact**: 0544137947 | +233 209339912 | smilepills21@gmail.com  
**WhatsApp**: https://wa.me/message/GKIVR7F2FJPJE1  
**Hours**: Monday – Saturday, 24/7  
**Mission**: Smile Forever – delivering health with trust, quality, and convenience  
**Vision**: To be Ghana's leading pharmaceutical and medical supplies provider  

## Recent Changes (August 2025)

✓ Implemented Stripe embedded checkout system replacing PaymentElement approach  
✓ Created session-based payment processing matching Ruby/Sinatra example  
✓ Added automatic order creation from successful checkout sessions  
✓ Updated branding to reflect Smile Pills Ltd business information  
✓ Integrated prescription verification requirements and policies  
✓ Configured for Ghana market with GHS currency and local delivery  
✓ **Redesigned landing page to exactly match Pharmacy2U layout and structure**  
✓ **Implemented real-time chat support system with WebSocket integration**  
✓ **Added professional hero carousel with rotating banners and trust indicators**
✓ **Recreated complete Pharmacy2U homepage clone with Ghana pharmaceutical branding**
✓ **Hero carousel with 4 rotating slides featuring prescription services and consultation**
✓ **Trust indicators section with certified pharmacy technician credentials**
✓ **Service grid layout matching Pharmacy2U's 5-column layout for key services**
✓ **Health tools section with medicine stock checker and local services**
✓ **Featured products integration with authentic Ghana Cedis pricing**
✓ **WhatsApp CTA section positioned directly under hero image for customer support**
✓ **Updated to latest Smile Pills Ltd logo file (IMG_1598 (1)_1754986183203.PNG)**
✓ **Expanded product inventory from 34 to 52 products with newly uploaded product images**
✓ **Matched authentic product images with catalog prices and proper categorization**
✓ **Added major pharmaceutical brands: Tylenol, Motrin, Aleve, Claritin, Pepto-Bismol, and more**
✓ **Cleaned product catalog by removing specific products and duplicates as requested**
✓ **Optimized product card layout with 4 products per row and zoomed-out image display**
✓ **Fixed cart synchronization issues with real-time updates across all pages**
✓ **Updated Paystack integration to use live API key: pk_live_95dcd63641da880d65aba9ef1f512b48d9c58ba9**
✓ **Added new product "Paracetam" (GHS 0.50) to Cold, Cough & Allergy category**

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
- **WebSocket Integration**: Real-time chat support system using ws library with connection management
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
- **Real-time Communication**: WebSocket server for instant chat messaging with pharmacy staff
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
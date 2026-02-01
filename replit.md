# replit.md

## Overview

This is a Next.js authentication application with email-based signup verification using OTP (One-Time Password). The project provides user registration with email verification via nodemailer, login functionality, and MongoDB integration for data persistence. It's built with TypeScript and styled using Tailwind CSS v4.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4 with PostCSS integration
- **Fonts**: Geist Sans and Geist Mono from Google Fonts
- **Theme**: Supports light/dark mode via CSS custom properties and `prefers-color-scheme`

### Backend Architecture
- **API Routes**: Next.js Route Handlers in `app/api/` directory
- **Authentication Flow**: 
  1. User submits signup form
  2. Server generates 6-digit OTP, stores in memory with 10-minute expiry
  3. OTP sent via email using nodemailer/Gmail SMTP
  4. User verifies OTP to complete registration
- **OTP Storage**: In-memory Map (not persistent across restarts - suitable for development)

### Data Storage
- **Database**: MongoDB via Mongoose ODM
- **Connection Pattern**: Cached connection pattern to prevent multiple connections in serverless environment
- **Models**: 
  - `Detail` model with title, description, and createdAt fields (appears to be a generic data storage model)

### API Endpoints
- `POST /api/send-otp` - Initiates signup, sends verification email
- `POST /api/verify-otp` - Validates OTP and completes registration
- `GET/POST /api/store-details` - CRUD operations for Detail documents

### Key Design Decisions

**OTP In-Memory Storage**
- Problem: Need temporary OTP storage during verification
- Solution: JavaScript Map with email as key, stores OTP + expiry + user data
- Trade-off: Simple but not production-ready (data lost on restart, doesn't scale horizontally)

**MongoDB Connection Caching**
- Problem: Serverless functions can create multiple database connections
- Solution: Global cache pattern storing connection promise
- Benefit: Reuses existing connections, prevents connection exhaustion

**Path Aliases**
- Uses `@/*` alias mapping to project root for cleaner imports

## External Dependencies

### Email Service
- **Provider**: Gmail SMTP via nodemailer
- **Required Environment Variables**:
  - `GMAIL_EMAIL` - Sender email address
  - `GMAIL_APP_PASSWORD` - Gmail app-specific password (not regular password)

### Database
- **Provider**: MongoDB (external instance required)
- **Required Environment Variables**:
  - `MONGODB_URI` - Full MongoDB connection string

### Development Server
- Runs on port 5000
- Configured for all origins (`allowedDevOrigins: ["*"]`) to support Replit's proxy
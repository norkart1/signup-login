# replit.md

## Overview

This is a Next.js authentication platform with user signup, login, password reset, and a simple data management dashboard. The application provides email-based OTP verification for signup and password reset flows, with MongoDB as the database backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 with custom CSS variables for theming
- **UI Pattern**: Glass-morphism design with gradient backgrounds
- **State Management**: React useState hooks for local component state

### Backend Architecture
- **API Routes**: Next.js API routes in `app/api/` directory
- **Authentication Flow**: 
  - Signup: Email → OTP verification → Account creation
  - Login: Email/password with bcrypt comparison
  - Password Reset: Email → Reset code → New password
- **Temporary Storage**: In-memory Map stores for OTP and reset codes (not persistent across restarts)

### Data Storage
- **Database**: MongoDB via Mongoose ODM
- **Connection**: Cached connection pattern in `lib/mongodb.ts` to prevent connection exhaustion
- **Models**:
  - `User`: name, email, hashed password, createdAt
  - `Detail`: title, description, createdAt (for dashboard data)

### Authentication Mechanism
- Password hashing using bcryptjs
- OTP-based email verification for signup
- Code-based password reset flow
- No session/token management implemented (stateless API calls)

## External Dependencies

### Database
- **MongoDB**: Requires `MONGODB_URI` environment variable

### Email Service
- **Gmail SMTP via Nodemailer**: Requires environment variables:
  - `GMAIL_EMAIL`: Gmail address for sending
  - `GMAIL_APP_PASSWORD`: App-specific password for Gmail

### Environment Variables Required
- `MONGODB_URI` - MongoDB connection string
- `GMAIL_EMAIL` - Sender email address
- `GMAIL_APP_PASSWORD` - Gmail app password
- `DOMAIN` or `REPLIT_DEV_DOMAIN` - For email links (optional, auto-detected in Replit)
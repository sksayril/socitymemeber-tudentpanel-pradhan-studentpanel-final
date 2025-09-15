# API Integration Documentation

## Overview
This document describes the API integration implemented for the EduPortal application, connecting the frontend React application with the backend API at `http://localhost:3100/api`.

## API Endpoints Implemented

### Student Endpoints
- `POST /api/student/signup` - Student registration
- `POST /api/student/login` - Student authentication
- `GET /api/student/profile` - Get student profile
- `GET /api/student/dashboard` - Get student dashboard data
- `GET /api/student/societies` - Get student's enrolled societies
- `POST /api/student/logout` - Student logout

### Society Member Endpoints
- `POST /api/society-member/signup` - Society member registration
- `POST /api/society-member/login` - Society member authentication
- `GET /api/society-member/profile` - Get society member profile
- `GET /api/society-member/dashboard` - Get society member dashboard data
- `POST /api/society-member/logout` - Society member logout

## Implementation Details

### 1. API Service (`src/services/api.ts`)
- Centralized HTTP client for all API requests
- Handles authentication headers automatically
- Provides type-safe interfaces for all API responses
- Includes error handling and response parsing

### 2. Authentication Context (`src/contexts/AuthContext.tsx`)
- Manages user authentication state
- Handles login, signup, and logout operations
- Persists authentication tokens in localStorage
- Provides user information to components

### 3. Form Components
- **LoginForm** (`src/components/forms/LoginForm.tsx`) - User login interface
- **StudentSignupForm** (`src/components/forms/StudentSignupForm.tsx`) - Student registration
- **SocietyMemberSignupForm** (`src/components/forms/SocietyMemberSignupForm.tsx`) - Society member registration

### 4. Dashboard Components
- **StudentDashboardContent** - Fetches and displays student-specific data
- **SocietyDashboardContent** - Fetches and displays society member data

## Features Implemented

### Authentication Flow
1. User selects user type (Student or Society Member)
2. User can either login with existing credentials or sign up for a new account
3. Authentication tokens are stored and managed automatically
4. Protected routes redirect to login if not authenticated

### User Registration
- Comprehensive signup forms with validation
- Support for both student and society member registration
- Form validation and error handling
- Dynamic form fields based on user type

### Dashboard Integration
- Real-time data fetching from API
- Loading states and error handling
- Personalized dashboard content based on user type
- Statistics and user information display

### Error Handling
- Comprehensive error handling throughout the application
- User-friendly error messages
- Retry mechanisms for failed requests
- Loading states for better UX

## Usage

### Starting the Application
1. Ensure the backend API is running on `http://localhost:3100`
2. Start the frontend development server:
   ```bash
   npm run dev
   ```

### Testing the Integration
1. Navigate to the application
2. Choose either Student or Society Member portal
3. Create a new account or login with existing credentials
4. Explore the dashboard with real API data

## Security Features
- JWT token-based authentication
- Secure token storage in localStorage
- Automatic token refresh handling
- Protected API endpoints with authorization headers

## Error Handling
- Network error handling
- API error response handling
- User-friendly error messages
- Retry mechanisms for failed requests

## Future Enhancements
- Token refresh mechanism
- Offline support
- Real-time updates
- Enhanced error logging
- API response caching

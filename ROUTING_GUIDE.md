# Routing Guide - EduPortal Application

## Overview
This document describes the routing structure implemented in the EduPortal application using React Router DOM v6.

## Route Structure

### Public Routes
- `/` - Home page with portal selection
- `/student/login` - Student login page
- `/student/signup` - Student registration page
- `/society/login` - Society member login page
- `/society/signup` - Society member registration page
- `/404` - Not found page

### Protected Student Routes
All student routes are prefixed with `/student/` and require student authentication:
- `/student/dashboard` - Student dashboard (default)
- `/student/courses` - Student courses page
- `/student/fees` - Student fees page
- `/student/profile` - Student profile page

### Protected Society Routes
All society routes are prefixed with `/society/` and require society member authentication:
- `/society/dashboard` - Society dashboard (default)
- `/society/loans` - Society loans page
- `/society/profile` - Society profile page

## Implementation Details

### Route Constants (`src/constants/routes.ts`)
Centralized route definitions for maintainability:
```typescript
export const ROUTES = {
  HOME: '/',
  STUDENT: {
    BASE: '/student',
    SIGNUP: '/student/signup',
    LOGIN: '/student/login',
    DASHBOARD: '/student/dashboard',
    COURSES: '/student/courses',
    FEES: '/student/fees',
    PROFILE: '/student/profile',
  },
  SOCIETY: {
    BASE: '/society',
    SIGNUP: '/society/signup',
    LOGIN: '/society/login',
    DASHBOARD: '/society/dashboard',
    LOANS: '/society/loans',
    PROFILE: '/society/profile',
  },
  NOT_FOUND: '/404',
} as const;
```

### Protected Routes (`src/components/ProtectedRoute.tsx`)
Authentication guard component that:
- Checks if user is authenticated
- Validates user type permissions
- Redirects to appropriate login page if not authenticated
- Redirects to user's dashboard if wrong user type

### Navigation Components
All navigation components use React Router's `NavLink` for:
- Active state styling
- Automatic navigation
- Type-safe routing

#### Student Navigation
- **Sidebar**: Desktop navigation with active states
- **Bottom Nav**: Mobile navigation with active states
- **Header**: User greeting and logout functionality

#### Society Navigation
- **Sidebar**: Desktop navigation with active states
- **Bottom Nav**: Mobile navigation with active states
- **Header**: User greeting and logout functionality

## Authentication Flow

### Login Flow
1. User visits home page (`/`)
2. Selects student or society portal
3. Redirected to appropriate login page (`/student/login` or `/society/login`)
4. After successful login, redirected to dashboard
5. If user was trying to access a specific page, redirected there instead

### Signup Flow
1. User visits home page (`/`)
2. Selects student or society portal
3. Clicks signup link or visits signup page directly
4. After successful signup, redirected to dashboard

### Logout Flow
1. User clicks logout button
2. Authentication context clears user data
3. Redirected to home page (`/`)

## Route Protection

### Authentication Guards
- **Public Routes**: Accessible without authentication
- **Protected Routes**: Require authentication
- **User Type Guards**: Restrict access based on user type (student/society)

### Redirect Logic
- Unauthenticated users → Login page
- Wrong user type → Appropriate dashboard
- Invalid routes → 404 page

## Navigation Features

### Active State Management
- Current route highlighted in navigation
- Visual feedback for active pages
- Consistent styling across components

### Responsive Navigation
- Desktop: Sidebar navigation
- Mobile: Bottom navigation bar
- Consistent experience across devices

### Breadcrumb Support
- Route-based navigation
- Easy back navigation
- Clear user orientation

## Error Handling

### 404 Page
- Custom not found page
- Navigation back to home
- User-friendly error message

### Route Fallbacks
- Catch-all routes redirect to 404
- Invalid nested routes redirect to dashboard
- Graceful error handling

## Best Practices Implemented

### Code Organization
- Centralized route constants
- Reusable navigation components
- Type-safe routing

### Performance
- Lazy loading ready (can be implemented)
- Efficient re-renders with React Router
- Optimized navigation updates

### Security
- Protected routes with authentication
- User type validation
- Secure redirect handling

### User Experience
- Intuitive navigation flow
- Clear visual feedback
- Responsive design
- Error recovery options

## Usage Examples

### Adding New Routes
1. Add route constant to `src/constants/routes.ts`
2. Create page component in `src/pages/`
3. Add route to `src/App.tsx`
4. Update navigation components if needed

### Creating Protected Routes
```typescript
<Route
  path="/new-route"
  element={
    <ProtectedRoute allowedUserTypes={['student']}>
      <NewPageComponent />
    </ProtectedRoute>
  }
/>
```

### Navigation in Components
```typescript
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const navigate = useNavigate();
navigate(ROUTES.STUDENT.DASHBOARD);
```

## Future Enhancements
- Route-based code splitting
- Advanced breadcrumb navigation
- Route-based analytics
- Deep linking support
- Route-based caching

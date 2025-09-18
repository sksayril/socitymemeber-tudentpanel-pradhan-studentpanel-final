// Route constants for the application
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  
  // Student routes
  STUDENT: {
    BASE: '/student',
    SIGNUP: '/student/signup',
    LOGIN: '/student/login',
    DASHBOARD: '/student/dashboard',
    COURSES: '/student/courses',
    COURSE_DETAIL: '/student/courses/:courseId',
    MY_COURSES: '/student/my-courses',
    MY_COURSE_DETAIL: '/student/my-courses/:enrollmentId',
    FEES: '/student/fees',
    ATTENDANCE: '/student/attendance',
    MARKSHEETS: '/student/marksheets',
    PROFILE: '/student/profile',
  },
  
  // Society member routes
  SOCIETY: {
    BASE: '/society',
    SIGNUP: '/society/signup',
    LOGIN: '/society/login',
    DASHBOARD: '/society/dashboard',
    LOANS: '/society/loans',
    INVESTMENTS: '/society/investments',
    PROFILE: '/society/profile',
  },
  
  // KYC verification route
  KYC_VERIFICATION: '/kyc-verification',
  
  // Error routes
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
} as const;

// Route type definitions
export type StudentRoute = typeof ROUTES.STUDENT[keyof typeof ROUTES.STUDENT];
export type SocietyRoute = typeof ROUTES.SOCIETY[keyof typeof ROUTES.SOCIETY];
export type PublicRoute = typeof ROUTES.HOME | typeof ROUTES.LOGIN | typeof ROUTES.NOT_FOUND | typeof ROUTES.UNAUTHORIZED;
export type AppRoute = StudentRoute | SocietyRoute | PublicRoute;

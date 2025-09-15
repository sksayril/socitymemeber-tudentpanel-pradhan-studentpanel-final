import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: ('student' | 'society')[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedUserTypes,
  redirectTo,
}) => {
  const { isAuthenticated, userType, isLoading, isKYCVerified, kycStatus } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    const loginPath = redirectTo || ROUTES.LOGIN;
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // If user type is not allowed, redirect to appropriate dashboard
  if (allowedUserTypes && userType && !allowedUserTypes.includes(userType)) {
    const dashboardPath = userType === 'student' ? ROUTES.STUDENT.DASHBOARD : ROUTES.SOCIETY.DASHBOARD;
    return <Navigate to={dashboardPath} replace />;
  }

  // If KYC is not verified, redirect to KYC verification page
  if (isAuthenticated && !isKYCVerified && kycStatus?.kycStatus !== 'approved') {
    console.log('KYC not verified, redirecting to KYC verification:', {
      isAuthenticated,
      isKYCVerified,
      kycStatus: kycStatus?.kycStatus,
      userType
    });
    return <Navigate to={ROUTES.KYC_VERIFICATION} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

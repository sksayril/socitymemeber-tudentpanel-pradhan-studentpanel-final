import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/forms/LoginForm';
import { ROUTES } from '../constants/routes';

const StudentLoginPage: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || ROUTES.STUDENT.DASHBOARD;

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password, 'student');
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to={ROUTES.HOME} className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">← Back to Home</span>
            </Link>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">EduPortal</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          <LoginForm
            userType="student"
            onSubmit={handleLogin}
            onBack={() => navigate(ROUTES.HOME)}
            onSwitchToSignup={() => navigate(ROUTES.STUDENT.SIGNUP)}
            isLoading={isLoading}
            error={error}
          />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to={ROUTES.STUDENT.SIGNUP}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLoginPage;

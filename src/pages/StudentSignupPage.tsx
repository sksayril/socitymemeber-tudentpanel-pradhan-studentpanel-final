import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StudentSignupForm from '../components/forms/StudentSignupForm';
import SuccessPopup from '../components/SuccessPopup';
import { ROUTES } from '../constants/routes';

const StudentSignupPage: React.FC = () => {
  const { signup, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSignup = async (data: any) => {
    try {
      await signup(data, 'student');
      setShowSuccessPopup(true);
      // Navigate after a short delay to show the popup
      setTimeout(() => {
        navigate(ROUTES.STUDENT.DASHBOARD, { replace: true });
      }, 2000);
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
        <div className="w-full max-w-2xl">
          <StudentSignupForm
            onSubmit={handleSignup}
            onBack={() => navigate(ROUTES.STUDENT.LOGIN)}
            isLoading={isLoading}
            error={error}
          />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to={ROUTES.STUDENT.LOGIN}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      <SuccessPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        title="Account Created Successfully!"
        message="Welcome to EduPortal! Your student account has been created and you're now logged in. You'll be redirected to your dashboard shortly."
        type="success"
      />
    </div>
  );
};

export default StudentSignupPage;

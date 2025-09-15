import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';
import { ROUTES } from '../constants/routes';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
          
          <Link
            to={ROUTES.HOME}
            className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Need help? Contact our support team.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

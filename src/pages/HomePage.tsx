import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Building2, Users } from 'lucide-react';
import { ROUTES } from '../constants/routes';
import GalleryCarousel from '../components/GalleryCarousel';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-indigo-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">EduPortal</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-4xl">
        <div className="mt-16">
            <GalleryCarousel />
          </div>
          {/* <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to EduPortal
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your comprehensive education management system. Choose your portal to get started.
            </p>
          </div> */}

          {/* Login Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Student Login Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Student Portal</h3>
                {/* <p className="text-gray-600">Access your courses, fees, and academic information</p> */}
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h4 className="font-semibold text-blue-900 mb-2">Ministary of Corporation</h4>
                  {/* <p className="text-sm text-blue-700 mb-3">Sign in or create your student account</p> */}
                  <div className="space-y-2">
                    <Link
                      to={ROUTES.STUDENT.LOGIN}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg block text-center"
                    >
                      Student Login
                    </Link>
                    <Link
                      to={ROUTES.STUDENT.SIGNUP}
                      className="w-full border border-blue-500 text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition-all duration-200 block text-center"
                    >
                      Student Signup
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Society Login Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Society Portal</h3>
                {/* <p className="text-gray-600">Manage loans, applications, and member services</p> */}
              </div>
              
              <div className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <h4 className="font-semibold text-purple-900 mb-2">Society Govt. of NCRT Delhi</h4>
                  {/* <p className="text-sm text-purple-700 mb-3">Sign in or create your society member account</p> */}
                  <div className="space-y-2">
                    <Link
                      to={ROUTES.SOCIETY.LOGIN}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg block text-center"
                    >
                      Society Login
                    </Link>
                    <Link
                      to={ROUTES.SOCIETY.SIGNUP}
                      className="w-full border border-purple-500 text-purple-600 font-semibold py-3 px-6 rounded-lg hover:bg-purple-50 transition-all duration-200 block text-center"
                    >
                      Society Signup
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-16 bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Platform Features</h3>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Student Management</h4>
                <p className="text-sm text-gray-600">Complete academic lifecycle management</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Society Operations</h4>
                <p className="text-sm text-gray-600">Streamlined loan and member services</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">User-Friendly</h4>
                <p className="text-sm text-gray-600">Intuitive interface for all users</p>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default HomePage;

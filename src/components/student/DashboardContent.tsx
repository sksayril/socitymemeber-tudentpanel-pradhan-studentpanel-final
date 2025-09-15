import React, { useState, useEffect } from 'react';
import { BookOpen, CreditCard, Calendar, Users, Award, GraduationCap } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { apiService, DashboardStats } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import DashboardAttendanceSummary from './DashboardAttendanceSummary';

const DashboardContent: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({});
  const [societies, setSocieties] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch dashboard stats
        const dashboardResponse = await apiService.getStudentDashboard();
        if (dashboardResponse.data?.stats) {
          setStats(dashboardResponse.data.stats);
        }

        // Fetch student societies
        const societiesResponse = await apiService.getStudentSocieties();
        if (societiesResponse.data?.societies) {
          setSocieties(societiesResponse.data.societies);
        }

        // Fetch enrolled courses
        const coursesResponse = await apiService.getMyCourses();
        if (coursesResponse.data?.enrolledCourses) {
          setEnrolledCourses(coursesResponse.data.enrolledCourses);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Dashboard data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center lg:text-left">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h2>
          <p className="text-gray-600">Loading your academic information...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center lg:text-left">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h2>
          <p className="text-gray-600">Track your academic progress and manage your studies</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName}!
        </h2>
        <p className="text-gray-600">Track your academic progress and manage your studies</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <button 
          onClick={() => navigate(ROUTES.STUDENT.COURSES)}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-4 lg:p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.enrolledSocieties || 0}</p>
            <p className="text-sm text-gray-600">Enrolled Societies</p>
          </div>
        </button>

        <button 
          onClick={() => navigate(ROUTES.STUDENT.ATTENDANCE)}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-4 lg:p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.eventsAttended || 0}</p>
            <p className="text-sm text-gray-600">Events Attended</p>
          </div>
        </button>

        <button 
          onClick={() => navigate(ROUTES.STUDENT.MY_COURSES)}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-4 lg:p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <GraduationCap className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</p>
            <p className="text-sm text-gray-600">Enrolled Courses</p>
          </div>
        </button>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 lg:p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Award className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.achievements || 0}</p>
            <p className="text-sm text-gray-600">Achievements</p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 lg:p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{user?.year || 'N/A'}</p>
            <p className="text-sm text-gray-600">Academic Year</p>
          </div>
        </div>
      </div>

      {/* Attendance Overview */}
      <DashboardAttendanceSummary />

      {/* Enrolled Societies */}
      {/* <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Enrolled Societies</h3>
        {societies.length > 0 ? (
          <div className="space-y-3">
            {societies.map((society, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-blue-100 bg-blue-50/50">
                <div>
                  <span className="font-medium text-gray-900">{society.name}</span>
                  <p className="text-sm text-gray-600">{society.description}</p>
                </div>
                <span className="text-sm text-blue-600 font-medium">{society.status}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">You haven't enrolled in any societies yet</p>
            <button 
              onClick={() => navigate(ROUTES.STUDENT.COURSES)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Societies
            </button>
          </div>
        )}
      </div> */}

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={() => navigate(ROUTES.STUDENT.COURSES)}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Browse Courses</h3>
          <p className="text-sm text-gray-600">Discover and enroll in courses</p>
        </button>

        <button 
          onClick={() => navigate(ROUTES.STUDENT.FEES)}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <CreditCard className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Pay Fees</h3>
          <p className="text-sm text-gray-600">View and pay your academic fees</p>
        </button>

        <button 
          onClick={() => navigate(ROUTES.STUDENT.ATTENDANCE)}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">View Attendance</h3>
          <p className="text-sm text-gray-600">Check your attendance records</p>
        </button>

        <button 
          onClick={() => navigate(ROUTES.STUDENT.MY_COURSES)}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <GraduationCap className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">My Courses</h3>
          <p className="text-sm text-gray-600">View your enrolled courses</p>
        </button>
      </div>
    </div>
  );
};

export default DashboardContent;
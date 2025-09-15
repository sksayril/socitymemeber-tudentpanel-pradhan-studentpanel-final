import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Play,
  Award
} from 'lucide-react';
import { toast } from 'react-toastify';
import { apiService, CourseEnrollment } from '../services/api';
import { ROUTES } from '../constants/routes';

const StudentMyCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<CourseEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getMyCourses();
      
      if (response.data) {
        console.log('My Courses API Response:', response.data);
        setEnrolledCourses(response.data.enrolledCourses || []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch enrolled courses';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enrolled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'dropped':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewCourse = (enrollmentId: string) => {
    navigate(`${ROUTES.STUDENT.MY_COURSES}/${enrollmentId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Courses</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchMyCourses}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-sm shadow-xl border-r border-white/20">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200/50">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Student Portal</span>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              <button
                onClick={() => navigate(ROUTES.STUDENT.DASHBOARD)}
                className="w-full flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              >
                <div className="w-5 h-5 mr-3">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span className="font-medium">Dashboard</span>
              </button>
              
              <button
                onClick={() => navigate(ROUTES.STUDENT.COURSES)}
                className="w-full flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              >
                <div className="w-5 h-5 mr-3">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="font-medium">Browse Courses</span>
              </button>
              
              <button
                onClick={() => navigate(ROUTES.STUDENT.MY_COURSES)}
                className="w-full flex items-center px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
              >
                <BookOpen className="w-5 h-5 mr-3" />
                <span className="font-medium">My Courses</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
                <h1 className="text-lg font-bold text-gray-900">My Courses</h1>
              </div>
              <button
                onClick={() => navigate(ROUTES.STUDENT.COURSES)}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Browse Courses
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-8 pb-20 lg:pb-8">
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Enrolled Courses</h3>
            <p className="text-gray-600 mb-4">
              You haven't enrolled in any courses yet. Start your learning journey today!
            </p>
            <button
              onClick={() => navigate(ROUTES.STUDENT.COURSES)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((enrollment) => (
              <div key={enrollment._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Course Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                {enrollment.courseId?.thumbnail ? (
                  <img
                    src={enrollment.courseId.thumbnail}
                    alt={enrollment.courseId?.title || 'Course'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-white text-4xl font-bold opacity-50">
                      {(enrollment.courseId?.title || 'C').charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
                  
                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
                      {enrollment.status}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(enrollment.paymentStatus)}`}>
                      {enrollment.paymentStatus}
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {enrollment.courseId?.title || 'Course title not available'}
                  </h3>
                  
                  <div className="flex items-center mb-3">
                    <Users className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {enrollment.courseId?.instructor?.name || 'Instructor not available'}
                    </span>
                  </div>

                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Batch:</h4>
                    <p className="text-sm text-gray-600">{enrollment.batchId?.name || 'Batch not available'}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Schedule:</h4>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>
                          {enrollment.batchId?.startDate && enrollment.batchId?.endDate 
                            ? `${formatDate(enrollment.batchId.startDate)} - ${formatDate(enrollment.batchId.endDate)}`
                            : 'Schedule not available'
                          }
                        </span>
                      </div>
                      {enrollment.batchId?.timeSlots && enrollment.batchId.timeSlots.length > 0 && (
                        <div className="flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>
                            {formatTime(enrollment.batchId.timeSlots[0].startTime)} - {formatTime(enrollment.batchId.timeSlots[0].endTime)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Enrolled: {enrollment.enrolledAt ? formatDate(enrollment.enrolledAt) : 'Date not available'}
                    </div>
                    
                    <button
                      onClick={() => handleViewCourse(enrollment._id)}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      View Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200/50 shadow-lg">
          <div className="flex items-center justify-around py-2">
            <button
              onClick={() => navigate(ROUTES.STUDENT.DASHBOARD)}
              className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <div className="w-6 h-6 mb-1">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-xs font-medium">Dashboard</span>
            </button>
            
            <button
              onClick={() => navigate(ROUTES.STUDENT.COURSES)}
              className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <div className="w-6 h-6 mb-1">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium">Courses</span>
            </button>
            
            <button
              onClick={() => navigate(ROUTES.STUDENT.MY_COURSES)}
              className="flex flex-col items-center p-2 text-blue-600 transition-colors"
            >
              <div className="w-6 h-6 mb-1">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xs font-medium">My Courses</span>
            </button>
            
            <button
              onClick={() => navigate(ROUTES.STUDENT.PROFILE)}
              className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <div className="w-6 h-6 mb-1">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMyCoursesPage;

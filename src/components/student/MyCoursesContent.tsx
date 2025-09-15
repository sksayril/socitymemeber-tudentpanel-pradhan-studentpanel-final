import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Users, 
  AlertCircle, 
  Loader2,
  Play
} from 'lucide-react';
import { toast } from 'react-toastify';
import { apiService, CourseEnrollment } from '../../services/api';
import { ROUTES } from '../../constants/routes';

const MyCoursesContent: React.FC = () => {
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
    navigate(`/student/my-courses/${enrollmentId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading your courses...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600">Your enrolled courses and progress</p>
          </div>
        </div>
        
        <button
          onClick={() => navigate(ROUTES.STUDENT.COURSES)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse More Courses
        </button>
      </div>

      {/* Courses Grid */}
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
  );
};

export default MyCoursesContent;

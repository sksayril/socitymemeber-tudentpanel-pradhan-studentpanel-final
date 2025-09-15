import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Users, 
  MapPin, 
  Wifi, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { apiService, Course, CourseBatch } from '../services/api';
import { ROUTES } from '../constants/routes';

const StudentCourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [availableBatches, setAvailableBatches] = useState<CourseBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<CourseBatch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getCourseDetails(courseId!);
      
      if (response.data) {
        setCourse(response.data.course);
        setAvailableBatches(response.data.availableBatches);
        if (response.data.availableBatches.length > 0) {
          setSelectedBatch(response.data.availableBatches[0]);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch course details';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!selectedBatch) {
      toast.error('Please select a batch to enroll');
      return;
    }

    try {
      setIsEnrolling(true);
      
      const response = await apiService.enrollInCourse({
        courseId: courseId!,
        batchId: selectedBatch._id,
      });

      if (response.success) {
        toast.success('Successfully enrolled in the course!');
        navigate(ROUTES.STUDENT.MY_COURSES);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to enroll in course';
      toast.error(errorMessage);
    } finally {
      setIsEnrolling(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(price);
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

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-5 h-5 fill-yellow-400/50 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
      );
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The course you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate(ROUTES.STUDENT.COURSES)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Courses
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
            
            {/* Back Button */}
            <div className="p-4">
              <button
                onClick={() => navigate(ROUTES.STUDENT.COURSES)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Courses
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
          <div className="px-4 py-4">
            <button
              onClick={() => navigate(ROUTES.STUDENT.COURSES)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Courses
            </button>
          </div>
        </div>

        <div className="p-4 lg:p-8 pb-20 lg:pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium mr-3 ${
                      course.type === 'online' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {course.type === 'online' ? (
                        <Wifi className="w-3 h-3 mr-1" />
                      ) : (
                        <MapPin className="w-3 h-3 mr-1" />
                      )}
                      {course.type}
                    </div>
                    <div className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                      {course.category}
                    </div>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                  
                  <div className="flex items-center mb-4">
                    <Users className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Instructor: {course.instructor.name}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    {formatPrice(course.price, course.currency)}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-2">
                  {renderStars(course.rating.average)}
                </div>
                <span className="text-gray-600">
                  {course.rating.average.toFixed(1)} ({course.rating.count} reviews)
                </span>
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{course.description}</p>
              </div>
            </div>

            {/* Available Batches */}
            {availableBatches.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Available Batches</h2>
                <div className="space-y-4">
                  {availableBatches.map((batch) => (
                    <div
                      key={batch._id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedBatch?._id === batch._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedBatch(batch)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{batch.name}</h3>
                          {batch.description && (
                            <p className="text-sm text-gray-600 mt-1">{batch.description}</p>
                          )}
                          <div className="flex items-center mt-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>
                              {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
                            </span>
                          </div>
                        </div>
                        {selectedBatch?._id === batch._id && (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      
                      {/* Time Slots */}
                      {batch.timeSlots.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Schedule:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {batch.timeSlots.map((slot, index) => (
                              <div key={index} className="flex items-center text-sm text-gray-600">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>
                                  {formatDate(slot.date)} - {formatTime(slot.startTime)} to {formatTime(slot.endTime)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Enroll Now</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Course Price:</span>
                  <span className="font-semibold">{formatPrice(course.price, course.currency)}</span>
                </div>
                
                {selectedBatch && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selected Batch:</span>
                    <span className="font-semibold text-sm">{selectedBatch.name}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleEnroll}
                disabled={!selectedBatch || isEnrolling}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center justify-center"
              >
                {isEnrolling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Enrolling...
                  </>
                ) : (
                  'Enroll Now'
                )}
              </button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                By enrolling, you agree to our terms and conditions.
              </p>
            </div>
          </div>
          </div>
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
              className="flex flex-col items-center p-2 text-blue-600 transition-colors"
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
              className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
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

export default StudentCourseDetailPage;

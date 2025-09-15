import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Grid, List, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { apiService, Course, CourseFilters, CourseListResponse } from '../../services/api';
import CourseCard from '../courses/CourseCard';
import CourseFiltersComponent from '../courses/CourseFilters';
import { ROUTES } from '../../constants/routes';

const CoursesContent: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<CourseFilters>({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getCourses(filters);
      
      if (response.data) {
        setCourses(response.data.courses);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch courses';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: CourseFilters) => {
    setFilters({
      ...newFilters,
      page: 1, // Reset to first page when filters change
    });
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };

  const handleViewDetails = (courseId: string) => {
    navigate(`/student/courses/${courseId}`);
  };

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            i === pagination.currentPage
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {pages}
        
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
            <p className="text-gray-600">Discover and enroll in amazing courses</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <CourseFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {pagination ? `${pagination.totalCourses} courses found` : 'Loading courses...'}
          </h2>
          {pagination && (
            <p className="text-sm text-gray-600">
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalCourses)} of{' '}
              {pagination.totalCourses} results
            </p>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading courses...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchCourses}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Courses Grid */}
      {!isLoading && !error && (
        <>
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default CoursesContent;
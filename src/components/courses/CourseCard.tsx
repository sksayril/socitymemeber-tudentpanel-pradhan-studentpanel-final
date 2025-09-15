import React from 'react';
import { Star, Clock, Users, MapPin, Wifi } from 'lucide-react';
import { Course } from '../../services/api';

interface CourseCardProps {
  course: Course;
  onViewDetails: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onViewDetails }) => {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Course Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-6xl font-bold opacity-50">
              {course.title.charAt(0)}
            </div>
          </div>
        )}
        
        {/* Course Type Badge */}
        <div className="absolute top-3 right-3">
          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
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
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
            {course.category}
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        {/* Course Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>

        {/* Course Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {course.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center mb-4">
          <Users className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">
            {course.instructor.name}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center mr-2">
            {renderStars(course.rating.average)}
          </div>
          <span className="text-sm text-gray-600">
            {course.rating.average.toFixed(1)} ({course.rating.count} reviews)
          </span>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(course.price, course.currency)}
          </div>
          <button
            onClick={() => onViewDetails(course._id)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

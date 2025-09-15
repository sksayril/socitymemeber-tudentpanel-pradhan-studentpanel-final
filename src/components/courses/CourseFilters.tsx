import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { CourseFilters } from '../../services/api';

interface CourseFiltersProps {
  filters: CourseFilters;
  onFiltersChange: (filters: CourseFilters) => void;
  onClearFilters: () => void;
}

const CourseFiltersComponent: React.FC<CourseFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const categories = [
    'Programming',
    'Web Development',
    'Data Science',
    'Mobile Development',
    'Design',
    'Business',
    'Marketing',
    'Photography',
    'Music',
    'Language',
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price' },
    { value: 'rating', label: 'Rating' },
  ];

  const handleInputChange = (field: keyof CourseFilters, value: string | number) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center text-sm text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={filters.search || ''}
              onChange={(e) => handleInputChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Course Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Type
          </label>
          <select
            value={filters.type || ''}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={filters.sortBy || 'createdAt'}
            onChange={(e) => handleInputChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sort Order */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort Order
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="sortOrder"
              value="desc"
              checked={filters.sortOrder === 'desc' || filters.sortOrder === undefined}
              onChange={(e) => handleInputChange('sortOrder', e.target.value)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Descending</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="sortOrder"
              value="asc"
              checked={filters.sortOrder === 'asc'}
              onChange={(e) => handleInputChange('sortOrder', e.target.value)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Ascending</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CourseFiltersComponent;

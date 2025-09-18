import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Loader2,
  AlertCircle,
  Play,
  Pause
} from 'lucide-react';
import { apiService, Thumbnail } from '../services/api';

interface GalleryCarouselProps {
  className?: string;
}

const GalleryCarousel: React.FC<GalleryCarouselProps> = ({ className = '' }) => {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<Thumbnail | null>(null);
  const [imageError, setImageError] = useState<Set<string>>(new Set());
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchThumbnails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiService.getThumbnails(1, 20); // Get more images for carousel
        if (response.data && response.data.thumbnails) {
          setThumbnails(response.data.thumbnails);
        } else {
          // Add some mock data for testing if no real data
          const mockThumbnails = [
            {
              _id: "mock1",
              title: "Sample Image 1",
              description: "This is a sample image for testing",
              originalImageUrl: "https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Image+1",
              thumbnailUrl: "https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Image+1",
              category: "gallery",
              tags: [],
              displayOrder: 0,
              isFeatured: false,
              createdAt: new Date().toISOString(),
              thumbnailId: "MOCK001"
            },
            {
              _id: "mock2",
              title: "Sample Image 2",
              description: "This is another sample image",
              originalImageUrl: "https://via.placeholder.com/800x600/059669/FFFFFF?text=Image+2",
              thumbnailUrl: "https://via.placeholder.com/400x300/059669/FFFFFF?text=Image+2",
              category: "gallery",
              tags: [],
              displayOrder: 1,
              isFeatured: false,
              createdAt: new Date().toISOString(),
              thumbnailId: "MOCK002"
            },
            {
              _id: "mock3",
              title: "Sample Image 3",
              description: "Third sample image for carousel",
              originalImageUrl: "https://via.placeholder.com/800x600/DC2626/FFFFFF?text=Image+3",
              thumbnailUrl: "https://via.placeholder.com/400x300/DC2626/FFFFFF?text=Image+3",
              category: "gallery",
              tags: [],
              displayOrder: 2,
              isFeatured: false,
              createdAt: new Date().toISOString(),
              thumbnailId: "MOCK003"
            }
          ];
          setThumbnails(mockThumbnails);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load gallery images';
        setError(errorMessage);
        console.error('Gallery fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThumbnails();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (thumbnails.length > 1 && isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === thumbnails.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000); // Change slide every 4 seconds

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [thumbnails.length, isAutoPlaying]);

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && thumbnails.length > 1) {
      goToNext();
    }
    if (isRightSwipe && thumbnails.length > 1) {
      goToPrevious();
    }
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? thumbnails.length - 1 : currentIndex - 1);
    setIsAutoPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === thumbnails.length - 1 ? 0 : currentIndex + 1);
    setIsAutoPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const handleImageError = (thumbnailId: string) => {
    setImageError(prev => new Set(prev).add(thumbnailId));
  };

  const handleImageClick = (thumbnail: Thumbnail) => {
    setSelectedImage(thumbnail);
  };

  const handleDownload = (thumbnail: Thumbnail) => {
    const link = document.createElement('a');
    link.href = thumbnail.originalImageUrl;
    link.download = `${thumbnail.title}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-100 p-8 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-3 text-gray-600">Loading gallery...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-100 p-8 ${className}`}>
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Gallery</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (thumbnails.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-100 p-8 ${className}`}>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🖼️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Images Available</h3>
          <p className="text-gray-600">Gallery images will appear here once uploaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Gallery</h3>
            <p className="text-gray-600 mt-1">
              {thumbnails.length} {thumbnails.length === 1 ? 'image' : 'images'} available
            </p>
          </div>
          {thumbnails.length > 1 && (
            <button
              onClick={toggleAutoPlay}
              className={`p-2 rounded-lg transition-colors ${
                isAutoPlaying 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isAutoPlaying ? "Pause Auto-play" : "Start Auto-play"}
            >
              {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Enhanced Carousel */}
      <div className="relative p-4">
        <div 
          ref={carouselRef}
          className="relative overflow-hidden bg-gray-50 rounded-lg border border-gray-200 shadow-inner"
          style={{ height: '400px' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ 
              transform: `translateX(-${currentIndex * 100}%)`,
              width: `${thumbnails.length * 100}%`
            }}
          >
            {thumbnails.map((thumbnail) => (
              <div
                key={thumbnail._id}
                className="w-full h-full flex-shrink-0 relative"
                style={{ width: `${100 / thumbnails.length}%` }}
              >
                <div className="relative w-full h-full flex items-center justify-center cursor-pointer p-4">
                  {!imageError.has(thumbnail._id) ? (
                    <img
                      src={thumbnail.thumbnailUrl}
                      alt={thumbnail.title}
                      className="max-w-full max-h-full object-contain hover:opacity-90 transition-opacity rounded-lg shadow-lg"
                      onError={() => handleImageError(thumbnail._id)}
                      onClick={() => handleImageClick(thumbnail)}
                    />
                  ) : (
                    <img
                      src={thumbnail.originalImageUrl}
                      alt={thumbnail.title}
                      className="max-w-full max-h-full object-contain hover:opacity-90 transition-opacity rounded-lg shadow-lg"
                      onClick={() => handleImageClick(thumbnail)}
                    />
                  )}
                  
                  {/* Image Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
                    <h4 className="font-semibold text-sm">{thumbnail.title}</h4>
                    <p className="text-xs opacity-90">{thumbnail.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {thumbnails.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-4 bg-white bg-opacity-95 hover:bg-opacity-100 rounded-full shadow-xl transition-all duration-200 z-10 border border-gray-200"
              title="Previous"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-4 bg-white bg-opacity-95 hover:bg-opacity-100 rounded-full shadow-xl transition-all duration-200 z-10 border border-gray-200"
              title="Next"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {thumbnails.length > 1 && (
          <div className="flex justify-center mt-6 space-x-3">
            {thumbnails.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-purple-600 scale-125 shadow-lg' 
                    : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                }`}
                title={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Slide Counter */}
        {thumbnails.length > 1 && (
          <div className="text-center mt-4 pb-6">
            <span className="text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-full">
              {currentIndex + 1} of {thumbnails.length}
            </span>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors z-10"
            >
              <span className="text-white text-xl">×</span>
            </button>
            
            <div className="bg-white rounded-lg overflow-hidden">
              <img
                src={selectedImage.originalImageUrl}
                alt={selectedImage.title}
                className="max-w-full max-h-96 object-contain"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedImage.title}</h3>
                <p className="text-gray-600 mb-4">{selectedImage.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      {selectedImage.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(selectedImage.createdAt)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ID: {selectedImage.thumbnailId}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDownload(selectedImage)}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryCarousel;

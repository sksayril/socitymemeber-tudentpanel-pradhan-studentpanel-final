import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { apiService, Thumbnail as ApiThumbnail } from '../services/api';

interface ThumbnailCarouselProps {
  className?: string;
  autoSlide?: boolean;
  slideInterval?: number;
  showDots?: boolean;
  showCounter?: boolean;
  onImageClick?: (thumbnail: Thumbnail) => void;
  onError?: (error: string) => void;
  usePublicAPI?: boolean; // Use public API (no auth required)
  limit?: number; // Number of thumbnails to fetch
}

// Use the API Thumbnail interface directly
type Thumbnail = ApiThumbnail;

interface CarouselError {
  type: 'loading' | 'network' | 'invalid';
  message: string;
  thumbnailId?: string;
}

const ThumbnailCarousel: React.FC<ThumbnailCarouselProps> = ({ 
  className = '',
  autoSlide = true,
  slideInterval = 3000,
  showDots = true,
  showCounter = true,
  onImageClick,
  onError,
  usePublicAPI = true,
  limit = 10
}) => {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<CarouselError | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fallback sample data for development/testing
  const fallbackThumbnails = useMemo(() => [
    {
      _id: 'sample1',
      thumbnailUrl: 'https://picsum.photos/400/300?random=1',
      originalImageUrl: 'https://picsum.photos/800/600?random=1',
      title: 'Sample Image 1',
      description: 'Beautiful landscape photography',
      category: 'nature',
      tags: ['landscape', 'photography'],
      displayOrder: 1,
      isFeatured: true,
      createdAt: new Date().toISOString(),
      thumbnailId: 'sample1'
    },
    {
      _id: 'sample2',
      thumbnailUrl: 'https://picsum.photos/400/300?random=2',
      originalImageUrl: 'https://picsum.photos/800/600?random=2',
      title: 'Sample Image 2',
      description: 'Urban architecture showcase',
      category: 'architecture',
      tags: ['urban', 'architecture'],
      displayOrder: 2,
      isFeatured: true,
      createdAt: new Date().toISOString(),
      thumbnailId: 'sample2'
    },
    {
      _id: 'sample3',
      thumbnailUrl: 'https://picsum.photos/400/300?random=3',
      originalImageUrl: 'https://picsum.photos/800/600?random=3',
      title: 'Sample Image 3',
      description: 'Nature and wildlife',
      category: 'wildlife',
      tags: ['nature', 'wildlife'],
      displayOrder: 3,
      isFeatured: true,
      createdAt: new Date().toISOString(),
      thumbnailId: 'sample3'
    }
  ], []);

  useEffect(() => {
    const loadThumbnails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let fetchedThumbnails: Thumbnail[] = [];
        
        try {
          // Try to fetch from API first
          const response = usePublicAPI 
            ? await apiService.getPublicThumbnails(1, limit)
            : await apiService.getThumbnails(1, limit);
          
          if (response.success && response.data?.thumbnails) {
            fetchedThumbnails = response.data.thumbnails;
          } else {
            throw new Error(response.message || 'Failed to fetch thumbnails from API');
          }
        } catch (apiError) {
          console.warn('API fetch failed, using fallback data:', apiError);
          // Use fallback data if API fails
          fetchedThumbnails = fallbackThumbnails;
        }
        
        setThumbnails(fetchedThumbnails);
        setImageLoading(new Array(fetchedThumbnails.length).fill(false));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load thumbnails';
        const carouselError: CarouselError = {
          type: 'loading',
          message: errorMessage
        };
        setError(carouselError);
        onError?.(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadThumbnails();
  }, [usePublicAPI, limit, fallbackThumbnails, onError]);

  // Auto-slide functionality with proper cleanup
  useEffect(() => {
    if (autoSlide && thumbnails.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === thumbnails.length - 1 ? 0 : prevIndex + 1
        );
      }, slideInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [autoSlide, thumbnails.length, slideInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);


  // Memoized navigation functions
  const goToPrevious = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? thumbnails.length - 1 : prevIndex - 1
    );
  }, [thumbnails.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === thumbnails.length - 1 ? 0 : prevIndex + 1
    );
  }, [thumbnails.length]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < thumbnails.length) {
      setCurrentIndex(index);
    }
  }, [thumbnails.length]);

  // Handle image loading states
  const handleImageLoad = useCallback((index: number) => {
    setImageLoading(prev => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
  }, []);

  const handleImageError = useCallback((index: number, thumbnail: Thumbnail) => {
    setImageLoading(prev => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
    
    const carouselError: CarouselError = {
      type: 'network',
      message: `Failed to load image: ${thumbnail.title}`,
      thumbnailId: thumbnail._id
    };
    setError(carouselError);
    onError?.(carouselError.message);
  }, [onError]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        goToPrevious();
        break;
      case 'ArrowRight':
        event.preventDefault();
        goToNext();
        break;
      case 'Home':
        event.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        event.preventDefault();
        goToSlide(thumbnails.length - 1);
        break;
      case ' ':
        event.preventDefault();
        if (autoSlide) {
          // Pause/resume auto-slide
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          } else {
            intervalRef.current = setInterval(() => {
              setCurrentIndex((prevIndex) => 
                prevIndex === thumbnails.length - 1 ? 0 : prevIndex + 1
              );
            }, slideInterval);
          }
        }
        break;
    }
  }, [goToPrevious, goToNext, goToSlide, thumbnails.length, autoSlide, slideInterval]);

  // Handle image click
  const handleImageClick = useCallback(() => {
    if (onImageClick && thumbnails[currentIndex]) {
      onImageClick(thumbnails[currentIndex]);
    }
  }, [onImageClick, thumbnails, currentIndex]);

  // Loading skeleton component
  const LoadingSkeleton = useMemo(() => (
    <div className={`flex items-center justify-center h-64 bg-black ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
        <p className="text-white text-sm font-medium">Loading gallery...</p>
      </div>
    </div>
  ), [className]);

  // Error state component
  const ErrorState = useMemo(() => (
    <div className={`flex items-center justify-center h-64 bg-black ${className}`}>
      <div className="text-center">
        <div className="text-red-500 text-2xl mb-2">⚠️</div>
        <p className="text-white text-sm font-medium mb-1">Failed to load images</p>
        <p className="text-gray-300 text-xs">{error?.message}</p>
      </div>
    </div>
  ), [className, error]);

  // Empty state component
  const EmptyState = useMemo(() => (
    <div className={`flex items-center justify-center h-64 bg-black ${className}`}>
      <div className="text-center">
        <div className="text-gray-400 text-3xl mb-2">🖼️</div>
        <p className="text-white text-sm font-medium">No images available</p>
        <p className="text-gray-300 text-xs">Check back later for updates</p>
      </div>
    </div>
  ), [className]);

  if (loading) return LoadingSkeleton;
  if (error) return ErrorState;
  if (thumbnails.length === 0) return EmptyState;

  return (
    <div 
      ref={carouselRef}
      className={`relative w-full h-64 overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${className}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Image carousel"
      aria-live="polite"
    >
      {/* Main Image Display */}
      <div className="relative w-full h-full group">
        {imageLoading[currentIndex] && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
        <img
          src={thumbnails[currentIndex]?.originalImageUrl}
          alt={thumbnails[currentIndex]?.title || 'Gallery image'}
          className={`w-full h-full object-cover transition-all duration-500 ${
            onImageClick ? 'cursor-pointer hover:scale-105' : ''
          } ${imageLoading[currentIndex] ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => handleImageLoad(currentIndex)}
          onError={() => {
            const currentThumbnail = thumbnails[currentIndex];
            if (currentThumbnail) {
              handleImageError(currentIndex, currentThumbnail);
            }
          }}
          onClick={handleImageClick}
          loading="lazy"
        />
      </div>

      {/* Navigation Arrows */}
      {thumbnails.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Previous image: ${thumbnails[currentIndex === 0 ? thumbnails.length - 1 : currentIndex - 1]?.title || 'Previous'}`}
            disabled={thumbnails.length <= 1}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Next image: ${thumbnails[currentIndex === thumbnails.length - 1 ? 0 : currentIndex + 1]?.title || 'Next'}`}
            disabled={thumbnails.length <= 1}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {thumbnails.length > 1 && showDots && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="flex space-x-2 mb-2">
            {thumbnails.map((thumbnail, index) => (
              <button
                key={thumbnail._id}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                  index === currentIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75 hover:scale-110'
                }`}
                aria-label={`Go to slide ${index + 1}: ${thumbnail.title}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>
          {showCounter && (
            <span className="text-white text-xs bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
              {currentIndex + 1} of {thumbnails.length}
            </span>
          )}
        </div>
      )}

      
      {/* Auto-slide indicator */}
      {autoSlide && thumbnails.length > 1 && (
        <div className="absolute top-2 right-2">
          <div className="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            Auto
          </div>
        </div>
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(ThumbnailCarousel);

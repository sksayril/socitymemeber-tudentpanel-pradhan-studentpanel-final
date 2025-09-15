import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'success',
}) => {
  if (!isOpen) return null;

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-green-600';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 ${getBackgroundColor()}`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${getBackgroundColor()}`}>
            <CheckCircle className={`w-8 h-8 ${getIconColor()}`} />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {title}
          </h3>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;

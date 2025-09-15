import React from 'react';
import { checkTokenStatus, clearAllAuthData } from '../utils/tokenUtils';

const DebugTokenStatus: React.FC = () => {
  const handleCheckToken = () => {
    checkTokenStatus();
  };

  const handleClearToken = () => {
    clearAllAuthData();
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50">
      <h3 className="font-bold mb-2">Debug Token Status</h3>
      <div className="space-y-2">
        <button
          onClick={handleCheckToken}
          className="block w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
        >
          Check Token
        </button>
        <button
          onClick={handleClearToken}
          className="block w-full px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
        >
          Clear Token
        </button>
      </div>
    </div>
  );
};

export default DebugTokenStatus;

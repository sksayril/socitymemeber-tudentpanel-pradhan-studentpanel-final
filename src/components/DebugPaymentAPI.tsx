import React, { useState } from 'react';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';

const DebugPaymentAPI: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const testPaymentHistory = async () => {
    try {
      setIsLoading(true);
      setResults(null);
      
      console.log('=== DEBUG: Testing Payment History API ===');
      console.log('Auth Token:', apiService.getAuthToken());
      console.log('Is Authenticated:', apiService.isAuthenticated());
      
      const response = await apiService.getPaymentHistory({ page: 1, limit: 10 });
      console.log('Payment History Response:', response);
      
      setResults({
        success: true,
        data: response,
        message: 'Payment history fetched successfully'
      });
      
      toast.success('Payment history test successful!');
    } catch (error) {
      console.error('Payment History Test Error:', error);
      
      setResults({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          status: (error as any).status,
          apiResponse: (error as any).apiResponse
        }
      });
      
      toast.error('Payment history test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const testPendingEMIs = async () => {
    try {
      setIsLoading(true);
      setResults(null);
      
      console.log('=== DEBUG: Testing Pending EMIs API ===');
      
      const response = await apiService.getPendingEMIs({ page: 1, limit: 10 });
      console.log('Pending EMIs Response:', response);
      
      setResults({
        success: true,
        data: response,
        message: 'Pending EMIs fetched successfully'
      });
      
      toast.success('Pending EMIs test successful!');
    } catch (error) {
      console.error('Pending EMIs Test Error:', error);
      
      setResults({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          status: (error as any).status,
          apiResponse: (error as any).apiResponse
        }
      });
      
      toast.error('Pending EMIs test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const testPaymentSummary = async () => {
    try {
      setIsLoading(true);
      setResults(null);
      
      console.log('=== DEBUG: Testing Payment Summary API ===');
      
      const response = await apiService.getInvestmentPaymentSummary();
      console.log('Payment Summary Response:', response);
      
      setResults({
        success: true,
        data: response,
        message: 'Payment summary fetched successfully'
      });
      
      toast.success('Payment summary test successful!');
    } catch (error) {
      console.error('Payment Summary Test Error:', error);
      
      setResults({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          status: (error as any).status,
          apiResponse: (error as any).apiResponse
        }
      });
      
      toast.error('Payment summary test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResults(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment API Debug Tool</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={testPaymentHistory}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Test Payment History
          </button>
          
          <button
            onClick={testPendingEMIs}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            Test Pending EMIs
          </button>
          
          <button
            onClick={testPaymentSummary}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            Test Payment Summary
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2 text-gray-600">Testing API...</p>
          </div>
        )}

        {results && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-semibold text-gray-900">Test Results</h4>
              <button
                onClick={clearResults}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Clear
              </button>
            </div>
            
            <div className={`p-4 rounded-lg ${
              results.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center mb-2">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  results.success ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className={`font-medium ${
                  results.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {results.success ? 'Success' : 'Error'}
                </span>
              </div>
              
              {results.message && (
                <p className={`text-sm ${
                  results.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {results.message}
                </p>
              )}
              
              {results.error && (
                <div className="mt-3">
                  <p className="text-sm text-red-700 font-medium">Error Details:</p>
                  <pre className="text-xs text-red-600 mt-1 bg-red-100 p-2 rounded overflow-auto">
                    {JSON.stringify(results.error, null, 2)}
                  </pre>
                </div>
              )}
              
              {results.data && (
                <div className="mt-3">
                  <p className="text-sm text-green-700 font-medium">Response Data:</p>
                  <pre className="text-xs text-green-600 mt-1 bg-green-100 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(results.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugPaymentAPI;

import React, { useState, useEffect } from 'react';
import { 
  History, 
  Filter, 
  RefreshCw, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Upload,
  Eye,
  DollarSign
} from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  apiService, 
  PaymentHistoryEntry,
  PaymentFilters
} from '../../services/api';

const PaymentHistoryContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<PaymentHistoryEntry[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPayments: 0,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFilters] = useState<PaymentFilters>({
    page: 1,
    limit: 10
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchPaymentHistory();
  }, [filters]);

  const fetchPaymentHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching payment history with filters:', filters);
      console.log('Current auth token:', apiService.getAuthToken());
      
      const response = await apiService.getPaymentHistory(filters);
      console.log('Payment history response:', response);
      
      if (response.data) {
        setPayments(response.data.paymentHistory || []);
        setPagination(response.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalPayments: 0,
          hasNext: false,
          hasPrev: false
        });
      }
    } catch (err) {
      console.error('Error fetching payment history:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        status: (err as any).status,
        apiResponse: (err as any).apiResponse
      });
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch payment history';
      setError(errorMessage);
      toast.error(errorMessage);
      // Ensure payments is always an array even on error
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentTypeIcon = (paymentType: string) => {
    switch (paymentType) {
      case 'online':
        return <DollarSign className="w-4 h-4" />;
      case 'cash':
        return <DollarSign className="w-4 h-4" />;
      case 'cheque':
        return <DollarSign className="w-4 h-4" />;
      case 'bank_transfer':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const renderFilters = () => (
    <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
            <select
              value={filters.paymentType || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, paymentType: e.target.value as any || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="online">Online</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 mt-4">
        <button
          onClick={() => setFilters({ page: 1, limit: 10 })}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Clear Filter
        </button>
        <button
          onClick={fetchPaymentHistory}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>
    </div>
  );

  const renderPaymentCard = (payment: PaymentHistoryEntry) => (
    <div key={payment.paymentId} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              {getStatusIcon(payment.status)}
              <h3 className="text-lg font-semibold text-gray-900 ml-2">
                Payment #{payment.paymentId}
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {payment.paymentFor === 'emi' && payment.emiNumber && `EMI #${payment.emiNumber}`}
              {payment.paymentFor !== 'emi' && payment.paymentFor}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Date: {formatDate(payment.paymentDate)}</span>
              {payment.transactionId && (
                <span>TXN: {payment.transactionId}</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
              {payment.status}
            </div>
            {payment.verificationStatus && (
              <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                payment.verificationStatus === 'verified' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {payment.verificationStatus}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Amount</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(payment.amount)}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Payment Type</p>
            <div className="flex items-center">
              {getPaymentTypeIcon(payment.paymentType)}
              <span className="ml-2 font-medium capitalize">
                {payment.paymentType.replace('_', ' ')}
              </span>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Method</p>
            <p className="font-medium capitalize">
              {payment.paymentMethod.replace('_', ' ')}
            </p>
          </div>
        </div>

        {payment.remarks && (
          <div className="bg-yellow-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">Remarks</p>
            <p className="text-sm text-gray-800">{payment.remarks}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          {payment.screenshots > 0 && (
            <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              <Eye className="w-4 h-4 mr-2" />
              View Screenshots ({payment.screenshots})
            </button>
          )}
          {payment.status === 'pending' && (
            <button className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Screenshot
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const safePayments = payments || [];
  const safePagination = pagination || {
    currentPage: 1,
    totalPages: 1,
    totalPayments: 0,
    hasNext: false,
    hasPrev: false
  };

  if (isLoading && safePayments.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">Loading payment history...</span>
      </div>
    );
  }

  if (error && safePayments.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Payment History</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchPaymentHistory}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <History className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mr-3" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Payment History</h1>
            <p className="text-sm sm:text-base text-gray-600">View your payment history and transaction details</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      {renderFilters()}

      {/* Payment History */}
      {safePayments.length === 0 ? (
        <div className="text-center py-12">
          <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment History</h3>
          <p className="text-gray-600">You don't have any payment history yet.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {safePayments.map(renderPaymentCard)}
          </div>
          
          {/* Pagination */}
          {safePagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                disabled={!safePagination.hasPrev}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {safePagination.currentPage} of {safePagination.totalPages}
              </span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                disabled={!safePagination.hasNext}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentHistoryContent;

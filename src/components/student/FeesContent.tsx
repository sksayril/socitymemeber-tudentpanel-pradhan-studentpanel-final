import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  FileText,
  TrendingUp,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  apiService, 
  FeeRequest, 
  Payment, 
  FeeSummary
} from '../../services/api';

const FeesContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'summary' | 'requests' | 'payments' | 'pending'>('summary');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [feeSummary, setFeeSummary] = useState<FeeSummary | null>(null);
  const [feeRequests, setFeeRequests] = useState<FeeRequest[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pendingFees, setPendingFees] = useState<FeeRequest[]>([]);

  useEffect(() => {
    fetchAllFeeData();
  }, []);

  const fetchFeeSummary = async () => {
    try {
      const response = await apiService.getMyFeeSummary();
      console.log('Fee Summary Full Response:', response);
      if (response.data) {
        console.log('Fee Summary Data:', response.data);
        console.log('Fee Summary Object:', response.data.summary);
        setFeeSummary(response.data.summary);
      } else {
        console.log('No fee summary data received');
        setFeeSummary(null);
      }
    } catch (err) {
      console.error('Fee Summary Error:', err);
      setFeeSummary(null);
    }
  };

  const fetchFeeRequests = async () => {
    try {
      const response = await apiService.getMyFeeRequests();
      console.log('Fee Requests Full Response:', response);
      if (response.data) {
        console.log('Fee Requests Data:', response.data);
        console.log('Fee Requests Array:', response.data.feeRequests);
        setFeeRequests(response.data.feeRequests || []);
      } else {
        console.log('No fee requests data received');
        setFeeRequests([]);
      }
    } catch (err) {
      console.error('Fee Requests Error:', err);
      setFeeRequests([]);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const response = await apiService.getMyPaymentHistory();
      console.log('Payment History Full Response:', response);
      if (response.data) {
        console.log('Payment History Data:', response.data);
        console.log('Payment History Payments Array:', response.data.payments);
        setPayments(response.data.payments || []);
      } else {
        console.log('No payment history data received');
        setPayments([]);
      }
    } catch (err) {
      console.error('Payment History Error:', err);
      setPayments([]);
    }
  };

  const fetchPendingFees = async () => {
    try {
      const response = await apiService.getMyPendingFees();
      console.log('Pending Fees Full Response:', response);
      if (response.data) {
        console.log('Pending Fees Data:', response.data);
        console.log('Pending Fees Array:', response.data.pendingFees);
        setPendingFees(response.data.pendingFees || []);
      } else {
        console.log('No pending fees data received');
        setPendingFees([]);
      }
    } catch (err) {
      console.error('Pending Fees Error:', err);
      setPendingFees([]);
    }
  };

  const fetchAllFeeData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch all fee data in parallel
      await Promise.allSettled([
        fetchFeeSummary(),
        fetchFeeRequests(),
        fetchPaymentHistory(),
        fetchPendingFees()
      ]);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch fee data';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Fee data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'soon':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return '💵';
      case 'online':
        return '💳';
      case 'bank_transfer':
        return '🏦';
      case 'cheque':
        return '📄';
      default:
        return '💰';
    }
  };

  const renderSummaryTab = () => {
    if (!feeSummary) {
      return (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Summary Data</h3>
          <p className="text-gray-600">Fee summary information is not available.</p>
        </div>
      );
    }

  return (
    <div className="space-y-4 lg:space-y-6">
        {/* Summary Cards - Mobile Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Requested</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  {formatCurrency(feeSummary.amounts?.totalRequested || 0)}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Paid</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 truncate">
                  {formatCurrency(feeSummary.amounts?.totalPaid || 0)}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Remaining</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600 truncate">
                  {formatCurrency(feeSummary.amounts?.totalRemaining || 0)}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-red-100 rounded-lg flex-shrink-0">
                <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Overdue</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600 truncate">
                  {feeSummary.urgency?.overdue || 0}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-red-100 rounded-lg flex-shrink-0">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Fee Requests Status - Mobile Optimized */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Fee Requests Status</h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{feeSummary.feeRequests?.total || 0}</p>
              <p className="text-xs sm:text-sm text-gray-600">Total</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">{feeSummary.feeRequests?.pending || 0}</p>
              <p className="text-xs sm:text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">{feeSummary.feeRequests?.overdue || 0}</p>
              <p className="text-xs sm:text-sm text-gray-600">Overdue</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg hidden sm:block">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{feeSummary.feeRequests?.partial || 0}</p>
              <p className="text-xs sm:text-sm text-gray-600">Partial</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg hidden sm:block">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{feeSummary.feeRequests?.paid || 0}</p>
              <p className="text-xs sm:text-sm text-gray-600">Paid</p>
            </div>
            {/* Mobile-only combined card for Partial and Paid */}
            <div className="text-center p-3 bg-blue-50 rounded-lg sm:hidden col-span-2">
              <div className="flex justify-around">
                <div>
                  <p className="text-lg font-bold text-blue-600">{feeSummary.feeRequests?.partial || 0}</p>
                  <p className="text-xs text-gray-600">Partial</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">{feeSummary.feeRequests?.paid || 0}</p>
                  <p className="text-xs text-gray-600">Paid</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods - Mobile Optimized */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">💵</div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{feeSummary.payments?.byMethod?.cash || 0}</p>
              <p className="text-xs sm:text-sm text-gray-600">Cash</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">💳</div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{feeSummary.payments?.byMethod?.online || 0}</p>
              <p className="text-xs sm:text-sm text-gray-600">Online</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">🏦</div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{feeSummary.payments?.byMethod?.bank_transfer || 0}</p>
              <p className="text-xs sm:text-sm text-gray-600">Bank Transfer</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl mb-2">📄</div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{feeSummary.payments?.byMethod?.cheque || 0}</p>
              <p className="text-xs sm:text-sm text-gray-600">Cheque</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRequestsTab = () => {
    return (
      <div className="space-y-6">
        {feeRequests.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Fee Requests</h3>
            <p className="text-gray-600">You don't have any fee requests yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {feeRequests.map((request) => (
              <div key={request._id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {request.courseId?.title || 'Course title not available'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {request.batchId?.name || 'Batch not available'}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Requested: {formatDate(request.requestDate)}</span>
                        <span>Due: {formatDate(request.dueDate)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </div>
                      {request.urgency && (
                        <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(request.totalAmount, request.currency)}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Paid Amount</p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(request.paidAmount, request.currency)}
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Remaining</p>
                      <p className="text-lg font-semibold text-red-600">
                        {formatCurrency(request.remainingAmount, request.currency)}
                      </p>
                    </div>
                  </div>

                  {request.notes && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>Notes:</strong> {request.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderPaymentsTab = () => {
    return (
      <div className="space-y-6">
        {payments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment History</h3>
            <p className="text-gray-600">You haven't made any payments yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {payments.map((payment) => (
              <div key={payment._id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {payment.courseId?.title || 'Course title not available'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {payment.batchId?.name || 'Batch not available'}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Date: {formatDate(payment.paymentDate)}</span>
                        {payment.receiptNumber && (
                          <span>Receipt: {payment.receiptNumber}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{getPaymentMethodIcon(payment.paymentMethod)}</span>
                        <span className="text-sm text-gray-600 capitalize">{payment.paymentMethod}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        payment.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 
                        payment.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.paymentStatus}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Amount Paid</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(payment.amount, payment.currency)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Collected By</p>
                      <p className="text-sm font-medium text-gray-900">
                        {payment.collectedBy?.firstName} {payment.collectedBy?.lastName}
                      </p>
                    </div>
                  </div>

                  {payment.transactionId && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>Transaction ID:</strong> {payment.transactionId}
                      </p>
                    </div>
                  )}

                  {payment.notes && (
                    <div className="bg-gray-50 rounded-lg p-4 mt-4">
                      <p className="text-sm text-gray-800">
                        <strong>Notes:</strong> {payment.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderPendingTab = () => {
    return (
      <div className="space-y-6">
        {pendingFees.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Fees</h3>
            <p className="text-gray-600">Great! You don't have any pending fees.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingFees.map((fee) => (
              <div key={fee._id} className={`bg-white rounded-xl shadow-lg border-2 overflow-hidden ${
                fee.urgency === 'overdue' ? 'border-red-200' :
                fee.urgency === 'urgent' ? 'border-orange-200' :
                'border-gray-100'
              }`}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {fee.courseId?.title || 'Course title not available'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {fee.batchId?.name || 'Batch not available'}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Due: {formatDate(fee.dueDate)}</span>
                        {fee.daysUntilDue !== undefined && (
                          <span className={fee.daysUntilDue < 0 ? 'text-red-600' : 'text-orange-600'}>
                            {fee.daysUntilDue < 0 ? `${Math.abs(fee.daysUntilDue)} days overdue` : 
                             fee.daysUntilDue === 0 ? 'Due today' : 
                             `${fee.daysUntilDue} days remaining`}
                    </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(fee.status)}`}>
                        {fee.status}
                      </div>
                      {fee.urgency && (
                        <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(fee.urgency)}`}>
                          {fee.urgency}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(fee.totalAmount, fee.currency)}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Paid Amount</p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(fee.paidAmount, fee.currency)}
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Remaining</p>
                      <p className="text-lg font-semibold text-red-600">
                        {formatCurrency(fee.remainingAmount, fee.currency)}
                      </p>
                    </div>
                  </div>

                  {fee.notes && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>Notes:</strong> {fee.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading fee information...</span>
            </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Fee Data</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchAllFeeData}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
          </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Fees Management</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your fee requests and payment history</p>
            </div>
        </div>

        <button
          onClick={fetchAllFeeData}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Mobile-First Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        {/* Mobile Tab Navigation */}
        <div className="block sm:hidden">
          <div className="flex overflow-x-auto scrollbar-hide">
            {[
              { id: 'summary', label: 'Summary', icon: TrendingUp },
              { id: 'requests', label: 'Requests', icon: FileText },
              { id: 'payments', label: 'Payments', icon: CreditCard },
              { id: 'pending', label: 'Pending', icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-3 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Tab Navigation */}
        <div className="hidden sm:block border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'summary', label: 'Summary', icon: TrendingUp },
              { id: 'requests', label: 'All Requests', icon: FileText },
              { id: 'payments', label: 'Payment History', icon: CreditCard },
              { id: 'pending', label: 'Pending Fees', icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
        </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === 'summary' && renderSummaryTab()}
          {activeTab === 'requests' && renderRequestsTab()}
          {activeTab === 'payments' && renderPaymentsTab()}
          {activeTab === 'pending' && renderPendingTab()}
        </div>
      </div>
    </div>
  );
};

export default FeesContent;
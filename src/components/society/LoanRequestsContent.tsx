import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Eye, 
  X, 
  Edit, 
  FileText,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Filter,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  apiService, 
  LoanRequest,
  LoanRequestsResponse,
  LoanRequestFilters
} from '../../services/api';
import LoanRequestForm from './LoanRequestForm';

const LoanRequestsContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'my-loans' | 'new-request'>('my-loans');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRequests: 0,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFilters] = useState<LoanRequestFilters>({
    page: 1,
    limit: 10
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (activeTab === 'my-loans') {
      fetchLoanRequests();
    }
  }, [filters, activeTab]);

  const fetchLoanRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getLoanRequests(filters);
      if (response.data) {
        setLoanRequests(response.data.loanRequests);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching loan requests:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch loan requests');
      toast.error('Failed to fetch loan requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLoanRequest = async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.createLoanRequest(data);
      if (response.data) {
        toast.success('Loan request submitted successfully!');
        setActiveTab('my-loans');
        fetchLoanRequests();
      }
    } catch (err) {
      console.error('Error creating loan request:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit loan request';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelLoanRequest = async (requestId: string) => {
    try {
      await apiService.cancelLoanRequest(requestId);
      toast.success('Loan request cancelled successfully!');
      fetchLoanRequests();
    } catch (err) {
      console.error('Error cancelling loan request:', err);
      toast.error('Failed to cancel loan request');
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
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'disbursed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'disbursed':
        return <DollarSign className="w-5 h-5 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-purple-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="disbursed">Disbursed</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Items per page</label>
            <select
              value={filters.limit || 10}
              onChange={(e) => setFilters(prev => ({ ...prev, limit: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ page: 1, limit: 10 })}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors mr-2"
            >
              Clear
            </button>
            <button
              onClick={fetchLoanRequests}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderLoanRequestCard = (request: LoanRequest) => (
    <div key={request.requestId} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              {getStatusIcon(request.status)}
              <h3 className="text-lg font-semibold text-gray-900 ml-2">
                {request.loanPurpose} Loan
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Request ID: {request.requestId}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Applied: {formatDate(request.createdAt)}</span>
              {request.approvedAt && (
                <span>Approved: {formatDate(request.approvedAt)}</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
              {request.status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Loan Amount</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(request.loanAmount)}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Monthly EMI</p>
            <p className="text-lg font-semibold text-blue-600">
              {formatCurrency(request.emiOptions.emiAmount)}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Tenure</p>
            <p className="text-lg font-semibold text-green-600">
              {request.emiOptions.tenureMonths} months
            </p>
          </div>
        </div>

        {request.loanDescription && (
          <div className="bg-yellow-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">Description</p>
            <p className="text-sm text-gray-800">{request.loanDescription}</p>
          </div>
        )}

        {request.rejectionReason && (
          <div className="bg-red-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-600 mb-1">Rejection Reason</p>
            <p className="text-sm text-red-800">{request.rejectionReason}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {/* View details */}}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </button>
          
          {request.status === 'pending' && (
            <>
              <button
                onClick={() => {/* Edit request */}}
                className="flex items-center px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => handleCancelLoanRequest(request.requestId)}
                className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </>
          )}
          
          {request.status === 'approved' && (
            <button
              onClick={() => {/* Upload documents */}}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <FileText className="w-4 h-4 mr-2" />
              Upload Documents
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderMyLoansTab = () => (
    <div className="space-y-6">
      {renderFilters()}
      
      {loanRequests.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Loan Requests</h3>
          <p className="text-gray-600 mb-4">You don't have any loan requests yet.</p>
          <button
            onClick={() => setActiveTab('new-request')}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Apply for Loan
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {loanRequests.map(renderLoanRequestCard)}
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                disabled={!pagination.hasPrev}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                disabled={!pagination.hasNext}
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

  const renderNewRequestTab = () => (
    <div className="space-y-6">
      <LoanRequestForm
        onSubmit={handleCreateLoanRequest}
        isLoading={isLoading}
        error={error}
        onCancel={() => setActiveTab('my-loans')}
      />
    </div>
  );

  if (isLoading && loanRequests.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">Loading loan requests...</span>
      </div>
    );
  }

  if (error && loanRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Loan Requests</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchLoanRequests}
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
          <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mr-3" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Loan Requests</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your loan applications and requests</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('new-request')}
          className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Loan Request
        </button>
      </div>

      {/* Mobile-First Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        {/* Mobile Tab Navigation */}
        <div className="block sm:hidden">
          <div className="flex overflow-x-auto scrollbar-hide">
            {[
              { id: 'my-loans', label: 'My Loans', icon: CreditCard },
              { id: 'new-request', label: 'New Request', icon: Plus },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-3 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600 bg-purple-50'
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
              { id: 'my-loans', label: 'My Loan Requests', icon: CreditCard },
              { id: 'new-request', label: 'Apply for Loan', icon: Plus },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
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
          {activeTab === 'my-loans' && renderMyLoansTab()}
          {activeTab === 'new-request' && renderNewRequestTab()}
        </div>
      </div>
    </div>
  );
};

export default LoanRequestsContent;

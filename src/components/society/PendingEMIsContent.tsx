import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  CreditCard, 
  Filter,
  RefreshCw,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  apiService, 
  PendingEMI,
  PendingEMIsResponse,
  PendingEMIsMonthlyResponse,
  PendingEMIFilters
} from '../../services/api';
import EMIPaymentModal from './EMIPaymentModal';

const PendingEMIsContent: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'monthly'>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingEMIs, setPendingEMIs] = useState<PendingEMI[]>([]);
  const [monthlyEMIs, setMonthlyEMIs] = useState<PendingEMIsMonthlyResponse | null>(null);
  const [summary, setSummary] = useState({
    totalPendingEMIs: 0,
    totalPendingAmount: 0,
    totalPenaltyAmount: 0,
    overdueEMIs: 0
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPendingEMIs: 0,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFilters] = useState<PendingEMIFilters>({
    page: 1,
    limit: 10
  });
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [selectedEMI, setSelectedEMI] = useState<PendingEMI | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (viewMode === 'list') {
      fetchPendingEMIs();
    } else {
      fetchMonthlyEMIs();
    }
  }, [viewMode, filters]);

  const fetchPendingEMIs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getPendingEMIs(filters);
      if (response.data) {
        setPendingEMIs(response.data.pendingEMIs);
        setSummary(response.data.summary);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching pending EMIs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pending EMIs');
      toast.error('Failed to fetch pending EMIs');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMonthlyEMIs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getPendingEMIsByMonth();
      if (response.data) {
        setMonthlyEMIs(response.data);
      }
    } catch (err) {
      console.error('Error fetching monthly EMIs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch monthly EMIs');
      toast.error('Failed to fetch monthly EMIs');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayEMI = (emi: PendingEMI) => {
    setSelectedEMI(emi);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    setSelectedEMI(null);
    if (viewMode === 'list') {
      fetchPendingEMIs();
    } else {
      fetchMonthlyEMIs();
    }
  };

  const toggleMonthExpansion = (monthKey: string) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(monthKey)) {
      newExpanded.delete(monthKey);
    } else {
      newExpanded.add(monthKey);
    }
    setExpandedMonths(newExpanded);
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

  const getStatusColor = (emi: PendingEMI) => {
    if (emi.isOverdue) return 'bg-red-100 text-red-800';
    if (emi.isInGracePeriod) return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getStatusText = (emi: PendingEMI) => {
    if (emi.isOverdue) return 'Overdue';
    if (emi.isInGracePeriod) return 'Grace Period';
    return 'Pending';
  };

  const renderFilters = () => (
    <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
          <select
            value={filters.month || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value ? Number(e.target.value) : undefined }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
          <select
            value={filters.year || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value ? Number(e.target.value) : undefined }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Years</option>
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
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
            onClick={viewMode === 'list' ? fetchPendingEMIs : fetchMonthlyEMIs}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
        <div className="flex items-center">
          <Calendar className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <p className="text-sm text-gray-600">Total Pending</p>
            <p className="text-2xl font-bold text-gray-900">{summary.totalPendingEMIs}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
        <div className="flex items-center">
          <DollarSign className="w-8 h-8 text-green-600 mr-3" />
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalPendingAmount)}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
        <div className="flex items-center">
          <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
          <div>
            <p className="text-sm text-gray-600">Penalty Amount</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalPenaltyAmount)}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
        <div className="flex items-center">
          <AlertTriangle className="w-8 h-8 text-orange-600 mr-3" />
          <div>
            <p className="text-sm text-gray-600">Overdue EMIs</p>
            <p className="text-2xl font-bold text-gray-900">{summary.overdueEMIs}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEMICard = (emi: PendingEMI) => (
    <div key={emi.emiId} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              EMI #{emi.emiNumber}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {emi.investmentDetails.planName} ({emi.investmentDetails.planType})
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Due: {formatDate(emi.dueDate)}</span>
              {emi.paidAmount > 0 && (
                <span>Paid: {formatCurrency(emi.paidAmount)}</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(emi)}`}>
              {getStatusText(emi)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">EMI Amount</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(emi.emiAmount)}
            </p>
          </div>
          {emi.penaltyAmount > 0 && (
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Penalty</p>
              <p className="text-lg font-semibold text-red-600">
                {formatCurrency(emi.penaltyAmount)}
              </p>
            </div>
          )}
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Due</p>
            <p className="text-lg font-semibold text-purple-600">
              {formatCurrency(emi.emiAmount + emi.penaltyAmount)}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => handlePayEMI(emi)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );

  const renderListView = () => (
    <div className="space-y-6">
      {renderFilters()}
      {renderSummary()}
      
      {pendingEMIs.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending EMIs</h3>
          <p className="text-gray-600">You don't have any pending EMI payments.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {pendingEMIs.map(renderEMICard)}
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

  const renderMonthlyView = () => (
    <div className="space-y-6">
      {renderSummary()}
      
      {!monthlyEMIs || monthlyEMIs.pendingEMIsByMonth.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending EMIs</h3>
          <p className="text-gray-600">You don't have any pending EMI payments.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {monthlyEMIs.pendingEMIsByMonth.map((monthData) => {
            const monthKey = `${monthData.year}-${monthData.month}`;
            const isExpanded = expandedMonths.has(monthKey);
            
            return (
              <div key={monthKey} className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleMonthExpansion(monthKey)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-purple-600 mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {monthData.monthName} {monthData.year}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {monthData.emiCount} EMIs • {formatCurrency(monthData.totalAmount)}
                          {monthData.totalPenalty > 0 && (
                            <span className="text-red-600 ml-2">
                              (+{formatCurrency(monthData.totalPenalty)} penalty)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="border-t border-gray-200 p-4">
                    <div className="grid gap-4">
                      {monthData.emis.map(renderEMICard)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (isLoading && pendingEMIs.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">Loading pending EMIs...</span>
      </div>
    );
  }

  if (error && pendingEMIs.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading EMIs</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={viewMode === 'list' ? fetchPendingEMIs : fetchMonthlyEMIs}
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
          <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mr-3" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pending EMIs</h1>
            <p className="text-sm sm:text-base text-gray-600">View and pay your pending EMI payments</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'monthly'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly View
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? renderListView() : renderMonthlyView()}

      {/* Payment Modal */}
      {selectedEMI && (
        <EMIPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          emi={selectedEMI}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default PendingEMIsContent;

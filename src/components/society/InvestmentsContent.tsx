import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  TrendingUp, 
  Plus, 
  Eye, 
  X, 
  CreditCard, 
  AlertTriangle,
  Loader2,
  RefreshCw,
  Calendar,
  History
} from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  apiService, 
  InvestmentApplication,
  InvestmentApplicationFilters,
  InvestmentApplicationData,
  InvestmentPlan,
  InvestmentPlanFilters
} from '../../services/api';
import InvestmentApplicationForm from './InvestmentApplicationForm';
import PendingEMIsContent from './PendingEMIsContent';
import PaymentHistoryContent from './PaymentHistoryContent';
import DebugPaymentAPI from '../DebugPaymentAPI';

const InvestmentsContent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'my-investments' | 'investment-plans' | 'new-application' | 'pending-emis' | 'payment-history' | 'debug'>('my-investments');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [applications, setApplications] = useState<InvestmentApplication[]>([]);
  const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalApplications: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  
  // Filters
  const [filters, setFilters] = useState<InvestmentApplicationFilters>({
    status: undefined,
    page: 1,
    limit: 10
  });
  
  const [planFilters, setPlanFilters] = useState<InvestmentPlanFilters>({
    planType: undefined,
    minAmount: undefined,
    maxAmount: undefined
  });
  
  // New application form
  const [newApplication, setNewApplication] = useState<InvestmentApplicationData>({
    planId: '',
    investmentAmount: 0,
    monthlyEMI: 0,
    paymentMethod: 'online',
    termsAccepted: false
  });

  useEffect(() => {
    // Check for tab parameter in URL
    const tabParam = searchParams.get('tab');
    if (tabParam && ['my-investments', 'investment-plans', 'new-application', 'pending-emis', 'payment-history', 'debug'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === 'my-investments') {
      fetchApplications();
    } else if (activeTab === 'investment-plans') {
      fetchInvestmentPlans();
    } else if (activeTab === 'new-application' && investmentPlans.length === 0) {
      fetchInvestmentPlans();
    }
    // pending-emis and payment-history tabs handle their own data fetching
  }, [filters, planFilters, activeTab]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getInvestmentApplications(filters);
      console.log('Investment Applications Response:', response);
      
      if (response.data) {
        setApplications(response.data.applications);
        setPagination(response.data.pagination);
      } else {
        console.log('No investment applications data received');
        setApplications([]);
      }
    } catch (err) {
      console.error('Investment Applications Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch investment applications');
      toast.error('Failed to fetch investment applications');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInvestmentPlans = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getInvestmentPlans(planFilters);
      console.log('Investment Plans Response:', response);
      
      if (response.data) {
        setInvestmentPlans(response.data.plans);
      } else {
        console.log('No investment plans data received');
        setInvestmentPlans([]);
      }
    } catch (err) {
      console.error('Investment Plans Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch investment plans');
      toast.error('Failed to fetch investment plans');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyForInvestment = async (formData: InvestmentApplicationData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Sending investment application data:', formData);
      console.log('Terms accepted value:', formData.termsAccepted);
      
      const response = await apiService.applyForInvestment(formData);
      console.log('Investment Application Response:', response);
      
      if (response.data) {
        toast.success('Investment application submitted successfully!');
        setActiveTab('my-investments');
        setNewApplication({
          planId: '',
          investmentAmount: 0,
          monthlyEMI: 0,
          paymentMethod: 'online',
          termsAccepted: false
        });
        fetchApplications();
      }
    } catch (err) {
      console.error('Investment Application Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit investment application';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelApplication = async (applicationId: string) => {
    try {
      await apiService.cancelInvestmentApplication(applicationId);
      toast.success('Investment application cancelled successfully!');
      fetchApplications();
    } catch (err) {
      console.error('Cancel Application Error:', err);
      toast.error('Failed to cancel investment application');
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
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderInvestmentPlansTab = () => {
    return (
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plan Type</label>
              <select
                value={planFilters.planType || ''}
                onChange={(e) => setPlanFilters({ ...planFilters, planType: e.target.value as any || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="FD">Fixed Deposit (FD)</option>
                <option value="RD">Recurring Deposit (RD)</option>
                <option value="CD">Certificate of Deposit (CD)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Amount</label>
              <input
                type="number"
                value={planFilters.minAmount || ''}
                onChange={(e) => setPlanFilters({ ...planFilters, minAmount: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="Minimum amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Amount</label>
              <input
                type="number"
                value={planFilters.maxAmount || ''}
                onChange={(e) => setPlanFilters({ ...planFilters, maxAmount: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="Maximum amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Investment Plans List */}
        {investmentPlans.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Investment Plans Available</h3>
            <p className="text-gray-600 mb-4">No investment plans match your current filters.</p>
            <button
              onClick={() => setPlanFilters({ planType: undefined, minAmount: undefined, maxAmount: undefined })}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investmentPlans.map((plan) => (
              <div key={plan._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                 <div className="flex items-start justify-between mb-4">
                   <div>
                     <h3 className="text-lg font-semibold text-gray-900 mb-1">{plan.planName}</h3>
                     <p className="text-sm text-gray-600 mb-2">Plan ID: {plan.planId}</p>
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                       {plan.planType}
                     </span>
                   </div>
                   <div className="text-right">
                     <div className="text-2xl font-bold text-green-600">{plan.interestRate}%</div>
                     <div className="text-sm text-gray-500">Interest Rate</div>
                   </div>
                 </div>
                
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Minimum Amount:</span>
                    <span className="font-medium">{formatCurrency(plan.minimumAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Maximum Amount:</span>
                    <span className="font-medium">{formatCurrency(plan.maximumAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tenure:</span>
                    <span className="font-medium">{plan.tenureMonths} months</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Compounding:</span>
                    <span className="font-medium capitalize">{plan.compoundingFrequency}</span>
                  </div>
                </div>

                 {/* Sample EMI Costs */}
                 {plan.sampleEMICosts && plan.sampleEMICosts.length > 0 && (
                   <div className="mb-4">
                     <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Returns</h4>
                     <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                       {plan.sampleEMICosts.map((sample, index) => (
                         <div key={index} className="text-sm border-b border-gray-200 pb-2 last:border-b-0">
                           {plan.planType === 'FD' ? (
                             // Fixed Deposit display
                             <>
                               <div className="flex justify-between">
                                 <span>Investment: {formatCurrency(sample.principalAmount || 0)}</span>
                                 <span className="font-medium">Maturity: {formatCurrency(sample.maturityAmount)}</span>
                               </div>
                               <div className="flex justify-between text-gray-600">
                                 <span>Interest: {formatCurrency(sample.totalInterest)}</span>
                                 <span>Monthly: {formatCurrency(sample.monthlyInterest)}</span>
                               </div>
                             </>
                           ) : (
                             // Recurring Deposit display
                             <>
                               <div className="flex justify-between">
                                 <span>Monthly: {formatCurrency(sample.monthlyInstallment || 0)}</span>
                                 <span className="font-medium">Maturity: {formatCurrency(sample.maturityAmount)}</span>
                               </div>
                               <div className="flex justify-between text-gray-600">
                                 <span>Total Investment: {formatCurrency(sample.totalInvestment || 0)}</span>
                                 <span>Interest: {formatCurrency(sample.totalInterest)}</span>
                               </div>
                               <div className="flex justify-between text-gray-500 text-xs">
                                 <span>Monthly Interest: {formatCurrency(sample.monthlyInterest)}</span>
                                 <span>Tenure: {plan.tenureMonths} months</span>
                               </div>
                             </>
                           )}
                         </div>
                       ))}
                     </div>
                   </div>
                 )}

                <button
                  onClick={() => {
                    setNewApplication({ ...newApplication, planId: plan._id });
                    setActiveTab('new-application');
                  }}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Apply for this Plan
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderApplicationsTab = () => {
    return (
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any || undefined }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchApplications}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Investment Applications</h3>
            <p className="text-gray-600 mb-4">You don't have any investment applications yet.</p>
            <button
              onClick={() => setActiveTab('new-application')}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Apply for Investment
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((application) => (
              <div key={application.applicationId} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {application.plan?.planName || 'Investment Plan'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Application ID: {application.applicationId}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Applied: {formatDate(application.applicationDate)}</span>
                        {application.approvalDate && (
                          <span>Approved: {formatDate(application.approvalDate)}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {application.status}
                      </div>
                      <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(application.paymentStatus)}`}>
                        {application.paymentStatus}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Investment Amount</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(application.investmentAmount)}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Amount Paid</p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(application.totalAmountPaid)}
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Remaining</p>
                      <p className="text-lg font-semibold text-red-600">
                        {formatCurrency(application.remainingAmount)}
                      </p>
                    </div>
                  </div>

                  {application.emiProgress && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">EMI Progress</h4>
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold text-blue-600">{application.emiProgress.total}</p>
                          <p className="text-xs text-gray-600">Total</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-green-600">{application.emiProgress.paid}</p>
                          <p className="text-xs text-gray-600">Paid</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-yellow-600">{application.emiProgress.pending}</p>
                          <p className="text-xs text-gray-600">Pending</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-red-600">{application.emiProgress.overdue}</p>
                          <p className="text-xs text-gray-600">Overdue</p>
                        </div>
                      </div>
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
                    
                    {application.status === 'pending' && (
                      <button
                        onClick={() => handleCancelApplication(application.applicationId)}
                        className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    )}
                    
                    {application.status === 'approved' && application.paymentStatus !== 'completed' && (
                      <button
                        onClick={() => {/* Make payment */}}
                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Make Payment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
              disabled={!pagination.hasPrevPage}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
              disabled={!pagination.hasNextPage}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };

   const renderNewApplicationTab = () => {
     return (
       <div className="space-y-6">
         <InvestmentApplicationForm
           onSubmit={(formData) => handleApplyForInvestment(formData)}
           isLoading={isLoading}
           error={error}
           onCancel={() => setActiveTab('my-investments')}
           investmentPlans={investmentPlans}
           selectedPlanId={newApplication.planId}
         />
       </div>
     );
   };

  if (isLoading && applications.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">Loading investment applications...</span>
      </div>
    );
  }

  if (error && applications.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Investment Applications</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchApplications}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mr-3" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Investments</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your investments, view plans, and apply for new investments</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('new-application')}
          className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Application
        </button>
      </div>

      {/* Mobile-First Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        {/* Mobile Tab Navigation */}
        <div className="block sm:hidden">
          <div className="flex overflow-x-auto scrollbar-hide">
            {[
              { id: 'my-investments', label: 'My Investments', icon: TrendingUp },
              { id: 'investment-plans', label: 'Investment Plans', icon: Eye },
              { id: 'new-application', label: 'New Application', icon: Plus },
              { id: 'pending-emis', label: 'Pending EMIs', icon: Calendar },
              { id: 'payment-history', label: 'Payment History', icon: History },
              { id: 'debug', label: 'Debug API', icon: AlertTriangle },
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
              { id: 'my-investments', label: 'My Investments', icon: TrendingUp },
              { id: 'investment-plans', label: 'Investment Plans', icon: Eye },
              { id: 'new-application', label: 'Apply for Investment', icon: Plus },
              { id: 'pending-emis', label: 'Pending EMIs', icon: Calendar },
              { id: 'payment-history', label: 'Payment History', icon: History },
              { id: 'debug', label: 'Debug API', icon: AlertTriangle },
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
          {activeTab === 'my-investments' && renderApplicationsTab()}
          {activeTab === 'investment-plans' && renderInvestmentPlansTab()}
          {activeTab === 'new-application' && renderNewApplicationTab()}
          {activeTab === 'pending-emis' && <PendingEMIsContent />}
          {activeTab === 'payment-history' && <PaymentHistoryContent />}
          {activeTab === 'debug' && <DebugPaymentAPI />}
        </div>
      </div>
    </div>
  );
};

export default InvestmentsContent;

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertCircle, 
  Calendar, 
  Bell,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  ArrowRight,
  Zap
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { 
  apiService, 
  ComprehensiveDashboardData
} from '../../services/api';

const SocietyDashboardContent: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<ComprehensiveDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch comprehensive dashboard data
        const response = await apiService.getComprehensiveDashboard();
        if (response.data) {
          setDashboardData(response.data);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Dashboard data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'disbursed':
      case 'successful':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center lg:text-left">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Society Dashboard</h2>
          <p className="text-gray-600">Loading comprehensive dashboard data...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center lg:text-left">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Society Dashboard</h2>
          <p className="text-gray-600">Error loading dashboard data</p>
        </div>
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
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

  if (!dashboardData) {
    return (
      <div className="space-y-6">
        <div className="text-center lg:text-left">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Society Dashboard</h2>
          <p className="text-gray-600">No dashboard data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {dashboardData.member?.name || 'Member'}!
        </h2>
        <p className="text-gray-600">
          {dashboardData.member?.societyName || 'Society'} - {dashboardData.member?.position || 'Member'}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Member ID: {dashboardData.member?.memberId || 'N/A'} | Last login: {dashboardData.member?.lastLogin ? formatDate(dashboardData.member.lastLogin) : 'N/A'}
        </p>
      </div>

      {/* Notifications */}
      {dashboardData.notifications && dashboardData.notifications.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <Bell className="w-6 h-6 text-purple-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="space-y-3">
            {dashboardData.notifications && dashboardData.notifications.map((notification, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getPriorityColor(notification.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{notification.title}</h4>
                    <p className="text-sm">{notification.message}</p>
                  </div>
                  {notification.actionRequired && (
                    <button className="ml-4 px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors">
                      Action Required
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-4">
          <Zap className="w-6 h-6 text-purple-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardData.quickActions && dashboardData.quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                if (action.id === 'view_emis') navigate('/society/investments?tab=pending-emis');
                else if (action.id === 'make_payment') navigate('/society/investments?tab=pending-emis');
                else if (action.id === 'apply_loan') navigate('/society/loans?tab=new-request');
              }}
              disabled={!action.available}
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          ))}
          
          {/* CD Investment Quick Action */}
          <button
            onClick={() => navigate('/society/cd-investments')}
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">CD Investment</h4>
                <p className="text-sm text-gray-600">Request Certificate of Deposit</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* EMI Stats */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">EMI Stats</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total EMIs</span>
              <span className="font-semibold">{dashboardData.dashboardStats?.emiStats?.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Paid</span>
              <span className="font-semibold text-green-600">{dashboardData.dashboardStats?.emiStats?.paid || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="font-semibold text-yellow-600">{dashboardData.dashboardStats?.emiStats?.pending || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Overdue</span>
              <span className="font-semibold text-red-600">{dashboardData.dashboardStats?.emiStats?.overdue || 0}</span>
            </div>
          </div>
        </div>

        {/* Payment Stats */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Payments</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Payments</span>
              <span className="font-semibold">{dashboardData.dashboardStats?.paymentStats?.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Successful</span>
              <span className="font-semibold text-green-600">{dashboardData.dashboardStats?.paymentStats?.successful || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="font-semibold text-yellow-600">{dashboardData.dashboardStats?.paymentStats?.pending || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="font-semibold">{dashboardData.dashboardStats?.paymentStats?.successRate || 0}%</span>
            </div>
          </div>
        </div>

        {/* Amount Stats */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Amounts</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Paid</span>
              <span className="font-semibold text-green-600">{formatCurrency(dashboardData.dashboardStats?.amountStats?.totalPaid || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Pending</span>
              <span className="font-semibold text-yellow-600">{formatCurrency(dashboardData.dashboardStats?.amountStats?.totalPending || 0)}</span>
            </div>
          </div>
        </div>

        {/* Member Status */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-sm text-gray-500">Status</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">KYC Status</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dashboardData.member?.kycStatus || 'pending')}`}>
                {dashboardData.member?.kycStatus || 'pending'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Verified</span>
              <span className="flex items-center">
                {dashboardData.member?.isVerified ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Active</span>
              <span className="flex items-center">
                {dashboardData.member?.isActive ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming EMIs */}
      {dashboardData.upcomingEMIs && dashboardData.upcomingEMIs.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Clock className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Upcoming EMIs</h3>
            </div>
            <button
              onClick={() => navigate('/society/investments?tab=pending-emis')}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {dashboardData.upcomingEMIs && dashboardData.upcomingEMIs.slice(0, 3).map((emi) => (
              <div key={emi.emiId} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">EMI #{emi.emiNumber}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(emi.status)}`}>
                        {emi.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {emi.type === 'loan' ? emi.loanPurpose : emi.planName} - {formatCurrency(emi.emiAmount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Due: {formatDate(emi.dueDate)} ({emi.daysUntilDue} days)
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/society/investments?tab=pending-emis')}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Loans Summary */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CreditCard className="w-6 h-6 text-purple-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">My Loans</h3>
          </div>
          <button
            onClick={() => navigate('/society/loans')}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{dashboardData.myLoans?.totalLoans || 0}</p>
            <p className="text-sm text-gray-600">Total Loans</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.myLoans?.totalLoanAmount || 0)}</p>
            <p className="text-sm text-gray-600">Total Amount</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.myLoans?.totalDisbursedAmount || 0)}</p>
            <p className="text-sm text-gray-600">Disbursed</p>
          </div>
        </div>
        {dashboardData.myLoans?.recentLoans && dashboardData.myLoans.recentLoans.length > 0 && (
          <div className="space-y-3">
            {dashboardData.myLoans?.recentLoans && dashboardData.myLoans.recentLoans.slice(0, 2).map((loan) => (
              <div key={loan.requestId} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{loan.loanPurpose} Loan</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Amount: {formatCurrency(loan.loanAmount)} | EMIs: {loan.paidEMIs}/{loan.emiCount}
                    </p>
                    <p className="text-xs text-gray-500">
                      Applied: {formatDate(loan.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/society/loans')}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Investments Summary */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <TrendingUp className="w-6 h-6 text-purple-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">My Investments</h3>
          </div>
          <button
            onClick={() => navigate('/society/investments')}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{dashboardData.myInvestments?.totalInvestments || 0}</p>
            <p className="text-sm text-gray-600">Total Investments</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.myInvestments?.totalInvestmentAmount || 0)}</p>
            <p className="text-sm text-gray-600">Invested Amount</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.myInvestments?.totalMaturityAmount || 0)}</p>
            <p className="text-sm text-gray-600">Expected Maturity</p>
          </div>
        </div>
        {dashboardData.myInvestments?.recentInvestments && dashboardData.myInvestments.recentInvestments.length > 0 && (
          <div className="space-y-3">
            {dashboardData.myInvestments?.recentInvestments && dashboardData.myInvestments.recentInvestments.slice(0, 2).map((investment) => (
              <div key={investment.investmentId} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{investment.planName}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(investment.status)}`}>
                        {investment.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Amount: {formatCurrency(investment.principalAmount)} | Rate: {investment.interestRate}%
                    </p>
                    <p className="text-xs text-gray-500">
                      Started: {formatDate(investment.investmentDate)}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/society/investments')}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Payments */}
      {dashboardData.recentPayments && dashboardData.recentPayments.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <DollarSign className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
            </div>
            <button
              onClick={() => navigate('/society/investments?tab=payment-history')}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {dashboardData.recentPayments && dashboardData.recentPayments.slice(0, 3).map((payment) => (
              <div key={payment.paymentId} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">Payment #{payment.paymentId.slice(-6)}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Amount: {formatCurrency(payment.amount)} | Method: {payment.paymentMethod}
                    </p>
                    <p className="text-xs text-gray-500">
                      Date: {formatDate(payment.paymentDate)}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/society/investments?tab=payment-history')}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocietyDashboardContent;
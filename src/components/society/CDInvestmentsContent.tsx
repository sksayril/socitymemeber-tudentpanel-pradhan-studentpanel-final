import React, { useState, useEffect } from 'react';
import { Plus, Banknote, TrendingUp, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import { apiService, CDInvestment, CDInvestmentRequest } from '../../services/api';
import { toast } from 'react-toastify';

const CDInvestmentsContent: React.FC = () => {
  const [investments, setInvestments] = useState<CDInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [summary, setSummary] = useState({
    active: { count: 0, totalAmount: 0 },
    pending: { count: 0, totalAmount: 0 }
  });

  useEffect(() => {
    fetchCDInvestments();
  }, [selectedStatus]);

  const fetchCDInvestments = async () => {
    try {
      setLoading(true);
      const filters = selectedStatus !== 'all' ? { status: selectedStatus as any } : {};
      const response = await apiService.getMyCDInvestments(filters);
      
      if (response.success && response.data) {
        setInvestments(response.data.investments || []);
        setSummary(response.data.summary || {
          active: { count: 0, totalAmount: 0 },
          pending: { count: 0, totalAmount: 0 }
        });
      }
    } catch (error) {
      console.error('Error fetching CD investments:', error);
      toast.error('Failed to fetch CD investments');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestInvestment = async (data: CDInvestmentRequest) => {
    try {
      const response = await apiService.requestCDInvestment(data);
      
      if (response.success) {
        toast.success('CD Investment request submitted successfully!');
        setShowRequestForm(false);
        fetchCDInvestments();
      }
    } catch (error) {
      console.error('Error requesting CD investment:', error);
      toast.error('Failed to submit CD investment request');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'matured':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <TrendingUp className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'matured':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Banknote className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CD Investments</h1>
          <p className="text-gray-600 mt-1">Manage your Certificate of Deposit investments</p>
        </div>
        <button
          onClick={() => setShowRequestForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Request CD Investment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Investments</p>
              <p className="text-2xl font-bold text-green-600">{summary?.active?.count || 0}</p>
              <p className="text-sm text-gray-500">{formatCurrency(summary?.active?.totalAmount || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-yellow-600">{summary?.pending?.count || 0}</p>
              <p className="text-sm text-gray-500">{formatCurrency(summary?.pending?.totalAmount || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="matured">Matured</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Investments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">My CD Investments</h2>
        </div>
        
        {investments.length === 0 ? (
          <div className="p-12 text-center">
            <Banknote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No CD Investments Found</h3>
            <p className="text-gray-500 mb-6">You haven't made any CD investment requests yet.</p>
            <button
              onClick={() => setShowRequestForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
            >
              Request Your First CD Investment
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {investments.map((investment) => (
              <div key={investment._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{investment.cdId}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(investment.status)}`}>
                        {getStatusIcon(investment.status)}
                        <span className="ml-1 capitalize">{investment.status}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Investment Amount</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(investment.investmentAmount)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Maturity Amount</p>
                        <p className="font-semibold text-green-600">{formatCurrency(investment.maturityAmount)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Interest Rate</p>
                        <p className="font-semibold text-gray-900">{investment.interestRate}% p.a.</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-4">
                      <div>
                        <p className="text-gray-500">Tenure</p>
                        <p className="font-semibold text-gray-900">{investment.tenureMonths} months</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Request Date</p>
                        <p className="font-semibold text-gray-900">{formatDate(investment.requestDate)}</p>
                      </div>
                      {investment.maturityDate && (
                        <div>
                          <p className="text-gray-500">Maturity Date</p>
                          <p className="font-semibold text-gray-900">{formatDate(investment.maturityDate)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <button className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <CDInvestmentRequestForm
          onSubmit={handleRequestInvestment}
          onClose={() => setShowRequestForm(false)}
        />
      )}
    </div>
  );
};

// CD Investment Request Form Component
interface CDInvestmentRequestFormProps {
  onSubmit: (data: CDInvestmentRequest) => void;
  onClose: () => void;
}

const CDInvestmentRequestForm: React.FC<CDInvestmentRequestFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    investmentAmount: '',
    tenureMonths: '',
    purpose: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.investmentAmount || !formData.tenureMonths || !formData.purpose) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        investmentAmount: parseFloat(formData.investmentAmount),
        tenureMonths: parseInt(formData.tenureMonths),
        purpose: formData.purpose,
        notes: formData.notes,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Request CD Investment</h2>
          <p className="text-gray-600 mt-1">Submit your Certificate of Deposit investment request</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Amount (₹) *
            </label>
            <input
              type="number"
              name="investmentAmount"
              value={formData.investmentAmount}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter investment amount"
              min="1000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tenure (Months) *
            </label>
            <select
              name="tenureMonths"
              value={formData.tenureMonths}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Select tenure</option>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
              <option value="18">18 months</option>
              <option value="24">24 months</option>
              <option value="36">36 months</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose *
            </label>
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Education fund, Emergency fund"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Any additional information..."
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CDInvestmentsContent;

import React, { useState } from 'react';
import { 
  DollarSign, 
  FileText, 
  Calendar, 
  Percent, 
  Calculator,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  apiService, 
  LoanRequestData,
  LoanRequestResponse
} from '../../services/api';

interface LoanRequestFormProps {
  onSubmit: (data: LoanRequestData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onCancel: () => void;
}

const LoanRequestForm: React.FC<LoanRequestFormProps> = ({
  onSubmit,
  isLoading,
  error,
  onCancel
}) => {
  const [formData, setFormData] = useState<LoanRequestData>({
    loanAmount: 0,
    loanPurpose: '',
    loanDescription: '',
    tenureMonths: 12,
    emiAmount: 0,
    interestRate: 12.5
  });

  const [calculatedEMI, setCalculatedEMI] = useState<number>(0);
  const [showCalculation, setShowCalculation] = useState(false);

  const loanPurposes = [
    'Personal',
    'Medical',
    'Education',
    'Home Improvement',
    'Business',
    'Vehicle',
    'Wedding',
    'Emergency',
    'Other'
  ];

  const calculateEMI = () => {
    const { loanAmount, tenureMonths, interestRate } = formData;
    
    if (loanAmount > 0 && tenureMonths > 0 && interestRate > 0) {
      const monthlyRate = interestRate / (12 * 100);
      const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
                  (Math.pow(1 + monthlyRate, tenureMonths) - 1);
      
      setCalculatedEMI(Math.round(emi));
      setShowCalculation(true);
    }
  };

  const handleInputChange = (field: keyof LoanRequestData, value: string | number) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Auto-calculate EMI when relevant fields change
    if (['loanAmount', 'tenureMonths', 'interestRate'].includes(field)) {
      if (newFormData.loanAmount > 0 && newFormData.tenureMonths > 0 && newFormData.interestRate > 0) {
        const monthlyRate = newFormData.interestRate / (12 * 100);
        const emi = (newFormData.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, newFormData.tenureMonths)) / 
                    (Math.pow(1 + monthlyRate, newFormData.tenureMonths) - 1);
        setCalculatedEMI(Math.round(emi));
        setShowCalculation(true);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.loanAmount <= 0) {
      toast.error('Please enter a valid loan amount');
      return;
    }
    
    if (!formData.loanPurpose) {
      toast.error('Please select a loan purpose');
      return;
    }
    
    if (!formData.loanDescription.trim()) {
      toast.error('Please provide a loan description');
      return;
    }

    await onSubmit(formData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <DollarSign className="w-8 h-8 text-purple-600 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">New Loan Request</h2>
            <p className="text-gray-600">Submit your loan application with EMI details</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Loan Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Amount *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={formData.loanAmount || ''}
                onChange={(e) => handleInputChange('loanAmount', Number(e.target.value))}
                placeholder="Enter loan amount"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
                min="1000"
                max="10000000"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Minimum: ₹1,000 | Maximum: ₹1,00,00,000
            </p>
          </div>

          {/* Loan Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Purpose *
            </label>
            <select
              value={formData.loanPurpose}
              onChange={(e) => handleInputChange('loanPurpose', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Select loan purpose</option>
              {loanPurposes.map((purpose) => (
                <option key={purpose} value={purpose}>
                  {purpose}
                </option>
              ))}
            </select>
          </div>

          {/* Loan Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Description *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                value={formData.loanDescription}
                onChange={(e) => handleInputChange('loanDescription', e.target.value)}
                placeholder="Describe the purpose and details of your loan request..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={4}
                required
                maxLength={500}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {formData.loanDescription.length}/500 characters
            </p>
          </div>

          {/* EMI Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tenure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tenure (Months) *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.tenureMonths}
                  onChange={(e) => handleInputChange('tenureMonths', Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                  min="1"
                  max="60"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">1-60 months</p>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Rate (%) *
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="0.1"
                  value={formData.interestRate}
                  onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                  min="5"
                  max="30"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">5-30% per annum</p>
            </div>

            {/* EMI Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                EMI Amount *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.emiAmount || ''}
                  onChange={(e) => handleInputChange('emiAmount', Number(e.target.value))}
                  placeholder="Auto-calculated"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                  min="100"
                />
              </div>
              <button
                type="button"
                onClick={calculateEMI}
                className="mt-2 flex items-center text-sm text-purple-600 hover:text-purple-700"
              >
                <Calculator className="w-4 h-4 mr-1" />
                Calculate EMI
              </button>
            </div>
          </div>

          {/* EMI Calculation Display */}
          {showCalculation && calculatedEMI > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800">Calculated EMI</p>
                  <p className="text-lg font-bold text-green-900">
                    {formatCurrency(calculatedEMI)} per month
                  </p>
                  <p className="text-xs text-green-700">
                    Total Interest: {formatCurrency((calculatedEMI * formData.tenureMonths) - formData.loanAmount)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loan Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Loan Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Loan Amount</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(formData.loanAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly EMI</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(formData.emiAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tenure</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formData.tenureMonths} months
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Interest Rate</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formData.interestRate}% p.a.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Loan Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanRequestForm;

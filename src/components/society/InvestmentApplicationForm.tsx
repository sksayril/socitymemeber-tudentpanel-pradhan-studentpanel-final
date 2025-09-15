import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { InvestmentApplicationData, InvestmentPlan } from '../../services/api';

interface InvestmentApplicationFormProps {
  onSubmit: (data: InvestmentApplicationData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onCancel: () => void;
  investmentPlans?: InvestmentPlan[];
  selectedPlanId?: string;
}

const InvestmentApplicationForm: React.FC<InvestmentApplicationFormProps> = ({
  onSubmit,
  isLoading,
  error,
  onCancel,
  investmentPlans = [],
  selectedPlanId
}) => {
  const [formData, setFormData] = useState<InvestmentApplicationData>({
    planId: selectedPlanId || '',
    investmentAmount: 0,
    monthlyEMI: 0,
    paymentMethod: 'online',
    termsAccepted: false
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.planId.trim()) {
      errors.planId = 'Plan ID is required';
    }

    if (formData.investmentAmount <= 0) {
      errors.investmentAmount = 'Investment amount must be greater than 0';
    }

    if (formData.monthlyEMI <= 0) {
      errors.monthlyEMI = 'Monthly EMI must be greater than 0';
    }

    if (formData.monthlyEMI > formData.investmentAmount) {
      errors.monthlyEMI = 'Monthly EMI cannot be greater than investment amount';
    }

    if (!formData.termsAccepted) {
      errors.termsAccepted = 'You must accept the terms and conditions';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Submitting form data:', formData);
      console.log('Terms accepted:', formData.termsAccepted);
      await onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof InvestmentApplicationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const calculateTenure = () => {
    if (formData.investmentAmount > 0 && formData.monthlyEMI > 0) {
      const months = Math.ceil(formData.investmentAmount / formData.monthlyEMI);
      return months;
    }
    return 0;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center mb-6">
          <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Apply for Investment</h3>
            <p className="text-sm text-gray-600">Fill in the details to submit your investment application</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plan Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Investment Plan *
            </label>
            
            {/* Plan Selection Dropdown */}
            {investmentPlans.length > 0 && (
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Select from available plans:
                </label>
                <select
                  value={formData.planId}
                  onChange={(e) => handleInputChange('planId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    validationErrors.planId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Choose a plan...</option>
                  {investmentPlans.map((plan) => (
                    <option key={plan._id} value={plan._id}>
                      {plan.planName} ({plan.planId}) - {plan.planType}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Manual Plan ID Input */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Or enter plan ID manually:
              </label>
              <input
                type="text"
                value={formData.planId}
                onChange={(e) => handleInputChange('planId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  validationErrors.planId ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter plan ID (e.g., PLAN2509002)"
              />
            </div>
            
            {validationErrors.planId && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.planId}</p>
            )}
            
            {/* Show selected plan details */}
            {formData.planId && investmentPlans.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                {(() => {
                  const selectedPlan = investmentPlans.find(plan => plan._id === formData.planId);
                  if (selectedPlan) {
                    return (
                      <div className="text-sm">
                        <p className="font-medium text-blue-900">{selectedPlan.planName}</p>
                        <p className="text-blue-700">Plan ID: {selectedPlan.planId} | Type: {selectedPlan.planType}</p>
                        <p className="text-blue-600">Interest Rate: {selectedPlan.interestRate}% | Tenure: {selectedPlan.tenureMonths} months</p>
                        <p className="text-blue-600">Min: ₹{selectedPlan.minimumAmount.toLocaleString()} | Max: ₹{selectedPlan.maximumAmount.toLocaleString()}</p>
                      </div>
                    );
                  }
                  return (
                    <div className="text-sm text-blue-700">
                      <p>Plan ID: {formData.planId}</p>
                      <p className="text-blue-600">Plan details will be loaded after selection</p>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Investment Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Investment Amount (INR) *
            </label>
            <input
              type="number"
              value={formData.investmentAmount || ''}
              onChange={(e) => handleInputChange('investmentAmount', Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                validationErrors.investmentAmount ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter investment amount"
              min="1"
            />
            {validationErrors.investmentAmount && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.investmentAmount}</p>
            )}
          </div>

          {/* Monthly EMI */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Monthly EMI (INR) *
            </label>
            <input
              type="number"
              value={formData.monthlyEMI || ''}
              onChange={(e) => handleInputChange('monthlyEMI', Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                validationErrors.monthlyEMI ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter monthly EMI amount"
              min="1"
            />
            {validationErrors.monthlyEMI && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.monthlyEMI}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CreditCard className="w-4 h-4 inline mr-2" />
              Payment Method *
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="online">Online Payment</option>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>

          {/* Investment Summary */}
          {formData.investmentAmount > 0 && formData.monthlyEMI > 0 && (
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Investment Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total Amount:</p>
                  <p className="font-semibold text-gray-900">
                    ₹{formData.investmentAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Monthly EMI:</p>
                  <p className="font-semibold text-gray-900">
                    ₹{formData.monthlyEMI.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Estimated Tenure:</p>
                  <p className="font-semibold text-gray-900">
                    {calculateTenure()} months
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Payment Method:</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {formData.paymentMethod.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          <div>
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={formData.termsAccepted}
                onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                className={`h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1 ${
                  validationErrors.termsAccepted ? 'border-red-300' : ''
                }`}
              />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-purple-600 hover:text-purple-700 underline">
                  terms and conditions
                </a>{' '}
                and understand the investment risks involved. *
              </label>
            </div>
            {validationErrors.termsAccepted && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.termsAccepted}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestmentApplicationForm;

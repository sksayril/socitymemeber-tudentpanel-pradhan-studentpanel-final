import React, { useState, useEffect } from 'react';
import { 
  X, 
  CreditCard, 
  Banknote, 
  Loader2, 
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign
} from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  apiService, 
  PaymentOptionsResponse,
  PaymentOrderRequest,
  CashPaymentRequest,
  PendingEMI
} from '../../services/api';
import { razorpayService, RAZORPAY_CONFIG } from '../../utils/razorpay';

interface EMIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  emi: PendingEMI;
  onPaymentSuccess: () => void;
}

const EMIPaymentModal: React.FC<EMIPaymentModalProps> = ({
  isOpen,
  onClose,
  emi,
  onPaymentSuccess
}) => {
  const [paymentOptions, setPaymentOptions] = useState<PaymentOptionsResponse | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'online' | 'cash'>('online');
  const [selectedOnlineMethod, setSelectedOnlineMethod] = useState<string>('upi');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [cashRemarks, setCashRemarks] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'select' | 'processing' | 'success' | 'error'>('select');

  useEffect(() => {
    if (isOpen && emi) {
      fetchPaymentOptions();
    }
  }, [isOpen, emi]);

  const fetchPaymentOptions = async () => {
    try {
      setIsLoadingOptions(true);
      setError(null);
      
      const response = await apiService.getPaymentOptions(emi.emiId);
      if (response.data) {
        setPaymentOptions(response.data);
      }
    } catch (err) {
      console.error('Error fetching payment options:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch payment options');
      toast.error('Failed to fetch payment options');
    } finally {
      setIsLoadingOptions(false);
    }
  };

  const handleOnlinePayment = async () => {
    if (!paymentOptions) return;

    try {
      setIsLoading(true);
      setPaymentStep('processing');
      setError(null);

      const paymentData: PaymentOrderRequest = {
        investmentId: emi.investmentDetails.investmentId,
        emiNumber: emi.emiNumber,
        amount: emi.emiAmount + emi.penaltyAmount,
        paymentMethod: selectedOnlineMethod as any
      };

      const response = await apiService.generatePaymentOrder(paymentData);
      
      if (response.data) {
        toast.success('Payment order generated successfully!');
        
        // Open Razorpay payment modal
        await razorpayService.openPaymentModal({
          key: RAZORPAY_CONFIG.keyId,
          amount: razorpayService.formatAmount(response.data.amount),
          currency: RAZORPAY_CONFIG.currency,
          name: 'Society Investment EMI Payment',
          description: `EMI Payment for ${emi.investmentDetails.planName}`,
          order_id: response.data.paymentOrder.id,
          prefill: {
            name: emi.memberDetails.name,
            email: emi.memberDetails.email,
            contact: emi.memberDetails.phoneNumber,
          },
          notes: {
            investmentId: emi.investmentDetails.investmentId,
            memberId: emi.memberDetails.memberId,
            emiNumber: emi.emiNumber.toString(),
            paymentFor: 'EMI Payment',
          },
          theme: RAZORPAY_CONFIG.theme,
          handler: async (razorpayResponse: any) => {
            try {
              // Process payment callback
              const callbackData = {
                paymentId: response.data!.paymentId,
                transactionId: response.data!.transactionId,
                gatewayResponse: {
                  razorpay_order_id: razorpayResponse.razorpay_order_id,
                  razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                  razorpay_signature: razorpayResponse.razorpay_signature,
                  gatewayStatus: 'captured'
                }
              };

              await apiService.processPaymentCallback(callbackData);
              
              setPaymentStep('success');
              toast.success('Payment completed successfully!');
              
              setTimeout(() => {
                onPaymentSuccess();
                onClose();
              }, 2000);
            } catch (err) {
              console.error('Error processing payment callback:', err);
              setError('Payment verification failed');
              setPaymentStep('error');
              toast.error('Payment verification failed');
            }
          },
          modal: {
            ondismiss: () => {
              setPaymentStep('select');
              setIsLoading(false);
              toast.info('Payment cancelled');
            }
          }
        });
      }
    } catch (err) {
      console.error('Error processing online payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to process payment');
      setPaymentStep('error');
      toast.error('Failed to process payment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCashPayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const cashPaymentData: CashPaymentRequest = {
        investmentId: emi.investmentDetails.investmentId,
        emiNumber: emi.emiNumber,
        amount: emi.emiAmount + emi.penaltyAmount,
        remarks: cashRemarks
      };

      const response = await apiService.createCashPaymentRequest(cashPaymentData);
      
      if (response.data) {
        toast.success('Cash payment request created successfully!');
        onPaymentSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Error creating cash payment request:', err);
      setError(err instanceof Error ? err.message : 'Failed to create cash payment request');
      toast.error('Failed to create cash payment request');
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
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <CreditCard className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Pay EMI</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoadingOptions ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600">Loading payment options...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchPaymentOptions}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : paymentStep === 'success' ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600">Your EMI payment has been processed successfully.</p>
            </div>
          ) : paymentStep === 'error' ? (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Failed</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => setPaymentStep('select')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* EMI Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">EMI Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">EMI Number</p>
                      <p className="font-medium">{emi.emiNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Due Date</p>
                      <p className="font-medium">{formatDate(emi.dueDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">EMI Amount</p>
                      <p className="font-medium">{formatCurrency(emi.emiAmount)}</p>
                    </div>
                  </div>
                  {emi.penaltyAmount > 0 && (
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Penalty</p>
                        <p className="font-medium text-red-600">{formatCurrency(emi.penaltyAmount)}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-xl font-bold text-purple-600">
                      {formatCurrency(emi.emiAmount + emi.penaltyAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Online Payment */}
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedPaymentMethod === 'online'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod('online')}
                  >
                    <div className="flex items-center mb-2">
                      <CreditCard className="w-5 h-5 text-purple-600 mr-2" />
                      <span className="font-medium text-gray-900">Online Payment</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Pay instantly using UPI, cards, or net banking
                    </p>
                    {paymentOptions?.paymentOptions.online.available === false && (
                      <p className="text-sm text-red-600 mt-2">Currently unavailable</p>
                    )}
                  </div>

                  {/* Cash Payment */}
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedPaymentMethod === 'cash'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod('cash')}
                  >
                    <div className="flex items-center mb-2">
                      <Banknote className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-medium text-gray-900">Cash Payment</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Pay in cash at the office
                    </p>
                    {paymentOptions?.paymentOptions.cash.available === false && (
                      <p className="text-sm text-red-600 mt-2">Currently unavailable</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Online Payment Options */}
              {selectedPaymentMethod === 'online' && paymentOptions?.paymentOptions.online.available && (
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Payment Method</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {paymentOptions.paymentOptions.online.supportedMethods.map((method) => (
                      <button
                        key={method}
                        onClick={() => setSelectedOnlineMethod(method)}
                        className={`p-3 border rounded-lg text-center transition-colors ${
                          selectedOnlineMethod === method
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-sm font-medium capitalize">
                          {method.replace('_', ' ')}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cash Payment Remarks */}
              {selectedPaymentMethod === 'cash' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks (Optional)
                  </label>
                  <textarea
                    value={cashRemarks}
                    onChange={(e) => setCashRemarks(e.target.value)}
                    placeholder="Add any remarks about your cash payment..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={selectedPaymentMethod === 'online' ? handleOnlinePayment : handleCashPayment}
                  disabled={isLoading || (selectedPaymentMethod === 'online' && !paymentOptions?.paymentOptions.online.available) || (selectedPaymentMethod === 'cash' && !paymentOptions?.paymentOptions.cash.available)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {selectedPaymentMethod === 'online' ? (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay Online
                        </>
                      ) : (
                        <>
                          <Banknote className="w-4 h-4 mr-2" />
                          Request Cash Payment
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EMIPaymentModal;

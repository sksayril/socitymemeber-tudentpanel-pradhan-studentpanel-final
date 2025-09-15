import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService, KYCStatusResponse } from '../services/api';
import StudentKYCForm from '../components/forms/StudentKYCForm';
import SocietyMemberKYCForm from '../components/forms/SocietyMemberKYCForm';
import { ROUTES } from '../constants/routes';
import { toast } from 'react-toastify';

const KYCVerificationPage: React.FC = () => {
  const { user, userType, logout, refreshKYCStatus } = useAuth();
  const navigate = useNavigate();
  const [kycStatus, setKycStatus] = useState<KYCStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const fetchKYCStatus = async () => {
    try {
      setIsLoading(true);
      let response;
      
      if (userType === 'student') {
        // Try the new profile API first for students
        try {
          const profileResponse = await apiService.getStudentProfileDetails();
          if (profileResponse.data?.kyc) {
            // Convert new profile KYC format to old KYC status format
            const kycData = {
              kycStatus: profileResponse.data.kyc.status,
              kyc: {
                id: profileResponse.data.kyc.id,
                aadharNumber: profileResponse.data.kyc.documents.aadharNumber || '',
                status: profileResponse.data.kyc.status,
                submittedAt: profileResponse.data.kyc.submittedAt,
                reviewedAt: profileResponse.data.kyc.reviewedAt,
                rejectionReason: profileResponse.data.kyc.rejectionReason
              }
            };
            console.log('KYC Status from Profile API:', kycData);
            setKycStatus(kycData);
            setShowForm(kycData.kycStatus === 'not_submitted');
            return;
          }
        } catch (profileErr) {
          console.log('Profile API not available, falling back to KYC status API');
        }
        
        // Fallback to old KYC status API
        response = await apiService.getStudentKYCStatus();
      } else {
        response = await apiService.getSocietyMemberKYCStatus();
      }

      if (response.data) {
        console.log('KYC Status from API:', response.data);
        setKycStatus(response.data);
        setShowForm(response.data.kycStatus === 'not_submitted');
      }
    } catch (err) {
      console.error('Failed to fetch KYC status:', err);
      toast.error('Failed to load KYC status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKYCSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      let response;
      if (userType === 'student') {
        response = await apiService.submitStudentKYC(formData);
      } else {
        response = await apiService.submitSocietyMemberKYC(formData);
      }

      if (response.success) {
        toast.success('KYC submitted successfully! Verification is pending.');
        setShowForm(false);
        await fetchKYCStatus();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit KYC';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'pending':
        return <Clock className="w-8 h-8 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-8 h-8 text-red-600" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 border-green-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'rejected':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Verified';
      case 'pending':
        return 'Under Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Not Submitted';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading KYC status...</p>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-indigo-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">KYC Verification</h1>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
          {userType === 'student' ? (
            <StudentKYCForm
              onSubmit={handleKYCSubmit}
              onCancel={() => setShowForm(false)}
              isLoading={isSubmitting}
              error={error}
            />
          ) : (
            <SocietyMemberKYCForm
              onSubmit={handleKYCSubmit}
              onCancel={() => setShowForm(false)}
              isLoading={isSubmitting}
              error={error}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">KYC Verification</h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">KYC Status</h2>
            <p className="text-gray-600">Your identity verification status</p>
          </div>

          {kycStatus && (
            <div className={`rounded-2xl p-8 border-2 ${getStatusColor(kycStatus.kycStatus)}`}>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {getStatusIcon(kycStatus.kycStatus)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {getStatusText(kycStatus.kycStatus)}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Status: {kycStatus.kycStatus} | User Type: {userType}
                </p>
                
                {kycStatus.kyc && (
                  <div className="mt-6 space-y-4 text-left">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
                        <p className="text-gray-900 font-semibold">{kycStatus.kyc.aadharNumber}</p>
                      </div>
                      {kycStatus.kyc.panNumber && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">PAN Number</label>
                          <p className="text-gray-900 font-semibold">{kycStatus.kyc.panNumber}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Submitted On</label>
                      <p className="text-gray-900 font-semibold">
                        {new Date(kycStatus.kyc.submittedAt).toLocaleDateString()}
                      </p>
                    </div>

                    {kycStatus.kycStatus === 'rejected' && kycStatus.kyc.rejectionReason && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
                        <p className="text-red-600 font-semibold">{kycStatus.kyc.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-8 space-y-4">
                  {kycStatus.kycStatus === 'approved' && (
                    <button
                      onClick={async () => {
                        console.log('Continue to Dashboard clicked', {
                          userType,
                          dashboardRoute: userType === 'student' ? ROUTES.STUDENT.DASHBOARD : ROUTES.SOCIETY.DASHBOARD,
                          kycStatus: kycStatus.kycStatus
                        });
                        
                        // Refresh KYC status in AuthContext to ensure it's up to date
                        await refreshKYCStatus();
                        
                        // Navigate to dashboard
                        navigate(userType === 'student' ? ROUTES.STUDENT.DASHBOARD : ROUTES.SOCIETY.DASHBOARD);
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold"
                    >
                      Continue to Dashboard
                    </button>
                  )}
                  
                  {kycStatus.kycStatus === 'pending' && (
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">Your KYC is under review. Please wait for approval.</p>
                      <button
                        onClick={async () => {
                          await fetchKYCStatus();
                          await refreshKYCStatus();
                        }}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Refresh Status
                      </button>
                    </div>
                  )}
                  
                  {/* Manual refresh button for all statuses */}
                  <div className="text-center">
                    <button
                      onClick={async () => {
                        await fetchKYCStatus();
                        await refreshKYCStatus();
                        toast.success('KYC status refreshed');
                      }}
                      className="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors text-sm"
                    >
                      Refresh KYC Status
                    </button>
                  </div>
                  
                  {kycStatus.kycStatus === 'rejected' && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold"
                    >
                      Resubmit KYC
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYCVerificationPage;

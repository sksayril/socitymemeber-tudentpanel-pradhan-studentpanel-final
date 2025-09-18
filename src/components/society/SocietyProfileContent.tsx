import React, { useState, useEffect } from 'react';
import { 
  User, 
  Building2, 
  Shield, 
  CreditCard, 
  TrendingUp, 
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Edit,
  Download,
  Eye,
  Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  apiService, 
  ComprehensiveProfileData
} from '../../services/api';

const SocietyProfileContent: React.FC = () => {
  const [profileData, setProfileData] = useState<ComprehensiveProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch comprehensive profile data
        const response = await apiService.getComprehensiveProfile();
        if (response.data) {
          setProfileData(response.data);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load profile data';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Profile data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
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
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'disbursed':
      case 'successful':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'loan_application':
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'investment':
        return <TrendingUp className="w-5 h-5 text-purple-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center lg:text-left">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Profile</h2>
          <p className="text-gray-600">Loading profile information...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading profile data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center lg:text-left">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Profile</h2>
          <p className="text-gray-600">Error loading profile data</p>
        </div>
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Profile</h3>
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

  if (!profileData) {
    return (
      <div className="space-y-6">
        <div className="text-center lg:text-left">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Profile</h2>
          <p className="text-gray-600">No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Profile</h2>
        <p className="text-gray-600">Manage your personal information and account details</p>
      </div>

      {/* Profile Overview */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              {profileData.personalInfo?.profilePicture ? (
                <img
                  src={profileData.personalInfo.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
              <Edit className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {profileData.personalInfo?.firstName} {profileData.personalInfo?.lastName}
            </h3>
            <p className="text-gray-600 mb-2">
              {profileData.societyInfo?.societyName} - {profileData.societyInfo?.position}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Member ID: {profileData.personalInfo?.memberId} | Joined: {profileData.societyInfo?.joiningDate ? formatDate(profileData.societyInfo.joiningDate) : 'N/A'}
            </p>
            
            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(profileData.memberStatus?.overallStatus || 'pending')}`}>
                {profileData.memberStatus?.overallStatus || 'pending'}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(profileData.kycInfo?.kycStatus || 'pending')}`}>
                KYC: {profileData.kycInfo?.kycStatus || 'pending'}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${profileData.memberStatus?.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {profileData.memberStatus?.isVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </div>

          {/* Profile Completeness */}
          <div className="text-center">
            <div className="mb-2">
              <div className="text-2xl font-bold text-gray-900">
                {profileData.profileCompleteness?.percentage || 0}%
              </div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-300"
                style={{ width: `${profileData.profileCompleteness?.percentage || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <User className="w-6 h-6 text-purple-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <p className="text-gray-900">
                {profileData.personalInfo?.firstName} {profileData.personalInfo?.lastName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-gray-900">{profileData.personalInfo?.email}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-gray-900">{profileData.personalInfo?.phoneNumber}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <p className="text-gray-900">
                {profileData.personalInfo?.dateOfBirth ? formatDate(profileData.personalInfo.dateOfBirth) : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <p className="text-gray-900 capitalize">{profileData.personalInfo?.gender || 'N/A'}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-1" />
                <div>
                  <p className="text-gray-900">{profileData.personalInfo?.address}</p>
                  <p className="text-gray-600">
                    {profileData.personalInfo?.city}, {profileData.personalInfo?.state} - {profileData.personalInfo?.pincode}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
              <p className="text-gray-900">{profileData.personalInfo?.emergencyContact}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Phone</label>
              <p className="text-gray-900">{profileData.personalInfo?.emergencyPhone || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Society Information */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <Building2 className="w-6 h-6 text-purple-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Society Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Society Name</label>
              <p className="text-gray-900">{profileData.societyInfo?.societyName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Society Code</label>
              <p className="text-gray-900">{profileData.societyInfo?.societyCode}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <p className="text-gray-900">{profileData.societyInfo?.position}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Membership Type</label>
              <p className="text-gray-900 capitalize">{profileData.societyInfo?.membershipType}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
              <p className="text-gray-900">
                {profileData.societyInfo?.joiningDate ? formatDate(profileData.societyInfo.joiningDate) : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${profileData.societyInfo?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {profileData.societyInfo?.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${profileData.societyInfo?.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {profileData.societyInfo?.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KYC Information */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <Shield className="w-6 h-6 text-purple-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">KYC Information</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">KYC Status</label>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(profileData.kycInfo?.kycStatus || 'pending')}`}>
                {profileData.kycInfo?.kycStatus || 'pending'}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Submitted At</label>
              <p className="text-gray-900">
                {profileData.kycInfo?.submittedAt ? formatDate(profileData.kycInfo.submittedAt) : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verified At</label>
              <p className="text-gray-900">
                {profileData.kycInfo?.verifiedAt ? formatDate(profileData.kycInfo.verifiedAt) : 'Not verified'}
              </p>
            </div>
            {profileData.kycInfo?.remarks && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <p className="text-gray-900">{profileData.kycInfo.remarks}</p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Documents</label>
            {profileData.kycInfo?.kycDocuments && profileData.kycInfo.kycDocuments.length > 0 ? (
              <div className="space-y-2">
                {profileData.kycInfo.kycDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.documentName}</p>
                        <p className="text-sm text-gray-600 capitalize">{doc.documentType.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(doc.documentUrl, '_blank')}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => window.open(doc.documentUrl, '_blank')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No documents uploaded</p>
            )}
          </div>
        </div>
      </div>

      {/* Account Summary */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <CreditCard className="w-6 h-6 text-purple-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Account Summary</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Loans */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
              <h4 className="font-semibold text-blue-900">Loans</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Total Loans</span>
                <span className="font-semibold text-blue-900">{profileData.accountSummary?.loans?.totalLoans || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Total Amount</span>
                <span className="font-semibold text-blue-900">{formatCurrency(profileData.accountSummary?.loans?.totalLoanAmount || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Disbursed</span>
                <span className="font-semibold text-blue-900">{formatCurrency(profileData.accountSummary?.loans?.totalDisbursedAmount || 0)}</span>
              </div>
            </div>
          </div>

          {/* Investments */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <h4 className="font-semibold text-green-900">Investments</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-green-700">Total Investments</span>
                <span className="font-semibold text-green-900">{profileData.accountSummary?.investments?.totalInvestments || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-green-700">Invested Amount</span>
                <span className="font-semibold text-green-900">{formatCurrency(profileData.accountSummary?.investments?.totalInvestmentAmount || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-green-700">Expected Maturity</span>
                <span className="font-semibold text-green-900">{formatCurrency(profileData.accountSummary?.investments?.totalMaturityAmount || 0)}</span>
              </div>
            </div>
          </div>

          {/* EMIs */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Calendar className="w-5 h-5 text-yellow-600 mr-2" />
              <h4 className="font-semibold text-yellow-900">EMIs</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-yellow-700">Total EMIs</span>
                <span className="font-semibold text-yellow-900">{profileData.accountSummary?.emis?.totalEMIs || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-yellow-700">Paid</span>
                <span className="font-semibold text-green-600">{profileData.accountSummary?.emis?.paidEMIs || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-yellow-700">Pending</span>
                <span className="font-semibold text-yellow-600">{profileData.accountSummary?.emis?.pendingEMIs || 0}</span>
              </div>
            </div>
          </div>

          {/* Payments */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <DollarSign className="w-5 h-5 text-purple-600 mr-2" />
              <h4 className="font-semibold text-purple-900">Payments</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-purple-700">Total Payments</span>
                <span className="font-semibold text-purple-900">{profileData.accountSummary?.payments?.totalPayments || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-purple-700">Successful</span>
                <span className="font-semibold text-green-600">{profileData.accountSummary?.payments?.successfulPayments || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-purple-700">Success Rate</span>
                <span className="font-semibold text-purple-900">{profileData.accountSummary?.payments?.successRate || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {profileData.recentActivity && profileData.recentActivity.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <Clock className="w-6 h-6 text-purple-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {profileData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Ref: {activity.referenceId}</span>
                    <span>{formatDate(activity.date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Member Status */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <Shield className="w-6 h-6 text-purple-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Account Status</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Account Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(profileData.memberStatus?.overallStatus || 'pending')}`}>
                {profileData.memberStatus?.overallStatus || 'pending'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">KYC Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(profileData.memberStatus?.kycStatus || 'pending')}`}>
                {profileData.memberStatus?.kycStatus || 'pending'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Verification</span>
              <span className="flex items-center">
                {profileData.memberStatus?.isVerified ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Can Apply for Loan</span>
              <span className="flex items-center">
                {profileData.memberStatus?.canApplyForLoan ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Can Make Investments</span>
              <span className="flex items-center">
                {profileData.memberStatus?.canMakeInvestments ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Can Make Payments</span>
              <span className="flex items-center">
                {profileData.memberStatus?.canMakePayments ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </span>
            </div>
          </div>
        </div>
        {profileData.memberStatus?.statusMessage && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">{profileData.memberStatus.statusMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocietyProfileContent;
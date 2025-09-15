import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  GraduationCap, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Loader2,
  RefreshCw,
  Edit,
  Eye,
  EyeOff,
  Download,
  ExternalLink
} from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  apiService, 
  StudentProfileResponse,
  StudentProfile,
  KYCInfo,
  ProfileEnrollment,
  ProfileAttendanceSummary,
  ProfileFeeSummary,
  ProfileStatistics
} from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const ProfileContent: React.FC = () => {
  const { refreshKYCStatus } = useAuth();
  const [profileData, setProfileData] = useState<StudentProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'personal' | 'academic' | 'financial'>('overview');
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getStudentProfileDetails();
      console.log('Student Profile Response:', response);
      
      if (response.data) {
        setProfileData(response.data);
        // Also refresh KYC status in AuthContext to ensure it's up to date
        await refreshKYCStatus();
      } else {
        console.log('No profile data received');
        setProfileData(null);
      }
    } catch (err) {
      console.error('Profile Data Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile data');
      toast.error('Failed to fetch profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getKYCStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getKYCStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getEnrollmentStatusColor = (status: string) => {
    switch (status) {
      case 'enrolled':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverviewTab = () => {
    if (!profileData) return null;

    const { profile, kyc, statistics, attendance, fees } = profileData;

    return (
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-lg text-gray-600 mb-2">Student ID: {profile.studentId}</p>
              <p className="text-gray-600 mb-4">{profile.email}</p>
              
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getKYCStatusColor(kyc.status)}`}>
                  {getKYCStatusIcon(kyc.status)}
                  <span className="ml-2">KYC {kyc.status}</span>
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${profile.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {profile.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Enrollments</p>
                <p className="text-2xl font-bold text-blue-600">{statistics.totalEnrollments}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance</p>
                <p className="text-2xl font-bold text-green-600">{attendance?.summary?.attendanceRate || 0}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fees Paid</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(fees?.summary?.totalPaid || 0)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Fees</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(fees?.summary?.totalPending || 0)}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {(profileData?.enrollments || []).slice(0, 3).map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{enrollment?.course?.title || 'Unknown Course'}</p>
                    <p className="text-sm text-gray-600">{enrollment?.batch?.name || 'Unknown Batch'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEnrollmentStatusColor(enrollment.status)}`}>
                    {enrollment.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(enrollment.enrollmentDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPersonalTab = () => {
    if (!profileData) return null;

    const { profile, kyc } = profileData;

    return (
      <div className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            <button className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 transition-colors">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <p className="text-gray-900">{profile.firstName} {profile.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <p className="text-gray-900">{profile.studentId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  {profile.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <p className="text-gray-900 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  {profile.phoneNumber}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <p className="text-gray-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {formatDate(profile.dateOfBirth)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <p className="text-gray-900 capitalize">{profile.gender}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${profile.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {profile.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                <p className="text-gray-900">{formatDate(profile.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <p className="text-gray-900 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                {profile.address?.street || 'Not provided'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <p className="text-gray-900">{profile.address?.city || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <p className="text-gray-900">{profile.address?.state || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <p className="text-gray-900">{profile.address?.zipCode || 'Not provided'}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <p className="text-gray-900">{profile.address?.country || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <p className="text-gray-900">{profile.emergencyContact?.name || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
              <p className="text-gray-900">{profile.emergencyContact?.relationship || 'Not provided'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <p className="text-gray-900 flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                {profile.emergencyContact?.phoneNumber || 'Not provided'}
              </p>
            </div>
          </div>
        </div>

        {/* KYC Information */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">KYC Verification</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={refreshKYCStatus}
                className="flex items-center px-3 py-1 text-blue-600 hover:text-blue-700 transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </button>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getKYCStatusColor(kyc.status)}`}>
                {getKYCStatusIcon(kyc.status)}
                <span className="ml-2">{kyc.status}</span>
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Submitted At</label>
                <p className="text-gray-900">{formatDate(kyc.submittedAt)}</p>
              </div>
              {kyc.reviewedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reviewed At</label>
                  <p className="text-gray-900">{formatDate(kyc.reviewedAt)}</p>
                </div>
              )}
            </div>
            
            {kyc?.documents?.aadharNumber && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
                <p className="text-gray-900 font-mono">{kyc?.documents?.aadharNumber}</p>
              </div>
            )}
            
            {kyc?.documents?.aadharCard && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Card</label>
                <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Download Document
                </button>
              </div>
            )}
            
            {kyc.rejectionReason && (
              <div>
                <label className="block text-sm font-medium text-red-700 mb-1">Rejection Reason</label>
                <p className="text-red-600 bg-red-50 p-3 rounded-lg">{kyc.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sensitive Information */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Account Security</h3>
            <button
              onClick={() => setShowSensitiveData(!showSensitiveData)}
              className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              {showSensitiveData ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showSensitiveData ? 'Hide' : 'Show'} Details
            </button>
          </div>
          
          {showSensitiveData && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Password</label>
                <p className="text-gray-900 font-mono bg-gray-100 p-2 rounded">{profile.originalPassword}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Created</label>
                <p className="text-gray-900">{formatDate(profile.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                <p className="text-gray-900">{formatDate(profile.updatedAt)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAcademicTab = () => {
    if (!profileData) return null;

    const { enrollments, attendance } = profileData;

    return (
      <div className="space-y-6">
        {/* Attendance Summary */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h3>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{attendance?.summary?.totalDays || 0}</p>
              <p className="text-sm text-gray-600">Total Days</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{attendance?.summary?.present || 0}</p>
              <p className="text-sm text-gray-600">Present</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{attendance?.summary?.absent || 0}</p>
              <p className="text-sm text-gray-600">Absent</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{attendance?.summary?.late || 0}</p>
              <p className="text-sm text-gray-600">Late</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{attendance?.summary?.attendanceRate || 0}%</p>
              <p className="text-sm text-gray-600">Rate</p>
            </div>
          </div>
        </div>

        {/* Enrollments */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Enrollments</h3>
          {enrollments.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No enrollments found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">{enrollment?.course?.title || 'Unknown Course'}</h4>
                      <p className="text-sm text-gray-600 mb-2">{enrollment?.course?.description || 'No description available'}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {enrollment?.course?.category || 'Unknown'}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {enrollment?.course?.type || 'Unknown'}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {enrollment?.course?.duration || 0} weeks
                        </span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-bold text-gray-900 mb-1">
                        {formatCurrency(enrollment.paymentAmount, enrollment.currency)}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getEnrollmentStatusColor(enrollment.status)}`}>
                        {enrollment.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600"><strong>Batch:</strong> {enrollment?.batch?.name || 'Unknown Batch'}</p>
                      <p className="text-gray-600"><strong>Instructor:</strong> {enrollment?.course?.instructor?.name || 'Unknown Instructor'}</p>
                      <p className="text-gray-600"><strong>Enrolled:</strong> {formatDate(enrollment?.enrollmentDate || new Date())}</p>
                    </div>
                    <div>
                      <p className="text-gray-600"><strong>Start Date:</strong> {formatDate(enrollment?.batch?.startDate || new Date())}</p>
                      <p className="text-gray-600"><strong>End Date:</strong> {formatDate(enrollment?.batch?.endDate || new Date())}</p>
                      <p className="text-gray-600"><strong>Payment Status:</strong> 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(enrollment?.paymentStatus || 'unknown')}`}>
                          {enrollment?.paymentStatus || 'Unknown'}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  {enrollment.approvedBy && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <strong>Approved by:</strong> {enrollment?.approvedBy?.firstName || 'Unknown'} {enrollment?.approvedBy?.lastName || 'User'}
                        {enrollment?.approvedAt && ` on ${formatDate(enrollment.approvedAt)}`}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFinancialTab = () => {
    if (!profileData) return null;

    const { fees } = profileData;

    return (
      <div className="space-y-6">
        {/* Fee Summary */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(fees?.summary?.totalRequested || 0)}</p>
              <p className="text-sm text-gray-600">Total Requested</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{formatCurrency(fees?.summary?.totalPaid || 0)}</p>
              <p className="text-sm text-gray-600">Total Paid</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(fees?.summary?.totalPending || 0)}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </div>

        {/* Fee Requests */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Requests</h3>
          {(fees?.requests || []).length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No fee requests found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(fees?.requests || []).map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{request?.course?.title || 'Unknown Course'}</h4>
                      <p className="text-sm text-gray-600">{request?.batch?.name || 'Unknown Batch'}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-bold text-gray-900 mb-1">
                        {formatCurrency(request?.amount || 0, request?.currency || 'INR')}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(request?.status || 'unknown')}`}>
                        {request?.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><strong>Due Date:</strong> {formatDate(request?.dueDate || new Date())}</p>
                    <p><strong>Description:</strong> {request?.description || 'No description'}</p>
                    <p><strong>Created:</strong> {formatDate(request?.createdAt || new Date())}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
          {(fees?.payments || []).length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No payment history found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(fees?.payments || []).map((payment) => (
                <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{payment?.course?.title || 'Unknown Course'}</h4>
                      <p className="text-sm text-gray-600">{payment?.batch?.name || 'Unknown Batch'}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-bold text-gray-900 mb-1">
                        {formatCurrency(payment?.amount || 0, payment?.currency || 'INR')}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment?.status || 'unknown')}`}>
                        {payment?.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><strong>Payment Method:</strong> {payment?.paymentMethod || 'Unknown'}</p>
                    <p><strong>Payment Date:</strong> {formatDate(payment?.paymentDate || new Date())}</p>
                    {payment?.transactionId && <p><strong>Transaction ID:</strong> {payment.transactionId}</p>}
                    <p><strong>Created:</strong> {formatDate(payment?.createdAt || new Date())}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading profile data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile Data</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchProfileData}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Profile Data</h3>
        <p className="text-gray-600">Profile information is not available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Student Profile</h1>
            <p className="text-sm sm:text-base text-gray-600">View and manage your profile information</p>
          </div>
        </div>
        
        <button
          onClick={fetchProfileData}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        {/* Mobile Tab Navigation */}
        <div className="block sm:hidden">
          <div className="flex overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'personal', label: 'Personal', icon: Shield },
              { id: 'academic', label: 'Academic', icon: GraduationCap },
              { id: 'financial', label: 'Financial', icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-3 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
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
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'personal', label: 'Personal Information', icon: Shield },
              { id: 'academic', label: 'Academic Records', icon: GraduationCap },
              { id: 'financial', label: 'Financial Information', icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
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
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'personal' && renderPersonalTab()}
          {activeTab === 'academic' && renderAcademicTab()}
          {activeTab === 'financial' && renderFinancialTab()}
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
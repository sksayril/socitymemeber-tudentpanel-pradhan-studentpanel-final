import React, { useState, useEffect } from 'react';
import { Users, CreditCard, TrendingUp, AlertCircle, Calendar, Award } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { apiService, DashboardStats } from '../../services/api';

const SocietyDashboardContent: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch dashboard stats
        const dashboardResponse = await apiService.getSocietyMemberDashboard();
        if (dashboardResponse.data?.stats) {
          setStats(dashboardResponse.data.stats);
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center lg:text-left">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Society Dashboard</h2>
          <p className="text-gray-600">Loading society information...</p>
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
          <p className="text-gray-600">Manage loans, members, and society operations</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName}!
        </h2>
        <p className="text-gray-600">
          {user?.societyName} - {user?.position}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 lg:p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.eventsOrganized || 0}</p>
            <p className="text-sm text-gray-600">Events Organized</p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 lg:p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.membersManaged || 0}</p>
            <p className="text-sm text-gray-600">Members Managed</p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 lg:p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.upcomingEvents || 0}</p>
            <p className="text-sm text-gray-600">Upcoming Events</p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 lg:p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{user?.department || 'N/A'}</p>
            <p className="text-sm text-gray-600">Department</p>
          </div>
        </div>
      </div>

      {/* Society Information */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Society Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Society Name</label>
              <p className="text-gray-900 font-semibold">{user?.societyName || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Position</label>
              <p className="text-gray-900 font-semibold">{user?.position || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member ID</label>
              <p className="text-gray-900 font-semibold">{user?.memberId || 'N/A'}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <p className="text-gray-900 font-semibold">{user?.department || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                user?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verification</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                user?.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user?.isVerified ? 'Verified' : 'Pending Verification'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Manage Members</h3>
          <p className="text-sm text-gray-600">View and manage society members</p>
        </button>

        <button className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Organize Events</h3>
          <p className="text-sm text-gray-600">Create and manage society events</p>
        </button>

        <button className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Loan Management</h3>
          <p className="text-sm text-gray-600">Review and process loan applications</p>
        </button>
      </div>
    </div>
  );
};

export default SocietyDashboardContent;